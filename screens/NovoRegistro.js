import React,{useState} from 'react';
import {Text,TextInput,View,Pressable} from 'react-native';
import {Pagina,Botao,s,cores,humores} from '../components/ui.js';
import {requisicao} from '../services/api.js';
export default function NovoRegistro({navigation}){
 const hoje=new Date();const inicial=hoje.getFullYear()+'-'+String(hoje.getMonth()+1).padStart(2,'0')+'-'+String(hoje.getDate()).padStart(2,'0');
 const [data,setData]=useState(inicial),[humor,setHumor]=useState(3),[sono,setSono]=useState(''),[nota,setNota]=useState(''),[erro,setErro]=useState(''),[salvando,setSalvando]=useState(false);
 async function salvar(){
  if(!sono.trim()||!Number.isFinite(Number(sono.replace(',','.')))){setErro('Informe as horas de sono.');return;}
  setSalvando(true);setErro('');
  try{await requisicao('/registros',{method:'POST',body:JSON.stringify({data,humor,sono:Number(sono.replace(',','.')),nota})});navigation.replace('Diario');}catch(e){setErro(e.message);}finally{setSalvando(false);}
 }
 return <Pagina><Text style={s.titulo}>Um momento para você.</Text><Text style={s.texto}>Não existe resposta certa. Registre como foi o seu dia.</Text><Text style={s.label}>Data (AAAA-MM-DD)</Text><TextInput accessibilityLabel="Data" style={s.input} value={data} onChangeText={setData} maxLength={10}/><Text style={s.label}>Como está seu humor?</Text><View style={{gap:8}}>{humores.map((nome,i)=><Pressable accessibilityRole="radio" accessibilityState={{checked:humor===i+1}} key={nome} onPress={()=>setHumor(i+1)} style={{borderWidth:1,borderColor:humor===i+1?cores.verde:cores.linha,backgroundColor:humor===i+1?'#154d3b':cores.painel,padding:14,borderRadius:12}}><Text style={{color:cores.texto,fontSize:16}}>{i+1} · {nome}{humor===i+1?'  • Selecionado':''}</Text></Pressable>)}</View><Text style={s.label}>Quantas horas você dormiu?</Text><TextInput accessibilityLabel="Horas de sono" style={s.input} keyboardType="decimal-pad" placeholder="Ex.: 7,5" placeholderTextColor={cores.suave} value={sono} onChangeText={setSono}/><Text style={s.label}>O que marcou o seu dia? (opcional)</Text><TextInput accessibilityLabel="Observações" multiline maxLength={1000} style={[s.input,{minHeight:110,textAlignVertical:'top'}]} value={nota} onChangeText={setNota} placeholder="Escreva no seu tempo…" placeholderTextColor={cores.suave}/><Text style={[s.texto,{fontSize:12,textAlign:'right'}]}>{nota.length}/1000</Text>{erro?<Text accessibilityRole="alert" style={s.erro}>{erro}</Text>:null}<Botao disabled={salvando} titulo={salvando?'Salvando…':'Salvar registro'} onPress={salvar}/></Pagina>;
}
