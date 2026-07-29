// Configuração do Supabase para JavaScript puro
// ATENÇÃO: Configure as variáveis abaixo com os valores do seu projeto Supabase

const SUPABASE_URL = 'COLOQUE_A_URL_DO_SUPABASE_AQUI';
const SUPABASE_PUBLISHABLE_KEY = 'COLOQUE_A_CHAVE_PUBLICAVEL_AQUI';

// Verificação das configurações
if (!SUPABASE_URL || SUPABASE_URL === 'COLOQUE_A_URL_DO_SUPABASE_AQUI') {
  console.error('ERRO: SUPABASE_URL não foi configurada.');
  console.error('Abra o arquivo js/supabase.js e configure as variáveis.');
}

if (!SUPABASE_PUBLISHABLE_KEY || SUPABASE_PUBLISHABLE_KEY === 'COLOQUE_A_CHAVE_PUBLICAVEL_AQUI') {
  console.error('ERRO: SUPABASE_PUBLISHABLE_KEY não foi configurada.');
  console.error('Abra o arquivo js/supabase.js e configure as variáveis.');
}

// Inicialização do cliente Supabase
// O CDN do Supabase (UMD) expõe a função createClient()
// Tenta obter a partir de diferentes formas de carregamento (ESM, UMD, etc.)
let supabase = null;

try {
  // Tenta via window.supabase (UMD - unpkg/jsdelivr)
  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    console.log('Supabase client initialized successfully');
  } else {
    console.error('Supabase library not loaded. Make sure to include the Supabase CDN script.');
    console.error('Use: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
    console.error('Or: <script src="https://unpkg.com/@supabase/supabase-js@2"></script>');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

