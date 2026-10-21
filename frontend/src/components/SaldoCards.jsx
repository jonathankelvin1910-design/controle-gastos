function SaldoCards({ resumo }) {
  const { total_receitas, total_despesas, saldo } = resumo.resumo_geral

  const cards = [
    {
      titulo: 'Receitas',
      valor: total_receitas,
      classe: 'card-receitas'
    },
    {
      titulo: 'Despesas',
      valor: total_despesas,
      classe: 'card-despesas'
    },
    {
      titulo: 'Saldo',
      valor: saldo,
      classe: 'card-saldo'
    }
  ]

  return (
    <div className="cards-saldo">
      {cards.map((card) => (
        <div key={card.titulo} className={`card ${card.classe}`}>
          <h3>{card.titulo}</h3>
          <p>R$ {card.valor.toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}

export default SaldoCards
