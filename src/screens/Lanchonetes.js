import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Button
} from 'react-native';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { db } from '../firebaseConfig';
import { ref, onValue, get as dbGet } from 'firebase/database';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function Lanchonetes({ navigation }) {
  const { addItem, removeItem, cart, totalItems, totalValue } = useContext(CarrinhoContext);

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // estado de usuário atual (apenas para controlar a ação do botão "Cadastrar Produto")
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  useEffect(() => {
    const produtosRef = ref(db, 'produtos');

    // Escuta o Realtime Database em tempo real
    const unsubscribe = onValue(produtosRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setProdutos(lista);
      } else {
        setProdutos([]);
      }
      setCarregando(false);
    }, (err) => {
      console.error('Erro no onValue produtos:', err);
      setProdutos([]);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  // escuta auth para saber se existe um usuário logado
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, []);

  const getQty = (name) => (cart[name] ? cart[name].qty : 0);

  // checa se uid está em /admins (usa get do SDK)
  const isUserAdmin = async (uid) => {
    if (!uid) return false;
    try {
      const snap = await dbGet(ref(db, `admins/${uid}`));
      return snap.exists();
    } catch (err) {
      console.warn('Erro checando admin:', err);
      return false;
    }
  };

  // Função chamada ao clicar em "Cadastrar Produto" — mantém UI igual
  const handleCadastrar = async () => {
    if (checkingAdmin) return; // evita cliques múltiplos
    setCheckingAdmin(true);
    try {
      if (!currentUser) {
        // não autenticado: navega para AdminLogin e pede redirect
        navigation.navigate('AdminLogin', { redirectTo: 'CadastroProduto' });
        return;
      }

      // se já autenticado, verifica flag admin no DB
      const admin = await isUserAdmin(currentUser.uid);
      if (!admin) {
        Alert.alert('Acesso negado', 'Seu usuário não tem permissão de administrador.');
        return;
      }

      // é admin: navega para a tela de cadastro
      navigation.navigate('CadastroProduto');
    } finally {
      setCheckingAdmin(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e53935" />
      </View>
    );
  }
      // coloque isso perto do topo do componente Lanchonetes (entre as funções/hooks)
const goToAdminLogin = () => {
  // tenta primeiro navegar no parent (resolve caso Lanchonetes esteja em navigator filho)
  const parent = navigation.getParent?.();
      if (parent && typeof parent.navigate === 'function') {
        parent.navigate('AdminLogin', { redirectTo: 'CadastroProduto' });
  } else {
        navigation.navigate('AdminLogin', { redirectTo: 'CadastroProduto' });
  }
};

  return (
    <View style={styles.container}>

  <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AdminLogin', { redirectTo: 'AdminDashboard' })}>
  <Text style={styles.addButtonText}>Cadastrar Produto</Text>
  </TouchableOpacity>



      <View style={styles.header}>
        <Image source={require('../../assets/pizza.png')} style={styles.logo} />
        <Text style={styles.name}>Daise Pizzas</Text>
        <Text style={styles.info}>R. Deodoro da Fonseca, 226 - Jaguaripe, BA</Text>
        <Text style={styles.info}>(75) 99954-2620</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.category}>🍕 Cardápio</Text>

        {produtos.map(p => (
          <View key={p.id} style={styles.card}>
            {p.imagem ? (
              <Image source={{ uri: p.imagem }} style={styles.prodImage} />
            ) : (
              <View style={[styles.prodImage, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ color: '#999' }}>Sem imagem</Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{p.nome}</Text>
              {p.descricao && <Text style={styles.itemDescription}>{p.descricao}</Text>}
              <Text style={styles.itemPrice}>R$ {(p.preco ?? 0).toFixed(2)}</Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity style={styles.ctrlBtn} onPress={() => removeItem(p.nome)}>
                <Text style={styles.ctrlTxt}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{getQty(p.nome)}</Text>
              <TouchableOpacity style={styles.ctrlBtn} onPress={() => addItem(p.nome, p.preco)}>
                <Text style={styles.ctrlTxt}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>

      {totalItems > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Carrinho')}
        >
          <Text style={styles.cartButtonText}>🛒 Ver Carrinho ({totalItems}) • R$ {totalValue.toFixed(2)}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { padding: 16, paddingBottom: 120 },
  header: { marginTop: 1, alignItems: 'center', padding: 10, backgroundColor: '#ff0000', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  logo: { width: 96, height: 96, borderRadius: 48, marginBottom: 8 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  info: { color: '#fff' },
  category: { fontSize: 20, marginTop: 12, marginBottom: 8 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  prodImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDescription: { color: '#555' },
  itemPrice: { marginTop: 6, fontWeight: 'bold' },
  controls: { alignItems: 'center' },
  ctrlBtn: { backgroundColor: '#ff0000', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
  ctrlTxt: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  qty: { fontSize: 16, fontWeight: 'bold' },
  cartButton: { margin: 40, position: 'absolute', left: 12, right: 12, bottom: 3, backgroundColor: '#ff0303', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  cartButtonText: { color: '#fff', fontWeight: 'bold' },
  addButton: { backgroundColor: '#91929eff', padding: 6, borderRadius: 8, alignItems: 'center', marginTop: 1, marginHorizontal: 16, marginBottom: 4 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
