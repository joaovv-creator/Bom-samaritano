import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ldncuouzmpcviqzqwtsu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkbmN1b3V6bXBjdmlxenF3dHN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MDY5NzksImV4cCI6MjA5Nzk4Mjk3OX0.0-jnLa3APaHNrlfLR06btKV3dl978Fwur8nSXXqqBTg";

console.log('🚀 SupabaseClient.js CARREGADO!');
console.log('📋 URL:', supabaseUrl);
console.log('📋 Key definida?', supabaseAnonKey ? '✅ SIM' : '❌ NÃO');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// EXPOR NO WINDOW PARA TESTES
window.supabase = supabase;
console.log('✅ Supabase exposto no window!');