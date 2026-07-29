// =============================================
// DATABASE.JS - Banco de dados local
// Substitui o Supabase por localStorage
// =============================================

const Database = {
  // ========== CHAVES DO localStorage ==========
  _chaves: {
    usuarios: 'conexaopro_usuarios',
    posts: 'conexaopro_posts',
    sessao: 'conexaopro_sessao',
    curtidas: 'conexaopro_curtidas',
    comentarios: 'conexaopro_comentarios',
    cursos: 'conexaopro_cursos',
    projetos: 'conexaopro_projetos',
    vagas: 'conexaopro_vagas',
  },

  // ========== UTILITÁRIOS ==========
  _gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  _agora() {
    return new Date().toISOString();
  },

  _ler(chave) {
    try {
      const dados = localStorage.getItem(this._chaves[chave]);
      return dados ? JSON.parse(dados) : null;
    } catch (e) {
      return null;
    }
  },

  _salvar(chave, dados) {
    localStorage.setItem(this._chaves[chave], JSON.stringify(dados));
  },

  // ========== INICIALIZAR DADOS PADRÃO ==========
  _inicializarDados() {
    // Cursos padrão
    if (!this._ler('cursos')) {
      this._salvar('cursos', [
        { id: 'c1', nome: 'Desenvolvimento de Sistemas', descricao: 'Aprenda a criar sistemas web e mobile com as tecnologias mais modernas do mercado.', duracao: '2 anos', icone: '💻' },
        { id: 'c2', nome: 'Mecatrônica', descricao: 'Integração entre mecânica, eletrônica e computação para automação industrial.', duracao: '2 anos', icone: '⚙️' },
        { id: 'c3', nome: 'Eletroeletrônica', descricao: 'Circuitos elétricos, eletrônica digital e sistemas de controle.', duracao: '18 meses', icone: '🔌' },
        { id: 'c4', nome: 'Mecânica Industrial', descricao: 'Processos de fabricação, desenho técnico e manutenção industrial.', duracao: '18 meses', icone: '🔧' },
        { id: 'c5', nome: 'Logística', descricao: 'Gestão da cadeia de suprimentos, transporte e distribuição.', duracao: '18 meses', icone: '📦' },
        { id: 'c6', nome: 'Administração', descricao: 'Gestão empresarial, finanças, marketing e recursos humanos.', duracao: '2 anos', icone: '📊' },
      ]);
    }

    // Projetos padrão
    if (!this._ler('projetos')) {
      this._salvar('projetos', [
        { id: 'p1', titulo: 'App de Monitoramento de Energia', descricao: 'Sistema IoT para monitorar consumo de energia elétrica em tempo real usando sensores e dashboard web.', curso: 'Mecatrônica', integrantes: 4 },
        { id: 'p2', titulo: 'Plataforma de Estudos Online', descricao: 'Rede social acadêmica para compartilhamento de materiais e dúvidas entre alunos.', curso: 'Desenvolvimento de Sistemas', integrantes: 3 },
        { id: 'p3', titulo: 'Braço Robótico Automatizado', descricao: 'Braço robótico controlado por Arduino para linhas de montagem didáticas.', curso: 'Eletroeletrônica', integrantes: 5 },
        { id: 'p4', titulo: 'Sistema de Gestão de Estoque', descricao: 'Software para controle de estoque com RFID e relatórios inteligentes.', curso: 'Logística', integrantes: 3 },
      ]);
    }

    // Vagas padrão
    if (!this._ler('vagas')) {
      this._salvar('vagas', [
        { id: 'v1', titulo: 'Estágio em Desenvolvimento Web', empresa: 'TechSolutions Ltda', local: 'São Paulo - SP', tipo: 'Estágio', descricao: 'Atuar no desenvolvimento de aplicações web com React e Node.js.' },
        { id: 'v2', titulo: 'Jovem Aprendiz em Mecatrônica', empresa: 'Indústrias ABC', local: 'Barretos - SP', tipo: 'Aprendiz', descricao: 'Atividades práticas em manutenção e automação industrial.' },
        { id: 'v3', titulo: 'Analista de Logística Jr', empresa: 'Transportadora Rápida', local: 'Ribeirão Preto - SP', tipo: 'CLT', descricao: 'Planejamento e acompanhamento de rotas e entregas.' },
        { id: 'v4', titulo: 'Técnico em Eletroeletrônica', empresa: 'Automação Brasil', local: 'Barretos - SP', tipo: 'CLT', descricao: 'Manutenção de equipamentos eletrônicos e painéis de controle.' },
        { id: 'v5', titulo: 'Programador Full Stack Júnior', empresa: 'StartupInova', local: 'Remoto', tipo: 'PJ', descricao: 'Desenvolvimento de funcionalidades para plataforma SaaS.' },
      ]);
    }
  },

  // ========== DADOS ESTÁTICOS (fallback) ==========
  cursos: [],
  projetosExemplo: [],
  vagasExemplo: [],

  // ========== CARREGAR DADOS DO localStorage ==========
  _carregarDados() {
    this.cursos = this._ler('cursos') || [];
    this.projetosExemplo = this._ler('projetos') || [];
    this.vagasExemplo = this._ler('vagas') || [];
  },

  // ========== ADMIN ==========
  admin: {
    // ---- CURSOS ----
    listarCursos() {
      return Database._ler('cursos') || [];
    },

    adicionarCurso(nome, descricao, duracao, icone) {
      const cursos = Database._ler('cursos') || [];
      const novo = {
        id: Database._gerarId(),
        nome: nome,
        descricao: descricao,
        duracao: duracao,
        icone: icone || '📚',
      };
      cursos.push(novo);
      Database._salvar('cursos', cursos);
      Database._carregarDados();
      return novo;
    },

    removerCurso(id) {
      var cursos = Database._ler('cursos') || [];
      cursos = cursos.filter(function(c) { return c.id !== id; });
      Database._salvar('cursos', cursos);
      Database._carregarDados();
    },

    // ---- PROJETOS ----
    listarProjetos() {
      return Database._ler('projetos') || [];
    },

    adicionarProjeto(titulo, descricao, curso, integrantes) {
      const projetos = Database._ler('projetos') || [];
      const novo = {
        id: Database._gerarId(),
        titulo: titulo,
        descricao: descricao,
        curso: curso,
        integrantes: parseInt(integrantes) || 1,
      };
      projetos.push(novo);
      Database._salvar('projetos', projetos);
      Database._carregarDados();
      return novo;
    },

    removerProjeto(id) {
      var projetos = Database._ler('projetos') || [];
      projetos = projetos.filter(function(p) { return p.id !== id; });
      Database._salvar('projetos', projetos);
      Database._carregarDados();
    },

    // ---- VAGAS ----
    listarVagas() {
      return Database._ler('vagas') || [];
    },

    adicionarVaga(titulo, empresa, local, tipo, descricao) {
      const vagas = Database._ler('vagas') || [];
      const novo = {
        id: Database._gerarId(),
        titulo: titulo,
        empresa: empresa,
        local: local,
        tipo: tipo,
        descricao: descricao,
      };
      vagas.push(novo);
      Database._salvar('vagas', vagas);
      Database._carregarDados();
      return novo;
    },

    removerVaga(id) {
      var vagas = Database._ler('vagas') || [];
      vagas = vagas.filter(function(v) { return v.id !== id; });
      Database._salvar('vagas', vagas);
      Database._carregarDados();
    },
  },

  // ========== USUÁRIOS ==========
  usuarios: {
    _todos() {
      return Database._ler('usuarios');
    },

    _salvarTodos(usuarios) {
      Database._salvar('usuarios', usuarios);
    },

    buscarPorMatricula(matricula) {
      return this._todos().find(u => u.matricula === matricula) || null;
    },

    buscarPorId(id) {
      return this._todos().find(u => u.id === id) || null;
    },

    listar() {
      return this._todos();
    },

    criar(nome, matricula, dataNascimento, cargo) {
      const usuarios = this._todos();
      const novo = {
        id: Database._gerarId(),
        nome: nome,
        matricula: matricula,
        dataNascimento: dataNascimento,
        cargo: cargo || 'aluno',
        senha: dataNascimento,
        criadoEm: Database._agora(),
      };
      usuarios.push(novo);
      this._salvarTodos(usuarios);
      return novo;
    },

    atualizarCargo(userId, novoCargo) {
      var usuarios = this._todos();
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id === userId) {
          usuarios[i].cargo = novoCargo;
          this._salvarTodos(usuarios);
          return true;
        }
      }
      return false;
    },
  },

  // ========== SESSÃO ==========
  sessao: {
    _chave() { return Database._chaves.sessao; },

    estaLogado() { return localStorage.getItem(this._chave()) !== null; },

    get() {
      try {
        const dados = localStorage.getItem(this._chave());
        return dados ? JSON.parse(dados) : null;
      } catch { return null; }
    },

    criar(usuario) {
      localStorage.setItem(this._chave(), JSON.stringify({
        userId: usuario.id,
        nome: usuario.nome,
        matricula: usuario.matricula,
        cargo: usuario.cargo,
      }));
    },

    destruir() { localStorage.removeItem(this._chave()); },
  },

  // ========== AUTENTICAÇÃO ==========
  auth: {
    login(matricula, senha) {
      const usuario = Database.usuarios.buscarPorMatricula(matricula);
      if (!usuario) return { sucesso: false, erro: 'Matrícula não encontrada.' };
      if (usuario.senha !== senha) return { sucesso: false, erro: 'Senha inválida.' };
      Database.sessao.criar(usuario);
      return { sucesso: true, usuario: usuario };
    },

    cadastrar(nome, matricula, dataNascimento) {
      const existente = Database.usuarios.buscarPorMatricula(matricula);
      if (existente) return { sucesso: false, erro: 'Matrícula já cadastrada.' };
      const usuario = Database.usuarios.criar(nome, matricula, dataNascimento, 'aluno');
      Database.sessao.criar(usuario);
      return { sucesso: true, usuario: usuario };
    },

    logout() { Database.sessao.destruir(); },

    usuarioAtual() { return Database.sessao.get(); },

    ehAdmin() {
      var sessao = this.usuarioAtual();
      return sessao && sessao.cargo === 'admin';
    },
  },

  // ========== POSTS ==========
  posts: {
    _todos() {
      const posts = Database._ler('posts');
      return posts ? posts.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)) : [];
    },

    _salvarTodos(posts) { Database._salvar('posts', posts); },

    listar() { return this._todos(); },

    criar(userId, conteudo) {
      const posts = Database._ler('posts') || [];
      const usuario = Database.usuarios.buscarPorId(userId);
      const novoPost = {
        id: Database._gerarId(),
        userId: userId,
        autor: usuario ? usuario.nome : 'Membro ConexãoPro',
        cargo: usuario ? usuario.cargo : 'aluno',
        conteudo: conteudo,
        criadoEm: Database._agora(),
        curtidas: 0,
        comentarios: 0,
      };
      posts.push(novoPost);
      this._salvarTodos(posts);
      return novoPost;
    },

    curtir(postId) {
      const posts = Database._ler('posts');
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.curtidas = (post.curtidas || 0) + 1;
        this._salvarTodos(posts);
      }
      return post;
    },
  },
};

// Inicializar dados na primeira execução
Database._inicializarDados();
Database._carregarDados();
