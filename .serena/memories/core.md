# Core

- Projeto academico: Estacionamento Inteligente com ESP32, 1a fase de ADS.
- Prioridade: simplicidade, didatica, etapas pequenas, explicacao para iniciante.
- Foco atual deste repositorio: sistema web/backend; o projeto Wokwi/ESP32 sera ajustado por outra pessoa.
- Fluxo principal das vagas: ESP32 -> FastAPI -> JSON -> Frontend.
- Sistema web/backend permanece com 5 vagas; nao reduzir para 3 por causa do estado atual do Wokwi.
- Se Wokwi/ESP32 estiver com quantidade diferente de vagas, a adaptacao fica com a pessoa responsavel pelo ESP32.
- `vagas.json`, API e frontend devem continuar considerando 5 vagas.
- Frontend cria cards das vagas dinamicamente a partir da resposta da API; evitar cards fixos manuais no HTML.
- Backend aceita atualizacao individual de vaga no formato `{ "id": 1, "ocupada": true }`.
- Backend deve ser planejado para futura atualizacao em lote, mas nao implementar sem autorizacao; formato possivel: `{ "vaga_1": true, "vaga_2": false, "vaga_3": true, "vaga_4": false, "vaga_5": false }`.
- Controle manual da catraca implementado no modelo simples: Frontend -> FastAPI -> JSON; ESP32 futuramente consulta a API.
- Rotas da catraca: `POST /abrir-catraca` abre por 5 segundos; `GET /catraca` retorna estado/comando atual.
- Estado da catraca fica em `backend/vagas.json` na chave `catraca`, com `aberta`, `comando` e `ultima_atualizacao`.
- Botao no frontend: "Abrir catraca"; apos abrir, backend muda automaticamente para comando `fechar` depois de 5 segundos.
- Leia tambem `mem:tech_stack` para tecnologias permitidas, `mem:conventions` para regras de desenvolvimento, `mem:suggested_commands` para comandos locais e `mem:task_completion` para verificacoes ao concluir tarefas.
- Documento local de contexto: AGENTS.md na raiz do projeto.