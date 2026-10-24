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

  useEffect(() => {
    recarregar()
  }, [])

  return (
    <div className="app">
      <h1>Controle de Gastos</h1>

      {resumo && <SaldoCards resumo={resumo} />}

      <div className="grade">
        <FormTransacao categorias={categorias} onCriado={recarregar} />
        <GraficoPizza por_categoria={resumo?.por_categoria} />
      </div>

      <TabelaTransacoes transacoes={transacoes} recarregar={recarregar} categorias={categorias} />
    </div>
  )
}

export default App
