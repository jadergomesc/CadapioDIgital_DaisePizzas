// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CarrinhoProvider } from './src/context/CarrinhoContext';


// telas principais (todos via ./screens)
import Home from './src/screens/Home';
import Lanchonetes from './src/screens/Lanchonetes';
import Carrinho from './src/screens/CarrinhoScreen';
import Checkout from './src/screens/CheckoutScreen';
import Login from './src/screens/LoginScreen';
import Cadastro from './src/screens/CadastroScreen';
import CadastroProduto from './src/screens/CadastroProduto'; // padronizado para ./screens

// telas administrativas (./screens)
import AdminLogin from './src/screens/AdminLoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import AdminProductForm from './src/screens/AdminProductForm';




const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CarrinhoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
          {/* Rotas do app */}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Lanchonetes" component={Lanchonetes} />
          <Stack.Screen name="Carrinho" component={Carrinho} />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="CadastroProduto" component={CadastroProduto} />

          {/* Rotas administrativas */}
          <Stack.Screen name="AdminLogin" component={AdminLogin} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="AdminProductForm" component={AdminProductForm} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </CarrinhoProvider>
  );
}
