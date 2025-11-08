import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
      navigation.navigate("CadastroProduto");
    } catch (error) {
      Alert.alert("Erro", "Email ou senha inválidos!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login da Lanchonete</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>Criar nova conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8, marginBottom: 10 },
  button: { backgroundColor: "#e53935", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { marginTop: 10, textAlign: "center", color: "#007bff" }
});
