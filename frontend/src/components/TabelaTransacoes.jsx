import { deleteTransacao } from '../api/api'
import { useState } from 'react'

const formatarData = (data) => {
  if (!data) return '-'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const formatarValor = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

function TabelaTransacoes({ transacoes, recarregar, categorias = [], onEditar }) {
  const [colunaOrdenacao, setColunaOrdenacao] = useState('data')
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState('desc')

  const getNomeCategoria = (categoriaId) => {
    if (!categoriaId) return 'Sem categoria'
    const categoria = categorias.find((c) => c.id === Number(categoriaId))
    return categoria ? categoria.nome : 'Sem categoria'
  }

  const handleOrdenar = (coluna) => {
    if (coluna === colunaOrdenacao) {
      setDirecaoOrdenacao((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setColunaOrdenacao(coluna)
      setDirecaoOrdenacao('asc')
    }
  }

  const transacoesOrdenadas = [...transacoes].sort((a, b) => {
    let comparacao = 0
    if (colunaOrdenacao === 'descricao') {
      comparacao = String(a.descricao ?? '').localeCompare(String(b.descricao ?? ''), 'pt-BR')
    } else if (colunaOrdenacao === 'categoria') {
      comparacao = getNomeCategoria(a.categoria_id).localeCompare(getNomeCategoria(b.categoria_id), 'pt-BR')
    } else if (colunaOrdenacao === 'valor') {
      comparacao = Number(a.valor) - Number(b.valor)
    } else if (colunaOrdenacao === 'data') {
      comparacao = String(a.data).localeCompare(String(b.data))
    } else if (colunaOrdenacao === 'tipo') {
      comparacao = String(a.tipo).localeCompare(String(b.tipo))
    }
    return direcaoOrdenacao === 'asc' ? comparacao : -comparacao
  })

  const setaPara = (coluna) => {
    if (coluna !== colunaOrdenacao) return ''
    return direcaoOrdenacao === 'asc' ? ' ▲' : ' ▼'
  }

  const handleExcluir = async (id) => {
    if (window.confirm('Excluir esta transação?')) {
      try {
        await deleteTransacao(id)
        recarregar()
      } catch {
        window.alert('Erro ao excluir transação.')
      }
    }
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table className="tabela-transacoes" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th onClick={() => handleOrdenar('descricao')} style={{ cursor: 'pointer' }}>
              Descrição{setaPara('descricao')}
            </th>
            <th onClick={() => handleOrdenar('valor')} style={{ cursor: 'pointer' }}>
              Valor{setaPara('valor')}
            </th>
            <th onClick={() => handleOrdenar('tipo')} style={{ cursor: 'pointer' }}>
              Tipo{setaPara('tipo')}
            </th>
            <th onClick={() => handleOrdenar('data')} style={{ cursor: 'pointer' }}>
              Data{setaPara('data')}
            </th>
            <th onClick={() => handleOrdenar('categoria')} style={{ cursor: 'pointer' }}>
              Categoria{setaPara('categoria')}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transacoesOrdenadas.length === 0 ? (
            <tr>
              <td colSpan="6">Nenhuma transação registrada.</td>
            </tr>
          ) : (
            transacoesOrdenadas.map((t) => (
              <tr key={t.id}>
                <td>{t.descricao}</td>
                <td className={t.tipo === 'receita' ? 'positivo' : 'negativo'}>
                  {formatarValor(t.valor)}
                </td>
                <td style={{ color: t.tipo === 'receita' ? '#16a34a' : '#dc2626' }}>
                  {t.tipo}
                </td>
                <td>{formatarData(t.data)}</td>
                <td>{getNomeCategoria(t.categoria_id)}</td>
                <td>
                  {onEditar && (
                    <button onClick={() => onEditar(t)} style={{ marginRight: '8px' }}>
                      Editar
                    </button>
                  )}
                  <button onClick={() => handleExcluir(t.id)}>Excluir</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TabelaTransacoes
