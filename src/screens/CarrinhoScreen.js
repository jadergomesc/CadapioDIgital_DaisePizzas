import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { CarrinhoContext } from '../context/CarrinhoContext';

export default function CarrinhoScreen({ navigation }) {
  const { cart, addItem, removeItem, setItemQuantity, clearCart, totalValue } = useContext(CarrinhoContext);

  const items = Object.keys(cart).map(name => ({ name, ...cart[name] }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Seu Carrinho</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>Seu carrinho está vazio.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.name}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>R$ {item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.controls}>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => removeItem(item.name)}>
                  <Text style={styles.ctrlTxt}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.qty}</Text>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => addItem(item.name, item.price)}>
                  <Text style={styles.ctrlTxt}>＋</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.total}>Total: R$ {totalValue.toFixed(2)}</Text>
       
        {items.length > 0 && (
          <TouchableOpacity
            style={styles.checkout}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={styles.checkoutText}>Finalizar Pedido</Text>
          </TouchableOpacity>
        )}

        {/*<TouchableOpacity style={styles.checkout} onPress={() => navigation.navigate('Checkout')}>
          <Text style={styles.checkoutText}>Finalizar Pedido</Text>
        </TouchableOpacity>*/}

                <TouchableOpacity style={styles.clear} onPress={() => clearCart()}>
          <Text style={{ color: '#fff' }}>Limpar Carrinho</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', bottom: 50 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  empty: { color: '#666', textAlign: 'center', marginTop: 40 },
  row: { flexDirection: 'row', padding: 12, borderRadius: 8, backgroundColor: '#f8f8f8', marginBottom: 8, alignItems: 'center' },
  name: { fontWeight: 'bold' },
  controls: { alignItems: 'center' },
  ctrlBtn: { backgroundColor: '#ff0000ff', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  ctrlTxt: { color: '#fff', fontSize: 18 },
  qty: { marginVertical: 6, fontWeight: 'bold' },
  footer: { marginTop: 12, alignItems: 'center' },
  total: { fontSize: 18, fontWeight: 'bold' },
  checkout: { backgroundColor: '#28a745', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, marginTop: 12 },
  checkoutText: { color: '#fff', fontWeight: 'bold' },
  clear: { marginTop: 10, backgroundColor: '#dc3545', padding: 10, borderRadius: 8 },
});
