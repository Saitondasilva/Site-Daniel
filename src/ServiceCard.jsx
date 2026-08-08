// ServiceCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function ServiceCard({ service, categoryId, variant = "default" }) {
  const navigate = useNavigate();
  const count = service.listings.length;

  // Variante "home" - usada na página inicial
  if (variant === "home") {
    return (
      <article
        className="serviceCard"
        style={{
          cursor: "pointer",
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
          transition: "transform 0.2s, box-shadow 0.2s"
        }}
        onClick={() => navigate(`/categorias/${categoryId}/${service.id}`)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
        }}
      >
        <h4 style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "var(--forest-deep)",
          marginBottom: "8px",
          textTransform: "capitalize"
        }}>
          {service.name}
        </h4>
        
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
        
        <div style={{
          marginTop: "auto",
          paddingTop: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.75rem",
          color: "var(--forest)",
          fontWeight: 700
        }}>
          <span>{count} {count === 1 ? "resultado" : "resultados"}</span>
          <ChevronRight size={14} />
        </div>
      </article>
    );
  }

  // Variante "default" - usada no CategoryPage (estilo original)
  return (
    <article
      className="cp-service-card cp-service-card--clickable"
      onClick={() => navigate(`/categorias/${categoryId}/${service.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/categorias/${categoryId}/${service.id}`)}
      aria-label={`Ver ${count} resultado${count !== 1 ? "s" : ""} para ${service.name}`}
    >
      <div className="cp-service-icon">
        {service.icon && <service.icon size={26} />}
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
}