//main.jsx
import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight, MapPin, Menu, Search,
  Sparkles, Compass, Camera, X, LogIn, LogOut, User,
} from "lucide-react";
import { categories } from "./categories.js";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { AdminProvider } from "./AdminContext.jsx";
import CategoryPage from "./CategoryPage.jsx";
import ServicePage from "./ServicePage.jsx";
import AuthModal from "./AuthModal.jsx";
import AboutPage from "./AboutPage.jsx";
import AdminPage from "./AdminPage.jsx";
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
          <a href="#servicos" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Alojamento</a>
          <a href="#experiencias" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Transporte</a>
          <a href="#contacto" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Excursões</a>
          <a href="#contacto" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Tours</a>
          <Link to="/sobre" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Contato</Link>
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
            <a href="#servicos">Alojamento</a>
            <a href="#experiencias">Transporte</a>
            <a href="#experiencias">Excursões </a>
            <a href="#experiencias">Tours</a>
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

    
      <section className="content" id="servicos">
        <div className="sectionIntro">
          {/*<p className="eyebrow">Catálogo turístico</p>
          <h2>Serviços que fazem sentido publicitar</h2>
          <p>Cada categoria foi pensada para receber parceiros, anúncios, 
            reservas, contactos diretos e conteúdo editorial sobre experiências 
            no arquipélago.</p>*/}
        </div>
        <div className="categoryStack">
          {visibleCategories.map((category) => (
            <ServiceCategory key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="experienceBand" id="experiencias">
        <div>
          <p className="eyebrow">Para operadores locais</p>
          <h2>Um site pronto para transformar curiosidade em reserva.</h2>
        </div>
        <div className="featureGrid">
          <article><Sparkles size={22} /><h3>Vitrines de parceiros</h3><p>Perfis para hotéis, restaurantes, guias, lojas e empresas de transporte.</p></article>
          <article><Compass size={22} /><h3>Roteiros temáticos</h3><p>Experiências por interesse: natureza, cultura, gastronomia, ou aventura.</p></article>
          <article><Camera size={22} /><h3>Conteúdo visual</h3><p>Galerias, chamadas editoriais e fotografias que destacam o melhor de STP.</p></article>
        </div>
      </section>

      <footer className="footer" id="contacto">
        <div>
          <strong>STP Verde</strong>
          <p>Portal turístico para São Tomé e Príncipe.</p>
        </div>
        <Link to="/sobre" style={{ color:"inherit", fontSize:"0.9rem", fontWeight:700 }}>Sobre nós →</Link>
        <a href="mailto:info@stpverde.st">info@stpverde.st</a>
        <Link
          to="/admin"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 18px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.55)",
            fontSize: "0.8rem",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.04em",
            backdropFilter: "blur(4px)",
            transition: "background 0.2s, color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.14)";
            e.currentTarget.style.color = "rgba(255,255,255,0.9)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.07)";
            e.currentTarget.style.color = "rgba(255,255,255,0.55)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Área restrita
        </Link>
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
          return (
            <article key={service.id} className="serviceCard" style={{ cursor:"pointer" }} onClick={() => navigate(`/categorias/${category.id}/${service.id}`)}>
              {/* 🔤 NOME ANTES DA IMAGEM */}
              <h4 style={{ 
                fontSize: "1.1rem", 
                fontWeight: 700, 
                color: "var(--forest-deep)",
                marginBottom: "8px",
                textTransform: "capitalize"
              }}>
                {service.name}
              </h4>
              
              {/* 🖼️ IMAGEM */}
              <div style={{ 
                width: "100%", 
                height: "160px", 
                borderRadius: "12px", 
                overflow: "hidden",
                marginBottom: "12px",
                background: "#f0f4f0"
              }}>
                <img 
                  src={service.image || "/images/categories/default.avif"} 
                  alt={service.name}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>
              
              {/* ❌ ÍCONE REMOVIDO - SEM SIcon */}
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "8px" }}>
                {service.description}
              </p>
              
              {service.label && (
                <span style={{
                  display: "inline-block",
                  background: "var(--forest)",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "3px 12px",
                  borderRadius: "999px",
                  marginBottom: "8px"
                }}>
                  {service.label}
                </span>
              )}
              
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

// main.jsx - adicione este componente

/* ─── Category Page Preview (seção expandida na home) ─── */
function CategoryPagePreview({ category }) {
  const Icon = category.icon;
  const navigate = useNavigate();
  
  return (
    <section className="category-page-preview" style={{
      padding: "40px 20px",
      margin: "40px 0",
      background: "white",
      borderRadius: "24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "32px"
      }}>
        {/* Cabeçalho estilo CategoryPage */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid var(--line)",
          paddingBottom: "20px"
        }}>
          <div>
            <p className="cp-eyebrow" style={{ 
              color: "var(--forest)", 
              fontWeight: 700, 
              textTransform: "uppercase", 
              letterSpacing: "0.1em", 
              fontSize: "0.8rem",
              margin: 0
            }}>
              O que oferecemos
            </p>
            <h2 style={{ 
              fontSize: "1.8rem", 
              color: "var(--forest-deep)", 
              margin: "8px 0 0",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <Icon size={28} /> {category.title}
            </h2>
          </div>
          <button 
            onClick={() => navigate(`/categorias/${category.id}`)}
            style={{
              padding: "10px 24px",
              background: "var(--forest)",
              color: "white",
              border: "none",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            Ver todos <ChevronRight size={16} />
          </button>
        </div>

        {/* Grid de serviços estilo CategoryPage */}
        <div className="cp-services-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px"
        }}>
          {category.services.slice(0, 4).map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              categoryId={category.id} 
              variant="home" 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
/* ─── App ─── */
function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/categorias/:id" element={<CategoryPage />} />
            <Route path="/categorias/:catId/:serviceId" element={<ServicePage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AdminProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
