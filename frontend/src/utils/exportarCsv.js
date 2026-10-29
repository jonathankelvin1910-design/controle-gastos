const escapar = (texto) => {
  const t = String(texto ?? '')
  return /[";\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t
}

const formatarData = (data) => {
  if (!data) return ''
  const [ano, mes, dia] = String(data).slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

const formatarNumero = (valor) => Number(valor).toFixed(2).replace('.', ',')

export function exportarTransacoesCsv(transacoes, nomeCategoria) {
  const cabecalho = ['Descrição', 'Valor', 'Tipo', 'Data', 'Categoria']
  const linhas = transacoes.map((t) => [
    t.descricao,
    formatarNumero(t.valor),
    t.tipo,
    formatarData(t.data),
    nomeCategoria(t.categoria_id),
  ])

  const conteudo = [cabecalho, ...linhas]
    .map((linha) => linha.map(escapar).join(';'))
    .join('\r\n')

  const blob = new Blob(['\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const hoje = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `transacoes-${hoje}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
