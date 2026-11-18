import { Router } from 'express';

import {
  cadastrar,
  login
} from '../controllers/auth.js';

export const auth = Router();

auth.post('/cadastro', cadastrar);
auth.post('/login', login);