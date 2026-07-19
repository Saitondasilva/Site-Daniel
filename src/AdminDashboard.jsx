import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Tags, Briefcase, Building2, CalendarCheck,
  Users, LogOut, Menu, X, ChevronRight, Plus, Pencil, Trash2,
  ToggleLeft, ToggleRight, Star, Clock, CheckCircle2, XCircle,
  TrendingUp, Eye, ArrowUpRight, Search, Globe,
} from "lucide-react";
import { useAdmin } from "./AdminContext.jsx";
import { ICON_NAMES, getIcon } from "./iconMap.js";
import "./adminDashboard.css";

const SECTIONS = [
  { id: "overview",    label: "Visão Geral",   icon: LayoutDashboard },
  { id: "categories", label: "Categorias",     icon: Tags },
  { id: "services",   label: "Serviços",       icon: Briefcase },
  { id: "partners",   label: "Parceiros",      icon: Building2 },
  { id: "bookings",   label: "Reservas",       icon: CalendarCheck },
  { id: "users",      label: "Utilizadores",   icon: Users },
];

export default function AdminDashboard() {
  const { adminUser, adminLogout, stats } = useAdmin();
  const [section, setSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigate(s) { setSection(s); setSidebarOpen(false); }

  return (
    <div className="ad-root">
      {/* ── Sidebar ── */}
      <>
        {sidebarOpen && <div className="ad-backdrop" onClick={() => setSidebarOpen(false)} />}
        <aside className={`ad-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="ad-sidebar-header">
            <div className="ad-brand">
              <span className="ad-brand-logo">STP</span>
              <div>
                <p className="ad-brand-name">STP Verde</p>
                <p className="ad-brand-role">Painel Admin</p>
              </div>
            </div>
            <button className="ad-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">
              <X size={18} />
            </button>
          </div>

          <nav className="ad-nav">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`ad-nav-item ${section === id ? "active" : ""}`}
                onClick={() => navigate(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
                {id === "bookings" && stats.reservasPendentes > 0 && (
                  <span className="ad-badge">{stats.reservasPendentes}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="ad-sidebar-footer">
            <div className="ad-user-info">
              <div className="ad-user-avatar">A</div>
              <div>
                <p className="ad-user-name">Administrador</p>
                <p className="ad-user-email">{adminUser?.email}</p>
              </div>
            </div>
            <div className="ad-sidebar-actions">
              <Link to="/" className="ad-footer-link" target="_blank">
                <Globe size={14} /> Ver site
              </Link>
              <button className="ad-logout-btn" onClick={adminLogout}>
                <LogOut size={14} /> Sair
              </button>
            </div>
          </div>
        </aside>
      </>

      {/* ── Main ── */}
      <div className="ad-main">
        {/* Topbar */}
        <header className="ad-topbar">
          <button className="ad-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu size={20} />
          </button>
          <div className="ad-topbar-title">
            {SECTIONS.find((s) => s.id === section)?.label}
          </div>
          <div className="ad-topbar-right">
            <Link to="/" className="ad-topbar-link" target="_blank">
              <Eye size={15} /> Ver site
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="ad-content">
          {section === "overview"    && <SectionOverview onNavigate={navigate} />}
          {section === "categories" && <SectionCategories />}
          {section === "services"   && <SectionServices />}
          {section === "partners"   && <SectionPartners />}
          {section === "bookings"   && <SectionBookings />}
          {section === "users"      && <SectionUsers />}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: Visão Geral
══════════════════════════════════════════ */
function SectionOverview({ onNavigate }) {
  const { stats, reservas, categories } = useAdmin();

  const kpis = [
    { label: "Categorias activas", value: `${stats.categoriasAtivas}/${stats.totalCategorias}`, icon: Tags, color: "green", section: "categories" },
    { label: "Total de serviços",  value: stats.totalServicos,   icon: Briefcase,    color: "blue",   section: "services" },
    { label: "Reservas pendentes", value: stats.reservasPendentes, icon: CalendarCheck, color: stats.reservasPendentes > 0 ? "orange" : "green", section: "bookings" },
    { label: "Total de reservas",  value: stats.totalReservas,   icon: TrendingUp,   color: "purple", section: "bookings" },
    { label: "Utilizadores",       value: stats.totalUtilizadores, icon: Users,       color: "pink",   section: "users" },
  ];

  const recentBookings = [...reservas].reverse().slice(0, 5);

  return (
    <div className="ad-section">
      <div className="ad-section-header">
        <h2>Bom dia, Administrador 👋</h2>
        <p>Aqui está o resumo do estado actual do portal STP Verde.</p>
      </div>

      {/* KPIs */}
      <div className="ad-kpi-grid">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <button key={k.label} className={`ad-kpi ad-kpi--${k.color}`} onClick={() => onNavigate(k.section)}>
              <div className="ad-kpi-icon"><Icon size={22} /></div>
              <div className="ad-kpi-body">
                <span className="ad-kpi-value">{k.value}</span>
                <span className="ad-kpi-label">{k.label}</span>
              </div>
              <ArrowUpRight size={16} className="ad-kpi-arrow" />
            </button>
          );
        })}
      </div>

      {/* Reservas recentes */}
      <div className="ad-card" style={{ marginTop: 28 }}>
        <div className="ad-card-header">
          <h3>Reservas recentes</h3>
          <button className="ad-link-btn" onClick={() => onNavigate("bookings")}>
            Ver todas <ChevronRight size={14} />
          </button>
        </div>
        {recentBookings.length === 0 ? (
          <p className="ad-empty">Ainda não há reservas.</p>
        ) : (
          <table className="ad-table">
            <thead>
              <tr><th>Nome</th><th>Serviço</th><th>Data</th><th>Pessoas</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {recentBookings.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.name}</strong><br /><small>{r.email}</small></td>
                  <td>{r.listingName}</td>
                  <td>{r.date}</td>
                  <td>{r.persons}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Categorias rápido */}
      <div className="ad-card" style={{ marginTop: 16 }}>
        <div className="ad-card-header">
          <h3>Estado das categorias</h3>
          <button className="ad-link-btn" onClick={() => onNavigate("categories")}>
            Gerir <ChevronRight size={14} />
          </button>
        </div>
        <div className="ad-cat-quick">
          {categories.map((c) => (
            <div key={c.id} className={`ad-cat-pill ${c.ativo ? "" : "inactive"}`}>
              <span>{c.title}</span>
              <span className="ad-cat-pill-count">{c.services?.length || 0} serv.</span>
              {!c.ativo && <span className="ad-cat-pill-off">OFF</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: Categorias
══════════════════════════════════════════ */
function SectionCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategory } = useAdmin();
  const [modal, setModal] = useState(null); // null | "add" | { ...category }
  const [form, setForm] = useState({ title: "", tagline: "", description: "", icon: "Compass", heroImage: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  function openAdd() { setForm({ title: "", tagline: "", description: "", icon: "Compass", heroImage: "" }); setModal("add"); }
  function openEdit(cat) { setForm({ title: cat.title, tagline: cat.tagline, description: cat.description || "", icon: cat.icon || "Compass", heroImage: cat.heroImage || "" }); setModal(cat); }

  function handleSave() {
    if (!form.title.trim()) return;
    if (modal === "add") {
      addCategory(form);
    } else {
      updateCategory(modal.id, form);
    }
    setModal(null);
  }

  function handleDelete(id) {
    deleteCategory(id);
    setConfirmDelete(null);
  }

  return (
    <div className="ad-section">
      <div className="ad-section-header">
        <div>
          <h2>Categorias</h2>
          <p>Gere as categorias turísticas visíveis no portal.</p>
        </div>
        <button className="ad-btn-primary" onClick={openAdd}>
          <Plus size={16} /> Nova categoria
        </button>
      </div>

      <div className="ad-list">
        {categories.map((cat) => (
          <div key={cat.id} className={`ad-list-item ${cat.ativo ? "" : "ad-list-item--off"}`}>
            <div className="ad-list-item-main">
              <div className="ad-list-avatar">{cat.title.charAt(0)}</div>
              <div className="ad-list-info">
                <h4>{cat.title}</h4>
                <p>{cat.tagline}</p>
                <span className="ad-list-meta">{cat.services?.length || 0} serviços · {cat.services?.reduce((s, sv) => s + (sv.listings?.length || 0), 0) || 0} parceiros</span>
              </div>
            </div>
            <div className="ad-list-actions">
              <button
                className={`ad-toggle-btn ${cat.ativo ? "on" : "off"}`}
                onClick={() => toggleCategory(cat.id)}
                title={cat.ativo ? "Desativar categoria" : "Ativar categoria"}
              >
                {cat.ativo ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                <span>{cat.ativo ? "Ativo" : "Inativo"}</span>
              </button>
              <button className="ad-icon-btn edit" onClick={() => openEdit(cat)} title="Editar"><Pencil size={16} /></button>
              <button className="ad-icon-btn delete" onClick={() => setConfirmDelete(cat.id)} title="Eliminar"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal add/edit */}
      {modal !== null && (
        <FormModal
          title={modal === "add" ? "Nova categoria" : "Editar categoria"}
          onClose={() => setModal(null)}
          onSave={handleSave}
        >
          <Field label="Título *" value={form.title} onChange={(v) => setForm((p) => ({ ...p, title: v }))} placeholder="Ex: Alojamento" />
          <Field label="Tagline" value={form.tagline} onChange={(v) => setForm((p) => ({ ...p, tagline: v }))} placeholder="Frase curta de descrição" />
          <Field label="Descrição" value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} placeholder="Descrição longa da categoria" textarea />
          <IconField value={form.icon} onChange={(v) => setForm((p) => ({ ...p, icon: v }))} />
          <Field label="Imagem de fundo (URL)" value={form.heroImage} onChange={(v) => setForm((p) => ({ ...p, heroImage: v }))} placeholder="/images/exemplo.jpg" />
        </FormModal>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <ConfirmModal
          message="Tens a certeza que queres eliminar esta categoria? Todos os serviços e parceiros associados serão removidos."
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: Serviços
══════════════════════════════════════════ */
function SectionServices() {
  const { categories, addService, updateService, deleteService } = useAdmin();
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || "");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", label: "", icon: "Compass", image: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const cat = categories.find((c) => c.id === selectedCat);

  function openAdd() { setForm({ name: "", description: "", label: "", icon: "Compass", image: "" }); setModal("add"); }
  function openEdit(svc) { setForm({ name: svc.name, description: svc.description, label: svc.label || "", icon: svc.icon || "Compass", image: svc.image || "" }); setModal(svc); }

  function handleSave() {
    if (!form.name.trim()) return;
    if (modal === "add") addService(selectedCat, form);
    else updateService(selectedCat, modal.id, form);
    setModal(null);
  }

  return (
    <div className="ad-section">
      <div className="ad-section-header">
        <div>
          <h2>Serviços</h2>
          <p>Gere os tipos de serviço dentro de cada categoria.</p>
        </div>
        <button className="ad-btn-primary" onClick={openAdd} disabled={!selectedCat}>
          <Plus size={16} /> Novo serviço
        </button>
      </div>

      {/* Selector de categoria */}
      <div className="ad-cat-selector">
        {categories.map((c) => (
          <button key={c.id} className={`ad-cat-tab ${selectedCat === c.id ? "active" : ""}`} onClick={() => setSelectedCat(c.id)}>
            {c.title}
            <span>{c.services?.length || 0}</span>
          </button>
        ))}
      </div>

      {cat && (
        <div className="ad-list">
          {cat.services?.length === 0 && <p className="ad-empty">Nenhum serviço nesta categoria. Adiciona o primeiro!</p>}
          {cat.services?.map((svc) => (
            <div key={svc.id} className="ad-list-item">
              <div className="ad-list-item-main">
                <div className="ad-list-avatar ad-list-avatar--blue">{svc.name.charAt(0)}</div>
                <div className="ad-list-info">
                  <h4>{svc.name}</h4>
                  <p>{svc.description}</p>
                  <span className="ad-list-meta">{svc.listings?.length || 0} parceiros · label: <em>{svc.label || "—"}</em></span>
                </div>
              </div>
              <div className="ad-list-actions">
                <button className="ad-icon-btn edit" onClick={() => openEdit(svc)}><Pencil size={16} /></button>
                <button className="ad-icon-btn delete" onClick={() => setConfirmDelete(svc.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <FormModal title={modal === "add" ? "Novo serviço" : "Editar serviço"} onClose={() => setModal(null)} onSave={handleSave}>
          <Field label="Nome *" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} placeholder="Ex: Hotéis" />
          <Field label="Descrição" value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} placeholder="Breve descrição do serviço" />
          <Field label="Label (badge)" value={form.label} onChange={(v) => setForm((p) => ({ ...p, label: v }))} placeholder="Ex: Premium, Top, Eco..." />
          <IconField value={form.icon} onChange={(v) => setForm((p) => ({ ...p, icon: v }))} />
          <Field label="Imagem do card (URL)" value={form.image} onChange={(v) => setForm((p) => ({ ...p, image: v }))} placeholder="/images/exemplo.jpg" />
        </FormModal>
      )}

      {confirmDelete && (
        <ConfirmModal
          message="Eliminar este serviço? Todos os parceiros associados serão removidos."
          onConfirm={() => { deleteService(selectedCat, confirmDelete); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: Parceiros (listings dentro de um serviço)
══════════════════════════════════════════ */
function SectionPartners() {
  const { categories, addListing, updateListing, deleteListing } = useAdmin();
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || "");
  const cat = categories.find((c) => c.id === selectedCat) || categories[0];
  const [selectedSvc, setSelectedSvc] = useState(cat?.services?.[0]?.id || "");
  const svc = cat?.services?.find((s) => s.id === selectedSvc);

  const emptyForm = { nome: "", tipo: "", local: "", descricao: "", destaque: "", preco: "", avaliacao: 5, avaliacoes: 0, tags: "", tel: "", email: "", web: "", featured: false };
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function changeCat(id) {
    setSelectedCat(id);
    const c = categories.find((x) => x.id === id);
    setSelectedSvc(c?.services?.[0]?.id || "");
  }

  function openAdd() { setForm(emptyForm); setModal("add"); }
  function openEdit(l) {
    setForm({
      nome: l.nome || "", tipo: l.tipo || "", local: l.local || "", descricao: l.descricao || "",
      destaque: l.destaque || "", preco: l.preco || "", avaliacao: l.avaliacao ?? 5, avaliacoes: l.avaliacoes ?? 0,
      tags: (l.tags || []).join(", "), tel: l.contacto?.tel || "", email: l.contacto?.email || "", web: l.contacto?.web || "",
      featured: !!l.featured,
    });
    setModal(l);
  }

  function handleSave() {
    if (!form.nome.trim() || !selectedCat || !selectedSvc) return;
    const payload = {
      nome: form.nome, tipo: form.tipo, local: form.local, descricao: form.descricao,
      destaque: form.destaque, preco: form.preco,
      avaliacao: Number(form.avaliacao) || 0, avaliacoes: Number(form.avaliacoes) || 0,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      contacto: { tel: form.tel, email: form.email, web: form.web },
      featured: !!form.featured,
    };
    if (modal === "add") addListing(selectedCat, selectedSvc, payload);
    else updateListing(selectedCat, selectedSvc, modal.id, payload);
    setModal(null);
  }

  return (
    <div className="ad-section">
      <div className="ad-section-header">
        <div>
          <h2>Parceiros</h2>
          <p>Gere os parceiros (hotéis, guias, operadores...) listados dentro de cada serviço.</p>
        </div>
        <button className="ad-btn-primary" onClick={openAdd} disabled={!selectedSvc}>
          <Plus size={16} /> Novo parceiro
        </button>
      </div>

      {/* Selector de categoria */}
      <div className="ad-cat-selector">
        {categories.map((c) => (
          <button key={c.id} className={`ad-cat-tab ${selectedCat === c.id ? "active" : ""}`} onClick={() => changeCat(c.id)}>
            {c.title}
          </button>
        ))}
      </div>

      {/* Selector de serviço dentro da categoria */}
      {cat && cat.services?.length > 0 && (
        <div className="ad-cat-selector" style={{ marginTop: 8 }}>
          {cat.services.map((s) => (
            <button key={s.id} className={`ad-cat-tab ${selectedSvc === s.id ? "active" : ""}`} onClick={() => setSelectedSvc(s.id)}>
              {s.name}
              <span>{s.listings?.length || 0}</span>
            </button>
          ))}
        </div>
      )}

      {svc ? (
        <div className="ad-list" style={{ marginTop: 20 }}>
          {(!svc.listings || svc.listings.length === 0) && (
            <p className="ad-empty">Nenhum parceiro neste serviço. Adiciona o primeiro!</p>
          )}
          {svc.listings?.map((l) => (
            <div key={l.id} className="ad-list-item">
              <div className="ad-list-item-main">
                <div className="ad-list-avatar ad-list-avatar--blue">{(l.nome || "?").charAt(0)}</div>
                <div className="ad-list-info">
                  <h4>{l.nome} {l.featured && <Star size={13} style={{ color: "#f59e0b", verticalAlign: "-2px" }} />}</h4>
                  <p>{l.tipo} · {l.local} · {l.preco}</p>
                  <span className="ad-list-meta">★ {Number(l.avaliacao).toFixed(1)} ({l.avaliacoes}) · {(l.tags || []).join(", ") || "sem tags"}</span>
                </div>
              </div>
              <div className="ad-list-actions">
                <button className="ad-icon-btn edit" onClick={() => openEdit(l)}><Pencil size={16} /></button>
                <button className="ad-icon-btn delete" onClick={() => setConfirmDelete(l.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="ad-empty" style={{ marginTop: 20 }}>Esta categoria ainda não tem serviços. Cria um serviço primeiro.</p>
      )}

      {modal !== null && (
        <FormModal title={modal === "add" ? "Novo parceiro" : "Editar parceiro"} onClose={() => setModal(null)} onSave={handleSave} wide>
          <div className="ad-form-row">
            <Field label="Nome *" value={form.nome} onChange={(v) => setForm((p) => ({ ...p, nome: v }))} placeholder="Ex: Mucumbri" />
            <Field label="Tipo" value={form.tipo} onChange={(v) => setForm((p) => ({ ...p, tipo: v }))} placeholder="Ex: Resort 5★" />
          </div>
          <div className="ad-form-row">
            <Field label="Localização" value={form.local} onChange={(v) => setForm((p) => ({ ...p, local: v }))} placeholder="Ex: São Tomé" />
            <Field label="Preço" value={form.preco} onChange={(v) => setForm((p) => ({ ...p, preco: v }))} placeholder="Ex: Desde 180€/noite" />
          </div>
          <Field label="Descrição" value={form.descricao} onChange={(v) => setForm((p) => ({ ...p, descricao: v }))} placeholder="Descrição do parceiro" textarea />
          <Field label="Destaque" value={form.destaque} onChange={(v) => setForm((p) => ({ ...p, destaque: v }))} placeholder="Ex: Piscina infinita com vista mar" />
          <div className="ad-form-row">
            <Field label="Avaliação (1-5)" value={String(form.avaliacao)} onChange={(v) => setForm((p) => ({ ...p, avaliacao: v }))} placeholder="4.8" />
            <Field label="Nº de avaliações" value={String(form.avaliacoes)} onChange={(v) => setForm((p) => ({ ...p, avaliacoes: v }))} placeholder="120" />
          </div>
          <Field label="Tags (separadas por vírgula)" value={form.tags} onChange={(v) => setForm((p) => ({ ...p, tags: v }))} placeholder="Piscina, Spa, Wi-Fi" />
          <div className="ad-form-row">
            <Field label="Telefone" value={form.tel} onChange={(v) => setForm((p) => ({ ...p, tel: v }))} placeholder="+239 222 1234" />
            <Field label="Email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} placeholder="contacto@parceiro.st" />
          </div>
          <Field label="Website" value={form.web} onChange={(v) => setForm((p) => ({ ...p, web: v }))} placeholder="parceiro.st" />
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem", fontWeight: 700, color: "var(--ink)", marginTop: 4 }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} />
            Destacar este parceiro (featured)
          </label>
        </FormModal>
      )}

      {confirmDelete && (
        <ConfirmModal
          message="Eliminar este parceiro? Esta ação não pode ser desfeita."
          onConfirm={() => { deleteListing(selectedCat, selectedSvc, confirmDelete); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: Reservas
══════════════════════════════════════════ */
function SectionBookings() {
  const { reservas, updateReservaStatus } = useAdmin();
  const [filter, setFilter] = useState("todas");
  const [search, setSearch] = useState("");

  const filtered = reservas.filter((r) => {
    const matchFilter = filter === "todas" || r.status === filter;
    const matchSearch = !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.listingName?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  }).reverse();

  const counts = { pendente: reservas.filter((r) => r.status === "pendente").length, confirmada: reservas.filter((r) => r.status === "confirmada").length, cancelada: reservas.filter((r) => r.status === "cancelada").length };

  return (
    <div className="ad-section">
      <div className="ad-section-header">
        <div>
          <h2>Reservas</h2>
          <p>Gere todos os pedidos de reserva recebidos no portal.</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="ad-filter-tabs">
        {[["todas", "Todas"], ["pendente", `Pendentes (${counts.pendente})`], ["confirmada", `Confirmadas (${counts.confirmada})`], ["cancelada", `Canceladas (${counts.cancelada})`]].map(([key, label]) => (
          <button key={key} className={`ad-filter-tab ${filter === key ? "active" : ""}`} onClick={() => setFilter(key)}>{label}</button>
        ))}
      </div>

      <div className="ad-search-bar">
        <Search size={16} />
        <input placeholder="Pesquisar por nome, email ou serviço..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <p className="ad-empty">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="ad-list">
          {filtered.map((r) => (
            <div key={r.id} className="ad-list-item ad-booking-item">
              <div className="ad-list-item-main">
                <div className="ad-list-avatar ad-list-avatar--purple">{(r.name || "?").charAt(0)}</div>
                <div className="ad-list-info">
                  <h4>{r.name} <StatusBadge status={r.status} /></h4>
                  <p>{r.listingName} · {r.date} · {r.persons} {r.persons === "1" ? "pessoa" : "pessoas"}</p>
                  <span className="ad-list-meta">{r.email} {r.phone ? `· ${r.phone}` : ""}</span>
                  {r.message && <p className="ad-booking-msg">"{r.message}"</p>}
                </div>
              </div>
              <div className="ad-list-actions ad-list-actions--col">
                {r.status === "pendente" && (
                  <>
                    <button className="ad-action-btn confirm" onClick={() => updateReservaStatus(r.id, "confirmada")}>
                      <CheckCircle2 size={14} /> Confirmar
                    </button>
                    <button className="ad-action-btn cancel" onClick={() => updateReservaStatus(r.id, "cancelada")}>
                      <XCircle size={14} /> Cancelar
                    </button>
                  </>
                )}
                {r.status === "confirmada" && (
                  <button className="ad-action-btn cancel" onClick={() => updateReservaStatus(r.id, "cancelada")}>
                    <XCircle size={14} /> Cancelar
                  </button>
                )}
                {r.status === "cancelada" && (
                  <button className="ad-action-btn confirm" onClick={() => updateReservaStatus(r.id, "pendente")}>
                    <Clock size={14} /> Repor
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SECTION: Utilizadores
══════════════════════════════════════════ */
function SectionUsers() {
  const { utilizadores } = useAdmin();
  const [search, setSearch] = useState("");

  const filtered = utilizadores.filter((u) =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ad-section">
      <div className="ad-section-header">
        <div>
          <h2>Utilizadores</h2>
          <p>{utilizadores.length} utilizadores registados no portal.</p>
        </div>
      </div>

      <div className="ad-search-bar">
        <Search size={16} />
        <input placeholder="Pesquisar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <p className="ad-empty">Nenhum utilizador encontrado.</p>
      ) : (
        <div className="ad-list">
          {filtered.map((u) => (
            <div key={u.id} className="ad-list-item">
              <div className="ad-list-item-main">
                <div className="ad-list-avatar ad-list-avatar--pink">{(u.name || "?").charAt(0)}</div>
                <div className="ad-list-info">
                  <h4>{u.name}</h4>
                  <p>{u.email} {u.phone ? `· ${u.phone}` : ""}</p>
                  <span className="ad-list-meta">Registado em {new Date(u.createdAt).toLocaleDateString("pt-PT")}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENTES
══════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = { pendente: ["ad-badge--orange", <Clock size={12} />, "Pendente"], confirmada: ["ad-badge--green", <CheckCircle2 size={12} />, "Confirmada"], cancelada: ["ad-badge--red", <XCircle size={12} />, "Cancelada"] };
  const [cls, icon, label] = map[status] || ["ad-badge--orange", null, status];
  return <span className={`ad-status-badge ${cls}`}>{icon}{label}</span>;
}

function Field({ label, value, onChange, placeholder, textarea }) {
  return (
    <div className="ad-field">
      <label>{label}</label>
      {textarea
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}

function IconField({ value, onChange }) {
  const Preview = getIcon(value);
  return (
    <div className="ad-field">
      <label>Ícone</label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(88,185,87,.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--forest-deep)", flexShrink: 0 }}>
          <Preview size={20} />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid var(--line)", fontFamily: "inherit", fontSize: "0.9rem", background: "white" }}
        >
          {ICON_NAMES.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FormModal({ title, onClose, onSave, children, wide }) {
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <>
      <div className="ad-modal-backdrop" onClick={onClose} />
      <div className={`ad-modal ${wide ? "ad-modal--wide" : ""}`}>
        <div className="ad-modal-header">
          <h3>{title}</h3>
          <button className="ad-modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="ad-modal-body">{children}</div>
        <div className="ad-modal-footer">
          <button className="ad-btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="ad-btn-primary" onClick={onSave}><CheckCircle2 size={16} /> Guardar</button>
        </div>
      </div>
    </>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <>
      <div className="ad-modal-backdrop" onClick={onCancel} />
      <div className="ad-modal ad-modal--sm">
        <div className="ad-modal-header">
          <h3>Confirmar ação</h3>
          <button className="ad-modal-close" onClick={onCancel}><X size={18} /></button>
        </div>
        <div className="ad-modal-body">
          <p style={{ color: "var(--muted)", fontSize: "0.93rem", lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="ad-modal-footer">
          <button className="ad-btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="ad-btn-danger" onClick={onConfirm}><Trash2 size={16} /> Eliminar</button>
        </div>
      </div>
    </>
  );
}
