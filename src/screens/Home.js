import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function Home({ navigation }) {
  return (
    <><View style={styles.header}>
      <Image source={require('../../assets/DaisePizzas.png')} style={styles.logo} />

      <View style={{ alignItems: 'stretch', width: '100%' }}>
        <TouchableOpacity style={styles.button}
          onPress={() => navigation.navigate('Lanchonetes')}>
          <Text style={styles.linkLanchonetes}>Lanches</Text>

        </TouchableOpacity>
      </View>

    </View><ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

        <Text style={styles.slogan}>Tudo de gostoso em um só lugar!</Text>

        <Image source={require('../../assets/img_inicial.png')} style={styles.banner} />

        <View style={styles.card}>
          <Text style={styles.title}>📱 Como funciona nosso App?</Text>
          <Text style={styles.paragraph}>
            No nosso App bateu a fome você pode entrar e fazer seu pedido de forma rápida e prática.
            Click no botão "Lanches" para explorar nosso cardápio variado e escolher seus pratos favoritos.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>🚀 Principais Benefícios:</Text>
          <Text style={styles.list}>✅ Facilidade de Uso no App é intuitiva e rápida.</Text>
          <Text style={styles.list}>✅ Acesso Rápido ao nosso cardápio e seleção dos melhores lanches.</Text>
          <Text style={styles.list}>✅ Pedido é enviado direto para nosso WhatsApp com todos os detalhes.</Text>
        </View>

        <Text style={styles.footer}> Este projeto é de uso acadêmico / pessoal.
Todos os direitos reservados © CardápioOn 2025.</Text>
      </ScrollView></>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20, marginTop: 190 ,  },
  header: {position: 'absolute', zIndex: 100, width: '100%', marginTop:0, paddingBottom:5, alignItems: 'center', marginBottom: 20,  backgroundColor: 'hsla(0, 100%, 50%, 1.00)', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  logo: { width: 320, height: 110, 
    resizeMode: 'contain',  padding: 10, paddingBottom: 5, },

  link: {  color: '#e90e0eff',
  fontSize: 15,
  fontWeight: 'bold',
  fontStyle: 'italic',
  textDecorationLine: 'underline',
  marginTop: 10,
  textShadowColor: '#000000ff',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3
 },
 linkLanchonetes: {  color: '#fdfdfdff',
 fontSize: 18,
 fontWeight: 'bold',
 fontStyle: 'italic',
 marginTop: 10,
  textShadowColor: '#000000ff',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3,
  borderStyle: 'solid',
  textAlign: 'center',
  borderRadius: 10,
  backgroundColor: 'hsla(42, 90%, 50%, 1.00)',
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3
},
  slogan: { fontSize: 24, textAlign: 'center', color: '#333', marginVertical: 20 },
  banner: { width: '100%', height: 220, borderRadius: 10, resizeMode: 'contain', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#111' },
  paragraph: { fontSize: 16, color: '#555', lineHeight: 22, textAlign: 'justify' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#111' },
  list: { fontSize: 16, marginVertical: 4, color: '#444' },
  footer: { textAlign: 'center', marginTop: 30, fontWeight: 'bold', color: '#777' },
      button: { padding: 15, borderRadius: 10, width:'50%', },
  buttonText: { color: '#fff', fontWeight: 'bold' },

});
