// api.js
// Cliente central de comunicação com o backend (Node/Express + MySQL).
// Toda a app fala com o servidor através destas funções — nada de
// localStorage para dados de negócio a partir daqui.

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiFetch(path, { method = "GET", body, token } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new Error(
      "Não foi possível ligar ao servidor. Verifica se o backend está a correr em " + API_BASE
    );
  }

  let data = null;
  try { data = await res.json(); } catch (_) { /* resposta sem corpo JSON */ }

  if (!res.ok) {
    const msg = data?.message || `Erro ${res.status} ao comunicar com o servidor`;
    const err = new Error(msg);
    err.status = res.status;
    err.details = data?.errors;
    throw err;
  }
  return data;
}

/* ─── Auth: Admin ─── */
export async function apiAdminLogin(email, password) {
  const r = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
  return r.data ? { ...r.data, token: r.token } : null;
}

/* ─── Auth: Clientes ─── */
export async function apiRegistarCliente({ nome, email, password, telefone }) {
  const r = await apiFetch("/auth/registar", { method: "POST", body: { nome, email, password, telefone } });
  return { ...r.data, token: r.token };
}

export async function apiLoginCliente(email, password) {
  const r = await apiFetch("/auth/login-cliente", { method: "POST", body: { email, password } });
  return { ...r.data, token: r.token };
}

/* ─── Categorias ─── */
export async function apiListCategorias() {
  const r = await apiFetch("/categorias");
  return r.data || [];
}
export async function apiGetCategoria(id) {
  const r = await apiFetch(`/categorias/${id}`);
  return r.data;
}
export async function apiCreateCategoria(token, body) {
  const r = await apiFetch("/categorias", { method: "POST", body, token });
  return r.data;
}
export async function apiUpdateCategoria(token, id, body) {
  const r = await apiFetch(`/categorias/${id}`, { method: "PUT", body, token });
  return r.data;
}
export async function apiToggleCategoria(token, id) {
  const r = await apiFetch(`/categorias/${id}/toggle`, { method: "PATCH", token });
  return r.data;
}
export async function apiDeleteCategoria(token, id) {
  await apiFetch(`/categorias/${id}`, { method: "DELETE", token });
}

/* ─── Serviços ─── */
export async function apiListServicosByCategoria(categoriaId) {
  const r = await apiFetch(`/servicos/categoria/${categoriaId}`);
  return r.data || [];
}
export async function apiCreateServico(token, body) {
  const r = await apiFetch("/servicos", { method: "POST", body, token });
  return r.data;
}
export async function apiUpdateServico(token, id, body) {
  const r = await apiFetch(`/servicos/${id}`, { method: "PUT", body, token });
  return r.data;
}
export async function apiDeleteServico(token, id) {
  await apiFetch(`/servicos/${id}`, { method: "DELETE", token });
}

/* ─── Parceiros ─── */
export async function apiListParceirosByServico(servicoId) {
  const r = await apiFetch(`/parceiros/servico/${servicoId}`);
  return r.data || [];
}
export async function apiCreateParceiro(token, body) {
  const r = await apiFetch("/parceiros", { method: "POST", body, token });
  return r.data;
}
export async function apiUpdateParceiro(token, id, body) {
  const r = await apiFetch(`/parceiros/${id}`, { method: "PUT", body, token });
  return r.data;
}
export async function apiDeleteParceiro(token, id) {
  await apiFetch(`/parceiros/${id}`, { method: "DELETE", token });
}

/* ─── Reservas ─── */
export async function apiCreateReserva(body) {
  const r = await apiFetch("/reservas", { method: "POST", body });
  return r.data;
}
export async function apiListReservas(token) {
  const r = await apiFetch("/reservas", { token });
  return r.data || [];
}
export async function apiUpdateReservaStatus(token, id, status) {
  const r = await apiFetch(`/reservas/${id}/status`, { method: "PATCH", body: { status }, token });
  return r.data;
}
export async function apiAprovarReserva(token, id, { mensagem_admin, sinal_valor, sinal_percentual }) {
  const r = await apiFetch(`/reservas/${id}/aprovar`, { method: "PATCH", body: { mensagem_admin, sinal_valor, sinal_percentual }, token });
  return r.data;
}
export async function apiConfirmarPagamentoReserva(token, id) {
  const r = await apiFetch(`/reservas/${id}/confirmar-pagamento`, { method: "PATCH", token });
  return r.data;
}
export async function apiClienteReportarPagamento(token, id) {
  const r = await apiFetch(`/reservas/${id}/reportar-pagamento`, { method: "PATCH", token });
  return r.data;
}
export async function apiMinhasReservas(token, { usuario_id, usuario_email } = {}) {
  const qs = new URLSearchParams();
  if (usuario_id) qs.set("usuario_id", usuario_id);
  if (usuario_email) qs.set("usuario_email", usuario_email);
  const r = await apiFetch(`/reservas/minhas?${qs.toString()}`, { token });
  return r.data || [];
}

/* ─── Utilizadores (clientes registados) ─── */
export async function apiListUtilizadores(token) {
  const r = await apiFetch("/utilizadores", { token });
  return r.data || [];
}

/* ─── Imagens de parceiro (galeria com várias fotos) ─── */
export async function apiListParceiroImagens(parceiroId) {
  const r = await apiFetch(`/parceiro-imagens/parceiro/${parceiroId}`);
  return r.data || [];
}
export async function apiAddParceiroImagem(token, parceiroId, { url, titulo, tipo, ordem }) {
  const r = await apiFetch(`/parceiro-imagens/parceiro/${parceiroId}`, { method: "POST", body: { url, titulo, tipo, ordem }, token });
  return r.data;
}
export async function apiDeleteParceiroImagem(token, id) {
  await apiFetch(`/parceiro-imagens/${id}`, { method: "DELETE", token });
}
