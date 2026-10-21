import { useState } from 'react'
import { createTransacao } from '../api/api'

function FormTransacao({ categorias, onCriado }) {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('receita')
  const [data, setData] = useState(new Date().toISOString().slice(0, 10))
  const [categoriaId, setCategoriaId] = useState('')
  const [erro, setErro] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    try {
      await createTransacao({
        descricao,
        valor: Number(valor),
        tipo,
        data,
        categoria_id: categoriaId ? Number(categoriaId) : null
      })
      setDescricao('')
      setValor('')
      setTipo('receita')
      setData(new Date().toISOString().slice(0, 10))
      setCategoriaId('')
      onCriado()
    } catch {
      setErro('Erro ao criar transação. Tente novamente.')
    }
  }

  return (
    <form className="form-transacao" onSubmit={handleSubmit}>
      <h2>Nova Transação</h2>
      {erro && <p className="erro">{erro}</p>}

      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
      />

      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="Valor"
        value={valor === '' ? '' : valor}
        onChange={(e) => setValor(e.target.value)}
        required
      />

      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>

      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        required
      />

      <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
        <option value="">Sem categoria</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nome}
          </option>
        ))}
      </select>

      <button type="submit">Adicionar</button>
    </form>
  )
}

export default FormTransacao
