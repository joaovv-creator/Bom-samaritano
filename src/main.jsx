import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import './index.css'
import App from './App.jsx'

// ============================================
// 🔥 SUPABASE - CONFIGURAÇÃO ÚNICA
// ============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🔥 FALLBACK - usar valores diretos se o .env não carregar
const finalUrl = supabaseUrl || 'https://qjesdeizevhjzqkcpuee.supabase.co'
const finalKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqZXNkZWl6ZXZoaWp6cWtjcHVlZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzQ5OTI1OTcwLCJleHAiOjIwNjU1MDE5NzB9.fVQq6fRZp3UXiGgCSt8pFzwsQ3FRRqRZQRbYozuHrMA'

console.log('🚀 main.jsx: INICIANDO...')
console.log('📋 URL:', finalUrl)
console.log('📋 Key definida?', finalKey ? '✅ SIM' : '❌ NÃO')

// Criar cliente
const supabase = createClient(finalUrl, finalKey)

// EXPOR NO WINDOW (UMA ÚNICA VEZ)
if (!window.supabase) {
  window.supabase = supabase
  console.log('✅ Supabase EXPOSTO no window!')
} else {
  console.log('⚠️ Supabase já existe no window!')
}

// TESTAR CONEXÃO RÁPIDO
supabase
  .from('profiles')
  .select('count')
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Erro na conexão:', error.message)
    } else {
      console.log('✅ CONEXÃO BEM-SUCEDIDA! Perfis:', data)
    }
  })

// ============================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)