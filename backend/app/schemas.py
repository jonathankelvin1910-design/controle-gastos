from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field


# --------------------------- Categorias ---------------------------

class CategoriaBase(BaseModel):
    nome: str


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nome: Optional[str] = None


class CategoriaResponse(CategoriaBase):
    id: int

    model_config = {"from_attributes": True}


# --------------------------- Transações ---------------------------

class TransacaoBase(BaseModel):
    descricao: str
    valor: float = Field(gt=0)
    tipo: str
    data: date
    categoria_id: Optional[int] = None


class TransacaoCreate(TransacaoBase):
    pass


class TransacaoUpdate(BaseModel):
    descricao: Optional[str] = None
    valor: Optional[float] = Field(default=None, gt=0)
    tipo: Optional[str] = None
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
