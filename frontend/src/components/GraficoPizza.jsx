import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const cores = [
  '#2196F3',
  '#f44336',
  '#4CAF50',
  '#FF9800',
  '#9C27B0',
  '#00BCD4',
  '#795548',
  '#E91E63',
  '#607D8B',
  '#FFC107'
]

const formatarValor = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div>
        <p>{payload[0].name}</p>
        <p>{formatarValor(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

function GraficoPizza({ por_categoria }) {
  const dados = (por_categoria || [])
    .map((categoria) => ({
      nome: categoria.categoria_nome,
      valor: categoria.total_despesas
    }))
    .filter((categoria) => categoria.valor > 0)
    .map((categoria, index) => ({ ...categoria, fill: cores[index % cores.length] }))

  return (
    <div className="grafico-pizza" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Despesas por Categoria</h2>
      {dados.length === 0 ? (
        <p>Sem despesas registradas.</p>
      ) : (
        <PieChart width={420} height={320}>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="nome"
            outerRadius={90}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      )}
    </div>
  )
}

export default GraficoPizza
