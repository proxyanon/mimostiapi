/*
SQLyog Community v13.2.1 (64 bit)
MySQL - 10.4.32-MariaDB : Database - mimostiapi
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`mimostiapi` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `mimostiapi`;

/*Table structure for table `caixa` */

DROP TABLE IF EXISTS `caixa`;

CREATE TABLE `caixa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `entrada` float DEFAULT NULL,
  `saida` float DEFAULT NULL,
  `saldo` float DEFAULT NULL,
  `datecreated` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `caixa` */

insert  into `caixa`(`id`,`nome`,`descricao`,`entrada`,`saida`,`saldo`,`datecreated`) values 
(1,'CAIXA PDV','VENDA DE PRODUTOS',0,0,0,'2024-06-07 11:42:00');

/*Table structure for table `caixa_temp` */

DROP TABLE IF EXISTS `caixa_temp`;

CREATE TABLE `caixa_temp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `caixa_id` int(11) NOT NULL,
  `produto_id` int(11) NOT NULL,
  `forma_pagamento_id` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `datecreated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `caixa_id` (`caixa_id`),
  KEY `produto_id` (`produto_id`),
  KEY `forma_pagamento_id` (`forma_pagamento_id`),
  CONSTRAINT `caixa_temp_ibfk_633` FOREIGN KEY (`caixa_id`) REFERENCES `caixa` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `caixa_temp_ibfk_634` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `caixa_temp_ibfk_635` FOREIGN KEY (`forma_pagamento_id`) REFERENCES `formas_pagamentos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `caixa_temp` */

/*Table structure for table `clientes` */

DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cpf_cnpj` varchar(255) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `ponto_referencia` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `datecreated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `clientes` */

insert  into `clientes`(`id`,`nome`,`cpf_cnpj`,`endereco`,`ponto_referencia`,`telefone`,`whatsapp`,`instagram`,`datecreated`) values 
(3,'Andrea de Freitas','000.000.000-00','Rua Risoleta Cursino Padilha','Erema','(00) 0 00','(87) 9 9189-720','000','2024-08-14 18:34:26'),
(5,'Cris Rocha Barroca','000.000.000-00','Av ESPERANÇA 975/1701B EDF VALE VICENA -  JOÃO PESSOA ','000','(00) 0 0000-0000','(00) 0 0000-0000','000','2024-08-16 18:29:41'),
(6,'Joanna D\'arc Costa de Barros','509.357.474-00','Av.Boa Viagem 4160 Apto 1402','','(81) 9 9678-7815','','','2024-09-04 19:35:59');

/*Table structure for table `contas_pagar` */

DROP TABLE IF EXISTS `contas_pagar`;

CREATE TABLE `contas_pagar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fornecedor_id` int(11) NOT NULL,
  `valor` float NOT NULL,
  `forma_pagamento` int(11) NOT NULL,
  `desconto` float DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `datecreated` datetime NOT NULL,
  `valor_pago` float DEFAULT 0,
  `pago` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fornecedor_id` (`fornecedor_id`),
  KEY `forma_pagamento` (`forma_pagamento`),
  CONSTRAINT `contas_pagar_ibfk_421` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `contas_pagar_ibfk_422` FOREIGN KEY (`forma_pagamento`) REFERENCES `formas_pagamentos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `contas_pagar` */

insert  into `contas_pagar`(`id`,`fornecedor_id`,`valor`,`forma_pagamento`,`desconto`,`descricao`,`datecreated`,`valor_pago`,`pago`) values 
(1,1,1000,1,0,'teste','2024-06-17 18:18:36',200,0);

/*Table structure for table `contas_receber` */

DROP TABLE IF EXISTS `contas_receber`;

CREATE TABLE `contas_receber` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cliente_id` int(11) NOT NULL,
  `valor` float NOT NULL,
  `forma_pagamento` int(11) NOT NULL,
  `desconto` float DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `datecreated` datetime NOT NULL,
  `valor_pago` float DEFAULT 0,
  `pago` varchar(255) DEFAULT 'Não pago',
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `forma_pagamento` (`forma_pagamento`),
  CONSTRAINT `contas_receber_ibfk_421` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `contas_receber_ibfk_422` FOREIGN KEY (`forma_pagamento`) REFERENCES `formas_pagamentos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `contas_receber` */

insert  into `contas_receber`(`id`,`cliente_id`,`valor`,`forma_pagamento`,`desconto`,`descricao`,`datecreated`,`valor_pago`,`pago`) values 
(2,3,180,1,0,'Apagar','2024-08-15 17:55:16',0,'0');

/*Table structure for table `estoque_material_producao` */

DROP TABLE IF EXISTS `estoque_material_producao`;

