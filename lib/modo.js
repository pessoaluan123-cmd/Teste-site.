// Sem banco de dados configurado, o site roda em modo demonstração:
// tudo funciona na tela, mas nada é salvo no servidor e nada é cobrado.
export function modoDemo() {
  return !process.env.SUPABASE_URL || process.env.MODO_DEMO === 'true';
}
