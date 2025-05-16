import { createClient } from '@supabase/supabase-js'

// As variáveis abaixo devem ser definidas em um arquivo .env.local na raiz do projeto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Crie um arquivo .env.local na raiz do projeto com o seguinte conteúdo:
// VITE_SUPABASE_URL=https://xxxx.supabase.co
// VITE_SUPABASE_KEY=chave_publica_do_supabase 