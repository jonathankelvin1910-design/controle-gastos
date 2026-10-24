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

      <div
        className="form-campos"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label htmlFor="valor">Valor</label>
          <input
            id="valor"
            type="number"
            step="0.01"
            min="0"
            placeholder="Valor"
            value={valor === '' ? '' : valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label htmlFor="tipo">Tipo</label>
          <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label htmlFor="data">Data</label>
          <input
            id="data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            <option value="">Sem categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-adicionar" style={{ padding: '8px 16px' }}>
          Adicionar
        </button>
      </div>
    </form>
  )
}

export default FormTransacao
