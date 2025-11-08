// screens/CadastroProduto.js
import 'react-native-get-random-values';
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from "../firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { push, ref as dbRef, set, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { onAuthStateChanged } from "firebase/auth";

export default function CadastroProduto({ navigation }) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemUri, setImagemUri] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // verifica se o usuário é admin
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCheckingAuth(false);
        navigation.replace('AdminLogin', { redirectTo: 'CadastroProduto' });
        return;
      }

      try {
        const snap = await get(dbRef(db, `admins/${user.uid}`));
        if (!snap.exists()) {
          Alert.alert("Acesso negado", "Você não tem permissão de administrador.");
          navigation.replace('AdminLogin', { redirectTo: 'CadastroProduto' });
          setCheckingAuth(false);
          return;
        }
        setCheckingAuth(false);
      } catch (err) {
        console.warn("Erro ao checar admin:", err);
        Alert.alert("Erro", "Falha ao verificar permissões.");
        setCheckingAuth(false);
      }
    });
    return () => unsub();
  }, [navigation]);

  // Escolher imagem (com recorte e preview garantido)
  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "Ative o acesso à galeria para continuar.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // tenta recorte
      aspect: [4, 3],      // força proporção
      quality: 0.8,
    });

    if (resultado.canceled) return;

    const asset = resultado.assets && resultado.assets.length > 0 ? resultado.assets[0] : null;
    if (asset?.uri) {
      setImagemUri(asset.uri);
    } else {
      Alert.alert("Erro", "Falha ao selecionar imagem.");
    }
  };

  const salvarProduto = async () => {
    if (!nome.trim() || !preco.trim() || !descricao.trim() || !imagemUri) {
      Alert.alert("Atenção", "Preencha todos os campos e escolha uma imagem!");
      return;
    }

    const precoNumero = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoNumero) || precoNumero <= 0) {
      Alert.alert("Atenção", "Digite um preço válido!");
      return;
    }

    setCarregando(true);

    try {
      // Faz upload da imagem e obtém a URL
      const response = await fetch(imagemUri);
      const blob = await response.blob();
      const nomeArquivo = `produtos/${uuidv4()}.jpg`;
      const sRef = storageRef(storage, nomeArquivo);

      await uploadBytes(sRef, blob);
      const urlImagem = await getDownloadURL(sRef);

      if (!urlImagem) {
        throw new Error("Falha ao obter URL da imagem do Firebase.");
      }

      // Salva no Realtime Database
      const produtosRef = dbRef(db, 'produtos');
      const novoProdutoRef = push(produtosRef);
      await set(novoProdutoRef, {
        nome: nome.trim(),
        preco: precoNumero,
        descricao: descricao.trim(),
        imagem: urlImagem,
        imagePath: nomeArquivo,
        criadoEm: Date.now()
      });

      Alert.alert("Sucesso", "Produto cadastrado com sucesso!");
      // limpa campos
      setNome("");
      setPreco("");
      setDescricao("");
      setImagemUri(null);

      // volta para lista
      navigation.reset({ index: 0, routes: [{ name: 'Lanchonetes' }] });
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      Alert.alert("Erro", `Falha ao salvar produto: ${error.message || error}`);
    } finally {
      setCarregando(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e53935" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Produto</Text>

      <TextInput
        placeholder="Nome do produto"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Preço"
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Descrição"
        style={[styles.input, { height: 100 }]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity style={styles.imagePicker} onPress={escolherImagem}>
        {imagemUri ? (
          <Image source={{ uri: imagemUri }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Selecionar Imagem</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, carregando && { opacity: 0.6 }]}
        onPress={salvarProduto}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar Produto</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: 'hidden'
  },
  imageText: { color: "#777" },
  image: { width: "100%", height: "100%" },
  button: {
    backgroundColor: "#e53935",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
