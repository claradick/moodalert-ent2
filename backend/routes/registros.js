import {Router} from 'express';
import {listar,criar} from '../controllers/registros.js';
export const registros=Router();
registros.get('/',listar);
registros.post('/',criar);
