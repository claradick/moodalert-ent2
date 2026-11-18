
import React, { useState } from 'react';

import {
  Text,
  TextInput,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import {
  Pagina,
  Botao,
  s,
  cores
} from '../components/ui.js';

import { requisicao } from '../services/api.js';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    setErro('');

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (nomeLimpo.length < 2 || nomeLimpo.length > 100) {
      setErro('O nome deve ter entre 2 e 100 caracteres.');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(emailLimpo)) {
      setErro('Digite um e-mail válido.');
      return;
    }

    if (senha.length < 8 || senha.length > 72) {
      setErro('A senha deve ter entre 8 e 72 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    try {
      setCarregando(true);

      const resultado = await requisicao('/auth/cadastro', {
        method: 'POST',
        body: JSON.stringify({
          nome: nomeLimpo,
          email: emailLimpo,
          senha: senha
        })
      });

      if (!resultado.usuario || !resultado.usuario.id) {
        throw new Error('Resposta inválida da API.');
      }

      setSucesso(true);

      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');

    } catch (e) {
      setErro(e.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: cores.fundo }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pagina>
        <Text
          style={{
            color: cores.verde,
            fontSize: 21,
            fontWeight: '700',
            marginTop: 35,
            marginBottom: 25
          }}
        >
          MoodAlert
        </Text>

        {sucesso ? (
          <View style={s.card}>
            <Text style={[s.titulo, { fontSize: 27 }]}>
              Cadastro realizado!
            </Text>

            <Text style={s.texto}>
              Sua conta foi criada com sucesso. Agora você
              já pode entrar no MoodAlert.
            </Text>

            <View style={{ marginTop: 20 }}>
              <Botao
                titulo="Ir para o login"
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          </View>
        ) : (
          <>
            <Text style={[s.titulo, { fontSize: 32 }]}>
              Crie sua conta.
            </Text>

            <Text style={s.texto}>
              Comece a acompanhar seus registros de humor
              e sono com o MoodAlert.
            </Text>

            <View style={s.card}>
              <Text style={[s.titulo, { fontSize: 24 }]}>
                Cadastro de paciente
              </Text>

              <Text style={s.label}>Nome completo</Text>

              <TextInput
                style={s.input}
                placeholder="Digite seu nome"
                placeholderTextColor={cores.suave}
                value={nome}
                onChangeText={setNome}
                editable={!carregando}
                maxLength={100}
                autoCapitalize="words"
              />

              <Text style={s.label}>E-mail</Text>

              <TextInput
                style={s.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor={cores.suave}
                value={email}
                onChangeText={setEmail}
                editable={!carregando}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={s.label}>Senha</Text>

              <TextInput
                style={s.input}
                placeholder="Crie uma senha"
                placeholderTextColor={cores.suave}
                value={senha}
                onChangeText={setSenha}
                editable={!carregando}
                secureTextEntry
                autoCapitalize="none"
              />

              <Text style={s.label}>Confirmar senha</Text>

              <TextInput
                style={s.input}
                placeholder="Digite novamente sua senha"
                placeholderTextColor={cores.suave}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                editable={!carregando}
                secureTextEntry
                autoCapitalize="none"
                onSubmitEditing={cadastrar}
              />

              {erro ? (
                <Text
                  accessibilityRole="alert"
                  style={s.erro}
                >
                  {erro}
                </Text>
              ) : null}

              <View style={{ marginTop: 20 }}>
                {carregando ? (
                  <ActivityIndicator
                    size="large"
                    color={cores.verde}
                  />
                ) : (
                  <Botao
                    titulo="Criar minha conta"
                    onPress={cadastrar}
                  />
                )}

                <Botao
                  secundario
                  titulo="Voltar para o login"
                  disabled={carregando}
                  onPress={() => navigation.navigate('Login')}
                />
              </View>
            </View>

            <Text style={[s.texto, { fontSize: 13 }]}>
              Seus dados serão armazenados de forma protegida.
            </Text>
          </>
        )}
      </Pagina>
    </KeyboardAvoidingView>
  );
}
