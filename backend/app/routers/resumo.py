from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ResumoResponse

router = APIRouter(prefix="/resumo", tags=["resumo"])


@router.get("/", response_model=ResumoResponse)
def obter_resumo(db: Session = Depends(get_db)):
    query_por_categoria = text(
        """
        SELECT
            c.id AS categoria_id,
            c.nome AS categoria_nome,
            COALESCE(
                SUM(CASE WHEN t.tipo = 'receita' THEN t.valor ELSE 0 END),
                0
            ) AS total_receitas,
            COALESCE(
                SUM(CASE WHEN t.tipo = 'despesa' THEN t.valor ELSE 0 END),
                0
            ) AS total_despesas,
            COALESCE(
                SUM(CASE WHEN t.tipo = 'receita'
                    THEN t.valor ELSE -t.valor END),
                0
            ) AS saldo
        FROM categorias c
        LEFT JOIN transacoes t ON t.categoria_id = c.id
        GROUP BY c.id, c.nome
        ORDER BY c.nome
        """
    )

    por_categoria = []
    for row in db.execute(query_por_categoria):
        por_categoria.append(
            {
                "categoria_id": row.categoria_id,
                "categoria_nome": row.categoria_nome,
                "total_receitas": float(row.total_receitas),
                "total_despesas": float(row.total_despesas),
                "saldo": float(row.saldo),
            }
        )

    query_geral = text(
        """
        SELECT
            COALESCE(
                SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END),
                0
            ) AS total_receitas,
            COALESCE(
                SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END),
                0
            ) AS total_despesas,
            COALESCE(
                SUM(CASE WHEN tipo = 'receita'
                    THEN valor ELSE -valor END),
                0
            ) AS saldo
        FROM transacoes
        """
    )

    row = db.execute(query_geral).mappings().one()

    return {
        "resumo_geral": {
            "total_receitas": float(row["total_receitas"]),
            "total_despesas": float(row["total_despesas"]),
            "saldo": float(row["saldo"]),
        },
        "por_categoria": por_categoria,
    }