CREATE TABLE `estoque_material_producao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `especificacao` varchar(255) NOT NULL,
  `cor` int(11) NOT NULL,
  `unidade` int(11) DEFAULT NULL,
  `entrada` int(11) NOT NULL,
  `saida` int(11) DEFAULT NULL,
  `datecreated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cor` (`cor`),
  CONSTRAINT `estoque_material_producao_ibfk_1` FOREIGN KEY (`cor`) REFERENCES `produtos_cor` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `estoque_material_producao` */

/*Table structure for table `estoque_produto_final` */

DROP TABLE IF EXISTS `estoque_produto_final`;

CREATE TABLE `estoque_produto_final` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produto` int(11) NOT NULL,
  `especificacao` varchar(255) NOT NULL,
  `entrada` int(11) NOT NULL,
  `saida` int(11) DEFAULT NULL,
  `datecreated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `produto` (`produto`),
  CONSTRAINT `estoque_produto_final_ibfk_1` FOREIGN KEY (`produto`) REFERENCES `produtos` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `estoque_produto_final` */

insert  into `estoque_produto_final`(`id`,`produto`,`especificacao`,`entrada`,`saida`,`datecreated`) values 
(4,4,'Kit pano de prato em sacaria ',39,17,'2024-07-18 19:08:40'),
(5,5,'Pano de prato sacaria',26,2,'2024-06-18 19:28:23'),
(6,6,'KIt pano de prato barra especial',116,31,'2024-09-27 13:41:10'),
(7,7,'Pano de prato especial sacaria',38,10,'2024-09-27 13:45:58'),
(8,8,'Avental bate mão ',10,0,'2024-06-13 20:34:07'),
(9,9,'Luva de forno',21,0,'2024-06-20 13:56:14'),
(10,10,'Puxa Saco',5,0,'2024-07-25 20:05:29'),
(15,15,'Descanso de panela ',30,2,'2024-07-25 20:05:41'),
(16,16,'Kit Bate mão e pano de prato',5,0,'2024-06-18 19:14:58'),
(17,17,'Capa para filtro ',11,1,'2024-07-02 20:24:53'),
(18,18,'Porta ovos de galinha',7,2,'2024-06-28 18:41:54'),
(19,19,'Porta Calcinha ',1,0,'2024-06-18 19:42:48'),
(20,20,'Porta Remedio',2,0,'2024-06-18 19:44:03'),
(21,21,'Porta papel higienico triplo',5,0,'2024-06-18 19:47:12'),
(22,22,'Porta papel higienico individual ',3,0,'2024-06-18 19:49:34'),
(23,23,'Porta Treco ',11,0,'2024-06-18 19:56:05'),
(24,24,'Porta absorvente ',16,0,'2024-06-18 19:57:49'),
(25,25,'Porta Garrafa',5,0,'2024-06-18 20:00:13'),
(26,27,'Porta Oculos',35,2,'2024-07-18 19:00:00'),
(28,29,'Porta documento',25,3,'2024-07-18 19:19:04'),
(29,30,'Porta moeda',0,0,'2024-06-18 20:10:11'),
(30,31,'Porta Joia Redondo ',8,0,'2024-06-18 20:12:52'),
(31,33,'Luva Dupla para forno',12,1,'2024-07-09 15:27:11'),
(32,35,'Luva Galinha ',12,0,'2024-06-19 18:52:04'),
(33,36,'Porta Joia Carteira',2,0,'2024-06-18 20:17:45'),
(34,37,'Tapa Olho',4,0,'2024-06-18 20:19:03'),
(35,38,'Porta Joia Necessaire Quadrada',2,0,'2024-06-18 20:21:41'),
(36,39,'Kit pano para queijo',12,4,'2024-07-18 19:00:41'),
(37,40,'Pano de prato com felpa ',1,0,'2024-06-18 20:25:39'),
(38,42,'Bate mão em felpa unico',20,2,'2024-07-25 20:05:10'),
(39,43,'Pano de copa bordado a mão',23,0,'2024-09-27 13:54:01'),
(40,44,'Pano de Copa bordado a maquina ',7,0,'2024-06-18 20:34:56'),
(41,45,'Pano de copa bordado a maquina Natalino',3,0,'2024-06-18 20:37:41'),
(42,46,'Pano de copa bordado a maquina ',2,0,'2024-06-18 20:39:14'),
(43,47,'Pano de copa bordado a maquina ',1,0,'2024-06-18 20:40:40'),
(44,48,'Kit Necessaire com 3',7,4,'2024-08-13 18:26:25'),
(45,49,'Kit necessaire com 2 ',4,1,'2024-07-18 19:13:47'),
(46,50,'Bolsa de Lona Desmontavel',19,3,'2024-07-18 19:20:20'),
(47,51,'Bolsa lave-me e Use-me ',10,0,'2024-06-18 20:48:43'),
(48,52,'Frasqueira de Viagem',16,9,'2024-07-18 19:54:11'),
(49,53,'Necessaire de costura',1,0,'2024-06-18 20:55:52'),
(50,54,'Bolsa de Feira ',6,0,'2024-06-18 20:58:14'),
(51,55,'Bolsa de saco dupla face',6,3,'2024-07-09 15:31:35'),
(52,56,'Bolsa Belinha ',12,1,'2024-07-18 19:03:45'),
(53,57,'Bolsa Toalha Molhada',1,0,'2024-06-18 21:03:14'),
(54,58,'Bolsa de Praia que vira toalha ',2,0,'2024-06-18 21:04:55'),
(55,59,'Bolsa Necessaire marmita',2,0,'2024-06-18 21:08:56'),
(56,60,'Conj de Lençol de Solteiro',1,0,'2024-06-19 12:29:12'),
(57,61,'Porta Marmita para Café',0,0,'2024-06-19 12:34:53'),
(58,62,'Porta Marmita que vira Jogo americano',1,0,'2024-06-19 12:39:40'),
(59,63,'Kit de cozinha com 7 peças (melancia)',1,0,'2024-06-19 12:44:04'),
(60,64,'Kit de cozinha com 7 peças (Pinguim)',1,0,'2024-06-19 12:58:00'),
(61,65,'Kit de cozinha com 7 peças (Porcos)',1,0,'2024-06-19 13:01:37'),
(62,66,'Kit de cozinha com 7 peças (Girassol)',1,0,'2024-06-19 13:06:26'),
(63,67,'Kit de cozinha com 7 peças (Natal)',1,0,'2024-06-19 13:15:49'),
(64,68,'Conj de Lençol Casal Com 6 Peças ',16,6,'2024-08-12 17:26:03'),
(65,69,'Conj de Lençol Queen com 6 Peças',1,0,'2024-06-19 13:24:15'),
(66,70,'Conj de Lençol King com 6 peças',1,1,'2024-07-23 20:54:42'),
(67,71,'Toalha de mesa redonda com 8 lugares',1,0,'2024-06-19 13:28:20'),
(68,72,'Kit Porta Pão com Filó',5,0,'2024-06-19 13:38:50'),
(69,73,'Toalha de Mesa com 6 Lugares',2,0,'2024-06-19 13:40:27'),
(70,74,'Toalha de Mesa Redonda 4 Lugares ',2,0,'2024-06-19 13:42:24'),
(71,75,'Toalha Banquete Vermelha Bordado a Mão',1,0,'2024-06-19 13:47:10'),
(72,76,'Passadeira em Etamine',1,0,'2024-06-19 13:49:29'),
(73,77,'Edredom de Casal com 3 Peças ',3,0,'2024-06-19 13:53:17'),
(74,78,'Conj de Edredom Queen com 3 Peças ',2,0,'2024-06-19 13:55:42'),
(75,79,'Conj de Edredom King 3 Peças ',1,0,'2024-06-19 13:57:58'),
(76,80,'Conj de Edredom Solteiro 2 Peças ',2,0,'2024-06-19 14:00:38'),
(77,81,'Primeiras Trocas ',2,0,'2024-06-19 14:05:26'),
(78,82,'Kit de Cueiro 3 Peças com Vies ',1,0,'2024-06-19 14:08:43'),
(79,83,'Kit Cueiro com 3 Peças sem vies',1,0,'2024-06-19 14:12:48'),
(80,84,'Kit Cueiro com 3 Peças com vies',1,0,'2024-06-19 14:16:05'),
(81,85,'Kit Luva e Pano de prato ',1,0,'2024-06-19 17:41:20'),
(82,86,'Kit de Luva, Pano de prato e Descanso de panela',10,0,'2024-06-19 17:44:13'),
(83,87,'Kit Luva, Pano de Prato e Avental',5,1,'2024-08-16 19:01:18'),
(84,88,'Kit Luva, Pano de prato e Avental bate mão',2,0,'2024-06-19 17:50:46'),
(85,89,'Conj de 3 Fraldas de ombro Safari',1,0,'2024-06-19 17:59:07'),
(86,90,'Caixa com 6 fraldas de ombro',0,0,'2024-06-19 18:03:58'),
(87,91,'Conj com 3 Fraldas de boca e ombro ',1,0,'2024-06-19 18:07:54'),
(88,92,'Conj de Lençol para Berço',5,0,'2024-06-19 18:24:34'),
(89,93,'Jogo Americano com 6 Lugares',23,2,'2024-08-14 20:41:32'),
(90,94,'Jogo Americano com 8 Lugares',1,0,'2024-06-19 18:34:39'),
(91,95,'Jogo de Sousplat com 6 Lugares',23,2,'2024-07-09 15:26:41'),
(92,96,'Jogo Americano com 2 Lugares',1,0,'2024-06-19 18:42:43'),
(93,97,'Jogo de Sousplat com 4 lugares',1,0,'2024-06-19 18:44:54'),
(94,98,'Jogo de Sousplat com Porta Guardanapo em Madeira ',2,0,'2024-06-19 18:47:25'),
(95,99,'Jogo de Sousplat em Croche',3,0,'2024-06-28 12:27:17'),
(96,100,'Jogo de sousplat com 6 Lugares e Passadeira',1,0,'2024-06-19 19:04:07'),
(97,101,'Jogo de Sousplat com Passadeira',6,0,'2024-06-19 19:10:39'),
(98,102,'Kit de Lavabo com 2 bordado a mão',6,0,'2024-06-19 19:22:29'),
(99,103,'Kit Lavabo com 3 Bordado a mão ',12,1,'2024-08-16 19:00:41'),
(100,104,'Kit Lavabo Religioso com 3 bordado a maquina',1,0,'2024-06-19 19:27:06'),
(101,105,'Lavabo Religioso Bordado a maquina Branco',14,0,'2024-06-19 19:29:35'),
(102,106,'Lavabo Religioso Bordado a Maquina Verde',1,0,'2024-06-19 19:33:12'),
(103,107,'Lavabo Viagem com Ziper',7,4,'2024-07-30 19:46:07'),
(104,108,'Lavabo Com Papel Higienico',2,0,'2024-06-20 14:23:26'),
(105,109,'Lavabo Branco Bordado a mão',13,3,'2024-07-18 19:15:45'),
(106,110,'Lavabo Amarelo Bebe bordado a mão',2,0,'2024-06-20 14:27:01'),
(107,112,'Lavabo Azul Bebe Bordado a Mão',3,0,'2024-06-20 14:28:49'),
(108,113,'Lavabo Verde Bordado a Mão',1,0,'2024-06-20 14:30:04'),
(109,114,'Lavabo Lilas Bordado a Mão',2,0,'2024-06-20 14:32:34'),
(110,115,'Lavabo Lilas B. Mão Kasten',2,0,'2024-06-20 14:36:36'),
(111,116,'Lavabo Verde B. Mão Kasten',1,0,'2024-06-20 14:39:11'),
(112,117,'Lavabo Branco B. Mão Kasten',2,0,'2024-06-20 14:40:58'),
(113,118,'Lavabo Religioso Rosa B. Mão Kasten',1,0,'2024-06-20 14:43:08'),
(114,119,'Lavabo Azul B. Mão Firenze 3',1,0,'2024-06-20 14:46:38'),
(115,120,'Lavabo Branco B. Mão Santista',4,0,'2024-06-20 14:47:59'),
(116,121,'Lavabo Azul B. Mão Segunda Casa',1,0,'2024-06-20 14:49:41'),
(117,122,'Lavabo Rosa B. Mão Segunda Casa ',3,0,'2024-06-20 14:51:01'),
(118,123,'Conj de Rosto e Lavabo Branco B. Mão ',5,0,'2024-06-20 14:53:45'),
(119,124,'Conj de Rosto, Lavabo e Porta Papel H.',5,0,'2024-06-20 14:57:18'),
(120,125,'Conj de Rosto e Lavabo Natal ',3,0,'2024-06-20 15:00:05'),
(121,126,'Conj de Rosto e Lavabo Natal ',1,0,'2024-06-20 15:04:19'),
(122,128,'Conj Rosto e Lavabo com Barra Estampada',2,0,'2024-06-20 15:08:58'),
(123,129,'Conj de Rosto e Lavabo com Barra Estampado',3,0,'2024-06-20 15:11:02'),
(124,130,'Conj Banho e Rosto B. Mão Branco',13,1,'2024-07-09 15:29:50'),
(125,132,'Conj Banho, Rosto e Lavabo Branco',8,0,'2024-07-26 18:52:44'),
(126,133,'Avental Branco ',1,0,'2024-06-20 19:15:19'),
(127,134,'Toalha Rosto B. Mão ',1,0,'2024-06-20 19:19:27'),
(128,135,'Toalha de Rosto B. Mão ',4,0,'2024-06-20 19:20:49'),
(129,136,'Toalha Rosto Santitas B. Mão Branco',0,0,'2024-06-20 19:23:30'),
(130,137,'Toalha Rosto B. Maquina Branco',2,0,'2024-06-20 19:24:35'),
(131,138,'Toalha Rosto B. Maquina Creme',1,0,'2024-06-20 19:26:38'),
(132,139,'Toalha Banho e Rosto B. Mão Branco',4,0,'2024-06-20 19:44:42'),
(133,140,'Toalha Banho B. Mão Branco',1,0,'2024-06-20 19:46:47'),
(134,141,'Toalha Banho e Rosto B. Mão Amarela',1,0,'2024-06-20 19:48:32'),
(135,142,'Toalha Banho e Rosto B. Maquina Amarela',1,0,'2024-06-20 19:50:30'),
(136,143,'Toalha Banho B. Maquina Branco',1,0,'2024-06-20 19:52:21'),
(137,144,'Toalha Banho com Barra Branco',2,0,'2024-06-20 19:54:03'),
(138,145,'Toalha Banho com Barra Amarelo',1,0,'2024-06-20 19:56:55'),
(139,146,'Conj Banho e Rosto B.Maquina Branco',1,0,'2024-06-20 19:58:44'),
(140,147,'Toalha Banho e Rosto B.Maquina Rosa ',1,0,'2024-06-20 20:00:30'),
(141,148,'Toalha Banho e Rosto B. Maquia Vermelho',1,0,'2024-06-20 20:02:01'),
(142,149,'Toalha Banho e Rosto B.Maquina Azul',1,0,'2024-06-20 20:03:14'),
(143,150,'Conj Banho e Rosto B. Mão B. Maquina Azul',1,0,'2024-06-20 20:05:29'),
(144,151,'Conj Banho e Rosto B.Maquina Amarelo',1,0,'2024-06-20 20:06:56'),
(145,152,'Conj Banho e Rosto B. Maquina Salmão',1,0,'2024-06-20 20:09:43'),
(146,153,'Conj Banho e Rosto B. Maquina ',1,0,'2024-06-20 20:31:07'),
(147,154,'Conj Banho e Rosto B. Maquina Verde Menta',1,1,'2024-06-28 18:40:11'),
(148,155,'Conj Banho e Rosto B.Maquina Creme',2,1,'2024-07-09 15:30:26'),
(149,156,'Conj Banho e Rosto B . Maquina Branca',2,0,'2024-06-20 20:37:22'),
(150,157,'Conj Banho e Rosto B. Maquina Amarelo',1,0,'2024-06-20 20:46:33'),
(151,158,'Conj Banho, Rosto e Lavabo Rosa',1,0,'2024-06-20 20:48:19'),
(152,159,'Conj Banho, Rosto e Lavabo B',1,0,'2024-06-20 20:50:27'),
(153,160,'Capa de almofada ',30,0,'2024-06-20 20:59:11'),
(154,161,'Conj Banho e Rosto B. Mão Lilas',1,0,'2024-06-20 21:02:26'),
(155,162,'Conj Banho e Rosto B. Mão Azul',1,0,'2024-06-20 21:04:49'),
(156,163,'Guardanapos Avulso Liso',10,7,'2024-07-25 20:46:22'),
(157,164,'Guardanapos Avulso Liso Amarelo',11,9,'2024-07-25 20:50:01'),
(158,165,'Guardanapos Avulso Liso Azul ',14,6,'2024-07-25 20:42:56'),
(159,166,'Guardanapos Avulso Liso Branco',7,0,'2024-07-25 20:44:12'),
(160,167,'Guardanapos Avulso Liso Verde Bandeira',12,6,'2024-07-25 20:53:18'),
(161,168,'Guardanapos Avulso Liso Rosa ',2,0,'2024-06-21 12:21:12'),
(162,169,'Guardanapos Avulso Liso Verde Limão',7,6,'2024-07-25 20:37:30'),
(163,170,'Guardanapos Avulso Liso Branco',2,0,'2024-06-21 12:23:27'),
(164,171,'Guardanapos Avulso Liso Preto ',1,0,'2024-06-21 12:24:40'),
(165,172,'Guardanapos Avulso Poá Preto',12,0,'2024-07-01 14:41:22'),
(166,173,'Guardapanos Avulso Poá Creme',2,0,'2024-06-21 12:27:26'),
(167,174,'Guardanapos Avulso Poá Creme',2,0,'2024-06-21 12:29:18'),
(168,175,'Guardanapos Avulso Poá Marrom ',6,0,'2024-06-21 12:30:47'),
(169,176,'Guardanapos Avulso Poá Mostarda',12,0,'2024-06-21 12:32:01'),
(170,177,'Jaleco Feminino Gola Comum ( P )',3,0,'2024-06-21 13:05:53'),
(171,178,'Jaleco Feminino Gola Comum ( M )',0,0,'2024-06-21 13:07:09'),
(172,179,'Jaleco Feminino Gola Comum ( G )',6,0,'2024-06-21 13:08:28'),
(173,180,'Jaleco Masculino Gola Comum ( P)',0,0,'2024-06-21 13:09:42'),
(174,181,'Jaleco Masclino Gola Comum (M)',0,0,'2024-06-21 13:11:20'),
(175,182,'Jaleco Masculino Gola Comum ( G) ',0,0,'2024-06-21 13:12:44'),
(176,183,'Jaleco Feminino Gola Padre ( P) ',0,0,'2024-06-21 13:13:43'),
(177,184,'Jaleco Feminino Gola Padre ( M) ',2,0,'2024-06-21 13:15:14'),
(178,185,'Jaleco Femininos Gola Padre ( G)',0,0,'2024-06-21 13:16:40'),
(179,186,'Jaleco Masculino Gola Padre ( P) ',0,0,'2024-06-21 13:18:12'),
(180,187,'Jaleco Masculino Gola Padre (G)',0,0,'2024-06-21 13:19:27'),
(181,188,'Jaleco Masculino Gola Padre (M)',0,0,'2024-06-21 13:21:17'),
(182,189,'Scrub Feminino Branco (P)',1,0,'2024-06-21 17:04:24'),
(183,190,'Scrubs Feminino  Salmão (P)',1,1,'2024-08-08 18:36:58'),
(184,191,'Scrubs Feminino Verde Amizade (P)',1,0,'2024-06-21 17:08:00'),
(185,192,'Scrubs Feminino Morrom (M)',2,1,'2024-08-08 18:38:26'),
(186,193,'Scrubs Masculino Chumbo (P)',1,1,'2024-06-28 12:23:24'),
(187,194,'Scrubs Verde Bandeira (P)',3,1,'2024-06-28 12:23:54'),
(188,195,'Scrubs Masculino Azul Marinho (P)',1,1,'2024-06-28 12:22:53'),
(189,196,'Scrubs Masculino Verde Bandeira (G)',3,0,'2024-06-21 19:14:43'),
(190,197,'Jaleco Provador Feminino ( P)',1,0,'2024-06-21 19:16:33'),
(191,198,'Jaleco Provador Feminino (M)',1,0,'2024-06-21 19:17:33'),
(192,199,'Jaleco Provador Feminino (G) ',1,0,'2024-06-21 19:18:34'),
(193,200,'Jaleco Provador Masculino (P)',1,0,'2024-06-21 19:19:52'),
(194,201,'Jaleco Provador Masculino (M)',1,0,'2024-06-21 19:20:41'),
(195,202,'Jaleco Provador Masculino (G)',1,0,'2024-06-21 19:21:40'),
(196,203,'Kit Pano de prato em Sacaria Páscoa',3,0,'2024-06-21 19:29:17'),
(197,204,'Pano de prato unidade Sacaria ',3,0,'2024-06-21 19:32:20'),
(198,205,'Bate Mão Páscoa de Felpa',5,0,'2024-06-21 19:43:40'),
(199,206,'Kit Luva,  Pano de prato e Puxa saco Natalino',7,0,'2024-06-21 19:45:55'),
(200,207,'Kit Pano de prato com 3 Natalino',23,0,'2024-06-21 19:47:46'),
(201,208,'Kit Pano de Prato com Barra Especial Natalino ',3,0,'2024-06-21 19:49:26'),
(202,209,'Pano de Prato de Sacaria Bordado Natalino',6,0,'2024-06-21 20:07:08'),
(203,210,'Jogo Americano com Passadeira Natalino',1,0,'2024-06-21 20:09:36'),
(204,211,'Jogo de Sousplat com 6 Lugares Natalino ',6,0,'2024-06-21 20:11:04'),
(205,212,'Conj Banho e Rosto B. Mão Verde Tiffany',1,0,'2024-06-28 12:40:00'),
(208,215,'Jogo Americano Redondo c/ 6 lugares ',3,2,'2024-08-16 19:00:12'),
(209,216,'Guardanapos Avulso Liso Vermelho',3,0,'2024-07-25 20:52:13'),
(210,217,'Guardanapo Azul Marinho ',4,0,'2024-07-25 20:55:33'),
(211,218,'Guardanapos Avulso Liso Verde Menta',1,0,'2024-07-25 20:57:25'),
(212,219,'Guardanapos Avulso Liso Vinho',1,0,'2024-07-25 20:58:46'),
(213,220,'Conj Banho, Rosto e Lavabo Creme B. Mão',2,0,'2024-07-26 18:55:52'),
(214,221,'Kit Bate Mão e pano de prato Natalino',1,0,'2024-07-29 20:01:34'),
(215,222,'conj.banho e rosto e lavabo filó bordado à maq lilás dohler',1,0,'2024-09-26 14:42:10'),
(216,223,'conj.toalha rosto e banho bordado à maq filó',1,0,'2024-09-26 14:21:56'),
(217,224,'conj.banho e rosto bordada à mão dohler',1,0,'2024-09-26 14:25:04'),
(218,225,'conj.toalha banho e rosto filó',5,0,'2024-09-26 14:31:37'),
(219,226,'toalha de rosto b. máq. ',2,0,'2024-09-26 18:26:21'),
(220,227,'lavabo branco b. maq. Dohler',1,0,'2024-09-26 18:28:25'),
(221,228,'Conj. rosto e lavabo B. máq. branca Dohler',2,0,'2024-09-26 18:30:39');

/*Table structure for table `formas_pagamentos` */

DROP TABLE IF EXISTS `formas_pagamentos`;

CREATE TABLE `formas_pagamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `datecreated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `formas_pagamentos` */

insert  into `formas_pagamentos`(`id`,`nome`,`datecreated`) values 
(1,'PIX','2024-06-06 23:52:00'),
(2,'DINHEIRO','2024-06-06 23:52:00'),
(3,'CARTÃO DE CRÉDITO','2024-06-06 23:52:00'),
(4,'CARTÃO DE DÉBITO','2024-06-06 23:52:00'),
(5,'TRANSFERÊNCIA BANCÁRIA (TED/DOC)','2024-06-06 23:52:00');

/*Table structure for table `fornecedores` */

DROP TABLE IF EXISTS `fornecedores`;

CREATE TABLE `fornecedores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cpf_cnpj` varchar(255) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `ponto_referencia` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `datecreated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `fornecedores` */

