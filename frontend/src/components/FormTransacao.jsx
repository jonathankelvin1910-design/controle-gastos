import { useState, useEffect } from 'react'
import { createTransacao, updateTransacao } from '../api/api'

function FormTransacao({ categorias, onCriado, transacaoEdicao, onCancelarEdicao }) {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('receita')
  const [data, setData] = useState(new Date().toISOString().slice(0, 10))
  const [categoriaId, setCategoriaId] = useState('')
  const [erro, setErro] = useState('')
  const [erros, setErros] = useState({})

  useEffect(() => {
    if (transacaoEdicao) {
      setDescricao(transacaoEdicao.descricao)
      setValor(String(transacaoEdicao.valor))
      setTipo(transacaoEdicao.tipo)
      setData(transacaoEdicao.data)
      setCategoriaId(transacaoEdicao.categoria_id ? String(transacaoEdicao.categoria_id) : '')
    } else {
      setDescricao('')
      setValor('')
      setTipo('receita')
      setData(new Date().toISOString().slice(0, 10))
      setCategoriaId('')
    }
    setErro('')
    setErros({})
  }, [transacaoEdicao])

  const resetar = () => {
    setDescricao('')
    setValor('')
    setTipo('receita')
    setData(new Date().toISOString().slice(0, 10))
    setCategoriaId('')
    setErros({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    const novosErros = {}

    if (!descricao.trim()) {
      novosErros.descricao = 'Informe uma descrição.'
    }

    if (!(Number(valor) > 0)) {
      novosErros.valor = 'O valor deve ser maior que zero.'
    }

    if (!data) {
      novosErros.data = 'Informe a data.'
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    setErros({})
    const dados = {
      descricao,
      valor: Number(valor),
      tipo,
      data,
      categoria_id: categoriaId ? Number(categoriaId) : null
    }
    try {
      if (transacaoEdicao) {
        await updateTransacao(transacaoEdicao.id, dados)
      } else {
        await createTransacao(dados)
      }
      resetar()
      onCriado()
      if (transacaoEdicao) {
        onCancelarEdicao()
      }
    } catch {
      setErro('Erro ao salvar transação. Tente novamente.')
    }
  }

  return (
    <form className="form-transacao" onSubmit={handleSubmit} noValidate>
      <h2>{transacaoEdicao ? 'Editar Transação' : 'Nova Transação'}</h2>
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
            onChange={(e) => {
              setDescricao(e.target.value)
              if (erros.descricao) setErros({ ...erros, descricao: '' })
            }}
            required
          />
          {erros.descricao && <span className="erro-campo">{erros.descricao}</span>}
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
            onChange={(e) => {
              setValor(e.target.value)
              if (erros.valor) setErros({ ...erros, valor: '' })
            }}
            required
          />
          {erros.valor && <span className="erro-campo">{erros.valor}</span>}
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
            onChange={(e) => {
              setData(e.target.value)
              if (erros.data) setErros({ ...erros, data: '' })
            }}
            required
          />
          {erros.data && <span className="erro-campo">{erros.data}</span>}
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

        {transacaoEdicao ? (
          <>
            <button type="submit" className="btn-adicionar" style={{ padding: '8px 16px' }}>
              Salvar
            </button>
            <button type="button" className="btn-cancelar" onClick={onCancelarEdicao} style={{ padding: '8px 16px' }}>
              Cancelar
            </button>
          </>
        ) : (
          <button type="submit" className="btn-adicionar" style={{ padding: '8px 16px' }}>
            Adicionar
          </button>
        )}
      </div>
    </form>
  )
}

export default FormTransacao
