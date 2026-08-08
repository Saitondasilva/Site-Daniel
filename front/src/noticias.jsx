//noticias.jxs
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, ChevronRight, Phone, Mail } from "lucide-react";
import { categories } from "./categories.js";
import "./categoryPage.css";

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
     

      <div className="cp-body">

        {/* Serviços — agora clicáveis */}
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



        
       
      </div>
    </main>
  );
}
