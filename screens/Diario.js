import React,{useState,useCallback} from 'react';
import {Text,View,ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Pagina,Botao,s,cores,humores} from '../components/ui.js';
import {requisicao} from '../services/api.js';
export default function Diario({navigation}){
 const [dados,setDados]=useState([]),[carregando,setCarregando]=useState(true),[erro,setErro]=useState('');
 const carregar=useCallback(async()=>{setCarregando(true);setErro('');try{setDados(await requisicao('/registros'));}catch(e){setErro(e.message);}finally{setCarregando(false);}},[]);
 useFocusEffect(useCallback(()=>{carregar();},[carregar]));
 return <Pagina><Text style={s.titulo}>Seu caminho, dia a dia.</Text><Text style={s.texto}>Humor, sono e pequenas observações reunidos em um só lugar.</Text><Botao titulo="Novo registro" onPress={()=>navigation.navigate('NovoRegistro')}/>{carregando?<ActivityIndicator color={cores.verde} accessibilityLabel="Carregando registros"/>:erro?<><Text accessibilityRole="alert" style={s.erro}>{erro}</Text><Botao titulo="Tentar novamente" onPress={carregar}/></>:dados.length===0?<View style={s.card}><Text style={s.titulo}>Seu diário começa aqui.</Text><Text style={s.texto}>Você ainda não registrou nenhum dia. Use Novo registro para começar.</Text></View>:dados.map(r=><View key={r.id} style={s.card}><Text style={s.texto}>{r.data.split('-').reverse().join('/')}</Text><Text style={[s.titulo,{fontSize:24,marginTop:12}]}>{humores[r.humor-1]}</Text><Text style={s.texto}>{Number(r.sono)} horas de sono</Text><Text style={[s.texto,{color:cores.texto,marginTop:14}]}>{r.nota||'Sem observações neste dia.'}</Text></View>)}</Pagina>;
}
