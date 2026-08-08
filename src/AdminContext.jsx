import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { categories as defaultCategories } from "./categories.js";
import { getIcon } from "./iconMap.js";

const AdminContext = createContext(null);

// Credenciais do admin (em produção, validar no backend)
const ADMIN_CREDENTIALS = { email: "admin@stpverde.st", password: "admin2024" };

function seed() {
  // Converte categories.js para o formato editável (icon já vem como string)
  return defaultCategories.map((cat) => ({
    ...cat,
    ativo: true,
    services: cat.services.map((svc) => ({ ...svc })),
  }));
}

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [utilizadores, setUtilizadores] = useState([]);

  useEffect(() => {
    // Restaurar sessão admin
    try {
      const s = localStorage.getItem("stp_admin");
      if (s) setAdminUser(JSON.parse(s));
    } catch (_) {}

    // Carregar categorias (ou inicializar com seed)
    try {
      const saved = localStorage.getItem("stp_admin_categories");
      setCategories(saved ? JSON.parse(saved) : seed());
    } catch (_) { setCategories(seed()); }

    // Reservas
    try {
      const r = localStorage.getItem("stp_reservas");
      setReservas(r ? JSON.parse(r) : []);
    } catch (_) {}

    // Utilizadores registados
    try {
      const u = localStorage.getItem("stp_users");
      setUtilizadores(u ? JSON.parse(u) : []);
    } catch (_) {}
  }, []);

  function persist(cats) {
    setCategories(cats);
    localStorage.setItem("stp_admin_categories", JSON.stringify(cats));
  }

  function adminLogin(email, password) {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const u = { email, role: "admin", loggedAt: new Date().toISOString() };
      setAdminUser(u);
      localStorage.setItem("stp_admin", JSON.stringify(u));
      return true;
    }
    return false;
  }

  function adminLogout() {
    setAdminUser(null);
    localStorage.removeItem("stp_admin");
  }

  // ── Categorias ──
  function addCategory(cat) {
    const updated = [...categories, { icon: "Compass", ...cat, id: `cat-${Date.now()}`, ativo: true, services: [] }];
    persist(updated);
  }

  function updateCategory(id, fields) {
    persist(categories.map((c) => c.id === id ? { ...c, ...fields } : c));
  }

  function deleteCategory(id) {
    persist(categories.filter((c) => c.id !== id));
  }

  function toggleCategory(id) {
    persist(categories.map((c) => c.id === id ? { ...c, ativo: !c.ativo } : c));
  }

  // ── Serviços ──
  function addService(catId, svc) {
    persist(categories.map((c) => c.id === catId
      ? { ...c, services: [...c.services, { icon: "Compass", ...svc, id: `svc-${Date.now()}`, listings: [] }] }
      : c));
  }

  function updateService(catId, svcId, fields) {
    persist(categories.map((c) => c.id === catId
      ? { ...c, services: c.services.map((s) => s.id === svcId ? { ...s, ...fields } : s) }
      : c));
  }

  function deleteService(catId, svcId) {
    persist(categories.map((c) => c.id === catId
      ? { ...c, services: c.services.filter((s) => s.id !== svcId) }
      : c));
  }

  // ── Parceiros (listings dentro de um serviço) ──
  function addListing(catId, svcId, listing) {
    persist(categories.map((c) => c.id === catId
      ? {
          ...c,
          services: c.services.map((s) => s.id === svcId
            ? { ...s, listings: [...(s.listings || []), { avaliacao: 5, avaliacoes: 0, tags: [], contacto: {}, ...listing, id: `ptn-${Date.now()}` }] }
            : s),
        }
      : c));
  }

  function updateListing(catId, svcId, listingId, fields) {
    persist(categories.map((c) => c.id === catId
      ? {
          ...c,
          services: c.services.map((s) => s.id === svcId
            ? { ...s, listings: (s.listings || []).map((l) => l.id === listingId ? { ...l, ...fields } : l) }
            : s),
        }
      : c));
  }

  function deleteListing(catId, svcId, listingId) {
    persist(categories.map((c) => c.id === catId
      ? {
          ...c,
          services: c.services.map((s) => s.id === svcId
            ? { ...s, listings: (s.listings || []).filter((l) => l.id !== listingId) }
            : s),
        }
      : c));
  }

  // ── Reservas (sistema de reservas real, partilhado com o site público) ──
  function addReserva(reservaData) {
    const nova = {
      status: "pendente",
      createdAt: new Date().toISOString(),
      ...reservaData,
      id: Date.now(),
    };
    const updated = [...reservas, nova];
    setReservas(updated);
    localStorage.setItem("stp_reservas", JSON.stringify(updated));
    return nova;
  }

  function updateReservaStatus(id, status) {
    const updated = reservas.map((r) => r.id === id ? { ...r, status } : r);
    setReservas(updated);
    localStorage.setItem("stp_reservas", JSON.stringify(updated));
  }

  // ── Utilizadores (registo real, partilhado com o site público) ──
  function registerUtilizador(userData) {
    const novo = { createdAt: new Date().toISOString(), ...userData, id: Date.now() };
    const updated = [...utilizadores, novo];
    setUtilizadores(updated);
    localStorage.setItem("stp_users", JSON.stringify(updated));
    return novo;
  }

  function findUtilizadorByEmail(email) {
    return utilizadores.find((u) => u.email === email);
  }

  // ── Categorias hidratadas para o site público ──
  // Converte o nome do ícone (string, editável no admin) de volta num
  // componente lucide-react e esconde categorias desativadas.
  const publicCategories = useMemo(() => {
    return categories
      .filter((c) => c.ativo !== false)
      .map((c) => ({
        ...c,
        icon: getIcon(c.icon),
        services: (c.services || []).map((s) => ({
          ...s,
          icon: getIcon(s.icon),
          listings: s.listings || [],
        })),
      }));
  }, [categories]);

  const stats = {
    totalCategorias: categories.length,
    categoriasAtivas: categories.filter((c) => c.ativo).length,
    totalServicos: categories.reduce((s, c) => s + c.services.length, 0),
    totalParceiros: categories.reduce((s, c) => s + c.services.reduce((s2, sv) => s2 + (sv.listings?.length || 0), 0), 0),
    totalReservas: reservas.length,
    reservasPendentes: reservas.filter((r) => r.status === "pendente").length,
    totalUtilizadores: utilizadores.length,
  };

  return (
    <AdminContext.Provider value={{
      adminUser, adminLogin, adminLogout,
      categories, publicCategories,
      addCategory, updateCategory, deleteCategory, toggleCategory,
      addService, updateService, deleteService,
      addListing, updateListing, deleteListing,
      reservas, addReserva, updateReservaStatus,
      utilizadores, registerUtilizador, findUtilizadorByEmail,
      stats,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() { return useContext(AdminContext); }
