import React, { useState, useEffect } from "react";
import { X, CalendarDays, Users, MessageSquare, CheckCircle2, ChevronRight, Phone, Mail } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import "./bookingModal.css";

export default function BookingModal({ service, listing, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", date: "", persons: "1", message: "" });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  function set(field, val) { setForm((p) => ({ ...p, [field]: val })); setError(""); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.date) { setError("Seleciona uma data para a reserva."); return; }
    if (!form.name || !form.email) { setError("Nome e email são obrigatórios."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const reservas = JSON.parse(localStorage.getItem("stp_reservas") || "[]");
    reservas.push({ id: Date.now(), userId: user.id, serviceId: service.id, serviceName: service.name, listingId: listing?.id, listingName: listing?.nome || service.name, ...form, createdAt: new Date().toISOString(), status: "pendente" });
    localStorage.setItem("stp_reservas", JSON.stringify(reservas));
    setLoading(false);
    setStep("success");
  }

  const ServiceIcon = service.icon;

  return (
    <>
      <div className="bm-backdrop" onClick={onClose} />
      <div className="bm-modal" role="dialog" aria-modal="true">
        <button className="bm-close" onClick={onClose} aria-label="Fechar"><X size={18} /></button>

        {step === "form" && (
          <>
            <div className="bm-header">
              <div className="bm-service-badge"><ServiceIcon size={18} /><span>{service.name}</span></div>
              <h2>{listing ? `Reservar em ${listing.nome}` : `Reservar ${service.name}`}</h2>
              {listing && (
                <div className="bm-listing-info">
                  <span className="bm-listing-tipo">{listing.tipo}</span>
                  <span className="bm-listing-preco">{listing.preco}</span>
                </div>
              )}
              <p className="bm-user-greeting">Olá, <strong>{user.name}</strong>! Preenche os dados abaixo para confirmar a tua reserva.</p>
            </div>
            {error && <p className="bm-error">{error}</p>}
            <form className="bm-form" onSubmit={handleSubmit} noValidate>
              <fieldset className="bm-fieldset">
                <legend>Os teus dados</legend>
                <div className="bm-row">
                  <div className="bm-field">
                    <label htmlFor="bm-name">Nome</label>
                    <input id="bm-name" type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="O teu nome" />
                  </div>
                  <div className="bm-field">
                    <label htmlFor="bm-email">Email</label>
                    <input id="bm-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="o.teu@email.com" />
                  </div>
                </div>
                <div className="bm-field">
                  <label htmlFor="bm-phone">Telefone <span className="bm-optional">(opcional)</span></label>
                  <div className="bm-input-icon-wrap">
                    <Phone size={15} className="bm-icon" />
                    <input id="bm-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+351 912 345 678" />
                  </div>
                </div>
              </fieldset>
              <fieldset className="bm-fieldset">
                <legend>Detalhes da reserva</legend>
                <div className="bm-row">
                  <div className="bm-field">
                    <label htmlFor="bm-date"><CalendarDays size={14} /> Data pretendida <span className="bm-req">*</span></label>
                    <input id="bm-date" type="date" min={today} value={form.date} onChange={(e) => set("date", e.target.value)} />
                  </div>
                  <div className="bm-field">
                    <label htmlFor="bm-persons"><Users size={14} /> Número de pessoas</label>
                    <select id="bm-persons" value={form.persons} onChange={(e) => set("persons", e.target.value)}>
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => <option key={n} value={n}>{n} {n === 1 ? "pessoa" : "pessoas"}</option>)}
                      <option value="10+">Mais de 10</option>
                    </select>
                  </div>
                </div>
                <div className="bm-field">
                  <label htmlFor="bm-msg"><MessageSquare size={14} /> Notas adicionais <span className="bm-optional">(opcional)</span></label>
                  <textarea id="bm-msg" rows={3} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Ex: preferência de horário, necessidades especiais..." />
                </div>
              </fieldset>
              <button type="submit" className="bm-submit" disabled={loading}>
                {loading ? <><span className="bm-spinner" /> A enviar pedido...</> : <>Confirmar pedido de reserva <ChevronRight size={16} /></>}
              </button>
              <p className="bm-disclaimer">O prestador irá confirmar a disponibilidade por email em até 48h.</p>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="bm-success">
            <div className="bm-success-icon"><CheckCircle2 size={48} /></div>
            <h2>Pedido enviado!</h2>
            <p>O teu pedido de reserva para <strong>{listing?.nome || service.name}</strong> foi registado para <strong>{new Date(form.date + "T12:00:00").toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })}</strong>.</p>
            <div className="bm-success-details">
              <div className="bm-success-row"><Mail size={15} /><span>Confirmação enviada para <strong>{form.email}</strong></span></div>
              <div className="bm-success-row"><CalendarDays size={15} /><span>Resposta do prestador em até <strong>48 horas</strong></span></div>
            </div>
            <button className="bm-submit" onClick={onClose}>Fechar</button>
          </div>
        )}
      </div>
    </>
  );
}
