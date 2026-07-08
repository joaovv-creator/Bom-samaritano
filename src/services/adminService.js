// src/services/adminService.js
import { supabase } from './supabase'

export const adminService = {
  // ============================================
  // VERIFICA SE O USUÁRIO É ADMIN
  // ============================================
  async isAdmin(userId) {
    if (!userId) return false
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      if (error) throw error
      return data?.role === 'admin'
    } catch (error) {
      console.error('Erro ao verificar admin:', error)
      return false
    }
  },

  // ============================================
  // ATIVIDADES KIDS
  // ============================================
  async getAtividades() {
    const { data, error } = await supabase
      .from('atividades_kids')
      .select('*')
      .eq('ativo', true)
      .order('id', { ascending: true })
    if (error) throw error
    return data
  },

  async criarAtividade(dados) {
    const { data, error } = await supabase
      .from('atividades_kids')
      .insert([{
        titulo: dados.titulo,
        tipo: dados.tipo,
        duracao: dados.duracao,
        link: dados.link || '',
        cor: dados.cor || '#8b5e3c',
        bg_cor: dados.bg_cor || '#f5f0eb',
        emoji: dados.emoji || '⭐',
        icone: dados.icone || 'Star',
        ativo: true
      }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletarAtividade(id) {
    const { error } = await supabase
      .from('atividades_kids')
      .update({ ativo: false })
      .eq('id', id)
    if (error) throw error
    return true
  },

  // ============================================
  // PRODUTOS
  // ============================================
  async getProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true)
      .order('id', { ascending: true })
    if (error) throw error
    return data
  },

  async criarProduto(dados) {
    const { data, error } = await supabase
      .from('produtos')
      .insert([{
        nome: dados.nome,
        preco: dados.preco,
        avaliacao: dados.avaliacao || 0,
        avaliacoes: dados.avaliacoes || 0,
        categoria: dados.categoria,
        descricao: dados.descricao,
        imagem: dados.imagem,
        ativo: true
      }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletarProduto(id) {
    const { error } = await supabase
      .from('produtos')
      .update({ ativo: false })
      .eq('id', id)
    if (error) throw error
    return true
  },

  // ============================================
  // CURSOS
  // ============================================
  async getCursos() {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('ativo', true)
      .order('id', { ascending: true })
    if (error) throw error
    return data
  },

  async criarCurso(dados) {
    const { data, error } = await supabase
      .from('cursos')
      .insert([{
        nome: dados.nome,
        professor: dados.professor,
        alunos: dados.alunos || 0,
        duracao: dados.duracao,
        preco: dados.preco,
        nivel: dados.nivel,
        cor: dados.cor,
        icone: dados.icone || 'Music',
        topicos: dados.topicos || [],
        ativo: true
      }])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deletarCurso(id) {
    const { error } = await supabase
      .from('cursos')
      .update({ ativo: false })
      .eq('id', id)
    if (error) throw error
    return true
  },

  // ============================================
  // DEVOCIONAL DIÁRIO
  // ============================================
  async getDevocionalDiario() {
    const { data, error } = await supabase
      .from('devocional_diario')
      .select('*')
      .order('data', { ascending: false })
      .limit(1)
    if (error) throw error
    return data?.[0] || null
  },

  async atualizarDevocional(dados) {
    const hoje = new Date().toISOString().split('T')[0]
    
    // Verifica se já existe devocional para hoje
    const { data: existente } = await supabase
      .from('devocional_diario')
      .select('id')
      .eq('data', hoje)
      .maybeSingle()

    if (existente) {
      const { data, error } = await supabase
        .from('devocional_diario')
        .update({
          titulo: dados.titulo,
          versiculo: dados.versiculo,
          reflexao: dados.reflexao,
          oracao: dados.oracao,
          updated_at: new Date().toISOString()
        })
        .eq('id', existente.id)
        .select()
        .single()
      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .from('devocional_diario')
        .insert([{
          titulo: dados.titulo,
          versiculo: dados.versiculo,
          reflexao: dados.reflexao,
          oracao: dados.oracao,
          data: hoje
        }])
        .select()
        .single()
      if (error) throw error
      return data
    }
  },

  // ============================================
  // DASHBOARD
  // ============================================
  async getDashboardData() {
    const [produtos, cursos, atividades, devocional] = await Promise.all([
      supabase.from('produtos').select('*', { count: 'exact', head: true }).eq('ativo', true),
      supabase.from('cursos').select('*', { count: 'exact', head: true }).eq('ativo', true),
      supabase.from('atividades_kids').select('*', { count: 'exact', head: true }).eq('ativo', true),
      supabase.from('devocional_diario').select('*', { count: 'exact', head: true }),
    ])

    // Buscar vendas (pedidos) - se tiver tabela de pedidos
    let vendas = { total: 0, valor_total: 0 }
    try {
      const { data: pedidos, error: pedidosError } = await supabase
        .from('pedidos')
        .select('valor_total, status')
        .eq('status', 'concluido')
      
      if (!pedidosError && pedidos) {
        vendas.total = pedidos.length
        vendas.valor_total = pedidos.reduce((acc, p) => acc + (p.valor_total || 0), 0)
      }
    } catch (e) {
      console.log('Tabela pedidos não encontrada')
    }

    return {
      produtos: produtos.count || 0,
      cursos: cursos.count || 0,
      atividades: atividades.count || 0,
      devocional: devocional.count || 0,
      vendas
    }
  }
}