insert  into `fornecedores`(`id`,`nome`,`cpf_cnpj`,`endereco`,`ponto_referencia`,`telefone`,`whatsapp`,`instagram`,`datecreated`) values 
(1,'fornecedor teste','82.739.812/3897-21','teste','teste','(98) 9 9999-9999','(89) 8 9999-9999','tesrte','2024-06-17 18:18:04');

/*Table structure for table `funcionarios` */

DROP TABLE IF EXISTS `funcionarios`;

CREATE TABLE `funcionarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `ponto_referencia` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `funcao` varchar(255) DEFAULT NULL,
  `datecreated` datetime DEFAULT NULL,
  `cpf_cnpj` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `funcionarios` */

/*Table structure for table `prestadores_servicos` */

DROP TABLE IF EXISTS `prestadores_servicos`;

CREATE TABLE `prestadores_servicos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cpf_cnpj` varchar(255) NOT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `ponto_referencia` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `datecreated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `prestadores_servicos` */

/*Table structure for table `produtos` */

DROP TABLE IF EXISTS `produtos`;

CREATE TABLE `produtos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `secao` int(11) NOT NULL,
  `categoria` int(11) NOT NULL,
  `preco` float NOT NULL,
  `desconto` float NOT NULL DEFAULT 0,
  `cor` int(11) DEFAULT NULL,
  `descricao` varchar(255) DEFAULT 'Nenhuma',
  `usuario` varchar(255) DEFAULT NULL,
  `codigo_barras` varchar(255) DEFAULT NULL,
  `datecreated` datetime DEFAULT NULL,
  `foto` varchar(255) DEFAULT 'defaultProduct.png',
  PRIMARY KEY (`id`),
  KEY `secao` (`secao`),
  KEY `categoria` (`categoria`),
  KEY `cor` (`cor`),
  CONSTRAINT `produtos_ibfk_637` FOREIGN KEY (`secao`) REFERENCES `produtos_secoes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `produtos_ibfk_638` FOREIGN KEY (`categoria`) REFERENCES `produtos_categorias` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `produtos_ibfk_639` FOREIGN KEY (`cor`) REFERENCES `produtos_cor` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=229 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `produtos` */

