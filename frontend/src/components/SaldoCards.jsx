function SaldoCards({ resumo }) {
  const { total_receitas, total_despesas, saldo } = resumo.resumo_geral

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const cards = [
    {
      titulo: 'Receitas',
      valor: total_receitas,
      classe: 'card-receitas',
      cor: '#16a34a'
    },
    {
      titulo: 'Despesas',
      valor: total_despesas,
      classe: 'card-despesas',
      cor: '#dc2626'
    },
    {
      titulo: 'Saldo',
      valor: saldo,
      classe: 'card-saldo',
      cor: saldo >= 0 ? '#16a34a' : '#dc2626'
    }
  ]

  const containerStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }

  const cardStyle = {
    flex: 1,
    minWidth: '180px',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.05)'
  }

  return (
    <div className="cards-saldo" style={containerStyle}>
      {cards.map((card) => (
        <div key={card.titulo} className={`card ${card.classe}`} style={cardStyle}>
          <h3>{card.titulo}</h3>
          <p style={{ color: card.cor }}>{formatarValor(card.valor)}</p>
        </div>
      ))}
    </div>
  )
}

export default SaldoCards
