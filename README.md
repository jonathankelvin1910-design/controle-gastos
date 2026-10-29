# Controle de Gastos

Aplicação web para controlar receitas e despesas pessoais, com resumo financeiro, filtros e gráficos.

**Stack:** MySQL · FastAPI (Python) · React + Vite

## Funcionalidades

- Cadastro, edição e exclusão de transações (receitas e despesas)
- Categorias (Alimentação, Moradia, Saúde, Transporte, Educação, Lazer, Salário, Outros)
- Resumo com total de receitas, despesas e saldo
- Filtros por mês e por categoria (os cards e o gráfico de pizza acompanham o filtro)
- Validação do formulário (descrição obrigatória, valor maior que zero, data obrigatória)
- Gráfico de pizza: despesas por categoria
- Gráfico de barras: receitas e despesas por mês
- Tema escuro responsivo, com valores em reais (R$)

## Estrutura

```
controle-gastos/
├── backend/            # API FastAPI
│   ├── app/            # main, database, models, schemas, crud, routers
│   ├── requirements.txt
│   └── .env.example
├── database/
│   └── schema.sql      # criação das tabelas
├── frontend/           # React + Vite
│   └── src/
│       ├── api/        # cliente axios
│       └── components/ # SaldoCards, FormTransacao, TabelaTransacoes,
│                       # GraficoPizza, GraficoMensal
├── especificacao.md
├── INSTALACAO-UBUNTU.md
└── README.md
```

## Requisitos

- Python 3.12 ou superior
- Node.js e npm
- MySQL 8

Passo a passo de instalação no Ubuntu (incluindo MySQL e usuário do banco): veja [INSTALACAO-UBUNTU.md](INSTALACAO-UBUNTU.md).

## Configuração

1. Crie o banco e as tabelas com `database/schema.sql`.
2. Copie o arquivo de ambiente e preencha com seus dados:

   ```bash
   cd backend
   cp .env.example .env
   chmod 600 .env
   ```

   Variáveis: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `APP_HOST`, `APP_PORT`.
   O `.env` nunca deve ser enviado ao Git.

## Como rodar

**Backend** (terminal 1):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Verifique em http://127.0.0.1:8000/health e a documentação interativa em http://127.0.0.1:8000/docs.

**Frontend** (terminal 2):

```bash
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173.

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Verifica se a API está no ar |
| GET, POST | `/categorias/` | Lista e cria categorias |
| GET, POST | `/transacoes/` | Lista e cria transações |
| PUT, DELETE | `/transacoes/{id}` | Edita e exclui uma transação |
| GET | `/resumo/` | Totais gerais e por categoria |

## Segurança

- Use um usuário próprio do MySQL (não o root) para a aplicação.
- Nunca envie o arquivo `.env` ao GitHub nem cole senhas em chats ou prints.

## Próximas ideias

- Busca por descrição
- Exportar transações para CSV
- Meta de gasto por categoria
- Ordenação e paginação da tabela
