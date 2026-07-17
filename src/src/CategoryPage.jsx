import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronRight, Phone, Mail } from "lucide-react";
import { categories } from "./categories.js";
import "./categoryPage.css";
//import "./categoryPage1.css";
import "./styles.css";

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const category = categories.find((c) => c.id === id);

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
      {/* Hero da categoria */}
      <section
        className="cp-hero"
        style={{ backgroundImage: `url(${category.heroImage})` }}
      >
        <div className="cp-hero-overlay" />
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

                  {/* Footer do card */}
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
          </div>
        </section>
      </div>
    </main>
  );
}
