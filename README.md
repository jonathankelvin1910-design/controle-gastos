# Controle de Gastos

Aplicação web para controlar finanças pessoais: registre receitas e despesas por categoria, acompanhe o saldo e visualize para onde o dinheiro está indo.

**Tecnologias:** MySQL 8 · Python + FastAPI + SQLAlchemy · React (Vite) + Axios + Recharts

## Funcionalidades

### Transações
- Cadastro de receitas e despesas com descrição, valor, tipo, data e categoria
- Edição de uma transação existente no próprio formulário (botões Salvar e Cancelar)
- Exclusão de transações direto da tabela
- Listagem com valores em reais (R$), datas no formato brasileiro e tipo destacado por cor (receita em verde, despesa em vermelho)
- Ordenação por qualquer coluna da tabela (crescente ou decrescente), com indicação visual
- Ordenação por qualquer coluna da tabela (crescente ou decrescente), com indicação visual
- Exportação das transações filtradas para CSV, pronta para abrir no Excel ou LibreOffice

### Validação do formulário
- Descrição obrigatória (espaços em branco não valem)
- Valor deve ser maior que zero
- Data obrigatória
- Mensagens de erro exibidas abaixo de cada campo, que somem ao corrigir

### Categorias
- Alimentação, Moradia, Saúde, Transporte, Educação, Lazer, Salário e Outros
- Cada categoria tem uma cor fixa, igual no gráfico e na legenda
- Transações sem categoria aparecem como "Sem categoria"

### Resumo financeiro
- Cards com total de receitas, despesas e saldo
- Saldo positivo em verde e negativo em vermelho
- Os valores acompanham os filtros aplicados
- Metas de gasto mensais por categoria, com barra de progresso (verde até 70%, amarela até 100% e vermelha quando excedida)

### Filtros
- Por mês
- Por categoria
- Busca por descrição, sem diferenciar maiúsculas de minúsculas nem acentos
- Combinação dos filtros e da busca ao mesmo tempo
- Cards, gráfico de pizza e tabela refletem os filtros e a busca

### Gráficos
- **Despesas por categoria** (pizza): percentuais nas fatias, legenda por categoria e tooltip com o valor em R$
- **Receitas e despesas por mês** (barras): comparação mensal, em ordem cronológica, com tooltip em R$

### Interface
- Tema escuro com painéis, cards e tabela estilizados
- Layout responsivo: os painéis se reorganizam em telas menores
- Listas de seleção legíveis no tema escuro

## Arquitetura

```
Navegador (React + Vite)
        │  HTTP / JSON (Axios)
        ▼
API FastAPI  ──  SQLAlchemy + PyMySQL  ──▶  MySQL
```

```
controle-gastos/
├── database/
│   └── schema.sql          # tabelas e dados de exemplo
├── backend/
│   └── app/
│       ├── main.py         # aplicação, CORS e criação das tabelas
│       ├── database.py     # conexão e configuração por variáveis de ambiente
│       ├── models.py       # modelos SQLAlchemy
│       ├── schemas.py      # esquemas de validação (Pydantic)
│       ├── crud.py         # operações no banco
│       └── routers/        # categorias, transações e resumo
└── frontend/
    └── src/
        └── utils/          # exportação de CSV
        ├── App.jsx         # estado, filtros e composição da página
        ├── api/            # cliente HTTP
        └── components/
            ├── SaldoCards.jsx
            ├── FormTransacao.jsx
            ├── TabelaTransacoes.jsx
            ├── GraficoPizza.jsx
            └── GraficoMensal.jsx
```

## Modelo de dados

- **categorias:** identificador e nome
- **transacoes:** identificador, descrição, valor, tipo (receita ou despesa), data e categoria (opcional)

## API

| Método | Rota | Descrição |
|---|---|---|
| GET / POST | `/categorias/` | Lista e cria categorias |
| GET / PUT / DELETE | `/categorias/{id}` | Detalha, atualiza e exclui uma categoria |
| GET / POST | `/transacoes/` | Lista e cria transações |
| GET / PUT / DELETE | `/transacoes/{id}` | Detalha, atualiza e exclui uma transação |
| GET | `/resumo/` | Totais gerais e por categoria |
| GET | `/metas/` | Lista as metas de gasto |
| GET | `/metas/progresso` | Gasto do mês contra a meta de cada categoria (`?mes=AAAA-MM`) |
| PUT, DELETE | `/metas/{categoria_id}` | Define (ou altera) e remove a meta de uma categoria |
| GET | `/health` | Verificação de saúde da API |

A documentação interativa (Swagger) fica disponível em `/docs` com o backend em execução.

## Segurança

- Credenciais do banco ficam em variáveis de ambiente (`.env`), fora do Git
- A aplicação usa um usuário próprio do MySQL, sem privilégios de administrador
- CORS restrito à origem do frontend
- A API valida os dados recebidos (descrição obrigatória, valor maior que zero e com limite, tipo receita ou despesa) e responde 422 em caso de erro

## Próximas ideias

- Paginação da tabela
