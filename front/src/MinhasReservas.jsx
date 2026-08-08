import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, ShieldCheck, CheckCircle2, XCircle, Banknote, CalendarDays, Users as UsersIcon } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { useAdmin } from "./AdminContext.jsx";
import "./minhasReservas.css";

const STATUS_INFO = {
  pendente: { label: "Pedido enviado", cls: "mr-badge--orange", icon: Clock, text: "Estamos a verificar a disponibilidade. Assim que confirmarmos, vais receber uma mensagem aqui com os próximos passos." },
  aprovada: { label: "Aguarda pagamento do sinal", cls: "mr-badge--blue", icon: ShieldCheck, text: null },
  confirmada: { label: "Confirmada", cls: "mr-badge--green", icon: CheckCircle2, text: "A tua reserva está 100% confirmada e marcada. Vemo-nos em breve!" },
  cancelada: { label: "Cancelada", cls: "mr-badge--red", icon: XCircle, text: "Esta reserva foi cancelada." },
  concluida: { label: "Concluída", cls: "mr-badge--green", icon: CheckCircle2, text: "Esperamos que tenhas gostado!" },
};

export default function MinhasReservas() {
  const { user } = useAuth();
  const { fetchMinhasReservas, clienteReportarPagamento } = useAdmin();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportingId, setReportingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function load() {
    setLoading(true); setError("");
    try {
      const list = await fetchMinhasReservas(user.token, { usuario_id: user.id, usuario_email: user.email });
      setReservas(list);
    } catch (err) {
      setError(err.message || "Não foi possível carregar as tuas reservas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReportPayment(id) {
    setReportingId(id);
    try {
      await clienteReportarPagamento(user.token, id);
      await load();
    } catch (err) {
      alert(err.message || "Não foi possível registar o pagamento. Tenta novamente.");
    } finally {
      setReportingId(null);
    }
  }

  if (!user) {
    return (
      <main className="mr-page">
        <div className="mr-empty-state">
          <p>Precisas de iniciar sessão para veres as tuas reservas.</p>
          <Link to="/" className="mr-btn-primary">Voltar ao início</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mr-page">
      <div className="mr-header">
        <button className="mr-back" onClick={() => navigate(-1)}><ArrowLeft size={18} /></button>
        <div>
          <h1>As minhas reservas</h1>
          <p>Acompanha aqui o estado de cada pedido — desde o envio até à confirmação final.</p>
        </div>
      </div>

      {loading && <p className="mr-loading">A carregar...</p>}
      {error && <p className="mr-error">{error}</p>}

      {!loading && !error && reservas.length === 0 && (
        <div className="mr-empty-state">
          <p>Ainda não fizeste nenhuma reserva.</p>
          <Link to="/" className="mr-btn-primary">Explorar serviços</Link>
        </div>
      )}

      <div className="mr-list">
        {reservas.map((r) => {
          const info = STATUS_INFO[r.status] || STATUS_INFO.pendente;
          const Icon = info.icon;
          return (
            <article key={r.id} className="mr-card">
              <div className="mr-card-top">
                <h3>{r.listingName || r.serviceName}</h3>
                <span className={`mr-badge ${info.cls}`}><Icon size={13} /> {info.label}</span>
              </div>
              <div className="mr-card-meta">
                <span><CalendarDays size={14} /> {r.date} {r.time ? `· ${r.time}` : ""}</span>
                <span><UsersIcon size={14} /> {r.persons} {r.persons === "1" ? "pessoa" : "pessoas"}</span>
              </div>

              {info.text && <p className="mr-card-note">{info.text}</p>}

              {r.status === "aprovada" && (
                <div className="mr-deposit">
                  <p className="mr-deposit-msg">"{r.adminMessage}"</p>
                  {r.depositValue && <p className="mr-deposit-value"><Banknote size={14} /> Sinal a pagar: <strong>{r.depositValue}</strong> ({r.depositPercent}%)</p>}
                  {r.clientReportedPayment ? (
                    <p className="mr-deposit-waiting">✅ Assinalaste o pagamento — a aguardar confirmação da nossa equipa.</p>
                  ) : (
                    <button className="mr-btn-primary" disabled={reportingId === r.id} onClick={() => handleReportPayment(r.id)}>
                      {reportingId === r.id ? "A registar..." : "Já paguei o sinal"}
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
