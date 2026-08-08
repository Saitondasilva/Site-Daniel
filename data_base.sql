-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 26/07/2026 às 21:44
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `stpverde_admin`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `administradores`
--

CREATE TABLE `administradores` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `administradores`
--

INSERT INTO `administradores` (`id`, `email`, `senha`, `nome`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin@stpverde.st', '$2a$10$s5MYF4UFc2J.0qUb/IQ41uKNu.lSKRMxdyqku5kUWY/48L/zHTZiC', 'Administrador', 'admin', '2026-07-26 18:11:28', '2026-07-26 18:11:28');

-- --------------------------------------------------------

--
-- Estrutura para tabela `admin_logs`
--

CREATE TABLE `admin_logs` (
  `id` int(11) NOT NULL,
  `administrador_id` int(11) DEFAULT NULL,
  `acao` varchar(100) NOT NULL,
  `entidade` varchar(50) NOT NULL,
  `entidade_id` varchar(50) DEFAULT NULL,
  `detalhes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detalhes`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias`
--

CREATE TABLE `categorias` (
  `id` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `tagline` varchar(200) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `cor` varchar(50) DEFAULT NULL,
  `hero_image` longtext DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `ordem` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `midias`
--

CREATE TABLE `midias` (
  `id` varchar(50) NOT NULL,
  `nome_arquivo` varchar(255) NOT NULL,
  `caminho` varchar(255) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `tamanho_bytes` int(11) DEFAULT NULL,
  `alt_text` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `parceiros`
--

CREATE TABLE `parceiros` (
  `id` varchar(50) NOT NULL,
  `servico_id` varchar(50) NOT NULL,
  `nome` varchar(200) NOT NULL,
  `slug` varchar(200) DEFAULT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `local` varchar(200) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `destaque` text DEFAULT NULL,
  `preco` varchar(100) DEFAULT NULL,
  `avaliacao` decimal(3,2) DEFAULT 4.50,
  `avaliacoes` int(11) DEFAULT 0,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `contacto` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contacto`)),
  `featured` tinyint(1) DEFAULT 0,
  `ativo` tinyint(1) DEFAULT 1,
  `horario_funcionamento` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`horario_funcionamento`)),
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `ordem` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `parceiro_imagens`
--

CREATE TABLE `parceiro_imagens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parceiro_id` varchar(50) NOT NULL,
  `url` longtext NOT NULL,
  `titulo` varchar(200) DEFAULT NULL,
  `tipo` enum('principal','galeria','destaque') DEFAULT 'galeria',
  `ordem` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_parceiro` (`parceiro_id`),
  KEY `idx_tipo` (`tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `reservas`
--

