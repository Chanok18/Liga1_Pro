-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: liga1pro_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `liga1pro_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `liga1pro_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `liga1pro_db`;

--
-- Table structure for table `equipos`
--

DROP TABLE IF EXISTS `equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ciudad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entrenador` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escudo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estadio` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anio_fundacion` int DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
INSERT INTO `equipos` VALUES (1,'Lima','Héctor Cúper','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Monumental U Marathon',1924,'Universitario'),(2,'Lima','Pablo Guede','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Alejandro Villanueva',1901,'Alianza Lima'),(3,'Lima','Paulo Autuori','https://media.api-sports.io/football/teams/2546.png','Estadio Alberto Gallardo',1955,'Sporting Cristal'),(4,'Arequipa','Juan Reynoso','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Monumental UNSA',1915,'FBC Melgar'),(5,'Cusco','Horacio Melgarejo','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Inca Garcilaso',1901,'Cienciano'),(6,'Cusco','Miguel Rondelli','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Inca Garcilaso',2010,'Cusco FC'),(7,'Cusco','Sebastián Domínguez','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Inca Garcilaso',2007,'Deportivo Garcilaso'),(8,'Huancayo','Roberto Mosquera','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Huancayo',2008,'Sport Huancayo'),(9,'Tarma','Diego Ripacolli','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Unión Tarma',1984,'ADT'),(10,'Andahuaylas','Walter Paolella','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Los Chankas',2011,'Los Chankas'),(11,'Piura','Gerardo Ameli','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Campeones del 36',1919,'Atlético Grau'),(12,'Sullana','Federico Urciuoli','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Campeones del 36',1920,'Alianza Atlético'),(13,'Callao','Carlos Desio','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Miguel Grau',1927,'Sport Boys'),(14,'Cajamarca','Carlos Bustos','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Germán Contreras Jara',1908,'UTC'),(15,'Cutervo','Claudio Biaggio','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Juan Maldonado Gamarra',2008,'Comerciantes Unidos'),(16,'Chongoyape','Marcelo Zuleta','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Juan Pablo II',2010,'Juan Pablo II College'),(17,'Cajamarca','Celso Ayala','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','Héroes de San Ramón',2010,'FC Cajamarca'),(18,'Moquegua','Jaime Serna','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120','25 de Noviembre',1965,'CD Moquegua');
/*!40000 ALTER TABLE `equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos_favoritos`
--

DROP TABLE IF EXISTS `equipos_favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos_favoritos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `equipo_id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKq72bgx1kya2g27738gmfis0eo` (`equipo_id`),
  KEY `FKeamntqxeybsujq7ia6kx8v7me` (`usuario_id`),
  CONSTRAINT `FKeamntqxeybsujq7ia6kx8v7me` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `FKq72bgx1kya2g27738gmfis0eo` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos_favoritos`
--

LOCK TABLES `equipos_favoritos` WRITE;
/*!40000 ALTER TABLE `equipos_favoritos` DISABLE KEYS */;
INSERT INTO `equipos_favoritos` VALUES (2,1,1),(5,3,5);
/*!40000 ALTER TABLE `equipos_favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estadisticas_jugadores`
--

DROP TABLE IF EXISTS `estadisticas_jugadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estadisticas_jugadores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amarillas` int NOT NULL,
  `asistencias` int NOT NULL,
  `goles` int NOT NULL,
  `minutos_jugados` int NOT NULL,
  `rojas` int NOT NULL,
  `titular` bit(1) NOT NULL,
  `jugador_id` bigint NOT NULL,
  `partido_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs52gob5e1iawrr9jrctued6a5` (`jugador_id`),
  KEY `FKp65r4oqnx4x7yu0yt5d5icnri` (`partido_id`),
  CONSTRAINT `FKp65r4oqnx4x7yu0yt5d5icnri` FOREIGN KEY (`partido_id`) REFERENCES `partidos` (`id`),
  CONSTRAINT `FKs52gob5e1iawrr9jrctued6a5` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estadisticas_jugadores`
--

LOCK TABLES `estadisticas_jugadores` WRITE;
/*!40000 ALTER TABLE `estadisticas_jugadores` DISABLE KEYS */;
INSERT INTO `estadisticas_jugadores` VALUES (1,0,0,2,90,0,_binary '',12,2),(2,1,2,1,90,0,_binary '',8,2),(3,0,1,0,78,0,_binary '',13,2),(4,0,1,0,85,0,_binary '',10,2),(5,1,0,0,90,0,_binary '',11,2);
/*!40000 ALTER TABLE `estadisticas_jugadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grupos_chat`
--

DROP TABLE IF EXISTS `grupos_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupos_chat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `admin_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2o35g659j3eobddal62em8ik5` (`admin_id`),
  CONSTRAINT `FK2o35g659j3eobddal62em8ik5` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupos_chat`
--

LOCK TABLES `grupos_chat` WRITE;
/*!40000 ALTER TABLE `grupos_chat` DISABLE KEYS */;
INSERT INTO `grupos_chat` VALUES (1,'Conversaciones de Universitario','2026-06-20 09:21:18.864485','Hinchada Crema',1),(2,'Debate y recomendaciones de Alianza','2026-06-20 09:21:18.867012','Fans de Alianza',1),(3,'Temas generales del torneo','2026-06-20 09:21:18.870026','Liga 1 General',1),(4,'Charlas tácticas y estadísticas','2026-06-20 09:21:18.872536','Análisis Táctico',1);
/*!40000 ALTER TABLE `grupos_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jugadores`
--

DROP TABLE IF EXISTS `jugadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jugadores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `edad` int DEFAULT NULL,
  `foto_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nacionalidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_camiseta` int DEFAULT NULL,
  `posicion` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `equipo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpgvjfh3sggymha61n8qjoic5t` (`equipo_id`),
  CONSTRAINT `FKpgvjfh3sggymha61n8qjoic5t` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jugadores`
--

LOCK TABLES `jugadores` WRITE;
/*!40000 ALTER TABLE `jugadores` DISABLE KEYS */;
INSERT INTO `jugadores` VALUES (1,'Romero',23,NULL,'Peruano','Diego',1,'Portero',1),(2,'Heredia',34,NULL,'Peruano','Manuel',12,'Portero',1),(3,'Corzo',37,NULL,'Peruano','Aldo',2,'Defensa',1),(4,'Di Benedetto',33,NULL,'Argentino','Matías',5,'Defensa',1),(5,'Riveros',33,NULL,'Paraguayo','Williams',3,'Defensa',1),(6,'Dulanto',30,NULL,'Peruano','Gustavo',4,'Defensa',1),(7,'Carabalí',28,NULL,'Ecuatoriano','Joaquín',27,'Defensa',1),(8,'Concha',26,NULL,'Peruano','Jairo',17,'Mediocampista',1),(9,'Murrugarra',29,NULL,'Peruano','Jorge',23,'Mediocampista',1),(10,'Calcaterra',36,NULL,'Argentino','Horacio',10,'Mediocampista',1),(11,'Polo',31,NULL,'Peruano','Andy',7,'Mediocampista',1),(12,'Valera',29,NULL,'Peruano','Alex',9,'Delantero',1),(13,'Flores',31,NULL,'Peruano','Edison',19,'Delantero',1),(14,'Rivera',27,NULL,'Peruano','José',11,'Delantero',1);
/*!40000 ALTER TABLE `jugadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mensajes_chat`
--

DROP TABLE IF EXISTS `mensajes_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes_chat` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contenido` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `tipo` enum('EQUIPO','GRUPO','PARTIDO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_chat_id` bigint DEFAULT NULL,
  `partido_id` bigint DEFAULT NULL,
  `usuario_id` bigint NOT NULL,
  `partido_chat_id` bigint DEFAULT NULL,
  `equipo_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbqxkmgybm4cofbhh7juf99oob` (`grupo_chat_id`),
  KEY `FKabl69xbw14pctv386t65h0le8` (`partido_id`),
  KEY `FKm01vy1avpn4f9h5dwnsa75oof` (`usuario_id`),
  KEY `FK68nw1djoeipckpaks4x1nw323` (`equipo_id`),
  CONSTRAINT `FK68nw1djoeipckpaks4x1nw323` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`),
  CONSTRAINT `FKabl69xbw14pctv386t65h0le8` FOREIGN KEY (`partido_id`) REFERENCES `partidos` (`id`),
  CONSTRAINT `FKbqxkmgybm4cofbhh7juf99oob` FOREIGN KEY (`grupo_chat_id`) REFERENCES `grupos_chat` (`id`),
  CONSTRAINT `FKm01vy1avpn4f9h5dwnsa75oof` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes_chat`
--

LOCK TABLES `mensajes_chat` WRITE;
/*!40000 ALTER TABLE `mensajes_chat` DISABLE KEYS */;
INSERT INTO `mensajes_chat` VALUES (1,'raaa','2026-06-21 08:41:29.070461','EQUIPO',NULL,NULL,5,NULL,3),(2,'xddd','2026-06-21 08:41:32.619914','EQUIPO',NULL,NULL,5,NULL,3);
/*!40000 ALTER TABLE `mensajes_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `miembros_grupo`
--

DROP TABLE IF EXISTS `miembros_grupo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `miembros_grupo` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rol` enum('ADMIN','MIEMBRO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKljq9smpb6v0i6cvq7ivujskok` (`grupo_id`),
  KEY `FK1cqwrkds73riyt44ewgcu5fx5` (`usuario_id`),
  CONSTRAINT `FK1cqwrkds73riyt44ewgcu5fx5` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `FKljq9smpb6v0i6cvq7ivujskok` FOREIGN KEY (`grupo_id`) REFERENCES `grupos_chat` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `miembros_grupo`
--

LOCK TABLES `miembros_grupo` WRITE;
/*!40000 ALTER TABLE `miembros_grupo` DISABLE KEYS */;
INSERT INTO `miembros_grupo` VALUES (1,'MIEMBRO',1,3);
/*!40000 ALTER TABLE `miembros_grupo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidos`
--

DROP TABLE IF EXISTS `partidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partidos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `estadio` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('EN_VIVO','FINALIZADO','PROGRAMADO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` date DEFAULT NULL,
  `goles_local` int DEFAULT NULL,
  `goles_visitante` int DEFAULT NULL,
  `hora` time(6) DEFAULT NULL,
  `jornada` int DEFAULT NULL,
  `equipo_local_id` bigint NOT NULL,
  `equipo_visitante_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd6cv3dwhtshyq9xflfx1y4nal` (`equipo_local_id`),
  KEY `FKe7ln7774h7n6t0s86flxcr15d` (`equipo_visitante_id`),
  CONSTRAINT `FKd6cv3dwhtshyq9xflfx1y4nal` FOREIGN KEY (`equipo_local_id`) REFERENCES `equipos` (`id`),
  CONSTRAINT `FKe7ln7774h7n6t0s86flxcr15d` FOREIGN KEY (`equipo_visitante_id`) REFERENCES `equipos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidos`
--

LOCK TABLES `partidos` WRITE;
/*!40000 ALTER TABLE `partidos` DISABLE KEYS */;
INSERT INTO `partidos` VALUES (1,'Juan Pablo II','FINALIZADO','2026-05-23',1,1,'15:00:00.000000',16,16,4),(2,'25 de Noviembre','FINALIZADO','2026-05-24',0,3,'12:45:00.000000',16,18,1),(3,'Alejandro Villanueva','FINALIZADO','2026-05-24',2,0,'15:30:00.000000',16,2,10),(4,'Alberto Gallardo','PROGRAMADO','2026-05-25',0,0,'15:00:00.000000',16,3,9),(5,'Huancayo','PROGRAMADO','2026-05-25',0,0,'15:00:00.000000',16,8,5),(6,'Campeones del 36','PROGRAMADO','2026-05-25',0,0,'15:00:00.000000',16,12,17),(7,'Juan Maldonado Gamarra','PROGRAMADO','2026-05-26',0,0,'15:00:00.000000',16,15,7),(8,'Inca Garcilaso','PROGRAMADO','2026-05-24',0,0,'15:00:00.000000',16,6,11),(9,'Germán Contreras Jara','PROGRAMADO','2026-05-24',0,0,'15:00:00.000000',16,14,13);
/*!40000 ALTER TABLE `partidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_registro` datetime(6) DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('ADMIN','USER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` bit(1) NOT NULL,
  `fecha_eliminacion` datetime(6) DEFAULT NULL,
  `ultimo_acceso` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKkfsp0s1tflm1cwlj8idhqsad0` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin@liga1pro.com','2026-06-20 09:21:18.853441','Administrador Liga1 Pro','$2a$10$2oYJI.3qsoiJUVx71RChW.gYfGE08A8qGWSTNuhm6Arnn0iqPpOQe','ADMIN',_binary '',NULL,'2026-06-21 20:18:00.268138'),(2,'test1781929518@liga1pro.com','2026-06-20 09:25:19.124716','Test Codex','$2a$10$sA7j/HX60we/MrInKmGPTulz9R5L7UbBULc3qALqwr6p2Xz9mM1bu','USER',_binary '',NULL,NULL),(3,'fdsas@gmail.com','2026-06-20 09:30:53.355886','Fafdsf','$2a$10$q6Q6gf.iwROQO.VV/zLabuH5Ekgfvn4GIgLWIUrfe85SsRc0/dXMC','USER',_binary '',NULL,NULL),(4,'asd@gmail.com','2026-06-20 09:31:12.093682','fasdsa','$2a$10$1dxuy/c71ed.5830YnF.J.Wh8xMS1xrSGDl4jal0ibUHUxC9gSB1W','USER',_binary '',NULL,NULL),(5,'dsaasd@gmail.com','2026-06-21 07:52:03.395532','asd','$2a$10$lA139cj50sblpZnS1q5t9uAK6PBlQrCCenyRJH8bWAYSz/vkeXjsO','ADMIN',_binary '',NULL,'2026-06-22 03:08:14.308436'),(6,'tester_codex@example.com','2026-06-21 07:58:09.464672','tester_codex','$2a$10$hlgoaW4SQ6V8rizX3kwIEeCpNf0lselyWP1BQa7JCd1cHj.GI.Uvu','USER',_binary '',NULL,NULL),(7,'dsa@gmail.com','2026-06-21 20:49:59.147006','dsa','$2a$10$7Jf.HnlXCJ8lrKb1/tWeHep5cR5EGozXkgCg6IYHyCPHplyJNfM9C','USER',_binary '',NULL,'2026-06-21 20:50:05.229830');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'liga1pro_db'
--

--
-- Dumping routines for database 'liga1pro_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-22  2:16:36
