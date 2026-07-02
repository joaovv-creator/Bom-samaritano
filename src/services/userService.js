// src/services/userService.js
import { supabase } from './supabase' // Ajuste o caminho conforme sua estrutura

export const userService = {
  // Buscar total de usuários - USANDO SUPABASE
  getTotalUsers: async () => {
    try {
      // Opção 1: Contar registros na tabela 'users' ou 'profiles'
      const { count, error } = await supabase
        .from('profiles') 
        .select('*', { count: 'exact', head: true })
      
      if (error) throw error
      
      console.log('✅ Total de usuários encontrado:', count)
      return { total: count || 0 }
    } catch (error) {
      console.error('❌ Erro ao buscar total de usuários:', error)
      throw error
    }
  },

  // Buscar lista de usuários - USANDO SUPABASE
  getUsers: async (page = 1, limit = 20) => {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1
      
      const { data, error, count } = await supabase
        .from('users') // ou 'profiles'
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return { data, count, page, limit }
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error)
      throw error
    }
  },

  // Buscar usuário por ID - USANDO SUPABASE
  getUserById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('users') // ou 'profiles'
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      return data
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error)
      throw error
    }
  },

  // Atualizar usuário - USANDO SUPABASE
  updateUser: async (id, userData) => {
    try {
      const { data, error } = await supabase
        .from('users') // ou 'profiles'
        .update(userData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      return data
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error)
      throw error
    }
  },

  // Deletar usuário - USANDO SUPABASE
  deleteUser: async (id) => {
    try {
      const { data, error } = await supabase
        .from('users') // ou 'profiles'
        .delete()
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      return data
    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error)
      throw error
    }
  }
}