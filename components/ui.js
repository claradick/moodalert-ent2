import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
export const cores={fundo:'#051f1a',painel:'#0c3027',verde:'#57d5a1',texto:'#f2f7f4',suave:'#adc8bd',linha:'#285045'};
export const s=StyleSheet.create({titulo:{fontSize:30,fontWeight:'700',color:cores.texto,marginBottom:12},texto:{fontSize:16,lineHeight:25,color:cores.suave},card:{backgroundColor:cores.painel,padding:24,borderRadius:18,marginVertical:18},label:{color:cores.texto,fontSize:15,marginTop:20,marginBottom:9},input:{borderWidth:1,borderColor:cores.linha,borderRadius:12,padding:15,color:cores.texto,fontSize:16},erro:{color:'#ffb8ac',marginVertical:16,lineHeight:23}});
export function Botao({titulo,onPress,secundario=false,disabled=false}){
 return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({pressed})=>({backgroundColor:secundario?cores.painel:cores.verde,padding:17,borderRadius:12,marginVertical:7,opacity:disabled?0.5:pressed?0.75:1})}><Text style={{color:secundario?cores.texto:cores.fundo,textAlign:'center',fontSize:16,fontWeight:'700'}}>{titulo}</Text></Pressable>;
}
export function Pagina({children}){return <ScrollView style={{flex:1,backgroundColor:cores.fundo}} contentContainerStyle={{padding:24,paddingBottom:48,alignItems:'center'}} keyboardShouldPersistTaps="handled"><View style={{width:'100%',maxWidth:720}}>{children}</View></ScrollView>;}
export const humores=['Muito baixo','Baixo','Estável','Elevado','Muito elevado'];
