from datetime import date

from typing import Annotated, List, Literal, Optional

from pydantic import BaseModel, Field, StringConstraints


# Limites iguais aos das colunas do banco (database/schema.sql)
Nome = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]
Descricao = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]
Valor = Annotated[float, Field(gt=0, le=99999999.99)]
Tipo = Literal["receita", "despesa"]


# --------------------------- Categorias ---------------------------

class CategoriaBase(BaseModel):
    nome: Nome


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nome: Optional[Nome] = None


class CategoriaResponse(CategoriaBase):
    id: int

    model_config = {"from_attributes": True}


# --------------------------- Transações ---------------------------

class TransacaoBase(BaseModel):
    descricao: Descricao
    valor: Valor
    tipo: Tipo
    data: date
    categoria_id: Optional[int] = None


class TransacaoCreate(TransacaoBase):
    pass


class TransacaoUpdate(BaseModel):
    descricao: Optional[Descricao] = None
    valor: Optional[Valor] = None
    tipo: Optional[Tipo] = None
    data: Optional[date] = None
    categoria_id: Optional[int] = None


class TransacaoResponse(TransacaoBase):
    id: int

    model_config = {"from_attributes": True}


# ----------------------------- Resumo -----------------------------

class ResumoCategoria(BaseModel):
    categoria_id: Optional[int]
    categoria_nome: Optional[str]
    total_receitas: float
    total_despesas: float
    saldo: float


class ResumoGeral(BaseModel):
    total_receitas: float
    total_despesas: float
    saldo: float


class ResumoResponse(BaseModel):
    resumo_geral: ResumoGeral
    por_categoria: List[ResumoCategoria]


# ------------------------------ Metas ------------------------------

class MetaUpdate(BaseModel):
    valor_limite: Valor


class MetaResponse(BaseModel):
    categoria_id: int
    categoria_nome: str
    valor_limite: float


class MetaProgresso(BaseModel):
    categoria_id: int
    categoria_nome: str
    valor_limite: float
    gasto: float
    percentual: float
    restante: float
