// =============================================
// FEED.JS - Lógica principal da rede social
// =============================================
document.addEventListener('DOMContentLoaded', function () {

  // ========== ELEMENTOS DO DOM ==========
  var feedContainer = document.getElementById('feedContainer');
  var loadingScreen = document.getElementById('loadingScreen');

  // Header
  var userNomeEl = document.getElementById('userNome');
  var userCargoEl = document.getElementById('userCargo');
  var avatarInicialEl = document.getElementById('avatarInicial');
  var sairBtn = document.getElementById('sairBtn');

  // Sidebar esquerda
  var sideAvatar = document.getElementById('sideAvatar');
  var sideNome = document.getElementById('sideNome');
  var sideCargo = document.getElementById('sideCargo');

  // Feed
  var publishAvatar = document.getElementById('publishAvatar');
  var postTextarea = document.getElementById('postTextarea');
  var publishBtn = document.getElementById('publishBtn');
  var publishError = document.getElementById('publishError');
  var postsContainer = document.getElementById('postsContainer');

  // Perfil
  var perfilAvatar = document.getElementById('perfilAvatar');
  var perfilNome = document.getElementById('perfilNome');
  var perfilCargo = document.getElementById('perfilCargo');
  var perfilMatricula = document.getElementById('perfilMatricula');
  var perfilPostsCount = document.getElementById('perfilPostsCount');
  var perfilBio = document.getElementById('perfilBio');
  var perfilPosts = document.getElementById('perfilPosts');

  // Containers
  var cursosContainer = document.getElementById('cursosContainer');
  var projetosContainer = document.getElementById('projetosContainer');
  var vagasContainer = document.getElementById('vagasContainer');
  var cursosCount = document.getElementById('cursosCount');
  var projetosCount = document.getElementById('projetosCount');
  var vagasCount = document.getElementById('vagasCount');
  var ultimosAlunos = document.getElementById('ultimosAlunos');

  var usuarioAtual = { id: null, nome: null, cargo: null, matricula: null, inicial: null };
  var abaAtual = 'feed';
  var publicando = false;

  // ========== INICIALIZAÇÃO ==========
  function initFeed() {
    var sessao = Database.auth.usuarioAtual();
    if (!sessao) {
      window.location.href = 'index.html';
      return;
    }

    usuarioAtual.id = sessao.userId;
    usuarioAtual.nome = sessao.nome;
    usuarioAtual.cargo = sessao.cargo || 'aluno';
    usuarioAtual.matricula = sessao.matricula || '';
    usuarioAtual.inicial = sessao.nome.charAt(0).toUpperCase();

    var primeiroNome = sessao.nome.split(' ')[0];

    // Mostrar botão Admin no menu (se for admin)
    var adminNavBtn = document.getElementById('adminNavBtn');
    if (adminNavBtn) {
      if (usuarioAtual.cargo === 'admin') {
        adminNavBtn.style.display = 'flex';
      } else {
        adminNavBtn.style.display = 'none';
      }
    }

    // Header
    userNomeEl.textContent = sessao.nome;
    userCargoEl.textContent = usuarioAtual.cargo;
    avatarInicialEl.textContent = usuarioAtual.inicial;

    // Sidebar
    sideAvatar.textContent = usuarioAtual.inicial;
    sideNome.textContent = sessao.nome;
    sideCargo.textContent = usuarioAtual.cargo;

    // Publicar
    publishAvatar.textContent = usuarioAtual.inicial;
    if (postTextarea) {
      postTextarea.placeholder = 'No que você está pensando, ' + primeiroNome + '?';
    }

    // Perfil
    perfilAvatar.textContent = usuarioAtual.inicial;
    perfilNome.textContent = sessao.nome;
    perfilCargo.textContent = usuarioAtual.cargo;
    perfilMatricula.textContent = 'Matrícula: ' + usuarioAtual.matricula;

    // Carregar dados
    carregarPosts();
    renderizarCursos();
    renderizarProjetos();
    renderizarVagas();
    renderizarUltimosAlunos();
    atualizarSidebarDireita();
    atualizarPerfilPosts();

    loadingScreen.style.display = 'none';
    feedContainer.style.display = 'block';
  }

  // ========== NAVEGAÇÃO ==========
  function initNavegacao() {
    var navBotoes = document.querySelectorAll('.nav-btn[data-tab]');
    for (var i = 0; i < navBotoes.length; i++) {
      navBotoes[i].addEventListener('click', function () {
        var aba = this.getAttribute('data-tab');
        if (aba === 'perfil') window.location.href = 'perfil.html';
        else if (aba === 'cursos') window.location.href = 'cursos.html';
        else if (aba === 'projetos') window.location.href = 'projetos.html';
        else if (aba === 'vagas') window.location.href = 'vagas.html';
        else mudarAba(aba);
      });
    }

    var destaques = document.querySelectorAll('.highlight-card.clickable');
    for (var i = 0; i < destaques.length; i++) {
      destaques[i].addEventListener('click', function () {
        var aba = this.getAttribute('data-tab');
        if (aba === 'cursos') window.location.href = 'cursos.html';
        else if (aba === 'projetos') window.location.href = 'projetos.html';
        else if (aba === 'vagas') window.location.href = 'vagas.html';
      });
    }
  }

  function mudarAba(aba) {
    if (aba === abaAtual) return;
    abaAtual = aba;

    var navBotoes = document.querySelectorAll('.nav-btn[data-tab]');
    for (var i = 0; i < navBotoes.length; i++) {
      navBotoes[i].classList.remove('active');
      if (navBotoes[i].getAttribute('data-tab') === aba) {
        navBotoes[i].classList.add('active');
      }
    }

    var abas = document.querySelectorAll('.tab-content');
    for (var i = 0; i < abas.length; i++) {
      abas[i].classList.remove('active-tab');
    }
    var abaEl = document.getElementById('tab-' + aba);
    if (abaEl) abaEl.classList.add('active-tab');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ========== POSTS ==========
  function carregarPosts() {
    var posts = Database.posts.listar();

    if (posts.length === 0) {
      postsContainer.innerHTML = '<div class="empty-feed">Nenhuma publicação ainda. Seja o primeiro a compartilhar algo!</div>';
      return;
    }

    postsContainer.innerHTML = '';
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      var autor = post.autor || 'Membro ConexãoPro';
      var cargo = post.cargo || 'aluno';
      var inicial = autor.charAt(0).toUpperCase();
      var curtidas = post.curtidas || 0;
      var qtdComentarios = post.comentarios || 0;

      var card = document.createElement('article');
      card.className = 'post-card';
      card.setAttribute('data-post-id', post.id);

      card.innerHTML =
        '<div class="post-header">' +
          '<div class="post-avatar">' + inicial + '</div>' +
          '<div>' +
            '<div class="post-author">' + escapeHtml(autor) + '</div>' +
            '<div class="post-meta">' + escapeHtml(cargo) + ' · ' + formatarData(post.criadoEm) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="post-body">' + escapeHtml(post.conteudo) + '</div>' +
        '<div class="post-stats-bar">' +
          '<span class="stat-like">👍 <strong>' + curtidas + '</strong></span>' +
          '<span class="stat-comment">💬 <strong>' + qtdComentarios + '</strong></span>' +
        '</div>' +
        '<div class="post-actions">' +
          '<button class="post-action-btn btn-curtir" data-post-id="' + post.id + '">👍 Curtir</button>' +
          '<button class="post-action-btn btn-comentar">💬 Comentar</button>' +
          '<button class="post-action-btn btn-compartilhar">↗ Compartilhar</button>' +
        '</div>';

      postsContainer.appendChild(card);
    }

    var botoesCurtir = postsContainer.querySelectorAll('.btn-curtir');
    for (var i = 0; i < botoesCurtir.length; i++) {
      botoesCurtir[i].addEventListener('click', function () {
        var postId = this.getAttribute('data-post-id');
        Database.posts.curtir(postId);
        carregarPosts();
        atualizarPerfilPosts();
      });
    }
  }

  function publicarPost() {
    if (publicando) return;

    publishError.textContent = '';
    publishError.style.display = 'none';

    var conteudo = postTextarea.value.trim();
    if (!conteudo) {
      publishError.textContent = 'Escreva alguma coisa antes de publicar.';
      publishError.style.display = 'block';
      return;
    }

    if (!usuarioAtual.id) {
      publishError.textContent = 'Sua sessão não foi encontrada.';
      publishError.style.display = 'block';
      return;
    }

    publicando = true;
    publishBtn.disabled = true;
    publishBtn.textContent = 'Publicando...';

    Database.posts.criar(usuarioAtual.id, conteudo);
    postTextarea.value = '';

    carregarPosts();
    atualizarPerfilPosts();
    atualizarSidebarDireita();

    publicando = false;
    publishBtn.disabled = false;
    publishBtn.textContent = 'Publicar';
  }

  // ========== RENDERIZAR CURSOS ==========
  function renderizarCursos() {
    var cursos = Database.cursos;
    cursosContainer.innerHTML = '';

    for (var i = 0; i < cursos.length; i++) {
      var c = cursos[i];
      var card = document.createElement('div');
      card.className = 'info-card';
      card.innerHTML =
        '<div class="info-card-icon">' + c.icone + '</div>' +
        '<h3 class="info-card-title">' + escapeHtml(c.nome) + '</h3>' +
        '<p class="info-card-desc">' + escapeHtml(c.descricao) + '</p>' +
        '<div class="info-card-footer">' +
          '<span class="info-tag">' + c.duracao + '</span>' +
        '</div>';
      cursosContainer.appendChild(card);
    }

    if (cursosCount) cursosCount.textContent = cursos.length + ' cursos disponíveis';
  }

  // ========== RENDERIZAR PROJETOS ==========
  function renderizarProjetos() {
    var projetos = Database.projetosExemplo;
    projetosContainer.innerHTML = '';

    for (var i = 0; i < projetos.length; i++) {
      var p = projetos[i];
      var card = document.createElement('div');
      card.className = 'info-card';
      card.innerHTML =
        '<div class="info-card-icon">🚀</div>' +
        '<h3 class="info-card-title">' + escapeHtml(p.titulo) + '</h3>' +
        '<p class="info-card-desc">' + escapeHtml(p.descricao) + '</p>' +
        '<div class="info-card-footer">' +
          '<span class="info-tag curso-tag">' + escapeHtml(p.curso) + '</span>' +
          '<span class="info-tag">' + p.integrantes + ' integrantes</span>' +
        '</div>';
      projetosContainer.appendChild(card);
    }

    if (projetosCount) projetosCount.textContent = projetos.length + ' projetos cadastrados';
  }

  // ========== RENDERIZAR VAGAS ==========
  function renderizarVagas() {
    var vagas = Database.vagasExemplo;
    vagasContainer.innerHTML = '';

    for (var i = 0; i < vagas.length; i++) {
      var v = vagas[i];
      var card = document.createElement('div');
      card.className = 'info-card vaga-card';
      card.innerHTML =
        '<div class="vaga-header">' +
          '<div class="info-card-icon">💼</div>' +
          '<div class="vaga-tipo ' + v.tipo.toLowerCase() + '">' + v.tipo + '</div>' +
        '</div>' +
        '<h3 class="info-card-title">' + escapeHtml(v.titulo) + '</h3>' +
        '<p class="vaga-empresa">' + escapeHtml(v.empresa) + '</p>' +
        '<p class="vaga-local">📍 ' + escapeHtml(v.local) + '</p>' +
        '<p class="info-card-desc">' + escapeHtml(v.descricao) + '</p>' +
        '<div class="info-card-footer">' +
          '<button class="btn-candidatar">Candidatar-se</button>' +
        '</div>';
      vagasContainer.appendChild(card);
    }

    if (vagasCount) vagasCount.textContent = vagas.length + ' vagas abertas';
  }

  // ========== ÚLTIMOS ALUNOS ==========
  function renderizarUltimosAlunos() {
    var usuarios = Database.usuarios.listar();
    var recentes = usuarios.slice(-5).reverse();

    if (recentes.length === 0) {
      ultimosAlunos.innerHTML = '<p class="text-muted">Nenhum aluno cadastrado ainda.</p>';
      return;
    }

    ultimosAlunos.innerHTML = '';
    for (var i = 0; i < recentes.length; i++) {
      var u = recentes[i];
      var inicial = u.nome.charAt(0).toUpperCase();
      var item = document.createElement('div');
      item.className = 'aluno-item';
      item.innerHTML =
        '<div class="aluno-avatar-small">' + inicial + '</div>' +
        '<div>' +
          '<p class="aluno-nome">' + escapeHtml(u.nome) + '</p>' +
          '<p class="aluno-cargo-small">' + escapeHtml(u.cargo || 'aluno') + '</p>' +
        '</div>';
      ultimosAlunos.appendChild(item);
    }
  }

  // ========== PERFIL ==========
  function atualizarPerfilPosts() {
    var todosPosts = Database.posts.listar();
    var meusPosts = [];
    for (var i = 0; i < todosPosts.length; i++) {
      if (todosPosts[i].userId === usuarioAtual.id) {
        meusPosts.push(todosPosts[i]);
      }
    }
    perfilPostsCount.textContent = meusPosts.length;

    if (meusPosts.length === 0) {
      perfilPosts.innerHTML = '<h3>Minhas Publicações</h3><div class="empty-feed">Você ainda não publicou nada.</div>';
      return;
    }

    var html = '<h3>Minhas Publicações (' + meusPosts.length + ')</h3>';
    for (var i = 0; i < meusPosts.length; i++) {
      var p = meusPosts[i];
      html +=
        '<div class="perfil-post-item">' +
          '<div class="perfil-post-content">' + escapeHtml(p.conteudo) + '</div>' +
          '<div class="perfil-post-meta">' + formatarData(p.criadoEm) + ' · 👍 ' + (p.curtidas || 0) + '</div>' +
        '</div>';
    }
    perfilPosts.innerHTML = html;
  }

  // ========== SIDEBAR DIREITA ==========
  function atualizarSidebarDireita() {
    var destaques = document.querySelectorAll('.highlight-card');
    if (destaques.length >= 3) {
      destaques[0].querySelector('p:last-child').textContent = Database.cursos.length + ' cursos disponíveis';
      destaques[1].querySelector('p:last-child').textContent = Database.projetosExemplo.length + ' projetos cadastrados';
      destaques[2].querySelector('p:last-child').textContent = Database.vagasExemplo.length + ' vagas abertas';
    }
  }

  // ========== SAIR ==========
  function sair() {
    Database.auth.logout();
    window.location.href = 'index.html';
  }

  // ========== UTILITÁRIOS ==========
  function formatarData(dataString) {
    var data = new Date(dataString);
    var agora = new Date();
    var diffMs = agora - data;
    var diffMin = Math.floor(diffMs / 60000);
    var diffHrs = Math.floor(diffMs / 3600000);
    var diffDias = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'agora mesmo';
    if (diffMin < 60) return diffMin + ' min atrás';
    if (diffHrs < 24) return diffHrs + 'h atrás';
    if (diffDias < 7) return diffDias + ' dias atrás';

    return data.toLocaleDateString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========== EVENTOS ==========
  if (publishBtn) publishBtn.addEventListener('click', publicarPost);
  if (sairBtn) sairBtn.addEventListener('click', sair);

  if (postTextarea) {
    postTextarea.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        publicarPost();
      }
    });
  }

  initNavegacao();
  initFeed();
});
