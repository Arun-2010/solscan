import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
	SafeAreaView,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	StyleSheet,
	Alert,
	Linking,
} from "react-native";

const RPC = "https://api.mainnet-beta.solana.com";

const rpc = async (method: string, params: any[]) => {
	const res = await fetch(RPC, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
	});

	const json = await res.json();
	if (json.error) throw new Error(json.error.message);
	return json.result;
};

const getBalance = async (addr: string) => {
	const result = await rpc("getBalance", [addr]);
	return result.value / 1_000_000_000;
};

const getTokens = async (addr: string) => {
	const result = await rpc("getTokenAccountsByOwner", [
		addr,
		{ programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
		{ encoding: "jsonParsed" },
	]);

	return (result.value || [])
		.map((a: any) => ({
			mint: a.account.data.parsed.info.mint,
			amount: a.account.data.parsed.info.tokenAmount.uiAmount,
		}))
		.filter((t: any) => t.amount > 0);
};

const getTxns = async (addr: string) => {
	const sigs = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);
	return sigs.map((s: any) => ({
		sig: s.signature,
		time: s.blockTime,
		ok: !s.err,
	}));
};

export default function WalletTab() {
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);
	const [balance, setBalance] = useState<number | null>(null);
	const [tokens, setTokens] = useState<any[]>([]);
	const [txns, setTxns] = useState<any[]>([]);

	const loadWallet = async () => {
		if (!address || address.length < 32) {
			Alert.alert("Invalid Address", "Enter valid Solana address");
			return;
		}

		try {
			setLoading(true);

			const [bal, toks, tx] = await Promise.all([
				getBalance(address),
				getTokens(address),
				getTxns(address),
			]);

			setBalance(bal);
			setTokens(toks);
			setTxns(tx);
		} catch (e: any) {
			Alert.alert("Error", e.message);
		} finally {
			setLoading(false);
		}
	};

	const openTxn = (sig: string) => {
		Linking.openURL(`https://solscan.io/tx/${sig}`);
	};

	return (
		<SafeAreaView style={s.safe}>
			<StatusBar style="light" />

			<ScrollView style={s.scroll}>

				<Text style={s.title}>Solana Wallet Viewer</Text>

				<TextInput
					style={s.input}
					placeholder="Enter Wallet Address"
					placeholderTextColor="#777"
					value={address}
					onChangeText={setAddress}
				/>

				<TouchableOpacity style={s.btn} onPress={loadWallet}>
					<Text style={s.btnText}>Fetch Wallet</Text>
				</TouchableOpacity>

				{loading && (
					<ActivityIndicator
						size="large"
						color="#14F195"
						style={{ marginTop: 20 }}
					/>
				)}

				{balance !== null && (
					<View style={s.card}>
						<Text style={s.cardTitle}>SOL Balance</Text>
						<Text style={s.balance}>{balance.toFixed(4)} SOL</Text>
					</View>
				)}

				{tokens.length > 0 && (
					<View style={s.section}>
						<Text style={s.sectionTitle}>Tokens</Text>

						{tokens.map((t, i) => (
							<View key={i} style={s.row}>
								<Text style={s.tokenMint} numberOfLines={1}>
									{t.mint}
								</Text>
								<Text style={s.tokenAmt}>{t.amount}</Text>
							</View>
						))}
					</View>
				)}

				{txns.length > 0 && (
					<View style={s.section}>
						<Text style={s.sectionTitle}>Recent Transactions</Text>

						{txns.map((tx, i) => (
							<TouchableOpacity
								key={i}
								style={s.row}
								onPress={() => openTxn(tx.sig)}
							>
								<Text style={s.txSig} numberOfLines={1}>
									{tx.sig}
								</Text>
								<Text style={{ color: tx.ok ? "#14F195" : "red" }}>
									{tx.ok ? "OK" : "FAIL"}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				)}

			</ScrollView>
		</SafeAreaView>
	);
}

const s = StyleSheet.create({
	safe: { flex: 1, backgroundColor: "#0a0a1a" },
	scroll: { padding: 16, paddingTop: 60 },

	title: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
	},

	input: {
		backgroundColor: "#0f0f23",
		padding: 14,
		borderRadius: 12,
		color: "#fff",
		marginBottom: 12,
	},

	btn: {
		backgroundColor: "#14F195",
		padding: 14,
		borderRadius: 12,
		alignItems: "center",
		marginBottom: 16,
	},

	btnText: {
		color: "#000",
		fontWeight: "bold",
	},

	card: {
		backgroundColor: "#0f0f23",
		padding: 16,
		borderRadius: 12,
		marginBottom: 16,
	},

	cardTitle: {
		color: "#aaa",
		marginBottom: 6,
	},

	balance: {
		color: "#14F195",
		fontSize: 22,
		fontWeight: "bold",
	},

	section: {
		marginBottom: 18,
	},

	sectionTitle: {
		color: "#fff",
		fontSize: 18,
		marginBottom: 10,
		fontWeight: "600",
	},

	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#0f0f23",
		padding: 14,
		borderRadius: 10,
		marginBottom: 8,
	},

	tokenMint: {
		color: "#aaa",
		width: "70%",
	},

	tokenAmt: {
		color: "#fff",
		fontWeight: "600",
	},

	txSig: {
		color: "#aaa",
		width: "75%",
	},
});
