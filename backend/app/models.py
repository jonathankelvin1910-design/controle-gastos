from sqlalchemy import (
    Column,
    Date,
    DECIMAL,
    Enum,
    ForeignKey,
    Integer,
    String,
    TIMESTAMP,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now)

    transacoes = relationship(
        "Transacao", back_populates="categoria", cascade="all, delete-orphan"
    )


class Transacao(Base):
    __tablename__ = "transacoes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    descricao = Column(String(255), nullable=False)
    valor = Column(DECIMAL(10, 2), nullable=False)
    tipo = Column(Enum("receita", "despesa"), nullable=False)
    data = Column(Date, nullable=False)
    categoria_id = Column(
        Integer, ForeignKey("categorias.id"), nullable=True
    )

    categoria = relationship("Categoria", back_populates="transacoes")
