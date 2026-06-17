# Estacionamento Inteligente com ESP32

Projeto academico de um painel web para um estacionamento inteligente com ESP32.

O sistema mostra o status de 5 vagas, permite acompanhar vagas livres e ocupadas, e possui um controle manual simples da catraca.

## Objetivo

Criar um sistema simples, funcional e facil de apresentar, usando tecnologias basicas:

- HTML
- CSS
- JavaScript puro
- Python
- FastAPI
- JSON como armazenamento temporario

## Fluxo do Sistema

Fluxo das vagas:

```text
ESP32 -> FastAPI -> JSON -> Frontend
```

Fluxo da catraca nesta versao:

```text
Frontend -> FastAPI -> JSON
```

Futuramente, o ESP32 podera consultar a API para saber se deve abrir ou fechar o servo motor da catraca.

## Funcionalidades

- Painel web responsivo para computador e celular.
- Exibicao de 5 vagas.
- Cards verdes para vagas livres.
- Cards vermelhos para vagas ocupadas.
- Resumo com total de vagas, vagas livres e vagas ocupadas.
- Atualizacao automatica dos dados no frontend.
- Controle manual da catraca pelo botao "Abrir catraca".
- Catraca abre por 5 segundos e fecha automaticamente.
- API preparada para receber atualizacao individual das vagas.

## Tecnologias

### Backend

- Python
- FastAPI
- Uvicorn
- Arquivo JSON para armazenamento temporario

### Frontend

- HTML
- CSS
- JavaScript puro

## Estrutura do Projeto

```text
estacionamento-inteligente/
|
|-- backend/
|   |-- main.py
|   `-- vagas.json
|
|-- frontend/
|   |-- index.html
|   |-- style.css
|   `-- script.js
|
|-- requirements.txt
|-- .gitignore
`-- README.md
```

## Como Rodar o Projeto

### 1. Criar o ambiente virtual

No terminal, dentro da pasta do projeto:

```powershell
python -m venv .venv
```

### 2. Ativar o ambiente virtual

No Windows:

```powershell
.venv\Scripts\activate
```

### 3. Instalar as dependencias

```powershell
python -m pip install -r requirements.txt
```

### 4. Rodar o backend

```powershell
python -m uvicorn backend.main:app --reload
```

A API ficara disponivel em:

```text
http://127.0.0.1:8000
```

A documentacao interativa do FastAPI ficara em:

```text
http://127.0.0.1:8000/docs
```

### 5. Abrir o frontend

Abra o arquivo:

```text
frontend/index.html
```

Tambem e possivel abrir usando a extensao Live Server do VS Code.

## Rotas da API

### GET /

Rota de teste para verificar se a API esta funcionando.

### GET /vagas

Retorna todas as vagas cadastradas no arquivo JSON.

### GET /resumo

Retorna o total de vagas, vagas livres e vagas ocupadas.

### POST /atualizar-vaga

Atualiza uma vaga individual.

Exemplo de envio:

```json
{
  "id": 1,
  "ocupada": true
}
```

Para marcar a vaga como livre:

```json
{
  "id": 1,
  "ocupada": false
}
```

### GET /catraca

Retorna o estado atual da catraca.

Exemplo:

```json
{
  "aberta": false,
  "comando": "fechar",
  "ultima_atualizacao": "2026-06-17 10:16:16"
}
```

### POST /abrir-catraca

Abre a catraca por 5 segundos.

Depois desse tempo, o backend altera automaticamente o comando para fechar.

## Observacao Sobre o JSON

O arquivo `backend/vagas.json` e usado apenas como armazenamento temporario.

Ele nao e um banco de dados profissional. Em uma versao futura, ele pode ser substituido por SQLite, PostgreSQL ou AWS RDS.

## Observacao Sobre o ESP32

Nesta versao, o foco esta no sistema web/backend.

O ESP32 podera ser integrado futuramente para:

- Enviar atualizacoes das vagas para a API.
- Consultar o comando da catraca.
- Acionar o servo motor da catraca.

## Status do Projeto

Versao academica inicial funcionando localmente.
