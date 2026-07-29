// =============================================
// ADMIN.JS - Painel Administrativo
// =============================================
document.addEventListener('DOMContentLoaded', function () {
  var sessao = Database.auth.usuarioAtual();
  if (!sessao) { window.location.href = 'index.html'; return; }
  if (sessao.cargo !== 'admin') { window.location.href = 'feed.html'; return; }

  // Preencher header
  document.getElementById('userNome').textContent = sessao.nome;
  document.getElementById('userCargo').textContent = 'Administrador';
  document.getElementById('avatarInicial').textContent = sessao.nome.charAt(0).toUpperCase();

  // Sair
  document.getElementById('sairBtn').addEventListener('click', function () {
    Database.auth.logout();
    window.location.href = 'index.html';
  });

  // Navegação por abas
  var tabBotoes = document.querySelectorAll('.admin-tab-btn');
  for (var i = 0; i < tabBotoes.length; i++) {
    tabBotoes[i].addEventListener('click', function () {
      var aba = this.getAttribute('data-tab');
      // Remover active de todos
      var botoes = document.querySelectorAll('.admin-tab-btn');
      for (var j = 0; j < botoes.length; j++) botoes[j].classList.remove('active');
      this.classList.add('active');
      var conteudos = document.querySelectorAll('.admin-tab-content');
      for (var j = 0; j < conteudos.length; j++) conteudos[j].classList.remove('active');
      document.getElementById('admin-tab-' + aba).classList.add('active');
    });
  }

  // ========== ATUALIZAR ESTATÍSTICAS ==========
  function atualizarStats() {
    var cursos = Database.admin.listarCursos();
    var projetos = Database.admin.listarProjetos();
    var vagas = Database.admin.listarVagas();
    document.getElementById('totalCursos').textContent = cursos.length;
    document.getElementById('totalProjetos').textContent = projetos.length;
    document.getElementById('totalVagas').textContent = vagas.length;
  }

  // ========== RENDERIZAR CURSOS ==========
  function renderizarCursos() {
    var cursos = Database.admin.listarCursos();
    var container = document.getElementById('listaCursos');
    if (cursos.length === 0) {
      container.innerHTML = '<div class="empty-list">Nenhum curso cadastrado ainda.</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < cursos.length; i++) {
      var c = cursos[i];
      html +=
        '<div class="admin-item">' +
          '<div class="admin-item-info">' +
            '<h4>' + (c.icone || '📚') + ' ' + escapeHtml(c.nome) + '</h4>' +
            '<p>' + escapeHtml(c.descricao) + '</p>' +
            '<div class="item-tags">' +
              '<span class="item-tag">⏱ ' + escapeHtml(c.duracao) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="admin-item-actions">' +
            '<button class="btn-sm btn-sm-delete" data-id="' + c.id + '" data-tipo="curso">🗑 Excluir</button>' +
          '</div>' +
        '</div>';
    }
    container.innerHTML = html;

    // Eventos de excluir
    var botoes = container.querySelectorAll('[data-tipo="curso"]');
    for (var i = 0; i < botoes.length; i++) {
      botoes[i].addEventListener('click', function () {
        if (confirm('Tem certeza que deseja excluir este curso?')) {
          Database.admin.removerCurso(this.getAttribute('data-id'));
          renderizarCursos();
          atualizarStats();
          mostrarMsg('msgCurso', 'Curso removido com sucesso!', 'success');
        }
      });
    }
  }

  // ========== RENDERIZAR PROJETOS ==========
  function renderizarProjetos() {
    var projetos = Database.admin.listarProjetos();
    var container = document.getElementById('listaProjetos');
    if (projetos.length === 0) {
      container.innerHTML = '<div class="empty-list">Nenhum projeto cadastrado ainda.</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < projetos.length; i++) {
      var p = projetos[i];
      html +=
        '<div class="admin-item">' +
          '<div class="admin-item-info">' +
            '<h4>🚀 ' + escapeHtml(p.titulo) + '</h4>' +
            '<p>' + escapeHtml(p.descricao) + '</p>' +
            '<div class="item-tags">' +
              '<span class="item-tag">🎓 ' + escapeHtml(p.curso) + '</span>' +
              '<span class="item-tag">👥 ' + (p.integrantes || 1) + ' integrantes</span>' +
            '</div>' +
          '</div>' +
          '<div class="admin-item-actions">' +
            '<button class="btn-sm btn-sm-delete" data-id="' + p.id + '" data-tipo="projeto">🗑 Excluir</button>' +
          '</div>' +
        '</div>';
    }
    container.innerHTML = html;

    var botoes = container.querySelectorAll('[data-tipo="projeto"]');
    for (var i = 0; i < botoes.length; i++) {
      botoes[i].addEventListener('click', function () {
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
          Database.admin.removerProjeto(this.getAttribute('data-id'));
          renderizarProjetos();
          atualizarStats();
          mostrarMsg('msgProjeto', 'Projeto removido com sucesso!', 'success');
        }
      });
    }
  }

  // ========== RENDERIZAR VAGAS ==========
  function renderizarVagas() {
    var vagas = Database.admin.listarVagas();
    var container = document.getElementById('listaVagas');
    if (vagas.length === 0) {
      container.innerHTML = '<div class="empty-list">Nenhuma vaga cadastrada ainda.</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < vagas.length; i++) {
      var v = vagas[i];
      html +=
        '<div class="admin-item">' +
          '<div class="admin-item-info">' +
            '<h4>💼 ' + escapeHtml(v.titulo) + '</h4>' +
            '<p>🏢 ' + escapeHtml(v.empresa) + ' · 📍 ' + escapeHtml(v.local) + '</p>' +
            '<p>' + escapeHtml(v.descricao) + '</p>' +
            '<div class="item-tags">' +
              '<span class="item-tag">' + escapeHtml(v.tipo) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="admin-item-actions">' +
            '<button class="btn-sm btn-sm-delete" data-id="' + v.id + '" data-tipo="vaga">🗑 Excluir</button>' +
          '</div>' +
        '</div>';
    }
    container.innerHTML = html;

    var botoes = container.querySelectorAll('[data-tipo="vaga"]');
    for (var i = 0; i < botoes.length; i++) {
      botoes[i].addEventListener('click', function () {
        if (confirm('Tem certeza que deseja excluir esta vaga?')) {
          Database.admin.removerVaga(this.getAttribute('data-id'));
          renderizarVagas();
          atualizarStats();
          mostrarMsg('msgVaga', 'Vaga removida com sucesso!', 'success');
        }
      });
    }
  }

  // ========== RENDERIZAR USUÁRIOS ==========
  function renderizarUsuarios() {
    var usuarios = Database.usuarios.listar();
    var container = document.getElementById('listaUsuarios');
    if (!usuarios || usuarios.length === 0) {
      container.innerHTML = '<div class="empty-list">Nenhum usuário cadastrado.</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < usuarios.length; i++) {
      var u = usuarios[i];
      var inicial = u.nome.charAt(0).toUpperCase();
      var isAdmin = u.cargo === 'admin';
      html +=
        '<div class="user-item">' +
          '<div class="user-item-info">' +
            '<div class="user-avatar-sm">' + inicial + '</div>' +
            '<div>' +
              '<div class="user-item-name">' + escapeHtml(u.nome) + '</div>' +
              '<div class="user-item-cargo' + (isAdmin ? ' admin-badge' : '') + '">' +
                (isAdmin ? '👑 Administrador' : '🎓 ' + (u.cargo || 'aluno')) +
                ' · Matrícula: ' + escapeHtml(u.matricula) +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="admin-item-actions">' +
            (isAdmin
              ? '<span style="font-size:12px;color:#90949c;">Administrador</span>'
              : '<button class="btn-sm btn-sm-edit" data-user-id="' + u.id + '">👑 Tornar Admin</button>'
            ) +
          '</div>' +
        '</div>';
    }
    container.innerHTML = html;

    var botoesTornarAdmin = container.querySelectorAll('.btn-sm-edit');
    for (var i = 0; i < botoesTornarAdmin.length; i++) {
      botoesTornarAdmin[i].addEventListener('click', function () {
        var userId = this.getAttribute('data-user-id');
        if (confirm('Tem certeza que deseja promover este usuário a Administrador?')) {
          var atualizado = Database.usuarios.atualizarCargo(userId, 'admin');
          if (atualizado) {
            mostrarMsg('msgUsuario', 'Usuário promovido a Administrador com sucesso!', 'success');
            renderizarUsuarios();
          } else {
            mostrarMsg('msgUsuario', 'Erro ao promover usuário.', 'error');
          }
        }
      });
    }
  }

  // ========== MOSTRAR MENSAGEM ==========
  function mostrarMsg(id, texto, tipo) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = texto;
    el.className = 'admin-msg ' + tipo;
    el.style.display = 'block';
    setTimeout(function () { el.style.display = 'none'; }, 3000);
  }

  // ========== EVENTOS DOS FORMULÁRIOS ==========

  // Adicionar Curso
  document.getElementById('btnAddCurso').addEventListener('click', function () {
    var nome = document.getElementById('cursoNome').value.trim();
    var duracao = document.getElementById('cursoDuracao').value.trim();
    var icone = document.getElementById('cursoIcone').value.trim() || '📚';
    var descricao = document.getElementById('cursoDescricao').value.trim();

    if (!nome || !duracao || !descricao) {
      mostrarMsg('msgCurso', 'Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    Database.admin.adicionarCurso(nome, descricao, duracao, icone);
    document.getElementById('cursoNome').value = '';
    document.getElementById('cursoDuracao').value = '';
    document.getElementById('cursoIcone').value = '📚';
    document.getElementById('cursoDescricao').value = '';
    renderizarCursos();
    atualizarStats();
    mostrarMsg('msgCurso', 'Curso "' + nome + '" adicionado com sucesso!', 'success');
  });

  // Adicionar Projeto
  document.getElementById('btnAddProjeto').addEventListener('click', function () {
    var titulo = document.getElementById('projetoTitulo').value.trim();
    var curso = document.getElementById('projetoCurso').value.trim();
    var integrantes = document.getElementById('projetoIntegrantes').value;
    var descricao = document.getElementById('projetoDescricao').value.trim();

    if (!titulo || !curso || !descricao) {
      mostrarMsg('msgProjeto', 'Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    Database.admin.adicionarProjeto(titulo, descricao, curso, integrantes);
    document.getElementById('projetoTitulo').value = '';
    document.getElementById('projetoCurso').value = '';
    document.getElementById('projetoIntegrantes').value = '1';
    document.getElementById('projetoDescricao').value = '';
    renderizarProjetos();
    atualizarStats();
    mostrarMsg('msgProjeto', 'Projeto "' + titulo + '" adicionado com sucesso!', 'success');
  });

  // Adicionar Vaga
  document.getElementById('btnAddVaga').addEventListener('click', function () {
    var titulo = document.getElementById('vagaTitulo').value.trim();
    var empresa = document.getElementById('vagaEmpresa').value.trim();
    var local = document.getElementById('vagaLocal').value.trim();
    var tipo = document.getElementById('vagaTipo').value;
    var descricao = document.getElementById('vagaDescricao').value.trim();

    if (!titulo || !empresa || !local || !descricao) {
      mostrarMsg('msgVaga', 'Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    Database.admin.adicionarVaga(titulo, empresa, local, tipo, descricao);
    document.getElementById('vagaTitulo').value = '';
    document.getElementById('vagaEmpresa').value = '';
    document.getElementById('vagaLocal').value = '';
    document.getElementById('vagaDescricao').value = '';
    renderizarVagas();
    atualizarStats();
    mostrarMsg('msgVaga', 'Vaga "' + titulo + '" adicionada com sucesso!', 'success');
  });

  // ========== INICIALIZAR ==========
  atualizarStats();
  renderizarCursos();
  renderizarProjetos();
  renderizarVagas();
  renderizarUsuarios();

  // Função utilitária
  function escapeHtml(t) {
    var d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }
});
