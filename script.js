const API_URL = window.location.origin;

const totalVagas = document.getElementById("total-vagas");
const vagasLivres = document.getElementById("vagas-livres");
const vagasOcupadas = document.getElementById("vagas-ocupadas");
const listaVagas = document.getElementById("lista-vagas");
const statusApi = document.getElementById("status-api");
const statusCatraca = document.getElementById("status-catraca");
const botaoCatraca = document.getElementById("botao-catraca");

const TEMPO_ATUALIZACAO = 3000;
const TEMPO_CATRACA_ABERTA = 5;
const ID_VAGA_EXIBIDA = 1;

let catracaEstaAberta = false;
let intervaloCronometro = null;

async function buscarJson(caminho) {
  const resposta = await fetch(`${API_URL}${caminho}`);

  if (!resposta.ok) {
    throw new Error("A API respondeu com erro.");
  }

  return resposta.json();
}

async function enviarPost(caminho) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: "POST",
  });

  if (!resposta.ok) {
    throw new Error("A API respondeu com erro.");
  }

  return resposta.json();
}

function atualizarResumo(resumo) {
  totalVagas.textContent = resumo.total;
  vagasLivres.textContent = resumo.livres;
  vagasOcupadas.textContent = resumo.ocupadas;
}

function filtrarVagasExibidas(vagas) {
  return vagas.filter((vaga) => vaga.id === ID_VAGA_EXIBIDA);
}

function criarResumoDasVagas(vagas) {
  const total = vagas.length;
  const ocupadas = vagas.filter((vaga) => vaga.ocupada).length;

  return {
    total,
    livres: total - ocupadas,
    ocupadas,
  };
}

function criarCardVaga(vaga) {
  const card = document.createElement("article");
  const estaOcupada = vaga.ocupada === true;

  card.className = estaOcupada ? "vaga vaga-ocupada" : "vaga vaga-livre";

  card.innerHTML = `
    <div>
      <strong>${vaga.nome}</strong>
      <p class="ultima-atualizacao">Atualizada em ${vaga.ultima_atualizacao}</p>
    </div>
    <span class="status-vaga ${estaOcupada ? "status-ocupada" : "status-livre"}">
      ${estaOcupada ? "Ocupada" : "Livre"}
    </span>
  `;

  return card;
}

function mostrarVagas(vagas) {
  listaVagas.innerHTML = "";

  vagas.forEach((vaga) => {
    listaVagas.appendChild(criarCardVaga(vaga));
  });
}

function mostrarErro() {
  statusApi.textContent = "Nao foi possivel carregar a API.";
  listaVagas.innerHTML = `
    <div class="mensagem-erro">
      Verifique se o backend esta rodando no mesmo endereco do painel.
    </div>
  `;
}

function calcularSegundosRestantes(dataTexto) {
  if (!dataTexto) {
    return TEMPO_CATRACA_ABERTA;
  }

  const dataAbertura = new Date(dataTexto.replace(" ", "T"));
  const agora = new Date();
  const segundosPassados = Math.floor((agora - dataAbertura) / 1000);
  const segundosRestantes = TEMPO_CATRACA_ABERTA - segundosPassados;

  return Math.max(segundosRestantes, 0);
}

function iniciarCronometroCatraca(segundosIniciais) {
  let segundos = segundosIniciais;

  clearInterval(intervaloCronometro);
  statusCatraca.textContent = `Catraca aberta. Fecha em ${segundos} segundos.`;

  intervaloCronometro = setInterval(() => {
    segundos -= 1;

    if (segundos <= 0) {
      clearInterval(intervaloCronometro);
      statusCatraca.textContent = "Catraca fechada.";
      botaoCatraca.disabled = false;
      catracaEstaAberta = false;
      return;
    }

    statusCatraca.textContent = `Catraca aberta. Fecha em ${segundos} segundos.`;
  }, 1000);
}

function atualizarCatraca(catraca) {
  if (catraca.aberta) {
    botaoCatraca.disabled = true;

    if (!catracaEstaAberta) {
      const segundosRestantes = calcularSegundosRestantes(catraca.ultima_atualizacao);
      iniciarCronometroCatraca(segundosRestantes);
    }

    catracaEstaAberta = true;
    return;
  }

  clearInterval(intervaloCronometro);
  catracaEstaAberta = false;
  statusCatraca.textContent = "Catraca fechada.";
  botaoCatraca.disabled = false;
}

async function carregarPainel() {
  try {
    statusApi.textContent = "Carregando dados...";

    const dadosVagas = await buscarJson("/vagas");
    const catraca = await buscarJson("/catraca");
    const vagasExibidas = filtrarVagasExibidas(dadosVagas.vagas);

    atualizarResumo(criarResumoDasVagas(vagasExibidas));
    mostrarVagas(vagasExibidas);
    atualizarCatraca(catraca);

    statusApi.textContent = "Dados atualizados.";
  } catch (erro) {
    mostrarErro();
  }
}

async function abrirCatraca() {
  try {
    botaoCatraca.disabled = true;
    catracaEstaAberta = true;
    iniciarCronometroCatraca(TEMPO_CATRACA_ABERTA);

    const resposta = await enviarPost("/abrir-catraca");

    if (!resposta.catraca.aberta) {
      atualizarCatraca(resposta.catraca);
    }
  } catch (erro) {
    clearInterval(intervaloCronometro);
    catracaEstaAberta = false;
    statusCatraca.textContent = "Nao foi possivel abrir a catraca.";
    botaoCatraca.disabled = false;
  }
}

botaoCatraca.addEventListener("click", abrirCatraca);

carregarPainel();
setInterval(carregarPainel, TEMPO_ATUALIZACAO);