insert  into `produtos`(`id`,`nome`,`secao`,`categoria`,`preco`,`desconto`,`cor`,`descricao`,`usuario`,`codigo_barras`,`datecreated`,`foto`) values 
(4,'Kit pano de prato em sacaria ',1,3,40,0,6,'Kit 3 pano de prato em barra sacaria ','mimostiapi','9625044470','2024-07-24 18:55:27','ed8155ebffb1afa6e3ee43979e4abfc9.jpg'),
(5,'Pano de prato sacaria Unidade',1,3,13.5,0,6,'Pano de prato com barra em sacaria unidade','mimostiapi','3291467783','2024-06-25 11:53:24','defaultProduct.png'),
(6,'Kit pano de prato barra especial',1,2,50,0,6,'Kit pano de prato especial em sacaria ','mimostiapi','1319673509','2024-07-24 18:43:10','3927ca60a8d867ed3b7f222dec67dced.jpg'),
(7,'Pano de prato especial sacaria',1,2,17,0,6,'Pano de prato especial sacaria','mimostiapi','5377542083','2024-07-24 18:42:39','df8d76572926058e6bf672271f182be5.jpg'),
(8,'Avental bate mão ',1,9,45,0,6,'Avental bate mão de felpa','mimostiapi','6013242456','2024-07-22 19:48:00','c1c519eae463ead625cda1feab101ebe.jpg'),
(9,'Luva de forno',1,10,30,0,7,'Luva de forno unidade','mimostiapi','5248040538','2024-07-24 18:30:03','02a1dd47a2c816674b1b566cab586876.jpg'),
(10,'Puxa Saco',1,14,30,0,7,'Puxa Saco em tricoline com acabamento em viès sianinha e bico.','mimostiapi','9123762684','2024-07-24 19:54:21','55589fa8140470f0bc68f30c1e010b8e.jpg'),
(15,'Descanso de panela ',1,20,15,0,7,'Descanso de panela ','mimostiapi','7739918154','2024-07-24 18:37:41','dc861356354cfee7e1f2240b47f5fec9.jpg'),
(16,'Kit Bate mão e pano de prato',1,21,40,0,6,'Kit Bate mão e pano de prato ','mimostiapi','6513555097','2024-06-18 19:14:58','defaultProduct.png'),
(17,'Capa para filtro ',1,22,50,0,6,'Capa para filtro d\'agua','mimostiapi','5174777002','2024-07-24 19:54:56','6df6f16a252285fb921b47dede528119.jpg'),
(18,'Porta ovos de galinha',1,24,50,0,7,'Porta ovos de galinha ','mimostiapi','4923055632','2024-07-24 18:32:30','04ddb9cdd38fde46f037c98c1ac15253.jpg'),
(19,'Porta Calcinha ',2,25,30,0,7,'Porta Calcinha ','mimostiapi','9832764727','2024-06-18 19:42:48','defaultProduct.png'),
(20,'Porta Remedio',2,26,50,0,7,'Porta Remedio','mimostiapi','9977519024','2024-06-18 19:44:03','defaultProduct.png'),
(21,'Porta papel higienico triplo',3,27,20,0,7,'Porta papel higienico triplo ','mimostiapi','5807486071','2024-07-24 19:53:38','6bb8040fc0bed8729f720223dc2b010a.jpg'),
(22,'Porta papel higienico individual ',3,28,15,0,7,'Porta papel higienico individual','mimostiapi','8319803141','2024-07-24 20:01:13','a0be5c3de2f5d0e6931b5aa1c3650266.jpg'),
(23,'Porta Treco ',2,29,15,0,7,'Porta Treco','mimostiapi','6034059617','2024-07-25 20:06:24','e9890b57dad9fc7bc520e2a2df3a5eb8.jpg'),
(24,'Porta absorvente ',2,30,10,0,7,'Porta absorvente','mimostiapi','5943604145','2024-07-24 19:52:35','b102907266b88242be2ef8aa7e04db27.jpg'),
(25,'Porta Garrafa',2,31,40,0,7,'Porta garrafa','mimostiapi','4553768611','2024-07-25 19:16:31','9e6cad556e3c398695309ae174a46c6a.jpg'),
(27,'Porta Oculos',2,32,25,0,7,'Porta Oculos ','mimostiapi','3198539298','2024-06-18 20:01:37','defaultProduct.png'),
(29,'Porta documento',2,33,20,0,7,'Porta documento','mimostiapi','8618229482','2024-06-18 20:08:52','defaultProduct.png'),
(30,'Porta moeda',2,34,10,0,7,'Porta moeda','mimostiapi','5007927489','2024-06-18 20:10:11','defaultProduct.png'),
(31,'Porta Joia Redondo ',2,35,15,0,7,'Porta joia redondo','mimostiapi','9394697729','2024-07-24 20:00:40','1ddc837a9e0ad95227ec498c013e9edb.jpg'),
(33,'Luva Dupla para forno',2,36,40,0,7,'Luva dupla para forno','mimostiapi','1623547524','2024-07-22 19:48:27','c1ab8e58c4f7566d1bdecd3231080606.jpg'),
(35,'Luva Galinha ',1,37,40,0,7,'Luva Galinha para forno','mimostiapi','0732552262','2024-07-24 18:29:33','3ce44ebd69b7298291a6dbe9bb3164b4.jpg'),
(36,'Porta Joia Carteira',2,38,50,0,7,'Porta Joia Carteira','mimostiapi','2037964226','2024-07-29 19:09:23','3e4a0c9c110e6259f8778f5521c62bbf.jpg'),
(37,'Tapa Olho',2,39,15,0,7,'Tapa Olho ','mimostiapi','2605527740','2024-06-18 20:19:02','defaultProduct.png'),
(38,'Porta Joia Necessaire Quadrada',2,40,50,0,7,'Porta Joia Necessaire quadrada','mimostiapi','0386332124','2024-06-18 20:21:41','defaultProduct.png'),
(39,'Kit pano para queijo',1,41,15,0,7,'Nenhuma','mimostiapi','0023279858','2024-06-18 20:23:09','defaultProduct.png'),
(40,'Pano de prato com felpa ',1,42,15,0,7,'Pano de prato com felpa ','mimostiapi','8457054440','2024-06-18 20:25:39','defaultProduct.png'),
(42,'Bate mão em felpa unico',1,43,35,0,7,'Bate mão em felpa unico ','mimostiapi','2816007660','2024-07-25 20:07:36','98754594be8c7e6d9338c0187e31311e.jpg'),
(43,'Pano de copa bordado a mão',1,44,35,0,7,'Pano de copa verona Dohler','mimostiapi','2672475086','2024-06-18 20:33:09','defaultProduct.png'),
(44,'Pano de Copa bordado a maquina ',1,44,35,0,9,'Pano de copa milano Dohler','mimostiapi','8017583543','2024-06-18 20:34:56','defaultProduct.png'),
(45,'Pano de copa bordado a maquina Natalino',1,44,35,0,9,'Pano de copa bordado a maquina Criative Dohler Natalino','mimostiapi','6803748394','2024-07-29 19:22:54','e772d836be8931a626999e831557a92e.jpg'),
(46,'Pano de copa bordado a maquina ',1,44,35,0,9,'Pano de copa bordado a maquina Kasten','mimostiapi','0883248430','2024-06-18 20:39:14','defaultProduct.png'),
(47,'Pano de copa bordado a maquina ',1,44,35,0,9,'Pano de copa milano bordado a maquina Dohler','mimostiapi','1481235151','2024-06-18 20:40:40','defaultProduct.png'),
(48,'Kit Necessaire com 3',2,45,50,0,8,'Kit necessaire com 3 grande, media e pequena ','mimostiapi','2604342779','2024-07-24 18:24:54','748be080332cca5c153818ad4233d5e7.jpg'),
(49,'Kit necessaire com 2 ',2,45,30,0,8,'Kit Necessaire com 2, media e pequena','mimostiapi','1599365307','2024-07-24 18:24:26','d26276c6c6941ac49ae34bc7c59a28c0.jpg'),
(50,'Bolsa de Lona Desmontavel',2,46,45,0,8,'Bolsa de Lona Desmontavel','mimostiapi','6552040394','2024-07-24 18:31:33','579f7b646143d030dceda3ebf95f24b2.jpg'),
(51,'Bolsa lave-me e Use-me ',2,47,50,0,8,'Bolsa Lave-me e Use-me','mimostiapi','0887783940','2024-07-24 18:56:53','6b933c9545ab8cd0b2bfe7b60f257e85.jpg'),
(52,'Frasqueira de Viagem',2,48,50,0,7,'Frasqueira de Viagem ','mimostiapi','7125701432','2024-07-24 18:25:35','ebf87c2b10f31210f3aac248e4a20112.jpg'),
(53,'Necessaire de costura',2,49,30,0,7,'Necessaire de costura com Napa','mimostiapi','1311303088','2024-06-18 20:55:52','defaultProduct.png'),
(54,'Bolsa de Feira ',2,50,30,0,7,'Bolsa de feira','mimostiapi','8008416468','2024-07-25 19:17:03','f8c92ba491804dbe7a58b6eb1284ff5f.jpg'),
(55,'Bolsa de saco dupla face',2,51,60,0,7,'Bolsa de saco dupla face','mimostiapi','1770212837','2024-07-24 18:54:45','bc75d1b61fcd918adcf4566a8dbada81.jpg'),
(56,'Bolsa Belinha ',2,52,50,0,7,'Bolsa Belinha ','mimostiapi','2547237323','2024-07-24 19:53:01','b8ed1ab8163e782836e016c8d2586286.jpg'),
(57,'Bolsa Toalha Molhada',2,53,40,0,7,'Bolsa porta toalha molhada','mimostiapi','6886711356','2024-06-18 21:03:14','defaultProduct.png'),
(58,'Bolsa de Praia que vira toalha ',2,54,60,0,7,'Bolsa de Praia que vira toalha ','mimostiapi','6452367755','2024-07-29 19:17:12','f0ee509672c99ecc9f692cbdc0007390.jpg'),
(59,'Bolsa Necessaire marmita',2,49,60,0,7,'Bolsa Necessaire marmita','mimostiapi','7042560430','2024-07-24 20:01:49','730b209873aeb59403d32f5a41518caf.jpg'),
(60,'Conj de Lençol de Solteiro',5,56,0.01,0,6,' 2 Fronhas e 2 lençois / Lençol: 2,25 x 1,80 Fronha: 60 x 1,86 ','mimostiapi','0754999874','2024-06-19 13:30:33','defaultProduct.png'),
(61,'Porta Marmita para Café',1,57,60,0,7,'Porta Marmita para Café ','mimostiapi','4975827899','2024-06-19 12:34:53','defaultProduct.png'),
(62,'Porta Marmita que vira Jogo americano',1,57,70,0,7,'Porta Marmita que vira jogo americano na estampa de melancia','mimostiapi','9643410844','2024-06-19 12:39:40','defaultProduct.png'),
(63,'Kit de cozinha com 7 peças (melancia)',1,58,250,0,7,'pano de pão, descanso de panela,pano de fogão, pano de prato em felpa, pano de bandeja, passadeira e porta pão sem filó','mimostiapi','4090939891','2024-06-19 12:44:04','defaultProduct.png'),
(64,'Kit de cozinha com 7 peças (Pinguim)',1,58,225,0,6,'Luva dupla, Luva, Pano de fogão, Passadeira, Pano de bandeja, Pano de prato em felpa e Pano de pão','mimostiapi','9548910739','2024-06-19 12:58:00','defaultProduct.png'),
(65,'Kit de cozinha com 7 peças (Porcos)',1,58,240,0,6,'Luva, Luva dupla, Pano de prato, Pano de fogão, Pano de bandeja, Descanso de panela, pano de pão e Passadeira','mimostiapi','5697366767','2024-06-19 13:01:37','defaultProduct.png'),
(66,'Kit de cozinha com 7 peças (Girassol)',1,58,230,0,6,'Luva, Passadeira, Capa de filtro, Pano de bandeja,Pano de prato de felpa, Pano ne fogão e Pano de pão','mimostiapi','3103988904','2024-06-19 13:06:26','defaultProduct.png'),
(67,'Kit de cozinha com 7 peças (Natal)',1,58,230,0,6,'Pano de pão, Descanso de panela, Pano de prato em felpa, Pano de Bandeja, Pano de fogão, Luva dupla, Luva e Passadeira ','mimostiapi','7471723092','2024-06-19 13:15:49','defaultProduct.png'),
(68,'Conj de Lençol Casal Com 6 Peças ',5,56,240,0,7,'4 Fronhas e 2 Lençois / Lençol: 2,25 x 2,40m Fronhas: 60 x 86cm','mimostiapi','0769709542','2024-07-24 19:57:01','f3fbe6e214dd1d07cd40ec0c8eeef0f7.jpg'),
(69,'Conj de Lençol Queen com 6 Peças',5,56,300,0,7,'4 Fronhas e 2 Lençois/ Lençol: 2,70 x 2,40m Fronha: 60 x 86cm','mimostiapi','3262442619','2024-07-29 19:50:08','69ecb96ecfa2f5859f17da47bf0236c4.jpg'),
(70,'Conj de Lençol King com 6 peças',5,56,400,0,7,'4 Fronhas e 2 Lençois / Lençol: 3,00 x 2,40m Fronha: 60 x 86 cm','mimostiapi','9930680742','2024-07-29 19:28:39','7cea6318c517b76174d9778db920032a.jpg'),
(71,'Toalha de mesa redonda com 8 lugares',1,59,200,0,7,'Toalha de mesa redonda com 8 lugares','mimostiapi','6955696594','2024-06-19 13:28:20','defaultProduct.png'),
(72,'Kit Porta Pão com Filó',1,60,130,0,7,'Porta Pão com Filó, Bate mão, Luva e 3 Panos de prato','mimostiapi','6083827054','2024-07-24 19:55:31','f220a3054637396dc6e0bff5bb26a3c1.jpg'),
(73,'Toalha de Mesa com 6 Lugares',1,59,150,0,7,'Toalha de mesa com 6 lugares ','mimostiapi','0479531599','2024-06-19 13:40:27','defaultProduct.png'),
(74,'Toalha de Mesa Redonda 4 Lugares ',1,59,120,0,7,'Toalha de mesa Redonda 4 Lugares','mimostiapi','2872094333','2024-06-19 13:42:24','defaultProduct.png'),
(75,'Toalha Banquete Vermelha Bordado a Mão',1,59,350,0,10,'Toalha Bordada em Vagonite Vermelha ','mimostiapi','3902975115','2024-06-19 13:47:10','defaultProduct.png'),
(76,'Passadeira em Etamine',1,61,250,0,9,'Passadeira em Etamine  ','mimostiapi','8302987679','2024-06-19 13:49:29','defaultProduct.png'),
(77,'Edredom de Casal com 3 Peças ',5,62,200,0,7,'2 Fronhas e 1 Lençol/ Lençol: 2,25 x 2,40m Fronhas: 60 x 86cm','mimostiapi','6713711623','2024-06-19 13:53:17','defaultProduct.png'),
(78,'Conj de Edredom Queen com 3 Peças ',5,62,235,0,7,'2 Fronhas e 1 Lençol/ Lençol:2,70 x 2,40cm Fronhas: 60 x 86cm','mimostiapi','4549336940','2024-07-29 19:48:44','c96244165f9bf101264a5af4fbf138a7.jpg'),
(79,'Conj de Edredom King 3 Peças ',5,62,265,0,7,'2 Fronhas e 1 Lençol/ Lençol:3,00 x 2,40m Fronhas: 60 x 86cm','mimostiapi','2522525674','2024-07-29 19:49:31','2fca36abf1e407152ef3ec93845ae245.jpg'),
(80,'Conj de Edredom Solteiro 2 Peças ',5,62,160,0,7,'1 Fronhas e 1 Lençol/  Lençol: 2,25 x 1,80m Fronha: 60 x 86cm ','mimostiapi','0916479663','2024-07-29 19:35:19','70ab4942b9f27482a74e64468d939e90.jpg'),
(81,'Primeiras Trocas ',6,63,55,0,7,'Primeiras Trocas da Maternidade com 3 Peças','mimostiapi','1269315182','2024-07-22 19:03:51','2e035ad5eb3127d5b570889f07764e25.jpg'),
(82,'Conj de Cueiro 3 Peças com Vies ',6,64,120,0,7,'Kit de Cueiro 3 Peças com Vies ','mimostiapi','5799206689','2024-07-24 20:07:01','dccc84baa9484c137b76558c4980d203.jpg'),
(83,'Conj de Cueiro com 3 Peças sem vies',6,64,100,0,11,'Kit Cueiro com 3 Peças sem Vies/ Cores: Branco, Azul e Branco','mimostiapi','5123485191','2024-07-24 19:13:38','7bf0068e3f832eb8b153dfe1258a6a9d.jpg'),
(84,'Conj de Cueiro com 3 Peças com vies',6,64,120,0,12,'Kit Cueiro com 3 Peças com Vies/ Cores: Verde, Lilas e Amarelo','mimostiapi','7658469425','2024-07-24 20:08:38','dccc84baa9484c137b76558c4980d203.jpg'),
(85,'Kit Luva e Pano de prato ',1,65,55,0,7,'1 Luva e 1 Pano de prato','mimostiapi','0110617884','2024-06-19 17:41:20','defaultProduct.png'),
(86,'Kit de Luva, Pano de prato e Descanso de panela',1,66,60,0,7,'Kit Luva, Pano de prato e Descansa Panela','mimostiapi','9284238314','2024-06-19 17:44:13','defaultProduct.png'),
(87,'Kit Luva, Pano de Prato e Avental',1,67,80,0,7,'Kit Luva, Pano de prato e Avental','mimostiapi','2869927478','2024-07-24 18:34:04','fe5cea53dba0b67cbbfdf6880f0cc77d.jpg'),
(88,'Kit Luva, Pano de prato e Avental bate mão',1,67,80,0,7,'Kit Luva, Pano de prato e Avental bate mão','mimostiapi','0422871744','2024-06-19 17:50:46','defaultProduct.png'),
(89,'Conj de 3 Fraldas de ombro Safari',6,68,78,0,13,'Conj de 3 fraldas de ombro com barra','mimostiapi','3037517250','2024-07-24 19:09:59','4ce82d05448156d18009be7ebd8ed966.jpg'),
(90,'Caixa com 6 fraldas de ombro',6,70,156,0,14,'Caixa com 6 fraldas de ombro bordadas','mimostiapi','4225446771','2024-07-24 19:01:49','9a81e7e4c20c529d9ac29846b5ed80dd.jpg'),
(91,'Conj com 3 Fraldas de boca e ombro ',6,71,60,0,14,'Conj de fraldas 2 de Boca e 1 de ombro','mimostiapi','2651842397','2024-07-24 19:12:05','65cd7faa80fee9bae2f2b11927c292d0.jpg'),
(92,'Conj de Lençol para Berço',6,72,0,0,7,'1 Fronhas e 2 Lençois/ Lençol: 1,50 x 1,20m Fronha: 50 x 34cm ','mimostiapi','4296574059','2024-07-24 19:14:48','3f0367ef0c4ff1f561976ae1b52f3c9f.jpg'),
(93,'Jogo Americano com 6 Lugares',1,74,210,0,7,'6 Jogos Americanos e 6 Guardanapos ','mimostiapi','6519051253','2024-07-24 18:31:01','ba0ad418d29d0f2fd1297f4911f1e9c3.jpg'),
(94,'Jogo Americano com 8 Lugares',1,74,280,0,7,'6 Jogo Americano e 6 Guardanapos','mimostiapi','6708547169','2024-06-19 18:34:39','defaultProduct.png'),
(95,'Jogo de Sousplat com 6 Lugares',1,75,150,0,7,'6 Sousplat e 6 Guardanapos','mimostiapi','0420464632','2024-07-24 18:33:13','a88f40f61542786344f60e48d6a7cf5f.jpg'),
(96,'Jogo Americano com 2 Lugares',1,74,70,0,7,'2 Jogos Americano e 2 Guardanapos','mimostiapi','3648162966','2024-06-19 18:42:43','defaultProduct.png'),
(97,'Jogo de Sousplat com 4 lugares',1,75,95,0,7,'4 Sousplat e 4 Guardanapos','mimostiapi','0933289944','2024-06-19 18:44:54','defaultProduct.png'),
(98,'Jogo de Sousplat com Porta Guardanapo em Madeira ',1,75,180,0,7,'6 Sousplat e 6 Guardanapos','mimostiapi','4375186838','2024-06-19 18:47:25','defaultProduct.png'),
(99,'Jogo de Sousplat em Croche',1,75,150,0,7,'6 Sousplat de croche','mimostiapi','1867436510','2024-07-29 19:27:34','93a86faf2f44d34adbd72dee0008ae8d.jpg'),
(100,'Jogo de sousplat com 6 Lugares e Passadeira (Abacaixi)',1,76,150,0,7,'6 sousplat e 6 Guardanapos e 1 Passadeira (Abacaxi)','mimostiapi','2406474816','2024-07-29 19:24:42','e1b0390193d71a675590b7cc8d21783e.jpg'),
(101,'Jogo de Sousplat com Passadeira',1,76,180,0,7,'6 Sousplat 6 Guardanapos 1 Passadeira / Cor: Crua ','mimostiapi','9822996488','2024-07-29 19:35:56','543d358052529af4c78fae1f9805a936.jpg'),
(102,'Kit de Lavabo com 2 bordado a mão',3,78,60,0,7,'Toalha de Lavabo Bella Dohler','mimostiapi','8380949486','2024-07-25 19:19:09','f10610740e0c9b43e07f1e78de21622d.jpg'),
(103,'Kit Lavabo com 3 Bordado a mão ',3,78,80,0,9,'Kit Lavabo Bella Dohler','mimostiapi','3384436477','2024-07-24 19:56:15','df8834830fc29178eb20e3b46e3bc909.jpg'),
(104,'Kit Lavabo Religioso com 3 bordado a maquina',3,78,80,0,9,'Toalha Artesanalle Dohler','mimostiapi','2390737487','2024-06-19 19:27:06','defaultProduct.png'),
(105,'Lavabo Religioso Bordado a maquina Branco',3,79,45,0,9,'Artesanalle Dohler','mimostiapi','2795895602','2024-07-24 20:03:10','117294e46a0584e56891386d8dff740b.jpg'),
(106,'Lavabo Religioso Bordado a Maquina Verde',3,79,45,0,9,'Artesanalle Dohler','mimostiapi','6812265863','2024-06-19 19:33:12','defaultProduct.png'),
(107,'Lavabo Viagem com Ziper',3,79,40,0,9,'Artesanalle Dohler','mimostiapi','2125425976','2024-07-24 19:02:23','c02131617a9e0774ce3aae2f3297195c.jpg'),
(108,'Conj Lavabo Com Papel Higienico',3,81,70,0,9,'Bella Dohler','mimostiapi','5628707282','2024-06-25 11:51:59','defaultProduct.png'),
(109,'Lavabo Branco Bordado a mão',3,79,35,0,9,'Bella Dohler','mimostiapi','0932707893','2024-06-20 14:25:50','defaultProduct.png'),
(110,'Lavabo Amarelo Bebe bordado a mão',3,79,35,0,9,'Bella Dohler','mimostiapi','3337551179','2024-06-20 14:27:01','defaultProduct.png'),
(112,'Lavabo Azul Bebe Bordado a Mão',3,79,35,0,9,'Bella Dohler','mimostiapi','0956457346','2024-06-20 14:28:49','defaultProduct.png'),
(113,'Lavabo Verde Bordado a Mão',3,79,35,0,9,'Bella Dohler','mimostiapi','3047974188','2024-06-20 14:30:04','defaultProduct.png'),
(114,'Lavabo Lilas Bordado a Mão',3,79,35,0,9,'Bella Dohler','mimostiapi','6602057805','2024-06-20 14:32:34','defaultProduct.png'),
(115,'Lavabo Lilas B. Mão Kasten',3,79,35,0,9,'Lavabo Kasten Lilas','mimostiapi','0057916278','2024-06-20 14:36:36','defaultProduct.png'),
(116,'Lavabo Verde B. Mão Kasten',3,79,35,0,9,'Lavabo Verde Kasten','mimostiapi','9614291311','2024-06-20 14:39:11','defaultProduct.png'),
(117,'Lavabo Branco B. Mão Kasten',3,79,35,0,9,'Lavabo Kasten','mimostiapi','4268411041','2024-06-20 14:40:58','defaultProduct.png'),
(118,'Lavabo Religioso Rosa B. Mão Kasten',3,79,35,0,15,'Lavabo Kasten Rosa','mimostiapi','0711994382','2024-06-20 14:43:08','defaultProduct.png'),
(119,'Lavabo Azul B. Mão Firenze 3',3,79,34,0,16,'Lavabo Azul Firenze 3','mimostiapi','6008756341','2024-06-20 14:46:38','defaultProduct.png'),
(120,'Lavabo Branco B. Mão Santista',3,79,30,0,9,'Lavabo Branco Santista','mimostiapi','7497801737','2024-06-20 14:47:59','defaultProduct.png'),
(121,'Lavabo Azul B. Mão Segunda Casa',3,79,30,0,16,'Lavabo Azul Segunda Casa','mimostiapi','5656260448','2024-06-20 14:49:41','defaultProduct.png'),
(122,'Lavabo Rosa B. Mão Segunda Casa ',3,79,30,0,15,'Lavabo Rosa Segunda Casa','mimostiapi','3306253054','2024-06-20 14:51:01','defaultProduct.png'),
(123,'Conj de Rosto e Lavabo Branco B. Mão ',3,82,75,0,9,'Bella Dohler','mimostiapi','6942547824','2024-06-20 14:53:45','defaultProduct.png'),
(124,'Conj de Rosto, Lavabo e Porta Papel H.',3,82,130,0,9,'Artesanalle Dohler','mimostiapi','4863649129','2024-06-20 14:57:18','defaultProduct.png'),
(125,'Conj de Rosto e Lavabo Natal ',3,82,100,0,9,'Artesanalle Dohler','mimostiapi','5280284552','2024-06-20 15:00:05','defaultProduct.png'),
(126,'Conj de Rosto e Lavabo Natal ',3,82,100,0,9,'Bella Dohler','mimostiapi','6006247103','2024-06-20 15:04:19','defaultProduct.png'),
(128,'Conj Rosto e Lavabo com Barra Estampada',3,84,80,0,9,'Bella Dohler com Filó','mimostiapi','7671399685','2024-06-20 15:15:53','defaultProduct.png'),
(129,'Conj de Rosto e Lavabo com Barra Estampado',3,82,80,0,7,'Artesanalle Dohler Com Filó','mimostiapi','9162330352','2024-06-20 15:11:02','defaultProduct.png'),
(130,'Conj Banho e Rosto B. Mão Branco',3,82,170,0,9,'Bella Dohler ','mimostiapi','7300520458','2024-07-24 19:16:17','9147113f5e8fe2a811b435576ae621ac.jpg'),
(132,'Conj Banho, Rosto e Lavabo Branco B.Mão',3,85,200,0,9,'Bella Dohler M','mimostiapi','5136501976','2024-07-26 18:52:01','cfd39bc7b411194768cf77563cd7aa22.png'),
(133,'Avental Branco ',1,86,0,0,9,'Tecido Oxford','mimostiapi','2019284602','2024-07-29 19:15:32','bf9902840d2edde954ec23ed80c08773.jpg'),
(134,'Toalha Rosto B. Mão ',3,87,45,0,9,'Bella Dohler','mimostiapi','0247524399','2024-06-20 19:19:27','defaultProduct.png'),
(135,'Toalha de Rosto B. Maquina',3,87,45,0,9,'Santista','mimostiapi','4037536536','2024-06-20 19:22:17','defaultProduct.png'),
(136,'Toalha Rosto Santitas B. Mão Branco',3,87,45,0,9,'Santista','mimostiapi','9583154769','2024-06-20 19:23:30','defaultProduct.png'),
(137,'Toalha Rosto B. Maquina Branco',3,87,45,0,9,'Casa In','mimostiapi','5965528723','2024-06-20 19:24:35','defaultProduct.png'),
(138,'Toalha Rosto B. Maquina Creme',3,87,45,0,17,'Casa In','mimostiapi','9927475793','2024-06-20 19:26:38','defaultProduct.png'),
(139,'Conj Toalha Banho e Rosto B. Mão Branco',3,84,160,0,9,'Santista','mimostiapi','0699947537','2024-06-25 11:55:56','defaultProduct.png'),
(140,'Toalha Banho B. Mão Branco',3,88,80,0,9,'Bella Dohler','mimostiapi','5247769800','2024-06-20 19:46:47','defaultProduct.png'),
(141,'Conj Toalha Banho e Rosto B. Mão Amarela',3,84,160,0,18,'Santista','mimostiapi','3739069281','2024-06-25 11:55:34','defaultProduct.png'),
(142,'Conj Toalha Banho e Rosto B. Maquina Amarela',3,84,170,0,18,'Kasten','mimostiapi','6980401151','2024-07-29 19:40:13','d43e921ad5e24793a13a2698968ef986.jpg'),
(143,'Toalha Banho B. Maquina Branco',3,88,80,0,9,'Bella Dohler','mimostiapi','6070913619','2024-06-20 19:52:21','defaultProduct.png'),
(144,'Toalha Banho com Barra Branco',3,88,120,0,9,'Artesanalle Dohler','mimostiapi','4821437263','2024-06-20 19:54:03','defaultProduct.png'),
(145,'Toalha Banho com Barra Amarelo',3,88,80,0,9,'Santista','mimostiapi','4526107179','2024-06-20 19:56:55','defaultProduct.png'),
(146,'Conj Banho e Rosto B.Maquina Branco',3,84,170,0,9,'Firenze 3 ','mimostiapi','7724578345','2024-06-20 19:58:44','defaultProduct.png'),
(147,'Conj Toalha Banho e Rosto B.Maquina Rosa ',3,84,170,0,15,'Artesanalle Dohler','mimostiapi','5969442426','2024-06-25 12:00:36','defaultProduct.png'),
(148,'Conj Toalha Banho e Rosto B. Maquia Vermelho',3,84,170,0,10,'Artesanalle Dohler','mimostiapi','4668227050','2024-06-25 11:57:30','defaultProduct.png'),
(149,'Conj Toalha Banho e Rosto B.Maquina Azul',3,84,170,0,16,'Artesanalle Dohler','mimostiapi','9060491854','2024-07-24 18:48:34','12cb8b20b5e76960acbbdbb500563d87.jpg'),
(150,'Conj Banho e Rosto B. Mão B. Maquina Azul',3,84,170,0,16,'Artesanalle Dohler','mimostiapi','7384422478','2024-07-29 19:41:37','0efe52995f3cf7e4fff628fadda8dd4a.jpg'),
(151,'Conj Banho e Rosto B.Maquina Amarelo',3,84,170,0,18,'Artesanalle Dohler','mimostiapi','6474015474','2024-06-20 20:06:56','defaultProduct.png'),
(152,'Conj Banho e Rosto B. Maquina Salmão',3,84,170,0,20,'Artesanalle Dohler','mimostiapi','2920960636','2024-07-29 19:42:56','8ee1fb206be76f275ff8d92f88906510.jpg'),
(153,'Conj Banho e Rosto B. Maquina ',3,84,170,0,21,'Artesanalle Dohler','mimostiapi','4405548258','2024-06-20 20:31:07','defaultProduct.png'),
(154,'Conj Banho e Rosto B. Maquina Verde Menta',3,84,170,0,1,'Artesanalle Dohler','mimostiapi','9488546966','2024-06-20 20:33:20','defaultProduct.png'),
(155,'Conj Banho e Rosto B.Maquina Creme',3,84,170,0,17,'Artesanalle Dohler','mimostiapi','7187758254','2024-06-20 20:34:46','defaultProduct.png'),
(156,'Conj Banho e Rosto B . Maquina Branca',3,84,170,0,9,'Artesanalle Dohler','mimostiapi','4780165477','2024-06-20 20:37:22','defaultProduct.png'),
(157,'Conj Banho e Rosto B. Maquina Amarelo',3,84,170,0,18,'Firenze 3','mimostiapi','2229397457','2024-06-20 20:46:33','defaultProduct.png'),
(158,'Conj Banho, Rosto e Lavabo Rosa',3,85,200,0,15,'Artesanalle Dohler','mimostiapi','5159973848','2024-06-20 20:48:19','defaultProduct.png'),
(159,'Conj Banho, Rosto e Lavabo B',3,85,200,0,22,'Artesanalle Dohler','mimostiapi','0836629596','2024-06-20 20:50:27','defaultProduct.png'),
(160,'Capa de almofada ',4,89,20,0,7,'Capa para Almofada','mimostiapi','7549448515','2024-07-24 20:02:12','7bfd60687618f8bdda6d775edef250db.jpg'),
(161,'Conj Banho e Rosto B. Mão Lilas',3,84,160,0,22,'Santista','mimostiapi','6386225582','2024-06-20 21:02:26','defaultProduct.png'),
(162,'Conj Banho e Rosto B. Mão Azul',3,84,160,0,16,'Santista','mimostiapi','2378983018','2024-06-20 21:04:49','defaultProduct.png'),
(163,'Guardanapos Avulso Liso creme',1,90,8,0,17,'Guardanapo de Tricoline','mimostiapi','1753901693','2024-07-25 20:45:11','cfd39bc7b411194768cf77563cd7aa22.png'),
(164,'Guardanapos Avulso Liso Amarelo',1,90,8,0,18,'Guardanapos Tricoline','mimostiapi','4325097296','2024-06-21 12:16:52','defaultProduct.png'),
(165,'Guardanapos Avulso Liso Azul ',1,90,8,0,16,'Guardanapos de Ticoline','mimostiapi','0103509791','2024-06-21 12:18:08','defaultProduct.png'),
(166,'Guardanapos Avulso Liso Branco',1,90,8,0,9,'Guardanapos de Tricoline','mimostiapi','1196044254','2024-06-21 12:18:59','defaultProduct.png'),
(167,'Guardanapos Avulso Liso Verde Bandeira',1,90,8,0,23,'Guardanapos Tricoline','mimostiapi','7981947612','2024-06-21 12:20:26','defaultProduct.png'),
(168,'Guardanapos Avulso Liso Rosa ',1,90,8,0,15,'Guardanapos Tricoline','mimostiapi','5803397729','2024-06-21 12:21:12','defaultProduct.png'),
(169,'Guardanapos Avulso Liso Verde Limão',1,90,8,0,24,'Guardanapos Tricoline','mimostiapi','3527473085','2024-06-21 12:22:32','defaultProduct.png'),
(170,'Guardanapos Avulso Liso Branco',1,90,8,0,9,'Guardanapos Tricoline','mimostiapi','7150624593','2024-06-21 12:23:27','defaultProduct.png'),
(171,'Guardanapos Avulso Liso Preto ',1,90,8,0,25,'Guardanapos Tricoline','mimostiapi','7880373864','2024-06-21 12:24:40','defaultProduct.png'),
(172,'Guardanapos Avulso Poá Preto',1,90,8,0,25,'Guardanapos Poá','mimostiapi','5080690374','2024-06-21 12:26:07','defaultProduct.png'),
(173,'Guardapanos Avulso Poá Creme',1,90,8,0,17,'Guardanapos Poá','mimostiapi','9898086911','2024-06-21 12:27:26','defaultProduct.png'),
(174,'Guardanapos Avulso Poá Creme',1,90,8,0,17,'Guardanapos Poá','mimostiapi','6109816485','2024-06-21 12:29:18','defaultProduct.png'),
(175,'Guardanapos Avulso Poá Marrom ',1,90,8,0,26,'Guardanapos Poá','mimostiapi','4888058384','2024-06-21 12:30:47','defaultProduct.png'),
(176,'Guardanapos Avulso Poá Mostarda',1,90,8,0,27,'Guardanapos Poá','mimostiapi','4512147273','2024-06-21 12:32:01','defaultProduct.png'),
(177,'Jaleco Feminino Gola Comum ( P )',8,92,130,0,9,'Jaleco Feminino Gola Comum ( P )','mimostiapi','5688774145','2024-06-21 13:05:53','defaultProduct.png'),
(178,'Jaleco Feminino Gola Comum ( M )',8,92,130,0,9,'Jaleco Feminio Gola Comum ( M )','mimostiapi','7011273915','2024-06-21 13:07:09','defaultProduct.png'),
(179,'Jaleco Feminino Gola Comum ( G )',8,92,130,0,9,'Jaleco Feminino Gola Comum ( G )','mimostiapi','7044245461','2024-06-21 13:08:28','defaultProduct.png'),
(180,'Jaleco Masculino Gola Comum ( P)',8,92,130,0,9,'Jaleco Masculino Gola Comum (P)','mimostiapi','0167315400','2024-06-21 13:09:42','defaultProduct.png'),
(181,'Jaleco Masclino Gola Comum (M)',8,92,130,0,9,'Jaleco Masculino Gola Comum (P)','mimostiapi','9166863319','2024-06-21 13:11:20','defaultProduct.png'),
(182,'Jaleco Masculino Gola Comum ( G) ',8,92,130,0,9,'Jaleco Masculino Gola Comum (G)','mimostiapi','4849041010','2024-06-21 13:12:44','defaultProduct.png'),
(183,'Jaleco Feminino Gola Padre ( P) ',8,92,130,0,9,'Jaleco Feminino Gola Padre ( P)','mimostiapi','6071267404','2024-06-21 13:13:43','defaultProduct.png'),
(184,'Jaleco Feminino Gola Padre ( M) ',8,92,130,0,9,'Jaleco Feminino Gola Padre (M)','mimostiapi','7242983574','2024-06-21 13:15:14','defaultProduct.png'),
(185,'Jaleco Femininos Gola Padre ( G)',8,92,130,0,9,'Jaleco Feminino Gola Padre (G)','mimostiapi','6598168772','2024-06-21 13:16:40','defaultProduct.png'),
(186,'Jaleco Masculino Gola Padre ( P) ',8,92,130,0,9,'Jaleco Masculino Gola Padre (M)','mimostiapi','5897545117','2024-06-21 13:18:12','defaultProduct.png'),
(187,'Jaleco Masculino Gola Padre (G)',8,92,130,0,9,'Jaleco Masculino Gola Padre (G) ','mimostiapi','5939805258','2024-06-21 13:19:27','defaultProduct.png'),
(188,'Jaleco Masculino Gola Padre (M)',8,92,130,0,9,'Jaleco Masculino Gola Padre (M) ','mimostiapi','0864576269','2024-06-21 13:21:17','defaultProduct.png'),
(189,'Scrub Feminino Branco (P)',8,91,150,0,9,'Scrub Feminino (P)','mimostiapi','5075413303','2024-06-21 17:04:24','defaultProduct.png'),
(190,'Scrubs Feminino  Salmão (P)',8,91,150,0,19,'Scrub Feminino (P)','mimostiapi','4140828809','2024-06-21 17:05:55','defaultProduct.png'),
(191,'Scrubs Feminino Verde Amizade (P)',8,91,150,0,28,'Scrub Feminino (P)','mimostiapi','0582039205','2024-06-21 17:08:00','defaultProduct.png'),
(192,'Scrubs Feminino Morrom (M)',8,91,150,0,26,'Scrub Feminino (M)','mimostiapi','9881167149','2024-06-21 19:09:56','defaultProduct.png'),
(193,'Scrubs Masculino Chumbo (P)',8,91,150,0,29,'Scrub Masculino (P)','mimostiapi','8075231401','2024-06-21 19:11:41','defaultProduct.png'),
(194,'Scrubs Verde Bandeira (P)',8,91,150,0,23,'Scrub Masculino (P)','mimostiapi','1499545070','2024-06-21 19:12:27','defaultProduct.png'),
(195,'Scrubs Masculino Azul Marinho (P)',8,91,0,0,30,'Scrub Masculino (P)','mimostiapi','5060242312','2024-06-21 19:13:27','defaultProduct.png'),
(196,'Scrubs Masculino Verde Bandeira (G)',8,91,150,0,23,'Scrub Masculino (G)','mimostiapi','2225725007','2024-06-21 19:14:43','defaultProduct.png'),
(197,'Jaleco Provador Feminino ( P)',8,92,0,0,9,'PROVADOR ','mimostiapi','1784438915','2024-06-21 19:16:33','defaultProduct.png'),
(198,'Jaleco Provador Feminino (M)',8,92,0,0,9,'PROVADOR','mimostiapi','8406278503','2024-06-21 19:17:33','defaultProduct.png'),
(199,'Jaleco Provador Feminino (G) ',8,92,0,0,9,'PROVADOR ','mimostiapi','3001015663','2024-06-21 19:18:34','defaultProduct.png'),
(200,'Jaleco Provador Masculino (P)',8,92,0,0,9,'PROVADOR ','mimostiapi','8439617666','2024-06-21 19:19:52','defaultProduct.png'),
(201,'Jaleco Provador Masculino (M)',8,92,0,0,9,'PROVADOR','mimostiapi','8001420420','2024-06-21 19:20:41','defaultProduct.png'),
(202,'Jaleco Provador Masculino (G)',8,92,0,0,9,'PROVADOR ','mimostiapi','0835497858','2024-06-21 19:21:40','defaultProduct.png'),
(203,'Kit Pano de prato em Sacaria Páscoa',1,93,40,0,7,'Kit 3 Panos de prato em Sacaria','mimostiapi','7436576596','2024-06-21 19:29:17','defaultProduct.png'),
(204,'Pano de prato unidade Sacaria ',1,93,13.5,0,7,'Pano de prato em unidade Sacaria','mimostiapi','8622314002','2024-07-24 18:54:10','6efb04cebecef7d21b17eee022dfd66c.jpg'),
(205,'Bate Mão Páscoa de Felpa',1,93,35,0,7,'Bate mão Pascoa de Felpa ','mimostiapi','4732673697','2024-07-29 19:08:41','a48c887d7210736207d2c85067e79437.jpg'),
(206,'Kit Luva,  Pano de prato e Puxa saco Natalino',1,94,75,0,7,'Kit Natal Luva, Pano de prato e Puxa saco ','mimostiapi','0933034605','2024-06-21 19:45:55','defaultProduct.png'),
(207,'Kit Pano de prato com 3 Natalino',1,94,40,0,7,'Kit Pano de Prato Natalino','mimostiapi','8129781757','2024-06-21 19:47:46','defaultProduct.png'),
(208,'Kit Pano de Prato com Barra Especial Natalino ',1,94,50,0,7,'kit pano de prato sacaria com barra especial','mimostiapi','6394984315','2024-06-21 19:49:26','defaultProduct.png'),
(209,'Pano de Prato de Sacaria Bordado Natalino',1,94,30,0,7,'Pano de prato Bordado com uma Carinha','mimostiapi','0977080911','2024-06-21 20:07:08','defaultProduct.png'),
(210,'Jogo Americano com Passadeira Natalino',1,94,0,0,7,'Jogo Americano com Passadeira, Porta Talher e Pano de Prato ','mimostiapi','0485498233','2024-07-29 19:55:07','7c77b4b99fd986218c0fa9fa72e7de32.jpg'),
(211,'Jogo de Sousplat com 6 Lugares Natalino ',1,94,150,0,7,'Jogo de Sousplat com 6 Lugares Natalino ','mimostiapi','7544065782','2024-07-29 19:25:07','92b8424e3e372f60dc599f296bfc61b7.jpg'),
(212,'Conj Banho e Rosto B. Mão Verde Tiffany',3,84,170,0,31,'Toalha Bella Dohler','mimostiapi','5708631275','2024-06-28 12:40:00','defaultProduct.png'),
(215,'Jogo Americano Redondo c/ 6 lugares ',1,74,170,0,7,'Jogo Americano Redondo com bordado','mimostiapi','7531170105','2024-07-09 12:11:30','defaultProduct.png'),
(216,'Guardanapos Avulso Liso Vermelho',1,90,7,0,10,'Guardanapos Tricoline Vermelho','mimostiapi','9843076349','2024-07-25 20:52:13','defaultProduct.png'),
(217,'Guardanapo Azul Marinho ',1,90,8,0,30,'Guardanapo Tricoline Azul Marinho','mimostiapi','7514429917','2024-07-25 20:55:33','defaultProduct.png'),
(218,'Guardanapos Avulso Liso Verde Menta',1,90,8,0,32,'Tricoline Verde Menta','mimostiapi','5385786179','2024-07-25 20:57:25','defaultProduct.png'),
(219,'Guardanapos Avulso Liso Vinho',1,90,8,0,33,'Guardanapos Tricoline Vinho','mimostiapi','5965278860','2024-07-25 20:58:46','defaultProduct.png'),
(220,'Conj Banho, Rosto e Lavabo Creme B. Mão',3,85,200,0,17,'Dolher Bordado a mão Creme','mimostiapi','1924439774','2024-07-26 18:55:52','defaultProduct.png'),
(221,'Kit Bate Mão e pano de prato Natalino',1,21,40,0,6,'Kit Bate mão e pano de prato Bordado Natalino','mimostiapi','8783214587','2024-07-29 20:01:34','407ee2cdca276840f4ce14e07c8bfc94.jpg'),
(222,'conj.banho e rosto filó bordado à maq lilás dohler',3,88,200,0,22,'Artesanalle Dohler','mimostiapi','6273135200','2024-09-26 14:16:57','defaultProduct.png'),
(223,'conj.toalha rosto e banho bordado à maq filó',3,88,170,0,21,'Artesanalle Dohler','mimostiapi','1237574906','2024-09-26 14:21:56','defaultProduct.png'),
(224,'conj.banho e rosto bordada à mão dohler',3,88,170,0,17,'firenze 3','mimostiapi','9579371771','2024-09-26 14:25:04','defaultProduct.png'),
(225,'conj.toalha banho e rosto filó',3,87,80,0,6,'Dohler','mimostiapi','1437955368','2024-09-26 14:31:37','defaultProduct.png'),
(226,'toalha de rosto b. máq. ',3,88,45,0,9,'Kasten','mimostiapi','0939822186','2024-09-26 18:26:21','defaultProduct.png'),
(227,'lavabo branco b. maq. Dohler',3,79,45,0,9,'Dohler','mimostiapi','2003652486','2024-09-26 18:28:25','defaultProduct.png'),
(228,'Conj. rosto e lavabo B. máq. branca Dohler',3,82,75,0,9,'Dohler','mimostiapi','0618277947','2024-09-26 18:30:39','defaultProduct.png');

