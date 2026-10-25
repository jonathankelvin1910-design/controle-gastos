import { deleteTransacao } from '../api/api'

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
  const getNomeCategoria = (categoriaId) => {
    if (!categoriaId) return 'Sem categoria'
    const categoria = categorias.find((c) => c.id === Number(categoriaId))
    return categoria ? categoria.nome : 'Sem categoria'
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
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Categoria</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transacoes.length === 0 ? (
            <tr>
              <td colSpan="6">Nenhum transação registrada.</td>
            </tr>
          ) : (
            transacoes.map((t) => (
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
