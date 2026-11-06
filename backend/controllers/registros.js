import {pool} from '../database/conexao.js';
export function validarRegistro({data,humor,sono,nota}) {
 if(typeof data!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(data)||!Number.isFinite(Date.parse(data))||new Date(data).toISOString().slice(0,10)!==data)return 'Informe uma data válida.';
 const hoje=new Date(); const limite=hoje.getFullYear()+'-'+String(hoje.getMonth()+1).padStart(2,'0')+'-'+String(hoje.getDate()).padStart(2,'0');
 if(data>limite)return 'A data não pode estar no futuro.';
 if(!Number.isInteger(humor)||humor<1||humor>5)return 'Escolha um humor de 1 a 5.';
 if(typeof sono!=='number'||!Number.isFinite(sono)||sono<0||sono>24)return 'Informe de 0 a 24 horas de sono.';
 if(typeof nota!=='string'||nota.length>1000)return 'A nota deve ter até 1000 caracteres.';
 return null;
}
// Entrega 2: perfil demonstrativo fixo; a identidade não vem do cliente.
export async function listar(req,res){
 const [rows]=await pool.execute('SELECT id,data,humor,sono,nota FROM registros_humor WHERE paciente_id=? ORDER BY data DESC,id DESC',[1]);res.json(rows);
}
export async function criar(req,res){
 const erro=validarRegistro(req.body||{});if(erro)return res.status(400).json({erro});
 const {data,humor,sono,nota}=req.body;
 const [r]=await pool.execute('INSERT INTO registros_humor (paciente_id,data,humor,sono,nota) VALUES (?,?,?,?,?)',[1,data,humor,sono,nota.trim()]);
 res.status(201).json({id:r.insertId,data,humor,sono,nota:nota.trim()});
}
