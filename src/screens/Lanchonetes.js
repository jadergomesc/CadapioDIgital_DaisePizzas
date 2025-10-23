import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function DaisePizzasScreen() {
  return (
    <View style={styles.container}>
      {/* Header da lanchonete */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.logo}
        />
        <Text style={styles.name}>Daise Pizzas</Text>
        <Text style={styles.info}>Rua das Flores, 123 - Jaguaripe, BA</Text>
        <Text style={styles.info}>(71) 99999-1111</Text>
      </View>

      {/* Conteúdo rolável */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Categoria: Pizzas */}
        <Text style={styles.category}>🍕 Pizzas</Text>
        <View style={styles.card}>
          <Text style={styles.itemName}>Pizza Margherita</Text>
          <Text style={styles.itemDescription}>
            Molho de tomate, mussarela e manjericão.
          </Text>
          <Text style={styles.itemPrice}>R$ 35,00</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.itemName}>Pizza Calabresa</Text>
          <Text style={styles.itemDescription}>
            Calabresa, cebola e mussarela.
          </Text>
          <Text style={styles.itemPrice}>R$ 38,00</Text>
        </View>

        {/* Categoria: Bebidas */}
        <Text style={styles.category}>🥤 Bebidas</Text>
        <View style={styles.card}>
          <Text style={styles.itemName}>Refrigerante 350ml</Text>
          <Text style={styles.itemPrice}>R$ 5,00</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.itemName}>Suco Natural 300ml</Text>
          <Text style={styles.itemPrice}>R$ 6,50</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },

  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ff0000ff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 3,
  },
  logo: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  info: { fontSize: 14, color: '#fff' },

  scrollContent: { padding: 20 },

  category: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  itemName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  itemDescription: { fontSize: 14, color: '#555', marginBottom: 5 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#111' },
});
