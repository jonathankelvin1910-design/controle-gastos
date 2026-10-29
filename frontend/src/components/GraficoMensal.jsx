import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function agruparPorMes(transacoes) {
  const mapa = {}
  for (const t of transacoes) {
    const chave = String(t.data).slice(0, 7) // AAAA-MM
    if (!mapa[chave]) mapa[chave] = { chave, receitas: 0, despesas: 0 }
    const valor = Number(t.valor) || 0
    if (t.tipo === 'receita') mapa[chave].receitas += valor
    else mapa[chave].despesas += valor
  }
  return Object.values(mapa)
    .sort((a, b) => a.chave.localeCompare(b.chave))
    .map((m) => {
      const [ano, mes] = m.chave.split('-')
      return { ...m, mes: `${MESES[Number(mes) - 1]}/${ano.slice(2)}` }
    })
}

function GraficoMensal({ transacoes }) {
  const dados = agruparPorMes(transacoes)

  return (
    <div className="panel painel-grafico">
      <h2>Receitas e Despesas por Mês</h2>
      {dados.length === 0 ? (
        <p>Sem transações para mostrar.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26324f" />
            <XAxis dataKey="mes" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" tickFormatter={(v) => `R$ ${v}`} width={80} />
            <Tooltip
              formatter={(v) => brl.format(v)}
              contentStyle={{ background: '#1a2440', border: '1px solid #26324f', borderRadius: 8 }}
              cursor={{ fill: 'rgba(99,102,241,0.1)' }}
            />
            <Legend />
            <Bar dataKey="receitas" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default GraficoMensal
