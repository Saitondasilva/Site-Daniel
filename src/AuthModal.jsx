import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, User, Mail, Lock, Phone, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import "./authModal.css";

export default function AuthModal({ onClose, onSuccess, defaultTab = "login" }) {
  const { login } = useAuth();
  const [tab, setTab] = useState(defaultTab);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  function clearError() { setError(""); }

  async function handleLogin(e) {
    e.preventDefault(); clearError();
    if (!loginForm.email || !loginForm.password) { setError("Preenche todos os campos."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem("stp_users") || "[]");
    const found = users.find((u) => u.email === loginForm.email && u.password === loginForm.password);
    setLoading(false);
    if (!found) { setError("Email ou palavra-passe incorretos."); return; }
    const { password: _, ...safe } = found;
    login(safe); onSuccess?.(); onClose();
  }

  async function handleRegister(e) {
    e.preventDefault(); clearError();
    const { name, email, phone, password, confirm } = regForm;
    if (!name || !email || !password || !confirm) { setError("Preenche todos os campos obrigatórios."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Email inválido."); return; }
    if (password.length < 6) { setError("Palavra-passe deve ter mínimo 6 caracteres."); return; }
    if (password !== confirm) { setError("As palavras-passe não coincidem."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const users = JSON.parse(localStorage.getItem("stp_users") || "[]");
    if (users.find((u) => u.email === email)) { setLoading(false); setError("Email já registado. Faz login."); return; }
    const newUser = { id: Date.now(), name, email, phone, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem("stp_users", JSON.stringify(users));
    const { password: _, ...safe } = newUser;
    login(safe); setLoading(false); onSuccess?.(); onClose();
  }

  return (
    <>
      <div className="am-backdrop" onClick={onClose} />
      <div className="am-modal" role="dialog" aria-modal="true">
        <button className="am-close" onClick={onClose} aria-label="Fechar"><X size={18} /></button>
        <div className="am-header">
          <div className="am-logo">STP</div>
          <h2>{tab === "login" ? "Bem-vindo de volta" : "Cria a tua conta"}</h2>
          <p>{tab === "login" ? "Inicia sessão para fazeres a tua reserva." : "Regista-te gratuitamente e reserva os teus serviços."}</p>
        </div>
        <div className="am-tabs">
          <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); clearError(); }}><LogIn size={15} /> Entrar</button>
          <button className={tab === "register" ? "active" : ""} onClick={() => { setTab("register"); clearError(); }}><UserPlus size={15} /> Registar</button>
        </div>
        {error && <p className="am-error">{error}</p>}

        {tab === "login" && (
          <form className="am-form" onSubmit={handleLogin} noValidate>
            <div className="am-field">
              <label htmlFor="l-email">Email</label>
              <div className="am-input-wrap">
                <Mail size={16} className="am-input-icon" />
                <input id="l-email" type="email" placeholder="o.teu@email.com" value={loginForm.email} onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))} autoComplete="email" />
              </div>
            </div>
            <div className="am-field">
              <label htmlFor="l-pass">Palavra-passe</label>
              <div className="am-input-wrap">
                <Lock size={16} className="am-input-icon" />
                <input id="l-pass" type={showPass ? "text" : "password"} placeholder="••••••••" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} autoComplete="current-password" />
                <button type="button" className="am-eye" onClick={() => setShowPass((v) => !v)}>{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
            </div>
            <button type="submit" className="am-submit" disabled={loading}>
              {loading ? <span className="am-spinner" /> : <><LogIn size={16} /> Entrar</>}
            </button>
            <p className="am-switch">Ainda não tens conta? <button type="button" onClick={() => { setTab("register"); clearError(); }}>Regista-te</button></p>
          </form>
        )}

        {tab === "register" && (
          <form className="am-form" onSubmit={handleRegister} noValidate>
            <div className="am-field">
              <label htmlFor="r-name">Nome completo <span className="am-req">*</span></label>
              <div className="am-input-wrap">
                <User size={16} className="am-input-icon" />
                <input id="r-name" type="text" placeholder="João Silva" value={regForm.name} onChange={(e) => setRegForm((p) => ({ ...p, name: e.target.value }))} autoComplete="name" />
              </div>
            </div>
            <div className="am-field">
              <label htmlFor="r-email">Email <span className="am-req">*</span></label>
              <div className="am-input-wrap">
                <Mail size={16} className="am-input-icon" />
                <input id="r-email" type="email" placeholder="o.teu@email.com" value={regForm.email} onChange={(e) => setRegForm((p) => ({ ...p, email: e.target.value }))} autoComplete="email" />
              </div>
            </div>
            <div className="am-field">
              <label htmlFor="r-phone">Telefone <span className="am-optional">(opcional)</span></label>
              <div className="am-input-wrap">
                <Phone size={16} className="am-input-icon" />
                <input id="r-phone" type="tel" placeholder="+351 912 345 678" value={regForm.phone} onChange={(e) => setRegForm((p) => ({ ...p, phone: e.target.value }))} autoComplete="tel" />
              </div>
            </div>
            <div className="am-row">
              <div className="am-field">
                <label htmlFor="r-pass">Palavra-passe <span className="am-req">*</span></label>
                <div className="am-input-wrap">
                  <Lock size={16} className="am-input-icon" />
                  <input id="r-pass" type={showPass ? "text" : "password"} placeholder="Mín. 6 caracteres" value={regForm.password} onChange={(e) => setRegForm((p) => ({ ...p, password: e.target.value }))} autoComplete="new-password" />
                  <button type="button" className="am-eye" onClick={() => setShowPass((v) => !v)}>{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                </div>
              </div>
              <div className="am-field">
                <label htmlFor="r-confirm">Confirmar <span className="am-req">*</span></label>
                <div className="am-input-wrap">
                  <Lock size={16} className="am-input-icon" />
                  <input id="r-confirm" type={showPass ? "text" : "password"} placeholder="Repetir" value={regForm.confirm} onChange={(e) => setRegForm((p) => ({ ...p, confirm: e.target.value }))} autoComplete="new-password" />
                </div>
              </div>
            </div>
            <button type="submit" className="am-submit" disabled={loading}>
              {loading ? <span className="am-spinner" /> : <><UserPlus size={16} /> Criar conta</>}
            </button>
            <p className="am-switch">Já tens conta? <button type="button" onClick={() => { setTab("login"); clearError(); }}>Entra aqui</button></p>
          </form>
        )}
      </div>
    </>
  );
}
