from datetime import datetime
from pathlib import Path
from time import sleep

import json

from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# Cria a aplicacao FastAPI. O titulo aparece na pagina /docs.
app = FastAPI(title="API do Estacionamento Inteligente")

# Permite que o frontend acesse a API durante o desenvolvimento local.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Caminho do arquivo JSON usado como armazenamento temporario.
ARQUIVO_VAGAS = Path(__file__).parent / "vagas.json"

# O sistema web/backend foi planejado para 5 vagas.
TOTAL_DE_VAGAS = 5
TEMPO_CATRACA_ABERTA = 5


class AtualizacaoVaga(BaseModel):
    id: int = Field(ge=1, le=TOTAL_DE_VAGAS)
    ocupada: bool


def ler_dados():
    """Le o arquivo vagas.json e devolve os dados em formato Python."""
    with open(ARQUIVO_VAGAS, "r", encoding="utf-8") as arquivo:
        return json.load(arquivo)


def salvar_dados(dados):
    """Salva os dados atualizados dentro do arquivo vagas.json."""
    with open(ARQUIVO_VAGAS, "w", encoding="utf-8") as arquivo:
        json.dump(dados, arquivo, indent=2, ensure_ascii=False)


def garantir_dados_catraca(dados):
    """Garante que o JSON tenha a area da catraca."""
    if "catraca" not in dados:
        dados["catraca"] = {
            "aberta": False,
            "comando": "fechar",
            "ultima_atualizacao": None,
        }

    return dados


def buscar_vaga_por_id(vagas, id_vaga):
    """Procura uma vaga pelo id. Se nao encontrar, retorna None."""
    for vaga in vagas:
        if vaga["id"] == id_vaga:
            return vaga

    return None


@app.get("/")
def inicio():
    return {
        "mensagem": "API do Estacionamento Inteligente funcionando",
        "rotas": ["/vagas", "/resumo", "/atualizar-vaga", "/catraca", "/abrir-catraca"],
    }


@app.get("/vagas")
def listar_vagas():
    dados = ler_dados()
    dados = garantir_dados_catraca(dados)

    return {
        "total": len(dados["vagas"]),
        "vagas": dados["vagas"],
        "historico": dados["historico"],
    }


@app.get("/resumo")
def resumo_vagas():
    dados = ler_dados()
    vagas = dados["vagas"]

    total = len(vagas)
    ocupadas = sum(1 for vaga in vagas if vaga["ocupada"])
    livres = total - ocupadas

    return {
        "total": total,
        "livres": livres,
        "ocupadas": ocupadas,
    }


@app.post("/atualizar-vaga")
def atualizar_vaga(atualizacao: AtualizacaoVaga):
    dados = ler_dados()
    vaga = buscar_vaga_por_id(dados["vagas"], atualizacao.id)

    if vaga is None:
        raise HTTPException(status_code=404, detail="Vaga nao encontrada")

    if vaga["ocupada"] == atualizacao.ocupada:
        return {
            "mensagem": "A vaga ja estava com esse status",
            "vaga": vaga,
        }

    vaga["ocupada"] = atualizacao.ocupada
    vaga["ultima_atualizacao"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    dados["historico"].append(
        {
            "id": vaga["id"],
            "nome": vaga["nome"],
            "ocupada": vaga["ocupada"],
            "data": vaga["ultima_atualizacao"],
        }
    )

    salvar_dados(dados)

    return {"mensagem": "Vaga atualizada com sucesso", "vaga": vaga}


@app.get("/catraca")
def consultar_catraca():
    dados = ler_dados()
    dados = garantir_dados_catraca(dados)

    return dados["catraca"]


def fechar_catraca_depois_de_5_segundos():
    sleep(TEMPO_CATRACA_ABERTA)

    dados = ler_dados()
    dados = garantir_dados_catraca(dados)

    dados["catraca"] = {
        "aberta": False,
        "comando": "fechar",
        "ultima_atualizacao": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    salvar_dados(dados)


@app.post("/abrir-catraca")
def abrir_catraca(background_tasks: BackgroundTasks):
    dados = ler_dados()
    dados = garantir_dados_catraca(dados)

    if dados["catraca"]["aberta"]:
        return {
            "mensagem": "A catraca ja esta aberta",
            "catraca": dados["catraca"],
        }

    dados["catraca"] = {
        "aberta": True,
        "comando": "abrir",
        "ultima_atualizacao": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    salvar_dados(dados)
    background_tasks.add_task(fechar_catraca_depois_de_5_segundos)

    return {
        "mensagem": "Catraca aberta por 5 segundos",
        "catraca": dados["catraca"],
    }
