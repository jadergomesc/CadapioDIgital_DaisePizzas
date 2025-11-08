// src/screens/AdminProductForm.js
import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../firebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, push, set, update, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

export default function AdminProductForm({ navigation, route }) {
  const productIdParam = route?.params?.productId || null;
  const productDataParam = route?.params?.productData || null;

  const [loadingInit, setLoadingInit] = useState(true); // carregamento inicial (fetching product / auth)
  const [saving, setSaving] = useState(false);

  const [productId, setProductId] = useState(productIdParam);
  const [productData, setProductData] = useState(productDataParam);

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null); // pode ser URL (https) ou local uri (file://)
  const [imagePath, setImagePath] = useState('');

  // Verifica autenticação e permissões (admin guard)
  useEffect(() => {
    let unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        Alert.alert('Autenticação', 'Faça login como admin para continuar.');
        navigation.reset({ index: 0, routes: [{ name: 'AdminLogin' }] });
        return;
      }

      try {
        const snap = await get(dbRef(db, `admins/${user.uid}`));
        if (!snap.exists()) {
          await auth.signOut();
          Alert.alert('Acesso negado', 'Conta não possui permissão administrativa.');
          navigation.reset({ index: 0, routes: [{ name: 'AdminLogin' }] });
          return;
        }

        // se productId existe mas productData não veio via params, faz fetch
        if (productId && !productData) {
          try {
            const pSnap = await get(dbRef(db, `produtos/${productId}`));
            if (pSnap.exists()) {
              const val = pSnap.val();
              setProductData({ ...val, id: productId });
              populateFieldsFromData(val);
            } else {
              Alert.alert('Erro', 'Produto não encontrado.');
              navigation.goBack();
            }
          } catch (err) {
            console.error('Erro buscando produto para edição:', err);
            Alert.alert('Erro', 'Falha ao carregar dados do produto.');
            navigation.goBack();
          } finally {
            setLoadingInit(false);
          }
        } else if (productData) {
          // preencher campos com productData passado por params
          populateFieldsFromData(productData);
          setLoadingInit(false);
        } else {
          // criação: nada pra buscar
          setLoadingInit(false);
        }
      } catch (err) {
        console.error('Erro checando admin em AdminProductForm:', err);
        Alert.alert('Erro', 'Falha ao verificar permissões.');
        navigation.reset({ index: 0, routes: [{ name: 'AdminLogin' }] });
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function populateFieldsFromData(data) {
    if (!data) return;
    setNome(data.nome ?? '');
    setPreco(data.preco !== undefined ? String(data.preco) : '');
    setDescricao(data.descricao ?? '');
    setImagem(data.imagem ?? null);
    setImagePath(data.imagePath ?? '');
  }

  // Escolher imagem com preview (expo-image-picker)
  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita acesso à galeria para selecionar imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = (result.assets && result.assets.length > 0) ? result.assets[0] : null;
    const uri = asset?.uri ?? result.uri ?? null;
    if (uri) setImagem(uri);
    else Alert.alert('Erro', 'Não foi possível obter a imagem selecionada.');
  };

  // salvar (create/update)
  const handleSave = async () => {
    if (!nome.trim() || !preco.toString().trim()) {
      Alert.alert('Atenção', 'Nome e preço são obrigatórios.');
      return;
    }

    const precoNum = parseFloat(preco.toString().replace(',', '.'));
    if (isNaN(precoNum) || precoNum <= 0) {
      Alert.alert('Atenção', 'Digite um preço válido.');
      return;
    }

    setSaving(true);

    try {
      let imagemUrl = imagePath && imagem && imagem === productData?.imagem ? productData.imagem : null;
      let newImagePath = imagePath || '';

      // Se imagem for local (file://) ou não for http, faz upload
      const needsUpload = imagem && (imagem.startsWith('file://') || imagem.startsWith('content://') || !imagem.startsWith('http'));
      if (needsUpload) {
        const resp = await fetch(imagem);
        const blob = await resp.blob();
        const nomeArquivo = `produtos/${uuidv4()}.jpg`;
        const stRef = storageRef(storage, nomeArquivo);
        await uploadBytes(stRef, blob);
        imagemUrl = await getDownloadURL(stRef);
        newImagePath = nomeArquivo;
      } else if (imagem && imagem.startsWith('http')) {
        imagemUrl = imagem;
      } else if (!imagemUrl && productData?.imagem) {
        imagemUrl = productData.imagem || '';
      }

      imagemUrl = imagemUrl || '';

      const payload = {
        nome: nome.trim(),
        preco: precoNum,
        descricao: descricao.trim(),
        imagem: imagemUrl,
        imagePath: newImagePath,
        atualizadoEm: Date.now()
      };

      if (productId) {
        // atualizar
        await update(dbRef(db, `produtos/${productId}`), payload);
        Alert.alert('Sucesso', 'Produto atualizado.');
      } else {
        // criar
        const produtosRef = dbRef(db, 'produtos');
        const novoRef = push(produtosRef);
        await set(novoRef, { ...payload, criadoEm: Date.now() });
        Alert.alert('Sucesso', 'Produto criado.');
      }

      navigation.goBack();
    } catch (err) {
      console.error('Erro salvar produto (AdminProductForm):', err);
      if (err && err.code === 'PERMISSION_DENIED') {
        Alert.alert('Permissão negada', 'Sua conta não tem permissão para gravar no banco.');
      } else {
        Alert.alert('Erro', 'Falha ao salvar o produto. Verifique o console.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loadingInit) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e53935" />
        <Text style={{ marginTop: 8 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{productId ? 'Editar Produto' : 'Cadastrar Produto'}</Text>

      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Preço" style={styles.input} value={preco} onChangeText={setPreco} keyboardType="numeric" />
      <TextInput placeholder="Descrição" style={[styles.input, { height: 120 }]} value={descricao} onChangeText={setDescricao} multiline />

      <TouchableOpacity style={styles.imagePicker} onPress={escolherImagem}>
        {imagem ? (
          <Image
            source={{ uri: encodeURI(imagem) }}
            style={styles.image}
            onError={(e) => console.warn('Erro carregando imagem (AdminProductForm):', e.nativeEvent)}
          />
        ) : (
          <Text style={styles.imageText}>Selecionar Imagem</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{productId ? 'Salvar Alterações' : 'Cadastrar Produto'}</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flexGrow: 1, padding: 16, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10 },
  imagePicker: { height: 180, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
  imageText: { color: '#777' },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  button: { backgroundColor: '#e53935', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
