import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("stp_user");
      if (saved) setUser(JSON.parse(saved));
    } catch (_) {}
    setLoading(false);
  }, []);

  function login(userData) {
    const u = { ...userData, loggedAt: new Date().toISOString() };
    setUser(u);
    localStorage.setItem("stp_user", JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("stp_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
