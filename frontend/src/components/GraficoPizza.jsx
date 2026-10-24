import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const CORES = ['#2196f3', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#e91e63', '#8bc34a']
const RADIAN = Math.PI / 180

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

function rotuloPorcentagem({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null
  const raio = innerRadius + (outerRadius - innerRadius) * 0.6
  const x = cx + raio * Math.cos(-midAngle * RADIAN)
  const y = cy + raio * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight="bold">
      {`${Math.round(percent * 100)}%`}
    </text>
  )
}

function GraficoPizza({ por_categoria }) {
  const dados = (por_categoria ?? [])
    .filter((c) => Number(c.total_despesas) > 0)
    .map((c) => ({ nome: c.categoria_nome, valor: Number(c.total_despesas) }))

  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <h2>Despesas por Categoria</h2>
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie data={dados} dataKey="valor" nameKey="nome" outerRadius="80%" labelLine={false} label={rotuloPorcentagem}>
            {dados.map((_, i) => (
              <Cell key={i} fill={CORES[i % CORES.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(valor) => formatarMoeda(valor)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default GraficoPizza
