// iconMap.js
// Regista todos os ícones lucide-react usáveis em categorias/serviços.
// Guardamos apenas o NOME (string) no localStorage/estado editável — os
// componentes não são serializáveis — e resolvemos para o componente real
// aqui, tanto no admin (para o seletor) como no site público (para render).
import {
  Bike, Binoculars, Building2, Camera, Car, ChefHat, Coffee,
  Compass, Fish, Gift, Heart, Home, Hotel, Landmark, Languages,
  Map, MapPin, Mountain, Music, Palmtree, Plane, Sailboat, Ship,
  Sparkles, Store, TentTree, Ticket, Utensils, Waves, Bus, Anchor,
} from "lucide-react";

export const ICONS = {
  Bike, Binoculars, Building2, Camera, Car, ChefHat, Coffee,
  Compass, Fish, Gift, Heart, Home, Hotel, Landmark, Languages,
  Map, MapPin, Mountain, Music, Palmtree, Plane, Sailboat, Ship,
  Sparkles, Store, TentTree, Ticket, Utensils, Waves, Bus, Anchor,
};

export const ICON_NAMES = Object.keys(ICONS);

// Devolve sempre um componente válido — cai num ícone genérico se o nome
// guardado não existir (ex: dado antigo ou corrompido).
export function getIcon(name) {
  return ICONS[name] || Compass;
}
