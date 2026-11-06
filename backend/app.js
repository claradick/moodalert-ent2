import express from 'express';
import cors from 'cors';
import {registros} from './routes/registros.js';
export const app=express();
app.use(cors());app.use(express.json({limit:'16kb'}));app.use('/registros',registros);
app.use((req,res)=>res.status(404).json({erro:'Rota não encontrada.'}));
app.use((erro,req,res,next)=>{
 if(erro.code==='ER_DUP_ENTRY')return res.status(409).json({erro:'Já existe um registro nesta data.'});
 if(erro.type==='entity.parse.failed')return res.status(400).json({erro:'JSON inválido.'});
 console.error(erro.code||erro.message);res.status(503).json({erro:'Não foi possível acessar o banco. Confira a API e o MySQL.'});
});
