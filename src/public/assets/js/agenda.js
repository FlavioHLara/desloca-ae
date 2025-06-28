const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (!usuarioLogado) {
    alert("Usuário não logado.");
    window.location.href = "login.html";
}

const usuarioId = usuarioLogado.id;
const tableBody = document.querySelector('.agenda-compromissos tbody');
const addBtn = document.querySelector('.agenda-btn');
const proximoCard = document.querySelector('.agenda-card');
let alertasEmitidos = {};
const API_URL = "https://tiaw-jsonserver-x3yu.vercel.app/compromissos";

const hoje = new Date().toISOString().split("T")[0]; // formato: 2025-06-25

async function carregarCompromissos() {
    const resposta = await fetch(API_URL);
    const compromissos = await resposta.json();

    const compromissosUsuario = compromissos
        .filter(c => c.usuarioId === usuarioId && c.data === hoje)
        .sort((a, b) => a.hora.localeCompare(b.hora));

    tableBody.innerHTML = "";

    if (compromissosUsuario.length === 0) {
        alert(`Olá, ${usuarioLogado.nome}! Quais são seus compromissos hoje?`);
        inserirLinhaEditavel(); // se nenhum compromisso, já adiciona uma nova linha editável
        proximoCard.innerHTML = `<p>Nenhum compromisso futuro hoje.</p>`;
        return;
    }

    compromissosUsuario.forEach(item => {
        const linha = document.createElement('tr');
        linha.dataset.id = item.id;
        linha.innerHTML = `
            <td>${item.hora}</td>
            <td>${item.destino}</td>
        `;
        adicionarBotoesAcao(linha, item.id);
        tableBody.appendChild(linha);
    });

    atualizarProximoDeslocamento();
}

function atualizarProximoDeslocamento() {
    const linhas = tableBody.querySelectorAll('tr');
    const agora = new Date();
    let maisProximo = null;
    let menorDiferenca = Infinity;

    linhas.forEach(linha => {
        const horaTexto = linha.children[0].innerText.trim();
        const [hora, minuto] = horaTexto.split(':').map(Number);
        const compromissoHora = new Date();
        compromissoHora.setHours(hora, minuto, 0, 0);

        const diffMin = (compromissoHora - agora) / (1000 * 60);

        if (diffMin >= 0 && diffMin < menorDiferenca) {
            menorDiferenca = diffMin;
            maisProximo = { horaTexto, diffMin };
        }
    });

    if (maisProximo) {
        proximoCard.innerHTML = `
            <p><strong>Hoje, ${maisProximo.horaTexto}</strong></p>
            <p>Saída em ${Math.round(maisProximo.diffMin)} min</p>
            <p>Notificação de lembrete definida.</p>
        `;

        const intervalos = [30, 15, 10, 5, 1];
        const horaAtual = maisProximo.horaTexto;
        const minRestantes = Math.round(maisProximo.diffMin);

        if (!alertasEmitidos[horaAtual]) {
            alertasEmitidos[horaAtual] = [];
        }

        intervalos.forEach(min => {
            if (
                minRestantes <= min &&
                !alertasEmitidos[horaAtual].includes(min)
            ) {
                alert(`Alerta: Saída em ${min} minutos para o compromisso das ${horaAtual}.`);
                alertasEmitidos[horaAtual].push(min);
            }
        });
    } else {
        proximoCard.innerHTML = `<p>Nenhum compromisso futuro hoje.</p>`;
        alertasEmitidos = {};
    }
}

function adicionarBotoesAcao(linha, id) {
    const actionCell = linha.insertCell(-1);

    const editBtn = document.createElement('button');
    editBtn.innerText = "Editar";
    editBtn.classList.add("agenda-edit");

    editBtn.onclick = async () => {
        const horaCell = linha.children[0];
        const destinoCell = linha.children[1];

        if (editBtn.innerText === "Editar") {
            // Entrar no modo edição
            horaCell.contentEditable = true;
            destinoCell.contentEditable = true;
            horaCell.focus();

            editBtn.innerText = "Salvar";
            editBtn.classList.add("agenda-edite");
        } else {
            // Salvar as alterações
            const atualizado = {
                hora: horaCell.innerText.trim(),
                origem: "Casa",
                destino: destinoCell.innerText.trim(),
                data: hoje,
                usuarioId
            };

            const resposta = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(atualizado)
            });

            if (resposta.ok) {
                alert("Compromisso atualizado.");
                horaCell.contentEditable = false;
                destinoCell.contentEditable = false;
                editBtn.innerText = "Editar";
                carregarCompromissos();
            } else {
                alert("Erro ao atualizar compromisso.");
            }
        }
    };

    const delBtn = document.createElement('button');
    delBtn.innerText = "Excluir";
    delBtn.classList.add("agenda-delete");
    delBtn.onclick = async () => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        alert("Compromisso removido.");
        carregarCompromissos();
    };

    actionCell.appendChild(editBtn);
    actionCell.appendChild(delBtn);
}

function inserirLinhaEditavel() {
    const novaLinha = document.createElement('tr');

    const tdHora = document.createElement('td');
    tdHora.contentEditable = true;
    tdHora.innerText = "00:00";

    const tdDestino = document.createElement('td');
    tdDestino.contentEditable = true;
    tdDestino.innerText = "Novo Local";

    const tdAcoes = document.createElement('td');

    const salvarBtn = document.createElement('button');
    salvarBtn.innerText = "Salvar";
    salvarBtn.classList.add("agenda-save");

    salvarBtn.onclick = async () => {
        const hora = tdHora.innerText.trim();
        const destino = tdDestino.innerText.trim();
        const origem = "Casa";

        if (!hora || !destino) {
            alert("Preencha todos os campos.");
            return;
        }

        const novoCompromisso = {
            hora,
            origem,
            destino,
            data: hoje,
            usuarioId
        };

        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoCompromisso)
        });

        if (resposta.ok) {
            alert("Compromisso salvo!");
            carregarCompromissos();
        } else {
            alert("Erro ao salvar compromisso.");
        }
    };

    tdAcoes.appendChild(salvarBtn);

    novaLinha.appendChild(tdHora);
    novaLinha.appendChild(tdDestino);
    novaLinha.appendChild(tdAcoes);

    tableBody.appendChild(novaLinha);
}

addBtn.addEventListener('click', () => {
    inserirLinhaEditavel();
    alert("Novo compromisso adicionado! Agora edite o horário e o local, e clique em 'Salvar'.");
});

document.addEventListener('DOMContentLoaded', () => {
    carregarCompromissos();
    setInterval(atualizarProximoDeslocamento, 60000);
});