import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COR_POR_CATEGORIA = {
  'Alimentação': '#3b82f6',
  'Moradia': '#f59e0b',
  'Saúde': '#a855f7',
  'Transporte': '#06b6d4',
  'Educação': '#ef4444',
  'Lazer': '#22c55e',
  'Outros': '#94a3b8',
  'Salário': '#10b981',
  'Sem categoria': '#64748b',
}
const CORES_RESERVA = ['#e879f9', '#fb7185', '#facc15', '#2dd4bf', '#818cf8']
const RADIAN = Math.PI / 180

const corDaCategoria = (nome, indice) =>
  COR_POR_CATEGORIA[nome] ?? CORES_RESERVA[indice % CORES_RESERVA.length]

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
    <div className="panel painel-grafico">
      <h2>Despesas por Categoria</h2>
      {dados.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', margin: '48px 0' }}>
          Sem despesas para mostrar.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie data={dados} dataKey="valor" nameKey="nome" outerRadius="80%" labelLine={false} label={rotuloPorcentagem} stroke="#131a2e">
              {dados.map((d, i) => (
                <Cell key={d.nome} fill={corDaCategoria(d.nome, i)} />
              ))}
            </Pie>
            <Tooltip formatter={(valor) => formatarMoeda(valor)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default GraficoPizza
