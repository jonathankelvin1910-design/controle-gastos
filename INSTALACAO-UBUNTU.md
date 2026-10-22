# Instalação no Ubuntu: Controle de Gastos

Roteiro para recriar o ambiente do projeto no Ubuntu e rodar o site. O que está no GitHub é só o código. Ferramentas, `venv`, `node_modules`, `backend/.env` e o modelo do Ollama precisam ser recriados.

## 1. Pacotes do sistema

```bash
sudo apt update
sudo apt install -y git gh curl build-essential python3 python3-venv python3-pip pipx mysql-server
```

## 2. Node.js (versão recente)

O Vite exige um Node recente, e o `nodejs` do `apt` costuma ser antigo. Instale a versão LTS pelo NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

No Windows este projeto rodou com Node v24. Se o NodeSource falhar, use o `nvm` (veja a documentação oficial do nvm).

## 3. GitHub e clone do projeto

```bash
gh auth login
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
mkdir -p ~/projetos
cd ~/projetos
git clone https://github.com/jonathankelvin1910-design/controle-gastos.git
cd controle-gastos
```

No `gh auth login`, escolha GitHub.com, HTTPS e "Login with a web browser".

## 4. Banco de dados MySQL

```bash
sudo systemctl enable --now mysql
sudo systemctl status mysql
```

Crie o banco com o script do projeto:

```bash
cd ~/projetos/controle-gastos
sudo mysql --default-character-set=utf8mb4 < database/schema.sql
```

No Ubuntu, o `root` do MySQL usa a autenticação do sistema, então o login por senha costuma falhar. Em vez de usar o `root`, crie um usuário só para este banco:

```bash
sudo mysql
```

```sql
CREATE USER 'gastos'@'localhost' IDENTIFIED BY 'TROQUE_POR_UMA_SENHA';
GRANT ALL PRIVILEGES ON controle_gastos.* TO 'gastos'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Confira:

```bash
mysql -u gastos -p -e "SELECT COUNT(*) FROM controle_gastos.transacoes;"
```

Esperado: 10 transações.

## 5. Backend (FastAPI)

```bash
cd ~/projetos/controle-gastos/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
nano .env
```

No `.env`, ajuste:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=gastos
DB_PASSWORD=A_SENHA_QUE_VOCE_CRIOU
DB_NAME=controle_gastos
```

O `.env` não vai para o git. Inicie o servidor:

```bash
uvicorn app.main:app --reload
```

Documentação da API: <http://localhost:8000/docs>. Teste o `GET /resumo/`: saldo esperado 993.55 com os dados de exemplo.

## 6. Frontend (React + Vite)

Em **outro terminal**:

```bash
cd ~/projetos/controle-gastos/frontend
npm install
npm run dev
```

Abra <http://localhost:5173>. O CORS do backend só libera a porta 5173. Se o Vite abrir em outra porta, ela estava ocupada: libere a 5173 antes.

## 7. Ollama e Aider (opcional, para usar o Ornith)

Placa de vídeo NVIDIA: instale o driver proprietário antes, senão o modelo roda só na CPU e fica muito lento.

```bash
sudo ubuntu-drivers autoinstall
sudo reboot
nvidia-smi
```

Instale o Ollama e baixe o modelo (cerca de 21 GB):

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run hf.co/ornith-ai/Ornith-1.5-35B-A3B-GGUF
```

Para PC mais modesto, use o menor: `hf.co/ornith-ai/Ornith-1.5-9B-GGUF`.

Instale o Aider com o `pipx`, que evita o erro de ambiente gerenciado do Ubuntu:

```bash
pipx ensurepath
pipx install aider-chat
```

Feche e abra o terminal. O arquivo `.aider.model.settings.yml` não está no git (o `.gitignore` ignora `.aider*`). Recrie na raiz do projeto, em uma linha só:

```bash
cd ~/projetos/controle-gastos
echo '- {name: ollama_chat/hf.co/ornith-ai/Ornith-1.5-35B-A3B-GGUF, extra_params: {num_ctx: 32768}}' > .aider.model.settings.yml
```

Inicie o Aider:

```bash
export OLLAMA_API_BASE=http://127.0.0.1:11434
aider --model ollama_chat/hf.co/ornith-ai/Ornith-1.5-35B-A3B-GGUF --read especificacao.md
```

Regras que funcionaram bem com o modelo local:

- Peça em etapas curtas, não tudo de uma vez.
- Diga que os caminhos são relativos à raiz do repositório.
- Responda `n` ao Aider quando ele quiser criar o `.env`, `node_modules` ou arquivos fora da pasta certa.

## Problemas comuns

- **`Access denied for user`:** usuário ou senha errados no `backend/.env`. Salve e reinicie o `uvicorn`.
- **`Can't connect to MySQL server`:** rode `sudo systemctl start mysql`.
- **Porta 5173 ocupada:** `ss -ltnp | grep 5173` mostra o processo. Encerre só se for o `node` do projeto.
- **Erro `externally-managed-environment` no pip:** use sempre o `venv` (`source venv/bin/activate`) ou o `pipx`.
- **Aider sem resposta ou muito lento:** veja `ollama ps`. Se a coluna PROCESSOR mostrar CPU, o driver de vídeo não está em uso.

## Subindo tudo depois de reiniciar

```bash
# Terminal 1: backend
cd ~/projetos/controle-gastos/backend && source venv/bin/activate && uvicorn app.main:app --reload

# Terminal 2: frontend
cd ~/projetos/controle-gastos/frontend && npm run dev
```
