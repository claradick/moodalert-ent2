
import express from 'express';
import cors from 'cors';

import { registros } from './routes/registros.js';
import { auth } from './routes/auth.js';

// PRIMEIRO: criar a aplicação
export const app = express();

// SEGUNDO: configurar os middlewares
app.use(cors());
app.use(express.json({ limit: '16kb' }));

// TERCEIRO: registrar as rotas
app.use('/auth', auth);
app.use('/registros', registros);

// QUARTO: tratar rotas inexistentes
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada.'
  });
});

// QUINTO: tratamento de erros
app.use((erro, req, res, next) => {
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({
      erro: 'JSON inválido.'
    });
  }

  console.error('Erro na API:', erro.message);

  return res.status(500).json({
    erro: 'Ocorreu um erro interno na API.'
  });
});

import React from 'react';

import {
  NavigationContainer,
  DarkTheme
} from '@react-navigation/native';

import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';

import { StatusBar } from 'expo-status-bar';

// Telas
import Login from './screens/Login.js';
import Cadastro from './screens/Cadastro.js';
import Inicio from './screens/Inicio.js';
import Diario from './screens/Diario.js';
import NovoRegistro from './screens/NovoRegistro.js';
import Sobre from './screens/Sobre.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#082923'
          },
          headerTintColor: '#f2f7f4',
          contentStyle: {
            backgroundColor: '#051f1a'
          }
        }}
      >

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Entrar',
            headerShown: false
          }}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{
            title: 'Criar conta'
          }}
        />

        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{
            title: 'MoodAlert'
          }}
        />

        <Stack.Screen
          name="Diario"
          component={Diario}
          options={{
            title: 'Meu diário'
          }}
        />

        <Stack.Screen
          name="NovoRegistro"
          component={NovoRegistro}
          options={{
            title: 'Registrar meu dia'
          }}
        />

        <Stack.Screen
          name="Sobre"
          component={Sobre}
          options={{
            title: 'Sobre o projeto'
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
