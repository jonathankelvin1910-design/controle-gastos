-- ============================================================================
-- Projeto: Controle de Gastos
-- Banco de dados: MySQL
-- Arquivo de schema do banco de dados
-- ============================================================================

-- Cria o banco de dados do projeto (se ainda não existir)
CREATE DATABASE IF NOT EXISTS controle_gastos;

-- Seleciona o banco de dados para uso
USE controle_gastos;

-- ============================================================================
-- Tabela: categorias
-- Armazena as categorias de gastos e receitas
-- ============================================================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- Tabela: transacoes
-- Armazena receitas e despesas, vinculadas a uma categoria
-- ============================================================================
CREATE TABLE transacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    tipo ENUM('receita', 'despesa') NOT NULL,
    data DATE NOT NULL,
    categoria_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transacao_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias (id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- Dados de exemplo: categorias
-- ============================================================================
INSERT INTO categorias (nome) VALUES
    ('Alimentação'),
    ('Transporte'),
    ('Moradia'),
    ('Salário'),
    ('Lazer'),
    ('Saúde'),
    ('Educação'),
    ('Outros');

-- ============================================================================
-- Dados de exemplo: transações
-- (receitas e despesas de um mês de referência)
-- ============================================================================
INSERT INTO transacoes (descricao, valor, tipo, data, categoria_id) VALUES
    ('Salário mensal',        3500.00, 'receita', '2024-01-05', 4),
    ('Mercado de alimentos',   650.75, 'despesa', '2024-01-08', 1),
    ('Combustível',            250.00, 'despesa', '2024-01-10', 2),
    ('Aluguel',               1400.00, 'despesa', '2024-01-12', 3),
    ('Sessão de cinema',        90.00, 'despesa', '2024-01-15', 5),
    ('Farmácia',               120.50, 'despesa', '2024-01-18', 6),
    ('Curso online',           199.90, 'despesa', '2024-01-20', 7),
    ('Projeto de freelance',   800.00, 'receita', '2024-01-25', 8),
    ('Restaurante',            145.30, 'despesa', '2024-01-22', 1),
    ('Plano de saúde',         450.00, 'despesa', '2024-01-15', 6);


-- ============================================================================
-- Metas de gasto mensais por categoria (uma meta por categoria)
-- ============================================================================
CREATE TABLE IF NOT EXISTS metas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL UNIQUE,
    valor_limite DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_metas_categoria FOREIGN KEY (categoria_id)
        REFERENCES categorias (id) ON DELETE CASCADE
);

INSERT IGNORE INTO metas (categoria_id, valor_limite) VALUES
    (1, 800.00),
    (3, 1500.00),
    (5, 150.00);
