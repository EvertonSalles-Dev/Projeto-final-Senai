// =============================================
// LOGIN.JS - Autenticação com matrícula e senha
// =============================================
document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('loginForm');
  var matriculaInput = document.getElementById('matricula');
  var senhaInput = document.getElementById('senhaLogin');
  var errorMessage = document.getElementById('errorMessage');
  var loginBtn = document.getElementById('loginBtn');
  var btnText = document.getElementById('btnText');
  var carregando = false;

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (carregando) return;
    carregando = true;
    loginBtn.disabled = true;
    btnText.textContent = 'Entrando...';
    errorMessage.style.display = 'none';

    var matricula = matriculaInput.value.trim();
    var senha = senhaInput.value;

    if (!matricula || !senha) {
      errorMessage.textContent = 'Preencha todos os campos.';
      errorMessage.style.display = 'block';
      carregando = false;
      loginBtn.disabled = false;
      btnText.textContent = 'Entrar';
      return;
    }

    // Buscar usuário pela matrícula
    var usuarios = Database.usuarios.listar();
    var usuario = Database.usuarios.buscarPorMatricula(matricula);

    if (!usuario) {
      errorMessage.textContent = 'Matrícula não encontrada.';
      errorMessage.style.display = 'block';
      carregando = false;
      loginBtn.disabled = false;
      btnText.textContent = 'Entrar';
      return;
    }

    if (usuario.senha !== senha) {
      errorMessage.textContent = 'Senha inválida.';
      errorMessage.style.display = 'block';
      carregando = false;
      loginBtn.disabled = false;
      btnText.textContent = 'Entrar';
      return;
    }

    // Login bem-sucedido
    Database.sessao.criar(usuario);
    window.location.href = 'feed.html';
  });
});
