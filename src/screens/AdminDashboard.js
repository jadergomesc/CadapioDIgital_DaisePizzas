// src/screens/AdminDashboard.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { auth, db, storage } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref as dbRef, onValue, remove, get } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

const PLACEHOLDER = 'https://via.placeholder.com/300x200.png?text=Sem+imagem';

export default function AdminDashboard({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const produtosUnsubRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigation.reset({ index: 0, routes: [{ name: 'AdminLogin' }] });
        return;
      }

      try {
        const adminSnap = await get(dbRef(db, `admins/${user.uid}`));
        if (!adminSnap.exists()) {
          await signOut(auth);
          Alert.alert('Acesso negado', 'Conta não possui permissão administrativa.');
          navigation.reset({ index: 0, routes: [{ name: 'AdminLogin' }] });
          return;
        }

        setCheckingAdmin(false);
        subscribeProdutos();
      } catch (err) {
        console.error('Erro verificando admin:', err);
        Alert.alert('Erro', 'Não foi possível verificar permissões.');
        setCheckingAdmin(false);
      }
    });

    return () => {
      unsubAuth();
      if (produtosUnsubRef.current) produtosUnsubRef.current();
    };
  }, []);

  const normalizeImageField = async (rawImagem) => {
    // rawImagem pode ser:
    // - URL completa (https://firebasestorage.googleapis.com/...)
    // - caminho no storage (produtos/uuid.jpg)
    // - null/undefined
    if (!rawImagem || typeof rawImagem !== 'string') return PLACEHOLDER;

    // Se for URL completa: tentar detectar dupla codificação e corrigir
    if (rawImagem.startsWith('http')) {
      // Detecta padrão %252F (dupla codificação de '/')
      if (rawImagem.includes('%252F')) {
        try {
          const decodedOnce = decodeURIComponent(rawImagem);
          return decodedOnce;
        } catch (err) {
          // se falhar no decode, apenas retorna a original (ou placeholder)
          console.warn('Falha ao decodificar URL dupla:', rawImagem, err);
          return rawImagem;
        }
      }
      // já é URL válida
      return rawImagem;
    }

    // Se não começar com http, assume que é um path no Storage (ex: 'produtos/uuid.jpg')
    try {
      const sRef = storageRef(storage, rawImagem);
      const url = await getDownloadURL(sRef);
      return url;
    } catch (err) {
      console.warn('Não foi possível obter download URL para', rawImagem, err);
      return PLACEHOLDER;
    }
  };

  const subscribeProdutos = () => {
    setLoading(true);
    const produtosRef = dbRef(db, 'produtos');

    produtosUnsubRef.current = onValue(produtosRef, async (snapshot) => {
      const data = snapshot.val();
      console.log('🔥 Produtos brutos:', data);

      if (!data || typeof data !== 'object') {
        setProdutos([]);
        setLoading(false);
        return;
      }

      // transforma objeto em array e resolve imagens assincronamente
      const entries = Object.entries(data)
        .filter(([key, val]) => {
          if (!val || typeof val !== 'object') {
            console.warn('Produto inválido no DB (ignorado):', key, val);
            return false;
          }
          if (!('nome' in val) && !('preco' in val) && !('imagem' in val)) {
            console.warn('Produto sem campos esperados (ignorado):', key, val);
            return false;
          }
          return true;
        });

      const resolved = await Promise.all(entries.map(async ([key, val]) => {
        let imagemFinal = PLACEHOLDER;
        try {
          imagemFinal = await normalizeImageField(val.imagem);
        } catch (err) {
          console.warn('Erro ao normalizar imagem do produto', key, err);
          imagemFinal = PLACEHOLDER;
        }

        return {
          id: key,
          nome: val.nome || 'Sem nome',
          preco: Number(val.preco) || 0,
          descricao: val.descricao || '',
          imagem: imagemFinal,
          raw: val
        };
      }));

      // Ordena por criadoEm se existir (fallback 0)
      resolved.sort((a, b) => (b.raw?.criadoEm || 0) - (a.raw?.criadoEm || 0));

      setProdutos(resolved);
      setLoading(false);
    }, err => {
      console.error('Erro ao ler produtos:', err);
      setLoading(false);
    });
  };

  const handleDelete = (id, nome) => {
    if (!id) {
      Alert.alert('Erro', 'Produto inválido.');
      return;
    }
    Alert.alert(
      'Confirmar exclusão',
      `Deseja apagar "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await remove(dbRef(db, `produtos/${id}`));
              Alert.alert('Sucesso', 'Produto excluído.');
            } catch (err) {
              console.error('Erro excluir produto:', err);
              Alert.alert('Erro', 'Não foi possível excluir o produto.');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (item) => {
    if (!item || !item.id) {
      Alert.alert('Erro', 'Item inválido para edição.');
      return;
    }
    const productData = item.raw ? { ...item.raw, id: item.id } : { ...item, id: item.id };
    navigation.navigate('AdminProductForm', { productId: item.id, productData });
  };

  if (checkingAdmin) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e53935" />
        <Text style={{ marginTop: 8 }}>Verificando permissões...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AdminProductForm')}>
        <Text style={styles.addText}>+ Cadastrar Produto</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#e53935" />
        </View>
      ) : produtos.length === 0 ? (
        <View style={styles.center}>
          <Text>Nenhum produto cadastrado.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {produtos.map((item, idx) => {
            if (!item || !item.id) {
              console.warn('Aviso: produto inválido filtrado no index', idx, item);
              return null;
            }

            const imageUri = item.imagem && typeof item.imagem === 'string' ? item.imagem : PLACEHOLDER;

            return (
              <View key={item.id ?? `prod-${idx}`} style={styles.card}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="contain"
                  onError={(e) => console.warn('Erro carregando imagem (AdminDashboard):', item.id, e.nativeEvent)}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.name}>{item.nome}</Text>
                  {item.descricao ? <Text style={styles.desc} numberOfLines={2}>{item.descricao}</Text> : null}
                  <Text style={styles.price}>R$ {Number(item.preco || 0).toFixed(2)}</Text>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.nome)}>
                    <Text style={styles.btnText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addBtn: { backgroundColor: '#e53935', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  addText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: '#fafafa', padding: 10, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  image: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff' },
  name: { fontWeight: 'bold', fontSize: 16 },
  desc: { color: '#555' },
  price: { marginTop: 6, fontWeight: 'bold' },
  actions: { marginLeft: 10, justifyContent: 'space-between', height: 80 },
  editBtn: { backgroundColor: '#1976d2', padding: 8, borderRadius: 6, marginBottom: 6 },
  deleteBtn: { backgroundColor: '#d32f2f', padding: 8, borderRadius: 6 },
  btnText: { color: '#fff' },
});
