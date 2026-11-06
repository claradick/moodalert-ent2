# MoodAlert

Aplicativo acadêmico de diário de humor e sono, adaptado do projeto Clara. Implementado até a entrega 2: Expo, React Navigation, API Express, MySQL e operações GET/POST.

## Rodar

Requer Node 22.13+ e MySQL 8.

1. `npm install`
2. Crie o banco e as tabelas no MySQL WorkBench com o SQL em database/ moodalert.sql
3. `npm run api`
4. Em outro terminal: `npm run web` ou `npm start` para abrir no Expo Go.

No celular, troque localhost pelo IP do computador na rede, por exemplo `http://192.168.1.10:3012`. Celular e computador devem estar na mesma rede. Reinicie o Expo após alterar o endereço.

Use apenas dados fictícios. Nesta etapa há um perfil demonstrativo fixo, sem autenticação. Login, JWT, permissões e CRUD completo ficam para a entrega 3; APK para a entrega 4.

Script do banco: `database/moodalert.sql`. A documentação das entregas está abaixo.

Verificar: `npm run lint`, `npm run typecheck`, `npm test`, `npm run export:web`. O teste de integração exige MySQL configurado e usa um registro temporário de 2000-01-01 (a data deve estar livre).

Antes de entregar, faça commit e push no seu repositório e confira os arquivos no remoto. Não envie `.env` nem `node_modules`.

## Problema e proposta

Pessoas que acompanham variações de humor, incluindo pessoas com transtorno bipolar, podem ter dificuldade em lembrar como se sentiram e dormiram entre consultas. Anotações dispersas dificultam observar o histórico. O público inicial são pacientes que desejam organizar essas informações; médicos são um público futuro, com autorização do paciente.

A proposta é reunir um registro por dia com humor, horas de sono e observações em um aplicativo acessível pelo celular. Isso organiza o relato para consultas, sem oferecer diagnóstico. O tema, nome e identidade verde escura vêm do Clara/MoodAlert; o site HTML com Firebase foi adaptado para React Native, Express e MySQL. A loja do professor foi usada como referência de organização técnica, não como domínio do aplicativo.

## Funcionalidades e fluxo

- RF01: apresentar o objetivo e o perfil demonstrativo na tela inicial.
- RF02: registrar data, humor de 1 a 5, sono de 0 a 24 horas e nota opcional até 1000 caracteres.
- RF03: persistir o registro pelo fetch → Express → MySQL.
- RF04: listar registros do mais recente para o mais antigo.
- RF05: impedir datas inválidas/futuras, valores fora da faixa e dois registros para o mesmo paciente e dia.
- RF06: exibir carregamento, histórico vazio, falha de conexão e nova tentativa.

Telas: Início, Registrar meu dia, Meu diário e Sobre o projeto. Início → Novo registro → salvar → Diário; Início → Diário → Novo registro; Início → Sobre. O botão de voltar do React Navigation retorna à tela anterior.

## Usuários e permissões previstas

| Perfil | Previsto para entrega 3 |
|---|---|
| Paciente | Criar conta, entrar, consultar e manter apenas seus registros |
| Médico | Consultar somente pacientes que autorizaram o vínculo; não alterar o diário deles |

Na entrega 2, paciente 1 é fixo no servidor, com dados fictícios; não há login nem isolamento por sessão. Selecionar perfil não é usado como autorização. O campo senha_hash fica nulo até a implementação do cadastro com hash na etapa 3. Vínculo médico-paciente será modelado nessa etapa.

## Modelagem implementada

Relação: `usuarios (1) → (N) registros_humor`.

| Tabela | Campos |
|---|---|
| usuarios | id INT PK auto incremento; nome VARCHAR(100); email VARCHAR(150) único; senha_hash VARCHAR(255) nulo nesta etapa; nivel ENUM paciente/medico |
| registros_humor | id INT PK auto incremento; paciente_id INT FK usuarios; data DATE; humor TINYINT; sono DECIMAL(3,1); nota VARCHAR(1000); criado_em TIMESTAMP |

Todos os campos são obrigatórios, exceto senha_hash. Nota aceita texto vazio. Chave única em paciente_id + data. CHECK limita humor e sono. Exclusão de usuário com registros é impedida pela FK. A escala 1–5 é um autorrelato, não uma classificação clínica.

## API implementada

| Método e rota | Uso | Respostas |
|---|---|---|
| GET /registros | Histórico do perfil demonstrativo | 200 e lista, inclusive vazia |
| POST /registros | Criar registro | 201, 400 para validação, 409 para data duplicada |

Exemplo POST: `{"data":"2026-01-01","humor":3,"sono":7.5,"nota":"Dia tranquilo"}`.

Erros têm formato `{"erro":"mensagem"}`. Banco indisponível retorna 503; rota desconhecida, 404. SQL parametrizado; conexão com pool mysql2/promise. Organização: backend/server.js inicia; app.js configura Express; routes encaminha; controllers valida e executa consultas; database mantém conexão. Aplicativo usa services/api.js com fetch e limite de dez segundos.

Setup usa o nome moodalert do SQL. DB_NAME deve permanecer moodalert ao usar `npm run db:setup`; para outro nome, ajuste também o SQL.