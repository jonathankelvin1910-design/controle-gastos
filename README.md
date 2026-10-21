# Controle de Gastos

Aplicação web para registrar receitas e despesas por categoria, com saldo geral e gráfico de pizza.

- **Banco:** MySQL 8
- **Backend:** Python + FastAPI + SQLAlchemy + PyMySQL
- **Frontend:** React (Vite) + Axios + Recharts

## Estrutura

```
controle-gastos/
├── database/
│   └── schema.sql
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   └── src/
└── README.md
```

## Pré-requisitos

Confira no PowerShell:

```powershell
mysql --version
node --version
npm --version
py --version
```

Se algum não for reconhecido, instale:

```powershell
winget install Oracle.MySQL
winget install OpenJS.NodeJS.LTS
winget install Python.Python.3.12
```

Depois de instalar, feche e abra o PowerShell. Se o `mysql` não for reconhecido mesmo instalado, adicione a pasta `C:\Program Files\MySQL\MySQL Server 8.0\bin` ao PATH.

## 1. Criar o banco de dados

Use o comando `source`, que preserva os acentos:

```powershell
Set-Location C:\programacao\projetos\controle-gastos
mysql -u root -p --default-character-set=utf8mb4 -e "source C:/programacao/projetos/controle-gastos/database/schema.sql"
```

Para conferir:

```powershell
mysql -u root -p --default-character-set=utf8mb4 -e "SELECT id, nome FROM controle_gastos.categorias; SELECT COUNT(*) AS total FROM controle_gastos.transacoes;"
```

Esperado: 8 categorias e 10 transações.

Para refazer do zero:

```powershell
mysql -u root -p -e "DROP DATABASE IF EXISTS controle_gastos;"
```

## 2. Configurar o backend

```powershell
Set-Location C:\programacao\projetos\controle-gastos\backend
Copy-Item .env.example .env
notepad .env
```

No `.env`, troque `DB_PASSWORD` pela senha real do MySQL. Esse arquivo **não** vai para o git.

## 3. Iniciar o backend

```powershell
Set-Location C:\programacao\projetos\controle-gastos\backend
py -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Se o PowerShell bloquear o `Activate.ps1`, rode uma vez:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Deixe essa janela aberta. API: <http://localhost:8000> — documentação: <http://localhost:8000/docs>.

Se o MySQL estiver parado, abra um PowerShell como administrador e rode:

```powershell
Start-Service MySQL80
```

## 4. Iniciar o frontend

Em **outro** PowerShell:

```powershell
Set-Location C:\programacao\projetos\controle-gastos\frontend
npm install
npm run dev
```

Abra <http://localhost:5173>.

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET / POST | `/categorias/` | Lista / cria categorias |
| GET / PUT / DELETE | `/categorias/{id}` | Detalhe / atualiza / exclui |
| GET / POST | `/transacoes/` | Lista / cria transações |
| GET / PUT / DELETE | `/transacoes/{id}` | Detalhe / atualiza / exclui |
| GET | `/resumo/` | Totais por categoria e saldo geral |
| GET | `/health` | Verificação de saúde |

## Problemas comuns

- **`Access denied for user 'root'`:** senha errada no `backend/.env`. Corrija, salve e reinicie o `uvicorn`.
- **`Can't connect to MySQL server`:** o serviço está parado. Use `Start-Service MySQL80` como administrador.
- **Vite abre na porta 5174:** a 5173 está ocupada. O CORS do backend só libera a 5173 (e `127.0.0.1:5173`). Encerre o processo que usa a porta:
  ```powershell
  Get-NetTCPConnection -LocalPort 5173 | Select-Object OwningProcess
  Get-Process -Id NUMERO_DO_PROCESSO
  Stop-Process -Id NUMERO_DO_PROCESSO
  ```
  Só encerre se for o `node` do próprio projeto.
- **Cards zerados ou tabela vazia:** confira se o backend está rodando e veja a aba Network (`F12`) do navegador.
- **Acentos quebrados no PowerShell:** é só a exibição do terminal. Execute `chcp 65001` e repita o comando.
