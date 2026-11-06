import mysql from 'mysql2/promise';
import {readFile} from 'node:fs/promises';
import {config,pool} from './database/conexao.js';
const conexao=await mysql.createConnection({...config,multipleStatements:true});
try {await conexao.query(await readFile(new URL('../database/moodalert.sql',import.meta.url),'utf8'));console.log('Banco MoodAlert pronto.');}
finally{await conexao.end();await pool.end();}
