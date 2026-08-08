import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { getIcon } from "./iconMap.js";
import {
  strapiListCategorias, strapiCreateCategoria, strapiUpdateCategoria, strapiDeleteCategoria,
} from "./strapiApi.js";

const AdminContext = createContext(null);

// Credenciais do admin — locais por agora (sem backend próprio de auth)
const ADMIN_CREDENTIALS = { email: "admin@stpverde.st", password: "admin2024" };

// ── "Enriquecimento" local ──
// A API de categorias do colega só guarda Titulo/Descricao. Os campos extra
// que o site usa (ícone, imagem de fundo, tagline, estado ativo/inativo) e
// os SERVIÇOS dentro de cada categoria ainda não existem nessa API — por
// isso guardamos isso aqui em localStorage, associado ao id da categoria
// (documentId do Strapi). Quando esses endpoints existirem no backend,
// troca-se esta camada por chamadas reais, sem mexer no resto da app.
const LOCAL_EXTRAS_KEY = "stp_local_categoria_extras"; // { [catId]: { icon, heroImage, tagline, ativo } }
const LOCAL_SERVICES_KEY = "stp_local_services";        // { [catId]: [ { id, name, description, label, preco, icon, image, listings: [...] } ] }
const LOCAL_CATEGORIES_KEY = "stp_local_categorias";    // categorias que não vivem na API do colega (Destinos/Pacotes)
const RESERVAS_KEY = "stp_reservas";
const USERS_KEY = "stp_users";

// Estas duas categorias ainda não existem na API partilhada do colega —
// ficam só locais, com conteúdo de exemplo já pronto, para a apresentação
// não ficar vazia enquanto esses endpoints não existem.
const SPECIAL_CATEGORY_IDS = ["destinos-turisticos", "pacotes-oferecidos"];

function seedLocalCategoriasIfEmpty() {
  const existing = loadJSON(LOCAL_CATEGORIES_KEY, null);
  if (existing) return existing;

  const seeded = {
    "destinos-turisticos": { title: "Destinos turísticos", description: "Os lugares que tornam São Tomé e Príncipe inesquecível.", tagline: "Explora o arquipélago", icon: "Compass", heroImage: "/images/pico-cao-grande.webp", ativo: true },
    "pacotes-oferecidos": { title: "Pacotes oferecidos", description: "Combinações pensadas de alojamento, transporte e excursões.", tagline: "Roteiros prontos", icon: "Package", heroImage: "/images/forte-sao-sebastiao.jpg", ativo: true },
  };
  saveJSON(LOCAL_CATEGORIES_KEY, seeded);

  const seededServices = loadJSON(LOCAL_SERVICES_KEY, {});
  seededServices["destinos-turisticos"] = [
    { id: "dest-pico-cao-grande", name: "Pico Cão Grande", label: "Parque Natural Obô, São Tomé", description: "Uma agulha vulcânica de quase 370m que se ergue sobre a floresta tropical.", icon: "MapPin", image: "/images/pico-cao-grande.webp", listings: [] },
    { id: "dest-forte-sao-sebastiao", name: "Forte de São Sebastião", label: "Cidade de São Tomé", description: "Fortaleza do século XVI à beira-mar que hoje acolhe o Museu Nacional.", icon: "MapPin", image: "/images/forte-sao-sebastiao.jpg", listings: [] },
    { id: "dest-praia-verde", name: "Praia Lagoa Azul", label: "Costa Sul, São Tomé", description: "Águas calmas e cristalinas, ideal para mergulho livre e um dia em família.", icon: "MapPin", image: "/images/praia-verde-stp.jpg", listings: [] },
  ];
  seededServices["pacotes-oferecidos"] = [
    { id: "pacote-essencial", name: "STP Essencial", label: "3 dias / 2 noites", description: "Cidade de São Tomé, Forte de São Sebastião e uma tarde de praia.", preco: "Desde 220€ / pessoa", icon: "Package", image: "/images/forte-sao-sebastiao.jpg", listings: [] },
    { id: "pacote-aventura", name: "Aventura na Floresta", label: "4 dias / 3 noites", description: "Trilhos no Parque Natural Obô e alojamento em eco-lodge na floresta.", preco: "Desde 340€ / pessoa", icon: "Package", image: "/images/pico-cao-grande.webp", listings: [] },
    { id: "pacote-ilha-completa", name: "Ilha Completa", label: "7 dias / 6 noites", description: "Roteiro completo entre São Tomé e Príncipe: praias, cultura e gastronomia.", preco: "Desde 690€ / pessoa", icon: "Package", image: "/images/praia-verde-stp.jpg", listings: [] },
  ];
  saveJSON(LOCAL_SERVICES_KEY, seededServices);

  return seeded;
}

