//categories.js
import {
  Bike, Binoculars, Building2, Camera, Car, ChefHat, Coffee,
  Compass, Fish, Gift, Heart, Home, Hotel, Landmark, Languages,
  Map, MapPin, Mountain, Palmtree, Plane, Sailboat, Ship,
  Sparkles, Store, TentTree, Utensils, Waves,
} from "lucide-react";

// ─── Estrutura de cada listing ───
// {
//   id, nome, tipo, local, descricao, destaque,
//   avaliacao (1-5), avaliacoes (nº), preco (string),
//   tags: [], contacto: { tel, email, web },
//   featured (bool)
// }

export const categories = [
  {
    id: "alojamento",
    title: "O QUE FAZEMOS",
    tagline: "Estadias com conforto, charme local e vista para o Atlântico.",
    icon: Home,
    heroImage: "/images/praia-verde-stp.jpg",
    description: "De resorts de luxo a eco-lodges na floresta, São Tomé e Príncipe oferece alojamentos únicos para todos os tipos de viajante.",
    services: [
      {
        id: "hoteis",
        name: "alojamento",
        description: "Conforto completo para explorar a capital e a costa.",
        icon: Hotel,
        label: "Mais procurado",
        image: "/images/categories/Alojamento.avif", 
        listings: [
          { id: "mucumbri", nome: "Mucumbri", tipo: "Resort 5★", local: "São Tomé ", descricao: "O resort mais aconchegante da ilha, com piscina convidativa e jardins tropicais exuberantes.", destaque: "Piscina infinita com vista mar", avaliacao: 4.9, avaliacoes: 312, preco: "Desde 180€/noite", tags: ["Piscina", "Spa", "Restaurante", "Wi-Fi", "AC"], contacto: { tel: "+239 222 1234", email: "reservas@omali.st", web: "omali.st" }, featured: true },
         
        ],
      },
      {
        id: "Transporte",
        name: "Transporte",
        description: "Dias sem pressa entre praia, piscina e boa mesa.",
        icon: Palmtree,
        label: "Premium",
        image: "/images/categories/Jimmy.jpg", 
        listings: [
          { id: "bom-bom", nome: "Bom Bom Island Resort", tipo: "Resort boutique", local: "Ilha do Príncipe", descricao: "Um resort isolado no extremo norte do Príncipe, acessível apenas de barco. Bangalôs sobre a água, mergulho de classe mundial e silêncio absoluto.", destaque: "Bangalôs sobre a água", avaliacao: 5.0, avaliacoes: 143, preco: "Desde 350€/noite", tags: ["Isolado", "Mergulho", "All-inclusive", "Natureza"], contacto: { tel: "+239 225 1111", email: "info@bombom.st", web: "bombomisland.com" }, featured: true },
          { id: "sundy", nome: "Roça Sundy", tipo: "Eco-resort histórico", local: "Príncipe Norte", descricao: "Instalado numa roça do século XIX dentro da Reserva da Biosfera da UNESCO. Arquitectura colonial restaurada, floresta primária e gastronomia km zero.", destaque: "Reserva da Biosfera UNESCO", avaliacao: 4.8, avaliacoes: 201, preco: "Desde 220€/noite", tags: ["UNESCO", "Histórico", "Eco", "Gastronomia"], contacto: { tel: "+239 225 2222", email: "reservas@sundy.st", web: "rocasundy.com" }, featured: true },
        ],
      },
      {
        id: "Escurssões",
        name: "Escurssões",
        description: "Acolhimento familiar com alma santomense.",
        icon: Home,
        label: "Autêntico",
        listings: [
          { id: "casa-lilás", nome: "Casa Lilás", tipo: "Guesthouse", local: "São Tomé cidade", descricao: "Pequena guesthouse familiar no bairro histórico de São Tomé. Pequeno-almoço com produtos locais, proprietários simpáticos e dicas genuínas sobre a ilha.", destaque: "Pequeno-almoço local incluído", avaliacao: 4.6, avaliacoes: 84, preco: "Desde 45€/noite", tags: ["Familiar", "Centro", "Pequeno-almoço", "Autêntico"], contacto: { tel: "+239 222 7788", email: "casalilas@gmail.com", web: "" }, featured: true },
          { id: "quinta-tropical", nome: "Quinta Tropical", tipo: "Guesthouse rural", local: "Monte Café", descricao: "Quinta nos arredores de Monte Café, rodeada de cacaueiros e bananeiras. Quartos amplos, silêncio absoluto e visitas às plantações incluídas.", destaque: "No coração das plantações", avaliacao: 4.4, avaliacoes: 56, preco: "Desde 55€/noite", tags: ["Rural", "Plantações", "Tranquilo", "Natureza"], contacto: { tel: "+239 222 9900", email: "quintatropical@st.net", web: "" }, featured: false },
        ],
      },
      {
        id: "Tours",
        name: "Tours",
        description: "Natureza, silêncio e baixa pegada ambiental.",
        icon: TentTree,
        label: "Eco",
        listings: [
          { id: "boa-vista-eco", nome: "Boa Vista Eco Lodge", tipo: "Eco-lodge", local: "Floresta do Sul", descricao: "Lodge sustentável construído com materiais locais no interior da floresta equatorial. Energia solar, água da nascente e trilhos privados com guia incluído.", destaque: "100% energia solar", avaliacao: 4.7, avaliacoes: 78, preco: "Desde 95€/noite", tags: ["Solar", "Floresta", "Trilhos", "Sustentável", "Guia"], contacto: { tel: "+239 222 6677", email: "ecolodge@boavista.st", web: "boavistaeco.st" }, featured: true },
        ],
      },

      {
        id: "Eventos",
        name: "Eventos",
        description: "Natureza, silêncio e baixa pegada ambiental.",
        icon: TentTree,
        label: "Eco",
        listings: [
          { id: "boa-vista-eco", nome: "Boa Vista Eco Lodge", tipo: "Eco-lodge", local: "Floresta do Sul", descricao: "Lodge sustentável construído com materiais locais no interior da floresta equatorial. Energia solar, água da nascente e trilhos privados com guia incluído.", destaque: "100% energia solar", avaliacao: 4.7, avaliacoes: 78, preco: "Desde 95€/noite", tags: ["Solar", "Floresta", "Trilhos", "Sustentável", "Guia"], contacto: { tel: "+239 222 6677", email: "ecolodge@boavista.st", web: "boavistaeco.st" }, featured: true },
        ],
      },
    ],
 
  },
 
   
];
