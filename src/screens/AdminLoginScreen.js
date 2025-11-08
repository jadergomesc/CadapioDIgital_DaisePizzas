// src/screens/AdminLoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { ref, get } from 'firebase/database';

export default function AdminLoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = route?.params?.redirectTo || 'AdminDashboard';

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // verifica se UID está no nó /admins
      const adminSnap = await get(ref(db, `admins/${user.uid}`));
      if (adminSnap.exists()) {
        setLoading(false);
        // redireciona conforme solicitado (normalmente AdminDashboard)
        navigation.navigate('AdminDashboard');
      } else {
        await signOut(auth);
        setLoading(false);
        Alert.alert('Acesso negado', 'Esta conta não possui permissão de administrador.');
      }
    } catch (err) {
      setLoading(false);
      console.error('Erro login admin:', err);
      Alert.alert('Erro', 'Falha ao autenticar. Confira credenciais.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Administrativo</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: '#e53935', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
