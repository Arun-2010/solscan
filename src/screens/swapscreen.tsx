import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


export function SwapScreen() {
  const [fromAmount, setFromAmount] = useState("100");
  const [toAmount, setToAmount] = useState("0.28014");
  const [fromToken, setFromToken] = useState("USDC");
  const [toToken, setToToken] = useState("SOL");


    const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };



    const handleSwap = () => {
    if (!fromAmount) return Alert.alert("Enter an amount");
    Alert.alert(
      "Swap",
      `Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
    );
  };


    return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <Text style={s.title}>Swap Tokens</Text>


            <View style={[s.card, { marginBottom: 10 }]}>
        <View style={s.cardHeader}>
          <TouchableOpacity style={s.tokenSelector}>
            <View style={[s.tokenIcon, { backgroundColor: "#9945FF" }]}>
              <Text style={s.tokenIconText}>S</Text>
            </View>
            <Text style={s.tokenName}>{fromToken}</Text>
            <Ionicons name="chevron-down" size={18} color="#888" />
          </TouchableOpacity>
          <TextInput
            style={s.amountInput}
            value={fromAmount}
            onChangeText={setFromAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
          />
        </View>
        <View style={s.cardFooter}>
          <Text style={s.balanceText}>Balance: 0.0661 {fromToken}</Text>
          <Text style={s.usdText}>$499.749</Text>
        </View>
      </View>

      <View style={s.card}>
        <View style={s.cardHeader}>
          <TouchableOpacity style={s.tokenSelector}>
            <View style={[s.tokenIcon, { backgroundColor: "#14F195" }]}>
              <Text style={s.tokenIconText}>SOL</Text>
            </View>
            <Text style={s.tokenName}>{toToken}</Text>
            <Ionicons name="chevron-down" size={18} color="#888" />
          </TouchableOpacity>
          <TextInput
            style={s.amountInput}
            value={toAmount}
            onChangeText={setToAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
            editable={false}
          />
        </View>
        <View style={s.cardFooter}>
          <Text style={s.balanceText}>Balance: 0.28014 {toToken}</Text>
          <Text style={s.usdText}>$8499.88</Text>
        </View>
      </View>

      <View style={s.arrowContainer}>
        <TouchableOpacity style={s.swapArrow} onPress={swapTokens}>
          <Ionicons name="arrow-down" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={s.swapBtn} onPress={handleSwap}>
        <Text style={s.swapBtnText}>Swap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#0a0a1a",
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#0f0f23",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tokenIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  tokenIconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  tokenName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  amountInput: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1a1a2e",
  },
  balanceText: {
    color: "#888",
    fontSize: 12,
  },
  usdText: {
    color: "#14F195",
    fontSize: 12,
    fontWeight: "600",
  },
  arrowContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  swapArrow: {
    backgroundColor: "#14F195",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  swapBtn: {
    backgroundColor: "#14F195",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  swapBtnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});