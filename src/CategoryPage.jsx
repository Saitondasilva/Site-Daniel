// CategoryPage.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronRight, Phone, Mail, Package, Clock, Menu, X, LogOut, User } from "lucide-react";
import { categories, pacotes } from "./categories.js";
import { useAuth } from "./AuthContext.jsx";
import "./categoryPage.css";
import "./styles.css";

// Componente MobileMenu específico para CategoryPage
function CategoryMobileMenu({ open, onClose }) {
  const { user, logout } = useAuth();

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const linkStyle = { 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    padding: "12px 14px", 
    borderRadius: "14px", 
    color: "var(--ink)", 
    fontWeight: 700, 
    fontSize: "0.93rem", 
    textDecoration: "none", 
    transition: "background 0.15s" 
  };

  return (
    <>
      <div 
        onClick={onClose} 
        style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 98, 
          background: "rgba(7,63,37,.55)", 
          opacity: open ? 1 : 0, 
          pointerEvents: open ? "auto" : "none", 
          transition: "opacity 0.25s" 
        }} 
      />
      <nav 
        aria-label="Menu principal" 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          bottom: 0, 
          zIndex: 99, 
          width: "min(300px,85vw)", 
          background: "var(--cream)", 
          padding: "28px 24px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px", 
          transform: open ? "translateX(0)" : "translateX(-100%)", 
          transition: "transform 0.28s cubic-bezier(.4,0,.2,1)", 
          overflowY: "auto" 
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Link to="/" onClick={onClose} style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--forest-deep)", textDecoration: "none" }}>
            STP Verde
          </Link>
          <button 
            onClick={onClose} 
            aria-label="Fechar menu" 
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--forest-deep)", padding: 4 }}
          >
            <X size={22} />
          </button>
        </div>

        {user && (
          <div style={{ padding: "12px 14px", borderRadius: "14px", background: "rgba(88,185,87,.1)", border: "1px solid rgba(88,185,87,.2)", marginBottom: "8px" }}>
            <p style={{ margin: "0 0 4px", fontSize: "0.75rem", fontWeight: 800, color: "var(--forest)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Sessão iniciada
            </p>
            <p style={{ margin: "0 0 10px", fontWeight: 700, color: "var(--ink)", fontSize: "0.93rem" }}>
              {user.name}
            </p>
            <button 
              onClick={() => { logout(); onClose(); }} 
              style={{ display: "flex", alignItems: "center", gap: "7px", background: "none", border: "1px solid var(--line)", borderRadius: "8px", padding: "7px 12px", color: "var(--muted)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
            >
              <LogOut size={14} /> Terminar sessão
            </button>
          </div>
        )}

        <p style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--forest)", margin: "8px 0" }}>
          Categorias
        </p>

        {categories.map(({ id, title, icon: Icon }) => (
          <Link 
            key={id} 
            to={`/categorias/${id}`} 
            onClick={onClose} 
            style={linkStyle}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(88,185,87,.12)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <Icon size={18} style={{ color: "var(--forest)" }} />
            {title}
          </Link>
        ))}

       

        <div style={{ marginTop: "auto", borderTop: "1px solid var(--line)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <Link to="/categorias/alojamento/hoteis" onClick={onClose} style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>
            Alojamento
          </Link>
          <Link to="/categorias/alojamento/Transporte" onClick={onClose} style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>
            Transporte
          </Link>
          <Link to="/categorias/alojamento/Excursões" onClick={onClose} style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>
            Excursões
          </Link>
          <Link to="/categorias/alojamento/Tours" onClick={onClose} style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>
            Tours
          </Link>
          <Link to="/sobre" onClick={onClose} style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>
            Sobre nós
          </Link>
          <Link to="/sobre" onClick={onClose} style={{ color: "var(--muted)", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>
            Contato
          </Link>
        </div>
      </nav>
    </>
  );
}

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isPackagesCategory = id === "pacotes";
  const category = !isPackagesCategory ? categories.find((c) => c.id === id) : null;

  if (isPackagesCategory) {
    return <PackagesCategoryPage />;
  }

  if (!category) {
    return (
      <div className="cp-notfound">
        <h2>Categoria não encontrada</h2>
        <Link to="/" className="cp-back-btn">
          <ArrowLeft size={18} /> Voltar ao início
        </Link>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <main className="cp-root">
      <CategoryMobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <section
        className="cp-hero"
        style={{ backgroundImage: `url(${category.heroImage})` }}
      >
        <div className="cp-hero-overlay" />
        
        {/* Navbar - com flex: 1 para empurrar links para a direita */}
        <nav className="cp-nav" style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          zIndex: 10,
          background: "linear-gradient(to bottom, rgba(0,0,0,.3) 0%, transparent 100%)"
        }}>
          <Link to="/" className="cp-brand" style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <img src="/public/images/logotipo.jpeg" alt="STP Verde" style={{ height: "32px", borderRadius: "6px" }} />
          </Link>

          {/* Spacer flexível para empurrar os links para a direita */}
          <div style={{ flex: 1 }} />

          <div className="cp-nav-links" style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            color: "white",
            marginRight: "16px"
          }}>
            
            <Link to="/categorias/alojamento/hoteis" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Alojamento</Link>
            <Link to="/categorias/alojamento/Transporte" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Transporte</Link>
            <Link to="/categorias/alojamento/Excursões" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Excursões</Link>
            <Link to="/categorias/alojamento/Tours" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Tours</Link>
            <Link to="/sobre" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Sobre</Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, color: "rgba(255,255,255,.85)" }}>
                  <User size={15} /> {user.name.split(" ")[0]}
                </span>
                <button onClick={logout} aria-label="Terminar sessão"
                  style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", borderRadius: "999px", padding: "7px 14px", color: "rgba(255,255,255,.85)", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", transition: "background .15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.22)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>
                  <LogOut size={14} /> Sair
                </button>
              </div>
            )}
            
            <button 
              className="cp-menu-btn"
              aria-label="Abrir menu" 
              onClick={() => setMenuOpen(true)}
              style={{
                background: "rgba(255,255,255,.15)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: "8px",
                padding: "8px",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background .15s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.25)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.15)"}
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>

        <div className="cp-hero-content">
          <Link to="/" className="cp-back-btn">
            <ArrowLeft size={18} /> Todas as categorias
          </Link>
          <div className="cp-hero-badge">
            <Icon size={20} />
            <span>{category.title}</span>
          </div>
          <h1>{category.tagline}</h1>
          <p className="cp-hero-desc">{category.description}</p>
        </div>
      </section>

      <div className="cp-body">
        {/* Resto do conteúdo da categoria... */}
        <section className="cp-section">
          <div className="cp-section-header">
            <p className="cp-eyebrow">O que oferecemos</p>
            <h2>Serviços disponíveis</h2>
          </div>
          <div className="cp-services-grid">
            {category.services.map((service) => {
              const ServiceIcon = service.icon;
              const count = service.listings.length;
              return (
                <article
                  className="cp-service-card cp-service-card--clickable"
                  key={service.id}
                  onClick={() => navigate(`/categorias/${id}/${service.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/categorias/${id}/${service.id}`)}
                  aria-label={`Ver ${count} resultado${count !== 1 ? "s" : ""} para ${service.name}`}
                >
                  <div className="cp-service-icon">
                    <ServiceIcon size={26} />
                  </div>
                  <div className="cp-service-info">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                  <span className="cp-service-label">{service.label}</span>

                  <div className="cp-service-footer">
                    <span className="cp-service-count">
                      {count} {count === 1 ? "resultado" : "resultados"}
                    </span>
                    <span className="cp-service-arrow">
                      Ver todos <ChevronRight size={14} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Parceiros em destaque */}
        {category.parceiros && category.parceiros.length > 0 && (
          <section className="cp-section">
            <div className="cp-section-header">
              <p className="cp-eyebrow">Parceiros em destaque</p>
              <h2>Quem encontras em STP</h2>
            </div>
            <div className="cp-partners-grid">
              {category.parceiros.map((p) => (
                <article className="cp-partner-card" key={p.nome}>
                  <div className="cp-partner-avatar">{p.nome.charAt(0)}</div>
                  <div className="cp-partner-info">
                    <h3>{p.nome}</h3>
                    <span className="cp-partner-tipo">{p.tipo}</span>
                    <p className="cp-partner-local">
                      <MapPin size={13} /> {p.local}
                    </p>
                    <p className="cp-partner-destaque">"{p.destaque}"</p>
                  </div>
                  <button className="cp-partner-cta">
                    Ver perfil <ChevronRight size={15} />
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Contacto */}
        <section className="cp-contact-band">
          <div className="cp-contact-text">
            <p className="cp-eyebrow">Precisa de ajuda?</p>
            <h2>Fala connosco</h2>
            <p>A nossa equipa ajuda-te a encontrar o serviço certo para a tua viagem a São Tomé e Príncipe.</p>
          </div>
          <div className="cp-contact-actions">
            <a href="mailto:info@stpverde.st" className="cp-contact-link">
              <Mail size={18} /> info@stpverde.st
            </a>
            <a href="tel:+23912345678" className="cp-contact-link">
              <Phone size={18} /> +239 123 456 78
            </a>
          </div>
        </section>

        {/* Outras categorias */}
        <section className="cp-section">
          <div className="cp-section-header">
            <p className="cp-eyebrow">Continua a explorar</p>
            <h2>Outras categorias</h2>
          </div>
          <div className="cp-other-cats">
            {categories
              .filter((c) => c.id !== id)
              .map((c) => {
                const CatIcon = c.icon;
                return (
                  <Link to={`/categorias/${c.id}`} className="cp-cat-pill" key={c.id}>
                    <CatIcon size={16} />
                    {c.title}
                  </Link>
                );
              })}
            <Link to="/categorias/pacotes" className="cp-cat-pill">
              <Package size={16} />
              Pacotes
            </Link>
          </div>
        </section>
      </div>

      <footer className="footer" id="contacto">
        <div>
          <strong>STP Tour</strong>
          <p>Portal turístico para São Tomé e Príncipe.</p>
        </div>
        <Link to="/sobre" style={{ color: "inherit", fontSize: "0.9rem", fontWeight: 700 }}>Sobre nós →</Link>
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

// Componente especial para a página de Pacotes
function PackagesCategoryPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredPackages = pacotes.filter(pkg => 
    pkg.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.duracao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="cp-root">
      <CategoryMobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <section className="cp-hero" style={{ 
        background: "linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 100%)" 
      }}>
        <div className="cp-hero-overlay" />
        
        {/* Navbar - com flex: 1 para empurrar links para a direita */}
        <nav className="cp-nav" style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          zIndex: 10,
          background: "linear-gradient(to bottom, rgba(0,0,0,.3) 0%, transparent 100%)"
        }}>
          <Link to="/" className="cp-brand" style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <img src="/public/images/logotipo.jpeg" alt="STP Verde" style={{ height: "32px", borderRadius: "6px" }} />
          </Link>

          <div style={{ flex: 1 }} />

          <div className="cp-nav-links" style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            color: "white",
            marginRight: "16px"
          }}>
            
            <Link to="/categorias/alojamento/hoteis" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Alojamento</Link>
            <Link to="/categorias/alojamento/Transporte" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Transporte</Link>
            <Link to="/categorias/alojamento/Excursões" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Excursões</Link>
            <Link to="/categorias/alojamento/Tours" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Tours</Link>
            <Link to="/sobre" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Sobre</Link>
            <Link to="/sobre" style={{ color: "rgba(255,255,255,.8)", textDecoration: "none", fontWeight: 500, fontSize: "0.9rem" }}>Contacto</Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, color: "rgba(255,255,255,.85)" }}>
                  <User size={15} /> {user.name.split(" ")[0]}
                </span>
                <button onClick={logout} aria-label="Terminar sessão"
                  style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", borderRadius: "999px", padding: "7px 14px", color: "rgba(255,255,255,.85)", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", transition: "background .15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.22)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.12)"}>
                  <LogOut size={14} /> Sair
                </button>
              </div>
            )}
            
            <button 
              className="cp-menu-btn"
              aria-label="Abrir menu" 
              onClick={() => setMenuOpen(true)}
              style={{
                background: "rgba(255,255,255,.15)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: "8px",
                padding: "8px",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background .15s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,.25)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,.15)"}
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>

        <div className="cp-hero-content">
          <Link to="/" className="cp-back-btn">
            <ArrowLeft size={18} /> Todas as categorias
          </Link>
          <h1>Roteiros prontos</h1>
          <p className="cp-hero-desc">
            Combinações pensadas de alojamento, transporte e excursões para tornar o teu planeamento mais simples.
          </p>
          
          <div className="cp-search-bar" style={{
            maxWidth: "500px",
            margin: "24px auto 0",
            background: "rgba(255,255,255,.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,.15)",
            borderRadius: "999px",
            padding: "4px 20px",
            display: "flex",
            alignItems: "center"
          }}>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar pacotes..."
              style={{
                background: "transparent",
                color: "white",
                width: "100%",
                border: "none",
                padding: "12px 8px",
                fontSize: "0.95rem",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
          </div>
        </div>
      </section>

      <div className="cp-body">
        {/* Resto do conteúdo de pacotes */}
        <section className="cp-section">
          <div className="cp-section-header">
            <p className="cp-eyebrow">Pacotes disponíveis</p>
            <h2>Todos os roteiros</h2>
          </div>
          
          {filteredPackages.length === 0 ? (
            <div className="cp-no-results" style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--muted)"
            }}>
              <p style={{ fontSize: "1.1rem" }}>Nenhum pacote encontrado para "{searchTerm}"</p>
            </div>
          ) : (
            <div className="cp-packages-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "32px",
              marginTop: "8px"
            }}>
              {filteredPackages.map((pkg, index) => (
                <article 
                  className="cp-package-card" 
                  key={pkg.id || index}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,.08)",
                    transition: "transform .25s, box-shadow .25s",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate("/categorias/tours")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.08)";
                  }}
                >
                  <div className="cp-package-image" style={{
                    position: "relative",
                    height: "220px",
                    overflow: "hidden"
                  }}>
                    <img 
                      src={pkg.image} 
                      alt={pkg.nome}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform .3s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                    <span className="cp-package-duration" style={{
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      background: "rgba(0,0,0,.75)",
                      backdropFilter: "blur(8px)",
                      color: "white",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      border: "1px solid rgba(255,255,255,.15)"
                    }}>
                      <Clock size={14} /> {pkg.duracao}
                    </span>
                  </div>
                  <div className="cp-package-body" style={{
                    padding: "24px"
                  }}>
                    <h3 style={{
                      fontSize: "1.2rem",
                      margin: "0 0 8px",
                      color: "var(--forest-deep)"
                    }}>{pkg.nome}</h3>
                    <p style={{
                      color: "var(--muted)",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      margin: "0 0 20px"
                    }}>{pkg.descricao}</p>
                    <div className="cp-package-footer" style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap"
                    }}>
                      <span className="cp-package-price" style={{
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        color: "var(--forest)"
                      }}>{pkg.preco}</span>
                      <button 
                        className="cp-package-btn"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "var(--forest)",
                          color: "white",
                          border: "none",
                          padding: "8px 18px",
                          borderRadius: "999px",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          transition: "background .15s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "var(--forest-deep)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "var(--forest)"}
                      >
                        Ver detalhes <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="cp-section">
          <div className="cp-section-header">
            <p className="cp-eyebrow">Continua a explorar</p>
            <h2>Outras categorias</h2>
          </div>
          <div className="cp-other-cats">
            {categories.map((c) => {
              const CatIcon = c.icon;
              return (
                <Link to={`/categorias/${c.id}`} className="cp-cat-pill" key={c.id}>
                  <CatIcon size={16} />
                  {c.title}
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <footer className="footer" id="contacto">
        <div>
          <strong>STP Tour</strong>
          <p>Portal turístico para São Tomé e Príncipe.</p>
        </div>
        <Link to="/sobre" style={{ color: "inherit", fontSize: "0.9rem", fontWeight: 700 }}>Sobre nós →</Link>
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