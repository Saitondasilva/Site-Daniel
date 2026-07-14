import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, MapPin, Mail, Phone, Globe,
  Users, ShieldCheck, Leaf, Star,
  Instagram, Facebook, Twitter,
  ChevronRight, Heart,
} from "lucide-react";
import "./aboutPage.css";

const team = [
  { name: "Daniel Sousa", role: "Fundador", initial: "D", bio: "Natural de São Tomé, Daniel cresceu entre as roças e o mar. Depois de anos a trabalhar em turismo sustentável em Portugal, regressou para construir o portal que a ilha merecia." },
 ];

const values = [
  { icon: Leaf, title: "Turismo Sustentável", desc: "Promovemos apenas parceiros comprometidos com práticas ambientais responsáveis e com a preservação da floresta equatorial e dos recifes de STP." },
  { icon: ShieldCheck, title: "Parceiros Verificados", desc: "Cada negócio listado na plataforma passou por uma verificação humana. Não publicamos perfis sem verificar identidade, licenças e qualidade do serviço." },
  { icon: Users, title: "Comunidade Local", desc: "Damos prioridade a empresas santomenses e a guias locais. O nosso objectivo é que o dinheiro do turismo fique na ilha e beneficie as comunidades." },
  { icon: Heart, title: "Feito com Amor pela Ilha", desc: "A equipa é maioritariamente santomense. Conhecemos cada praia, cada roça e cada sabor. Este portal é um acto de amor pela nossa terra." },
];

const stats = [
  { num: "8", label: "Categorias turísticas" },
  { num: "80+", label: "Parceiros verificados" },
  { num: "2", label: "Ilhas cobertas" },
  { num: "2024", label: "Ano de fundação" },
];

export default function AboutPage() {
  return (
    <main className="ab-root">

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-hero-content">
          <Link to="/" className="ab-back-btn">
            <ArrowLeft size={18} /> Voltar ao portal
          </Link>
          <div className="ab-hero-eyebrow">
            <MapPin size={14} /> São Tomé e Príncipe
          </div>
          <h1>O primeiro portal<br /><em>turístico completo de STP</em></h1>
          <p className="ab-hero-lead">
            Nascemos para ligar viajantes do mundo inteiro aos melhores serviços,
            experiências e pessoas de São Tomé e Príncipe — com autenticidade,
            cuidado e um amor profundo pela ilha.
          </p>
          <div className="ab-stats">
            {stats.map((s) => (
              <div className="ab-stat" key={s.label}>
                <span className="ab-stat-num">{s.num}</span>
                <span className="ab-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ab-body">

        {/* ── Missão ── */}
        <section className="ab-section ab-mission">
          <div className="ab-section-text">
            <p className="ab-eyebrow">A nossa missão</p>
            <h2>Tornar São Tomé e Príncipe mais fácil de descobrir — e mais difícil de esquecer.</h2>
            <p>STP Tour nasceu de uma frustração real: quem planeava uma viagem a São Tomé encontrava informação dispersa, desatualizada e sem qualidade. Hotéis sem fotos, guias sem contacto, experiências incríveis que ninguém sabia que existiam.</p>
            <p>Criámos a plataforma que gostaríamos de ter encontrado quando planeámos a nossa primeira viagem. Um diretório vivo, verificado e bonito — onde cada serviço tem uma cara, um preço e uma forma de contacto real.</p>
            <Link to="/" className="ab-cta-link">Explorar o catálogo <ChevronRight size={16} /></Link>
          </div>
          <div className="ab-mission-visual">
            <div className="ab-mission-card">
              <div className="ab-mc-top"><Star size={18} style={{ color: "#f59e0b" }} /><span>Avaliação média dos parceiros</span></div>
              <div className="ab-mc-rating">4.8 <span>/5.0</span></div>
              <div className="ab-mc-sub">Baseado em 2 400+ avaliações verificadas</div>
            </div>
            <div className="ab-mission-card ab-mission-card--alt">
              <div className="ab-mc-top"><Users size={18} style={{ color: "var(--forest)" }} /><span>Parceiros activos em 2025</span></div>
              <div className="ab-mc-rating" style={{ fontSize: "2.2rem" }}>80+</div>
              <div className="ab-mc-sub">Hotéis, guias, restaurantes, tours e mais</div>
            </div>
          </div>
        </section>

        {/* ── Valores ── */}
        <section className="ab-section">
          <div className="ab-section-header">
            <p className="ab-eyebrow">O que nos guia</p>
            <h2>Os nossos valores</h2>
          </div>
          <div className="ab-values-grid">
            {values.map(({ icon: Icon, title, desc }) => (
              <article className="ab-value-card" key={title}>
                <div className="ab-value-icon"><Icon size={24} /></div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Equipa ── */}
        <section className="ab-section">
          <div className="ab-section-header">
            <p className="ab-eyebrow">Quem somos</p>
            <h2>A equipa por detrás do portal</h2>
          </div>
          <div className="ab-team-grid">
            {team.map((member) => (
              <article className="ab-team-card" key={member.name}>
                <div className="ab-team-avatar">{member.initial}</div>
                <div className="ab-team-info">
                  <h3>{member.name}</h3>
                  <span className="ab-team-role">{member.role}</span>
                  <p>{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Contacto ── */}
        <section className="ab-section ab-contact-section">
          <div className="ab-section-header">
            <p className="ab-eyebrow">Contactos</p>
            <h2>Fala connosco</h2>
          </div>
          <div className="ab-contact-grid">
            <a href="mailto:info@stpverde.st" className="ab-contact-card">
              <div className="ab-contact-icon"><Mail size={22} /></div>
              <div><p className="ab-contact-label">Email geral</p><p className="ab-contact-val">info@stpverde.st</p></div>
            </a>
            <a href="mailto:parceiros@stpverde.st" className="ab-contact-card">
              <div className="ab-contact-icon"><Users size={22} /></div>
              <div><p className="ab-contact-label">Parcerias</p><p className="ab-contact-val">parceiros@stpverde.st</p></div>
            </a>
            <a href="tel:+23912345678" className="ab-contact-card">
              <div className="ab-contact-icon"><Phone size={22} /></div>
              <div><p className="ab-contact-label">Telefone (STP)</p><p className="ab-contact-val">+239 9991547</p></div>
            </a>
            <div className="ab-contact-card ab-contact-card--social">
              <div className="ab-contact-icon"><Globe size={22} /></div>
              <div>
                <p className="ab-contact-label">Redes sociais</p>
                <div className="ab-socials">
                  <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                  <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── Footer ── */}
      <footer className="ab-footer">
        <Link to="/" className="ab-footer-logo">STP Tour</Link>
        <p>Portal turístico para São Tomé e Príncipe · Feito com 🌿 pela ilha</p>
        <Link to="/" className="ab-footer-link">Voltar ao portal <ChevronRight size={14} /></Link>
      </footer>

    </main>
  );
}
