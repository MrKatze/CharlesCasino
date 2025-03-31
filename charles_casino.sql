-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 31-03-2025 a las 05:25:56
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `charles_casino`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canje`
--

DROP TABLE IF EXISTS `canje`;
CREATE TABLE IF NOT EXISTS `canje` (
  `id_canje` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  PRIMARY KEY (`id_canje`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `egreso`
--

DROP TABLE IF EXISTS `egreso`;
CREATE TABLE IF NOT EXISTS `egreso` (
  `id_egreso` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  PRIMARY KEY (`id_egreso`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=254 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `egreso`
--

INSERT INTO `egreso` (`id_egreso`, `id_usuario`, `monto`, `metodo`, `fecha`, `hora`) VALUES
(246, 2, 100.00, 'apuesta_blackjack', '2025-03-31', '20:56:15'),
(247, 2, 100.00, 'apuesta_blackjack', '2025-03-31', '20:56:39'),
(248, 2, 100.00, 'apuesta_ruleta', '2025-03-31', '20:56:59'),
(249, 2, 10.00, 'apuesta_tragaperras', '2025-03-31', '20:57:08'),
(250, 2, 10.00, 'apuesta_tragaperras', '2025-03-31', '20:57:13'),
(251, 2, 10.00, 'apuesta_tragaperras', '2025-03-31', '20:57:17'),
(252, 2, 10.00, 'apuesta_tragaperras', '2025-03-31', '21:13:26'),
(253, 2, 10.00, 'apuesta_tragaperras', '2025-03-31', '23:24:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gamelog`
--

DROP TABLE IF EXISTS `gamelog`;
CREATE TABLE IF NOT EXISTS `gamelog` (
  `id_gamelog` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_juego` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `monto_apostado` decimal(10,2) NOT NULL,
  `resultado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_gamelog`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingreso`
--

DROP TABLE IF EXISTS `ingreso`;
CREATE TABLE IF NOT EXISTS `ingreso` (
  `id_ingreso` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  PRIMARY KEY (`id_ingreso`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `ingreso`
--

INSERT INTO `ingreso` (`id_ingreso`, `id_usuario`, `monto`, `metodo`, `fecha`, `hora`) VALUES
(1, 2, 2.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(2, 2, 22.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(3, 2, 20.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(4, 2, 2.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(5, 2, 22.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(6, 2, 2.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(7, 2, 22.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(8, 2, 2.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(9, 2, 22.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(10, 2, 48.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(11, 2, 22.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(12, 2, 46.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(13, 2, 22.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(14, 2, 22.00, 'apuesta_blackjack', '2025-03-26', '00:00:00'),
(15, 2, 22.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(16, 2, 22.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(17, 2, 182.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(18, 2, 44.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(19, 2, 44.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(20, 2, 52.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(21, 2, 104.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(22, 2, 8.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(23, 2, 16.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(24, 2, 32.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(25, 2, 64.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(26, 2, 128.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(27, 2, 132.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(28, 2, 17.00, 'apuesta_blackjack_empate', '2025-03-27', '00:00:00'),
(29, 2, 230.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(30, 2, 500.00, 'apuesta_blackjack_empate', '2025-03-27', '00:00:00'),
(31, 2, 84.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(32, 2, 54.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(33, 2, 1110.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(34, 2, 11.00, 'apuesta_blackjack_empate', '2025-03-27', '00:00:00'),
(35, 2, 120.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(36, 2, 40.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(37, 2, 84.00, 'apuesta_blackjack_empate', '2025-03-27', '00:00:00'),
(38, 2, 200.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(39, 2, 444.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(40, 2, 222.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(41, 2, 51.00, 'apuesta_blackjack_empate', '2025-03-27', '00:00:00'),
(42, 2, 102.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(43, 2, 22.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(44, 2, 346.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(45, 2, 120.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(46, 2, 302.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(47, 2, 54.00, 'apuesta_blackjack_empate', '2025-03-27', '00:00:00'),
(48, 2, 42.00, 'apuesta_blackjack', '2025-03-27', '00:00:00'),
(49, 2, 41.00, 'apuesta_blackjack_empate', '2025-03-27', '00:00:00'),
(50, 2, 45.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(51, 2, 45.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(52, 2, 45.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(53, 2, 45.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(54, 2, 45.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(55, 2, 45.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(56, 2, 45.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(57, 2, 45.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(58, 2, 12.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(59, 4, 12.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(60, 4, 12.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(61, 4, 12.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(62, 4, 12.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(63, 4, 12.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(64, 4, 12.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(65, 4, 12.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(66, 4, 12.00, 'ver_anuncio', '2025-03-28', '00:00:00'),
(67, 3, 94.00, 'apuesta_blackjack_empate', '2025-03-29', '00:00:00'),
(68, 3, 12.00, 'ver_anuncio', '2025-03-29', '00:00:00'),
(69, 4, 12.00, 'ver_anuncio', '2025-03-29', '00:00:00'),
(70, 4, 12.00, 'ver_anuncio', '2025-03-29', '00:00:00'),
(71, 2, 4.00, 'apuesta_blackjack', '2025-03-30', '00:00:00'),
(72, 3, 80.00, 'apuesta_blackjack', '2025-03-31', '18:43:29'),
(73, 3, 0.00, 'ganancia_ruleta', '2025-03-31', '18:44:26'),
(74, 3, 12.00, 'ver_anuncio', '2025-03-31', '18:48:20'),
(151, 42, 12.00, 'ver_anuncio', '2025-03-31', '23:25:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(50) NOT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `rol`) VALUES
(1, 'Administrador'),
(2, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_rol` int NOT NULL,
  `puntos` int DEFAULT '0',
  `username` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `correo` (`correo`),
  KEY `id_rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `id_rol`, `puntos`, `username`, `correo`, `password`) VALUES
(2, 2, 6953, 'usuario1', 'usuario1@casino.com', 'userpass1'),
(3, 2, 18, 'usuario2', 'usuario2@casino.com', 'userpass2'),
(4, 1, NULL, 'Nuevo', 'nuevo@correo.com', '123456'),
(42, 2, 12, 'prueba1', 'prueba1@gmail.com', 'prueba1');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `canje`
--
ALTER TABLE `canje`
  ADD CONSTRAINT `Canje_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `egreso`
--
ALTER TABLE `egreso`
  ADD CONSTRAINT `Egreso_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `gamelog`
--
ALTER TABLE `gamelog`
  ADD CONSTRAINT `Gamelog_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD CONSTRAINT `Ingreso_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `Usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
