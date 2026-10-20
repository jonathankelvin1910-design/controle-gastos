# Projeto: Controle de Gastos

## Objetivo
Criar um aplicativo web para registrar receitas e despesas, organizado por categorias, com resumo de saldo e gráfico. O projeto deve ser pensado para abrir no Visual Studio Code.

## Localização
- Pasta de origem de todos os projetos: `C:\programacao\projetos`
- Pasta deste projeto: `C:\programacao\projetos\controle-gastos`
- Todo o trabalho deve ficar dentro dessa pasta.

## Stack
- **Banco de dados:** MySQL
- **Backend:** Python + FastAPI + SQLAlchemy + PyMySQL
- **Frontend:** React com Vite, usando fetch ou axios e Recharts para o gráfico
- **Editor:** Visual Studio Code

## Estrutura de pastas esperada
```
controle-gastos/
├── database/
│   └── schema.sql
├── backend/
│   ├── venv/
│   ├── app/
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
├── frontend/
│   └── (projeto Vite + React)
└── README.md
```

## Banco de dados
Criar o arquivo `database/schema.sql` contendo:
- `CREATE DATABASE` para o banco do projeto
- Tabela `categorias`: `id`, `nome`
- Tabela `transacoes`: `id`, `descricao`, `valor`, `tipo` (receita ou despesa), `data`, `categoria_id` (chave estrangeira para `categorias`)
- Alguns dados de exemplo (categorias e transações)

## Backend (pasta `backend/`)
- Ambiente virtual (`venv`) e arquivo `requirements.txt`
- Conexão com MySQL via SQLAlchemy e PyMySQL
- Credenciais do banco em `backend/.env`, com um `backend/.env.example` sem dados reais
- CORS configurado para o frontend acessar o backend
- Endpoints:
  - CRUD de categorias
  - CRUD de transações
  - `GET /resumo`: retorna o total por categoria e o saldo geral
- Documentação automática disponível em `http://localhost:8000/docs`

## Frontend (pasta `frontend/`)
- Projeto React criado com Vite
- Formulário para cadastrar nova transação
- Tabela com a lista de transações e botão de excluir
- Cards mostrando saldo, total de receitas e total de despesas
- Gráfico de pizza por categoria, usando Recharts
- Comunicação com a API do backend usando fetch ou axios

## README.md
Criar um `README.md` na raiz com o passo a passo para rodar tudo no PowerShell:
1. Criar o banco executando o `schema.sql`
2. Configurar o `.env` do backend
3. Criar e ativar o venv, instalar dependências e iniciar o backend
4. Instalar dependências e iniciar o frontend
5. Endereços para acessar a aplicação e a documentação da API

## Regras
- Trabalhar apenas dentro de `C:\programacao\projetos\controle-gastos`.
- Não instalar nada globalmente sem me avisar antes.
- Mostrar cada comando antes de executá-lo.
- Não colocar senhas reais em nenhum arquivo versionado; usar apenas o `.env`.

## Ordem de execução (fazer em etapas)
Pare após cada etapa e aguarde minha confirmação antes de continuar:
1. Criar a estrutura de pastas e o `database/schema.sql`
2. Criar o backend e testar em `http://localhost:8000/docs`
3. Criar o frontend
4. Ligar frontend e backend e escrever o `README.md`
