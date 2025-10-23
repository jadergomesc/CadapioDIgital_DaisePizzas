import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/screens/Home';
import Lanchonetes from './src/screens/Lanchonetes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} // se quiser esconder o header padrão
        />
        <Stack.Screen 
          name="Lanchonetes" 
          component={Lanchonetes} 
          options={{ title: 'Lanchonetes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
