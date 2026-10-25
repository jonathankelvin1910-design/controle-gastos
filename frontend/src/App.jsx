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
      </div>

      <TabelaTransacoes
        transacoes={transacoes}
        recarregar={recarregar}
        categorias={categorias}
        onEditar={handleEditar}
      />
    </div>
  )
}

export default App
