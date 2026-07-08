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
    return data || []
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
    return data || []
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
    try {
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .eq('ativo', true)
        .order('id', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar cursos:', error)
      return []
    }
  },

  async criarCurso(dados) {
    try {
      const cursoData = {
        titulo: dados.titulo,
        professor: dados.professor,
        duracao: dados.duracao || '',
        preco: dados.preco || 0,
        nivel: dados.nivel || '',
        cor: dados.cor || 'linear-gradient(135deg, #9b6b4f 0%, #8b5e3c 100%)',
        icone: dados.icone || 'Music',
        topicos: dados.topicos || [],
        alunos: 0,
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('cursos')
        .insert([cursoData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar curso:', error)
      throw error
    }
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
  // MATRÍCULAS - 🔥 NOVA FUNÇÃO
  // ============================================
  async criarMatricula(dados) {
    try {
      console.log('📝 Criando matrícula com dados:', dados)

      // 1. Verificar se já está matriculado
      const { data: existing, error: checkError } = await supabase
        .from('matriculas')
        .select('id')
        .eq('aluno_id', dados.aluno_id)
        .eq('curso_id', dados.curso_id)
        .eq('status', 'ativo')
        .maybeSingle()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existing) {
        throw new Error('Você já está matriculado neste curso')
      }

      // 2. Inserir a matrícula
      const { data: matricula, error: matriculaError } = await supabase
        .from('matriculas')
        .insert([{
          aluno_id: dados.aluno_id,
          curso_id: dados.curso_id,
          status: 'ativo',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (matriculaError) {
        console.error('❌ Erro ao inserir matrícula:', matriculaError)
        throw matriculaError
      }

      console.log('✅ Matrícula criada:', matricula)

      // 3. Atualizar o contador de alunos do curso
      const { data: curso, error: cursoError } = await supabase
        .from('cursos')
        .select('alunos')
        .eq('id', dados.curso_id)
        .single()

      if (cursoError) {
        console.error('❌ Erro ao buscar curso:', cursoError)
        throw cursoError
      }

      const novoTotal = (curso.alunos || 0) + 1

      const { error: updateError } = await supabase
        .from('cursos')
        .update({ 
          alunos: novoTotal,
          updated_at: new Date().toISOString()
        })
        .eq('id', dados.curso_id)

      if (updateError) {
        console.error('❌ Erro ao atualizar alunos:', updateError)
        throw updateError
      }

      console.log(`✅ Curso atualizado: ${novoTotal} alunos`)

      return matricula
    } catch (error) {
      console.error('❌ Erro ao criar matrícula:', error)
      throw error
    }
  },

  async getMatriculasByUser(userId) {
    try {
      const { data, error } = await supabase
        .from('matriculas')
        .select('*, cursos(*)')
        .eq('aluno_id', userId)
        .eq('status', 'ativo')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar matrículas do usuário:', error)
      return []
    }
  },

  async getMatriculasByCurso(cursoId) {
    try {
      const { data, error } = await supabase
        .from('matriculas')
        .select('*, profiles(name, email)')
        .eq('curso_id', cursoId)
        .eq('status', 'ativo')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar matrículas do curso:', error)
      return []
    }
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