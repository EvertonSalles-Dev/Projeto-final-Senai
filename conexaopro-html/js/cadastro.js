// =============================================
// CADASTRO.JS - Cadastro com matrícula, senha e confirmação
// =============================================
document.addEventListener('DOMContentLoaded', function () {
  var cadastroForm = document.getElementById('cadastroForm');
  var nomeInput = document.getElementById('nome');
  var matriculaInput = document.getElementById('matricula');
  var dataNascimentoInput = document.getElementById('dataNascimento');
  var senhaInput = document.getElementById('senhaCadastro');
  var confirmarSenhaInput = document.getElementById('confirmarSenha');
  var errorMessage = document.getElementById('errorMessage');
  var successMessage = document.getElementById('successMessage');
  var cadastroBtn = document.getElementById('cadastroBtn');
  var btnText = document.getElementById('btnText');
  var carregando = false;

  cadastroForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (carregando) return;
    carregando = true;
    cadastroBtn.disabled = true;
    btnText.textContent = 'Cadastrando...';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    var nome = nomeInput.value.trim();
    var matricula = matriculaInput.value.trim();
    var dataNascimento = dataNascimentoInput.value;
    var senha = senhaInput.value;
    var confirmarSenha = confirmarSenhaInput.value;

    // Validações
    if (!nome || !matricula || !dataNascimento || !senha || !confirmarSenha) {
      errorMessage.textContent = 'Preencha todos os campos.';
      errorMessage.style.display = 'block';
      carregando = false;
      cadastroBtn.disabled = false;
      btnText.textContent = 'Cadastrar';
      return;
    }

    if (senha.length < 4) {
      errorMessage.textContent = 'A senha deve ter pelo menos 4 caracteres.';
      errorMessage.style.display = 'block';
      carregando = false;
      cadastroBtn.disabled = false;
      btnText.textContent = 'Cadastrar';
      return;
    }

    if (senha !== confirmarSenha) {
      errorMessage.textContent = 'As senhas não conferem.';
      errorMessage.style.display = 'block';
      carregando = false;
      cadastroBtn.disabled = false;
      btnText.textContent = 'Cadastrar';
      return;
    }

    // Verificar matrícula autorizada
    if (typeof MATRICULAS_VALIDAS !== 'undefined' && !MATRICULAS_VALIDAS.includes(matricula)) {
      errorMessage.textContent = 'Matrícula não autorizada.';
      errorMessage.style.display = 'block';
      carregando = false;
      cadastroBtn.disabled = false;
      btnText.textContent = 'Cadastrar';
      return;
    }

    // Verificar se já existe
    var existente = Database.usuarios.buscarPorMatricula(matricula);
    if (existente) {
      errorMessage.textContent = 'Matrícula já cadastrada. Faça login.';
      errorMessage.style.display = 'block';
      carregando = false;
      cadastroBtn.disabled = false;
      btnText.textContent = 'Cadastrar';
      return;
    }

    // Criar usuário com a senha fornecida
    var usuarios = Database.usuarios.listar();
    var novoUsuario = {
      id: Database._gerarId(),
      nome: nome,
      matricula: matricula,
      dataNascimento: dataNascimento,
      cargo: 'aluno',
      senha: senha,
      criadoEm: Database._agora(),
    };
    usuarios.push(novoUsuario);
    Database._salvar('usuarios', usuarios);

    // Logar automaticamente
    Database.sessao.criar(novoUsuario);

    // Limpar formulário
    nomeInput.value = '';
    matriculaInput.value = '';
    dataNascimentoInput.value = '';
    senhaInput.value = '';
    confirmarSenhaInput.value = '';

    successMessage.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
    successMessage.style.display = 'block';

    carregando = false;
    cadastroBtn.disabled = false;
    btnText.textContent = 'Cadastrar';

    setTimeout(function () {
      window.location.href = 'feed.html';
    }, 1500);
  });
});
