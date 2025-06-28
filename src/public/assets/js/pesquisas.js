const URL = "https://tiaw-jsonserver-x3yu.vercel.app/rotas" // Api Simulada

async function obterRotas() {
    try {
        let resposta = await fetch(URL); // Requisição da "API"
        let dadosRotas = await resposta.json(); // Conversão para Json

        document.querySelector("#caixa-pesquisa").addEventListener("input", function () {
            let termo = this.value.toLowerCase();
            let resultado = dadosRotas.filter(rota =>
                rota.numero_rota.toString().includes(termo) ||
                rota.sentido.toLowerCase().includes(termo) ||
                rota.trajeto.toLowerCase().includes(termo)
            ); // Pesquisa pelo que foi inserido pelo usuário

            exibirResultados(resultado);
        });

        exibirResultados(dadosRotas);

    } catch (erro) {
        console.log("Erro ao obter rotas:", erro);
    }

    // Método de exibição de possível erro

}

function exibirResultados(rotas) {
    let container = document.querySelector("#resultado-container");
    container.innerHTML = ""; // Limpa resultados anteriores

    if (rotas.length === 0) {
        container.innerHTML = "<p>Nenhuma rota foi encontrada. <p>";
        return;
    }

    rotas.forEach(rota => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>Rota ${rota.numero_rota}</h3>
            <p><strong>Sentido:</strong> ${rota.sentido}</p>
            <p><strong>Trajeto:</strong> ${rota.trajeto}</p>
            <p><strong>Preço:</strong> R$ ${rota.preco ? parseFloat(rota.preco).toFixed(2) : "Não informado"}</p>
        `;
        container.appendChild(card);
    });
}

obterRotas(); // Função requisitada