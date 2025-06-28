document.addEventListener("DOMContentLoaded", () => {
    const dadosGamificacao = {
        missoes_ativas: [
            {
                id: "missao_horario_baixo",
                titulo: "Viagem em horário de baixa",
                descricao: "Viaje entre 10h e 16h",
                progresso: 1,
                objetivo: 3,
                pontos_recompensa: 15,
                tipo: "viagem"
            },
            {
                id: "missao_convidar_amigo",
                titulo: "Convidar um amigo",
                descricao: "Compartilhe seu código de indicação",
                progresso: 0,
                objetivo: 1,
                pontos_recompensa: 50,
                tipo: "social"
            }
        ],
        recompensas_disponiveis: [
            {
                id: "recompensa_desconto",
                titulo: "10% de desconto na passagem",
                custo_pontos: 500,
                tipo: "transporte"
            },
            {
                id: "recompensa_cafe",
                titulo: "Cupom de café",
                custo_pontos: 300,
                tipo: "parceiro"
            }
        ],
        impacto: {
            metrica: "CO₂ evitado",
            valor: 3,
            unidade: "kg"
        },
        pontos_usuario: 320,
        nivel_usuario: 2
    };

    const container = document.getElementById("gamificacao");

    container.innerHTML = `
    <h1 class="titulo-gamificacao">Desafios e Recompensas</h1>

    <div class="gamificacao-section">
      <h2>Nível: ${dadosGamificacao.nivel_usuario} | Pontos: ${dadosGamificacao.pontos_usuario}</h2>
    </div>

    <div class="gamificacao-section">
      <h2>Progresso Semanal</h2>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min((dadosGamificacao.pontos_usuario % 500) / 5, 100)}%;"></div>
      </div>
    </div>

    <div class="gamificacao-section">
      <h2>Recompensas Disponíveis</h2>
      ${dadosGamificacao.recompensas_disponiveis.map(r => `
        <div class="recompensa">
          <strong>${r.titulo}</strong><br>
          Custo: ${r.custo_pontos} pontos (${r.tipo})<br>
          <button class="resgatar-btn" ${dadosGamificacao.pontos_usuario >= r.custo_pontos ? '' : 'disabled'}>
            ${dadosGamificacao.pontos_usuario >= r.custo_pontos ? 'Resgatar' : 'Pontos insuficientes'}
          </button>
        </div>
      `).join('')}
    </div>

    <div class="gamificacao-section">
      <h2>Missões Ativas</h2>
      ${dadosGamificacao.missoes_ativas.map(m => `
        <div class="missao">
          <strong>${m.titulo}</strong><br>
          ${m.descricao}<br>
          Recompensa: ${m.pontos_recompensa} pontos<br>
          Progresso: ${m.progresso}/${m.objetivo}
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(m.progresso / m.objetivo) * 100}%;"></div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="gamificacao-section">
      <h2>Impacto Ambiental</h2>
      <div class="impacto-ambiental">
        <i class="fas fa-leaf"></i>
        <span>${dadosGamificacao.impacto.valor} ${dadosGamificacao.impacto.unidade} de ${dadosGamificacao.impacto.metrica}</span>
      </div>
    </div>
  `;
});