from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, crud_metas
from app.database import get_db
from app.schemas import MetaProgresso, MetaResponse, MetaUpdate

router = APIRouter(prefix="/metas", tags=["metas"])


@router.get("/", response_model=list[MetaResponse])
def listar_metas(db: Session = Depends(get_db)):
    return crud_metas.listar_metas(db)


@router.get("/progresso", response_model=list[MetaProgresso])
def progresso_metas(
    mes: Optional[str] = Query(None, pattern=r"^\d{4}-(0[1-9]|1[0-2])$"),
    db: Session = Depends(get_db),
):
    if mes:
        ano, numero = int(mes[:4]), int(mes[5:7])
    else:
        hoje = date.today()
        ano, numero = hoje.year, hoje.month
    return crud_metas.progresso_metas(db, ano, numero)


@router.put("/{categoria_id}", response_model=MetaResponse)
def definir_meta(
    categoria_id: int, dados: MetaUpdate, db: Session = Depends(get_db)
):
    categoria = crud.get_categoria(db, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    meta = crud_metas.definir_meta(db, categoria_id, dados.valor_limite)
    return {
        "categoria_id": meta.categoria_id,
        "categoria_nome": categoria.nome,
        "valor_limite": float(meta.valor_limite),
    }


@router.delete("/{categoria_id}", status_code=204)
def remover_meta(categoria_id: int, db: Session = Depends(get_db)):
    if not crud_metas.remover_meta(db, categoria_id):
        raise HTTPException(status_code=404, detail="Meta não encontrada")
