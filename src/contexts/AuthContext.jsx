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

  // 🔥 FUNÇÃO DE LOGIN - CORRETA
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      // Recarregar perfil após login
      if (data?.user) {
        await carregarPerfil(data.user)
      }
      
      return data
    } catch (error) {
      console.error('❌ Erro no login:', error)
      throw error
    }
  }

  // 🔥 FUNÇÃO DE CADASTRO - CORRIGIDA
  const signUp = async (email, password, nome) => {
    try {
      // 1. Criar usuário no auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: nome, // Salva o nome no metadata do usuário
          },
        },
      })

      if (error) throw error

      // 2. Se o usuário foi criado, criar o perfil na tabela profiles
      if (data?.user) {
        // Aguarda um pouco para garantir que o usuário foi criado no auth
        await new Promise(resolve => setTimeout(resolve, 500))

        // Tenta criar o perfil
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              name: nome,
              role: 'membro',
              created_at: new Date().toISOString(),
            },
          ])

        if (profileError) {
          console.error('❌ Erro ao criar perfil:', profileError)
          
          // Se o perfil já existe, tenta atualizar
          if (profileError.code === '23505') { // Código de violação de chave única
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                name: nome,
                email: email,
                updated_at: new Date().toISOString(),
              })
              .eq('id', data.user.id)

            if (updateError) {
              console.error('❌ Erro ao atualizar perfil:', updateError)
            }
          }
        } else {
          console.log('✅ Perfil criado com sucesso!')
        }
      }

      return data
    } catch (error) {
      console.error('❌ Erro no cadastro:', error)
      throw error
    }
  }

  // 🔥 FUNÇÃO DE LOGOUT
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error) {
      console.error('❌ Erro ao sair:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}