import { deleteTransacao } from '../api/api'

const formatarData = (data) => {
  if (!data) return '-'
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function TabelaTransacoes({ transacoes, recarregar }) {
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
    <table className="tabela-transacoes">
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
            <td colSpan="6">Nenhuma transação registrada.</td>
          </tr>
        ) : (
          transacoes.map((t) => (
            <tr key={t.id}>
              <td>{t.descricao}</td>
              <td className={t.tipo === 'receita' ? 'positivo' : 'negativo'}>
                R$ {t.valor.toFixed(2)}
              </td>
              <td>{t.tipo}</td>
              <td>{formatarData(t.data)}</td>
              <td>{t.categoria_nome ?? (t.categoria_id ?? '-')}</td>
              <td>
                <button onClick={() => handleExcluir(t.id)}>Excluir</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

export default TabelaTransacoes
