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

function GraficoPizza({ por_categoria }) {
  const dados = (por_categoria || [])
    .map((categoria) => ({
      nome: categoria.categoria_nome,
      valor: categoria.total_despesas
    }))
    .filter((categoria) => categoria.valor > 0)
    .map((categoria, index) => ({ ...categoria, fill: cores[index % cores.length] }))

  return (
    <div className="grafico-pizza">
      <h2>Despesas por Categoria</h2>
      {dados.length === 0 ? (
        <p>Sem despesas registradas.</p>
      ) : (
        <PieChart width={420} height={320}>
          <Pie data={dados} dataKey="valor" nameKey="nome" outerRadius={90} label>
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </div>
  )
}

export default GraficoPizza
