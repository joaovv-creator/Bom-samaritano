import { createContext, useContext } from 'react'
import { supabase } from '../lib/SupabaseClient'

const SupabaseContext = createContext()

export function SupabaseProvider({ children }) {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)

  if (!context) {
    throw new Error(
      'useSupabase deve ser usado dentro de SupabaseProvider'
    )
  }

  return context
}