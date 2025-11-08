import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { CarrinhoContext } from '../context/CarrinhoContext';

export default function CheckoutScreen({ navigation }) {
  const { cart, totalValue, clearCart } = useContext(CarrinhoContext);
  const [nome, setNome] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [endereco, setEndereco] = useState('');
  const [pagamento, setPagamento] = useState('Dinheiro'); // exemplo: Dinheiro / Cartão

  // Número da pizzaria (coloque o número real no formato sem espaços, com código do país se necessário)
  const DAIZE_PHONE = '5575999542620'; // exemplo: +55 91 99999-1111 -> 5591999991111

  const buildMessage = () => {
    const itens = Object.keys(cart).map(name => {
      const { qty, price } = cart[name];
      return `${qty} x ${name} (R$ ${price.toFixed(2)})`;
    }).join('\n');

    return `Olá Daise Pizzas,\n\nTenho um pedido:\n${itens}\n\nTotal: R$ ${totalValue.toFixed(2)}\n\nCliente: ${nome}\nTelefone: ${telefoneCliente}\nEndereço: ${endereco}\nPagamento: ${pagamento}\n\nPor favor confirmar o pedido.`;
  };

  const sendWhatsApp = async () => {
    if (!nome || !telefoneCliente || !endereco) {
      Alert.alert('Faltando dados', 'Preencha nome, telefone e endereço antes de finalizar.');
      return;
    }

    const message = encodeURIComponent(buildMessage());
    const url = `https://wa.me/${DAIZE_PHONE}?text=${message}`; // abre WhatsApp Web / App

    // tenta abrir
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert('WhatsApp', 'Não foi possível abrir o WhatsApp no dispositivo.');
        return;
      }
      await Linking.openURL(url);

      // Após abrir o WhatsApp: navegar para tela de confirmação local e limpar carrinho
      clearCart();
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); // vai para Home (opcional)
      Alert.alert('Pedido enviado', 'Seu pedido foi aberto no WhatsApp. Aguarde confirmação da Daise.');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar abrir o WhatsApp.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finalizar Pedido</Text>

      <TextInput placeholder="Seu nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Telefone" value={telefoneCliente} onChangeText={setTelefoneCliente} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Endereço para entrega" value={endereco} onChangeText={setEndereco} style={styles.input} />
      <TextInput placeholder="Pagamento (ex: Dinheiro / Cartão)" value={pagamento} onChangeText={setPagamento} style={styles.input} />

      <Text style={styles.total}>Total: R$ {totalValue.toFixed(2)}</Text>

      <TouchableOpacity style={styles.sendBtn} onPress={sendWhatsApp}>
        <Text style={styles.sendText}>Enviar pelo WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 10 },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  sendBtn: { marginTop: 16, backgroundColor: '#25D366', padding: 14, borderRadius: 8, alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
