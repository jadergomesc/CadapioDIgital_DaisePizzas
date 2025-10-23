import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function Home({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <Image source={require('../../assets/cardapio_on.png')} style={styles.logo} />
       
        <View style={{ alignItems: 'flex-end', width: '100%' }}>
          <TouchableOpacity >

            <Text style={styles.link}>Cadastre seu negócio!</Text>

          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'stretch', width: '100%' }}>
          <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate('Lanchonetes')}>
            <Text style={styles.linkLanchonetes}>Lanchonetes</Text>
            
          </TouchableOpacity>
        </View>
        
      </View>

      <Text style={styles.slogan}>Tudo de gostoso em um só lugar!</Text>

      <Image source={require('../../assets/img_inicial.png')} style={styles.banner} />

      <View style={styles.card}>
        <Text style={styles.title}>📱 Como funciona o CardápioON?</Text>
        <Text style={styles.paragraph}>
          O CardápioON é uma plataforma digital desenvolvida para pequenos negócios, facilitando a divulgação e venda de produtos online.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>🚀 Principais Benefícios:</Text>
        <Text style={styles.list}>✅ Facilidade de Uso – Cadastre seus produtos rapidamente.</Text>
        <Text style={styles.list}>✅ Acesso Rápido – Seus clientes visualizam o cardápio instantaneamente.</Text>
        <Text style={styles.list}>✅ Economia – Reduza gastos com impressão de cardápios.</Text>
      </View>

      <Text style={styles.footer}>© 2025 - JaySoftware House</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20,  backgroundColor: 'hsla(0, 100%, 50%, 1.00)', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  logo: { width: 220, height: 70, resizeMode: 'contain' },

  link: {  color: '#ffcc00ff',
  fontSize: 15,
  fontWeight: 'bold',
  fontStyle: 'italic',
  textDecorationLine: 'underline',
  marginTop: 10,
  textShadowColor: '#000000ff',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3
 },
 linkLanchonetes: {  color: '#ffcc00ff',
 fontSize: 18,
 fontWeight: 'bold',
 fontStyle: 'italic',
 marginTop: 10,
  textShadowColor: '#000000ff',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3
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
