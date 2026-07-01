// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 AuthProvider: Iniciando...')

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Sessão:', session)
      if (session?.user) {
        setUser(session.user)
        carregarPerfil(session.user)
      } else {
        setLoading(false)
      }
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event)
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('👤 Usuário logou:', session.user.id)
          setUser(session.user)
          await carregarPerfil(session.user)
        } else if (event === 'SIGNED_OUT') {
          console.log('👤 Usuário deslogou')
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
      console.log('📝 Carregando perfil para:', user.id)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        console.log('📝 Perfil não encontrado. Criando...')
        await criarPerfil(user)
      } else if (error) {
        console.error('❌ Erro ao carregar perfil:', error)
      } else {
        console.log('✅ Perfil carregado:', data)
        // Adicionar dados do perfil ao usuário
        setUser({ ...user, ...data })
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

      console.log('✅ Perfil criado:', data)
      setUser({ ...user, ...data })
    } catch (error) {
      console.error('❌ Erro ao criar perfil:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password, options) => supabase.auth.signUp({ email, password, options }),
    signOut: () => supabase.auth.signOut()
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