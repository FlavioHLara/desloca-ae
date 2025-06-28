const API_URL = "https://tiaw-jsonserver-x3yu.vercel.app/compromissos";

// Função para buscar compromissos
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const usuarioId = usuarioLogado ? usuarioLogado.id : null;
const hoje = new Date().toISOString().split("T")[0]; // formato '2025-06-25'

async function buscarCompromissosUsuarioHoje() {
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();
    if (!usuarioId) return [];
    // filtrar pelo usuário e data atual (ou ajustar conforme necessário)
    return dados.filter(c => c.usuarioId === usuarioId && c.data === hoje);
}

function calcularTempoMedio(totalDeslocamentos) {
    const tempoPorDeslocamento = 40; // minutos (padrão estimado)
    return tempoPorDeslocamento;
}

function calcularTempoTotal(totalDeslocamentos, tempoMedio) {
    return totalDeslocamentos * tempoMedio; // em minutos
}

function converterParaHorasEMinutos(minutos) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}min`;
}

function calcularRotasMaisUsadas(compromissos) {
    const frequencia = {};

    compromissos.forEach(comp => {
        const origem = comp.origem || "Local A";
        const destino = comp.destino || "Local B";
        const rota = `${origem} → ${destino}`;
        frequencia[rota] = (frequencia[rota] || 0) + 1;
    });

    const ordenadas = Object.entries(frequencia)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return ordenadas.map(([rota, freq]) => ({ rota, freq }));
}

function preencherResumo(total, tempoMedio, tempoTotal) {
    document.getElementById("total-deslocamentos").innerText = `${total} Deslocamentos Registrados.`;
    document.getElementById("tempo-medio").innerText = `${tempoMedio} min`;
    document.getElementById("tempo-total").innerText = converterParaHorasEMinutos(tempoTotal);
}

function preencherRotas(maisUsadas) {
    const listaRotas = document.getElementById("lista-rotas");
    listaRotas.innerHTML = "";

    maisUsadas.forEach(r => {
        const freqTexto = r.freq > 1 ? ` (${r.freq}x)` : "";
        const item = document.createElement("li");
        item.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${r.rota}${freqTexto}`;
        listaRotas.appendChild(item);
    });
}

function preencherMensagens(total, tempoTotal) {
    const mensagemDiv = document.getElementById("mensagem");
    mensagemDiv.innerHTML = "";

    const mensagens = [];

    if (total >= 10) {
        mensagens.push("Você está se locomovendo bastante essa semana!");
    }

    if (tempoTotal > 300) {
        mensagens.push("Você passou mais de 5 horas em transporte! Já pensou em otimizar suas rotas?");
    }

    if (mensagens.length === 0) {
        mensagens.push("Ótimo! Seu tempo de deslocamento está equilibrado.");
    }

    mensagens.forEach(msg => {
        const p = document.createElement("p");
        p.innerHTML = `<em>${msg}</em>`;
        mensagemDiv.appendChild(p);
    });
}

async function iniciarDashboard() {
    const compromissos = await buscarCompromissosUsuarioHoje();

    const total = compromissos.length;
    const tempoMedio = calcularTempoMedio(total);
    const tempoTotal = calcularTempoTotal(total, tempoMedio);
    const rotas = calcularRotasMaisUsadas(compromissos);

    preencherResumo(total, tempoMedio, tempoTotal);
    preencherRotas(rotas);
    preencherMensagens(total, tempoTotal);
}

window.onload = iniciarDashboard