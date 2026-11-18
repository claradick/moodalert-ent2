
import { pool } from '../database/conexao.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body || {};

    // Validar campos obrigatórios
    if (
      typeof nome !== 'string' ||
      typeof email !== 'string' ||
      typeof senha !== 'string'
    ) {
      return res.status(400).json({
        erro: 'Preencha nome, e-mail e senha.'
      });
    }

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    // Validar nome
    if (nomeLimpo.length < 2 || nomeLimpo.length > 100) {
      return res.status(400).json({
        erro: 'O nome deve ter entre 2 e 100 caracteres.'
      });
    }

    // Validar e-mail
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      emailLimpo.length > 150 ||
      !emailValido.test(emailLimpo)
    ) {
      return res.status(400).json({
        erro: 'Informe um e-mail válido.'
      });
    }

    // Validar senha
    if (senha.length < 8 || senha.length > 72) {
      return res.status(400).json({
        erro: 'A senha deve ter entre 8 e 72 caracteres.'
      });
    }

    // Verificar se o e-mail já está cadastrado
    const [usuarios] = await pool.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [emailLimpo]
    );

    if (usuarios.length > 0) {
      return res.status(409).json({
        erro: 'Este e-mail já está cadastrado.'
      });
    }

    // Proteger a senha com hash
    const senhaHash = await bcrypt.hash(senha, 12);

    // Cadastro público sempre cria paciente
    const [resultado] = await pool.execute(
      `INSERT INTO usuarios
       (nome, email, senha_hash, nivel)
       VALUES (?, ?, ?, ?)`,
      [nomeLimpo, emailLimpo, senhaHash, 'paciente']
    );

    return res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso!',
      usuario: {
        id: resultado.insertId,
        nome: nomeLimpo,
        email: emailLimpo,
        nivel: 'paciente'
      }
    });

  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        erro: 'Este e-mail já está cadastrado.'
      });
    }

    console.error('Erro no cadastro:', erro.message);

    return res.status(500).json({
      erro: 'Não foi possível realizar o cadastro.'
    });
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body || {};

    if (
      typeof email !== 'string' ||
      typeof senha !== 'string'
    ) {
      return res.status(400).json({
        erro: 'Informe e-mail e senha.'
      });
    }

    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || senha.length === 0) {
      return res.status(400).json({
        erro: 'Informe e-mail e senha.'
      });
    }

    // Buscar usuário no banco
    const [usuarios] = await pool.execute(
      `SELECT id, nome, email, senha_hash, nivel
       FROM usuarios
       WHERE email = ?`,
      [emailLimpo]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        erro: 'E-mail ou senha incorretos.'
      });
    }

    const usuario = usuarios[0];

    // Comparar senha informada com o hash armazenado
    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: 'E-mail ou senha incorretos.'
      });
    }

    // Verificar segredo JWT
    const segredo = process.env.JWT_SECRET;

    if (!segredo || segredo.length < 32) {
      console.error('JWT_SECRET ausente ou inválido.');

      return res.status(500).json({
        erro: 'Configuração de autenticação indisponível.'
      });
    }

    // Gerar token
    const token = jwt.sign(
      {
        id: usuario.id,
        nivel: usuario.nivel
      },
      segredo,
      {
        expiresIn: '2h'
      }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        nivel: usuario.nivel
      }
    });

  } catch (erro) {
    console.error('Erro no login:', erro.message);

    return res.status(500).json({
      erro: 'Não foi possível realizar o login.'
    });
  }
}
