const URL_API=process.env.EXPO_PUBLIC_API_URL||'http://localhost:3012';
export async function requisicao(caminho,opcoes={}){
 const controle=new AbortController();const limite=setTimeout(()=>controle.abort(),10000);
 try{const resposta=await fetch(URL_API+caminho,{...opcoes,headers:{'Content-Type':'application/json'},signal:controle.signal});const dados=await resposta.json();if(!resposta.ok)throw new Error(dados.erro||'Não foi possível concluir.');return dados;}
 catch(erro){if(erro.name==='AbortError'||erro instanceof TypeError)throw new Error('Sem conexão com a API. Confira o endereço e tente novamente.');throw erro;}
 finally{clearTimeout(limite);}
}
