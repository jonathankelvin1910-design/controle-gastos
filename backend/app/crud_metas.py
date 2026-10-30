from datetime import date
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Categoria, Meta, Transacao


def listar_metas(db: Session) -> list[dict]:
    linhas = (
        db.query(Meta, Categoria.nome)
        .join(Categoria, Categoria.id == Meta.categoria_id)
        .order_by(Categoria.nome)
        .all()
    )
    return [
        {
            "categoria_id": meta.categoria_id,
            "categoria_nome": nome,
            "valor_limite": float(meta.valor_limite),
        }
        for meta, nome in linhas
    ]


def definir_meta(db: Session, categoria_id: int, valor_limite: float) -> Meta:
    limite = Decimal(str(valor_limite))
    meta = db.query(Meta).filter(Meta.categoria_id == categoria_id).first()
    if meta:
        meta.valor_limite = limite
    else:
        meta = Meta(categoria_id=categoria_id, valor_limite=limite)
        db.add(meta)
    db.commit()
    db.refresh(meta)
    return meta


def remover_meta(db: Session, categoria_id: int) -> bool:
    meta = db.query(Meta).filter(Meta.categoria_id == categoria_id).first()
    if not meta:
        return False
    db.delete(meta)
    db.commit()
    return True


def progresso_metas(db: Session, ano: int, mes: int) -> list[dict]:
    inicio = date(ano, mes, 1)
    fim = date(ano + 1, 1, 1) if mes == 12 else date(ano, mes + 1, 1)

    gastos = dict(
        db.query(Transacao.categoria_id, func.coalesce(func.sum(Transacao.valor), 0))
        .filter(
            Transacao.tipo == "despesa",
            Transacao.data >= inicio,
            Transacao.data < fim,
        )
        .group_by(Transacao.categoria_id)
        .all()
    )

    resultado = []
    for meta in listar_metas(db):
        limite = meta["valor_limite"]
        gasto = float(gastos.get(meta["categoria_id"], 0))
        resultado.append(
            {
                **meta,
                "gasto": round(gasto, 2),
                "percentual": round(gasto / limite * 100, 1) if limite else 0.0,
                "restante": round(limite - gasto, 2),
            }
        )
    return resultado