/*Table structure for table `produtos_categorias` */

DROP TABLE IF EXISTS `produtos_categorias`;

CREATE TABLE `produtos_categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `secao` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `secao` (`secao`),
  CONSTRAINT `produtos_categorias_ibfk_1` FOREIGN KEY (`secao`) REFERENCES `produtos_secoes` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `produtos_categorias` */

insert  into `produtos_categorias`(`id`,`nome`,`secao`) values 
(1,'Pano de prato',1),
(2,'Pano de prato barra especial',1),
(3,'Pano de prato sacaria',1),
(7,'Bate mão',1),
(8,'Bate mão',1),
(9,'Avental bate mão',1),
(10,'Luva',1),
(14,'Puxa Saco',1),
(15,'teste',1),
(16,'teste23sahdgsadfsya',1),
(17,'teste3127673821',1),
(18,'skajdksajdlksdlkskj',1),
(20,'Descanso de Panela',1),
(21,'Kit Bate mão e pano de prato',1),
(22,'Capa para filtro d\'agua',1),
(24,'Porta ovos de galinha',1),
(25,'Porta calcinha ',2),
(26,'Porta Remedio',2),
(27,'Porta papel higienico triplo',2),
(28,'Porta papel higienico individual',2),
(29,'Porta Treco',2),
(30,'Porta absorvente ',2),
(31,'Porta garrafa',2),
(32,'Porta oculos',2),
(33,'Porta documento',2),
(34,'Porta Moeda',2),
(35,'Porta Joia Redondo',2),
(36,'Luva dupla ',2),
(37,'Luva galinha',1),
(38,'Porta Joia Carteira',2),
(39,'Tapa Olho',2),
(40,'Porta Joia Necessaire',2),
(41,'Kit Pano de queijo',1),
(42,'Pano de prato com felpa ',1),
(43,'Bate mão',1),
(44,'Pano de copa ',1),
(45,'Kit Necessaire',2),
(46,'Bolsa de Lona',2),
(47,'Bolsa Lave- me e Use- me ',2),
(48,'Frasqueira ',2),
(49,'Necessaire',2),
(50,'Bolsa de feira',2),
(51,'Bolsa de Saco',2),
(52,'Bolsa Belinha ',2),
(53,'Bolsa Toalha molhada',2),
(54,'Bolsa de Praia',2),
(56,'Conj de Lençol',5),
(57,'Porta Marmita',1),
(58,'Kit 7 peças',1),
(59,'Toalha de Mesa',1),
(60,'Kit Porta pão',1),
(61,'Passadeira',1),
(62,'Edredom',5),
(63,'Primeiras Trocas',6),
(64,'Cueiro',6),
(65,'Kit Luva, Pano de prato e descanso de Panela',1),
(66,'Kit Luva, Pano de prato e descanso de Panela',1),
(67,'Kit Luva, Pano de prato e Avental',1),
(68,'Conj com 3 Fraldas Safari ',6),
(70,'Conj de 6 Fraldas (Caixa)',6),
(71,'Conj de Fraldas de boca',6),
(72,'Lençol de Berço',6),
(74,'Jogo Americano',1),
(75,'Sousplat',1),
(76,'Conj de Sousplat',1),
(78,'Kit de lavabo',3),
(79,'Lavabo',1),
(80,'Igreja',7),
(81,'Lavabo com Papel Higienico',3),
(82,'Conj de Rosto e Lavabo',3),
(84,'Conj Banho e Rosto',3),
(85,'Banho Rosto e Lavabo',3),
(86,'Avental Oxford',1),
(87,'Toalha Rosto',3),
(88,'Toalha de Banho',3),
(89,'Capa de almofada',4),
(90,'Guardanapos',1),
(91,'Scrubs',8),
(92,'Jaleco',8),
(93,'Páscoa',1),
(94,'Natalino',1);

/*Table structure for table `produtos_cor` */

DROP TABLE IF EXISTS `produtos_cor`;

CREATE TABLE `produtos_cor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `produtos_cor` */

