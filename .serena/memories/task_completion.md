# Task Completion

- Para backend: rodar `python -m py_compile backend/main.py`.
- Para frontend JS: rodar `node --check frontend/script.js`.
- Validar JSON: `Get-Content backend/vagas.json -Raw | ConvertFrom-Json`.
- Testar API local com Uvicorn e verificar rotas: `/`, `/vagas`, `/resumo`, `/atualizar-vaga`, `/catraca`, `/abrir-catraca`.
- Para catraca: testar `POST /abrir-catraca`, confirmar `GET /catraca` com `comando: abrir`, esperar 5 segundos e confirmar `comando: fechar`.
- Para frontend: abrir/testar painel no navegador e verificar notebook/celular.
- Nao ha linter, formatter ou testes automatizados configurados nesta fase.