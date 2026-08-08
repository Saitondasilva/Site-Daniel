// strapiApi.js
// Cliente para a API de Categorias fornecida pelo backend do teu colega
// (Strapi). Por agora só as Categorias vêm de lá — os restantes dados
// (serviços, parceiros, reservas, utilizadores) continuam em localStorage
// até esses endpoints existirem também.

const STRAPI_URL = "https://rock-longest-alerts-orientation.trycloudflare.com/api";

async function strapiFetch(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${STRAPI_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify({ data: body }) : undefined,
    });
  } catch (networkError) {
    throw new Error(
      "Não foi possível ligar à API de categorias. Verifica se o link continua ativo: " + STRAPI_URL
    );
  }

  let json = null;
  try { json = await res.json(); } catch (_) {}

  if (!res.ok) {
    const msg = json?.error?.message || `Erro ${res.status} na API de categorias`;
    throw new Error(msg);
  }
  return json;
}

// Converte o formato Strapi (Titulo/Descricao) para o formato usado no site
export function mapStrapiCategoria(c) {
  return {
    id: c.documentId,
    numericId: c.id,
    title: c.Titulo || "(sem título)",
    description: c.Descricao || "",
  };
}

export async function strapiListCategorias() {
  const json = await strapiFetch("/categorias");
  return (json.data || []).map(mapStrapiCategoria);
}

export async function strapiCreateCategoria({ title, description }) {
  const json = await strapiFetch("/categorias", {
    method: "POST",
    body: { Titulo: title, Descricao: description },
  });
  return mapStrapiCategoria(json.data);
}

export async function strapiUpdateCategoria(documentId, { title, description }) {
  const body = {};
  if (title !== undefined) body.Titulo = title;
  if (description !== undefined) body.Descricao = description;
  const json = await strapiFetch(`/categorias/${documentId}`, { method: "PUT", body });
  return mapStrapiCategoria(json.data);
}

export async function strapiDeleteCategoria(documentId) {
  await strapiFetch(`/categorias/${documentId}`, { method: "DELETE" });
}