// Conteúdo que já existia antes (categories.js) para categorias que a API
// do colega já tem mas que ainda vêm sem serviços. Serve só de ponto de
// partida — o admin pode editar ou apagar à vontade depois.
const KNOWN_SERVICE_SEEDS = {
  "Alojamento": [
    {
      id: "hoteis", name: "Alojamento", description: "Conforto completo para explorar a capital e a costa.",
      icon: "Hotel", image: "/images/categories/Alojamento.avif",
      listings: [
        { id: "mucumbri", nome: "Mucumbri", tipo: "Resort 5★", local: "São Tomé", descricao: "O resort mais aconchegante da ilha, com piscina convidativa e jardins tropicais exuberantes.", destaque: "Piscina infinita com vista mar", avaliacao: 4.9, avaliacoes: 312, preco: "Desde 180€/noite", tags: ["Piscina", "Spa", "Restaurante", "Wi-Fi", "AC"], contacto: { tel: "+239 222 1234", email: "reservas@omali.st", web: "omali.st" }, featured: true },
      ],
    },
    {
      id: "Transporte", name: "Transporte", description: "Dias sem pressa entre praia, piscina e boa mesa.",
      icon: "Palmtree", image: "/images/categories/Jimmy.jpg",
      listings: [
        { id: "bom-bom", nome: "Bom Bom Island Resort", tipo: "Resort boutique", local: "Ilha do Príncipe", descricao: "Um resort isolado no extremo norte do Príncipe, acessível apenas de barco. Bangalôs sobre a água, mergulho de classe mundial e silêncio absoluto.", destaque: "Bangalôs sobre a água", avaliacao: 5.0, avaliacoes: 143, preco: "Desde 350€/noite", tags: ["Isolado", "Mergulho", "All-inclusive", "Natureza"], contacto: { tel: "+239 225 1111", email: "info@bombom.st", web: "bombomisland.com" }, featured: true },
        { id: "sundy", nome: "Roça Sundy", tipo: "Eco-resort histórico", local: "Príncipe Norte", descricao: "Instalado numa roça do século XIX dentro da Reserva da Biosfera da UNESCO. Arquitectura colonial restaurada, floresta primária e gastronomia km zero.", destaque: "Reserva da Biosfera UNESCO", avaliacao: 4.8, avaliacoes: 201, preco: "Desde 220€/noite", tags: ["UNESCO", "Histórico", "Eco", "Gastronomia"], contacto: { tel: "+239 225 2222", email: "reservas@sundy.st", web: "rocasundy.com" }, featured: true },
      ],
    },
    {
      id: "Excursoes", name: "Excursões", description: "Acolhimento familiar com alma santomense.",
      icon: "Binoculars", image: "/images/pico-cao-grande.webp",
      listings: [
        { id: "casa-lilas", nome: "Casa Lilás", tipo: "Guesthouse", local: "São Tomé cidade", descricao: "Pequena guesthouse familiar no bairro histórico de São Tomé. Pequeno-almoço com produtos locais, proprietários simpáticos e dicas genuínas sobre a ilha.", destaque: "Pequeno-almoço local incluído", avaliacao: 4.6, avaliacoes: 84, preco: "Desde 45€/noite", tags: ["Familiar", "Centro", "Pequeno-almoço", "Autêntico"], contacto: { tel: "+239 222 7788", email: "casalilas@gmail.com", web: "" }, featured: true },
        { id: "quinta-tropical", nome: "Quinta Tropical", tipo: "Guesthouse rural", local: "Monte Café", descricao: "Quinta nos arredores de Monte Café, rodeada de cacaueiros e bananeiras. Quartos amplos, silêncio absoluto e visitas às plantações incluídas.", destaque: "No coração das plantações", avaliacao: 4.4, avaliacoes: 56, preco: "Desde 55€/noite", tags: ["Rural", "Plantações", "Tranquilo", "Natureza"], contacto: { tel: "+239 222 9900", email: "quintatropical@st.net", web: "" }, featured: false },
      ],
    },
    {
      id: "Tours", name: "Tours", description: "Natureza, silêncio e baixa pegada ambiental.",
      icon: "TentTree", image: "/images/tours.jpg",
      listings: [
        { id: "boa-vista-eco-1", nome: "Boa Vista Eco Lodge", tipo: "Eco-lodge", local: "Floresta do Sul", descricao: "Lodge sustentável construído com materiais locais no interior da floresta equatorial. Energia solar, água da nascente e trilhos privados com guia incluído.", destaque: "100% energia solar", avaliacao: 4.7, avaliacoes: 78, preco: "Desde 95€/noite", tags: ["Solar", "Floresta", "Trilhos", "Sustentável", "Guia"], contacto: { tel: "+239 222 6677", email: "ecolodge@boavista.st", web: "boavistaeco.st" }, featured: true },
      ],
    },
    {
      id: "Eventos", name: "Eventos", description: "Cultura e tradição santomense em cada evento.",
      icon: "Ticket", image: "/images/tchiloli.jpg",
      listings: [
        { id: "boa-vista-eco-2", nome: "Boa Vista Eco Lodge", tipo: "Eco-lodge", local: "Floresta do Sul", descricao: "Lodge sustentável construído com materiais locais no interior da floresta equatorial. Energia solar, água da nascente e trilhos privados com guia incluído.", destaque: "100% energia solar", avaliacao: 4.7, avaliacoes: 78, preco: "Desde 95€/noite", tags: ["Solar", "Floresta", "Trilhos", "Sustentável", "Guia"], contacto: { tel: "+239 222 6677", email: "ecolodge@boavista.st", web: "boavistaeco.st" }, featured: true },
      ],
    },
  ],
};

