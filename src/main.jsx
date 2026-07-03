import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, MapPin, Menu, Search,
  Sparkles, Compass, Camera, X, LogIn, LogOut, User,
} from "lucide-react";
import { categories } from "./categories.js";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import CategoryPage from "./CategoryPage.jsx";
import ServicePage from "./ServicePage.jsx";
import AuthModal from "./AuthModal.jsx";
import AboutPage from "./AboutPage.jsx";
import "./styles.css";

/* ─── Mobile Menu ─── */
function MobileMenu({ open, onClose, onLoginClick }) {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const linkStyle = { display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px", borderRadius:"14px", color:"var(--ink)", fontWeight:700, fontSize:"0.93rem", textDecoration:"none", transition:"background 0.15s" };

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:98, background:"rgba(7,63,37,.55)", opacity:open?1:0, pointerEvents:open?"auto":"none", transition:"opacity 0.25s" }} />
      <nav aria-label="Menu principal" style={{ position:"fixed", top:0, left:0, bottom:0, zIndex:99, width:"min(300px,85vw)", background:"var(--cream)", padding:"28px 24px", display:"flex", flexDirection:"column", gap:"8px", transform:open?"translateX(0)":"translateX(-100%)", transition:"transform 0.28s cubic-bezier(.4,0,.2,1)", overflowY:"auto" }}>

        {/* Header do drawer */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
          <Link to="/sobre" onClick={onClose} style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:600, color:"var(--forest-deep)", textDecoration:"none" }}>STP Verde</Link>
          <button onClick={onClose} aria-label="Fechar menu" style={{ background:"none", border:"none", cursor:"pointer", color:"var(--forest-deep)", padding:4 }}><X size={22} /></button>
        </div>

        {/* Auth block */}
        {user ? (
          <div style={{ padding:"12px 14px", borderRadius:"14px", background:"rgba(88,185,87,.1)", border:"1px solid rgba(88,185,87,.2)", marginBottom:"8px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"0.75rem", fontWeight:800, color:"var(--forest)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Sessão iniciada</p>
            <p style={{ margin:"0 0 10px", fontWeight:700, color:"var(--ink)", fontSize:"0.93rem" }}>{user.name}</p>
            <button onClick={() => { logout(); onClose(); }} style={{ display:"flex", alignItems:"center", gap:"7px", background:"none", border:"1px solid var(--line)", borderRadius:"8px", padding:"7px 12px", color:"var(--muted)", fontSize:"0.82rem", fontWeight:700, cursor:"pointer", fontFamily:"var(--font)" }}>
              <LogOut size={14} /> Terminar sessão
            </button>
          </div>
        ) : (
          <button onClick={() => { onLoginClick(); onClose(); }} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", padding:"12px", borderRadius:"12px", background:"linear-gradient(135deg,var(--forest-deep),var(--forest))", color:"white", fontWeight:800, fontSize:"0.9rem", border:"none", cursor:"pointer", fontFamily:"var(--font)", marginBottom:"8px" }}>
            <LogIn size={16} /> Entrar / Registar
          </button>
        )}

        <p style={{ fontSize:"0.72rem", fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--forest)", margin:"8px 0" }}>Categorias</p>

        {categories.map(({ id, title, icon: Icon }) => (
          <Link key={id} to={`/categorias/${id}`} onClick={onClose} style={linkStyle}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(88,185,87,.12)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <Icon size={18} style={{ color:"var(--forest)" }} />{title}
          </Link>
        ))}

        <div style={{ marginTop:"auto", borderTop:"1px solid var(--line)", paddingTop:"20px", display:"flex", flexDirection:"column", gap:"8px" }}>
          <a href="#servicos" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Serviços</a>
          <a href="#experiencias" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Experiências</a>
          <a href="#contacto" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Contacto</a>
          <Link to="/sobre" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Sobre nós</Link>
        </div>
      </nav>
    </>
  );
}

/* ─── Home Page ─── */
function HomePage() {
  const [active, setActive] = useState("todos");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => active === "todos" || c.id === active)
      .map((c) => ({ ...c, services: c.services.filter((s) => { const hay = `${s.name} ${s.description} ${c.title}`.toLowerCase(); return !q || hay.includes(q); }) }))
      .filter((c) => c.services.length > 0);
  }, [active, query]);

  const totalListings = categories.reduce((sum, c) => sum + c.services.reduce((s2, sv) => s2 + sv.listings.length, 0), 0);

  return (
    <main>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onLoginClick={() => setAuthModal(true)} />

      <section className="hero" id="inicio">
        <nav className="nav" aria-label="Navegação principal">
          {/* Logo → abre /sobre */}
          <Link to="/sobre" className="brand" aria-label="Sobre o STP Verde" title="Sobre nós">
            <img src="public/images/logotipo.jpeg" alt="STP Verde" />
          </Link>

          <div className="navLinks">
            <a href="#servicos">Serviços</a>
            <a href="#experiencias">Experiências</a>
            <Link to="/sobre" style={{ color:"inherit", textDecoration:"none", fontWeight:600 }}>Sobre nós</Link>
            <a href="#contacto">Contacto</a>
          </div>

          {/* Auth — desktop */}
          {user ? (
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <span style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"0.82rem", fontWeight:700, color:"rgba(255,255,255,.85)" }}>
                <User size={15} /> {user.name.split(" ")[0]}
              </span>
              <button onClick={logout} aria-label="Terminar sessão"
                style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.25)", borderRadius:"999px", padding:"7px 14px", color:"rgba(255,255,255,.85)", fontSize:"0.8rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", fontFamily:"var(--font)", transition:"background .15s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.22)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>
                <LogOut size={14} /> Sair
              </button>
            </div>
          ) : (
            <button onClick={() => setAuthModal(true)}
              style={{ display:"flex", alignItems:"center", gap:"7px", background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", borderRadius:"999px", padding:"8px 18px", color:"white", fontSize:"0.85rem", fontWeight:800, cursor:"pointer", fontFamily:"var(--font)", transition:"background .15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.25)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.15)"}>
              <LogIn size={15} /> Entrar
            </button>
          )}

          <button className="iconButton" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
            <Menu size={20} />
          </button>
        </nav>

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow"><MapPin size={16} /> São Tomé e Príncipe</p>
            <h1>Descobre ilhas feitas de mar, cacau e histórias.</h1>
            <p className="lead">O melhor portal de São Tomé para encontrar e publicitar alojamentos, transportes, tours, gastronomia, eventos, guias e comércio local em São Tomé e Príncipe.</p>
            <div className="searchBar">
              <Search size={21} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar serviços, atividades ou experiências..." aria-label="Pesquisar serviços" />
            </div>
            <div className="stats" aria-label="Resumo do portal">
              <span><strong>8</strong>Categorias</span>
              <span><strong>{totalListings}+</strong>Parceiros</span>
              <span><strong>2</strong>Ilhas</span>
            </div>
          </div>

          <div className="heroVisual" aria-label="Paisagem tropical estilizada">
            <div className="sun" />
            <div className="photoCard cardOne"><span>Pico Cão Grande</span></div>
            <div className="photoCard cardTwo"><span>Forte e litoral</span></div>
            <div className="itinerary">
              <p>Roteiro em destaque</p>
              <strong>Praia Lagoa Azul, Pico Cão Grande e Museu Nacional</strong>
              <button onClick={() => navigate("/categorias/tours")}>Ver excursões <ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="filters" aria-label="Filtros de categorias">
        <button className={active === "todos" ? "active" : ""} onClick={() => setActive("todos")}>Todos</button>
        {categories.map(({ id, title, icon: Icon }) => (
          <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}>
            <Icon size={17} /> {title}
          </button>
        ))}
      </section>

      <section className="content" id="servicos">
        <div className="sectionIntro">
          <p className="eyebrow">Catálogo turístico</p>
          <h2>Serviços que fazem sentido Conhecer</h2>
          <p>Cada categoria foi pensada para receber anúncios, reservas, contactos diretos e conteúdo editorial sobre experiências no arquipélago.</p>
        </div>
        <div className="categoryStack">
          {visibleCategories.map((category) => (
            <ServiceCategory key={category.id} category={category} />
          ))}
        </div>
      </section>

      <footer className="footer" id="contacto">
        <div>
          <strong>STP Verde</strong>
          <p>Portal turístico para São Tomé e Príncipe.</p>
        </div>
        <Link to="/sobre" style={{ color:"inherit", fontSize:"0.9rem", fontWeight:700 }}>Sobre nós →</Link>
        <a href="mailto:info@stpverde.st">info@stpverde.st</a>
      </footer>

      {authModal && <AuthModal onClose={() => setAuthModal(false)} onSuccess={() => setAuthModal(false)} />}
    </main>
  );
}

