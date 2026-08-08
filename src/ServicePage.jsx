import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MapPin,
  ChevronRight, SlidersHorizontal, Sparkles, CalendarCheck,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { useAdmin } from "./AdminContext.jsx";
import AuthModal from "./AuthModal.jsx";
import BookingModal from "./BookingModal.jsx";
import "./servicePage.css";

export default function ServicePage() {
  const { catId, serviceId } = useParams();
  const { publicCategories: categories } = useAdmin();
  const category = categories.find((c) => c.id === catId);
  const service = category?.services.find((s) => s.id === serviceId);
  const { user } = useAuth();

  const [sortBy, setSortBy] = useState("destaque");
  const [showBooking, setShowBooking] = useState(false);
  const [bookingListing, setBookingListing] = useState(null);
  const [authModal, setAuthModal] = useState(false);
  const [pendingListing, setPendingListing] = useState(null);

  function handleReservar(listing = null) {
    if (!user) {
      setPendingListing(listing);
      setAuthModal(true);
      return;
    }
    setBookingListing(listing);
    setShowBooking(true);
  }

  function handleAuthSuccess() {
    setBookingListing(pendingListing);
    setShowBooking(true);
    setPendingListing(null);
  }

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
        style={{ backgroundImage: `url(${service.image || category.heroImage})` }}
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
                      className="sp-btn-primary"
                      onClick={() => handleReservar(listing)}
                    >
                      <CalendarCheck size={15} /> Fazer reserva
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}

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

      {/* Modal de autenticação (necessário para reservar) */}
      {authModal && (
        <AuthModal
          onClose={() => { setAuthModal(false); setPendingListing(null); }}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Modal de reserva */}
      {showBooking && (
        <BookingModal
          service={service}
          listing={bookingListing}
          onClose={() => { setShowBooking(false); setBookingListing(null); }}
        />
      )}
    </main>
  );
}
