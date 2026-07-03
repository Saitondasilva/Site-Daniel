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
    title: "Alojamento",
    tagline: "Estadias com conforto, charme local e vista para o Atlântico.",
    icon: Hotel,
    heroImage: "/images/praia-verde-stp.jpg",
    description: "De resorts de luxo a eco-lodges na floresta, São Tomé e Príncipe oferece alojamentos únicos para todos os tipos de viajante.",
    services: [
      {
        id: "hoteis",
        name: "Hotéis",
        description: "Conforto completo para explorar a capital e a costa.",
        icon: Hotel,
        label: "Mais procurado",
        listings: [
          { id: "mucumbri", nome: "Mucumbri", tipo: "Resort 5★", local: "São Tomé ", descricao: "O resort mais aconchegante da ilha, com piscina convidativa e jardins tropicais exuberantes.", destaque: "Piscina infinita com vista mar", avaliacao: 4.9, avaliacoes: 312, preco: "Desde 180€/noite", tags: ["Piscina", "Spa", "Restaurante", "Wi-Fi", "AC"], contacto: { tel: "+239 222 1234", email: "reservas@omali.st", web: "omali.st" }, featured: true },
         
        ],
      },
      {
        id: "resorts",
        name: "Resorts",
        description: "Dias sem pressa entre praia, piscina e boa mesa.",
        icon: Palmtree,
        label: "Premium",
        listings: [
          { id: "bom-bom", nome: "Bom Bom Island Resort", tipo: "Resort boutique", local: "Ilha do Príncipe", descricao: "Um resort isolado no extremo norte do Príncipe, acessível apenas de barco. Bangalôs sobre a água, mergulho de classe mundial e silêncio absoluto.", destaque: "Bangalôs sobre a água", avaliacao: 5.0, avaliacoes: 143, preco: "Desde 350€/noite", tags: ["Isolado", "Mergulho", "All-inclusive", "Natureza"], contacto: { tel: "+239 225 1111", email: "info@bombom.st", web: "bombomisland.com" }, featured: true },
          { id: "sundy", nome: "Roça Sundy", tipo: "Eco-resort histórico", local: "Príncipe Norte", descricao: "Instalado numa roça do século XIX dentro da Reserva da Biosfera da UNESCO. Arquitectura colonial restaurada, floresta primária e gastronomia km zero.", destaque: "Reserva da Biosfera UNESCO", avaliacao: 4.8, avaliacoes: 201, preco: "Desde 220€/noite", tags: ["UNESCO", "Histórico", "Eco", "Gastronomia"], contacto: { tel: "+239 225 2222", email: "reservas@sundy.st", web: "rocasundy.com" }, featured: true },
        ],
      },
      {
        id: "guesthouses",
        name: "Guesthouses",
        description: "Acolhimento familiar com alma santomense.",
        icon: Home,
        label: "Autêntico",
        listings: [
          { id: "casa-lilás", nome: "Casa Lilás", tipo: "Guesthouse", local: "São Tomé cidade", descricao: "Pequena guesthouse familiar no bairro histórico de São Tomé. Pequeno-almoço com produtos locais, proprietários simpáticos e dicas genuínas sobre a ilha.", destaque: "Pequeno-almoço local incluído", avaliacao: 4.6, avaliacoes: 84, preco: "Desde 45€/noite", tags: ["Familiar", "Centro", "Pequeno-almoço", "Autêntico"], contacto: { tel: "+239 222 7788", email: "casalilas@gmail.com", web: "" }, featured: true },
          { id: "quinta-tropical", nome: "Quinta Tropical", tipo: "Guesthouse rural", local: "Monte Café", descricao: "Quinta nos arredores de Monte Café, rodeada de cacaueiros e bananeiras. Quartos amplos, silêncio absoluto e visitas às plantações incluídas.", destaque: "No coração das plantações", avaliacao: 4.4, avaliacoes: 56, preco: "Desde 55€/noite", tags: ["Rural", "Plantações", "Tranquilo", "Natureza"], contacto: { tel: "+239 222 9900", email: "quintatropical@st.net", web: "" }, featured: false },
        ],
      },
      {
        id: "eco-lodges",
        name: "Eco-lodges",
        description: "Natureza, silêncio e baixa pegada ambiental.",
        icon: TentTree,
        label: "Eco",
        listings: [
          { id: "boa-vista-eco", nome: "Boa Vista Eco Lodge", tipo: "Eco-lodge", local: "Floresta do Sul", descricao: "Lodge sustentável construído com materiais locais no interior da floresta equatorial. Energia solar, água da nascente e trilhos privados com guia incluído.", destaque: "100% energia solar", avaliacao: 4.7, avaliacoes: 78, preco: "Desde 95€/noite", tags: ["Solar", "Floresta", "Trilhos", "Sustentável", "Guia"], contacto: { tel: "+239 222 6677", email: "ecolodge@boavista.st", web: "boavistaeco.st" }, featured: true },
        ],
      },
    ],
    parceiros: [
      { nome: "Omali Lodge", tipo: "Resort 5★", local: "São Tomé cidade", destaque: "O mais icónico da ilha" },
      { nome: "Pestana São Tomé", tipo: "Hotel 4★", local: "Praia Lagoa Azul", destaque: "Vista mar incrível" },
      { nome: "Bom Bom Island Resort", tipo: "Resort boutique", local: "Príncipe", destaque: "Isolamento total" },
    ],
  },
  {
    id: "transporte",
    title: "Transporte",
    tagline: "Chegadas simples, rotas fluidas e liberdade para descobrir.",
    icon: Car,
    heroImage: "/images/forte-sao-sebastiao.jpg",
    description: "Explorar São Tomé e Príncipe é mais fácil quando tens o transporte certo.",
    services: [
      {
        id: "aluguer-viaturas",
        name: "Aluguer de viaturas",
        description: "Explora miradouros, roças e praias ao teu ritmo.",
        icon: Car,
        label: "Essencial",
        listings: [
          { id: "stp-rent", nome: "STP Rent-a-Car", tipo: "Aluguer de viaturas", local: "Aeroporto São Tomé", descricao: "A maior frota da ilha: Toyota Land Cruiser 4x4, Suzuki Jimny, e viaturas económicas. Entrega no aeroporto ou hotel. Seguro incluído.", destaque: "Entrega no aeroporto", avaliacao: 4.6, avaliacoes: 203, preco: "Desde 45€/dia", tags: ["4x4", "Aeroporto", "Seguro incluído", "GPS"], contacto: { tel: "+239 222 1100", email: "rent@stprent.st", web: "stprent.st" }, featured: true },
          { id: "ilha-cars", nome: "Ilha Cars", tipo: "Aluguer de viaturas", local: "São Tomé cidade", descricao: "Empresa local com preços competitivos. Especialista em viaturas todo-o-terreno para explorar as estradas de terra da ilha.", destaque: "Melhor preço garantido", avaliacao: 4.3, avaliacoes: 118, preco: "Desde 35€/dia", tags: ["4x4", "Económico", "Local"], contacto: { tel: "+239 222 3322", email: "ilhacars@gmail.com", web: "" }, featured: false },
        ],
      },
      {
        id: "transfers-aeroporto",
        name: "Transfers aeroporto-hotel",
        description: "Receção tranquila logo na chegada.",
        icon: Plane,
        label: "Rápido",
        listings: [
          { id: "atlantic-transfers", nome: "Atlantic Transfers", tipo: "Transfers privados", local: "Toda a ilha", descricao: "Transfers privados 24h entre o aeroporto e qualquer alojamento da ilha. Viaturas AC, Wi-Fi a bordo e motorista que conhece cada canto de STP.", destaque: "Disponível 24h", avaliacao: 4.8, avaliacoes: 167, preco: "Desde 25€/transfer", tags: ["24h", "AC", "Wi-Fi", "Privado"], contacto: { tel: "+239 222 5566", email: "booking@atlantic-stp.st", web: "atlanticstp.st" }, featured: true },
        ],
      },
      {
        id: "transporte-maritimo",
        name: "Transporte marítimo",
        description: "Ligações entre ilhas e passeios costeiros.",
        icon: Ship,
        label: "Ilhas",
        listings: [
          { id: "navetur", nome: "Navetur", tipo: "Transporte marítimo", local: "Porto Ana Chaves", descricao: "Ligação regular entre São Tomé e o Príncipe em lancha rápida (2h) e ferry (6h). Também opera passeios costeiros e visitas às ilhéus das Rolas e Bombom.", destaque: "Única ligação inter-ilhas", avaliacao: 4.4, avaliacoes: 134, preco: "Desde 60€/pessoa", tags: ["Inter-ilhas", "Ferry", "Lancha"], contacto: { tel: "+239 222 0099", email: "navetur@st.net", web: "navetur.st" }, featured: true },
        ],
      },
    ],
    parceiros: [
      { nome: "STP Rent-a-Car", tipo: "Aluguer de viaturas", local: "Aeroporto São Tomé", destaque: "Frota 4x4 e económica" },
      { nome: "Atlantic Transfers", tipo: "Transfers privados", local: "Toda a ilha", destaque: "24h disponível" },
      { nome: "Navetur", tipo: "Transporte marítimo", local: "Porto Ana Chaves", destaque: "Ligação às ilhéus" },
    ],
  },
  {
    id: "tours",
    title: "Excursões e Tours",
    tagline: "Roteiros culturais, históricos e naturais com guias locais.",
    icon: Binoculars,
    heroImage: "/images/pico-cao-grande.webp",
    description: "Das roças coloniais às cascatas escondidas na floresta equatorial.",
    services: [
      {
        id: "passeios-sao-tome",
        name: "Passeios ilha São Tomé",
        description: "Cascatas, praias, mercados e histórias vivas.",
        icon: Map,
        label: "Top",
        listings: [
          { id: "stp-experience", nome: "STP Experience", tipo: "Operador turístico", local: "São Tomé", descricao: "Tours de dia inteiro pela ilha grande: Pico Cão Grande, Cascata São Nicolau, Praia Jalé e Roça Monte Café. Grupos pequenos, guia bilíngue e almoço incluído.", destaque: "Grupos máx. 8 pessoas", avaliacao: 4.9, avaliacoes: 267, preco: "Desde 55€/pessoa", tags: ["Guia PT/EN", "Almoço", "Transporte", "Pequeno grupo"], contacto: { tel: "+239 222 8800", email: "tours@stpexp.st", web: "stpexperience.st" }, featured: true },
          { id: "tropical-tours", nome: "Tropical Tours STP", tipo: "Agência de turismo", local: "São Tomé", descricao: "Roteiros personalizados de 1 a 7 dias pela ilha. Do litoral à floresta, das roças aos miradouros. Transporte 4x4 e guia local certificado.", destaque: "Roteiros totalmente personalizados", avaliacao: 4.7, avaliacoes: 143, preco: "Desde 45€/pessoa", tags: ["Personalizado", "4x4", "Certificado"], contacto: { tel: "+239 222 9988", email: "info@tropicaltours.st", web: "" }, featured: false },
        ],
      }, 
      {
        id: "trilhos-caminhadas",
        name: "Trilhos e caminhadas guiadas",
        description: "Percursos na floresta tropical e nos picos.",
        icon: Mountain,
        label: "Aventura",
        listings: [
          { id: "peak-stp", nome: "Peak STP", tipo: "Caminhadas guiadas", local: "São Tomé", descricao: "Especialistas em trilhos de montanha. Subida ao Pico de São Tomé (2024m), o ponto mais alto da ilha, com guia certificado. Dificuldade moderada a alta.", destaque: "Pico de São Tomé 2024m", avaliacao: 4.8, avaliacoes: 112, preco: "Desde 65€/pessoa", tags: ["Pico", "Certificado", "Equipamento", "Fotografia"], contacto: { tel: "+239 222 1155", email: "trekking@peakstp.st", web: "peakstp.st" }, featured: true },
        ],
      },
      {
        id: "observacao-aves",
        name: "Observação de aves",
        description: "Espécies raras e endémicas com especialistas.",
        icon: Binoculars,
        label: "Natureza",
        listings: [
          { id: "birding-stp", nome: "Birding STP", tipo: "Birdwatching especializado", local: "Toda a ilha", descricao: "STP tem 28 espécies de aves endémicas — a maior densidade endémica de África. Tours de 1 a 5 dias com ornitólogo residente e equipamento óptico profissional.", destaque: "28 espécies endémicas", avaliacao: 4.9, avaliacoes: 76, preco: "Desde 80€/pessoa", tags: ["Endémicas", "Ornitólogo", "Binóculos", "Fotografia"], contacto: { tel: "+239 222 6644", email: "birds@birdingstp.st", web: "birdingstp.st" }, featured: true },
        ],
      },
      {
        id: "visitas-plantacoes",
        name: "Visitas a plantações",
        description: "Cacau e café da origem ao sabor.",
        icon: Coffee,
        label: "Sensorial",
        listings: [
          { id: "roca-cafe", nome: "Roça Monte Café", tipo: "Agro-turismo", local: "Monte Café", descricao: "A maior plantação de café de STP, do século XIX. Visita guiada às instalações, degustação de café e cacau e jantar com receitas da roça.", destaque: "Plantação histórica século XIX", avaliacao: 4.7, avaliacoes: 134, preco: "Desde 35€/pessoa", tags: ["Café", "Cacau", "Jantar", "Histórico"], contacto: { tel: "+239 222 7722", email: "visitas@montecafe.st", web: "montecafe.st" }, featured: true },
          { id: "corallo", nome: "Claudio Corallo", tipo: "Chocolate bean-to-bar", local: "Roça São João", descricao: "Prova do cacau mais premiado do mundo, cultivado e transformado em STP. Visita às plantações, explicação do processo e degustação de chocolates 75%–100%.", destaque: "Cacau premiado mundialmente", avaliacao: 5.0, avaliacoes: 201, preco: "Desde 25€/pessoa", tags: ["Chocolate", "Bean-to-bar", "Premium", "Degustação"], contacto: { tel: "+239 222 8833", email: "visitas@corallo.st", web: "corallo.st" }, featured: true },
        ],
      },
    ],
    parceiros: [
      { nome: "STP Experience", tipo: "Operador turístico", local: "São Tomé", destaque: "Tours exclusivos" },
      { nome: "Birding STP", tipo: "Observação de aves", local: "Toda a ilha", destaque: "Espécies endémicas" },
    ],
  },
  {
    id: "natureza",
    title: "Natureza e Aventura",
    tagline: "Mar, floresta, cascatas e experiências para respirar fundo.",
    icon: Waves,
    heroImage: "/images/praia-verde-stp.jpg",
    description: "STP é um paraíso natural entre o Atlântico e a floresta equatorial.",
    services: [
      {
        id: "mergulho",
        name: "Mergulho",
        description: "Fundos marinhos quentes, vivos e coloridos.",
        icon: Waves,
        label: "Azul",
        listings: [
          { id: "stp-dive", nome: "STP Dive Center", tipo: "Centro de mergulho PADI", local: "Praia das Conchas", descricao: "Centro PADI 5★ com instrutores certificados. Cursos de Open Water, Advanced e Divemaster. Mergulhos diários em 20+ pontos ao redor da ilha com visibilidade até 30m.", destaque: "PADI 5★ — visibilidade 30m", avaliacao: 4.9, avaliacoes: 189, preco: "Desde 50€/mergulho", tags: ["PADI", "Certificação", "Barco", "Equipamento"], contacto: { tel: "+239 222 5500", email: "dive@stpdive.st", web: "stpdive.st" }, featured: true },
        ],
      },
      {
        id: "tartarugas",
        name: "Observação de tartarugas",
        description: "Momentos sazonais guiados com respeito.",
        icon: Sparkles,
        label: "Especial",
        listings: [
          { id: "tartaruga-stp", nome: "Tartaruga STP", tipo: "Ecoturismo marino", local: "Praia Jalé", descricao: "Programa de conservação e avistamento de tartarugas marinhas na Praia Jalé. Saídas noturnas de Julho a Fevereiro, quando as tartarugas desovam. 100% dos lucros vão para a conservação.", destaque: "100% para conservação", avaliacao: 5.0, avaliacoes: 112, preco: "Desde 30€/pessoa", tags: ["Conservação", "Noturno", "Sazonal", "Responsável"], contacto: { tel: "+239 222 8811", email: "info@tartarugastp.st", web: "tartarugastp.st" }, featured: true },
        ],
      },
      {
        id: "cascatas-trilhos",
        name: "Cascatas e trilhos",
        description: "Banhos naturais e caminhos na floresta.",
        icon: Mountain,
        label: "Selvagem",
        listings: [
          { id: "waterfall-stp", nome: "Waterfalls STP", tipo: "Trilhos e cascatas", local: "Sul da ilha", descricao: "Trilhos guiados às principais cascatas da ilha: São Nicolau (20m), Bombaim e Malanza. Banho em piscinas naturais, picnic na floresta e regresso por trilho diferente.", destaque: "Banho em piscinas naturais", avaliacao: 4.8, avaliacoes: 156, preco: "Desde 40€/pessoa", tags: ["Cascatas", "Piscinas", "Picnic", "Floresta"], contacto: { tel: "+239 222 3388", email: "info@waterfallstp.st", web: "" }, featured: true },
        ],
      },
    ],
    parceiros: [
      { nome: "STP Dive Center", tipo: "Centro de mergulho", local: "Praia das Conchas", destaque: "PADI certificado" },
      { nome: "Tartaruga STP", tipo: "Ecoturismo", local: "Praia Piscina", destaque: "Proteção e avistamento" },
    ],
  },
  {
    id: "gastronomia",
    title: "Gastronomia",
    tagline: "Sabores tropicais, chocolate fino e cozinha com memória.",
    icon: Utensils,
    heroImage: "/images/forte-sao-sebastiao.jpg",
    description: "A cozinha santomense é uma fusão rica de influências africanas e portuguesas.",
    services: [
      {
        id: "restaurantes",
        name: "Restaurantes",
        description: "Peixe fresco, fruta tropical e pratos de assinatura.",
        icon: Utensils,
        label: "Sabor",
        listings: [
          { id: "marquesrestaurante", nome: "Restaurante Marquês", tipo: "Restaurante local", local: "São Tomé cidade", descricao: "O restaurante mais emblemático da capital. Calulu de peixe, lagosta grelhada e fruta tropical colhida no dia. Terraço com vista para a Baía de Ana Chaves.", destaque: "Calulu e lagosta local", avaliacao: 4.8, avaliacoes: 234, preco: "20-40€/pessoa", tags: ["Peixe", "Lagosta", "Vista mar", "Almoço/jantar"], contacto: { tel: "+239 222 2211", email: "marquesrest@gmail.com", web: "" }, featured: true },
          { id: "claudios", nome: "Claudio's Beach Bar", tipo: "Beach restaurant", local: "Praia das Conchas", descricao: "Pés na areia, barracudas grelhadas no carvão e caipirinha de fruta tropical. O melhor pôr do sol de STP visto daqui.", destaque: "Pés na areia com vista mar", avaliacao: 4.7, avaliacoes: 178, preco: "15-30€/pessoa", tags: ["Praia", "Grelhados", "Cocktails", "Pôr do sol"], contacto: { tel: "+239 222 3311", email: "", web: "" }, featured: true },
          { id: "rooftop-miramar", nome: "Rooftop do Miramar", tipo: "Restaurante panorâmico", local: "São Tomé cidade", descricao: "Restaurante no topo do Hotel Miramar com vista 360° sobre a capital e a baía. Fusão santomense-portuguesa com carta de vinhos seleccionada.", destaque: "Vista 360° da capital", avaliacao: 4.5, avaliacoes: 112, preco: "30-55€/pessoa", tags: ["Panorâmico", "Fusão", "Vinhos", "Jantar"], contacto: { tel: "+239 222 0011", email: "rooftop@miramar.st", web: "" }, featured: false },
        ],
      },
      {
        id: "experiencias-locais",
        name: "Experiências locais",
        description: "Mesas partilhadas, mercados e receitas da ilha.",
        icon: ChefHat,
        label: "Imersivo",
        listings: [
          { id: "mesa-partilhada", nome: "Mesa Partilhada STP", tipo: "Jantar comunitário", local: "Bairro Riboque", descricao: "Janta na casa de uma família santomense. Menu tradicional: caldeirada de peixe, matata de amêijoa e banana frita. Reserva obrigatória.", destaque: "Jantar em família local", avaliacao: 5.0, avaliacoes: 67, preco: "Desde 30€/pessoa", tags: ["Autêntico", "Família", "Tradicional", "Reserva"], contacto: { tel: "+239 222 9977", email: "mesa@stplocal.st", web: "" }, featured: true },
        ],
      },
      {
        id: "degustacoes-chocolate",
        name: "Degustações de chocolate",
        description: "Cacau santomense em provas comentadas.",
        icon: Coffee,
        label: "Cacau",
        listings: [
          { id: "cacau-cia", nome: "Cacau & Cia", tipo: "Degustação bean-to-bar", local: "Roça São João", descricao: "Prova comentada de 8 tabletes de chocolate de origem STP, de 55% a 100% cacau. Com visita à plantação, explicação do processo e loja.", destaque: "Do cacaueiro à tablete", avaliacao: 4.9, avaliacoes: 145, preco: "Desde 20€/pessoa", tags: ["Bean-to-bar", "Visita", "Loja", "Premium"], contacto: { tel: "+239 222 8866", email: "prova@cacauecia.st", web: "cacauecia.st" }, featured: true },
        ],
      },
    ],
    parceiros: [
      { nome: "Restaurante Marquês", tipo: "Restaurante", local: "São Tomé cidade", destaque: "Frutos do mar locais" },
      { nome: "Cacau & Cia", tipo: "Degustação de chocolate", local: "Roça São João", destaque: "Bean-to-bar" },
    ],
  },
  {
    id: "eventos",
    title: "Eventos",
    tagline: "Momentos especiais desenhados com paisagem, cuidado e equipa.",
    icon: Camera,
    heroImage: "/images/praia-verde-stp.jpg",
    description: "Casar numa praia deserta de STP, celebrar a lua de mel numa roça histórica.",
    services: [
      {
        id: "casamentos",
        name: "Casamentos",
        description: "Cerimónias à beira-mar ou em roças históricas.",
        icon: Heart,
        label: "Romântico",
        listings: [
          { id: "stp-wedding", nome: "STP Wedding Planner", tipo: "Organização de casamentos", local: "São Tomé", descricao: "Especialistas em casamentos em destino. Tratam de tudo: licenças, florists, catering, músicos locais e lua de mel. Parceiros nos melhores resorts da ilha.", destaque: "Tudo incluído num contacto", avaliacao: 5.0, avaliacoes: 43, preco: "Consulta gratuita", tags: ["Destination wedding", "All-inclusive", "Praia", "Roças"], contacto: { tel: "+239 222 1199", email: "hello@stpwedding.st", web: "stpwedding.st" }, featured: true },
        ],
      },
      {
        id: "lua-de-mel",
        name: "Lua de mel",
        description: "Roteiros íntimos, praia e experiências privadas.",
        icon: Sparkles,
        label: "A dois",
        listings: [
          { id: "honeymoon-stp", nome: "Honeymoon STP", tipo: "Pacotes lua de mel", local: "São Tomé e Príncipe", descricao: "Pacotes de lua de mel de 7 a 14 noites combinando as duas ilhas. Inclui voos inter-ilhas, alojamento premium, jantar privado na praia e spa.", destaque: "7 noites nas duas ilhas", avaliacao: 4.9, avaliacoes: 61, preco: "Desde 2400€/casal", tags: ["Premium", "Privado", "Spa", "Jantar na praia"], contacto: { tel: "+239 222 1199", email: "honeymoon@stpwedding.st", web: "" }, featured: true },
        ],
      },
      {
        id: "eventos-corporativos",
        name: "Eventos corporativos",
        description: "",
        icon: Building2,
        label: "Business",
        listings: [
          { id: "stp-incentive", nome: "STP Incentive Travel", tipo: "Turismo corporativo", local: "São Tomé", descricao: "Organização de retiros corporativos, team buildings e programas de incentivo. Parceiros nos melhores hotéis com salas de reunião e actividades outdoor.", destaque: "Team building na floresta tropical", avaliacao: 4.6, avaliacoes: 28, preco: "Sob consulta", tags: ["Team building", "Retiro", "Reuniões", "Incentivo"], contacto: { tel: "+239 222 0088", email: "corporate@stpincentive.st", web: "" }, featured: false },
        ],
      },
    ],
    parceiros: [
      { nome: "STP Wedding Planner", tipo: "Organização de eventos", local: "São Tomé", destaque: "Especialistas em destino" },
      { nome: "Foto & Mar", tipo: "Fotografia", local: "Toda a ilha", destaque: "Reportagem de viagem" },
    ],
  },
  {
    id: "guias",
    title: "Guias Especializados",
    tagline: "Apoio humano para viagens mais simples e bem aproveitadas.",
    icon: Compass,
    heroImage: "/images/pico-cao-grande.webp",
    description: "Um bom guia local transforma uma visita numa experiência.",
    services: [
      {
        id: "guias-certificados",
        name: "Guias certificados",
        description: "Conhecimento local, segurança e boas histórias.",
        icon: Compass,
        label: "Pro",
        listings: [
          { id: "joao-guia", nome: "João Guia STP", tipo: "Guia certificado", local: "São Tomé", descricao: "15 anos a guiar turistas pelos segredos de STP. Trilhos de montanha, visitas a roças e tours urbanos em português, inglês e francês. Disponível para grupos e individuais.", destaque: "PT · EN · FR — 15 anos", avaliacao: 5.0, avaliacoes: 187, preco: "Desde 60€/dia", tags: ["PT/EN/FR", "Montanha", "Roças", "Urbano"], contacto: { tel: "+239 999 1234", email: "joao@guiastp.st", web: "" }, featured: true },
          { id: "fatima-guia", nome: "Fátima — Guia Cultural", tipo: "Guia cultural certificada", local: "São Tomé", descricao: "Especialista na história colonial e na cultura Forro. Tours ao Museu Nacional, antigas roças e o mercado central. Única guia credenciada para visitas escolares.", destaque: "Especialista em cultura Forro", avaliacao: 4.9, avaliacoes: 134, preco: "Desde 50€/dia", tags: ["Cultural", "Museu", "Forro", "Escolas"], contacto: { tel: "+239 999 5678", email: "fatima@guiastp.st", web: "" }, featured: false },
        ],
      },
      {
        id: "traducao",
        name: "Tradução e interpretação",
        description: "Apoio linguístico para grupos e visitas.",
        icon: Languages,
        label: "Apoio",
        listings: [
          { id: "stp-lingua", nome: "STP Língua", tipo: "Serviços de tradução", local: "São Tomé cidade", descricao: "Tradutores e intérpretes para visitas, reuniões e eventos. Português, inglês, francês e crioulo forro. Disponibilidade em 24h.", destaque: "Crioulo forro disponível", avaliacao: 4.5, avaliacoes: 47, preco: "Desde 35€/hora", tags: ["PT/EN/FR", "Forro", "Reuniões", "24h"], contacto: { tel: "+239 222 5544", email: "hello@stplingua.st", web: "" }, featured: false },
        ],
      },
      {
        id: "planeamento",
        name: "Planeamento personalizado",
        description: "Roteiros feitos à medida do teu ritmo.",
        icon: Map,
        label: "Tailor-made",
        listings: [
          { id: "stp-tailor", nome: "STP Tailor Travel", tipo: "Agência tailor-made", local: "São Tomé", descricao: "Constroem o teu roteiro de raiz: alojamento, actividades, transporte e restaurantes. Do mochileiro ao viajante de luxo, cada viagem é única.", destaque: "Do mochileiro ao luxo", avaliacao: 4.8, avaliacoes: 92, preco: "Consulta grátis", tags: ["Tailor-made", "Completo", "Todos os orçamentos"], contacto: { tel: "+239 222 3366", email: "plan@stptravel.st", web: "stptailortravel.st" }, featured: true },
        ],
      },
      {
        id: "concierge",
        name: "Concierge turístico",
        description: "Reservas, contactos e soluções durante a estadia.",
        icon: Sparkles,
        label: "VIP",
        listings: [
          { id: "stp-concierge", nome: "STP Concierge", tipo: "Concierge de viagem", local: "São Tomé cidade", descricao: "Serviço de concierge pessoal durante toda a tua estadia. Reservas de restaurantes, bilhetes, transporte, guias e resolução de imprevistos. Contacto directo 24h.", destaque: "Contacto directo 24h", avaliacao: 4.9, avaliacoes: 78, preco: "Desde 80€/semana", tags: ["24h", "Reservas", "VIP", "Pessoal"], contacto: { tel: "+239 999 9900", email: "vip@stpconcierge.st", web: "" }, featured: true },
        ],
      },
    ],
    parceiros: [
      { nome: "João Guia STP", tipo: "Guia certificado", local: "São Tomé", destaque: "15 anos de experiência" },
      { nome: "STP Concierge", tipo: "Concierge turístico", local: "São Tomé cidade", destaque: "Apoio 24h" },
    ],
  },
  {
    id: "artesanato",
    title: "Comércio e Artesanato",
    tagline: "Produtos locais que levam a ilha contigo.",
    icon: Gift,
    heroImage: "/images/forte-sao-sebastiao.jpg",
    description: "O artesanato santomense é vivo e autêntico.",
    services: [
      {
        id: "artesanato-local",
        name: "Artesanato local",
        description: "Peças feitas à mão por criadores santomenses.",
        icon: Gift,
        label: "Local",
        listings: [
          { id: "mercado-povo", nome: "Mercado do Povo", tipo: "Mercado de artesanato", local: "São Tomé cidade", descricao: "O maior mercado de artesanato da ilha com mais de 80 artesãos locais. Esculturas em madeira de pau-preto, têxteis coloridos, cestas e pinturas. Aberto todos os dias.", destaque: "80+ artesãos locais", avaliacao: 4.5, avaliacoes: 267, preco: "Entrada livre", tags: ["Escultura", "Têxteis", "Pinturas", "Diário"], contacto: { tel: "+239 222 1100", email: "", web: "" }, featured: true },
          { id: "galeria-stp", nome: "Galeria STP Arte", tipo: "Galeria de arte contemporânea", local: "São Tomé cidade", descricao: "Galeria de arte contemporânea com obras de artistas santomenses. Pinturas, esculturas e instalações inspiradas no arquipélago. Envio internacional disponível.", destaque: "Arte contemporânea local", avaliacao: 4.7, avaliacoes: 89, preco: "Entrada livre", tags: ["Arte", "Contemporâneo", "Envio", "Coleccionismo"], contacto: { tel: "+239 222 8844", email: "galeria@stparte.st", web: "stparte.st" }, featured: true },
        ],
      },
      {
        id: "cacau-chocolate",
        name: "Cacau e chocolate",
        description: "Tabletes, nibs e produtos de origem.",
        icon: Coffee,
        label: "Origem",
        listings: [
          { id: "corallo-loja", nome: "Claudio Corallo — Loja", tipo: "Chocolate premium", local: "São Tomé cidade", descricao: "A loja do produtor de chocolate mais premiado de STP. Tabletes 70%, 75% e 100%, nibs de cacau, cascas e infusões. Embalagem para oferta disponível.", destaque: "Premiado internacionalmente", avaliacao: 5.0, avaliacoes: 312, preco: "5€-25€/tablete", tags: ["Premium", "100% STP", "Oferta", "Nibs"], contacto: { tel: "+239 222 8833", email: "loja@corallo.st", web: "corallo.st" }, featured: true },
        ],
      },
      {
        id: "souvenirs",
        name: "Souvenirs",
        description: "Lembranças leves para família e amigos.",
        icon: Store,
        label: "Presente",
        listings: [
          { id: "loja-stp", nome: "Loja STP", tipo: "Loja de souvenirs", local: "Aeroporto e centro", descricao: "Artigos de STP para levar na bagagem: t-shirts, canecas, postais, especiarias locais e miniaturas do Pico Cão Grande. Duas lojas: aeroporto e centro histórico.", destaque: "No aeroporto e no centro", avaliacao: 4.2, avaliacoes: 134, preco: "2€-30€", tags: ["Aeroporto", "T-shirts", "Especiarias", "Miniaturas"], contacto: { tel: "+239 222 0022", email: "lojastp@gmail.com", web: "" }, featured: false },
        ],
      },
      {
        id: "arte-local",
        name: "Arte local",
        description: "Pintura, escultura e design inspirado no arquipélago.",
        icon: Sparkles,
        label: "Criativo",
        listings: [
          { id: "atelier-stp", nome: "Ateliê STP", tipo: "Ateliê de artistas", local: "São Tomé cidade", descricao: "Ateliê coletivo de 12 artistas plásticos santomenses. Visitas guiadas ao espaço criativo, obras à venda e encomendas personalizadas. Sessões de arte open studio ao sábado.", destaque: "Open studio ao sábado", avaliacao: 4.8, avaliacoes: 56, preco: "Entrada livre", tags: ["Ateliê", "Visitas", "Encomendas", "Sábado"], contacto: { tel: "+239 222 7766", email: "atelier@stparte.st", web: "" }, featured: true },
        ],
      },
    ],
    parceiros: [
      { nome: "Mercado do Povo", tipo: "Mercado de artesanato", local: "São Tomé cidade", destaque: "O maior da ilha" },
      { nome: "Claudio Corallo", tipo: "Chocolate bean-to-bar", local: "Roça São João", destaque: "Premiado mundialmente" },
    ],
  },
];
