from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import routers

# Cria as tabelas que ainda não existirem (opcional se o schema.sql já
# tiver sido executado). Não sobrescreve tabelas existentes.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Controle de Gastos",
    description="API de controle de receitas e despesas.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routers.categorias.router)
app.include_router(routers.transacoes.router)
app.include_router(routers.resumo.router)


@app.get("/", tags=["raiz"])
def root():
    return {"message": "Bem-vindo à API de Controle de Gastos"}


@app.get("/health", tags=["raiz"])
def health():
    return {"status": "ok"}
