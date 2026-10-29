import { useEffect, useState } from 'react'
import SaldoCards from './components/SaldoCards'
import FormTransacao from './components/FormTransacao'
import TabelaTransacoes from './components/TabelaTransacoes'
import GraficoPizza from './components/GraficoPizza'
import GraficoMensal from './components/GraficoMensal'
import { api } from './api/api'

function App() {
  const [resumo, setResumo] = useState(null)
  const [transacoes, setTransacoes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [transacaoEdicao, setTransacaoEdicao] = useState(null)
  const [filtroMes, setFiltroMes] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [busca, setBusca] = useState('')

  const recarregar = async () => {
    try {
      const [resumoResp, transacoesResp, categoriasResp] = await Promise.all([
        api.get('/resumo/'),
        api.get('/transacoes/'),
        api.get('/categorias/')
      ])
      setResumo(resumoResp.data)
      setTransacoes(transacoesResp.data)
      setCategorias(categoriasResp.data)
    } catch {
      window.alert('Não foi possível conectar ao backend.')
    }
  }

  const handleEditar = (transacao) => {
    setTransacaoEdicao(transacao)
  }

  const handleCancelarEdicao = () => {
    setTransacaoEdicao(null)
  }

  const meses = [...new Set(transacoes.map(t => t.data?.slice(0, 7)))].filter(Boolean).sort((a, b) => b.localeCompare(a))

  const transacoesFiltradas = transacoes.filter(t => {
    if (filtroMes && t.data?.slice(0, 7) !== filtroMes) return false
    if (filtroCategoria && Number(t.categoria_id) !== Number(filtroCategoria)) return false
    if (busca.trim()) {
      const descricaoNormalizada = String(t.descricao ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
      const buscaNormalizada = busca
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
      if (!descricaoNormalizada.includes(buscaNormalizada)) return false
    }
    return true
  })

  const getNomeCategoria = (categoriaId) => {
    if (!categoriaId) return 'Sem categoria'
    const categoria = categorias.find((c) => c.id === Number(categoriaId))
    return categoria ? categoria.nome : 'Sem categoria'
  }

  const resumoFiltrado = (() => {
    const agrupado = {}
    for (const t of transacoesFiltradas) {
      const categoriaId = t.categoria_id != null ? Number(t.categoria_id) : null
      const valor = Number(t.valor)
      if (!agrupado[categoriaId]) {
        agrupado[categoriaId] = {
          categoria_id: categoriaId,
          categoria_nome: getNomeCategoria(categoriaId),
          total_receitas: 0,
          total_despesas: 0
        }
      }
      if (t.tipo === 'receita') {
        agrupado[categoriaId].total_receitas += valor
      } else {
        agrupado[categoriaId].total_despesas += valor
      }
    }
    const por_categoria = Object.values(agrupado).map((c) => ({
      ...c,
      saldo: c.total_receitas - c.total_despesas
    }))
    const total_receitas = por_categoria.reduce((acc, c) => acc + c.total_receitas, 0)
    const total_despesas = por_categoria.reduce((acc, c) => acc + c.total_despesas, 0)
    return {
      resumo_geral: {
        total_receitas,
        total_despesas,
        saldo: total_receitas - total_despesas
      },
      por_categoria
    }
  })()

  useEffect(() => {
    recarregar()
  }, [])

  return (
    <div className="app" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px', boxSizing: 'border-box' }}>
      <h1>Controle de Gastos</h1>

      {resumoFiltrado && <SaldoCards resumo={resumoFiltrado} />}

      <div className="grade">
        <FormTransacao
          categorias={categorias}
          onCriado={recarregar}
          transacaoEdicao={transacaoEdicao}
          onEditar={handleEditar}
          onCancelarEdicao={handleCancelarEdicao}
        />
        <GraficoPizza por_categoria={resumoFiltrado.por_categoria} />
      </div>

      <GraficoMensal transacoes={transacoes} />

      <div className="panel">
        <h2>Transações</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label>Mês</label>
            <select style={{ width: '200px' }} value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
              <option value="">Todos</option>
              {meses.map(mes => (
                <option key={mes} value={mes}>
                  {mes.split('-')[1]}/${mes.split('-')[0]}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label>Categoria</label>
            <select style={{ width: '200px' }} value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="">Todas</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label>Buscar</label>
            <input
              type="text"
              placeholder="Buscar por descrição..."
              style={{ width: '200px' }}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <TabelaTransacoes
          transacoes={transacoesFiltradas}
          recarregar={recarregar}
          categorias={categorias}
          onEditar={handleEditar}
        />
      </div>
    </div>
  )
}

export default App
