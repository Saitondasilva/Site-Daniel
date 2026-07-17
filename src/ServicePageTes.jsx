import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MapPin, Star, Phone, Mail, Globe,
  ChevronRight, SlidersHorizontal, X, Sparkles,
} from "lucide-react";
import { categories } from "./categories.js";
import "./servicePage.css";

export default function ServicePage() {
  const { catId, serviceId } = useParams();
  const category = categories.find((c) => c.id === catId);
  const service = category?.services.find((s) => s.id === serviceId);

  const [sortBy, setSortBy] = useState("destaque");
  const [selectedListing, setSelectedListing] = useState(null);

  if (!category || !service) {
    return (
      <div className="sp-notfound">
        <h2>Serviço não encontrado</h2>
        <Link to="/" className="sp-back-btn">
          <ArrowLeft size={18} /> Voltar ao início
        </Link>
      </div>
    );
  }

  const ServiceIcon = service.icon;
  const CatIcon = category.icon;

  const sorted = [...service.listings].sort((a, b) => {
    if (sortBy === "avaliacao") return b.avaliacao - a.avaliacao;
    if (sortBy === "preco") return a.preco.localeCompare(b.preco);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rating) ? "sp-star filled" : "sp-star"}>★</span>
    ));
  }

  return (
    <main className="sp-root">
      {/* Hero compacto */}
      <section
        className="sp-hero"
        style={{ backgroundImage: `url(${category.heroImage})` }}
      >
        <div className="sp-hero-overlay" />
        <div className="sp-hero-content">
          {/* Breadcrumb */}
          <nav className="sp-breadcrumb" aria-label="Navegação">
            <Link to="/"><span>Início</span></Link>
            <ChevronRight size={14} />
            <Link to={`/categorias/${catId}`}>
              <CatIcon size={14} /><span>{category.title}</span>
            </Link>
            <ChevronRight size={14} />
            <span className="sp-breadcrumb-current">{service.name}</span>
          </nav>

          <div className="sp-hero-badge">
            <ServiceIcon size={18} />
            <span>{service.label}</span>
          </div>

          <h1>{service.name}</h1>
          <p className="sp-hero-desc">{service.description}</p>

          <div className="sp-hero-meta">
            <span className="sp-count-badge">
              {service.listings.length} {service.listings.length === 1 ? "resultado" : "resultados"}
            </span>
            <span className="sp-meta-sep">·</span>
            <span className="sp-location-badge"><MapPin size={13} /> São Tomé e Príncipe</span>
          </div>
        </div>
      </section>

      <div className="sp-body">
        {/* Toolbar */}
        <div className="sp-toolbar">
          <p className="sp-toolbar-label">
            <SlidersHorizontal size={15} /> Ordenar por:
          </p>
          <div className="sp-sort-pills">
            {[
              { key: "destaque", label: "Em destaque" },
              { key: "avaliacao", label: "Melhor avaliação" },
              { key: "preco", label: "Preço" },
            ].map((opt) => (
              <button
                key={opt.key}
                className={`sp-sort-pill ${sortBy === opt.key ? "active" : ""}`}
                onClick={() => setSortBy(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings */}
        <div className="sp-listings">
          {sorted.map((listing) => (
            <article
              key={listing.id}
              className={`sp-card ${listing.featured ? "sp-card--featured" : ""}`}
            >
              {listing.featured && (
                <div className="sp-featured-badge">
                  <Sparkles size={12} /> Em destaque
                </div>
              )}

              {/* Avatar / Inicial */}
              <div className="sp-card-avatar">
                <span>{listing.nome.charAt(0)}</span>
              </div>

              <div className="sp-card-body">
                <div className="sp-card-top">
                  <div>
                    <h2 className="sp-card-nome">{listing.nome}</h2>
                    <span className="sp-card-tipo">{listing.tipo}</span>
                  </div>
                  <div className="sp-card-rating">
                    <div className="sp-stars">{renderStars(listing.avaliacao)}</div>
                    <span className="sp-rating-num">{listing.avaliacao.toFixed(1)}</span>
                    <span className="sp-rating-count">({listing.avaliacoes})</span>
                  </div>
                </div>

                <p className="sp-card-local">
                  <MapPin size={13} /> {listing.local}
                </p>

                <p className="sp-card-desc">{listing.descricao}</p>

                <div className="sp-card-tags">
                  {listing.tags.map((tag) => (
                    <span key={tag} className="sp-tag">{tag}</span>
                  ))}
                </div>

                <div className="sp-card-footer">
                  <div className="sp-card-preco">
                    <span className="sp-preco-label">Preço</span>
                    <span className="sp-preco-val">{listing.preco}</span>
                  </div>
                  <div className="sp-card-actions">
                    <button
                      className="sp-btn-outline"
                      onClick={() => setSelectedListing(listing)}
                    >
                      Ver detalhes
                    </button>
                    <a
                      href={`mailto:${listing.contacto.email || "info@stpverde.st"}`}
                      className="sp-btn-primary"
                    >
                      Contactar
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Card CTA para reservas */}
          <article className="sp-card sp-card--cta">
            <div className="sp-cta-inner">
              <div className="sp-cta-icon"><ServiceIcon size={28} /></div>
              <p className="sp-cta-eyebrow">Queres fazer uma reserva em um {service.name.toLowerCase()}?</p>
              <h3>Preencha o formulário de Acesso</h3>
              <p>Chega a turistas que visitam STP todos os anos. Cadastro simples e rápido.</p>
              <button className="sp-cta-btn">
                Marcar Reserva <ChevronRight size={15} />
              </button>
            </div>
          </article>
        </div>

        {/* Outros serviços desta categoria */}
        {category.services.filter((s) => s.id !== serviceId).length > 0 && (
          <section className="sp-other-services">
            <p className="sp-eyebrow">Continua a explorar</p>
            <h2 className="sp-section-title">Outros serviços em {category.title}</h2>
            <div className="sp-pills">
              {category.services
                .filter((s) => s.id !== serviceId)
                .map((s) => {
                  const SI = s.icon;
                  return (
                    <Link
                      key={s.id}
                      to={`/categorias/${catId}/${s.id}`}
                      className="sp-pill"
                    >
                      <SI size={15} /> {s.name}
                      <span className="sp-pill-count">{s.listings.length}</span>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}
      </div>

      {/* Modal de detalhes */}
      {selectedListing && (
        <DetailModal
          listing={selectedListing}
          service={service}
          onClose={() => setSelectedListing(null)}
          renderStars={renderStars}
        />
      )}
    </main>
  );
}

function DetailModal({ listing, service, onClose, renderStars }) {
  const ServiceIcon = service.icon;

  // Fechar com ESC
  React.useEffect(() => {
    const handle = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  // Bloquear scroll do body
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      <div className="sp-modal-backdrop" onClick={onClose} />
      <div className="sp-modal" role="dialog" aria-modal="true">
        <button className="sp-modal-close" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        {/* Header do modal */}
        <div className="sp-modal-header">
          <div className="sp-modal-avatar">{listing.nome.charAt(0)}</div>
          <div>
            <h2 className="sp-modal-nome">{listing.nome}</h2>
            <span className="sp-modal-tipo">{listing.tipo}</span>
            <p className="sp-modal-local"><MapPin size={13} /> {listing.local}</p>
          </div>
        </div>

        {/* Destaque */}
        <div className="sp-modal-destaque">
          <Sparkles size={15} />
          <span>{listing.destaque}</span>
        </div>

        {/* Rating */}
        <div className="sp-modal-rating">
          <div className="sp-stars sp-stars--lg">{renderStars(listing.avaliacao)}</div>
          <strong>{listing.avaliacao.toFixed(1)}</strong>
          <span className="sp-rating-count">({listing.avaliacoes} avaliações)</span>
        </div>

        {/* Descrição */}
        <p className="sp-modal-desc">{listing.descricao}</p>

        {/* Tags */}
        <div className="sp-card-tags" style={{ marginBottom: "20px" }}>
          {listing.tags.map((tag) => (
            <span key={tag} className="sp-tag">{tag}</span>
          ))}
        </div>

        {/* Preço */}
        <div className="sp-modal-preco">
          <span className="sp-preco-label">Preço</span>
          <span className="sp-preco-val sp-preco-val--lg">{listing.preco}</span>
        </div>

        {/* Contactos */}
        <div className="sp-modal-contacts">
          {listing.contacto.tel && (
            <a href={`tel:${listing.contacto.tel}`} className="sp-contact-item">
              <Phone size={16} /> {listing.contacto.tel}
            </a>
          )}
          {listing.contacto.email && (
            <a href={`mailto:${listing.contacto.email}`} className="sp-contact-item">
              <Mail size={16} /> {listing.contacto.email}
            </a>
          )}
          {listing.contacto.web && (
            <a
              href={`https://${listing.contacto.web}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-contact-item"
            >
              <Globe size={16} /> {listing.contacto.web}
            </a>
          )}
        </div>

        {/* CTAs */}
        <div className="sp-modal-actions">
          {listing.contacto.email && (
            <a href={`mailto:${listing.contacto.email}`} className="sp-btn-primary sp-btn-full">
              <Mail size={16} /> Enviar mensagem
            </a>
          )}
          {listing.contacto.tel && (
            <a href={`tel:${listing.contacto.tel}`} className="sp-btn-outline sp-btn-full">
              <Phone size={16} /> Ligar agora
            </a>
          )}
        </div>
      </div>
    </>
  );
}
