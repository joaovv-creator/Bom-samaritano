// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 AuthProvider: Iniciando...')

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        carregarPerfil(session.user)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await carregarPerfil(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function carregarPerfil(user) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        await criarPerfil(user)
      } else if (error) {
        console.error('❌ Erro ao carregar perfil:', error)
      } else {
        // 🔥 Adicionar avatar_url ao objeto do usuário
        setUser({ 
          ...user, 
          ...data,
          avatar_url: data?.avatar_url || null 
        })
      }
    } catch (error) {
      console.error('❌ Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  async function criarPerfil(user) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
            email: user.email
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao criar perfil:', error)
        return
      }

      setUser({ ...user, ...data })
    } catch (error) {
      console.error('❌ Erro ao criar perfil:', error)
    }
  }

  // 🔥 FUNÇÃO PARA ATUALIZAR O AVATAR
  async function atualizarAvatar(userId, avatarUrl) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      // Atualizar o estado do usuário com a nova URL
      setUser(prev => ({ 
        ...prev, 
        avatar_url: avatarUrl,
        ...data 
      }))

      return data
    } catch (error) {
      console.error('❌ Erro ao atualizar avatar:', error)
      throw error
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, nome) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: nome },
      },
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    atualizarAvatar, // 🔥 Exportar a função
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}