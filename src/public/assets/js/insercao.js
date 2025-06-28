const URL = "https://tiaw-jsonserver-x3yu.vercel.app/noticias";

function adicionarNoticia() {
    const titulo = document.getElementById('titulo').value;
    const autor = document.getElementById('autor').value;
    const conteudo = document.getElementById('conteudo').value;

    const data = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    if (!titulo || !autor || !conteudo) {
        alert("Preencha todos os campos!");
        return;
    }

    const novaNoticia = {
        titulo,
        autor,
        conteudo,
        data
    };

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaNoticia)
    })
        .then(res => res.json())
        .then(data => {
            alert("Notícia adicionada com sucesso!");
            limparCampos();
            carregarNoticias();
        })
        .catch(erro => {
            console.error("Erro ao salvar notícia:", erro);
            alert("Erro ao tentar adicionar a notícia.");
        });
}

function limparCampos() {
    document.getElementById('titulo').value = "";
    document.getElementById('autor').value = "";
    document.getElementById('conteudo').value = "";
}

function carregarNoticias() {
    fetch(URL)
        .then(res => res.json())
        .then(noticias => {
            const container = document.getElementById("noticias-container");
            container.innerHTML = "";

            if (noticias.length === 0) {
                container.innerHTML = "<p>Nenhuma notícia encontrada.</p>";
                return;
            }

            noticias.forEach(noticia => {
                const div = document.createElement("div");
                div.classList.add("noticia");
                div.setAttribute("data-id", noticia.id);

                div.innerHTML = `
                <h4>${noticia.titulo}</h4>
                <p>Autor: ${noticia.autor}</p>
                <p>${noticia.conteudo}</p>
                <p class="data-noticia">Publicado em ${noticia.data}</p>
            `;

                const btnEditar = document.createElement('button');

                btnEditar.textContent = 'Editar';
                btnEditar.onclick = () => editarNoticiaPrompt(noticia.id);
                btnEditar.classList.add('botaoeditar');

                const btnExcluir = document.createElement('button');
                btnExcluir.textContent = 'Excluir';
                btnExcluir.onclick = () => excluirNoticia(noticia.id);
                btnExcluir.classList.add('botaoexcluir');

                div.appendChild(btnEditar);
                div.appendChild(btnExcluir);
                container.appendChild(div);
            });
        });
}

function editarNoticiaPrompt(id) {
    const titulo = prompt("Novo título:");
    const autor = prompt("Novo autor:");
    const conteudo = prompt("Novo conteúdo:");

    if (!titulo || !autor || !conteudo) {
        alert("Todos os campos devem ser preenchidos.");
        return;
    }

    fetch(`${URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo, autor, conteudo })
    })
        .then(res => res.json())
        .then(data => {
            alert("Notícia atualizada com sucesso!");
            carregarNoticias();
        })
        .catch(erro => {
            console.error("Erro ao editar notícia:", erro);
            alert("Erro ao tentar editar a notícia.");
        });
}

function excluirNoticia(id) {
    if (!confirm("Tem certeza que deseja excluir esta notícia?")) return;

    fetch(`${URL}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            alert("Notícia excluída com sucesso!");
            carregarNoticias();
        })
        .catch(erro => {
            console.error("Erro ao excluir notícia:", erro);
            alert("Erro ao tentar excluir a notícia.");
        });
}


document.addEventListener("DOMContentLoaded", carregarNoticias);
