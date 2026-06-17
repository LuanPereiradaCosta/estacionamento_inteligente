# Suggested Commands

- Instalar dependencias do backend: `python -m pip install -r requirements.txt`.
- Rodar API FastAPI local: `python -m uvicorn backend.main:app --reload`.
- URL local da API: `http://127.0.0.1:8000`.
- Documentacao interativa gerada pelo FastAPI: `http://127.0.0.1:8000/docs`.
- Abrir frontend diretamente: abrir `frontend/index.html` no navegador com a API rodando.
- Servir frontend por HTTP: dentro de `frontend`, rodar `python -m http.server 5501 --bind 127.0.0.1` e acessar `http://127.0.0.1:5501/index.html`.
- PowerShell listar arquivos: `Get-ChildItem -Force`.
- PowerShell listar recursivo: `Get-ChildItem -Recurse -File`.
- Busca rapida se disponivel: `rg --files` e `rg "texto"`.
- Validar JSON no PowerShell: `Get-Content backend/vagas.json -Raw | ConvertFrom-Json`.