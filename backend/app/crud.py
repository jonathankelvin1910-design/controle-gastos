from typing import Any, List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Categoria, Transacao


# --------------------------- Categorias ---------------------------

def get_categorias(db: Session) -> List[Categoria]:
    return db.execute(
        select(Categoria).order_by(Categoria.nome.asc())
    ).scalars().all()


def get_categoria(db: Session, categoria_id: int) -> Optional[Categoria]:
    return db.get(Categoria, categoria_id)


def create_categoria(db: Session, nome: str) -> Categoria:
    categoria = Categoria(nome=nome)
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria


def update_categoria(
    db: Session, categoria: Categoria, nome: Optional[str]
) -> Categoria:
    if nome is not None:
        categoria.nome = nome
    db.commit()
    db.refresh(categoria)
    return categoria


def delete_categoria(db: Session, categoria: Categoria) -> None:
    db.delete(categoria)
    db.commit()


# --------------------------- Transações ---------------------------

def get_transacoes(db: Session) -> List[Transacao]:
    return db.execute(
        select(Transacao).order_by(Transacao.data.desc())
    ).scalars().all()


def get_transacao(db: Session, transacao_id: int) -> Optional[Transacao]:
    return db.get(Transacao, transacao_id)


def create_transacao(
    db: Session,
    descricao: str,
    valor: float,
    tipo: str,
    data: Any,
    categoria_id: Optional[int] = None,
) -> Transacao:
    transacao = Transacao(
        descricao=descricao,
        valor=valor,
        tipo=tipo,
        data=data,
        categoria_id=categoria_id,
    )
    db.add(transacao)
    db.commit()
    db.refresh(transacao)
    return transacao


def update_transacao(
    db: Session, transacao: Transacao, **kwargs: Any
) -> Transacao:
    for key, value in kwargs.items():
        if value is not None and hasattr(transacao, key):
            setattr(transacao, key, value)
    db.commit()
    db.refresh(transacao)
    return transacao


def delete_transacao(db: Session, transacao: Transacao) -> None:
    db.delete(transacao)
    db.commit()
