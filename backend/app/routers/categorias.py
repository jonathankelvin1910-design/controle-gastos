from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas import (
    CategoriaCreate,
    CategoriaResponse,
    CategoriaUpdate,
)

router = APIRouter(prefix="/categorias", tags=["categorias"])


@router.get("/", response_model=list[CategoriaResponse])
def listar_categorias(db: Session = Depends(get_db)):
    return crud.get_categorias(db)


@router.get("/{categoria_id}", response_model=CategoriaResponse)
def obter_categoria(
    categoria_id: int, db: Session = Depends(get_db)
):
    categoria = crud.get_categoria(db, categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=404, detail="Categoria não encontrada"
        )
    return categoria


@router.post(
    "/", response_model=CategoriaResponse, status_code=201
)
def criar_categoria(
    dados: CategoriaCreate, db: Session = Depends(get_db)
):
    return crud.create_categoria(db, dados.nome)


@router.put("/{categoria_id}", response_model=CategoriaResponse)
def atualizar_categoria(
    categoria_id: int,
    dados: CategoriaUpdate,
    db: Session = Depends(get_db),
):
    categoria = crud.get_categoria(db, categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=404, detail="Categoria não encontrada"
        )
    return crud.update_categoria(db, categoria, dados.nome)


@router.delete("/{categoria_id}", status_code=204)
def excluir_categoria(
    categoria_id: int, db: Session = Depends(get_db)
):
    categoria = crud.get_categoria(db, categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=404, detail="Categoria não encontrada"
        )
    crud.delete_categoria(db, categoria)
