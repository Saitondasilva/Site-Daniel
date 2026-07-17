// main.jsx
import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight, ChevronLeft, MapPin, Menu, Search,
  Compass, X, LogOut, User, Package,
} from "lucide-react";
import { categories, destinos, pacotes } from "./categories.js";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { AdminProvider } from "./AdminContext.jsx";
import CategoryPage from "./CategoryPage.jsx";
import ServicePage from "./ServicePage.jsx";
import AboutPage from "./AboutPage.jsx";
import AdminPage from "./AdminPage.jsx";
import "./styles.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prev;
  }, [pathname]);
  return null;
}

function Slideshow({ items, renderItem, autoPlay = true, interval = 6000, className = "" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (!autoPlay || paused || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(t);
  }, [autoPlay, paused, interval, count]);

  function goTo(i) { setIndex(((i % count) + count) % count); }

  if (count === 0) return null;

  return (
    <div
      className={`slideshow ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="slideshowViewport">
        <div className="slideshowTrack" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((item, i) => (
            <div className="slideshowSlide" key={item.id || i} aria-hidden={i !== index}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button className="slideshowArrow slideshowArrow--prev" onClick={() => goTo(index - 1)} aria-label="Anterior">
            <ChevronLeft size={20} />
          </button>
          <button className="slideshowArrow slideshowArrow--next" onClick={() => goTo(index + 1)} aria-label="Seguinte">
            <ChevronRight size={20} />
          </button>
          <div className="slideshowDots">
            {items.map((_, i) => (
              <button
                key={i}
                className={`slideshowDot ${i === index ? "active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Ir para o slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MobileMenu({ open, onClose }) {
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
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
          <Link to="/sobre" onClick={onClose} style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:600, color:"var(--forest-deep)", textDecoration:"none" }}>STP Verde</Link>
          <button onClick={onClose} aria-label="Fechar menu" style={{ background:"none", border:"none", cursor:"pointer", color:"var(--forest-deep)", padding:4 }}><X size={22} /></button>
        </div>

        {user && (
          <div style={{ padding:"12px 14px", borderRadius:"14px", background:"rgba(88,185,87,.1)", border:"1px solid rgba(88,185,87,.2)", marginBottom:"8px" }}>
            <p style={{ margin:"0 0 4px", fontSize:"0.75rem", fontWeight:800, color:"var(--forest)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Sessão iniciada</p>
            <p style={{ margin:"0 0 10px", fontWeight:700, color:"var(--ink)", fontSize:"0.93rem" }}>{user.name}</p>
            <button onClick={() => { logout(); onClose(); }} style={{ display:"flex", alignItems:"center", gap:"7px", background:"none", border:"1px solid var(--line)", borderRadius:"8px", padding:"7px 12px", color:"var(--muted)", fontSize:"0.82rem", fontWeight:700, cursor:"pointer" }}>
              <LogOut size={14} /> Terminar sessão
            </button>
          </div>
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
          <Link to="/categorias/alojamento/hoteis" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Alojamento</Link>
          <Link to="/categorias/alojamento/Transporte" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Transporte</Link>
          <Link to="/categorias/alojamento/Excursões" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Excursões</Link>
          <Link to="/categorias/alojamento/Tours" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Tours</Link>
          <Link to="/sobre" onClick={onClose} style={{ color:"var(--muted)", fontSize:"0.9rem", fontWeight:700, textDecoration:"none" }}>Contato</Link>
        </div>
      </nav>
    </>
  );
}

function HomePage() {
  const [active, setActive] = useState("todos");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => active === "todos" || c.id === active)
      .map((c) => ({ ...c, services: c.services.filter((s) => { const hay = `${s.name} ${s.description} ${c.title}`.toLowerCase(); return !q || hay.includes(q); }) }))
      .filter((c) => c.services.length > 0);
  }, [active, query]);

  return (
    <main>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <section className="hero" id="inicio">
        <nav className="nav" aria-label="Navegação principal">
          <Link to="/sobre" className="brand" aria-label="Sobre o STP Verde" title="Sobre nós">
            <img src="public/images/logotipo.jpeg" alt="STP Verde" />
          </Link>

          <div className="navLinks">
            <Link to="/categorias/alojamento/hoteis">Alojamento</Link>
            <Link to="/categorias/alojamento/Transporte">Transporte</Link>
            <Link to="/categorias/alojamento/Excursões">Excursões</Link>
            <Link to="/categorias/alojamento/Tours">Tours</Link>
            <Link to="/sobre">Sobre nós</Link>
            <a href="#contacto">Contacto</a>
          </div>

          {user && (
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <span style={{ display:"flex", alignItems:"center", gap:"6px", fontSize:"0.82rem", fontWeight:700, color:"rgba(255,255,255,.85)" }}>
                <User size={15} /> {user.name.split(" ")[0]}
              </span>
              <button onClick={logout} aria-label="Terminar sessão"
                style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.25)", borderRadius:"999px", padding:"7px 14px", color:"rgba(255,255,255,.85)", fontSize:"0.8rem", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", transition:"background .15s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.22)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>
                <LogOut size={14} /> Sair
              </button>
            </div>
          )}

          <button className="iconButton" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
            <Menu size={20} />
          </button>
        </nav>

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow"><MapPin size={17} /> São Tomé e Príncipe</p>
            <h1 style={{ fontSize: 30 }}>Descobre ilhas feitas de mar, cacau e histórias.</h1>
            <p className="lead" style={{ textAlign: 'justify' }}>O melhor portal de São Tomé para encontrar e publicitar alojamentos, transportes, tours, gastronomia, eventos, guias e comércio local em São Tomé e Príncipe.</p>
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
              <button onClick={() => navigate("/categorias/tours")}>Pacotes Desponiveis <ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="content" id="servicos">
        
        <div className="categoryStack">
          {visibleCategories.map((category) => (
            <ServiceCategory key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="destinosSection" id="destinos">
        <div className="sectionIntro">
          <p className="eyebrow"><Compass size={16} /> Explora o arquipélago</p>
          <h2>Destinos turísticos</h2>
          <p>Os lugares que tornam São Tomé e Príncipe inesquecível — da floresta vulcânica às praias mais tranquilas do Atlântico.</p>
        </div>
        <Slideshow
          className="destinosSlideshow"
          items={destinos}
          renderItem={(d) => (
            <div className="destinoSlide">
              <div className="destinoSlideImg">
                <img src={d.image} alt={d.nome} />
              </div>
              <div className="destinoSlideBody">
                <p className="destinoSlideLocal"><MapPin size={14} /> {d.local}</p>
                <h3>{d.nome}</h3>
                <p>{d.descricao}</p>
              </div>
            </div>
          )}
        />
      </section>

   <section className="pacotesSection" id="experiencias">
  <div className="sectionIntro">
    <p className="eyebrow"><Package size={16} /> Roteiros prontos</p>
    <h2>Pacotes oferecidos</h2>
    <p>Combinações pensadas de alojamento, transporte e excursões para tornar o teu planeamento mais simples.</p>
  </div>
  <Slideshow
    className="pacotesSlideshow"
    items={pacotes}
    renderItem={(p) => (
      <div className="pacoteSlide">
        <div className="pacoteSlideImg">
          <img src={p.image} alt={p.nome} />
          <span className="pacoteSlideDuracao">{p.duracao}</span>
        </div>
        <div className="pacoteSlideBody">
          <h3>{p.nome}</h3>
          <p>{p.descricao}</p>
          <div className="pacoteSlideFooter">
            <span className="pacoteCardPreco">{p.preco}</span>
            <Link to="/categorias/pacotes" className="pacoteCardBtn">
              Ver todos os pacotes <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    )}
  />
  

</section>

      <footer className="footer" id="contacto">
        <div>
          <strong>STP Tour</strong>
          <p>Portal turístico para São Tomé e Príncipe.</p>
        </div>
        <Link to="/sobre" style={{ color:"inherit", fontSize:"0.9rem", fontWeight:700 }}>Sobre nós →</Link>
        <a href="mailto:info@stpverde.st">info@stpverde.st</a>
        <Link to="/admin" className="admin-link">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Área restrita
        </Link>
      </footer>
    </main>
  );
}

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
            style={{ border:"1.5px solid var(--forest)", borderRadius:"999px", padding:"8px 20px", background:"transparent", color:"var(--forest-deep)", fontWeight:800, fontSize:"0.82rem", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", whiteSpace:"nowrap", transition:"background .16s,color .16s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background="var(--forest)"; e.currentTarget.style.color="white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--forest-deep)"; }}>
            Ver tudo <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="serviceGrid">
        {category.services.map((service) => (
          <article key={service.id} id={`servico-${service.id}`} className="serviceCard" onClick={() => navigate(`/categorias/${category.id}/${service.id}`)}>
            <h4>{service.name}</h4>
            <div className="service-image">
              <img src={service.image || "/images/categories/default.avif"} alt={service.name} />
            </div>
            <p>{service.description}</p>
            {service.label && (
              <span className="service-label">{service.label}</span>
            )}
            <div className="service-footer">
              <span>{service.listings.length} {service.listings.length === 1 ? "resultado" : "resultados"}</span>
              <ChevronRight size={14} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
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