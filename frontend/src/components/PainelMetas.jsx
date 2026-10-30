import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/api'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const NOMES_MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const chaveMesAtual = () => {
  const hoje = new Date()
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
}

const rotuloMes = (chave) => {
  const [ano, mes] = chave.split('-')
  return `${NOMES_MES[Number(mes) - 1]}/${ano}`
}

const classeDaBarra = (percentual) => {
  if (percentual > 100) return 'meta-estourada'
  if (percentual >= 70) return 'meta-atencao'
  return 'meta-ok'
}

function PainelMetas({ categorias, transacoes }) {
  const [mes, setMes] = useState(chaveMesAtual())
  const [progresso, setProgresso] = useState([])
  const [categoriaId, setCategoriaId] = useState('')
  const [valor, setValor] = useState('')
  const [erro, setErro] = useState('')

  const meses = [
    ...new Set([chaveMesAtual(), ...transacoes.map((t) => String(t.data).slice(0, 7))]),
  ]
    .sort()
    .reverse()

  const carregar = useCallback(async () => {
    try {
      const resposta = await api.get('/metas/progresso', { params: { mes } })
      setProgresso(resposta.data)
    } catch {
      setErro('Não foi possível carregar as metas.')
    }
  }, [mes])

  useEffect(() => {
    carregar()
  }, [carregar, transacoes])

  const salvar = async (e) => {
    e.preventDefault()
    const numero = Number(valor)
    if (!categoriaId) {
      setErro('Escolha uma categoria.')
      return
    }
    if (!(numero > 0)) {
      setErro('O valor da meta deve ser maior que zero.')
      return
    }
    try {
      await api.put(`/metas/${categoriaId}`, { valor_limite: numero })
      setValor('')
      setErro('')
      await carregar()
    } catch {
      setErro('Não foi possível salvar a meta.')
    }
  }

  const remover = async (id) => {
    if (!window.confirm('Remover esta meta?')) return
    try {
      await api.delete(`/metas/${id}`)
      setErro('')
      await carregar()
    } catch {
      setErro('Não foi possível remover a meta.')
    }
  }

  return (
    <div className="panel">
      <div className="metas-topo">
        <h2>Metas de Gasto</h2>
        <select value={mes} onChange={(e) => setMes(e.target.value)} aria-label="Mês das metas">
          {meses.map((m) => (
            <option key={m} value={m}>
              {rotuloMes(m)}
            </option>
          ))}
        </select>
      </div>

      {progresso.length === 0 ? (
        <p>Nenhuma meta definida. Escolha uma categoria abaixo.</p>
      ) : (
        <div className="metas-lista">
          {progresso.map((m) => (
            <div key={m.categoria_id} className="meta-item">
              <div className="meta-linha">
                <strong>{m.categoria_nome}</strong>
                <span>
                  {brl.format(m.gasto)} de {brl.format(m.valor_limite)} ({m.percentual.toFixed(0)}%)
                </span>
              </div>
              <div className="meta-barra">
                <div
                  className={`meta-preenchimento ${classeDaBarra(m.percentual)}`}
                  style={{ width: `${Math.min(m.percentual, 100)}%` }}
                />
              </div>
              <div className="meta-linha meta-rodape">
                <span>
                  {m.restante >= 0
                    ? `Restam ${brl.format(m.restante)}`
                    : `Excedido em ${brl.format(-m.restante)}`}
                </span>
                <button type="button" onClick={() => remover(m.categoria_id)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form className="metas-form" onSubmit={salvar} noValidate>
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          <option value="">Categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Meta mensal (R$)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button type="submit">Salvar meta</button>
      </form>
      {erro && <span className="erro-campo">{erro}</span>}
    </div>
  )
}

export default PainelMetas
