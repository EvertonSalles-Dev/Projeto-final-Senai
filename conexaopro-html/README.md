# ConexãoPro - Versão HTML/CSS/JS

Rede social acadêmica para o SENAI Barreto.

## Funcionalidades

- ✅ Login com matrícula + data de nascimento (via Supabase Auth)
- ✅ Cadastro com validação de matrícula
- ✅ Feed de publicações com posts em tempo real
- ✅ Perfil do usuário
- ✅ Logout

## Como configurar

### 1. Configurar o Supabase

Abra o arquivo `js/supabase.js` e substitua as variáveis pelas suas credenciais do Supabase:

```js
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sua-chave-anon-publica';
```

### 2. Estrutura do banco de dados

Certifique-se de que seu projeto Supabase tenha as tabelas:

- **profiles** - com campos: `user_id`, `nome`, `matricula`, `data_nascimento`, `cargo`
- **posts** - com campos: `id`, `user_id`, `conteudo`, `created_at`

### 3. Abrir no navegador

Você pode abrir o arquivo `index.html` diretamente no navegador ou usar um servidor local:

```bash
# Com Python
python -m http.server 3000

# Com Node.js (http-server)
npx http-server
```

## Estrutura dos arquivos

```
conexaopro-html/
├── index.html          # Tela de Login
├── cadastro.html       # Tela de Cadastro
├── feed.html           # Tela do Feed
├── css/
│   └── style.css       # Estilos completos
├── js/
│   ├── supabase.js     # Configuração do Supabase
│   ├── login.js        # Lógica do login
│   ├── cadastro.js     # Lógica do cadastro
│   ├── feed.js         # Lógica do feed
│   └── matriculas.js   # Lista de matrículas válidas
├── assets/             # Pasta para imagens
└── README.md
```

## Notas

- Projeto original em Next.js mantido em `../conexaopro-next-main/`
- Esta versão preserva todas as funcionalidades originais
- A navegação entre páginas usa links HTML padrão (sem roteador)
- O design visual é idêntico ao original (mesmo esquema de cores, bordas, efeitos)

