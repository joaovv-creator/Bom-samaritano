import { createContext, useContext } from "react";

const SupabaseContext = createContext();

function SupabaseProvider({ children }) {
  const value = {};

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

function useSupabase() {
  return useContext(SupabaseContext);
}

export { SupabaseProvider, useSupabase };