import { useEffect, useState } from 'react'
import SaldoCards from './components/SaldoCards'
import FormTransacao from './components/FormTransacao'
import TabelaTransacoes from './components/TabelaTransacoes'
import GraficoPizza from './components/GraficoPizza'
import { api } from './api/api'

function App() {
  const [resumo, setResumo] = useState(null)
  const [transacoes, setTransacoes] = useState([])
  const [categorias, setCategorias] = useState([])
  const [transacaoEdicao, setTransacaoEdicao] = useState(null)
  const [filtroMes, setFiltroMes] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')

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
    return true
  })

  useEffect(() => {
    recarregar()
  }, [])

  return (
    <div className="app" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px', boxSizing: 'border-box' }}>
      <h1>Controle de Gastos</h1>

      {resumo && <SaldoCards resumo={resumo} />}

      <div className="grade">
        <FormTransacao
          categorias={categorias}
          onCriado={recarregar}
          transacaoEdicao={transacaoEdicao}
          onEditar={handleEditar}
          onCancelarEdicao={handleCancelarEdicao}
        />
        <GraficoPizza por_categoria={resumo?.por_categoria} />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
        <div>
          <label>Mês</label>
          <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
            <option value="">Todos</option>
            {meses.map(mes => (
              <option key={mes} value={mes}>
                {mes.split('-')[1]}/${mes.split('-')[0]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Categoria</label>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TabelaTransacoes
        transacoes={transacoesFiltradas}
        recarregar={recarregar}
        categorias={categorias}
        onEditar={handleEditar}
      />
    </div>
  )
}

export default App