CREATE TABLE `reservas` (
  `id` varchar(50) NOT NULL,
  `usuario_id` varchar(50) DEFAULT NULL,
  `servico_id` varchar(50) DEFAULT NULL,
  `servico_nome` varchar(150) DEFAULT NULL,
  `parceiro_id` varchar(50) DEFAULT NULL,
  `parceiro_nome` varchar(200) DEFAULT NULL,
  `usuario_nome` varchar(100) NOT NULL,
  `usuario_email` varchar(100) NOT NULL,
  `usuario_telefone` varchar(50) DEFAULT NULL,
  `data_reserva` date NOT NULL,
  `hora_reserva` time NOT NULL,
  `numero_pessoas` int(11) DEFAULT 1,
  `status` enum('pendente','aprovada','confirmada','cancelada','concluida') DEFAULT 'pendente',
  `observacoes` text DEFAULT NULL,
  `mensagem_admin` text DEFAULT NULL,
  `sinal_percentual` int(11) DEFAULT 50,
  `sinal_valor` varchar(50) DEFAULT NULL,
  `sinal_pago` tinyint(1) DEFAULT 0,
  `sinal_pago_em` datetime DEFAULT NULL,
  `cliente_reportou_pagamento` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `reservas`
--

INSERT INTO `reservas` (`id`, `usuario_id`, `servico_id`, `servico_nome`, `parceiro_id`, `parceiro_nome`, `usuario_nome`, `usuario_email`, `usuario_telefone`, `data_reserva`, `hora_reserva`, `numero_pessoas`, `status`, `observacoes`, `mensagem_admin`, `sinal_percentual`, `sinal_valor`, `sinal_pago`, `sinal_pago_em`, `cliente_reportou_pagamento`, `created_at`, `updated_at`) VALUES
('res-1785094554470', NULL, NULL, NULL, NULL, NULL, 'Teste Silva', 'teste@email.com', '+239 888 7777', '2024-12-25', '19:30:00', 4, 'pendente', 'Jantar de Natal', NULL, 50, NULL, 0, NULL, 0, '2026-07-26 19:35:54', '2026-07-26 19:35:54');

-- --------------------------------------------------------

--
-- Estrutura para tabela `servicos`
--

CREATE TABLE `servicos` (
  `id` varchar(50) NOT NULL,
  `categoria_id` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `label` varchar(50) DEFAULT NULL,
  `preco` varchar(100) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `ordem` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `utilizadores`
--

CREATE TABLE `utilizadores` (
  `id` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(50) DEFAULT NULL,
  `tipo` varchar(20) DEFAULT 'cliente',
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices de tabela `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin` (`administrador_id`),
  ADD KEY `idx_entidade` (`entidade`,`entidade_id`);

--
-- Índices de tabela `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_ativo` (`ativo`),
  ADD KEY `idx_ordem` (`ordem`),
  ADD KEY `idx_slug` (`slug`);

--
-- Índices de tabela `midias`
--
ALTER TABLE `midias`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `parceiros`
--
ALTER TABLE `parceiros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_servico` (`servico_id`),
  ADD KEY `idx_featured` (`featured`),
  ADD KEY `idx_ativo` (`ativo`),
  ADD KEY `idx_avaliacao` (`avaliacao`),
  ADD KEY `idx_ordem` (`ordem`),
  ADD KEY `idx_slug` (`slug`);
ALTER TABLE `parceiros` ADD FULLTEXT KEY `idx_search` (`nome`,`descricao`,`local`);

--
-- Índices de tabela `parceiro_imagens`
--
ALTER TABLE `parceiro_imagens`
  ADD KEY `idx_ordem` (`ordem`);

--
-- Índices de tabela `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_data` (`data_reserva`),
  ADD KEY `idx_email` (`usuario_email`),
  ADD KEY `idx_usuario` (`usuario_id`),
  ADD KEY `idx_servico` (`servico_id`),
  ADD KEY `idx_parceiro` (`parceiro_id`);

--
-- Índices de tabela `servicos`
--
ALTER TABLE `servicos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_categoria` (`categoria_id`),
  ADD KEY `idx_ativo` (`ativo`),
  ADD KEY `idx_ordem` (`ordem`),
  ADD KEY `idx_slug` (`slug`);

--
-- Índices de tabela `utilizadores`
--
ALTER TABLE `utilizadores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `administradores`
--
ALTER TABLE `administradores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`administrador_id`) REFERENCES `administradores` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `parceiros`
--
ALTER TABLE `parceiros`
  ADD CONSTRAINT `parceiros_ibfk_1` FOREIGN KEY (`servico_id`) REFERENCES `servicos` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `parceiro_imagens`
--
ALTER TABLE `parceiro_imagens`
  ADD CONSTRAINT `parceiro_imagens_ibfk_1` FOREIGN KEY (`parceiro_id`) REFERENCES `parceiros` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `servicos`
--
ALTER TABLE `servicos`
  ADD CONSTRAINT `servicos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- ============================================================

-- Seed de conteúdo inicial: Alojamento, Destinos Turísticos e Pacotes Oferecidos

-- ============================================================


INSERT INTO categorias (id, nome, slug, descricao, tagline, icon, cor, hero_image, ativo, ordem) VALUES
('alojamento', 'O que fazemos', 'alojamento', 'De resorts de luxo a eco-lodges na floresta, São Tomé e Príncipe oferece alojamentos únicos para todos os tipos de viajante.', 'Estadias com conforto, charme local e vista para o Atlântico.', 'Home', NULL, '/images/praia-verde-stp.jpg', 1, 1);


INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('hoteis', 'alojamento', 'alojamento', 'hoteis', 'Conforto completo para explorar a capital e a costa.', NULL, NULL, 'Hotel', '/images/categories/Alojamento.avif', 1, 1);

INSERT INTO parceiros (id, servico_id, nome, slug, tipo, local, descricao, destaque, preco, avaliacao, avaliacoes, tags, contacto, featured, ativo) VALUES
('mucumbri', 'hoteis', 'Mucumbri', 'mucumbri', 'Resort 5★', 'São Tomé', 'O resort mais aconchegante da ilha, com piscina convidativa e jardins tropicais exuberantes.', 'Piscina infinita com vista mar', 'Desde 180€/noite', 4.9, 312, '["Piscina","Spa","Restaurante","Wi-Fi","AC"]', '{"tel":"+239 222 1234","email":"reservas@omali.st","web":"omali.st"}', 1, 1);

INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('Transporte', 'alojamento', 'Transporte', 'transporte', 'Dias sem pressa entre praia, piscina e boa mesa.', NULL, NULL, 'Palmtree', '/images/categories/Jimmy.jpg', 1, 2);

INSERT INTO parceiros (id, servico_id, nome, slug, tipo, local, descricao, destaque, preco, avaliacao, avaliacoes, tags, contacto, featured, ativo) VALUES
('bom-bom', 'Transporte', 'Bom Bom Island Resort', 'bom-bom', 'Resort boutique', 'Ilha do Príncipe', 'Um resort isolado no extremo norte do Príncipe, acessível apenas de barco. Bangalôs sobre a água, mergulho de classe mundial e silêncio absoluto.', 'Bangalôs sobre a água', 'Desde 350€/noite', 5, 143, '["Isolado","Mergulho","All-inclusive","Natureza"]', '{"tel":"+239 225 1111","email":"info@bombom.st","web":"bombomisland.com"}', 1, 1);

INSERT INTO parceiros (id, servico_id, nome, slug, tipo, local, descricao, destaque, preco, avaliacao, avaliacoes, tags, contacto, featured, ativo) VALUES
('sundy', 'Transporte', 'Roça Sundy', 'sundy', 'Eco-resort histórico', 'Príncipe Norte', 'Instalado numa roça do século XIX dentro da Reserva da Biosfera da UNESCO. Arquitectura colonial restaurada, floresta primária e gastronomia km zero.', 'Reserva da Biosfera UNESCO', 'Desde 220€/noite', 4.8, 201, '["UNESCO","Histórico","Eco","Gastronomia"]', '{"tel":"+239 225 2222","email":"reservas@sundy.st","web":"rocasundy.com"}', 1, 1);

INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('Excursoes', 'alojamento', 'Excursões', 'excursoes', 'Acolhimento familiar com alma santomense.', NULL, NULL, 'Binoculars', '/images/pico-cao-grande.webp', 1, 3);

INSERT INTO parceiros (id, servico_id, nome, slug, tipo, local, descricao, destaque, preco, avaliacao, avaliacoes, tags, contacto, featured, ativo) VALUES
('casa-lilas', 'Excursoes', 'Casa Lilás', 'casa-lilas', 'Guesthouse', 'São Tomé cidade', 'Pequena guesthouse familiar no bairro histórico de São Tomé. Pequeno-almoço com produtos locais, proprietários simpáticos e dicas genuínas sobre a ilha.', 'Pequeno-almoço local incluído', 'Desde 45€/noite', 4.6, 84, '["Familiar","Centro","Pequeno-almoço","Autêntico"]', '{"tel":"+239 222 7788","email":"casalilas@gmail.com","web":""}', 1, 1);

INSERT INTO parceiros (id, servico_id, nome, slug, tipo, local, descricao, destaque, preco, avaliacao, avaliacoes, tags, contacto, featured, ativo) VALUES
('quinta-tropical', 'Excursoes', 'Quinta Tropical', 'quinta-tropical', 'Guesthouse rural', 'Monte Café', 'Quinta nos arredores de Monte Café, rodeada de cacaueiros e bananeiras. Quartos amplos, silêncio absoluto e visitas às plantações incluídas.', 'No coração das plantações', 'Desde 55€/noite', 4.4, 56, '["Rural","Plantações","Tranquilo","Natureza"]', '{"tel":"+239 222 9900","email":"quintatropical@st.net","web":""}', 0, 1);

INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('Tours', 'alojamento', 'Tours', 'tours', 'Natureza, silêncio e baixa pegada ambiental.', NULL, NULL, 'TentTree', '/images/tours.jpg', 1, 4);

INSERT INTO parceiros (id, servico_id, nome, slug, tipo, local, descricao, destaque, preco, avaliacao, avaliacoes, tags, contacto, featured, ativo) VALUES
('boa-vista-eco-1', 'Tours', 'Boa Vista Eco Lodge', 'boa-vista-eco-1', 'Eco-lodge', 'Floresta do Sul', 'Lodge sustentável construído com materiais locais no interior da floresta equatorial. Energia solar, água da nascente e trilhos privados com guia incluído.', '100% energia solar', 'Desde 95€/noite', 4.7, 78, '["Solar","Floresta","Trilhos","Sustentável","Guia"]', '{"tel":"+239 222 6677","email":"ecolodge@boavista.st","web":"boavistaeco.st"}', 1, 1);

INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('Eventos', 'alojamento', 'Eventos', 'eventos', 'Cultura e tradição santomense em cada evento.', NULL, NULL, 'Ticket', '/images/tchiloli.jpg', 1, 5);

INSERT INTO parceiros (id, servico_id, nome, slug, tipo, local, descricao, destaque, preco, avaliacao, avaliacoes, tags, contacto, featured, ativo) VALUES
('boa-vista-eco-2', 'Eventos', 'Boa Vista Eco Lodge', 'boa-vista-eco-2', 'Eco-lodge', 'Floresta do Sul', 'Lodge sustentável construído com materiais locais no interior da floresta equatorial. Energia solar, água da nascente e trilhos privados com guia incluído.', '100% energia solar', 'Desde 95€/noite', 4.7, 78, '["Solar","Floresta","Trilhos","Sustentável","Guia"]', '{"tel":"+239 222 6677","email":"ecolodge@boavista.st","web":"boavistaeco.st"}', 1, 1);


INSERT INTO categorias (id, nome, slug, descricao, tagline, icon, cor, hero_image, ativo, ordem) VALUES
('destinos-turisticos', 'Destinos turísticos', 'destinos-turisticos', 'Os lugares que tornam São Tomé e Príncipe inesquecível.', 'Explora o arquipélago', 'Compass', NULL, '/images/pico-cao-grande.webp', 1, 2);


INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('dest-pico-cao-grande', 'destinos-turisticos', 'Pico Cão Grande', 'pico-cao-grande', 'Uma agulha vulcânica de quase 370m que se ergue sobre a floresta tropical — um dos ex-líbris mais fotografados do arquipélago.', 'Parque Natural Obô, São Tomé', NULL, 'MapPin', '/images/pico-cao-grande.webp', 1, 1);

INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('dest-forte-sao-sebastiao', 'destinos-turisticos', 'Forte de São Sebastião', 'forte-sao-sebastiao', 'Fortaleza do século XVI à beira-mar que hoje acolhe o Museu Nacional, com história colonial e vistas sobre a baía.', 'Cidade de São Tomé', NULL, 'MapPin', '/images/forte-sao-sebastiao.jpg', 1, 2);

INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('dest-praia-verde', 'destinos-turisticos', 'Praia Lagoa Azul', 'praia-verde', 'Águas calmas e cristalinas rodeadas de rocha vulcânica e coqueiros, ideal para mergulho livre e um dia em família.', 'Costa Sul, São Tomé', NULL, 'MapPin', '/images/praia-verde-stp.jpg', 1, 3);


INSERT INTO categorias (id, nome, slug, descricao, tagline, icon, cor, hero_image, ativo, ordem) VALUES
('pacotes-oferecidos', 'Pacotes oferecidos', 'pacotes-oferecidos', 'Combinações pensadas de alojamento, transporte e excursões para tornar o teu planeamento mais simples.', 'Roteiros prontos', 'Package', NULL, '/images/forte-sao-sebastiao.jpg', 1, 3);


INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('pacote-essencial', 'pacotes-oferecidos', 'STP Essencial', 'pacote-essencial', 'Cidade de São Tomé, Forte de São Sebastião e uma tarde de praia — o primeiro contacto perfeito com a ilha.', '3 dias / 2 noites', 'Desde 220€ / pessoa', 'Package', '/images/forte-sao-sebastiao.jpg', 1, 1);

INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('pacote-aventura', 'pacotes-oferecidos', 'Aventura na Floresta', 'pacote-aventura', 'Trilhos no Parque Natural Obô, vista ao Pico Cão Grande e alojamento em eco-lodge no coração da floresta.', '4 dias / 3 noites', 'Desde 340€ / pessoa', 'Package', '/images/pico-cao-grande.webp', 1, 2);

INSERT INTO servicos (id, categoria_id, nome, slug, descricao, label, preco, icon, image, ativo, ordem) VALUES
('pacote-ilha-completa', 'pacotes-oferecidos', 'Ilha Completa', 'pacote-ilha-completa', 'Roteiro completo entre São Tomé e Príncipe: praias, cultura, gastronomia e as melhores excursões do arquipélago.', '7 dias / 6 noites', 'Desde 690€ / pessoa', 'Package', '/images/praia-verde-stp.jpg', 1, 3);
