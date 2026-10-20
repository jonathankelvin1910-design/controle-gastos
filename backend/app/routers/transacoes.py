from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas import (
    TransacaoCreate,
    TransacaoResponse,
    TransacaoUpdate,
)

router = APIRouter(prefix="/transacoes", tags=["transacoes"])


@router.get("/", response_model=list[TransacaoResponse])
def listar_transacoes(db: Session = Depends(get_db)):
    return crud.get_transacoes(db)


@router.get("/{transacao_id}", response_model=TransacaoResponse)
def obter_transacao(
    transacao_id: int, db: Session = Depends(get_db)
):
    transacao = crud.get_transacao(db, transacao_id)
    if not transacao:
        raise HTTPException(
            status_code=404, detail="Transação não encontrada"
        )
    return transacao


@router.post(
    "/", response_model=TransacaoResponse, status_code=201
)
def criar_transacao(
    dados: TransacaoCreate, db: Session = Depends(get_db)
):
    return crud.create_transacao(
        db,
        descricao=dados.descricao,
        valor=dados.valor,
        tipo=dados.tipo,
        data=dados.data,
        categoria_id=dados.categoria_id,
    )


@router.put("/{transacao_id}", response_model=TransacaoResponse)
def atualizar_transacao(
    transacao_id: int,
    dados: TransacaoUpdate,
    db: Session = Depends(get_db),
):
    transacao = crud.get_transacao(db, transacao_id)
    if not transacao:
        raise HTTPException(
            status_code=404, detail="Transação não encontrada"
        )
    return crud.update_transacao(
        db, transacao, **dados.model_dump(exclude_unset=True)
    )


@router.delete("/{transacao_id}", status_code=204)
def excluir_transacao(
    transacao_id: int, db: Session = Depends(get_db)
):
    transacao = crud.get_transacao(db, transacao_id)
    if not transacao:
        raise HTTPException(
            status_code=404, detail="Transação não encontrada"
        )
    crud.delete_transacao(db, transacao)
