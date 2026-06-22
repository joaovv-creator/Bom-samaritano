import {  createContext, useContext, useState, useEffect, } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const userData = {
      email,
      name: email.split("@")[0],
      id: Date.now(),
    };

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

    return {
      success: true,
      user: userData,
    };
  };

  const signUp = async (
    email,
    password,
    name
  ) => {
    const userData = {
      email,
      name,
      id: Date.now(),
    };

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

    return {
      success: true,
      user: userData,
    };
  };

  const signOut = async () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}