insert  into `produtos_cor`(`id`,`nome`) values 
(1,'colorido'),
(2,'vermelho e branco'),
(3,'vermelha e branca'),
(4,'branco com barras'),
(5,'Bordado'),
(6,'Branco com estampa '),
(7,'Estampado'),
(8,'Estampado'),
(9,'Branco'),
(10,'Vermelho'),
(11,'Branco e Azul '),
(12,'Verde, Lilas e Amarelo'),
(13,'Branco e Verde'),
(14,'Rosa e Branco'),
(15,'Rosa'),
(16,'Azul'),
(17,'Creme'),
(18,'Amarelo'),
(19,'Salmão'),
(20,'Salmão'),
(21,'Bege'),
(22,'Lilas'),
(23,'Verde Bandeira'),
(24,'Verde Limão'),
(25,'Preto'),
(26,'Marrom'),
(27,'Mustarda'),
(28,'Verde Amizade'),
(29,'Chumbo'),
(30,'Azul Marinho'),
(31,'Verde Tiffany'),
(32,'Verde Menta'),
(33,'Vinho');

/*Table structure for table `produtos_secoes` */

DROP TABLE IF EXISTS `produtos_secoes`;

CREATE TABLE `produtos_secoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `produtos_secoes` */

insert  into `produtos_secoes`(`id`,`nome`) values 
(1,'Cozinha'),
(2,'Diversos'),
(3,'Banho'),
(4,'Diversos'),
(5,'Cama'),
(6,'Infantil'),
(7,'Religioso'),
(8,'Jalecos e Scrubs');

/*Table structure for table `usuarios` */

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `ativo` int(11) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `usuarios` */

insert  into `usuarios`(`id`,`usuario`,`senha`,`ativo`) values 
(1,'mimostiapi','$2b$10$61bAulFisC9qhISsLqYEsexH.SSVDXY0nggKuYD4Hr1x9b36QV3jy',1),
(2,'laura','$2b$10$Z.WaxTMbSPJTqLcA8mR4Mu9vE0Kbh3yrUz.KhU.IxVZOorihE2nFC',1);

/*Table structure for table `vendedores` */

DROP TABLE IF EXISTS `vendedores`;

CREATE TABLE `vendedores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cpf_cnpj` varchar(255) NOT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `ponto_referencia` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `datecreated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `vendedores` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
