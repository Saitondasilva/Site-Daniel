// listingUtils.js
// Devolve o URL da foto a usar como "rosto" de um item (parceiro/listing):
// a primeira foto marcada como "principal", ou a primeira da galeria se
// ainda não houver nenhuma marcada assim. Devolve null se não houver fotos
// — nesse caso, quem usa isto deve continuar a mostrar a inicial do nome.
export function listingFace(listing) {
  const imgs = listing?.images || [];
  if (imgs.length === 0) return null;
  const principal = imgs.find((i) => i.tipo === "principal");
  return (principal || imgs[0]).url || null;
}
