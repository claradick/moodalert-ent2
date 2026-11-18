
import React, { useState } from 'react';

import {
  Text,
  TextInput,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Pagina,
  Botao,
  s,
  cores
} from '../components/ui.js';

import { requisicao } from '../services/api.js';

// Armazenamento da sessão
async function salvarSessao(token, usuario) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem('moodalert_token', token);

    await AsyncStorage.setItem(
      'moodalert_usuario',
      JSON.stringify(usuario)
    );
  } else {
    const SecureStore = await import('expo-secure-store');

    await SecureStore.setItemAsync(
      'moodalert_token',
      token
    );

    await SecureStore.setItemAsync(
      'moodalert_usuario',
      JSON.stringify(usuario)
    );
  }
}

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    setErro('');

    if (!email.trim() || !senha) {
      setErro('Preencha seu e-mail e sua senha.');
      return;
    }

    try {
      setCarregando(true);

      // Enviar os dados para a API
      const resultado = await requisicao('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          senha: senha
        })
      });

      // Verificar resposta da API
      if (!resultado.token || !resultado.usuario) {
        throw new Error(
          'Não foi possível validar sua sessão.'
        );
      }

      // Salvar token e dados do usuário
      await salvarSessao(
        resultado.token,
        resultado.usuario
      );

      // Entrar no aplicativo
      navigation.replace('Inicio');

    } catch (e) {
      setErro(
        e.message || 'Não foi possível realizar o login.'
      );

    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: cores.fundo
      }}
      behavior={
        Platform.OS === 'ios' ? 'padding' : undefined
      }
    >
      <Pagina>

        {/* Identidade do aplicativo */}
        <View
          style={{
            marginTop: 55,
            marginBottom: 35
          }}
        >
          <Text
            style={{
              color: cores.verde,
              fontSize: 21,
              fontWeight: '700',
              marginBottom: 25
            }}
          >
            MoodAlert
          </Text>

          <Text style={[s.titulo, { fontSize: 34 }]}>
            Bem-vindo de volta.
          </Text>

          <Text style={s.texto}>
            Entre na sua conta e continue acompanhando
            seu bem-estar, um dia de cada vez.
          </Text>
        </View>

        {/* Formulário */}
        <View style={s.card}>

          <Text style={[s.titulo, { fontSize: 24 }]}>
            Entrar
          </Text>

          <Text style={s.label}>
            E-mail
          </Text>

          <TextInput
            style={s.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor={cores.suave}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!carregando}
          />

          <Text style={s.label}>
            Senha
          </Text>

          <TextInput
            style={s.input}
            placeholder="Digite sua senha"
            placeholderTextColor={cores.suave}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            editable={!carregando}
            onSubmitEditing={entrar}
            returnKeyType="go"
          />

          {/* Mensagens de erro */}
          {erro ? (
            <Text
              accessibilityRole="alert"
              style={s.erro}
            >
              {erro}
            </Text>
          ) : null}

          {/* Botão de login */}
          <View style={{ marginTop: 20 }}>

            {carregando ? (
              <ActivityIndicator
                color={cores.verde}
                size="large"
              />
            ) : (
              <Botao
                titulo="Entrar na minha conta"
                onPress={entrar}
              />
            )}

            {/* Botão de cadastro */}
            <Botao
              secundario
              titulo="Criar uma conta"
              disabled={carregando}
              onPress={() => navigation.navigate('Cadastro')}
            />

          </View>
        </View>

        <Text
          style={[
            s.texto,
            {
              textAlign: 'center',
              fontSize: 13
            }
          ]}
        >
          Seus dados são protegidos e utilizados
          para acessar sua conta.
        </Text>

      </Pagina>
    </KeyboardAvoidingView>
  );
}