// Preenche os serviços de uma categoria vinda da API na primeira vez que a
// vemos (sem serviços gravados ainda). Se o admin já tiver editado/apagado
// os serviços dessa categoria (mesmo que fique vazia de propósito), não
// volta a mexer — só semeia da primeira vez.
function seedServicesForCategory(catId, catTitle) {
  const localServices = loadJSON(LOCAL_SERVICES_KEY, {});
  if (localServices[catId] !== undefined) return localServices[catId];

  const seed = KNOWN_SERVICE_SEEDS[catTitle];
  localServices[catId] = seed ? seed.map((s) => ({ ...s, listings: s.listings.map((l) => ({ ...l })) })) : [];
  saveJSON(LOCAL_SERVICES_KEY, localServices);
  return localServices[catId];
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservas, setReservas] = useState([]);
  const [utilizadores, setUtilizadores] = useState([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem("stp_admin_session");
      if (s) setAdminUser(JSON.parse(s));
    } catch (_) {}
    setReservas(loadJSON(RESERVAS_KEY, []));
    setUtilizadores(loadJSON(USERS_KEY, []));
  }, []);

  // ── Categorias: Strapi (título/descrição) + extras locais (ícone/imagem/serviços) ──
  const loadCategorias = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const strapiCats = await strapiListCategorias();
      const extras = loadJSON(LOCAL_EXTRAS_KEY, {});
      const localServices = loadJSON(LOCAL_SERVICES_KEY, {});
      const localCats = seedLocalCategoriasIfEmpty();

      const fromStrapi = strapiCats.map((c) => ({
        ...c,
        icon: extras[c.id]?.icon || "Compass",
        heroImage: extras[c.id]?.heroImage || "",
        tagline: extras[c.id]?.tagline || "",
        ativo: extras[c.id]?.ativo !== false,
        services: seedServicesForCategory(c.id, c.title),
        source: "api",
      }));

      const fromLocal = SPECIAL_CATEGORY_IDS.map((id) => ({
        id,
        title: localCats[id]?.title || id,
        description: localCats[id]?.description || "",
        tagline: localCats[id]?.tagline || "",
        icon: localCats[id]?.icon || "Compass",
        heroImage: localCats[id]?.heroImage || "",
        ativo: localCats[id]?.ativo !== false,
        services: localServices[id] || [],
        source: "local",
      }));

      setCategories([...fromStrapi, ...fromLocal]);
    } catch (e) {
      console.error(e);
      setError(e.message || "Não foi possível carregar as categorias.");
      // Mesmo que a API do colega esteja em baixo, mostra pelo menos as
      // categorias locais (Destinos/Pacotes) para o site não ficar vazio.
      const localCats = seedLocalCategoriasIfEmpty();
      const localServices = loadJSON(LOCAL_SERVICES_KEY, {});
      const fromLocal = SPECIAL_CATEGORY_IDS.map((id) => ({
        id,
        title: localCats[id]?.title || id,
        description: localCats[id]?.description || "",
        tagline: localCats[id]?.tagline || "",
        icon: localCats[id]?.icon || "Compass",
        heroImage: localCats[id]?.heroImage || "",
        ativo: localCats[id]?.ativo !== false,
        services: localServices[id] || [],
        source: "local",
      }));
      setCategories(fromLocal);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCategorias(); }, [loadCategorias]);

  function adminLogin(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          const u = { email, role: "admin", loggedAt: new Date().toISOString() };
          setAdminUser(u);
          localStorage.setItem("stp_admin_session", JSON.stringify(u));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 400);
    });
  }

  function adminLogout() {
    setAdminUser(null);
    localStorage.removeItem("stp_admin_session");
  }

  // ── Categorias ──
  async function addCategory(cat) {
    const created = await strapiCreateCategoria({ title: cat.title, description: cat.description });
    const extras = loadJSON(LOCAL_EXTRAS_KEY, {});
    extras[created.id] = { icon: cat.icon || "Compass", heroImage: cat.heroImage || "", tagline: cat.tagline || "", ativo: true };
    saveJSON(LOCAL_EXTRAS_KEY, extras);
    await loadCategorias();
  }

  async function updateCategory(id, fields) {
    if (SPECIAL_CATEGORY_IDS.includes(id)) {
      const localCats = loadJSON(LOCAL_CATEGORIES_KEY, {});
      localCats[id] = {
        title: fields.title !== undefined ? fields.title : localCats[id]?.title,
        description: fields.description !== undefined ? fields.description : localCats[id]?.description,
        tagline: fields.tagline !== undefined ? fields.tagline : localCats[id]?.tagline,
        icon: fields.icon !== undefined ? fields.icon : localCats[id]?.icon,
        heroImage: fields.heroImage !== undefined ? fields.heroImage : localCats[id]?.heroImage,
        ativo: fields.ativo !== undefined ? fields.ativo : localCats[id]?.ativo,
      };
      saveJSON(LOCAL_CATEGORIES_KEY, localCats);
      await loadCategorias();
      return;
    }
    if (fields.title !== undefined || fields.description !== undefined) {
      await strapiUpdateCategoria(id, { title: fields.title, description: fields.description });
    }
    const extras = loadJSON(LOCAL_EXTRAS_KEY, {});
    extras[id] = {
      icon: fields.icon !== undefined ? fields.icon : extras[id]?.icon,
      heroImage: fields.heroImage !== undefined ? fields.heroImage : extras[id]?.heroImage,
      tagline: fields.tagline !== undefined ? fields.tagline : extras[id]?.tagline,
      ativo: fields.ativo !== undefined ? fields.ativo : extras[id]?.ativo,
    };
    saveJSON(LOCAL_EXTRAS_KEY, extras);
    await loadCategorias();
  }

  async function deleteCategory(id) {
    if (SPECIAL_CATEGORY_IDS.includes(id)) {
      // Categorias especiais (Destinos/Pacotes) não são eliminadas — só
      // podem ser desativadas, já que sustentam secções fixas da home.
      return updateCategory(id, { ativo: false });
    }
    await strapiDeleteCategoria(id);
    const extras = loadJSON(LOCAL_EXTRAS_KEY, {});
    delete extras[id];
    saveJSON(LOCAL_EXTRAS_KEY, extras);
    const localServices = loadJSON(LOCAL_SERVICES_KEY, {});
    delete localServices[id];
    saveJSON(LOCAL_SERVICES_KEY, localServices);
    await loadCategorias();
  }

  async function toggleCategory(id) {
    if (SPECIAL_CATEGORY_IDS.includes(id)) {
      const localCats = loadJSON(LOCAL_CATEGORIES_KEY, {});
      const current = localCats[id]?.ativo !== false;
      localCats[id] = { ...localCats[id], ativo: !current };
      saveJSON(LOCAL_CATEGORIES_KEY, localCats);
      await loadCategorias();
      return;
    }
    const extras = loadJSON(LOCAL_EXTRAS_KEY, {});
    const current = extras[id]?.ativo !== false;
    extras[id] = { ...extras[id], ativo: !current };
    saveJSON(LOCAL_EXTRAS_KEY, extras);
    await loadCategorias();
  }

  // ── Serviços (localStorage, aninhados por categoria) ──
  function persistServices(catId, services) {
    const localServices = loadJSON(LOCAL_SERVICES_KEY, {});
    localServices[catId] = services;
    saveJSON(LOCAL_SERVICES_KEY, localServices);
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, services } : c)));
  }

  async function addService(catId, svc) {
    const cat = categories.find((c) => c.id === catId);
    const services = [...(cat?.services || []), { icon: "Compass", ...svc, id: `svc-${Date.now()}`, listings: [] }];
    persistServices(catId, services);
  }

  async function updateService(catId, svcId, fields) {
    const cat = categories.find((c) => c.id === catId);
    const services = (cat?.services || []).map((s) => (s.id === svcId ? { ...s, ...fields } : s));
    persistServices(catId, services);
  }

  async function deleteService(catId, svcId) {
    const cat = categories.find((c) => c.id === catId);
    const services = (cat?.services || []).filter((s) => s.id !== svcId);
    persistServices(catId, services);
  }

  // ── Parceiros (listings dentro de um serviço, localStorage) ──
  async function addListing(catId, svcId, listing) {
    const cat = categories.find((c) => c.id === catId);
    const services = (cat?.services || []).map((s) => s.id === svcId
      ? { ...s, listings: [...(s.listings || []), { avaliacao: 5, avaliacoes: 0, tags: [], contacto: {}, ...listing, id: `ptn-${Date.now()}` }] }
      : s);
    persistServices(catId, services);
  }

  async function updateListing(catId, svcId, listingId, fields) {
    const cat = categories.find((c) => c.id === catId);
    const services = (cat?.services || []).map((s) => s.id === svcId
      ? { ...s, listings: (s.listings || []).map((l) => (l.id === listingId ? { ...l, ...fields } : l)) }
      : s);
    persistServices(catId, services);
  }

  async function deleteListing(catId, svcId, listingId) {
    const cat = categories.find((c) => c.id === catId);
    const services = (cat?.services || []).map((s) => s.id === svcId
      ? { ...s, listings: (s.listings || []).filter((l) => l.id !== listingId) }
      : s);
    persistServices(catId, services);
  }

  // ── Galeria de fotos de um parceiro (guardada dentro do próprio listing) ──
  async function listListingImages(listingId) {
    for (const c of categories) {
      for (const s of c.services || []) {
        const l = (s.listings || []).find((x) => x.id === listingId);
        if (l) return l.images || [];
      }
    }
    return [];
  }
  async function addListingImage(listingId, { url, titulo, tipo }) {
    for (const c of categories) {
      for (const s of c.services || []) {
        const l = (s.listings || []).find((x) => x.id === listingId);
        if (l) {
          const img = { id: `img-${Date.now()}`, url, titulo, tipo: tipo || (l.images?.length ? "galeria" : "principal") };
          await updateListing(c.id, s.id, listingId, { images: [...(l.images || []), img] });
          return img;
        }
      }
    }
  }
  async function deleteListingImage(imageId) {
    for (const c of categories) {
      for (const s of c.services || []) {
        for (const l of s.listings || []) {
          if ((l.images || []).some((i) => i.id === imageId)) {
            await updateListing(c.id, s.id, l.id, { images: l.images.filter((i) => i.id !== imageId) });
            return;
          }
        }
      }
    }
  }

  // ── Reservas (localStorage) ──
  function addReserva(reservaData) {
    const nova = { status: "pendente", createdAt: new Date().toISOString(), ...reservaData, id: Date.now() };
    const updated = [...reservas, nova];
    setReservas(updated);
    saveJSON(RESERVAS_KEY, updated);
    return Promise.resolve(nova);
  }

  function updateReservaStatus(id, status) {
    const updated = reservas.map((r) => (r.id === id ? { ...r, status } : r));
    setReservas(updated);
    saveJSON(RESERVAS_KEY, updated);
    return Promise.resolve();
  }

  function aprovarReserva(id, { mensagem, valorSinal, percentualSinal }) {
    const updated = reservas.map((r) => (r.id === id
      ? { ...r, status: "aprovada", adminMessage: mensagem, depositValue: valorSinal, depositPercent: percentualSinal || 50 }
      : r));
    setReservas(updated);
    saveJSON(RESERVAS_KEY, updated);
    return Promise.resolve();
  }

  function confirmarPagamentoReserva(id) {
    const updated = reservas.map((r) => (r.id === id
      ? { ...r, status: "confirmada", depositPaid: true, depositPaidAt: new Date().toISOString() }
      : r));
    setReservas(updated);
    saveJSON(RESERVAS_KEY, updated);
    return Promise.resolve();
  }

  function clienteReportarPagamento(_token, id) {
    const updated = reservas.map((r) => (r.id === id ? { ...r, clientReportedPayment: true } : r));
    setReservas(updated);
    saveJSON(RESERVAS_KEY, updated);
    return Promise.resolve();
  }

  function fetchMinhasReservas(_token, { usuario_id, usuario_email }) {
    const list = reservas.filter((r) => (usuario_id && r.userId === usuario_id) || (usuario_email && r.email === usuario_email));
    return Promise.resolve(list);
  }

  // ── Utilizadores (localStorage) ──
  function registerUtilizador(userData) {
    const novo = { createdAt: new Date().toISOString(), ...userData, id: Date.now() };
    const updated = [...utilizadores, novo];
    setUtilizadores(updated);
    saveJSON(USERS_KEY, updated);
    return novo;
  }

  function findUtilizadorByEmail(email) {
    return utilizadores.find((u) => u.email === email);
  }

  // ── Categorias hidratadas para o site público ──
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
    totalServicos: categories.reduce((s, c) => s + (c.services?.length || 0), 0),
    totalParceiros: categories.reduce((s, c) => s + (c.services || []).reduce((s2, sv) => s2 + (sv.listings?.length || 0), 0), 0),
    totalReservas: reservas.length,
    reservasPendentes: reservas.filter((r) => r.status === "pendente").length,
    totalUtilizadores: utilizadores.length,
  };

  return (
    <AdminContext.Provider value={{
      adminUser, adminLogin, adminLogout,
      categories, publicCategories, loading, error, reloadCategorias: loadCategorias,
      addCategory, updateCategory, deleteCategory, toggleCategory,
      addService, updateService, deleteService,
      addListing, updateListing, deleteListing,
      listListingImages, addListingImage, deleteListingImage,
      reservas, addReserva, updateReservaStatus,
      aprovarReserva, confirmarPagamentoReserva, clienteReportarPagamento, fetchMinhasReservas,
      utilizadores, registerUtilizador, findUtilizadorByEmail,
      stats,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() { return useContext(AdminContext); }
