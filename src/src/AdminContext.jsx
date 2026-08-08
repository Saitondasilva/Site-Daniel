import React, { createContext, useContext, useState, useEffect } from "react";
import { categories as defaultCategories } from "./categories.js";

const AdminContext = createContext(null);

// Credenciais do admin (em produção, validar no backend)
const ADMIN_CREDENTIALS = { email: "admin@stpverde.st", password: "admin2024" };

function seed() {
  // Converte categories.js para o formato editável
  return defaultCategories.map((cat) => ({
    ...cat,
    icon: cat.id, // guardamos apenas o id string (o icon component é mapeado em runtime)
    services: cat.services.map((svc) => ({
      ...svc,
      icon: svc.id,
    })),
    ativo: true,
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
    const updated = [...categories, { ...cat, id: `cat-${Date.now()}`, ativo: true, services: [] }];
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
      ? { ...c, services: [...c.services, { ...svc, id: `svc-${Date.now()}`, listings: [] }] }
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

  // ── Parceiros/Listings ──
  function addListing(catId, svcId, listing) {
    persist(categories.map((c) => c.id === catId
      ? { ...c, services: c.services.map((s) => s.id === svcId
          ? { ...s, listings: [...s.listings, { ...listing, id: `lst-${Date.now()}`, avaliacao: 4.5, avaliacoes: 0, featured: false }] }
          : s) }
      : c));
  }

  function updateListing(catId, svcId, lstId, fields) {
    persist(categories.map((c) => c.id === catId
      ? { ...c, services: c.services.map((s) => s.id === svcId
          ? { ...s, listings: s.listings.map((l) => l.id === lstId ? { ...l, ...fields } : l) }
          : s) }
      : c));
  }

  function deleteListing(catId, svcId, lstId) {
    persist(categories.map((c) => c.id === catId
      ? { ...c, services: c.services.map((s) => s.id === svcId
          ? { ...s, listings: s.listings.filter((l) => l.id !== lstId) }
          : s) }
      : c));
  }

  function toggleFeatured(catId, svcId, lstId) {
    persist(categories.map((c) => c.id === catId
      ? { ...c, services: c.services.map((s) => s.id === svcId
          ? { ...s, listings: s.listings.map((l) => l.id === lstId ? { ...l, featured: !l.featured } : l) }
          : s) }
      : c));
  }

  // ── Reservas ──
  function updateReservaStatus(id, status) {
    const updated = reservas.map((r) => r.id === id ? { ...r, status } : r);
    setReservas(updated);
    localStorage.setItem("stp_reservas", JSON.stringify(updated));
  }

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
      categories, addCategory, updateCategory, deleteCategory, toggleCategory,
      addService, updateService, deleteService,
      addListing, updateListing, deleteListing, toggleFeatured,
      reservas, updateReservaStatus,
      utilizadores, stats,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() { return useContext(AdminContext); }
