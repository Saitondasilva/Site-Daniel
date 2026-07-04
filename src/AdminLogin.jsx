import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAdmin } from "./AdminContext.jsx";
import "./adminLogin.css";

export default function AdminLogin() {
  const { adminLogin } = useAdmin();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Preenche todos os campos."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const ok = adminLogin(form.email, form.password);
    setLoading(false);
    if (!ok) setError("Credenciais inválidas. Tenta novamente.");
  }

  return (
    <div className="al-root">
      <div className="al-card">
        <div className="al-logo">
          <ShieldCheck size={28} />
        </div>
        <h1>Área de Administração</h1>
        <p>Acesso restrito ao gestor do portal STP Verde.</p>

        {error && <div className="al-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate className="al-form">
          <div className="al-field">
            <label htmlFor="al-email">Email de administrador</label>
            <div className="al-input-wrap">
              <Mail size={16} className="al-icon" />
              <input id="al-email" type="email" placeholder="admin@stpverde.st"
                value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
          <div className="al-field">
            <label htmlFor="al-pass">Palavra-passe</label>
            <div className="al-input-wrap">
              <Lock size={16} className="al-icon" />
              <input id="al-pass" type={showPass ? "text" : "password"} placeholder="••••••••"
                value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
              <button type="button" className="al-eye" onClick={() => setShowPass((v) => !v)}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button type="submit" className="al-submit" disabled={loading}>
            {loading ? <span className="al-spinner" /> : <><ShieldCheck size={16} /> Entrar no painel</>}
          </button>
        </form>

        <p className="al-hint">
          Credenciais de demo: <code>admin@stpverde.st</code> / <code>admin2024</code>
        </p>
      </div>
    </div>
  );
}