/* ─── Service Category ─── */
function ServiceCategory({ category }) {
  const Icon = category.icon;
  const navigate = useNavigate();
  return (
    <section className="category">
      <div className="categoryHeader">
        <div>
          <h3><Icon size={21} /> {category.title}</h3>
          <p>{category.tagline}</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"14px", flexShrink:0 }}>
          <span>{category.services.length} Serviços</span>
          <button onClick={() => navigate(`/categorias/${category.id}`)}
            style={{ border:"1.5px solid var(--forest)", borderRadius:"999px", padding:"8px 18px", background:"transparent", color:"var(--forest-deep)", fontWeight:800, fontSize:"0.82rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", whiteSpace:"nowrap", transition:"background .16s,color .16s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background="var(--forest)"; e.currentTarget.style.color="white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--forest-deep)"; }}>
            Ver tudo <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="serviceGrid">
        {category.services.map((service) => {
          const SIcon = service.icon;
          return (
            <article key={service.id} className="serviceCard" style={{ cursor:"pointer" }} onClick={() => navigate(`/categorias/${category.id}/${service.id}`)}>
              <SIcon size={25} />
              <h4>{service.name}</h4>
              <p>{service.description}</p>
              <span>{service.label}</span>
              <div style={{ marginTop:"auto", paddingTop:"10px", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:"0.75rem", color:"var(--forest)", fontWeight:700 }}>
                <span>{service.listings.length} {service.listings.length === 1 ? "resultado" : "resultados"}</span>
                <ChevronRight size={14} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ─── App ─── */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/categorias/:id" element={<CategoryPage />} />
          <Route path="/categorias/:catId/:serviceId" element={<ServicePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
