import React from 'react';
import {NavigationContainer,DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'expo-status-bar';
import Inicio from './screens/Inicio.js';
import Diario from './screens/Diario.js';
import NovoRegistro from './screens/NovoRegistro.js';
import Sobre from './screens/Sobre.js';
const Stack=createNativeStackNavigator();
export default function App(){return <NavigationContainer theme={DarkTheme}><StatusBar style="light"/><Stack.Navigator id="principal" screenOptions={{headerStyle:{backgroundColor:'#082923'},headerTintColor:'#f2f7f4',contentStyle:{backgroundColor:'#051f1a'}}}><Stack.Screen name="Inicio" component={Inicio} options={{title:'MoodAlert'}}/><Stack.Screen name="Diario" component={Diario} options={{title:'Meu diário'}}/><Stack.Screen name="NovoRegistro" component={NovoRegistro} options={{title:'Registrar meu dia'}}/><Stack.Screen name="Sobre" component={Sobre} options={{title:'Sobre o projeto'}}/></Stack.Navigator></NavigationContainer>;}

