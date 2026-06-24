# Guia para agentes: ligar e testar o projeto

Este arquivo orienta outra IA/agente a iniciar, testar e diagnosticar o projeto
`estacionamento_inteligente`.

## Contexto rapido

- Projeto academico de estacionamento inteligente com ESP32.
- Backend principal: FastAPI em `backend/main.py`.
- Armazenamento temporario: `backend/vagas.json`.
- Frontend: `index.html`, `style.css`, `script.js`.
- O frontend atual mostra somente a Vaga 1, mas o backend ainda mantem 5 vagas.
- O frontend usa `window.location.origin`, entao ele espera que a pagina e a API
  estejam no mesmo host/porta.

## Antes de mexer

1. Verifique o estado do Git:

   ```powershell
   git status --short --branch
   ```

2. Nao reverta alteracoes do usuario sem pedido explicito.
3. `backend/vagas.json` muda durante testes reais do ESP32. Evite commitar essas
   mudancas acidentais, a menos que o usuario peca para salvar tudo.

## Descobrir o IP correto do PC

O ESP32 e o celular nao devem usar `127.0.0.1`, porque esse endereco aponta para
o proprio dispositivo.

No Windows:

```powershell
ipconfig
```

Procure o IPv4 do adaptador Wi-Fi, por exemplo:

```text
Endereco IPv4 . . . . . . . . . . . : 10.44.165.189
```

Use esse IP no navegador e no codigo do ESP32:

```cpp
const char* API_URL = "http://IP_DO_PC:8000";
```

O IP pode mudar quando o PC troca de rede. Sempre confirme com `ipconfig`.

## Subir o backend FastAPI

Com Python instalado:

```powershell
python -m venv .venv
.venv\Scripts\activate
python -m pip install -r requirements.txt
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Teste a API:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/resumo -UseBasicParsing
```

Teste pela rede, trocando pelo IP do PC:

```powershell
Invoke-WebRequest http://IP_DO_PC:8000/resumo -UseBasicParsing
```

## Abrir o painel web

Como `script.js` usa `window.location.origin`, o painel precisa ser servido no
mesmo endereco da API.

Opcoes:

- Servir os arquivos estaticos pelo mesmo servidor que expor a API.
- Ou ajustar temporariamente `API_URL` em `script.js` para `http://IP_DO_PC:8000`
  se a pagina for aberta por outro host.

Durante os testes locais, o endereco usado no navegador foi:

```text
http://IP_DO_PC:8000
```

Se a pagina nao abrir:

- Confira se o servidor esta rodando.
- Confira se o IP do PC mudou.
- Confira se o celular esta na mesma rede Wi-Fi do PC.
- Confira firewall do Windows liberando a porta `8000`.

## Rotas importantes

Atualizar vaga 1:

```http
POST /atualizar-vaga
Content-Type: application/json

{"id":1,"ocupada":true}
```

Marcar vaga 1 como livre:

```json
{"id":1,"ocupada":false}
```

Consultar vagas:

```http
GET /vagas
```

Consultar resumo:

```http
GET /resumo
```

Consultar catraca:

```http
GET /catraca
```

Abrir catraca:

```http
POST /abrir-catraca
```

## ESP32: pontos essenciais

O ESP32 deve estar na mesma rede Wi-Fi do PC.

Exemplo de configuracao:

```cpp
const char* WIFI_SSID = "NOME_DA_REDE_2G";
const char* WIFI_PASSWORD = "SENHA_DA_REDE";
const char* API_URL = "http://IP_DO_PC:8000";
```

ESP32 comum nao conecta em rede 5 GHz. Use rede 2.4 GHz.

Pinagem usada nos testes da Vaga 1:

```text
Sensor D0       -> GPIO 13
LED verde       -> GPIO 18
LED vermelho    -> GPIO 22
Servo sinal     -> GPIO 26
GND de tudo     -> GND comum
```

O sensor LM393 normalmente usa:

```cpp
const byte SENSOR_OCUPADO = LOW;
```

Se o sensor inverter o comportamento, teste:

```cpp
const byte SENSOR_OCUPADO = HIGH;
```

## Diagnostico do Serial Monitor

Baud rate:

```text
115200
```

Sinal de sensor funcionando:

```text
Sensor = 1 | Vaga = LIVRE
Sensor = 0 | Vaga = OCUPADA
```

Sinal de API funcionando:

```text
POST {"id":1,"ocupada":true} -> HTTP 200
POST {"id":1,"ocupada":false} -> HTTP 200
```

Erros comuns:

```text
HTTP -1
```

O ESP32 nao conseguiu conectar ao backend. Verifique:

- IP do PC em `API_URL`.
- ESP32, PC e celular na mesma rede.
- Porta `8000` liberada.
- Backend rodando.

```text
Wi-Fi desconectado. Nao enviou vaga.
```

O ESP32 nao conectou no Wi-Fi. Verifique:

- SSID correto.
- Senha correta.
- Rede 2.4 GHz.
- Roteador sem isolamento entre dispositivos.

## Servo e catraca

O botao da web chama:

```http
POST /abrir-catraca
```

O ESP32 precisa consultar:

```http
GET /catraca
```

Se `aberta` for `true`, mover o servo para abrir. Se for `false`, fechar.

Importante: servo pode derrubar o ESP32 se for alimentado pelo `3V3`.
Ideal:

```text
Fonte 5V +      -> servo vermelho
Fonte GND       -> servo marrom/preto
ESP32 GND       -> mesmo GND da fonte
GPIO 26         -> servo sinal
```

Sem fonte externa, pode testar no `5V/VIN` do ESP32 via USB, mas se a placa
reiniciar quando o servo mexer, o problema e corrente, nao codigo.

## Teste minimo recomendado

Antes de testar tudo, valide nesta ordem:

1. Sensor + LEDs sem Wi-Fi.
2. Wi-Fi + POST para `/atualizar-vaga` sem servo.
3. Web atualizando a Vaga 1.
4. Catraca com servo.

Nao avance para o servo enquanto o Serial Monitor nao mostrar `HTTP 200` para a
vaga 1.
