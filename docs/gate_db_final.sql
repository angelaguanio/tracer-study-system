-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: sql309.byetcluster.com
-- Generation Time: Oct 02, 2026 at 10:02 AM
-- Server version: 11.4.13-MariaDB
-- PHP Version: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `if0_42284314_gate_db_final`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `country` varchar(255) NOT NULL DEFAULT 'Philippines',
  `street_address` varchar(255) DEFAULT NULL,
  `subdivision` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `full_address` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `country`, `street_address`, `subdivision`, `region`, `province`, `city`, `barangay`, `zip_code`, `full_address`, `created_at`, `updated_at`) VALUES
(1, 1, 'Philippines', NULL, NULL, 'Central Luzon', 'Nueva Ecija', 'City of Gapan', 'San Vicente (Pob.)', '3105', 'Brgy. San Vicente (Pob.), City of Gapan 3105, Nueva Ecija, Central Luzon, Philippines', '2026-09-21 19:08:56', '2026-09-25 10:07:17'),
(2, 2, 'Philippines', 'Purok II', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', 'Purok II, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:57', '2026-09-21 19:08:57'),
(3, 3, 'Philippines', 'Purok 6', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cuyapo', '', '3117', 'Purok 6, Cuyapo 3117, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:57', '2026-09-21 19:08:57'),
(4, 4, 'Philippines', 'Purok 4', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Purok 4, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:57', '2026-09-21 19:08:57'),
(5, 5, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Zaragoza', '', '3100', 'Zaragoza 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:57', '2026-09-21 19:08:57'),
(6, 6, 'Philippines', 'Rizal St.', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Santa Rosa', '', '3101', 'Rizal St., Santa Rosa 3101, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:58', '2026-09-21 19:08:58'),
(7, 7, 'Philippines', 'Purok Santan 1', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Talavera', '', '3114', 'Purok Santan 1, Talavera 3114, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:58', '2026-09-21 19:08:58'),
(8, 8, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Rizal', '', '3127', 'Rizal 3127, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:58', '2026-09-21 19:08:58'),
(9, 9, 'Philippines', 'Zone 7', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Talugtug', '', '3118', 'Zone 7, Talugtug 3118, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:59', '2026-09-21 19:08:59'),
(10, 10, 'Philippines', 'A. De Belen St.', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Jaen', '', '3109', 'A. De Belen St., Jaen 3109, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:59', '2026-09-21 19:08:59'),
(11, 11, 'Philippines', 'Gulod 2', '', 'Region III - Central Luzon', 'Nueva Ecija', 'General Tinio', '', '3104', 'Gulod 2, General Tinio 3104, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:08:59', '2026-09-21 19:08:59'),
(12, 12, 'Philippines', 'Narra 1', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Narra 1, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:00', '2026-09-21 19:09:00'),
(13, 13, 'Philippines', 'Burgos', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Sto. Domingo', '', '3133', 'Burgos, Sto. Domingo 3133, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:00', '2026-09-21 19:09:00'),
(14, 14, 'Philippines', 'Lacuna St.', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Jaen', '', '3103', 'Lacuna St., Jaen 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:00', '2026-09-21 19:09:00'),
(15, 15, 'Philippines', 'Purok 1', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Antonio', '', '3109', 'Purok 1, San Antonio 3109, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:01', '2026-09-21 19:09:01'),
(16, 16, 'Philippines', 'Purok 2', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3108', 'Purok 2, Gapan City 3108, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:01', '2026-09-21 19:09:01'),
(17, 17, 'Philippines', 'Dr. Ramos St.', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Bongabon', '', '3128', 'Dr. Ramos St., Bongabon 3128, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:01', '2026-09-21 19:09:01'),
(18, 18, 'Philippines', 'Purok 7a.', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Carranglan', '', '3123', 'Purok 7a., Carranglan 3123, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:01', '2026-09-21 19:09:01'),
(19, 19, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Antonio', '', '3102', 'San Antonio 3102, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:02', '2026-09-21 19:09:02'),
(20, 20, 'Philippines', '95 Real St.', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Santa Rosa', '', '3100', '95 Real St., Santa Rosa 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:02', '2026-09-21 19:09:02'),
(21, 21, 'Philippines', 'Purok 1', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Leonardo', '', '3100', 'Purok 1, San Leonardo 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:02', '2026-09-21 19:09:02'),
(22, 22, 'Philippines', 'Blk 3 Lot 5', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Blk 3 Lot 5, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:03', '2026-09-21 19:09:03'),
(23, 23, 'Philippines', 'Purok 4', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Zaragoza', '', '3122', 'Purok 4, Zaragoza 3122, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:03', '2026-09-21 19:09:03'),
(24, 24, 'Philippines', '15 Purok', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Zaragoza', '', '3100', '15 Purok, Zaragoza 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:03', '2026-09-21 19:09:03'),
(25, 25, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Lupao', '', '3108', 'Lupao 3108, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:03', '2026-09-21 19:09:03'),
(26, 26, 'Philippines', '256', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3110', '256, Cabanatuan City 3110, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:04', '2026-09-21 19:09:04'),
(27, 27, 'Philippines', 'Pitong Gatang Street', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Antonio', '', '3105', 'Pitong Gatang Street, San Antonio 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:04', '2026-09-21 19:09:04'),
(28, 28, 'Philippines', 'Purok 5', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Zaragoza', '', '3133', 'Purok 5, Zaragoza 3133, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:04', '2026-09-21 19:09:04'),
(29, 29, 'Philippines', 'Block 1', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3100', 'Block 1, Gapan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:04', '2026-09-21 19:09:04'),
(30, 30, 'Philippines', 'Camino Drive', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Sto.domingo', '', '3100', 'Camino Drive, Sto.domingo 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:05', '2026-09-21 19:09:05'),
(31, 31, 'Philippines', '875 Purok 4', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3110', '875 Purok 4, Cabanatuan City 3110, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:05', '2026-09-21 19:09:05'),
(32, 32, 'Philippines', 'Blk 43 Lot 16 Devonshire Street', 'Grand Victoria Subdivision', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3106', 'Blk 43 Lot 16 Devonshire Street, Grand Victoria Subdivision, Cabanatuan City 3106, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:05', '2026-09-21 19:09:05'),
(33, 33, 'Philippines', 'Purok 6', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Zaragoza', '', '3205', 'Purok 6, Zaragoza 3205, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:06', '2026-09-21 19:09:06'),
(34, 34, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Isidro', '', '3125', 'San Isidro 3125, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:06', '2026-09-21 19:09:06'),
(35, 35, 'Philippines', 'Malaya Dilasag', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Aurora', '', '3105', 'Malaya Dilasag, Aurora 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:06', '2026-09-21 19:09:06'),
(36, 36, 'Philippines', 'Purok Repolyo', '', 'Region III - Central Luzon', 'Nueva Ecija', 'General Mamerto Natividad', '', '2314', 'Purok Repolyo, General Mamerto Natividad 2314, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:06', '2026-09-21 19:09:06'),
(37, 37, 'Philippines', '50 Purok 1', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3119', '50 Purok 1, Gapan City 3119, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:07', '2026-09-21 19:09:07'),
(38, 38, 'Philippines', '286', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Tarlac', '', '3100', '286, Tarlac 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:07', '2026-09-21 19:09:07'),
(39, 39, 'Philippines', '69 Don Manuel', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3104', '69 Don Manuel, Cabanatuan City 3104, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:07', '2026-09-21 19:09:07'),
(40, 40, 'Philippines', 'Purok Santan 1B', '', 'Region III - Central Luzon', 'Nueva Ecija', 'General Tinio', '', '3103', 'Purok Santan 1B, General Tinio 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:07', '2026-09-21 19:09:07'),
(41, 41, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Science City Of Muñoz', '', '3119', 'Science City Of Muñoz 3119, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:08', '2026-09-21 19:09:08'),
(42, 42, 'Philippines', '69 Don Manuel', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', '69 Don Manuel, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:08', '2026-09-21 19:09:08'),
(43, 43, 'Philippines', 'Purok Santan B', '', 'Region III - Central Luzon', 'Nueva Ecija', 'General Tinio', '', '3104', 'Purok Santan B, General Tinio 3104, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:08', '2026-09-21 19:09:08'),
(44, 44, 'Philippines', 'Purok 6', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Peñaranda', '', '3103', 'Purok 6, Peñaranda 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:08', '2026-09-21 19:09:08'),
(45, 45, 'Philippines', 'Rizal Street', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Santa Rosa', '', '3101', 'Rizal Street, Santa Rosa 3101, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:09', '2026-09-21 19:09:09'),
(46, 46, 'Philippines', 'Purok 1', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Leonardo', '', '3102', 'Purok 1, San Leonardo 3102, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:09', '2026-09-21 19:09:09'),
(47, 47, 'Philippines', 'Germino St', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Leonardo', '', '3102', 'Germino St, San Leonardo 3102, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:09', '2026-09-21 19:09:09'),
(48, 48, 'Philippines', 'Nieves', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', 'Nieves, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:09', '2026-09-21 19:09:09'),
(49, 49, 'Philippines', 'Purok 2', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Rizal', '', '3127', 'Purok 2, Rizal 3127, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:10', '2026-09-21 19:09:10'),
(50, 50, 'Philippines', 'Purok 1', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Antonio', '', '3108', 'Purok 1, San Antonio 3108, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:10', '2026-09-21 19:09:10'),
(51, 51, 'Philippines', 'Purok 3', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Purok 3, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:10', '2026-09-21 19:09:10'),
(52, 52, 'Philippines', 'Purok 6', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Antonio', '', '3108', 'Purok 6, San Antonio 3108, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:10', '2026-09-21 19:09:10'),
(53, 53, 'Philippines', 'Viesca', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Leonardo', '', '3102', 'Viesca, San Leonardo 3102, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:11', '2026-09-21 19:09:11'),
(54, 54, 'Philippines', 'Purok 6', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', 'Purok 6, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:11', '2026-09-21 19:09:11'),
(55, 55, 'Philippines', 'Don Simeon', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Don Simeon, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:11', '2026-09-21 19:09:11'),
(56, 56, 'Philippines', 'Looban', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Looban, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:12', '2026-09-21 19:09:12'),
(57, 57, 'Philippines', '84 Ramirez St', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', '84 Ramirez St, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:12', '2026-09-21 19:09:12'),
(58, 58, 'Philippines', '84 Ramirez St', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', '84 Ramirez St, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:12', '2026-09-21 19:09:12'),
(59, 59, 'Philippines', '53 Narra Street', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', '53 Narra Street, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:12', '2026-09-21 19:09:12'),
(60, 60, 'Philippines', '', 'De Guzman Subdivision', 'Region III - Central Luzon', 'Nueva Ecija', 'Talavera', '', '3114', 'De Guzman Subdivision, Talavera 3114, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:13', '2026-09-21 19:09:13'),
(61, 61, 'Philippines', 'Gumamela 2', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Rizal', '', '3127', 'Gumamela 2, Rizal 3127, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:13', '2026-09-21 19:09:13'),
(62, 62, 'Philippines', 'Zone 6', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', 'Zone 6, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:13', '2026-09-21 19:09:13'),
(63, 63, 'Philippines', 'Purok Centro', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Purok Centro, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:13', '2026-09-21 19:09:13'),
(64, 64, 'Philippines', 'Del Pilar', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Sto. Domingo', '', '3133', 'Del Pilar, Sto. Domingo 3133, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:14', '2026-09-21 19:09:14'),
(65, 65, 'Philippines', 'Purok 1', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Talavera', '', '3114', 'Purok 1, Talavera 3114, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:14', '2026-09-21 19:09:14'),
(66, 66, 'Philippines', 'Purok 2', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Talavera', '', '3114', 'Purok 2, Talavera 3114, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:14', '2026-09-21 19:09:14'),
(67, 67, 'Philippines', 'Purok 2', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Guimba', '', '3115', 'Purok 2, Guimba 3115, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:14', '2026-09-21 19:09:14'),
(68, 68, 'Philippines', '', '', '', '', '', '', '', 'Philippines', '2026-09-21 19:09:15', '2026-09-21 19:09:15'),
(69, 69, 'Philippines', 'De Ocampo', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', 'De Ocampo, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:15', '2026-09-21 19:09:15'),
(70, 70, 'Philippines', 'Rama Drive', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', 'Rama Drive, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:15', '2026-09-21 19:09:15'),
(71, 71, 'Philippines', '', 'Parungao Subdivision', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', 'Parungao Subdivision, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:15', '2026-09-21 19:09:15'),
(72, 72, 'Philippines', 'Yakal St.', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Yakal St., Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:16', '2026-09-21 19:09:16'),
(73, 73, 'Philippines', '115', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Science City Of Munoz', '', '3119', '115, Science City Of Munoz 3119, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:16', '2026-09-21 19:09:16'),
(74, 74, 'Philippines', '162 Centro', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Miguel Bulacan', '', '3011', '162 Centro, San Miguel Bulacan 3011, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:16', '2026-09-21 19:09:16'),
(75, 75, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Bongabon', '', '3128', 'Bongabon 3128, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:16', '2026-09-21 19:09:16'),
(76, 76, 'Philippines', 'Medina Street', '', 'Region III - Central Luzon', 'Nueva Ecija', 'San Isidro', '', '3106', 'Medina Street, San Isidro 3106, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:17', '2026-09-21 19:09:17'),
(77, 77, 'Philippines', 'Sta Cecilia', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', 'Sta Cecilia, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:17', '2026-09-21 19:09:17'),
(78, 78, 'Philippines', NULL, NULL, 'Central Luzon', 'Nueva Ecija', 'City of Gapan', NULL, '3105', 'City of Gapan 3105, Nueva Ecija, Central Luzon, Philippines', '2026-09-21 19:09:17', '2026-09-29 08:29:27'),
(79, 79, 'Philippines', 'Purok 5', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Zaragoza', '', '3110', 'Purok 5, Zaragoza 3110, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:17', '2026-09-21 19:09:17'),
(80, 80, 'Philippines', 'Kamagong Street', 'Paradise Village', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Kamagong Street, Paradise Village, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:18', '2026-09-21 19:09:18'),
(81, 81, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Peñaranda', '', '3103', 'Peñaranda 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:18', '2026-09-21 19:09:18');
INSERT INTO `addresses` (`id`, `user_id`, `country`, `street_address`, `subdivision`, `region`, `province`, `city`, `barangay`, `zip_code`, `full_address`, `created_at`, `updated_at`) VALUES
(82, 82, 'Philippines', 'Block 31', 'Univille Subdivision', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Block 31, Univille Subdivision, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:18', '2026-09-21 19:09:18'),
(83, 83, 'Philippines', '423 Don Pepito', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3100', '423 Don Pepito, Gapan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:18', '2026-09-21 19:09:18'),
(84, 84, 'Philippines', 'Purok Camia', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Purok Camia, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:19', '2026-09-21 19:09:19'),
(85, 85, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3105', 'Cabanatuan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:19', '2026-09-21 19:09:19'),
(86, 86, 'Philippines', '112 Sampaguita Street', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3111', '112 Sampaguita Street, Cabanatuan City 3111, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:19', '2026-09-21 19:09:19'),
(87, 87, 'Philippines', 'Ipil St. Corner', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3203', 'Ipil St. Corner, Gapan City 3203, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:19', '2026-09-21 19:09:19'),
(88, 88, 'Philippines', 'Purok 3', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Aliaga', '', '3105', 'Purok 3, Aliaga 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:20', '2026-09-21 19:09:20'),
(89, 89, 'Philippines', '', '', 'Region III - Central Luzon', 'Aurora', 'Dipaculao', '', '3115', 'Dipaculao 3115, Aurora, Region III - Central Luzon, Philippines', '2026-09-21 19:09:20', '2026-09-21 19:09:20'),
(90, 90, 'Philippines', 'Purok 5', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3133', 'Purok 5, Gapan City 3133, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:20', '2026-09-21 19:09:20'),
(91, 91, 'Philippines', 'Purok Rose', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Guimba', '', '3132', 'Purok Rose, Guimba 3132, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:20', '2026-09-21 19:09:20'),
(92, 92, 'Philippines', 'Salamanca St', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Santo Domingo', '', '3125', 'Salamanca St, Santo Domingo 3125, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:21', '2026-09-21 19:09:21'),
(93, 93, 'Philippines', '20 Rizal', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Palayan City', '', '3117', '20 Rizal, Palayan City 3117, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:21', '2026-09-21 19:09:21'),
(94, 94, 'Philippines', '', '', 'Region III - Central Luzon', 'Nueva Ecija', 'General Mamerto Natividad', '', '3100', 'General Mamerto Natividad 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:21', '2026-09-21 19:09:21'),
(95, 95, 'Philippines', '23', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cuyapo', '', '3107', '23, Cuyapo 3107, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:21', '2026-09-21 19:09:21'),
(96, 96, 'Philippines', '46 Clamonte Street', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', '46 Clamonte Street, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:22', '2026-09-21 19:09:22'),
(97, 97, 'Philippines', '54 Purok 8', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabiao', '', '3107', '54 Purok 8, Cabiao 3107, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:22', '2026-09-21 19:09:22'),
(98, 98, 'Philippines', '147 T. Delos Santos St', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Science City Of Munoz', '', '3119', '147 T. Delos Santos St, Science City Of Munoz 3119, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:22', '2026-09-21 19:09:22'),
(99, 99, 'Philippines', 'Primavera', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Primavera, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:23', '2026-09-21 19:09:23'),
(100, 100, 'Philippines', 'Lemnos', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3105', 'Lemnos, Cabanatuan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:23', '2026-09-21 19:09:23'),
(101, 101, 'Philippines', 'Bonifacio St.', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3100', 'Bonifacio St., Gapan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:23', '2026-09-21 19:09:23'),
(102, 102, 'Philippines', 'Maria Street', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Talugtug', '', '3118', 'Maria Street, Talugtug 3118, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:23', '2026-09-21 19:09:23'),
(103, 103, 'Philippines', 'Primavera', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Cabanatuan City', '', '3100', 'Primavera, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:24', '2026-09-21 19:09:24'),
(104, 104, 'Philippines', 'Partida St', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Peñaranda', '', '3103', 'Partida St, Peñaranda 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:24', '2026-09-21 19:09:24'),
(105, 105, 'Philippines', 'Del Corro St', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', 'Del Corro St, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:24', '2026-09-21 19:09:24'),
(106, 106, 'Philippines', '244 Del Corro Street', '', 'Region III - Central Luzon', 'Nueva Ecija', 'Gapan City', '', '3105', '244 Del Corro Street, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-21 19:09:24', '2026-09-21 19:09:24'),
(107, 109, 'Philippines', '848 H Malgapo Street', NULL, 'Central Luzon', 'Nueva Ecija', 'City of Gapan', 'San Vicente (Pob.)', '3105', '848 H Malgapo Street, Brgy. San Vicente (Pob.), City of Gapan 3105, Nueva Ecija, Central Luzon', '2026-09-25 12:22:50', '2026-09-25 12:22:50'),
(108, 110, 'Philippines', 'P.Padilla Street', 'N/A', 'Central Luzon', 'Nueva Ecija', 'Peñaranda', 'Poblacion III', '3100', 'P.Padilla Street, N/A, Brgy. Poblacion III, Peñaranda 3100, Nueva Ecija, Central Luzon', '2026-09-28 19:31:56', '2026-09-28 19:31:56'),
(109, 111, 'Philippines', 'Garcia Exit / 016', NULL, 'Central Luzon', 'Nueva Ecija', 'City of Cabanatuan', 'Aduas Norte', '3100', 'Garcia Exit / 016, Brgy. Aduas Norte, City of Cabanatuan 3100, Nueva Ecija, Central Luzon', '2026-09-28 19:42:55', '2026-09-28 19:42:55'),
(110, 112, 'Philippines', '168 Purok 2', NULL, 'Central Luzon', 'Nueva Ecija', 'Zaragoza', 'Santa Cruz', '3110', '168 Purok 2, Brgy. Santa Cruz, Zaragoza 3110, Nueva Ecija, Central Luzon', '2026-09-28 22:09:28', '2026-09-28 22:09:28');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `details` text NOT NULL,
  `image` longtext DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `revision_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `user_id`, `title`, `details`, `image`, `status`, `revision_note`, `created_at`, `updated_at`) VALUES
(2, 108, 'Graduation Picture Releasing – First Semester Graduates AY 2025–2026', 'A graduation picture releasing announcement for First Semester Graduates of AY 2025–2026, providing the schedule, location, and requirements for claiming graduation pictures personally or through an authorized representative.', '[\"\\/uploads\\/announcements\\/1790643650_6abb0dc22a69f.webp\"]', 'approved', NULL, '2026-09-29 08:00:50', '2026-09-29 08:00:50'),
(3, 108, 'Graduation Picture Releasing – Second Semester Graduates AY 2025–2026', 'An announcement for Second Semester Graduates of AY 2025–2026 regarding the releasing of graduation pictures. It includes the claiming schedule, location, and requirements for personal claiming or claiming through an authorized representative.', '[\"\\/uploads\\/announcements\\/1790643695_6abb0def6fcf5.webp\"]', 'approved', NULL, '2026-09-29 08:01:35', '2026-09-29 08:01:35'),
(4, 107, 'BSIT Alumni Homecoming 2026: Reconnect. Reminisce. Inspire.', 'We cordially invite all BSIT alumni to a day of professional networking, celebrating milestones, and fostering institutional ties. Join us as we reconnect with former batchmates and honor the shared legacy of our academic community. Once BSIT, always BSIT.', '[\"\\/uploads\\/announcements\\/1790644139_6abb0fab413fc.webp\"]', 'pending', NULL, '2026-09-29 08:08:59', '2026-09-29 08:08:59');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('alumni_connect_cache_2862bea1994ff057847e6f5a02c72f9c73c1a65c', 'i:1;', 1790599676),
('alumni_connect_cache_2862bea1994ff057847e6f5a02c72f9c73c1a65c:timer', 'i:1790599676;', 1790599676),
('alumni_connect_cache_4cf478645cc5358c5ba51e3e149de268ab4a4df2', 'i:1;', 1790607931),
('alumni_connect_cache_4cf478645cc5358c5ba51e3e149de268ab4a4df2:timer', 'i:1790607931;', 1790607931),
('alumni_connect_cache_8302287c47981f553a35b46167f5a2462695d34a', 'i:1;', 1790608238),
('alumni_connect_cache_8302287c47981f553a35b46167f5a2462695d34a:timer', 'i:1790608238;', 1790608238),
('alumni_connect_cache_a366748e9d50911bf2d3fcc53c0245a9aa035d29', 'i:1;', 1790314469),
('alumni_connect_cache_a366748e9d50911bf2d3fcc53c0245a9aa035d29:timer', 'i:1790314469;', 1790314469);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` bigint(20) UNSIGNED NOT NULL,
  `coordinator_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `admin_id`, `coordinator_id`, `created_at`, `updated_at`) VALUES
(1, 108, 107, '2026-09-22 10:44:56', '2026-09-22 10:44:56'),
(2, 108, 28, '2026-09-28 22:59:55', '2026-09-28 22:59:55');

-- --------------------------------------------------------

--
-- Table structure for table `employment`
--

CREATE TABLE `employment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `currently_employed` varchar(255) DEFAULT NULL,
  `employment_type` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `is_present` tinyint(1) NOT NULL DEFAULT 0,
  `monthly_salary` decimal(10,2) DEFAULT NULL,
  `unemployment_reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `employment_duration` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employment`
--

INSERT INTO `employment` (`id`, `user_id`, `currently_employed`, `employment_type`, `company_name`, `position`, `location`, `is_present`, `monthly_salary`, `unemployment_reason`, `created_at`, `updated_at`, `employment_duration`) VALUES
(1, 1, 'Yes', 'Permanent/Regular', 'Google Philippines', 'Software Developer', '123 Corporate Ave, Bonifacio Global City, Taguig, Metro Manila', 1, '45000.00', NULL, '2026-09-21 19:08:56', '2026-09-21 19:08:56', '2023 - Present'),
(2, 2, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Studying', '2026-09-21 19:08:57', '2026-09-21 19:08:57', NULL),
(3, 3, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Preparing for Licensure/Certification Exam', '2026-09-21 19:08:57', '2026-09-21 19:08:57', NULL),
(4, 4, 'Yes', 'Probationary', 'TaskUs', 'Network Administrator', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '28000.00', NULL, '2026-09-21 19:08:57', '2026-09-21 19:08:57', '2024 - Present'),
(5, 5, 'Yes', 'Probationary', 'Huawei', 'System Analyst', 'Commonwealth Ave, Quezon City, Metro Manila', 1, '60000.00', NULL, '2026-09-21 19:08:57', '2026-09-21 19:08:57', '2025 - Present'),
(6, 6, 'Yes', 'Probationary', 'Google Philippines', 'Computer Engineer', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '45000.00', NULL, '2026-09-21 19:08:58', '2026-09-21 19:08:58', '2024 - Present'),
(7, 7, 'Yes', 'Permanent/Regular', 'IBM', 'QA Engineer', 'Bonifacio Global City, Taguig, Metro Manila', 1, '60000.00', NULL, '2026-09-21 19:08:58', '2026-09-21 19:08:58', '2025 - Present'),
(8, 8, 'Yes', 'Probationary', 'GCash', 'UI/UX Designer', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '35000.00', NULL, '2026-09-21 19:08:58', '2026-09-21 19:08:58', '2024 - Present'),
(9, 9, 'Yes', 'Permanent/Regular', 'Shopee', 'IT Support', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '45000.00', NULL, '2026-09-21 19:08:59', '2026-09-21 19:08:59', '2025 - Present'),
(10, 10, 'Yes', 'Permanent/Regular', 'MicroSourcing', 'System Analyst', 'Bonifacio Global City, Taguig, Metro Manila', 1, '18000.00', NULL, '2026-09-21 19:08:59', '2026-09-21 19:08:59', '2025 - Present'),
(11, 11, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Preparing for Licensure/Certification Exam', '2026-09-21 19:08:59', '2026-09-21 19:08:59', NULL),
(12, 12, 'Yes', 'Permanent/Regular', 'Oracle', 'Computer Engineer', 'Ortigas Center, Pasig City, Metro Manila', 1, '28000.00', NULL, '2026-09-21 19:09:00', '2026-09-21 19:09:00', '2024 - Present'),
(13, 13, 'Yes', 'Permanent/Regular', 'Lazada', 'Data Analyst', 'Cebu IT Park, Lahug, Cebu City', 1, '50000.00', NULL, '2026-09-21 19:09:00', '2026-09-21 19:09:00', '2025 - Present'),
(14, 14, 'Yes', 'Probationary', 'IBM', 'System Analyst', 'Araneta City, Quezon City, Metro Manila', 1, '18000.00', NULL, '2026-09-21 19:09:00', '2026-09-21 19:09:00', '2025 - Present'),
(15, 15, 'Yes', 'Probationary', 'Oracle', 'System Analyst', 'Bonifacio Global City, Taguig, Metro Manila', 1, '28000.00', NULL, '2026-09-21 19:09:01', '2026-09-21 19:09:01', '2025 - Present'),
(16, 16, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Starting a Business', '2026-09-21 19:09:01', '2026-09-21 19:09:01', NULL),
(17, 17, 'Yes', 'Probationary', 'Microsoft', 'Network Engineer', 'Clark Freeport Zone, Mabalacat, Pampanga', 1, '35000.00', NULL, '2026-09-21 19:09:01', '2026-09-21 19:09:01', '2024 - Present'),
(18, 18, 'Yes', 'Permanent/Regular', 'Trend Micro', 'System Analyst', 'Northgate Cyberzone, Alabang, Muntinlupa City', 1, '25000.00', NULL, '2026-09-21 19:09:01', '2026-09-21 19:09:01', '2024 - Present'),
(19, 19, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Family / Personal Responsibilities', '2026-09-21 19:09:02', '2026-09-21 19:09:02', NULL),
(20, 20, 'Yes', 'Permanent/Regular', 'Huawei', 'Network Administrator', 'Bonifacio Global City, Taguig, Metro Manila', 1, '20000.00', NULL, '2026-09-21 19:09:02', '2026-09-21 19:09:02', '2025 - Present'),
(21, 21, 'Yes', 'Probationary', 'Accenture', 'IT Support', 'Bonifacio Global City, Taguig, Metro Manila', 1, '25000.00', NULL, '2026-09-21 19:09:02', '2026-09-21 19:09:02', '2024 - Present'),
(22, 22, 'Yes', 'Probationary', 'Microsoft', 'IT Support', 'Ortigas Center, Pasig City, Metro Manila', 1, '60000.00', NULL, '2026-09-21 19:09:03', '2026-09-21 19:09:03', '2024 - Present'),
(23, 23, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Preparing for Licensure/Certification Exam', '2026-09-21 19:09:03', '2026-09-21 19:09:03', NULL),
(24, 24, 'Yes', 'Permanent/Regular', 'TaskUs', 'System Analyst', 'Northgate Cyberzone, Alabang, Muntinlupa City', 1, '22000.00', NULL, '2026-09-21 19:09:03', '2026-09-21 19:09:03', '2024 - Present'),
(25, 25, 'Yes', 'Permanent/Regular', 'Huawei', 'Database Administrator', 'Clark Freeport Zone, Mabalacat, Pampanga', 1, '18000.00', NULL, '2026-09-21 19:09:03', '2026-09-21 19:09:03', '2025 - Present'),
(26, 26, 'Yes', 'Probationary', 'Oracle', 'UI/UX Designer', 'Ayala Avenue, Makati City, Metro Manila', 1, '45000.00', NULL, '2026-09-21 19:09:04', '2026-09-21 19:09:04', '2025 - Present'),
(27, 27, 'Yes', 'Permanent/Regular', 'DXC Technology', 'Computer Engineer', 'Commonwealth Ave, Quezon City, Metro Manila', 1, '25000.00', NULL, '2026-09-21 19:09:04', '2026-09-21 19:09:04', '2024 - Present'),
(28, 28, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Preparing for Licensure/Certification Exam', '2026-09-21 19:09:04', '2026-09-21 19:09:04', NULL),
(29, 29, 'Yes', 'Permanent/Regular', 'Microsoft', 'System Analyst', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '30000.00', NULL, '2026-09-21 19:09:04', '2026-09-21 19:09:04', '2025 - Present'),
(30, 30, 'Yes', 'Probationary', 'PLDT', 'Database Administrator', 'Bonifacio Global City, Taguig, Metro Manila', 1, '40000.00', NULL, '2026-09-21 19:09:05', '2026-09-21 19:09:05', '2024 - Present'),
(31, 31, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Career Break', '2026-09-21 19:09:05', '2026-09-21 19:09:05', NULL),
(32, 32, 'Yes', 'Permanent/Regular', 'Lazada', 'Programmer', 'Ortigas Center, Pasig City, Metro Manila', 1, '45000.00', NULL, '2026-09-21 19:09:05', '2026-09-21 19:09:05', '2024 - Present'),
(33, 33, 'Yes', 'Probationary', 'Smart Communications', 'System Analyst', 'Bonifacio Global City, Taguig, Metro Manila', 1, '18000.00', NULL, '2026-09-21 19:09:06', '2026-09-21 19:09:06', '2024 - Present'),
(34, 34, 'Yes', 'Probationary', 'Smart Communications', 'IT Support', 'Bonifacio Global City, Taguig, Metro Manila', 1, '50000.00', NULL, '2026-09-21 19:09:06', '2026-09-21 19:09:06', '2024 - Present'),
(35, 35, 'Yes', 'Probationary', 'Oracle', 'QA Engineer', 'Ortigas Center, Pasig City, Metro Manila', 1, '45000.00', NULL, '2026-09-21 19:09:06', '2026-09-21 19:09:06', '2025 - Present'),
(36, 36, 'Yes', 'Probationary', 'Trend Micro', 'Technical Support', 'Ayala Avenue, Makati City, Metro Manila', 1, '18000.00', NULL, '2026-09-21 19:09:06', '2026-09-21 19:09:06', '2024 - Present'),
(37, 37, 'Yes', 'Probationary', 'TaskUs', 'Technical Support', 'Bonifacio Global City, Taguig, Metro Manila', 1, '25000.00', NULL, '2026-09-21 19:09:07', '2026-09-21 19:09:07', '2024 - Present'),
(38, 38, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Job Hunting', '2026-09-21 19:09:07', '2026-09-21 19:09:07', NULL),
(39, 39, 'Yes', 'Permanent/Regular', 'GCash', 'Network Administrator', 'Bonifacio Global City, Taguig, Metro Manila', 1, '60000.00', NULL, '2026-09-21 19:09:07', '2026-09-21 19:09:07', '2025 - Present'),
(40, 40, 'Yes', 'Permanent/Regular', 'MicroSourcing', 'Electronics Engineer', 'Ortigas Center, Pasig City, Metro Manila', 1, '50000.00', NULL, '2026-09-21 19:09:07', '2026-09-21 19:09:07', '2024 - Present'),
(41, 41, 'Yes', 'Permanent/Regular', 'Concentrix', 'Programmer', 'Ortigas Center, Pasig City, Metro Manila', 1, '60000.00', NULL, '2026-09-21 19:09:08', '2026-09-21 19:09:08', '2025 - Present'),
(42, 42, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Job Hunting', '2026-09-21 19:09:08', '2026-09-21 19:09:08', NULL),
(43, 43, 'Yes', 'Permanent/Regular', 'PLDT', 'Network Administrator', 'Araneta City, Quezon City, Metro Manila', 1, '35000.00', NULL, '2026-09-21 19:09:08', '2026-09-21 19:09:08', '2024 - Present'),
(44, 44, 'Yes', 'Permanent/Regular', 'Samsung', 'Network Administrator', 'Bonifacio Global City, Taguig, Metro Manila', 1, '45000.00', NULL, '2026-09-21 19:09:08', '2026-09-21 19:09:08', '2025 - Present'),
(45, 45, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Family / Personal Responsibilities', '2026-09-21 19:09:09', '2026-09-21 19:09:09', NULL),
(46, 46, 'Yes', 'Permanent/Regular', 'Lazada', 'Web Developer', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '28000.00', NULL, '2026-09-21 19:09:09', '2026-09-21 19:09:09', '2025 - Present'),
(47, 47, 'Yes', 'Probationary', 'Google Philippines', 'Programmer', 'Cebu IT Park, Lahug, Cebu City', 1, '60000.00', NULL, '2026-09-21 19:09:09', '2026-09-21 19:09:09', '2024 - Present'),
(48, 48, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Job Hunting', '2026-09-21 19:09:09', '2026-09-21 19:09:09', NULL),
(49, 49, 'Yes', 'Permanent/Regular', 'Globe Telecom', 'UI/UX Designer', 'Ortigas Center, Pasig City, Metro Manila', 1, '20000.00', NULL, '2026-09-21 19:09:10', '2026-09-21 19:09:10', '2024 - Present'),
(50, 50, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Health Reasons', '2026-09-21 19:09:10', '2026-09-21 19:09:10', NULL),
(51, 51, 'Yes', 'Permanent/Regular', 'IBM', 'Network Administrator', 'Ortigas Center, Pasig City, Metro Manila', 1, '20000.00', NULL, '2026-09-21 19:09:10', '2026-09-21 19:09:10', '2025 - Present'),
(52, 52, 'Yes', 'Probationary', 'Smart Communications', 'System Analyst', 'Commonwealth Ave, Quezon City, Metro Manila', 1, '20000.00', NULL, '2026-09-21 19:09:10', '2026-09-21 19:09:10', '2024 - Present'),
(53, 53, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Preparing for Licensure/Certification Exam', '2026-09-21 19:09:11', '2026-09-21 19:09:11', NULL),
(54, 54, 'Yes', 'Permanent/Regular', 'GCash', 'Programmer', 'Commonwealth Ave, Quezon City, Metro Manila', 1, '40000.00', NULL, '2026-09-21 19:09:11', '2026-09-21 19:09:11', '2025 - Present'),
(55, 55, 'Yes', 'Permanent/Regular', 'GCash', 'Network Administrator', 'Northgate Cyberzone, Alabang, Muntinlupa City', 1, '45000.00', NULL, '2026-09-21 19:09:11', '2026-09-21 19:09:11', '2024 - Present'),
(56, 56, 'Yes', 'Permanent/Regular', 'Huawei', 'IT Support', 'Ortigas Center, Pasig City, Metro Manila', 1, '25000.00', NULL, '2026-09-21 19:09:12', '2026-09-21 19:09:12', '2024 - Present'),
(57, 57, 'Yes', 'Probationary', 'TaskUs', 'QA Engineer', 'Ayala Avenue, Makati City, Metro Manila', 1, '18000.00', NULL, '2026-09-21 19:09:12', '2026-09-21 19:09:12', '2025 - Present'),
(58, 58, 'Yes', 'Permanent/Regular', 'GCash', 'System Analyst', 'Ortigas Center, Pasig City, Metro Manila', 1, '22000.00', NULL, '2026-09-21 19:09:12', '2026-09-21 19:09:12', '2025 - Present'),
(59, 59, 'Yes', 'Permanent/Regular', 'TaskUs', 'Data Analyst', 'Ayala Avenue, Makati City, Metro Manila', 1, '25000.00', NULL, '2026-09-21 19:09:12', '2026-09-21 19:09:12', '2024 - Present'),
(60, 60, 'Yes', 'Permanent/Regular', 'Microsoft', 'Programmer', 'Northgate Cyberzone, Alabang, Muntinlupa City', 1, '22000.00', NULL, '2026-09-21 19:09:13', '2026-09-21 19:09:13', '2025 - Present'),
(61, 61, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Family / Personal Responsibilities', '2026-09-21 19:09:13', '2026-09-21 19:09:13', NULL),
(62, 62, 'Yes', 'Probationary', 'PLDT', 'Software Developer', 'Clark Freeport Zone, Mabalacat, Pampanga', 1, '50000.00', NULL, '2026-09-21 19:09:13', '2026-09-21 19:09:13', '2024 - Present'),
(63, 63, 'Yes', 'Probationary', 'Lazada', 'Data Analyst', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '30000.00', NULL, '2026-09-21 19:09:13', '2026-09-21 19:09:13', '2024 - Present'),
(64, 64, 'Yes', 'Probationary', 'Smart Communications', 'Web Developer', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '50000.00', NULL, '2026-09-21 19:09:14', '2026-09-21 19:09:14', '2025 - Present'),
(65, 65, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Starting a Business', '2026-09-21 19:09:14', '2026-09-21 19:09:14', NULL),
(66, 66, 'Yes', 'Permanent/Regular', 'Concentrix', 'QA Engineer', 'Clark Freeport Zone, Mabalacat, Pampanga', 1, '40000.00', NULL, '2026-09-21 19:09:14', '2026-09-21 19:09:14', '2025 - Present'),
(67, 67, 'Yes', 'Probationary', 'MicroSourcing', 'QA Engineer', 'Araneta City, Quezon City, Metro Manila', 1, '35000.00', NULL, '2026-09-21 19:09:14', '2026-09-21 19:09:14', '2025 - Present'),
(68, 68, 'Yes', 'Probationary', 'Lazada', 'Technical Support', 'Northgate Cyberzone, Alabang, Muntinlupa City', 1, '28000.00', NULL, '2026-09-21 19:09:15', '2026-09-21 19:09:15', '2024 - Present'),
(69, 69, 'Yes', 'Probationary', 'Samsung', 'Computer Engineer', 'Cebu IT Park, Lahug, Cebu City', 1, '28000.00', NULL, '2026-09-21 19:09:15', '2026-09-21 19:09:15', '2024 - Present'),
(70, 70, 'Yes', 'Probationary', 'MicroSourcing', 'Database Administrator', 'Northgate Cyberzone, Alabang, Muntinlupa City', 1, '22000.00', NULL, '2026-09-21 19:09:15', '2026-09-21 19:09:15', '2025 - Present'),
(71, 71, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Job Hunting', '2026-09-21 19:09:15', '2026-09-21 19:09:15', NULL),
(72, 72, 'Yes', 'Probationary', 'Microsoft', 'Data Analyst', 'Ortigas Center, Pasig City, Metro Manila', 1, '40000.00', NULL, '2026-09-21 19:09:16', '2026-09-21 19:09:16', '2025 - Present'),
(73, 73, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Studying', '2026-09-21 19:09:16', '2026-09-21 19:09:16', NULL),
(74, 74, 'Yes', 'Probationary', 'MicroSourcing', 'Network Engineer', 'Ayala Avenue, Makati City, Metro Manila', 1, '28000.00', NULL, '2026-09-21 19:09:16', '2026-09-21 19:09:16', '2024 - Present'),
(75, 75, 'Yes', 'Permanent/Regular', 'Accenture', 'Web Developer', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '50000.00', NULL, '2026-09-21 19:09:16', '2026-09-21 19:09:16', '2025 - Present'),
(76, 76, 'Yes', 'Permanent/Regular', 'Shopee', 'Network Engineer', 'Commonwealth Ave, Quezon City, Metro Manila', 1, '18000.00', NULL, '2026-09-21 19:09:17', '2026-09-21 19:09:17', '2024 - Present'),
(77, 77, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Job Hunting', '2026-09-21 19:09:17', '2026-09-21 19:09:17', NULL),
(78, 78, 'Yes', 'Permanent/Regular', 'Concentrix', 'Network Administrator', 'Araneta City, Quezon City, Metro Manila', 1, '20000.00', NULL, '2026-09-21 19:09:17', '2026-09-21 19:09:17', '2025 - Present'),
(79, 79, 'Yes', 'Probationary', 'Lazada', 'Database Administrator', 'Ortigas Center, Pasig City, Metro Manila', 1, '50000.00', NULL, '2026-09-21 19:09:17', '2026-09-21 19:09:17', '2024 - Present'),
(80, 80, 'Yes', 'Probationary', 'Globe Telecom', 'IT Support', 'Ayala Avenue, Makati City, Metro Manila', 1, '28000.00', NULL, '2026-09-21 19:09:18', '2026-09-21 19:09:18', '2024 - Present'),
(81, 81, 'Yes', 'Permanent/Regular', 'Accenture', 'Data Analyst', 'Bonifacio Global City, Taguig, Metro Manila', 1, '45000.00', NULL, '2026-09-21 19:09:18', '2026-09-21 19:09:18', '2025 - Present'),
(82, 82, 'Yes', 'Permanent/Regular', 'Lazada', 'Network Administrator', 'Ortigas Center, Pasig City, Metro Manila', 1, '35000.00', NULL, '2026-09-21 19:09:18', '2026-09-21 19:09:18', '2025 - Present'),
(83, 83, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Family / Personal Responsibilities', '2026-09-21 19:09:18', '2026-09-21 19:09:18', NULL),
(84, 84, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Preparing for Licensure/Certification Exam', '2026-09-21 19:09:19', '2026-09-21 19:09:19', NULL),
(85, 85, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Career Break', '2026-09-21 19:09:19', '2026-09-21 19:09:19', NULL),
(86, 86, 'Yes', 'Permanent/Regular', 'Accenture', 'Data Analyst', 'Northgate Cyberzone, Alabang, Muntinlupa City', 1, '50000.00', NULL, '2026-09-21 19:09:19', '2026-09-21 19:09:19', '2025 - Present'),
(87, 87, 'Yes', 'Probationary', 'PLDT', 'Technical Support', 'Araneta City, Quezon City, Metro Manila', 1, '22000.00', NULL, '2026-09-21 19:09:19', '2026-09-21 19:09:19', '2025 - Present'),
(88, 88, 'Yes', 'Probationary', 'Trend Micro', 'Web Developer', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '18000.00', NULL, '2026-09-21 19:09:20', '2026-09-21 19:09:20', '2025 - Present'),
(89, 89, 'Yes', 'Permanent/Regular', 'Concentrix', 'Web Developer', 'Commonwealth Ave, Quezon City, Metro Manila', 1, '50000.00', NULL, '2026-09-21 19:09:20', '2026-09-21 19:09:20', '2025 - Present'),
(90, 90, 'Yes', 'Permanent/Regular', 'Smart Communications', 'Computer Engineer', 'Bonifacio Global City, Taguig, Metro Manila', 1, '50000.00', NULL, '2026-09-21 19:09:20', '2026-09-21 19:09:20', '2024 - Present'),
(91, 91, 'Yes', 'Permanent/Regular', 'GCash', 'System Analyst', 'Bonifacio Global City, Taguig, Metro Manila', 1, '22000.00', NULL, '2026-09-21 19:09:20', '2026-09-21 19:09:20', '2024 - Present'),
(92, 92, 'Yes', 'Permanent/Regular', 'IBM', 'Programmer', 'Northgate Cyberzone, Alabang, Muntinlupa City', 1, '18000.00', NULL, '2026-09-21 19:09:21', '2026-09-21 19:09:21', '2024 - Present'),
(93, 93, 'Yes', 'Probationary', 'Samsung', 'Computer Engineer', 'Ortigas Center, Pasig City, Metro Manila', 1, '22000.00', NULL, '2026-09-21 19:09:21', '2026-09-21 19:09:21', '2025 - Present'),
(94, 94, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Family / Personal Responsibilities', '2026-09-21 19:09:21', '2026-09-21 19:09:21', NULL),
(95, 95, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Career Break', '2026-09-21 19:09:21', '2026-09-21 19:09:21', NULL),
(96, 96, 'Yes', 'Probationary', 'Concentrix', 'Technical Support', 'Araneta City, Quezon City, Metro Manila', 1, '20000.00', NULL, '2026-09-21 19:09:22', '2026-09-21 19:09:22', '2024 - Present'),
(97, 97, 'Yes', 'Permanent/Regular', 'Google Philippines', 'Computer Engineer', 'Ortigas Center, Pasig City, Metro Manila', 1, '50000.00', NULL, '2026-09-21 19:09:22', '2026-09-21 19:09:22', '2024 - Present'),
(98, 98, 'Yes', 'Probationary', 'DXC Technology', 'Computer Engineer', 'Commonwealth Ave, Quezon City, Metro Manila', 1, '22000.00', NULL, '2026-09-21 19:09:22', '2026-09-21 19:09:22', '2025 - Present'),
(99, 99, 'Yes', 'Probationary', 'GCash', 'System Analyst', 'Ayala Avenue, Makati City, Metro Manila', 1, '18000.00', NULL, '2026-09-21 19:09:23', '2026-09-21 19:09:23', '2025 - Present'),
(100, 100, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Job Hunting', '2026-09-21 19:09:23', '2026-09-21 19:09:23', NULL),
(101, 101, 'Yes', 'Probationary', 'Oracle', 'Electronics Engineer', 'Northgate Cyberzone, Alabang, Muntinlupa City', 1, '22000.00', NULL, '2026-09-21 19:09:23', '2026-09-21 19:09:23', '2024 - Present'),
(102, 102, 'Yes', 'Probationary', 'Oracle', 'IT Support', 'Maharlika Highway, Cabanatuan City, Nueva Ecija', 1, '20000.00', NULL, '2026-09-21 19:09:23', '2026-09-21 19:09:23', '2024 - Present'),
(103, 103, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Career Break', '2026-09-21 19:09:24', '2026-09-21 19:09:24', NULL),
(104, 104, 'Yes', 'Permanent/Regular', 'Smart Communications', 'UI/UX Designer', 'Clark Freeport Zone, Mabalacat, Pampanga', 1, '30000.00', NULL, '2026-09-21 19:09:24', '2026-09-21 19:09:24', '2025 - Present'),
(105, 105, 'Yes', 'Permanent/Regular', 'Shopee', 'Database Administrator', 'Araneta City, Quezon City, Metro Manila', 1, '35000.00', NULL, '2026-09-21 19:09:24', '2026-09-21 19:09:24', '2024 - Present'),
(106, 106, 'Yes', 'Probationary', 'PLDT', 'QA Engineer', 'Clark Freeport Zone, Mabalacat, Pampanga', 1, '40000.00', NULL, '2026-09-21 19:09:24', '2026-09-21 19:09:24', '2025 - Present'),
(107, 109, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Job Hunting', '2026-09-25 12:22:50', '2026-09-25 12:22:50', NULL),
(108, 110, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Studying', '2026-09-28 19:31:56', '2026-09-28 19:31:56', NULL),
(109, 111, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Studying', '2026-09-28 19:42:55', '2026-09-28 19:42:55', NULL),
(110, 112, 'No', NULL, NULL, NULL, NULL, 0, NULL, 'Job Hunting', '2026-09-28 22:09:28', '2026-09-28 22:09:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employment_history`
--

CREATE TABLE `employment_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `currently_employed` varchar(255) DEFAULT NULL,
  `employment_type` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `monthly_salary` decimal(10,2) DEFAULT NULL,
  `unemployment_reason` text DEFAULT NULL,
  `is_present` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `employment_duration` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `featured_alumni`
--

CREATE TABLE `featured_alumni` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `details` text NOT NULL,
  `image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `revision_note` text DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

--
-- Dumping data for table `featured_alumni`
--

INSERT INTO `featured_alumni` (`id`, `title`, `details`, `image`, `status`, `revision_note`, `user_id`, `created_at`, `updated_at`) VALUES
(2, 'Wesleyan Footprints: Stories That Inspire', 'A celebration of Mr. David Ray Pascual Sarmiento, a Young Wesleyanian Achiever Awardee 2026, whose journey at Wesleyan transformed his curiosity into ambition and inspired him to pursue both education and passion.', '[\"\\/uploads\\/featured_alumni\\/1790071104_6ab25140a3717.webp\"]', 'Approved', NULL, 108, '2026-09-22 16:58:25', '2026-09-29 13:50:39');

-- --------------------------------------------------------

--
-- Table structure for table `inquiries`
--

CREATE TABLE `inquiries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `recipient_type` varchar(255) NOT NULL,
  `recipient_id` bigint(20) UNSIGNED DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inquiries`
--

INSERT INTO `inquiries` (`id`, `user_id`, `recipient_type`, `recipient_id`, `department`, `title`, `subject`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'admin', NULL, NULL, 'Ms.', 'Inquiry About Alumni ID', 'Good day! I would like to inquire about the process of obtaining an Alumni ID. I would appreciate it if you could provide the requirements and steps needed to apply. Thank you.', 'pending', '2026-09-22 19:54:06', '2026-09-22 19:54:06'),
(2, 1, 'coordinator', 107, 'CECT', 'Ms.', 'Inquiry About Upcoming Alumni Activities', 'Good day! I would like to ask if there are any upcoming alumni activities or events for CECT graduates. I would appreciate any information regarding the schedule and registration process. Thank you.', 'replied', '2026-09-22 20:47:31', '2026-09-25 08:54:04'),
(3, 112, 'admin', NULL, NULL, 'Ms.', 'Regarding Graduation Pictures', 'Good day po!\n\nI would like to inquire regarding the availability of our graduation pictures. May I ask if the Alumni Office has copies or records of graduation pictures from previous batches?\n\nIf available, may I also ask about the process and requirements for requesting or obtaining a copy?\n\nThank you po for your assistance. I look forward to your response.', 'pending', '2026-09-28 22:50:48', '2026-09-28 22:50:48'),
(4, 29, 'coordinator', 107, 'CECT', 'Mr.', 'Transcript of Records', 'Good day po, \n\nI would like to inquire regarding the process of requesting a Transcript of Records (TOR). May I ask what are the requirements, fees, and procedures for requesting a copy of my TOR?\n\nI would also like to know how long the processing usually takes.\n\nThank you po for your assistance. I look forward to your response.', 'pending', '2026-09-28 22:57:56', '2026-09-28 22:57:56'),
(5, 28, 'admin', NULL, NULL, 'Mr.', 'Alumni ID', 'Good day po! I would like to inquire about the process and requirements for obtaining an Alumni ID. Thank you po.', 'pending', '2026-09-28 23:04:51', '2026-09-28 23:04:51'),
(6, 31, 'coordinator', 107, 'CECT', 'Mr.', 'Regarding Academic Records', 'Good day po! I would like to inquire about verifying or requesting a copy of my academic records from the CECT Department. Thank you po.', 'pending', '2026-09-28 23:10:46', '2026-09-28 23:10:46'),
(7, 2, 'coordinator', 107, 'CECT', 'Ms.', 'Request for Transcript of Records', 'Good day!\n\nI would like to inquire about requesting my Transcript of Records.', 'pending', '2026-09-29 13:39:00', '2026-09-29 13:39:00'),
(8, 2, 'admin', NULL, NULL, 'Ms.', 'Request for Alumni ID', 'Good day!\n\n May I inquire about the requirements for obtaining an Alumni ID?', 'pending', '2026-09-29 13:41:14', '2026-09-29 13:41:14');

-- --------------------------------------------------------

--
-- Table structure for table `inquiry_replies`
--

CREATE TABLE `inquiry_replies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `inquiry_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `sender_role` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `body` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message_reads`
--

CREATE TABLE `message_reads` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `message_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '0001_01_01_000003_create_sessions_table', 1),
(5, '0002_071417_create_inquiries_table', 1),
(6, '2026_00_22_000001_create_conversations_table', 1),
(7, '2026_00_22_000002_create_messages_table', 1),
(8, '2026_00_22_000003_create_message_reads_table', 1),
(9, '2026_03_25_000003_create_surveys_table', 1),
(10, '2026_03_25_000004_create_sections_table', 1),
(11, '2026_03_25_000005_create_questions_table', 1),
(12, '2026_03_25_000006_create_responses_table', 1),
(13, '2026_03_25_000007_create_survey_drafts_table', 1),
(14, '2026_03_30_081144_create_announcements_table', 1),
(15, '2026_04_19_013958_create_employment_table', 1),
(16, '2026_04_19_014000_create_employment_history_table', 1),
(17, '2026_04_26_000001_create_subheadings_table', 1),
(18, '2026_05_23_063748_change_responses_survey_foreign_key_to_cascade', 1),
(19, '2026_05_31_050332_create_notifications_table', 1),
(20, '2026_06_06_170212_create_inquiry_replies_table', 1),
(21, '2026_07_12_125821_add_notifications_seen_at_to_users_table', 1),
(22, '2026_08_19_000002_create_addresses_table', 1),
(23, '2026_08_26_034018_add_country_to_addresses_table', 1),
(24, '2026_08_26_043414_refactor_employment_years_to_duration', 1),
(25, '2026_08_26_051013_add_suffix_to_users_table', 1),
(26, '2026_09_19_144000_create_featured_alumni_table', 1),
(27, '2026_09_22_000000_add_zip_code_to_addresses_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `target_role` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `triggered_by` bigint(20) UNSIGNED DEFAULT NULL,
  `target_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `target_role`, `title`, `message`, `data`, `triggered_by`, `target_user_id`, `created_at`, `updated_at`) VALUES
(1, 'announcement_published', 'alumna', 'New Announcement', 'A new announcement has been posted: \"test\".', '{\"announcement_id\":1}', 108, NULL, '2026-09-22 15:25:14', '2026-09-22 15:25:14'),
(2, 'featured_alumni_approved', 'coordinator_specific', 'Featured Alumni Approved', 'Your featured alumni post \"test2\" has been approved.', '{\"featured_alumni_id\":3}', 108, 107, '2026-09-22 17:51:51', '2026-09-22 17:51:51'),
(3, 'featured_alumni_pending', 'admin', 'Featured Alumni Needs Review', 'Maria Catalina Tugaff submitted a featured alumni post: \"test3\".', '{\"featured_alumni_id\":4,\"coordinator_id\":107}', 107, NULL, '2026-09-22 17:52:48', '2026-09-22 17:52:48'),
(4, 'featured_alumni_revision', 'coordinator_specific', 'Featured Alumni Needs Revision', 'Your featured alumni post \"test3\" needs revision. Note: more deets', '{\"featured_alumni_id\":4,\"note\":\"more deets\"}', 108, 107, '2026-09-22 18:03:57', '2026-09-22 18:03:57'),
(5, 'featured_alumni_resubmitted', 'admin', 'Featured Alumni Resubmitted', 'Maria Catalina Tugaff resubmitted the featured alumni post \"test3\" for review.', '{\"featured_alumni_id\":4,\"coordinator_id\":107}', 107, NULL, '2026-09-22 18:19:11', '2026-09-22 18:19:11'),
(6, 'featured_alumni_approved', 'coordinator_specific', 'Featured Alumni Approved', 'Your featured alumni post \"test3\" has been approved.', '{\"featured_alumni_id\":4}', 108, 107, '2026-09-22 18:22:40', '2026-09-22 18:22:40'),
(7, 'inquiry_received', 'admin', 'New Inquiry', 'Gaile Guanio sent an inquiry.', '{\"inquiry_id\":1}', 1, NULL, '2026-09-22 19:54:06', '2026-09-22 19:54:06'),
(8, 'inquiry_received', 'coordinator_specific', 'New Inquiry', 'Gaile Guanio sent an inquiry.', '{\"inquiry_id\":2}', 1, 107, '2026-09-22 20:47:31', '2026-09-22 20:47:31'),
(9, 'alumni_registered', 'all', 'New Alumni Registered', 'Angela Marie Guanio has created an account.', '{\"alumni_id\":109}', 109, NULL, '2026-09-25 12:22:51', '2026-09-25 12:22:51'),
(10, 'survey_published', 'alumna', 'New Survey Available', 'A new survey is available: \"WUP Graduate Tracer Study\".', '{\"survey_id\":1,\"survey_type\":\"normal\"}', 108, NULL, '2026-09-28 17:42:08', '2026-09-28 17:42:08'),
(11, 'alumni_registered', 'all', 'New Alumni Registered', 'Tiffany joy Soria has created an account.', '{\"alumni_id\":110}', 110, NULL, '2026-09-28 19:31:56', '2026-09-28 19:31:56'),
(12, 'alumni_registered', 'all', 'New Alumni Registered', 'Jaz-Shane Tatad has created an account.', '{\"alumni_id\":111}', 111, NULL, '2026-09-28 19:42:55', '2026-09-28 19:42:55'),
(13, 'survey_answered', 'all', 'New Survey Response', 'Mark Anthony Franco has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":77}', 77, NULL, '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(14, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 77, 77, '2026-09-28 20:36:04', '2026-09-28 20:36:04'),
(15, 'survey_answered', 'all', 'New Survey Response', 'Joyce Dela Cruz has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":2}', 2, NULL, '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(16, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 2, 2, '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(17, 'alumni_registered', 'all', 'New Alumni Registered', 'Jay Mharie Atayde has created an account.', '{\"alumni_id\":112}', 112, NULL, '2026-09-28 22:09:28', '2026-09-28 22:09:28'),
(18, 'survey_answered', 'all', 'New Survey Response', 'Jay Mharie Atayde has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":112}', 112, NULL, '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(19, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 112, 112, '2026-09-28 22:44:20', '2026-09-28 22:44:20'),
(20, 'survey_answered', 'all', 'New Survey Response', 'Jan Nathaniel Memita has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":27}', 27, NULL, '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(21, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 27, 27, '2026-09-28 22:46:43', '2026-09-28 22:46:43'),
(22, 'inquiry_received', 'admin', 'New Inquiry', 'Jay Mharie Atayde sent an inquiry.', '{\"inquiry_id\":3}', 112, NULL, '2026-09-28 22:50:48', '2026-09-28 22:50:48'),
(23, 'survey_answered', 'all', 'New Survey Response', 'John Arvin Odulio has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":29}', 29, NULL, '2026-09-28 22:57:00', '2026-09-28 22:57:00'),
(24, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 29, 29, '2026-09-28 22:57:01', '2026-09-28 22:57:01'),
(25, 'survey_answered', 'all', 'New Survey Response', 'Clarence Mallare has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":52}', 52, NULL, '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(26, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 52, 52, '2026-09-28 22:57:32', '2026-09-28 22:57:32'),
(27, 'inquiry_received', 'coordinator_specific', 'New Inquiry', 'John Arvin Odulio sent an inquiry.', '{\"inquiry_id\":4}', 29, 107, '2026-09-28 22:57:56', '2026-09-28 22:57:56'),
(28, 'survey_answered', 'all', 'New Survey Response', 'Gerald Fran Oanes has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":28}', 28, NULL, '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(29, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 28, 28, '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(30, 'inquiry_received', 'admin', 'New Inquiry', 'Gerald Fran Oanes sent an inquiry.', '{\"inquiry_id\":5}', 28, NULL, '2026-09-28 23:04:51', '2026-09-28 23:04:51'),
(31, 'survey_answered', 'all', 'New Survey Response', 'Byron Padunan has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":30}', 30, NULL, '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(32, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 30, 30, '2026-09-28 23:08:02', '2026-09-28 23:08:02'),
(33, 'survey_answered', 'all', 'New Survey Response', 'Jeano Pascual has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":31}', 31, NULL, '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(34, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 31, 31, '2026-09-28 23:10:06', '2026-09-28 23:10:06'),
(35, 'inquiry_received', 'coordinator_specific', 'New Inquiry', 'Jeano Pascual sent an inquiry.', '{\"inquiry_id\":6}', 31, 107, '2026-09-28 23:10:46', '2026-09-28 23:10:46'),
(36, 'survey_answered', 'all', 'New Survey Response', 'Tricia Perez has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":33}', 33, NULL, '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(37, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 33, 33, '2026-09-28 23:14:34', '2026-09-28 23:14:34'),
(38, 'survey_answered', 'all', 'New Survey Response', 'Jaminli Peralta has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":32}', 32, NULL, '2026-09-28 23:19:16', '2026-09-28 23:19:16'),
(39, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 32, 32, '2026-09-28 23:19:16', '2026-09-28 23:19:16'),
(40, 'survey_answered', 'all', 'New Survey Response', 'Edrick Vincent Pili has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":34}', 34, NULL, '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(41, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 34, 34, '2026-09-28 23:22:27', '2026-09-28 23:22:27'),
(42, 'survey_answered', 'all', 'New Survey Response', 'Benedict Ramos has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":35}', 35, NULL, '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(43, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 35, 35, '2026-09-28 23:25:06', '2026-09-28 23:25:06'),
(44, 'survey_answered', 'all', 'New Survey Response', 'Ashlyn Mckayla Santos has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":36}', 36, NULL, '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(45, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 28, 2026.', '{\"survey_id\":1}', 36, 36, '2026-09-28 23:27:47', '2026-09-28 23:27:47'),
(46, 'announcement_published', 'alumna', 'New Announcement', 'A new announcement has been posted: \"Graduation Picture Releasing – First Semester Graduates AY 2025–2026\".', '{\"announcement_id\":2}', 108, NULL, '2026-09-29 08:00:50', '2026-09-29 08:00:50'),
(47, 'announcement_published', 'alumna', 'New Announcement', 'A new announcement has been posted: \"Graduation Picture Releasing – Second Semester Graduates AY 2025–2026\".', '{\"announcement_id\":3}', 108, NULL, '2026-09-29 08:01:35', '2026-09-29 08:01:35'),
(48, 'announcement_pending', 'admin', 'Announcement Needs Review', 'Maria Catalina Tugaff submitted an announcement: \"BSIT Alumni Homecoming 2026: Reconnect. Reminisce. Inspire.\".', '{\"announcement_id\":4,\"coordinator_id\":107}', 107, NULL, '2026-09-29 08:08:59', '2026-09-29 08:08:59'),
(49, 'survey_answered', 'all', 'New Survey Response', 'Sean Aeron Garcia has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":78}', 78, NULL, '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(50, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 29, 2026.', '{\"survey_id\":1}', 78, 78, '2026-09-29 08:24:31', '2026-09-29 08:24:31'),
(51, 'survey_answered', 'all', 'New Survey Response', 'Gaile Guanio has submitted a survey response.', '{\"survey_id\":1,\"alumni_id\":1}', 1, NULL, '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(52, 'survey_completed', 'alumna_specific', 'Survey Completed', 'You have already answered the survey: \"WUP Graduate Tracer Study\" last Sep 29, 2026.', '{\"survey_id\":1}', 1, 1, '2026-09-29 09:43:04', '2026-09-29 09:43:04'),
(53, 'inquiry_received', 'coordinator_specific', 'New Inquiry', 'Joyce Dela Cruz sent an inquiry.', '{\"inquiry_id\":7}', 2, 107, '2026-09-29 13:39:00', '2026-09-29 13:39:00'),
(54, 'inquiry_received', 'admin', 'New Inquiry', 'Joyce Dela Cruz sent an inquiry.', '{\"inquiry_id\":8}', 2, NULL, '2026-09-29 13:41:14', '2026-09-29 13:41:14');

-- --------------------------------------------------------

--
-- Table structure for table `notification_reads`
--

CREATE TABLE `notification_reads` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `notification_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification_reads`
--

INSERT INTO `notification_reads` (`id`, `notification_id`, `user_id`, `read_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2026-09-28 17:28:51', '2026-09-28 17:28:51', '2026-09-28 17:28:51'),
(2, 32, 30, '2026-09-28 23:09:00', '2026-09-28 23:09:00', '2026-09-28 23:09:00');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_id` bigint(20) UNSIGNED NOT NULL,
  `question_identifier` varchar(255) NOT NULL,
  `label` text NOT NULL,
  `type` enum('text','select','radio','checkbox','number','textarea','likert','subheading') NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_required` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `section_id`, `question_identifier`, `label`, `type`, `options`, `display_order`, `is_required`, `created_at`, `updated_at`) VALUES
(1, 1, 'first-name', 'First name:', 'text', NULL, 1, 1, '2026-09-28 17:30:47', '2026-09-28 17:30:47'),
(2, 1, 'middle-name-enter-if-you-do-not-have-a-middle-name', 'Middle name  (Enter \"*\" if you do not have a middle name.):', 'text', NULL, 2, 1, '2026-09-28 17:30:54', '2026-09-28 17:34:38'),
(3, 1, 'last-name', 'Last name:', 'text', NULL, 3, 1, '2026-09-28 17:31:00', '2026-09-28 17:31:00'),
(4, 1, 'home-address-houseunit-no-street-barangay-municipalitycity-province', 'Home Address: (House/Unit No., Street, Barangay, Municipality/City, Province)', 'text', NULL, 4, 1, '2026-09-28 17:31:05', '2026-09-28 17:31:05'),
(5, 1, 'email-address', 'Email Address:', 'text', NULL, 5, 1, '2026-09-28 17:31:10', '2026-09-28 17:31:10'),
(6, 1, 'mobile-number', 'Mobile Number:', 'number', NULL, 6, 1, '2026-09-28 17:31:16', '2026-09-28 17:31:16'),
(7, 1, 'bachelors-degree-obtained-from-wup', 'Bachelors Degree Obtained from WUP:', 'select', '[\"Bachelor of Science in Computer  Engineering\",\"Bachelor of Science in Electronic Engineering\",\"Bachelor of Science in Information Technology\"]', 7, 1, '2026-09-28 17:32:27', '2026-09-28 17:32:27'),
(8, 1, 'year-graduated-ex-2020-2021', 'Year Graduated (ex. 2020-2021):', 'text', NULL, 8, 1, '2026-09-28 17:32:41', '2026-09-28 17:32:41'),
(9, 2, 'what-continuing-professional-education-wereare-you-engaged-in', 'What continuing professional education were/are you engaged in:', 'radio', '[\"Graduate Study\",\"Attending seminars\\/trainings\",\"Others\"]', 1, 1, '2026-09-28 17:33:15', '2026-09-28 17:33:15'),
(10, 2, 'are-you-currently-employed', 'Are you currently employed?', 'radio', '[\"Yes\",\"No\"]', 2, 1, '2026-09-28 17:33:26', '2026-09-28 17:33:26'),
(11, 2, 'employment-status', 'Employment Status', 'radio', '[\"Permanent\\/Regular\",\"Probationary\",\"N\\/A\"]', 4, 1, '2026-09-28 17:34:10', '2026-09-28 17:34:10'),
(12, 2, 'name-of-companyinstitution-of-current-employment', 'Name of Company/Institution of current employment:', 'text', NULL, 5, 1, '2026-09-28 17:34:17', '2026-09-28 17:34:17'),
(13, 2, 'nature-of-company', 'Nature of Company:', 'text', NULL, 6, 1, '2026-09-28 17:34:23', '2026-09-28 17:34:23'),
(14, 2, 'monthly-salary-please-specify', 'Monthly Salary (please specify):', 'text', NULL, 7, 0, '2026-09-28 17:34:27', '2026-09-28 17:34:27'),
(15, 3, 'name-of-company', 'Name of Company:', 'text', NULL, 2, 1, '2026-09-28 17:35:03', '2026-09-28 17:35:03'),
(16, 3, 'position', 'Position:', 'text', NULL, 3, 1, '2026-09-28 17:35:07', '2026-09-28 17:35:07'),
(17, 3, 'duration-of-stay', 'Duration of stay:', 'text', NULL, 4, 1, '2026-09-28 17:35:11', '2026-09-28 17:35:11'),
(18, 3, 'how-did-you-find-your-first-job', 'How did you find your first job?', 'select', '[\"Response to advertisements\",\"Recommended by someone\",\"Walk-in applicant\",\"Information from friends\",\"Job Fair\",\"University job placement\",\"Others\"]', 5, 1, '2026-09-28 17:35:41', '2026-09-28 17:35:41'),
(19, 3, 'what-problems-did-you-encounter-during-your-job-hunting', 'What problems did you encounter during your job hunting?', 'textarea', NULL, 6, 1, '2026-09-28 17:35:47', '2026-09-28 17:35:47'),
(20, 3, 'what-are-your-suggestions-to-enhance-the-competitiveness-of-wup-graduates-feel-free-to-specify-some-areas-that-you-believe-needs-to-be-improved', 'What are your suggestions to enhance the competitiveness of WUP graduates? Feel free to specify some areas that you believe needs to be improved?', 'textarea', NULL, 7, 1, '2026-09-28 17:35:56', '2026-09-28 17:35:56'),
(21, 3, 'if-not-employed-are-you-engaged-in-any-business', 'If not employed, are you engaged in any business', 'radio', '[\"Yes\",\"No\"]', 8, 1, '2026-09-28 17:36:09', '2026-09-28 17:36:09'),
(22, 3, 'nature-of-business', 'Nature of Business:', 'text', NULL, 9, 1, '2026-09-28 17:36:14', '2026-09-28 17:36:14'),
(23, 3, 'what-community-projects-wereare-you-involved-in', 'What community projects were/are you involved in?', 'radio', '[\"Medical\\/Dental mission\",\"Conducting training\",\"Livelihood projects\",\"Others\"]', 10, 1, '2026-09-28 17:36:34', '2026-09-28 17:36:34'),
(24, 4, 'ability-to-apply-knowledge-gained-in-school-to-work-setting', 'Ability to apply knowledge gained in school to work setting.', 'likert', NULL, 1, 1, '2026-09-28 17:37:06', '2026-09-28 17:37:06'),
(25, 4, 'written-communication-skills', 'Written communication skills.', 'likert', NULL, 2, 1, '2026-09-28 17:37:12', '2026-09-28 17:37:12'),
(26, 4, 'oral-communication-skills', 'Oral communication skills.', 'likert', NULL, 3, 1, '2026-09-28 17:37:17', '2026-09-28 17:37:17'),
(27, 4, 'interpersonalsocial-skills-the-ability-to-relate-with-co-workers-and-work-with-a-group', 'Interpersonal/Social Skills - the ability to relate with co-workers and work with a group.', 'likert', NULL, 4, 1, '2026-09-28 17:37:23', '2026-09-28 17:37:23'),
(28, 4, 'problem-solving-skills-the-ability-to-analyze-work-problems-and-apply-appropriate-solutions', 'Problem solving skills - the ability to analyze work problems and apply appropriate solutions.', 'likert', NULL, 5, 1, '2026-09-28 17:37:29', '2026-09-28 17:37:29'),
(29, 4, 'decision-making-skills-ability-to-make-sound-decisions-based-on-facts-rather-than-emotion', 'Decision making skills - ability to make sound decisions based on facts rather than emotion.', 'likert', NULL, 6, 1, '2026-09-28 17:37:35', '2026-09-28 17:37:35'),
(30, 4, 'ability-to-perform-a-task-with-minimum-supervision', 'Ability to perform a task with minimum supervision.', 'likert', NULL, 7, 1, '2026-09-28 17:37:41', '2026-09-28 17:37:41'),
(31, 4, 'confidence-in-ones-ability-to-perform-a-given-task-effectively', 'Confidence in one’s ability to perform a given task effectively.', 'likert', NULL, 8, 1, '2026-09-28 17:37:47', '2026-09-28 17:37:47'),
(32, 4, 'technical-skills-use-of-computers-and-other-technical-gadgets-in-work-setting', 'Technical skills (use of computers and other technical gadgets in work setting).', 'likert', NULL, 9, 1, '2026-09-28 17:37:54', '2026-09-28 17:37:54'),
(33, 4, 'desire-for-continuous-learning-like-attending-trainings-seminars-graduate-study', 'Desire for continuous learning like attending trainings, seminars, graduate study.', 'likert', NULL, 10, 1, '2026-09-28 17:37:59', '2026-09-28 17:37:59'),
(34, 5, 'general-education-social-sciences-english-math-natural-sciences', 'General Education (Social Sciences, English , Math, Natural Sciences)', 'likert', NULL, 2, 1, '2026-09-28 17:38:38', '2026-09-28 17:38:38'),
(35, 5, 'professional-subjects-major-subjects', 'Professional Subjects (major subjects)', 'likert', NULL, 3, 1, '2026-09-28 17:38:44', '2026-09-28 17:38:44'),
(36, 5, 'elective-subjects', 'Elective Subjects', 'likert', NULL, 4, 1, '2026-09-28 17:38:49', '2026-09-28 17:38:49'),
(37, 5, 'doing-research-term-papers', 'Doing research, term papers', 'likert', NULL, 6, 1, '2026-09-28 17:39:00', '2026-09-28 17:39:00'),
(38, 5, 'field-work-ojt-practicum', 'Field work/ OJT/ Practicum', 'likert', NULL, 7, 1, '2026-09-28 17:39:06', '2026-09-28 17:39:06'),
(39, 5, 'doing-projects', 'Doing projects', 'likert', NULL, 8, 1, '2026-09-28 17:39:12', '2026-09-28 17:39:12'),
(40, 5, 'joining-student-organizations-and-societies', 'Joining student organizations and societies', 'likert', NULL, 10, 1, '2026-09-28 17:39:23', '2026-09-28 17:39:23'),
(41, 5, 'writing-in-student-paper', 'Writing in student paper', 'likert', NULL, 11, 1, '2026-09-28 17:39:28', '2026-09-28 17:39:28'),
(42, 5, 'joining-competitions-quiz-bees-cultural-and-sports-etc', 'Joining competitions (Quiz bees, cultural and sports, etc.)', 'likert', NULL, 12, 1, '2026-09-28 17:39:36', '2026-09-28 17:39:36'),
(43, 5, 'what-other-experiences-at-wup-did-you-find-useful-in-your-work-please-specify', 'What other experiences at WUP did you find useful in your work? Please specify:', 'textarea', NULL, 13, 1, '2026-09-28 17:39:41', '2026-09-28 17:39:41'),
(44, 6, 'wesleyanians-consistently-demonstrate-integrity-in-their-actions-and-decisions', 'Wesleyanians consistently demonstrate integrity in their actions and decisions.', 'likert', NULL, 2, 1, '2026-09-28 17:40:28', '2026-09-28 17:40:28'),
(45, 6, 'wesleyanians-treat-others-with-respect-and-empathy-regardless-of-their-background-or-beliefs', 'Wesleyanians treat others with respect and empathy, regardless of their background or beliefs.', 'likert', NULL, 3, 1, '2026-09-28 17:40:33', '2026-09-28 17:40:33'),
(46, 6, 'wesleyanians-take-responsibility-for-their-mistakes-and-learn-from-them', 'Wesleyanians take responsibility for their mistakes and learn from them.', 'likert', NULL, 4, 1, '2026-09-28 17:40:39', '2026-09-28 17:40:39'),
(47, 6, 'wesleyanians-are-actively-involved-in-serving-the-community', 'Wesleyanians are actively involved in serving the community.', 'likert', NULL, 6, 1, '2026-09-28 17:40:49', '2026-09-28 17:40:49'),
(48, 6, 'wesleyanians-are-committed-to-using-their-skills-and-knowledge-to-make-a-positive-impact-on-society', 'Wesleyanians are committed to using their skills and knowledge to make a positive impact on society.', 'likert', NULL, 7, 1, '2026-09-28 17:40:55', '2026-09-28 17:40:55'),
(49, 6, 'wesleyanians-seek-opportunities-to-help-those-in-need', 'Wesleyanians seek opportunities to help those in need.', 'likert', NULL, 8, 1, '2026-09-28 17:41:00', '2026-09-28 17:41:00'),
(50, 6, 'wesleyanians-are-dedicated-to-lifelong-learning-and-intellectual-growth', 'Wesleyanians are dedicated to lifelong learning and intellectual growth.', 'likert', NULL, 10, 1, '2026-09-28 17:41:12', '2026-09-28 17:41:12'),
(51, 6, 'wesleyanians-strive-for-excellence-in-their-academic-pursuits', 'Wesleyanians strive for excellence in their academic pursuits.', 'likert', NULL, 11, 1, '2026-09-28 17:41:17', '2026-09-28 17:41:17'),
(52, 6, 'wesleyanians-actively-seek-out-opportunities-to-expand-their-knowledge-and-skills', 'Wesleyanians actively seek out opportunities to expand their knowledge and skills.', 'likert', NULL, 12, 1, '2026-09-28 17:41:22', '2026-09-28 17:41:22');

-- --------------------------------------------------------

--
-- Table structure for table `responses`
--

CREATE TABLE `responses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `survey_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `question_id` bigint(20) UNSIGNED NOT NULL,
  `answer_value` text DEFAULT NULL,
  `submitted_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `responses`
--

INSERT INTO `responses` (`id`, `survey_id`, `user_id`, `question_id`, `answer_value`, `submitted_at`, `created_at`, `updated_at`) VALUES
(1, 1, 77, 1, 'Joyce', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(2, 1, 77, 2, 'Abesamis', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(3, 1, 77, 3, 'Dela Cruz', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(4, 1, 77, 4, 'Purok II, Gapan City, Nueva Ecija', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(5, 1, 77, 5, 'alumni1@gmail.com', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(6, 1, 77, 6, '639974013361', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(7, 1, 77, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(8, 1, 77, 8, '2024-2025', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(9, 1, 77, 9, 'Attending seminars/trainings', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(10, 1, 77, 10, 'Yes', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(11, 1, 77, 11, 'Permanent/Regular', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(12, 1, 77, 12, 'Accenture Philippines', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(13, 1, 77, 13, 'Information Technology & Consulting', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(14, 1, 77, 14, '35000', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(15, 1, 77, 15, 'Ameritel BPO', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(16, 1, 77, 16, 'IT Technical Support', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(17, 1, 77, 17, '1 year and 6 months', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(18, 1, 77, 18, 'Others|Online Job Portals', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(19, 1, 77, 19, 'High competition among entry-level applicants and strict experience requirements for technical roles.', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(20, 1, 77, 20, 'Integrate more hands-on industry certifications (like Cisco, AWS, or CompTIA) directly into the curriculum.', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(21, 1, 77, 21, 'No', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(22, 1, 77, 22, '*', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(23, 1, 77, 23, 'Conducting training', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(24, 1, 77, 24, '3 - Moderate', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(25, 1, 77, 25, '4 - Very Much', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(26, 1, 77, 26, '3 - Moderate', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(27, 1, 77, 27, '4 - Very Much', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(28, 1, 77, 28, '4 - Very Much', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(29, 1, 77, 29, '3 - Moderate', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(30, 1, 77, 30, '4 - Very Much', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(31, 1, 77, 31, '3 - Moderate', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(32, 1, 77, 32, '4 - Very Much', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(33, 1, 77, 33, '4 - Very Much', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(34, 1, 77, 34, '3 - Moderately Useful', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(35, 1, 77, 35, '4 - Very Useful', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(36, 1, 77, 36, '4 - Very Useful', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(37, 1, 77, 37, '3 - Moderately Useful', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(38, 1, 77, 38, '4 - Very Useful', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(39, 1, 77, 39, '4 - Very Useful', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(40, 1, 77, 40, '3 - Moderately Useful', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(41, 1, 77, 41, '4 - Very Useful', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(42, 1, 77, 42, '4 - Very Useful', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(43, 1, 77, 43, 'Hands-On System Diagnostics and Hardware Troubleshooting: Repairing PC motherboards, configuring peripheral components, and setting up lab workstations prepared me for real-world technical support.', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(44, 1, 77, 44, '4 - Agree', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(45, 1, 77, 45, '4 - Agree', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(46, 1, 77, 46, '4 - Agree', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(47, 1, 77, 47, '4 - Agree', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(48, 1, 77, 48, '4 - Agree', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(49, 1, 77, 49, '4 - Agree', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(50, 1, 77, 50, '4 - Agree', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(51, 1, 77, 51, '4 - Agree', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(52, 1, 77, 52, '4 - Agree', '2026-09-28 20:36:03', '2026-09-28 20:36:03', '2026-09-28 20:36:03'),
(53, 1, 2, 1, 'Joyce', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(54, 1, 2, 2, 'Abesamis', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(55, 1, 2, 3, 'Dela Cruz', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(56, 1, 2, 4, 'Purok II, Gapan City, Nueva Ecija', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(57, 1, 2, 5, 'alumni1@gmail.com', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(58, 1, 2, 6, '639974013361', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(59, 1, 2, 7, 'Bachelor of Science in Information Technology', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(60, 1, 2, 8, '2024-2025', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(61, 1, 2, 9, 'Attending seminars/trainings', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(62, 1, 2, 10, 'Yes', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(63, 1, 2, 11, 'Permanent/Regular', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(64, 1, 2, 12, 'Accenture Philippines', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(65, 1, 2, 13, 'Information Technology & Consulting', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(66, 1, 2, 14, '35000', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(67, 1, 2, 15, 'Ameritel BPO', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(68, 1, 2, 16, 'IT Technical Support', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(69, 1, 2, 17, '1 year and 6 months', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(70, 1, 2, 18, 'Recommended by someone', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(71, 1, 2, 19, 'High competition among entry-level applicants and strict experience requirements for technical roles.', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(72, 1, 2, 20, 'Integrate more hands-on industry certifications (like Cisco, AWS, or CompTIA) directly into the curriculum.', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(73, 1, 2, 21, 'No', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(74, 1, 2, 22, '*', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(75, 1, 2, 23, 'Conducting training', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(76, 1, 2, 24, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(77, 1, 2, 25, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(78, 1, 2, 26, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(79, 1, 2, 27, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(80, 1, 2, 28, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(81, 1, 2, 29, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(82, 1, 2, 30, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(83, 1, 2, 31, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(84, 1, 2, 32, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(85, 1, 2, 33, '4 - Very Much', '2026-09-28 20:58:30', '2026-09-28 20:58:30', '2026-09-28 20:58:30'),
(86, 1, 2, 34, '4 - Very Useful', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(87, 1, 2, 35, '4 - Very Useful', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(88, 1, 2, 36, '4 - Very Useful', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(89, 1, 2, 37, '4 - Very Useful', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(90, 1, 2, 38, '4 - Very Useful', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(91, 1, 2, 39, '4 - Very Useful', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(92, 1, 2, 40, '4 - Very Useful', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(93, 1, 2, 41, '4 - Very Useful', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(94, 1, 2, 42, '4 - Very Useful', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(95, 1, 2, 43, 'Hands-On System Diagnostics and Hardware Troubleshooting: Repairing PC motherboards, configuring peripheral components, and setting up lab workstations prepared me for real-world technical support.', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(96, 1, 2, 44, '4 - Agree', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(97, 1, 2, 45, '4 - Agree', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(98, 1, 2, 46, '4 - Agree', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(99, 1, 2, 47, '4 - Agree', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(100, 1, 2, 48, '4 - Agree', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(101, 1, 2, 49, '4 - Agree', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(102, 1, 2, 50, '4 - Agree', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(103, 1, 2, 51, '4 - Agree', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(104, 1, 2, 52, '4 - Agree', '2026-09-28 20:58:31', '2026-09-28 20:58:31', '2026-09-28 20:58:31'),
(105, 1, 112, 1, 'Jay Mharie', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(106, 1, 112, 2, 'Dalangin', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(107, 1, 112, 3, 'Atayde', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(108, 1, 112, 4, '168 Purok 2, Brgy. Sta. Cruz, Zaragoza, Nueva Ecija', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(109, 1, 112, 5, 'ataydejaymharie0517@gmail.com', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(110, 1, 112, 6, '09501123927', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(111, 1, 112, 7, 'Bachelor of Science in Information Technology', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(112, 1, 112, 8, '2025-2026', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(113, 1, 112, 9, 'Graduate Study', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(114, 1, 112, 10, 'No', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(115, 1, 112, 11, 'N/A', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(116, 1, 112, 12, '*', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(117, 1, 112, 13, '*', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(118, 1, 112, 14, NULL, '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(119, 1, 112, 15, '*', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(120, 1, 112, 16, '*', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(121, 1, 112, 17, '*', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(122, 1, 112, 18, 'Others|N/A', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(123, 1, 112, 19, 'I had difficulty finding job openings related to my course.', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(124, 1, 112, 20, 'Provide more hands-on training and practical activities related to students’ future careers.', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(125, 1, 112, 21, 'Yes', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(126, 1, 112, 22, 'Online Business', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(127, 1, 112, 23, 'Others|Creating Content Videos', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(128, 1, 112, 24, '4 - Very Much', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(129, 1, 112, 25, '4 - Very Much', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(130, 1, 112, 26, '4 - Very Much', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(131, 1, 112, 27, '3 - Moderate', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(132, 1, 112, 28, '3 - Moderate', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(133, 1, 112, 29, '4 - Very Much', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(134, 1, 112, 30, '4 - Very Much', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(135, 1, 112, 31, '3 - Moderate', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(136, 1, 112, 32, '3 - Moderate', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(137, 1, 112, 33, '3 - Moderate', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(138, 1, 112, 34, '4 - Very Useful', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(139, 1, 112, 35, '4 - Very Useful', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(140, 1, 112, 36, '4 - Very Useful', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(141, 1, 112, 37, '4 - Very Useful', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(142, 1, 112, 38, '3 - Moderately Useful', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(143, 1, 112, 39, '3 - Moderately Useful', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(144, 1, 112, 40, '3 - Moderately Useful', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(145, 1, 112, 41, '2 - Slightly Useful', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(146, 1, 112, 42, '3 - Moderately Useful', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(147, 1, 112, 43, 'Hands-on experience during OJT helped me understand actual workplace responsibilities.', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(148, 1, 112, 44, '4 - Agree', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(149, 1, 112, 45, '4 - Agree', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(150, 1, 112, 46, '3 - Moderately Agree', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(151, 1, 112, 47, '4 - Agree', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(152, 1, 112, 48, '4 - Agree', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(153, 1, 112, 49, '4 - Agree', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(154, 1, 112, 50, '4 - Agree', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(155, 1, 112, 51, '4 - Agree', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(156, 1, 112, 52, '4 - Agree', '2026-09-28 22:44:19', '2026-09-28 22:44:19', '2026-09-28 22:44:19'),
(157, 1, 27, 1, 'Jan Nathaniel', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(158, 1, 27, 2, 'Anlueco', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(159, 1, 27, 3, 'memita', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(160, 1, 27, 4, 'Pitong Gatang street, San Antonio 3105, Nueva Ecija', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(161, 1, 27, 5, 'alumni26@gmail.com', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(162, 1, 27, 6, '09351081582', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(163, 1, 27, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(164, 1, 27, 8, '2024-2025', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(165, 1, 27, 9, 'Graduate Study', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(166, 1, 27, 10, 'No', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(167, 1, 27, 11, 'N/A', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(168, 1, 27, 12, '*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(169, 1, 27, 13, '*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(170, 1, 27, 14, '*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(171, 1, 27, 15, '*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(172, 1, 27, 16, '*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(173, 1, 27, 17, '*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(174, 1, 27, 18, 'Others|*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(175, 1, 27, 19, '*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(176, 1, 27, 20, 'None', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(177, 1, 27, 21, 'No', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(178, 1, 27, 22, '*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(179, 1, 27, 23, 'Others|*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(180, 1, 27, 24, '2 - Slight', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(181, 1, 27, 25, '3 - Moderate', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(182, 1, 27, 26, '2 - Slight', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(183, 1, 27, 27, '3 - Moderate', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(184, 1, 27, 28, '3 - Moderate', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(185, 1, 27, 29, '3 - Moderate', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(186, 1, 27, 30, '2 - Slight', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42');
INSERT INTO `responses` (`id`, `survey_id`, `user_id`, `question_id`, `answer_value`, `submitted_at`, `created_at`, `updated_at`) VALUES
(187, 1, 27, 31, '2 - Slight', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(188, 1, 27, 32, '3 - Moderate', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(189, 1, 27, 33, '1 - Very Little', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(190, 1, 27, 34, '1 - Not Useful', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(191, 1, 27, 35, '3 - Moderately Useful', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(192, 1, 27, 36, '1 - Not Useful', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(193, 1, 27, 37, '2 - Slightly Useful', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(194, 1, 27, 38, '4 - Very Useful', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(195, 1, 27, 39, '2 - Slightly Useful', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(196, 1, 27, 40, '2 - Slightly Useful', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(197, 1, 27, 41, '2 - Slightly Useful', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(198, 1, 27, 42, '3 - Moderately Useful', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(199, 1, 27, 43, '*', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(200, 1, 27, 44, '3 - Moderately Agree', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(201, 1, 27, 45, '3 - Moderately Agree', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(202, 1, 27, 46, '3 - Moderately Agree', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(203, 1, 27, 47, '3 - Moderately Agree', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(204, 1, 27, 48, '4 - Agree', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(205, 1, 27, 49, '4 - Agree', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(206, 1, 27, 50, '2 - Slightly Agree', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(207, 1, 27, 51, '3 - Moderately Agree', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(208, 1, 27, 52, '4 - Agree', '2026-09-28 22:46:42', '2026-09-28 22:46:42', '2026-09-28 22:46:42'),
(209, 1, 29, 1, 'John Arvin', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(210, 1, 29, 2, 'Leynes', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(211, 1, 29, 3, 'Odulio', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(212, 1, 29, 4, 'Block 1, Gapan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(213, 1, 29, 5, 'alumni28@gmail.com', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(214, 1, 29, 6, '639612938582', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(215, 1, 29, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(216, 1, 29, 8, '2024-2025', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(217, 1, 29, 9, 'Graduate Study', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(218, 1, 29, 10, 'Yes', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(219, 1, 29, 11, 'Permanent/Regular', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(220, 1, 29, 12, 'ACME Electronics Philippines', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(221, 1, 29, 13, 'Electronics Manufacturing', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(222, 1, 29, 15, 'ACME Electronics Philippines', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(223, 1, 29, 16, 'Computer Engineer', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(224, 1, 29, 17, '6months', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(225, 1, 29, 18, 'Job Fair', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(226, 1, 29, 19, 'Most companies required work experience even for entry-level positions.', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(227, 1, 29, 20, 'Strengthen internship and OJT programs to give students more real-world work experience.', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(228, 1, 29, 21, 'No', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(229, 1, 29, 22, '*', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(230, 1, 29, 23, 'Others|N/A', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(231, 1, 29, 24, '4 - Very Much', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(232, 1, 29, 25, '4 - Very Much', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(233, 1, 29, 26, '4 - Very Much', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(234, 1, 29, 27, '3 - Moderate', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(235, 1, 29, 28, '3 - Moderate', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(236, 1, 29, 29, '3 - Moderate', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(237, 1, 29, 30, '3 - Moderate', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(238, 1, 29, 31, '4 - Very Much', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(239, 1, 29, 32, '3 - Moderate', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(240, 1, 29, 33, '3 - Moderate', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(241, 1, 29, 34, '3 - Moderately Useful', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(242, 1, 29, 35, '4 - Very Useful', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(243, 1, 29, 36, '4 - Very Useful', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(244, 1, 29, 37, '3 - Moderately Useful', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(245, 1, 29, 38, '3 - Moderately Useful', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(246, 1, 29, 39, '4 - Very Useful', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(247, 1, 29, 40, '4 - Very Useful', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(248, 1, 29, 41, '3 - Moderately Useful', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(249, 1, 29, 42, '4 - Very Useful', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(250, 1, 29, 43, 'Teamwork taught me how to communicate and collaborate effectively with others.', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(251, 1, 29, 44, '4 - Agree', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(252, 1, 29, 45, '3 - Moderately Agree', '2026-09-28 22:56:59', '2026-09-28 22:56:59', '2026-09-28 22:56:59'),
(253, 1, 29, 46, '4 - Agree', '2026-09-28 22:57:00', '2026-09-28 22:57:00', '2026-09-28 22:57:00'),
(254, 1, 29, 47, '4 - Agree', '2026-09-28 22:57:00', '2026-09-28 22:57:00', '2026-09-28 22:57:00'),
(255, 1, 29, 48, '4 - Agree', '2026-09-28 22:57:00', '2026-09-28 22:57:00', '2026-09-28 22:57:00'),
(256, 1, 29, 49, '4 - Agree', '2026-09-28 22:57:00', '2026-09-28 22:57:00', '2026-09-28 22:57:00'),
(257, 1, 29, 50, '4 - Agree', '2026-09-28 22:57:00', '2026-09-28 22:57:00', '2026-09-28 22:57:00'),
(258, 1, 29, 51, '4 - Agree', '2026-09-28 22:57:00', '2026-09-28 22:57:00', '2026-09-28 22:57:00'),
(259, 1, 29, 52, '4 - Agree', '2026-09-28 22:57:00', '2026-09-28 22:57:00', '2026-09-28 22:57:00'),
(260, 1, 52, 1, 'Sean', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(261, 1, 52, 2, 'Torres', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(262, 1, 52, 3, 'Ramos', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(263, 1, 52, 4, 'Purok 3, St. Francis Subd., Brgy. Sumacab Main, Cabanatuan City, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(264, 1, 52, 5, 'alumni51@gmail.com', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(265, 1, 52, 6, '09844211520', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(266, 1, 52, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(267, 1, 52, 8, '2001-2002', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(268, 1, 52, 9, 'Graduate Study', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(269, 1, 52, 10, 'No', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(270, 1, 52, 11, 'Permanent/Regular', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(271, 1, 52, 12, 'Accenture Philippines', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(272, 1, 52, 13, 'IT services', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(273, 1, 52, 15, 'Yondu', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(274, 1, 52, 16, 'Junior Developer', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(275, 1, 52, 17, '5 years', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(276, 1, 52, 18, 'Walk-in applicant', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(277, 1, 52, 19, 'Limited work experience and difficulty finding job openings that match my skills and qualifications.', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(278, 1, 52, 20, 'Provide more hands-on training, industry-related seminars, internship opportunities, and career preparation programs to help graduates develop practical and technical skills.', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(279, 1, 52, 21, 'No', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(280, 1, 52, 22, 'N/A', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(281, 1, 52, 23, 'Others|None', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(282, 1, 52, 24, '4 - Very Much', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(283, 1, 52, 25, '4 - Very Much', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(284, 1, 52, 26, '3 - Moderate', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(285, 1, 52, 27, '3 - Moderate', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(286, 1, 52, 28, '3 - Moderate', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(287, 1, 52, 29, '4 - Very Much', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(288, 1, 52, 30, '3 - Moderate', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(289, 1, 52, 31, '3 - Moderate', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(290, 1, 52, 32, '3 - Moderate', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(291, 1, 52, 33, '4 - Very Much', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(292, 1, 52, 34, '4 - Very Useful', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(293, 1, 52, 35, '3 - Moderately Useful', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(294, 1, 52, 36, '3 - Moderately Useful', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(295, 1, 52, 37, '3 - Moderately Useful', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(296, 1, 52, 38, '4 - Very Useful', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(297, 1, 52, 39, '4 - Very Useful', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(298, 1, 52, 40, '3 - Moderately Useful', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(299, 1, 52, 41, '3 - Moderately Useful', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(300, 1, 52, 42, '4 - Very Useful', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(301, 1, 52, 43, 'Hands-on activities, OJT experience, computer-related projects, teamwork, and technical training helped me develop practical skills that are useful in my work.', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(302, 1, 52, 44, '4 - Agree', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(303, 1, 52, 45, '3 - Moderately Agree', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(304, 1, 52, 46, '3 - Moderately Agree', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(305, 1, 52, 47, '4 - Agree', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(306, 1, 52, 48, '4 - Agree', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(307, 1, 52, 49, '3 - Moderately Agree', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(308, 1, 52, 50, '4 - Agree', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(309, 1, 52, 51, '3 - Moderately Agree', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(310, 1, 52, 52, '3 - Moderately Agree', '2026-09-28 22:57:31', '2026-09-28 22:57:31', '2026-09-28 22:57:31'),
(311, 1, 28, 1, 'Gerald Fran', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(312, 1, 28, 2, 'Gonzales', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(313, 1, 28, 3, 'Oanes', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(314, 1, 28, 4, 'Purok 5,Zaragosa 3133, Nueva Ecija', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(315, 1, 28, 5, 'Alumni27@gmail.com', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(316, 1, 28, 6, '09369255894', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(317, 1, 28, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(318, 1, 28, 8, '2024-2025', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(319, 1, 28, 9, 'Graduate Study', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(320, 1, 28, 10, 'Yes', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(321, 1, 28, 11, 'Permanent/Regular', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(322, 1, 28, 12, 'Concentrix Philippines', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(323, 1, 28, 13, 'Business Process Outsourcing (BPO)', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(324, 1, 28, 14, '20000', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(325, 1, 28, 15, 'Concentrix Philippines', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(326, 1, 28, 16, 'IT Support Specialist', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(327, 1, 28, 17, '8months', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(328, 1, 28, 18, 'Information from friends', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(329, 1, 28, 19, 'I had limited job opportunities available in my area.', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(330, 1, 28, 20, 'Offer more workshops on job interviews, resume writing, and professional communication.', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(331, 1, 28, 21, 'No', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(332, 1, 28, 22, '*', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(333, 1, 28, 23, 'Others|N/A', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(334, 1, 28, 24, '3 - Moderate', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(335, 1, 28, 25, '3 - Moderate', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(336, 1, 28, 26, '4 - Very Much', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(337, 1, 28, 27, '4 - Very Much', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(338, 1, 28, 28, '4 - Very Much', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(339, 1, 28, 29, '4 - Very Much', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(340, 1, 28, 30, '4 - Very Much', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(341, 1, 28, 31, '4 - Very Much', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(342, 1, 28, 32, '4 - Very Much', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(343, 1, 28, 33, '4 - Very Much', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(344, 1, 28, 34, '3 - Moderately Useful', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(345, 1, 28, 35, '4 - Very Useful', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(346, 1, 28, 36, '4 - Very Useful', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(347, 1, 28, 37, '3 - Moderately Useful', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(348, 1, 28, 38, '4 - Very Useful', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(349, 1, 28, 39, '3 - Moderately Useful', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(350, 1, 28, 40, '4 - Very Useful', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(351, 1, 28, 41, '3 - Moderately Useful', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(352, 1, 28, 42, '4 - Very Useful', '2026-09-28 23:04:19', '2026-09-28 23:04:19', '2026-09-28 23:04:19'),
(353, 1, 28, 43, 'Customer service experience helped me improve my communication and problem-solving skills.', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(354, 1, 28, 44, '4 - Agree', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(355, 1, 28, 45, '4 - Agree', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(356, 1, 28, 46, '4 - Agree', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(357, 1, 28, 47, '4 - Agree', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(358, 1, 28, 48, '4 - Agree', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(359, 1, 28, 49, '4 - Agree', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(360, 1, 28, 50, '4 - Agree', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(361, 1, 28, 51, '4 - Agree', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(362, 1, 28, 52, '4 - Agree', '2026-09-28 23:04:20', '2026-09-28 23:04:20', '2026-09-28 23:04:20'),
(363, 1, 30, 1, 'Byron', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(364, 1, 30, 2, 'ibarra', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(365, 1, 30, 3, 'Padunan', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(366, 1, 30, 4, 'Camino drive,Sto.Domingo 3100 Nueva Ecija', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(367, 1, 30, 5, 'Alumni29@gmail.com', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(368, 1, 30, 6, '09928990885', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(369, 1, 30, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01');
INSERT INTO `responses` (`id`, `survey_id`, `user_id`, `question_id`, `answer_value`, `submitted_at`, `created_at`, `updated_at`) VALUES
(370, 1, 30, 8, '2024-2025', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(371, 1, 30, 9, 'Graduate Study', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(372, 1, 30, 10, 'No', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(373, 1, 30, 11, 'N/A', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(374, 1, 30, 12, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(375, 1, 30, 13, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(376, 1, 30, 14, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(377, 1, 30, 15, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(378, 1, 30, 16, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(379, 1, 30, 17, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(380, 1, 30, 18, 'Others|*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(381, 1, 30, 19, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(382, 1, 30, 20, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(383, 1, 30, 21, 'No', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(384, 1, 30, 22, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(385, 1, 30, 23, 'Others|*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(386, 1, 30, 24, '2 - Slight', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(387, 1, 30, 25, '2 - Slight', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(388, 1, 30, 26, '2 - Slight', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(389, 1, 30, 27, '3 - Moderate', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(390, 1, 30, 28, '2 - Slight', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(391, 1, 30, 29, '3 - Moderate', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(392, 1, 30, 30, '4 - Very Much', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(393, 1, 30, 31, '4 - Very Much', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(394, 1, 30, 32, '2 - Slight', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(395, 1, 30, 33, '2 - Slight', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(396, 1, 30, 34, '1 - Not Useful', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(397, 1, 30, 35, '4 - Very Useful', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(398, 1, 30, 36, '1 - Not Useful', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(399, 1, 30, 37, '2 - Slightly Useful', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(400, 1, 30, 38, '4 - Very Useful', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(401, 1, 30, 39, '1 - Not Useful', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(402, 1, 30, 40, '2 - Slightly Useful', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(403, 1, 30, 41, '2 - Slightly Useful', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(404, 1, 30, 42, '1 - Not Useful', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(405, 1, 30, 43, '*', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(406, 1, 30, 44, '3 - Moderately Agree', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(407, 1, 30, 45, '3 - Moderately Agree', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(408, 1, 30, 46, '4 - Agree', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(409, 1, 30, 47, '4 - Agree', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(410, 1, 30, 48, '3 - Moderately Agree', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(411, 1, 30, 49, '2 - Slightly Agree', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(412, 1, 30, 50, '3 - Moderately Agree', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(413, 1, 30, 51, '2 - Slightly Agree', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(414, 1, 30, 52, '4 - Agree', '2026-09-28 23:08:01', '2026-09-28 23:08:01', '2026-09-28 23:08:01'),
(415, 1, 31, 1, 'Jeano', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(416, 1, 31, 2, 'Baguisa', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(417, 1, 31, 3, 'Pascual', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(418, 1, 31, 4, '875 Purok 4, Cabanatuan City 3110, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(419, 1, 31, 5, 'alumni30@gmail.com', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(420, 1, 31, 6, '639082615504', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(421, 1, 31, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(422, 1, 31, 8, '2024-2025', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(423, 1, 31, 9, 'Graduate Study', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(424, 1, 31, 10, 'Yes', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(425, 1, 31, 11, 'Permanent/Regular', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(426, 1, 31, 12, 'PLDT Inc.', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(427, 1, 31, 13, 'Telecommunications', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(428, 1, 31, 14, NULL, '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(429, 1, 31, 15, 'PLDT Inc.', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(430, 1, 31, 16, 'Network Engineer', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(431, 1, 31, 17, '6months', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(432, 1, 31, 18, 'Walk-in applicant', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(433, 1, 31, 19, 'Some employers offered salaries that were lower than expected.', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(434, 1, 31, 20, 'Improve training in current technologies and industry-relevant software and tools.', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(435, 1, 31, 21, 'No', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(436, 1, 31, 22, '*', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(437, 1, 31, 23, 'Others|N/A', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(438, 1, 31, 24, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(439, 1, 31, 25, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(440, 1, 31, 26, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(441, 1, 31, 27, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(442, 1, 31, 28, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(443, 1, 31, 29, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(444, 1, 31, 30, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(445, 1, 31, 31, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(446, 1, 31, 32, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(447, 1, 31, 33, '4 - Very Much', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(448, 1, 31, 34, '4 - Very Useful', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(449, 1, 31, 35, '4 - Very Useful', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(450, 1, 31, 36, '4 - Very Useful', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(451, 1, 31, 37, '3 - Moderately Useful', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(452, 1, 31, 38, '3 - Moderately Useful', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(453, 1, 31, 39, '4 - Very Useful', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(454, 1, 31, 40, '3 - Moderately Useful', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(455, 1, 31, 41, '2 - Slightly Useful', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(456, 1, 31, 42, '3 - Moderately Useful', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(457, 1, 31, 43, 'Using different software and computer tools was useful in completing work tasks efficiently.', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(458, 1, 31, 44, '4 - Agree', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(459, 1, 31, 45, '4 - Agree', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(460, 1, 31, 46, '4 - Agree', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(461, 1, 31, 47, '4 - Agree', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(462, 1, 31, 48, '4 - Agree', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(463, 1, 31, 49, '4 - Agree', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(464, 1, 31, 50, '4 - Agree', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(465, 1, 31, 51, '4 - Agree', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(466, 1, 31, 52, '4 - Agree', '2026-09-28 23:10:05', '2026-09-28 23:10:05', '2026-09-28 23:10:05'),
(467, 1, 33, 1, 'Tricia', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(468, 1, 33, 2, 'Valdez', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(469, 1, 33, 3, 'Perez', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(470, 1, 33, 4, 'Purok 6, Zaragoza 3205, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(471, 1, 33, 5, 'alumni32@gmail.com', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(472, 1, 33, 6, '09611388031', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(473, 1, 33, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(474, 1, 33, 8, '2024-2025', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(475, 1, 33, 9, 'Graduate Study', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(476, 1, 33, 10, 'No', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(477, 1, 33, 11, 'N/A', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(478, 1, 33, 12, '*', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(479, 1, 33, 13, '*', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(480, 1, 33, 15, '*', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(481, 1, 33, 16, '*', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(482, 1, 33, 17, '*', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(483, 1, 33, 18, 'Others|N/A', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(484, 1, 33, 19, 'I experienced delays in receiving feedback after interviews.', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(485, 1, 33, 20, 'Establish stronger partnerships with companies for internships and employment opportunities.', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(486, 1, 33, 21, 'Yes', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(487, 1, 33, 22, 'Network and IT Solutions', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(488, 1, 33, 23, 'Others|N/A', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(489, 1, 33, 24, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(490, 1, 33, 25, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(491, 1, 33, 26, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(492, 1, 33, 27, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(493, 1, 33, 28, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(494, 1, 33, 29, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(495, 1, 33, 30, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(496, 1, 33, 31, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(497, 1, 33, 32, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(498, 1, 33, 33, '4 - Very Much', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(499, 1, 33, 34, '4 - Very Useful', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(500, 1, 33, 35, '4 - Very Useful', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(501, 1, 33, 36, '4 - Very Useful', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(502, 1, 33, 37, '4 - Very Useful', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(503, 1, 33, 38, '4 - Very Useful', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(504, 1, 33, 39, '4 - Very Useful', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(505, 1, 33, 40, '4 - Very Useful', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(506, 1, 33, 41, '4 - Very Useful', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(507, 1, 33, 42, '4 - Very Useful', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(508, 1, 33, 43, 'Time management helped me finish tasks and meet deadlines.', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(509, 1, 33, 44, '4 - Agree', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(510, 1, 33, 45, '4 - Agree', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(511, 1, 33, 46, '4 - Agree', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(512, 1, 33, 47, '4 - Agree', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(513, 1, 33, 48, '4 - Agree', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(514, 1, 33, 49, '4 - Agree', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(515, 1, 33, 50, '4 - Agree', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(516, 1, 33, 51, '4 - Agree', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(517, 1, 33, 52, '4 - Agree', '2026-09-28 23:14:33', '2026-09-28 23:14:33', '2026-09-28 23:14:33'),
(518, 1, 32, 1, 'jaminli', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(519, 1, 32, 2, 'magsilang', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(520, 1, 32, 3, 'peralta', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(521, 1, 32, 4, 'blk 43 lot 16 devonshirre street, grand victoria subdivision, cabanatuan city 3106, nueva ecija', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(522, 1, 32, 5, 'Alumni31@gmail.com', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(523, 1, 32, 6, '09102071300', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(524, 1, 32, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(525, 1, 32, 8, '2024-2025', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(526, 1, 32, 9, 'Others|*', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(527, 1, 32, 10, 'No', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(528, 1, 32, 11, 'N/A', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(529, 1, 32, 12, '*', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(530, 1, 32, 13, '*', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(531, 1, 32, 14, '*', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(532, 1, 32, 15, '*', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(533, 1, 32, 16, '*', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(534, 1, 32, 17, '*', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(535, 1, 32, 18, 'Others|N/A', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(536, 1, 32, 19, 'I had difficulty competing with applicants who had more experience.', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(537, 1, 32, 20, 'Provide career guidance and job placement assistance for graduating students.', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(538, 1, 32, 21, 'No', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(539, 1, 32, 22, '*', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(540, 1, 32, 23, 'Others|N/A', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(541, 1, 32, 24, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(542, 1, 32, 25, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(543, 1, 32, 26, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(544, 1, 32, 27, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(545, 1, 32, 28, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(546, 1, 32, 29, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(547, 1, 32, 30, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(548, 1, 32, 31, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(549, 1, 32, 32, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(550, 1, 32, 33, '4 - Very Much', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(551, 1, 32, 34, '4 - Very Useful', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(552, 1, 32, 35, '4 - Very Useful', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(553, 1, 32, 36, '4 - Very Useful', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(554, 1, 32, 37, '4 - Very Useful', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(555, 1, 32, 38, '4 - Very Useful', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(556, 1, 32, 39, '4 - Very Useful', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(557, 1, 32, 40, '3 - Moderately Useful', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(558, 1, 32, 41, '3 - Moderately Useful', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(559, 1, 32, 42, '3 - Moderately Useful', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15');
INSERT INTO `responses` (`id`, `survey_id`, `user_id`, `question_id`, `answer_value`, `submitted_at`, `created_at`, `updated_at`) VALUES
(560, 1, 32, 43, 'Troubleshooting experience improved my ability to identify and solve technical problems.', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(561, 1, 32, 44, '4 - Agree', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(562, 1, 32, 45, '4 - Agree', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(563, 1, 32, 46, '4 - Agree', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(564, 1, 32, 47, '3 - Moderately Agree', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(565, 1, 32, 48, '3 - Moderately Agree', '2026-09-28 23:19:15', '2026-09-28 23:19:15', '2026-09-28 23:19:15'),
(566, 1, 32, 49, '4 - Agree', '2026-09-28 23:19:16', '2026-09-28 23:19:16', '2026-09-28 23:19:16'),
(567, 1, 32, 50, '4 - Agree', '2026-09-28 23:19:16', '2026-09-28 23:19:16', '2026-09-28 23:19:16'),
(568, 1, 32, 51, '4 - Agree', '2026-09-28 23:19:16', '2026-09-28 23:19:16', '2026-09-28 23:19:16'),
(569, 1, 32, 52, '3 - Moderately Agree', '2026-09-28 23:19:16', '2026-09-28 23:19:16', '2026-09-28 23:19:16'),
(570, 1, 34, 1, 'Edrick Vincent', '2026-09-28 23:22:25', '2026-09-28 23:22:25', '2026-09-28 23:22:25'),
(571, 1, 34, 2, '*', '2026-09-28 23:22:25', '2026-09-28 23:22:25', '2026-09-28 23:22:25'),
(572, 1, 34, 3, 'Pili', '2026-09-28 23:22:25', '2026-09-28 23:22:25', '2026-09-28 23:22:25'),
(573, 1, 34, 4, 'San Isidro 3125, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-28 23:22:25', '2026-09-28 23:22:25', '2026-09-28 23:22:25'),
(574, 1, 34, 5, 'alumni33@gmail.com', '2026-09-28 23:22:25', '2026-09-28 23:22:25', '2026-09-28 23:22:25'),
(575, 1, 34, 6, '09266519843', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(576, 1, 34, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(577, 1, 34, 8, '2024-2025', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(578, 1, 34, 9, 'Graduate Study', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(579, 1, 34, 10, 'No', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(580, 1, 34, 11, 'N/A', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(581, 1, 34, 12, '*', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(582, 1, 34, 13, '*', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(583, 1, 34, 15, '*', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(584, 1, 34, 16, '*', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(585, 1, 34, 17, '*', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(586, 1, 34, 18, 'Others|N/A', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(587, 1, 34, 19, 'Some job requirements did not match my qualifications and skills.', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(588, 1, 34, 20, 'Conduct seminars on communication skills, leadership, teamwork, and workplace professionalism.', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(589, 1, 34, 21, 'No', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(590, 1, 34, 22, '*', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(591, 1, 34, 23, 'Others|N/A', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(592, 1, 34, 24, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(593, 1, 34, 25, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(594, 1, 34, 26, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(595, 1, 34, 27, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(596, 1, 34, 28, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(597, 1, 34, 29, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(598, 1, 34, 30, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(599, 1, 34, 31, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(600, 1, 34, 32, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(601, 1, 34, 33, '4 - Very Much', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(602, 1, 34, 34, '4 - Very Useful', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(603, 1, 34, 35, '4 - Very Useful', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(604, 1, 34, 36, '3 - Moderately Useful', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(605, 1, 34, 37, '3 - Moderately Useful', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(606, 1, 34, 38, '4 - Very Useful', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(607, 1, 34, 39, '3 - Moderately Useful', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(608, 1, 34, 40, '3 - Moderately Useful', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(609, 1, 34, 41, '3 - Moderately Useful', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(610, 1, 34, 42, '4 - Very Useful', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(611, 1, 34, 43, 'Working with different people helped me become more adaptable and professional.', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(612, 1, 34, 44, '4 - Agree', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(613, 1, 34, 45, '4 - Agree', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(614, 1, 34, 46, '4 - Agree', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(615, 1, 34, 47, '3 - Moderately Agree', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(616, 1, 34, 48, '3 - Moderately Agree', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(617, 1, 34, 49, '3 - Moderately Agree', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(618, 1, 34, 50, '4 - Agree', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(619, 1, 34, 51, '4 - Agree', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(620, 1, 34, 52, '4 - Agree', '2026-09-28 23:22:26', '2026-09-28 23:22:26', '2026-09-28 23:22:26'),
(621, 1, 35, 1, 'Benedict', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(622, 1, 35, 2, 'VIvar', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(623, 1, 35, 3, 'Ramos', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(624, 1, 35, 4, 'Malaya Dilasag, Aurora 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(625, 1, 35, 5, 'alumni34@gmail.com', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(626, 1, 35, 6, '09493564701', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(627, 1, 35, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(628, 1, 35, 8, '2024-2025', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(629, 1, 35, 9, 'Graduate Study', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(630, 1, 35, 10, 'No', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(631, 1, 35, 11, 'N/A', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(632, 1, 35, 12, '*', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(633, 1, 35, 13, '*', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(634, 1, 35, 15, '*', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(635, 1, 35, 16, '*', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(636, 1, 35, 17, '*', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(637, 1, 35, 18, 'Others|N/A', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(638, 1, 35, 19, 'I found it challenging to prepare for interviews and answer questions confidently.', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(639, 1, 35, 20, 'Update course subjects and activities to keep up with current industry trends and demands.', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(640, 1, 35, 21, 'No', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(641, 1, 35, 22, '*', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(642, 1, 35, 23, 'Others|N/A', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(643, 1, 35, 24, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(644, 1, 35, 25, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(645, 1, 35, 26, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(646, 1, 35, 27, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(647, 1, 35, 28, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(648, 1, 35, 29, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(649, 1, 35, 30, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(650, 1, 35, 31, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(651, 1, 35, 32, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(652, 1, 35, 33, '4 - Very Much', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(653, 1, 35, 34, '4 - Very Useful', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(654, 1, 35, 35, '4 - Very Useful', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(655, 1, 35, 36, '4 - Very Useful', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(656, 1, 35, 37, '3 - Moderately Useful', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(657, 1, 35, 38, '4 - Very Useful', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(658, 1, 35, 39, '3 - Moderately Useful', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(659, 1, 35, 40, '3 - Moderately Useful', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(660, 1, 35, 41, '2 - Slightly Useful', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(661, 1, 35, 42, '3 - Moderately Useful', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(662, 1, 35, 43, 'Handling multiple tasks improved my organization and prioritization skills.', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(663, 1, 35, 44, '4 - Agree', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(664, 1, 35, 45, '4 - Agree', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(665, 1, 35, 46, '4 - Agree', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(666, 1, 35, 47, '4 - Agree', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(667, 1, 35, 48, '4 - Agree', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(668, 1, 35, 49, '4 - Agree', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(669, 1, 35, 50, '4 - Agree', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(670, 1, 35, 51, '4 - Agree', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(671, 1, 35, 52, '4 - Agree', '2026-09-28 23:25:05', '2026-09-28 23:25:05', '2026-09-28 23:25:05'),
(672, 1, 36, 1, 'Ashlyn Mckayla', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(673, 1, 36, 2, 'Villa', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(674, 1, 36, 3, 'Santos', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(675, 1, 36, 4, 'Purok Repolyo, General Mamerto Natividad 2314, Nueva Ecija, Region III - Central Luzon, Philippines', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(676, 1, 36, 5, 'alumni35@gmail.com', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(677, 1, 36, 6, '09496920649', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(678, 1, 36, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(679, 1, 36, 8, '2024-2025', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(680, 1, 36, 9, 'Graduate Study', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(681, 1, 36, 10, 'No', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(682, 1, 36, 11, 'N/A', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(683, 1, 36, 12, '*', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(684, 1, 36, 13, '*', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(685, 1, 36, 15, '*', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(686, 1, 36, 16, '*', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(687, 1, 36, 17, '*', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(688, 1, 36, 18, 'Job Fair', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(689, 1, 36, 19, 'Transportation and distance made it difficult to attend some interviews.', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(690, 1, 36, 20, 'Encourage students to earn relevant certifications and develop specialized skills.', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(691, 1, 36, 21, 'No', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(692, 1, 36, 22, '*', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(693, 1, 36, 23, 'Others|N/A', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(694, 1, 36, 24, '4 - Very Much', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(695, 1, 36, 25, '4 - Very Much', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(696, 1, 36, 26, '4 - Very Much', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(697, 1, 36, 27, '4 - Very Much', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(698, 1, 36, 28, '3 - Moderate', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(699, 1, 36, 29, '3 - Moderate', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(700, 1, 36, 30, '3 - Moderate', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(701, 1, 36, 31, '3 - Moderate', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(702, 1, 36, 32, '4 - Very Much', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(703, 1, 36, 33, '4 - Very Much', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(704, 1, 36, 34, '4 - Very Useful', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(705, 1, 36, 35, '4 - Very Useful', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(706, 1, 36, 36, '4 - Very Useful', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(707, 1, 36, 37, '3 - Moderately Useful', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(708, 1, 36, 38, '4 - Very Useful', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(709, 1, 36, 39, '3 - Moderately Useful', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(710, 1, 36, 40, '3 - Moderately Useful', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(711, 1, 36, 41, '2 - Slightly Useful', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(712, 1, 36, 42, '3 - Moderately Useful', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(713, 1, 36, 43, 'Following workplace procedures taught me discipline and responsibility.', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(714, 1, 36, 44, '4 - Agree', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(715, 1, 36, 45, '4 - Agree', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(716, 1, 36, 46, '4 - Agree', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(717, 1, 36, 47, '4 - Agree', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(718, 1, 36, 48, '4 - Agree', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(719, 1, 36, 49, '4 - Agree', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(720, 1, 36, 50, '4 - Agree', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(721, 1, 36, 51, '4 - Agree', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(722, 1, 36, 52, '4 - Agree', '2026-09-28 23:27:46', '2026-09-28 23:27:46', '2026-09-28 23:27:46'),
(723, 1, 78, 1, 'Sean Aeron', '2026-09-29 08:24:29', '2026-09-29 08:24:29', '2026-09-29 08:24:29'),
(724, 1, 78, 2, 'Garcia', '2026-09-29 08:24:29', '2026-09-29 08:24:29', '2026-09-29 08:24:29'),
(725, 1, 78, 3, 'Chico', '2026-09-29 08:24:29', '2026-09-29 08:24:29', '2026-09-29 08:24:29'),
(726, 1, 78, 4, 'Mangino', '2026-09-29 08:24:29', '2026-09-29 08:24:29', '2026-09-29 08:24:29'),
(727, 1, 78, 5, 'alumni77@gmail.com', '2026-09-29 08:24:29', '2026-09-29 08:24:29', '2026-09-29 08:24:29'),
(728, 1, 78, 6, '09544839753', '2026-09-29 08:24:29', '2026-09-29 08:24:29', '2026-09-29 08:24:29'),
(729, 1, 78, 7, 'Bachelor of Science in Information Technology', '2026-09-29 08:24:29', '2026-09-29 08:24:29', '2026-09-29 08:24:29'),
(730, 1, 78, 8, '2024-2025', '2026-09-29 08:24:29', '2026-09-29 08:24:29', '2026-09-29 08:24:29'),
(731, 1, 78, 9, 'Graduate Study', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(732, 1, 78, 10, 'No', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(733, 1, 78, 11, 'N/A', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(734, 1, 78, 12, '*', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(735, 1, 78, 13, '*', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(736, 1, 78, 15, 'Apex Technology Group', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(737, 1, 78, 16, 'IT Support', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(738, 1, 78, 17, '2025-2026', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(739, 1, 78, 18, 'Recommended by someone', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(740, 1, 78, 19, '*', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(741, 1, 78, 20, '*', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(742, 1, 78, 21, 'No', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(743, 1, 78, 22, '*', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(744, 1, 78, 23, 'Others|*', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(745, 1, 78, 24, '2 - Slight', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(746, 1, 78, 25, '2 - Slight', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(747, 1, 78, 26, '1 - Very Little', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(748, 1, 78, 27, '3 - Moderate', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30');
INSERT INTO `responses` (`id`, `survey_id`, `user_id`, `question_id`, `answer_value`, `submitted_at`, `created_at`, `updated_at`) VALUES
(749, 1, 78, 28, '3 - Moderate', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(750, 1, 78, 29, '2 - Slight', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(751, 1, 78, 30, '2 - Slight', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(752, 1, 78, 31, '3 - Moderate', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(753, 1, 78, 32, '2 - Slight', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(754, 1, 78, 33, '3 - Moderate', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(755, 1, 78, 34, '2 - Slightly Useful', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(756, 1, 78, 35, '3 - Moderately Useful', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(757, 1, 78, 36, '3 - Moderately Useful', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(758, 1, 78, 37, '3 - Moderately Useful', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(759, 1, 78, 38, '2 - Slightly Useful', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(760, 1, 78, 39, '2 - Slightly Useful', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(761, 1, 78, 40, '3 - Moderately Useful', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(762, 1, 78, 41, '3 - Moderately Useful', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(763, 1, 78, 42, '3 - Moderately Useful', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(764, 1, 78, 43, '*', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(765, 1, 78, 44, '4 - Agree', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(766, 1, 78, 45, '2 - Slightly Agree', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(767, 1, 78, 46, '3 - Moderately Agree', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(768, 1, 78, 47, '3 - Moderately Agree', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(769, 1, 78, 48, '4 - Agree', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(770, 1, 78, 49, '2 - Slightly Agree', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(771, 1, 78, 50, '2 - Slightly Agree', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(772, 1, 78, 51, '3 - Moderately Agree', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(773, 1, 78, 52, '2 - Slightly Agree', '2026-09-29 08:24:30', '2026-09-29 08:24:30', '2026-09-29 08:24:30'),
(774, 1, 1, 1, 'Gaile', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(775, 1, 1, 2, 'Parial', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(776, 1, 1, 3, 'Guanio', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(777, 1, 1, 4, '848 H Malgapo Street San Vicente Gapan City Nueva Ecija', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(778, 1, 1, 5, 'gg@gmail.com', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(779, 1, 1, 6, '09335554444', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(780, 1, 1, 7, 'Bachelor of Science in Computer  Engineering', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(781, 1, 1, 8, '2021-2022', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(782, 1, 1, 9, 'Attending seminars/trainings', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(783, 1, 1, 10, 'No', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(784, 1, 1, 11, 'N/A', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(785, 1, 1, 12, '*', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(786, 1, 1, 13, '*', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(787, 1, 1, 15, '*', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(788, 1, 1, 16, '*', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(789, 1, 1, 17, '*', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(790, 1, 1, 18, 'Others|N/A', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(791, 1, 1, 19, '*', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(792, 1, 1, 20, 'none', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(793, 1, 1, 21, 'No', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(794, 1, 1, 22, '*', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(795, 1, 1, 23, 'Others|N/A', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(796, 1, 1, 24, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(797, 1, 1, 25, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(798, 1, 1, 26, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(799, 1, 1, 27, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(800, 1, 1, 28, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(801, 1, 1, 29, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(802, 1, 1, 30, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(803, 1, 1, 31, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(804, 1, 1, 32, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(805, 1, 1, 33, '4 - Very Much', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(806, 1, 1, 34, '4 - Very Useful', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(807, 1, 1, 35, '4 - Very Useful', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(808, 1, 1, 36, '4 - Very Useful', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(809, 1, 1, 37, '4 - Very Useful', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(810, 1, 1, 38, '4 - Very Useful', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(811, 1, 1, 39, '4 - Very Useful', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(812, 1, 1, 40, '4 - Very Useful', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(813, 1, 1, 41, '4 - Very Useful', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(814, 1, 1, 42, '4 - Very Useful', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(815, 1, 1, 43, 'none', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(816, 1, 1, 44, '4 - Agree', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(817, 1, 1, 45, '4 - Agree', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(818, 1, 1, 46, '4 - Agree', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(819, 1, 1, 47, '4 - Agree', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(820, 1, 1, 48, '4 - Agree', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(821, 1, 1, 49, '4 - Agree', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(822, 1, 1, 50, '4 - Agree', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(823, 1, 1, 51, '4 - Agree', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03'),
(824, 1, 1, 52, '4 - Agree', '2026-09-29 09:43:03', '2026-09-29 09:43:03', '2026-09-29 09:43:03');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `survey_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `likert_scale` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `survey_id`, `title`, `description`, `likert_scale`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'Personal Information', 'Please select the option that applies to you or supply the needed information as completely as possible.', NULL, 1, '2026-09-28 17:30:42', '2026-09-28 17:30:42'),
(2, 1, 'Employment Status', 'Please select the option that applies to you or supply the needed information as completely as possible.', NULL, 2, '2026-09-28 17:32:53', '2026-09-28 17:32:53'),
(3, 1, 'Employment History', 'Please select the option that applies to you or supply the needed information as completely as possible.', NULL, 3, '2026-09-28 17:34:49', '2026-09-28 17:34:49'),
(4, 1, 'Skills Development', 'Please rate the extent at which the following skills were developed in you as a result of your education at WUP. Select the rating that corresponds to your answer.', '[\"1 - Very Little\",\"2 - Slight\",\"3 - Moderate\",\"4 - Very Much\"]', 4, '2026-09-28 17:37:00', '2026-09-28 17:37:00'),
(5, 1, 'Curriculum Components', 'Please rate the usefulness of the following components of curriculum to your work.  Select the rating that corresponds to your answer.', '[\"1 - Not Useful\",\"2 - Slightly Useful\",\"3 - Moderately Useful\",\"4 - Very Useful\"]', 5, '2026-09-28 17:38:28', '2026-09-28 17:38:28'),
(6, 1, 'WUP Attributes', 'Wesleyan University-Philippines stands for scholarship, service, and character. Please rate the attributes listed below that were visible to every Wesleyan graduates. Select what corresponds to your answer.', '[\"1 - Disagree\",\"2 - Slightly Agree\",\"3 - Moderately Agree\",\"4 - Agree\"]', 6, '2026-09-28 17:40:17', '2026-09-28 17:40:17');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('7JT15tDFCnGry4WvtwMLUA4pP6oNuQb3rPPUKpMX', 1, '49.151.164.81', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoidVRZTThGek5aOVN5YWJKZ1p6Q0xZQ0FVblZBRkY4U0FoZldSVm5kaiI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo1NDoiaHR0cHM6Ly9hbHVtbmljb25uZWN0LXd1cC53dWF6ZS5jb20vYWx1bW5hL2Fzc29jaWF0aW9uIjt9czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDc6Imh0dHBzOi8vYWx1bW5pY29ubmVjdC13dXAud3VhemUuY29tL2FsdW1uYS9ob21lIjtzOjU6InJvdXRlIjtzOjExOiJhbHVtbmEuaG9tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1790949687),
('bkfJsVmNLfXHjHFyERXqNGcZ7FfJIUQ06c6VJNMO', NULL, '203.177.59.203', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOXNkcEpURWpYU1JGMzY2NVFaWGFoVEROVEhzRW5PbzNUUTVKNnNHSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTI6Imh0dHBzOi8vYWx1bW5pY29ubmVjdC13dXAud3VhemUuY29tL2FsdW1uYS9sb2dpbj9pPTIiO3M6NToicm91dGUiO3M6MTI6ImFsdW1uYS5sb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1790948037),
('uBwAhgk4iE9m2nRg3xiOBDMmJnVKAw3DJDn5w3qV', 27, '136.158.124.151', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiU0o5UDI5RVVuZWtJVm9wbnJzeUJSMkZTWk85bkdNTjhFamxaWDZoUSI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czo1NjoiaHR0cHM6Ly9hbHVtbmljb25uZWN0LXd1cC53dWF6ZS5jb20vYWx1bW5hL3N1cnZleXMvMT9pPTEiO31zOjk6Il9wcmV2aW91cyI7YToyOntzOjM6InVybCI7czo0NzoiaHR0cHM6Ly9hbHVtbmljb25uZWN0LXd1cC53dWF6ZS5jb20vYWx1bW5hL2hvbWUiO3M6NToicm91dGUiO3M6MTE6ImFsdW1uYS5ob21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mjc7fQ==', 1790949422),
('w15ExDMna4YoDHkVS83Hycfx8RZvAkJAdIst84bT', 2, '112.207.175.241', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoialRCV2o2a3gwZU5jY1lqQlJwSG9FSTJtYjdFWHJvWDlieVl0bjljbSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDc6Imh0dHBzOi8vYWx1bW5pY29ubmVjdC13dXAud3VhemUuY29tL2FsdW1uYS9ob21lIjtzOjU6InJvdXRlIjtzOjExOiJhbHVtbmEuaG9tZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjI7fQ==', 1790949732),
('zIzpcKB83HQNlrUL5UbGoBDPAdaAcZlAP5uaeDE0', 1, '49.151.164.81', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiYXNobDNlOEQ0ZEFTbU5UeXIzUlJGQ2VCVEYzM2lWUU4yM3ZVM1pFViI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHBzOi8vYWx1bW5pY29ubmVjdC13dXAud3VhemUuY29tL2FsdW1uYS9wcm9maWxlP2k9MSI7czo1OiJyb3V0ZSI7czoxNDoiYWx1bW5hLnByb2ZpbGUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=', 1790934042);

-- --------------------------------------------------------

--
-- Table structure for table `subheadings`
--

CREATE TABLE `subheadings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_id` bigint(20) UNSIGNED NOT NULL,
  `subheading_identifier` varchar(255) NOT NULL,
  `label` text NOT NULL,
  `display_order` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subheadings`
--

INSERT INTO `subheadings` (`id`, `section_id`, `subheading_identifier`, `label`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 2, 'if-you-answered-no-to-the-previous-question-please-enter-for-the-following-questions-if-they-do-not-apply-to-you', 'If you answered \"No\" to the previous question, please enter \"*\" for the following questions if they do not apply to you.', 3, '2026-09-28 17:33:45', '2026-09-28 17:33:45'),
(2, 3, 'if-you-have-previous-work-experience-please-answer-the-following-questions-enter-if-the-question-does-not-apply-to-you', 'If you have previous work experience, please answer the following questions. (Enter \"*\" if the question does not apply to you.)', 1, '2026-09-28 17:34:57', '2026-09-28 17:34:57'),
(3, 5, 'academic-programs', 'Academic Programs', 1, '2026-09-28 17:38:32', '2026-09-28 17:39:46'),
(4, 5, 'academic-works', 'Academic Works', 5, '2026-09-28 17:38:55', '2026-09-28 17:38:55'),
(5, 5, 'extra-curricular', 'Extra-curricular', 9, '2026-09-28 17:39:18', '2026-09-28 17:39:18'),
(6, 6, 'character', 'Character', 1, '2026-09-28 17:40:23', '2026-09-28 17:40:23'),
(7, 6, 'service', 'Service', 5, '2026-09-28 17:40:42', '2026-09-28 17:40:42'),
(8, 6, 'scholarship', 'Scholarship', 9, '2026-09-28 17:41:04', '2026-09-28 17:41:04');

-- --------------------------------------------------------

--
-- Table structure for table `surveys`
--

CREATE TABLE `surveys` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'inactive',
  `is_tracer_study` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `surveys`
--

INSERT INTO `surveys` (`id`, `title`, `description`, `status`, `is_tracer_study`, `created_by`, `created_at`, `updated_at`, `deleted_at`, `archived_at`) VALUES
(1, 'WUP Graduate Tracer Study', 'The official tracer study survey for graduates of Wesleyan University-Philippines. This survey gathers information on graduates\' employment, career progression, and educational experiences to support alumni tracking, reporting, and program enhancement.', 'active', 1, 108, '2026-09-28 17:30:21', '2026-09-28 17:42:13', NULL, NULL),
(2, 'test', 'test', 'inactive', 0, 107, '2026-09-29 09:38:31', '2026-09-29 09:38:31', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `survey_drafts`
--

CREATE TABLE `survey_drafts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `survey_id` bigint(20) UNSIGNED NOT NULL,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `suffix` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `password_changed` tinyint(1) NOT NULL DEFAULT 0,
  `user_role` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `start_year` smallint(6) DEFAULT NULL,
  `end_year` smallint(6) DEFAULT NULL,
  `semester` varchar(255) DEFAULT NULL,
  `courses` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `notifications_seen_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `last_name`, `first_name`, `middle_name`, `suffix`, `address`, `contact_number`, `email`, `email_verified_at`, `password`, `password_changed`, `user_role`, `status`, `start_year`, `end_year`, `semester`, `courses`, `department`, `profile_picture`, `remember_token`, `notifications_seen_at`, `created_at`, `updated_at`) VALUES
(1, 'Guanio', 'Crystal Gaile', 'Parial', 'N/A', 'Brgy. San Vicente (Pob.), City of Gapan 3105, Nueva Ecija, Central Luzon, Philippines', '+639123456789', 'gg@gmail.com', '2026-09-21 19:08:56', '$2y$12$Sn3gZwicgUfTXnbaPILP2.yVaZHNbgjaJN/s4rSZUnRnr/VGJJjAG', 1, 'alumna', 'active', 2017, 2018, '2nd Semester', 'BSIT', 'CECT', NULL, NULL, '2026-10-02 15:21:01', '2026-09-21 19:08:56', '2026-10-02 16:37:24'),
(2, 'Dela Cruz', 'Joyce', 'Abesamis', 'N/A', 'Purok II, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639974013361', 'alumni1@gmail.com', '2026-09-21 19:08:57', '$2y$12$XSUADcf.T/ymG5TG4Kl2F.Q3UZCifltZeu0EMahK14csZRuX9EO5G', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, '2026-09-29 14:02:29', '2026-09-21 19:08:57', '2026-09-29 14:02:29'),
(3, 'Adatan', 'Icelle', 'Resuello', 'N/A', 'Purok 6, Cuyapo 3117, Nueva Ecija, Region III - Central Luzon, Philippines', '+639064526915', 'alumni2@gmail.com', '2026-09-21 19:08:57', '$2y$12$8tp4xrZxjrghp80xXdudveXMnFPa4iPFYkuFxpLL2fQtN1IP.wy5C', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:08:57', '2026-09-21 19:08:57'),
(4, 'Badua', 'Dexter', 'Dela Peña', 'N/A', 'Purok 4, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639659031535', 'alumni3@gmail.com', '2026-09-21 19:08:57', '$2y$12$88urj8I/TSC3t0GvNL2y8.sBwm0UtNf6r8Mz883474winbnI2GYV2', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:08:57', '2026-09-21 19:08:57'),
(5, 'Bautista', 'Renz Lee', 'Gaffud', 'N/A', 'Zaragoza 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639496894172', 'alumni4@gmail.com', '2026-09-21 19:08:57', '$2y$12$WIrSr.WguGwJ4cF0FDI2YeaKcZZZEMKNemiJv1tsahUn5S67wjrLC', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:08:57', '2026-09-21 19:08:57'),
(6, 'Binuya', 'Onin John Paul', 'Padilla', 'N/A', 'Rizal St., Santa Rosa 3101, Nueva Ecija, Region III - Central Luzon, Philippines', '+639958958556', 'alumni5@gmail.com', '2026-09-21 19:08:58', '$2y$12$NxI6Cr6H7Fo0bvxMQEFLteVfySOb24rAJwlMz6p7/N0Jx/89Y1Y.a', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:08:58', '2026-09-21 19:08:58'),
(7, 'Castro', 'Rhoderick Aldrine', 'Tiongson', 'N/A', 'Purok Santan 1, Talavera 3114, Nueva Ecija, Region III - Central Luzon, Philippines', '+639166100257', 'alumni6@gmail.com', '2026-09-21 19:08:58', '$2y$12$F3VGJgYWg9QHerp7fr1is.C8SFnobSB77p0/GJFQeDYlEvNfQ9K6W', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:08:58', '2026-09-21 19:08:58'),
(8, 'Corbillon', 'Zoren', 'Agtual', 'N/A', 'Rizal 3127, Nueva Ecija, Region III - Central Luzon, Philippines', '+639153892873', 'alumni7@gmail.com', '2026-09-21 19:08:58', '$2y$12$eBPYRSR/xRDqI38lP.8iu.7nct48Of172DmV9KtZUiifVodMKjAq2', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:08:58', '2026-09-21 19:08:58'),
(9, 'Dayag', 'Semmyael', 'Borreta', 'N/A', 'Zone 7, Talugtug 3118, Nueva Ecija, Region III - Central Luzon, Philippines', '+639198313963', 'alumni8@gmail.com', '2026-09-21 19:08:58', '$2y$12$mFpt3bPQeLDszBfIr2h/cuFLM32LdsWOTMN78UCsHWxbLRUblOL/.', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:08:58', '2026-09-21 19:08:58'),
(10, 'De Belen', 'Marc Gabrielle', 'Domingo', 'N/A', 'A. De Belen St., Jaen 3109, Nueva Ecija, Region III - Central Luzon, Philippines', '+639398139732', 'alumni9@gmail.com', '2026-09-21 19:08:59', '$2y$12$UgU9fTPYeeI1DtVJ8m0.x.JweLxaCDsAdnEc2jnxBs9qp.0cIsXTO', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:08:59', '2026-09-21 19:08:59'),
(11, 'De Guzman', 'Christian Geordel', 'Abes', 'N/A', 'Gulod 2, General Tinio 3104, Nueva Ecija, Region III - Central Luzon, Philippines', '+639685338034', 'alumni10@gmail.com', '2026-09-21 19:08:59', '$2y$12$z466sI6iN9JnMEK1tKS1Y.DtzUPGuA0M82qf.wkwDZnjs7o4sU1S2', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:08:59', '2026-09-21 19:08:59'),
(12, 'Estimada', 'Rhien Kaira', 'Ferrer', 'N/A', 'Narra 1, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639066304025', 'alumni11@gmail.com', '2026-09-21 19:09:00', '$2y$12$32dBqYAtKK3kzvW1Xb5KRObyEawPGgeYeyEhmR7KdESAgXNpSsu3S', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:00', '2026-09-21 19:09:00'),
(13, 'Flores', 'Jethro Louis', 'Borillo', 'N/A', 'Burgos, Sto. Domingo 3133, Nueva Ecija, Region III - Central Luzon, Philippines', '+639918854274', 'alumni12@gmail.com', '2026-09-21 19:09:00', '$2y$12$F97ZllOD11a1dFK14DRUG.ExxxJSvwvViZj9J4Z1j/BRqd7DxjAgW', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:00', '2026-09-21 19:09:00'),
(14, 'Gigante', 'Airwindsky', 'Maniquiz', 'N/A', 'Lacuna St., Jaen 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '+639451052611', 'alumni13@gmail.com', '2026-09-21 19:09:00', '$2y$12$jWn7EyK0Et0GjMmiLXpT2OZUdckK.CzbM0.xNmjmpnU2pOBP.73c.', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:00', '2026-09-21 19:09:00'),
(15, 'Guevarra', 'Lance Aeron', 'Feliciano', 'N/A', 'Purok 1, San Antonio 3109, Nueva Ecija, Region III - Central Luzon, Philippines', '970103051', 'alumni14@gmail.com', '2026-09-21 19:09:01', '$2y$12$S3JHXUTr3J/oNHYlchsgUuie35Z4FncWzMDfxQGAnUZ7TmD6RjN56', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:01', '2026-09-21 19:09:01'),
(16, 'Hernandez', 'Justin', 'Martinez', 'N/A', 'Purok 2, Gapan City 3108, Nueva Ecija, Region III - Central Luzon, Philippines', '+639496896707', 'alumni15@gmail.com', '2026-09-21 19:09:01', '$2y$12$bpIfkl0jwjxuD4IxvFJdT.lzRzO7Iyi0OZpdsofw/nD6NivRjf./q', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:01', '2026-09-21 19:09:01'),
(17, 'Jesuitas', 'Enry Jasper', 'Pascual', 'N/A', 'Dr. Ramos St., Bongabon 3128, Nueva Ecija, Region III - Central Luzon, Philippines', '+639158771612', 'alumni16@gmail.com', '2026-09-21 19:09:01', '$2y$12$02SNi6ZpT6Ich7vZFabKb.lNih6XPD7R/DN6YuOw..ObE2XE1TFhq', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:01', '2026-09-21 19:09:01'),
(18, 'Jornadal', 'Kristine Joy', 'Antonio', 'N/A', 'Purok 7a., Carranglan 3123, Nueva Ecija, Region III - Central Luzon, Philippines', '+639678478323', 'alumni17@gmail.com', '2026-09-21 19:09:01', '$2y$12$GtSyJ9x6jtkDy84ji0XRgOlBeAk7nj9M3XNmxjzLKt0MoyPrwDDQy', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:01', '2026-09-21 19:09:01'),
(19, 'Lacabe', 'Giovanni Jr', 'Bartolome', 'N/A', 'San Antonio 3102, Nueva Ecija, Region III - Central Luzon, Philippines', '+639959704870', 'alumni18@gmail.com', '2026-09-21 19:09:02', '$2y$12$C03kjAOuCB5PQWw4sxBA.e.BpGzdsI.TWAO.EgbPs0VKbwdFc5xtu', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:02', '2026-09-21 19:09:02'),
(20, 'Lisondra', 'Haydee', 'Villamael', 'N/A', '95 Real St., Santa Rosa 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639687134767', 'alumni19@gmail.com', '2026-09-21 19:09:02', '$2y$12$xeXDS4AUVSJ8B1gYYDdGq.RXj04/nKAP./.ccd09SRro8RDT7hsuG', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:02', '2026-09-21 19:09:02'),
(21, 'Lopez', 'Wendell', 'Lacsina', 'N/A', 'Purok 1, San Leonardo 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639158771612', 'alumni20@gmail.com', '2026-09-21 19:09:02', '$2y$12$jbyTonfSzG49S.MtcYCxO.ZgZQwCemriKuw4e/XGgDBb6MNY.BL/C', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:02', '2026-09-21 19:09:02'),
(22, 'Lungos', 'David Exoucia', 'Farro', 'N/A', 'Blk 3 Lot 5, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639762500501', 'alumni21@gmail.com', '2026-09-21 19:09:03', '$2y$12$0IMGIBf0tHLNjrY/A8LAlu0XrBfT.fQIRtp08pl9U9FsVR/mvQIha', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:03', '2026-09-21 19:09:03'),
(23, 'Manio', 'Vincent Rafael', 'Mateo', 'N/A', 'Purok 4, Zaragoza 3122, Nueva Ecija, Region III - Central Luzon, Philippines', '+639260775546', 'alumni22@gmail.com', '2026-09-21 19:09:03', '$2y$12$JMcwYbtoixI5aWhPOpLDT.SS2i0kGdrNEXV60Q5gOSdPQWpudBCfq', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:03', '2026-09-21 19:09:03'),
(24, 'Mariano', 'Niña Faye', 'Delos Santos', 'N/A', '15 Purok, Zaragoza 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639555235013', 'alumni23@gmail.com', '2026-09-21 19:09:03', '$2y$12$TKiwr4Ylp7GDDqnpsqXwqeNPOBlZ5WSrwxHt4J7aBBoUoXJT5ed66', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:03', '2026-09-21 19:09:03'),
(25, 'Marquez', 'James Lyod', 'Grospe', 'N/A', 'Lupao 3108, Nueva Ecija, Region III - Central Luzon, Philippines', '+639753953949', 'alumni24@gmail.com', '2026-09-21 19:09:03', '$2y$12$orlOMpGLvf4o6cSCsJ3/GOuoL7Osx6VdmDPA5ib9Ii3jyQSfFQkHi', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:03', '2026-09-21 19:09:03'),
(26, 'Melgar', 'Marc', 'Reyes', 'N/A', '256, Cabanatuan City 3110, Nueva Ecija, Region III - Central Luzon, Philippines', '+639382502648', 'alumni25@gmail.com', '2026-09-21 19:09:04', '$2y$12$gb4sm.I9qxMGYY70xXEMxuj4i02GR.pABSJ5fwS5qQn6y62yQcvDG', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:04', '2026-09-21 19:09:04'),
(27, 'Memita', 'Jan Nathaniel', 'Anlueco', 'N/A', 'Pitong Gatang Street, San Antonio 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639351081582', 'alumni26@gmail.com', '2026-09-21 19:09:04', '$2y$12$kXhq7.4cQWcRoMLp6JzeDOFrpow71TfAMksblOBHBkVjr.LBr2DIC', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:04', '2026-09-21 19:09:04'),
(28, 'Oanes', 'Gerald Fran', 'Gonzales', 'N/A', 'Purok 5, Zaragoza 3133, Nueva Ecija, Region III - Central Luzon, Philippines', '+639369255894', 'alumni27@gmail.com', '2026-09-21 19:09:04', '$2y$12$XdNX4FVpow7Ztoke9FPXyOeHd6NgX9d3BqCWj.wWIrvNFjcdp0Pei', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:04', '2026-09-21 19:09:04'),
(29, 'Odulio', 'John Arvin', 'Leynes', 'N/A', 'Block 1, Gapan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639612938582', 'alumni28@gmail.com', '2026-09-21 19:09:04', '$2y$12$/ZxNP243/y5PWsJKkPmaFuQUCGrh4k8Vwv27ZvuTZqnz2kp0AUp1K', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:04', '2026-09-21 19:09:04'),
(30, 'Padunan', 'Byron', 'Ibarra', 'N/A', 'Camino Drive, Sto.domingo 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639928990885', 'alumni29@gmail.com', '2026-09-21 19:09:05', '$2y$12$NbASMg9nxmCzz2nGa0k9E.46y/u3fQn3sPitrqLtbaU.v8pSHwUua', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSCpE', 'CECT', NULL, NULL, '2026-09-28 23:08:57', '2026-09-21 19:09:05', '2026-09-28 23:08:57'),
(31, 'Pascual', 'Jeano', 'Baguisa', 'N/A', '875 Purok 4, Cabanatuan City 3110, Nueva Ecija, Region III - Central Luzon, Philippines', '+639082615504', 'alumni30@gmail.com', '2026-09-21 19:09:05', '$2y$12$tRYeHPzrQitHNYzCs3hHXOSVdwEJkCHyrDPKPSvqU.a6ut4tfF0ZK', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:05', '2026-09-21 19:09:05'),
(32, 'Peralta', 'Jaminli', 'Magsilang', 'N/A', 'Blk 43 Lot 16 Devonshire Street, Grand Victoria Subdivision, Cabanatuan City 3106, Nueva Ecija, Region III - Central Luzon, Philippines', '+639102071300', 'alumni31@gmail.com', '2026-09-21 19:09:05', '$2y$12$7hwMFlm56fYyy7QEBQzhXe7dd6bu2ioWSuMO.lUyqtGAmANt4BsDO', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:05', '2026-09-21 19:09:05'),
(33, 'Perez', 'Tricia', 'Valdez', 'N/A', 'Purok 6, Zaragoza 3205, Nueva Ecija, Region III - Central Luzon, Philippines', '+639611388031', 'alumni32@gmail.com', '2026-09-21 19:09:05', '$2y$12$yzOPC3PeFE5SJL5klQXRt.I1ocU/kKvXuqAuTjIbfDD5Z0tOJe.kK', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:05', '2026-09-21 19:09:05'),
(34, 'Pili', 'Edrick Vincent', '*', 'N/A', 'San Isidro 3125, Nueva Ecija, Region III - Central Luzon, Philippines', '+639266519843', 'alumni33@gmail.com', '2026-09-21 19:09:06', '$2y$12$5ylaxqCOCQBKEbuAAN7vFe5WtKjSfW3N1TT2FWoC6gp/ezAU94lLe', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:06', '2026-09-21 19:09:06'),
(35, 'Ramos', 'Benedict', 'Vivar', 'N/A', 'Malaya Dilasag, Aurora 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639493564701', 'alumni34@gmail.com', '2026-09-21 19:09:06', '$2y$12$dzkEHOeN/TrN/iqh2uke4.BZERxF8b.HI4a.DCCzSxGc1E9ua5CXW', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:06', '2026-09-21 19:09:06'),
(36, 'Santos', 'Ashlyn Mckayla', 'Villa', 'N/A', 'Purok Repolyo, General Mamerto Natividad 2314, Nueva Ecija, Region III - Central Luzon, Philippines', '+639496920649', 'alumni35@gmail.com', '2026-09-21 19:09:06', '$2y$12$sIJ0dNCasWRFTHQuevoJcOcMfUxLONW5FjzAJN.o/qBaVKhiyWKQq', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:06', '2026-09-21 19:09:06'),
(37, 'Sawit', 'Mc. Kenneth', 'Nabua', 'N/A', '50 Purok 1, Gapan City 3119, Nueva Ecija, Region III - Central Luzon, Philippines', '+639267091054', 'alumni36@gmail.com', '2026-09-21 19:09:07', '$2y$12$wGoQLtegce6CLzUOSbG4suyXdyVsC3jalkzcrNsaOBxeko5ZCON3a', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:07', '2026-09-21 19:09:07'),
(38, 'Tangca', 'Marjorie', 'Pajarillo', 'N/A', '286, Tarlac 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639703046139', 'alumni37@gmail.com', '2026-09-21 19:09:07', '$2y$12$oglTY8RzEdwNGk6JnfKgYuGfP02pT9fgVun8ckgpJJ9Nw9HZiRuYa', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:07', '2026-09-21 19:09:07'),
(39, 'Vendivel', 'Charisma', 'Beltran', 'N/A', '69 Don Manuel, Cabanatuan City 3104, Nueva Ecija, Region III - Central Luzon, Philippines', '+639985397107', 'alumni38@gmail.com', '2026-09-21 19:09:07', '$2y$12$i8azDggSVljIbgwpL4ewDOuYVLhfUgvBJxfVQEJbLe6aGZSYdUoti', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:07', '2026-09-21 19:09:07'),
(40, 'Yadao', 'John Patrick', 'Roxas', 'N/A', 'Purok Santan 1B, General Tinio 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '+639959814682', 'alumni39@gmail.com', '2026-09-21 19:09:07', '$2y$12$zgJf0lvTnV057UwvFHmbvepedW5XC6choWF/VFUL9tA.F3AHfCnz6', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSCpE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:07', '2026-09-21 19:09:07'),
(41, 'Bago', 'Darilmy', 'Valdez', 'N/A', 'Science City Of Muñoz 3119, Nueva Ecija, Region III - Central Luzon, Philippines', '+639983633937', 'alumni40@gmail.com', '2026-09-21 19:09:08', '$2y$12$tuqoIa.ptQA6pFLu.EBq2Op2Tsh5aqDMMOcpFem84JxedmXEoHNPC', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:08', '2026-09-21 19:09:08'),
(42, 'Basa', 'John Darnell', 'Hernandez', 'N/A', '69 Don Manuel, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639959703656', 'alumni41@gmail.com', '2026-09-21 19:09:08', '$2y$12$VqIMr2YbA5WjkX/yQX9uceDA3IXqZyiKWqvUQiUdUiDyPiWHiw0gO', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:08', '2026-09-21 19:09:08'),
(43, 'Batangan', 'Theodore', 'Martin', 'N/A', 'Purok Santan B, General Tinio 3104, Nueva Ecija, Region III - Central Luzon, Philippines', '+639496853777', 'alumni42@gmail.com', '2026-09-21 19:09:08', '$2y$12$TCtAJ3AuCOPy5IOMdp.mdeNda7OwxcmoFLKNX3whOhSwtL4cnXWT6', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:08', '2026-09-21 19:09:08'),
(44, 'Canceran', 'Julian Paulo', 'Cabanilla', 'N/A', 'Purok 6, Peñaranda 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '+639393575730', 'alumni43@gmail.com', '2026-09-21 19:09:08', '$2y$12$rSPgh/2HVMIbug96VsSQH.ID75HcLk/j8MrYulWOb8cdmQoOFWlx.', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:08', '2026-09-21 19:09:08'),
(45, 'Contridas', 'Charles Daryll', 'Germino', 'N/A', 'Rizal Street, Santa Rosa 3101, Nueva Ecija, Region III - Central Luzon, Philippines', '+639054416234', 'alumni44@gmail.com', '2026-09-21 19:09:09', '$2y$12$8lUqzmob8kJM9L/4Sjo3IOZsrFXdHTnS.Y/SfqCCRfQWyu2upm6pe', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:09', '2026-09-21 19:09:09'),
(46, 'Dela Cruz', 'Christian Andrei', '*', 'N/A', 'Purok 1, San Leonardo 3102, Nueva Ecija, Region III - Central Luzon, Philippines', '+639499849626', 'alumni45@gmail.com', '2026-09-21 19:09:09', '$2y$12$o9Gd8QXgjxMXcaUgdcQ6S.gfSFeDHJAvOPZ1eVrm7yr26MVFBGaJm', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:09', '2026-09-21 19:09:09'),
(47, 'Germino', 'Rafael Iii', 'Retomalta', 'N/A', 'Germino St, San Leonardo 3102, Nueva Ecija, Region III - Central Luzon, Philippines', '+639495625576', 'alumni46@gmail.com', '2026-09-21 19:09:09', '$2y$12$odyVSvlHndduiAOW.0CRt./WoCHe4gv0dcykz5Xrl/4ptd7A6KETO', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:09', '2026-09-21 19:09:09'),
(48, 'Herrera', 'Benedict', 'Estrella', 'N/A', 'Nieves, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639515791952', 'alumni47@gmail.com', '2026-09-21 19:09:09', '$2y$12$Y/d2pDjdPDc9HtycrCWehOPUC6vh69CkonZ.0QZBUaUMrGGqlNXmS', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:09', '2026-09-21 19:09:09'),
(49, 'Longalong', 'Jay', 'Rayago', 'N/A', 'Purok 2, Rizal 3127, Nueva Ecija, Region III - Central Luzon, Philippines', '+639511511736', 'alumni48@gmail.com', '2026-09-21 19:09:10', '$2y$12$xJwQBbFGtgaq1sxIo0TpYubXcnppV0dvYdDAW.lKgIqwTydUy1nq.', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:10', '2026-09-21 19:09:10'),
(50, 'Macaburas', 'Kristian Cedric', 'Parungao', 'N/A', 'Purok 1, San Antonio 3108, Nueva Ecija, Region III - Central Luzon, Philippines', '+639611905476', 'alumni49@gmail.com', '2026-09-21 19:09:10', '$2y$12$ouAXuSj0Qq.VS3EvOiDSUOSz8aQ3lQ8wrL5XK3ZOAX8LSjCSavkDS', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:10', '2026-09-21 19:09:10');
INSERT INTO `users` (`id`, `last_name`, `first_name`, `middle_name`, `suffix`, `address`, `contact_number`, `email`, `email_verified_at`, `password`, `password_changed`, `user_role`, `status`, `start_year`, `end_year`, `semester`, `courses`, `department`, `profile_picture`, `remember_token`, `notifications_seen_at`, `created_at`, `updated_at`) VALUES
(51, 'Macaslam', 'Arvin Kelly', 'Riguer', 'N/A', 'Purok 3, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639703656603', 'alumni50@gmail.com', '2026-09-21 19:09:10', '$2y$12$5ZKxoqBjbCKQ5iz/LkkV9unuXBrEnfhSZQ3UfKOoCKOZ1sDezLpJa', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:10', '2026-09-21 19:09:10'),
(52, 'Mallare', 'Clarence', 'Abad', 'N/A', 'Purok 6, San Antonio 3108, Nueva Ecija, Region III - Central Luzon, Philippines', '+639771257852', 'alumni51@gmail.com', '2026-09-21 19:09:10', '$2y$12$uzE03BUMxenpwjCIorNotuzLkAHSBV0ycHhKRS3tq1/nvKIJtvNiW', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSEcE', 'CECT', NULL, NULL, '2026-09-28 22:57:58', '2026-09-21 19:09:10', '2026-09-28 22:57:58'),
(53, 'Oloroso', 'Christian Jay', 'Flores', 'N/A', 'Viesca, San Leonardo 3102, Nueva Ecija, Region III - Central Luzon, Philippines', '+639662088217', 'alumni52@gmail.com', '2026-09-21 19:09:11', '$2y$12$IrYXFcrlgm6nvTFMkM1pQuNFzWG95RD6ifdGjKwnJydvMDgJmUuXG', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:11', '2026-09-21 19:09:11'),
(54, 'Pili', 'Rhoalene', 'Viesca', 'N/A', 'Purok 6, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639368815281', 'alumni53@gmail.com', '2026-09-21 19:09:11', '$2y$12$3kIDKs3ZQ/SGDrqtME7/X.8TPecmQZ9epo.AU/6yAhNNJz1DXuGx2', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:11', '2026-09-21 19:09:11'),
(55, 'Ramos', 'Mark Angelo', 'Salcedo', 'Jr', 'Don Simeon, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '946044079', 'alumni54@gmail.com', '2026-09-21 19:09:11', '$2y$12$VHRsPIi7lVuqYkSz5ioFBe9J9LA9HkTI2VzrpBVeKlEXXMM3fHr7S', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:11', '2026-09-21 19:09:11'),
(56, 'Reña', 'Charles Timothy', 'Guañez', 'N/A', 'Looban, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639918861293', 'alumni55@gmail.com', '2026-09-21 19:09:11', '$2y$12$w6XAAOAbg7RsS8O6Mxvca.kq5FbHR7I4iPeKg2jv0S5UJh/ImdtL6', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:11', '2026-09-21 19:09:11'),
(57, 'Santos', 'Ginelle Joshua', 'Cristobal', 'N/A', '84 Ramirez St, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639656373397', 'alumni56@gmail.com', '2026-09-21 19:09:12', '$2y$12$93MG.vKBQpQPwDayvQxhB.B2StB.LZZNCADWl6QSlF5K2qbEwAUoS', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:12', '2026-09-21 19:09:12'),
(58, 'Santos', 'Johmer', 'Quejada', 'N/A', '84 Ramirez St, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639496678631', 'alumni57@gmail.com', '2026-09-21 19:09:12', '$2y$12$tklqzi3juZn.juOootYzUO2b3n4J0d49iGXWAD0WIMArBgenZcPKK', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:12', '2026-09-21 19:09:12'),
(59, 'Santos', 'Mark Anthony', 'Quejada', 'N/A', '53 Narra Street, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639672500606', 'alumni58@gmail.com', '2026-09-21 19:09:12', '$2y$12$SaDDJWRPLVzozh.BFID9X.5kgao9sxFo5VjQysit9UHMylZD4YyyK', 1, 'alumna', 'active', 2024, 2025, '2nd Semester', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:12', '2026-09-21 19:09:12'),
(60, 'Singh', 'Kier', 'Manahan', 'N/A', 'De Guzman Subdivision, Talavera 3114, Nueva Ecija, Region III - Central Luzon, Philippines', '+639760493931', 'alumni59@gmail.com', '2026-09-21 19:09:13', '$2y$12$8TwuPZAPujxpcIhbi8w3zOYxgt/x7d6Z.bJCsVWMgyfe8kwsZN2zy', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:13', '2026-09-21 19:09:13'),
(61, 'Torres', 'Paul Joseph', 'De Guzman', 'N/A', 'Gumamela 2, Rizal 3127, Nueva Ecija, Region III - Central Luzon, Philippines', '+639811939885', 'alumni60@gmail.com', '2026-09-21 19:09:13', '$2y$12$E9FLfA3ygOXSr92llIwz6e3zUV7VomJaQRrZqNuzxVmnxQeYkZaA2', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:13', '2026-09-21 19:09:13'),
(62, 'Umali', 'Romar', 'Torres', 'N/A', 'Zone 6, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639614738520', 'alumni61@gmail.com', '2026-09-21 19:09:13', '$2y$12$ebKO6C9OWv1geoC2Xhqu7eN3zwfRpmdk0zrZsOw64SHycCpgRbzca', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:13', '2026-09-21 19:09:13'),
(63, 'Vicente', 'Reynaldo', 'Ruz', 'Jr', 'Purok Centro, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639157025103', 'alumni62@gmail.com', '2026-09-21 19:09:13', '$2y$12$zkB5PqUwjc6xjDGYDjbOne/.wDDtOW9sO81djD97Kl92c6./GV5M2', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:13', '2026-09-21 19:09:13'),
(64, 'ZúÃ±iga', 'Ivan', 'Galvez', 'N/A', 'Del Pilar, Sto. Domingo 3133, Nueva Ecija, Region III - Central Luzon, Philippines', '+639395074737', 'alumni63@gmail.com', '2026-09-21 19:09:14', '$2y$12$Kr1I6Qv5E2D0Z6SckhE5x.Cez8AvQ4ExejviUB52h9lAlMfE7sv2y', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSEcE', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:14', '2026-09-21 19:09:14'),
(65, 'Adrineda', 'Allyah Khriselle', 'Sarmenta', 'N/A', 'Purok 1, Talavera 3114, Nueva Ecija, Region III - Central Luzon, Philippines', '+639514966653', 'alumni64@gmail.com', '2026-09-21 19:09:14', '$2y$12$em5K.6n3ole1w0mtrYm.YuSU39HMvPj4hYZKQCICn25S3KSG8gNdu', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:14', '2026-09-21 19:09:14'),
(66, 'Angeles', 'Marc Jasper', 'Del Rosario', 'N/A', 'Purok 2, Talavera 3114, Nueva Ecija, Region III - Central Luzon, Philippines', '+639058672514', 'alumni65@gmail.com', '2026-09-21 19:09:14', '$2y$12$juiZGh3omjBX6WqmjGANoeZHi0XPudzS.E/dmtq.OsX6eSYplFJxq', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:14', '2026-09-21 19:09:14'),
(67, 'Arandilla', 'Jabez', 'Peñaflorida', 'N/A', 'Purok 2, Guimba 3115, Nueva Ecija, Region III - Central Luzon, Philippines', '+639279767158', 'alumni66@gmail.com', '2026-09-21 19:09:14', '$2y$12$4i8LxGbFraYWCPtbU9tm8et/n1ottAZ3dYgF.g9iECBWMcgVHf09W', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:14', '2026-09-21 19:09:14'),
(68, 'Arandilla', 'Kyle Christian', 'Cajilig', 'N/A', 'Philippines', '+639634453579', 'alumni67@gmail.com', '2026-09-21 19:09:15', '$2y$12$XqBM9pVuVtJhPvnPW0BHtOcAO0xVkd8TID1Tgtvc/s.aKNOKTLXJ6', 1, 'alumna', 'active', 2020, 2024, '', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:15', '2026-09-21 19:09:15'),
(69, 'Batangan', 'Allen Nicole', 'Padilla', 'N/A', 'De Ocampo, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639173175154', 'alumni68@gmail.com', '2026-09-21 19:09:15', '$2y$12$hTG59j2R4dD2U/ILMG7R7OqR0cTkKky2wkVPJ5I/HN00cDrR9mSCO', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:15', '2026-09-21 19:09:15'),
(70, 'Bautista', 'Joeffrey', 'Flores', 'N/A', 'Rama Drive, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639361275568', 'alumni69@gmail.com', '2026-09-21 19:09:15', '$2y$12$M.psW473hXmywtM2jmh2/.y.6urewageuXBy/ICBh8Mb0O1uKkbca', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:15', '2026-09-21 19:09:15'),
(71, 'Buan', 'Lynel Jose', 'Valeriano', 'N/A', 'Parungao Subdivision, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639282568034', 'alumni70@gmail.com', '2026-09-21 19:09:15', '$2y$12$qzfQimDO.T2jc69YuxbuA.1Ur4BBK2Uwjx8wpUKZCW0vQU2108c9e', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:15', '2026-09-21 19:09:15'),
(72, 'Cape', 'Erica Mae', 'Lazarte', 'N/A', 'Yakal St., Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639454085112', 'alumni71@gmail.com', '2026-09-21 19:09:16', '$2y$12$o.sdbcbyNTmnZyAKM/hggeIOdsHOm0dw3MENJlg.2044/MNO75MnW', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:16', '2026-09-21 19:09:16'),
(73, 'Cuaresma', 'Vincent John', 'Candelaria', 'N/A', '115, Science City Of Munoz 3119, Nueva Ecija, Region III - Central Luzon, Philippines', '+639501570794', 'alumni72@gmail.com', '2026-09-21 19:09:16', '$2y$12$soEgE7nPobaOC.r6L5zMVOsl4y3XSstP4uy3htE/pe/4ZR4.7e2JC', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:16', '2026-09-21 19:09:16'),
(74, 'Delos Santos', 'Dan Jericho', 'Pascua', 'N/A', '162 Centro, San Miguel Bulacan 3011, Nueva Ecija, Region III - Central Luzon, Philippines', '+639175251380', 'alumni73@gmail.com', '2026-09-21 19:09:16', '$2y$12$7yih4cRuZncEir5qOlE17ugnalSIWzPZ2R3ZaozHh0TLuCQHRyBby', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:16', '2026-09-21 19:09:16'),
(75, 'Feliciano', 'John Vincent', 'Gamboa', 'N/A', 'Bongabon 3128, Nueva Ecija, Region III - Central Luzon, Philippines', '+639456883927', 'alumni74@gmail.com', '2026-09-21 19:09:16', '$2y$12$YmiFFbShgVNZmkxw9OmeNeyu1y6h.DguscHnRdkKM.aU8HpFfu7mu', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:16', '2026-09-21 19:09:16'),
(76, 'Fernandez', 'Alsymon', 'Carillo', 'N/A', 'Medina Street, San Isidro 3106, Nueva Ecija, Region III - Central Luzon, Philippines', '+639451379378', 'alumni75@gmail.com', '2026-09-21 19:09:17', '$2y$12$syoqK/ILFRGXvFqcB4STGOKKnP93e1tQyk4XtcfaofSEGKMwMeT/O', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:17', '2026-09-21 19:09:17'),
(77, 'Franco', 'Mark Anthony', 'Bulosan', 'N/A', 'Sta Cecilia, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639557325709', 'alumni76@gmail.com', '2026-09-21 19:09:17', '$2y$12$ZhFts4haPC5aqVsYrWuA.OaqcxewPkWNjU8aAlPPKaGBNZKoWpzxC', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, '2026-09-28 20:37:12', '2026-09-21 19:09:17', '2026-09-28 20:37:12'),
(78, 'Garcia', 'Sean Aeron', 'Chico', 'N/A', 'City of Gapan 3105, Nueva Ecija, Central Luzon, Philippines', '+639544839753', 'alumni77@gmail.com', '2026-09-21 19:09:17', '$2y$12$K6B2SoMW5419FGkVhpTKKufGiK62wDnlYKfvzx0IJVQjVzXIesT4G', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', '/uploads/profile-pictures/6abb14c1df4c9_1790645441.webp', NULL, NULL, '2026-09-21 19:09:17', '2026-09-29 08:30:42'),
(79, 'Gerigdig', 'Mark David', 'Nueda', 'N/A', 'Purok 5, Zaragoza 3110, Nueva Ecija, Region III - Central Luzon, Philippines', '+639954765732', 'alumni78@gmail.com', '2026-09-21 19:09:17', '$2y$12$JmpAAQrKxoLWYsLLR/Pgye4aepnKUTblJ1BzCZfNPwR4yZevXZXru', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:17', '2026-09-21 19:09:17'),
(80, 'Granado', 'Brant Dave', 'Cabalteja', 'N/A', 'Kamagong Street, Paradise Village, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639165964816', 'alumni79@gmail.com', '2026-09-21 19:09:18', '$2y$12$ZtHulhFQZubhdbYcjlRBP.YwB1v64FYnVIMSN48ETJZtfG6wpIQOS', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:18', '2026-09-21 19:09:18'),
(81, 'Javier', 'Jhon Ivan', 'Dayson', 'N/A', 'Peñaranda 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '+639668298036', 'alumni80@gmail.com', '2026-09-21 19:09:18', '$2y$12$vxj7ZUy5eZmBgdKIDnkjnOhqakYN8d5lo3U6yZJ/e/.VJ3gmKg4ji', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:18', '2026-09-21 19:09:18'),
(82, 'Juganas', 'Angel Christ', 'Linda', 'N/A', 'Block 31, Univille Subdivision, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639061618149', 'alumni81@gmail.com', '2026-09-21 19:09:18', '$2y$12$Vwf2WxHsKAFqwKlDpMq5wOhvINoLVYIwMySrswdRJA.1lIVkO7h7e', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:18', '2026-09-21 19:09:18'),
(83, 'Lorido', 'Erano', 'Rodriguez', 'N/A', '423 Don Pepito, Gapan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639205743091', 'alumni82@gmail.com', '2026-09-21 19:09:18', '$2y$12$oqRBemuIdQV1raDRt4p/Oe/W.vpkQygEJ.7yHQ0hQEGzQ2hfWrzDW', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:18', '2026-09-21 19:09:18'),
(84, 'Macalinao', 'Pol Justin', 'Buenconsejo', 'N/A', 'Purok Camia, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639272376963', 'alumni83@gmail.com', '2026-09-21 19:09:19', '$2y$12$h5zGv9ZSj3ZS0y9q1K/iHugRJUBnsbe7XpVUaW/EKq1r8AwPaHM4K', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:19', '2026-09-21 19:09:19'),
(85, 'Macalla', 'Jaymz Clariz', 'Pantallano', 'N/A', 'Cabanatuan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639612938624', 'alumni84@gmail.com', '2026-09-21 19:09:19', '$2y$12$/EesXXsHC84225oa.kQBJeY49KZbVFV091Ue9ZSSH6FTOab5tOgxS', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:19', '2026-09-21 19:09:19'),
(86, 'Manalo', 'Reniel', 'Gajonera', 'N/A', '112 Sampaguita Street, Cabanatuan City 3111, Nueva Ecija, Region III - Central Luzon, Philippines', '+639278643229', 'alumni85@gmail.com', '2026-09-21 19:09:19', '$2y$12$SqcGaHDaLfdifZs9GZvGuuMsUKSoOch1rPW2WKP3xPTGZPMxHdrju', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:19', '2026-09-21 19:09:19'),
(87, 'Manuel', 'Vrent Jullien', 'Ballesteros', 'N/A', 'Ipil St. Corner, Gapan City 3203, Nueva Ecija, Region III - Central Luzon, Philippines', '+639958977640', 'alumni86@gmail.com', '2026-09-21 19:09:19', '$2y$12$R6RBI9ZBplAoKC7mqUXske3Hru0N22ziF1AX81EA7cw9DWzc55VXy', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:19', '2026-09-21 19:09:19'),
(88, 'Mirano', 'David', '*', 'N/A', 'Purok 3, Aliaga 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639208465788', 'alumni87@gmail.com', '2026-09-21 19:09:20', '$2y$12$0MkpB7Jmr7TdNh0tybTmqupUh.rEgo4f0h4t3/IQcolVkW2iBbh8m', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:20', '2026-09-21 19:09:20'),
(89, 'Monce', 'Yves Charles', 'Tugaoen', 'N/A', 'Dipaculao 3115, Aurora, Region III - Central Luzon, Philippines', '+639563437776', 'alumni88@gmail.com', '2026-09-21 19:09:20', '$2y$12$TWk4wcBKIVY8MWUao9/7fOqCzDlzUsMMqyBmUpKUfL4viNIJ4ANCq', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:20', '2026-09-21 19:09:20'),
(90, 'Navarro', 'Louis Joseph', 'Manuel', 'N/A', 'Purok 5, Gapan City 3133, Nueva Ecija, Region III - Central Luzon, Philippines', '+639773304189', 'alumni89@gmail.com', '2026-09-21 19:09:20', '$2y$12$EFmIKXAtdnikLYHi2p3xmOZxIK5LT/SXIsZ8PURWXbe.wQ3TWFR/e', 1, 'alumna', 'active', 2024, 2025, '1st Semester', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:20', '2026-09-21 19:09:20'),
(91, 'Padua', 'Chennie May Angelie', 'Orpilla', 'N/A', 'Purok Rose, Guimba 3132, Nueva Ecija, Region III - Central Luzon, Philippines', '+639544850075', 'alumni90@gmail.com', '2026-09-21 19:09:20', '$2y$12$pV2djeD3W.ysEByMatfnn.GPMTqw.TKSTq/TTHH4sRbVrsvvNHf2C', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:20', '2026-09-21 19:09:20'),
(92, 'Pascual', 'Athena Marie', 'Wy', 'N/A', 'Salamanca St, Santo Domingo 3125, Nueva Ecija, Region III - Central Luzon, Philippines', '+639159415850', 'alumni91@gmail.com', '2026-09-21 19:09:21', '$2y$12$GKU3Y75GmjxREg/Au6Uh5OQOv4fC1mJUr9QiQ4LkFLKGznCyC6dee', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:21', '2026-09-21 19:09:21'),
(93, 'Piadozo', 'Ayane Marie', 'Carmona', 'N/A', '20 Rizal, Palayan City 3117, Nueva Ecija, Region III - Central Luzon, Philippines', '+639566113473', 'alumni92@gmail.com', '2026-09-21 19:09:21', '$2y$12$Em38WEstxvPlWs5.3myZk.3k2xeSPwr2f42vY7fJQguEGad7NRRc6', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:21', '2026-09-21 19:09:21'),
(94, 'Quejada', 'Ma. Lourdes', 'Magno', 'N/A', 'General Mamerto Natividad 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639338652816', 'alumni93@gmail.com', '2026-09-21 19:09:21', '$2y$12$Q.hI0S/hwuxgghndk4wfwuKDyPbm0djwFcWgxdr9ht87smPQT4Xiy', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:21', '2026-09-21 19:09:21'),
(95, 'Ramos', 'Gilrei Christian', '*', 'N/A', '23, Cuyapo 3107, Nueva Ecija, Region III - Central Luzon, Philippines', '+639763061358', 'alumni94@gmail.com', '2026-09-21 19:09:21', '$2y$12$piTNflXyComiKP3JD31T3ubNpFQfIXIaWD6Bdk6SKcWLLJRW5vi6S', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:21', '2026-09-21 19:09:21'),
(96, 'Roxas', 'Mark Gabrielle', 'Santos', 'N/A', '46 Clamonte Street, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639338782066', 'alumni95@gmail.com', '2026-09-21 19:09:22', '$2y$12$ufY4ZkwkdMskUdNJfgV/Aeg1X03uZmnBZuqFArU5YySagGeSfasGq', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:22', '2026-09-21 19:09:22'),
(97, 'Salazar', 'Lyca Daniela', 'Mangulabnan', 'N/A', '54 Purok 8, Cabiao 3107, Nueva Ecija, Region III - Central Luzon, Philippines', '+639569930826', 'alumni96@gmail.com', '2026-09-21 19:09:22', '$2y$12$E0rR4I1iIY2yE1lxDUwghOVdfSw/gWx9My9Is5RYTA91L.u4ATkb.', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:22', '2026-09-21 19:09:22'),
(98, 'Santos', 'Justine Edward', 'Pelayo', 'N/A', '147 T. Delos Santos St, Science City Of Munoz 3119, Nueva Ecija, Region III - Central Luzon, Philippines', '+639158777385', 'alumni97@gmail.com', '2026-09-21 19:09:22', '$2y$12$Esrf1Y.4CfAsBJ/Xq3A27OCZvYXKTgObHCrMcN9vxxq7sDpwpGg0e', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:22', '2026-09-21 19:09:22'),
(99, 'Solomon', 'Charles Andrew', 'Chico', 'N/A', 'Primavera, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639617440425', 'alumni98@gmail.com', '2026-09-21 19:09:22', '$2y$12$.ejCW0q30WFoqWF7siiONOzQHX9FuTYP2HdHkmZAoalHEx958eMNu', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:22', '2026-09-21 19:09:22'),
(100, 'Suba', 'Yvan John', 'Salazar', 'N/A', 'Lemnos, Cabanatuan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639399112198', 'alumni99@gmail.com', '2026-09-21 19:09:23', '$2y$12$1tRWAkuvacqbhT7aFN0t4uFH6zaRrRU9QyGYxyVB3f6ty1MZ4JVZ6', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:23', '2026-09-21 19:09:23');
INSERT INTO `users` (`id`, `last_name`, `first_name`, `middle_name`, `suffix`, `address`, `contact_number`, `email`, `email_verified_at`, `password`, `password_changed`, `user_role`, `status`, `start_year`, `end_year`, `semester`, `courses`, `department`, `profile_picture`, `remember_token`, `notifications_seen_at`, `created_at`, `updated_at`) VALUES
(101, 'Tinawin', 'Allyssa', 'Joaquin', 'N/A', 'Bonifacio St., Gapan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639756312400', 'alumni100@gmail.com', '2026-09-21 19:09:23', '$2y$12$yDNPJL3vcdzihtnhPWsm3evfKtQs74Wrv25FJc7V5IZ.6kyCYsaqe', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:23', '2026-09-21 19:09:23'),
(102, 'Ventura', 'Rainier Lloyd', 'Luis', 'N/A', 'Maria Street, Talugtug 3118, Nueva Ecija, Region III - Central Luzon, Philippines', '+639511342951', 'alumni101@gmail.com', '2026-09-21 19:09:23', '$2y$12$QnQp6IJZDVsaXkWLo5GqDOWx0FUFsrqDvvyQNm2QwKQIXKK4fP9o.', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:23', '2026-09-21 19:09:23'),
(103, 'Vicencio', 'Angela', 'Cando', 'N/A', 'Primavera, Cabanatuan City 3100, Nueva Ecija, Region III - Central Luzon, Philippines', '+639398239471', 'alumni102@gmail.com', '2026-09-21 19:09:24', '$2y$12$KnXk3Rta4oeWFRXXGmLX.OtgNEVcAiA6oajpt51yoxrofP5Pp4.gS', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:24', '2026-09-21 19:09:24'),
(104, 'Viernes', 'Mikeila', 'De Leon', 'N/A', 'Partida St, Peñaranda 3103, Nueva Ecija, Region III - Central Luzon, Philippines', '+639765647979', 'alumni103@gmail.com', '2026-09-21 19:09:24', '$2y$12$/hqgtSLfI2OmZCBTD6R3mer0nzZyaDlSL5Ny0rlBtjI9FS2ftdBXG', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:24', '2026-09-21 19:09:24'),
(105, 'Villareal', 'John Mark', 'Bactol', 'N/A', 'Del Corro St, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '962539079', 'alumni104@gmail.com', '2026-09-21 19:09:24', '$2y$12$NOT5ii9Fe3M1nzZHEaXqcO6VNwJPcB5Y.MwBQ3q0EXOAVk3bL.m/m', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:24', '2026-09-21 19:09:24'),
(106, 'Yuzon', 'Julian Miguel', 'Cenon', 'N/A', '244 Del Corro Street, Gapan City 3105, Nueva Ecija, Region III - Central Luzon, Philippines', '+639761372128', 'alumni105@gmail.com', '2026-09-21 19:09:24', '$2y$12$ICvTkTmaBLEUwWeze46Lwew8ALzYUulWAv1bGtD7IUVjmK/1M2Dbq', 1, 'alumna', 'active', 2024, 2025, 'Summer/Midyear', 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:24', '2026-09-21 19:09:24'),
(107, 'Tugaff', 'Maria Catalina', NULL, NULL, NULL, NULL, 'k@gmail.com', NULL, '$2y$12$lDYgSTs.mTphIb388ABC9.WIEyPGE6Aou3ZjqoGRclWkAiIGGAFe.', 1, 'coordinator', 'active', NULL, NULL, NULL, 'BSIT', 'CECT', NULL, NULL, NULL, '2026-09-21 19:09:25', '2026-09-22 16:59:15'),
(108, 'Portana', 'Joephet', NULL, NULL, NULL, NULL, 'j@gmail.com', NULL, '$2y$12$iuRbr.WImMYmpX/N3PFuye.CJ62ovJ9XYqzantPZ/m0A6sDvpcQg2', 0, 'admin', 'active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-09-28 20:50:37', '2026-09-21 19:09:26', '2026-09-28 20:50:37'),
(109, 'Guanio', 'Angela Marie', 'Parial', 'N/A', '848 H Malgapo Street, Brgy. San Vicente (Pob.), City of Gapan 3105, Nueva Ecija, Central Luzon', '+639112223333', 'angelaguanio@gmail.com', '2026-09-25 12:33:57', '$2y$12$vFbAd9KLAPDibZZ4KiZ3YO/M7L/P4bT7/oMRlIU8zPO6yRNIw8fWC', 0, 'alumna', 'active', 2025, 2026, '1st Semester', 'BSIT', 'CECT', '/uploads/profile-pictures/6ab6052a7d842_1790313770.webp', NULL, NULL, '2026-09-25 12:22:50', '2026-09-25 12:33:57'),
(110, 'Soria', 'Tiffany joy', 'Gumaid', 'N/A', 'P.Padilla Street, N/A, Brgy. Poblacion III, Peñaranda 3100, Nueva Ecija, Central Luzon', '+639562945471', 'soriatiffany25@gmail.com', '2026-09-28 22:04:41', '$2y$12$KMexWW5K/Tk4RaVQPFdiduFW5CnC57WfjXW6OC8mcY4jDocmLMtn.', 0, 'alumna', 'active', 2025, 2026, '1st Semester', 'BSIT', 'CECT', '/uploads/profile-pictures/6aba5e3b2d2fb_1790598715.webp', NULL, NULL, '2026-09-28 19:31:56', '2026-09-28 22:04:41'),
(111, 'Tatad', 'Jaz-Shane', 'Munsayac', 'N/A', 'Garcia Exit / 016, Brgy. Aduas Norte, City of Cabanatuan 3100, Nueva Ecija, Central Luzon', '+639677616926', 'jaztatad01@gmail.com', NULL, '$2y$12$xA7BNS9EY0JaRuMGZ9M6SuEOu622wYP9PycovCw79HYCGiX50Dhgy', 0, 'alumna', 'active', 2025, 2026, '2nd Semester', 'BSIT', 'CECT', '/uploads/profile-pictures/6aba60cea5d9e_1790599374.webp', NULL, NULL, '2026-09-28 19:42:55', '2026-09-28 19:42:55'),
(112, 'Atayde', 'Jay Mharie', 'Dalangin', 'N/A', '168 Purok 2, Brgy. Santa Cruz, Zaragoza 3110, Nueva Ecija, Central Luzon', '+639501123927', 'ataydejaymharie0517@gmail.com', '2026-09-28 22:10:19', '$2y$12$7jWnmNj3LhiUJb47oQ9Mxup4sPOM1g47lYwREJjK2Neof2OJuPn6.', 0, 'alumna', 'active', 2025, 2026, '1st Semester', 'BSIT', 'CECT', '/uploads/profile-pictures/6aba8327db7ad_1790608167.webp', NULL, NULL, '2026-09-28 22:09:28', '2026-09-28 22:10:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addresses_user_id_foreign` (`user_id`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `1` (`user_id`),
  ADD KEY `announcements_status_index` (`status`),
  ADD KEY `announcements_status_user_id_index` (`status`,`user_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversations_admin_id_coordinator_id_unique` (`admin_id`,`coordinator_id`),
  ADD KEY `conversations_coordinator_id_foreign` (`coordinator_id`);

--
-- Indexes for table `employment`
--
ALTER TABLE `employment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employment_user_id_index` (`user_id`);

--
-- Indexes for table `employment_history`
--
ALTER TABLE `employment_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employment_history_user_id_created_at_index` (`user_id`,`created_at`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inquiries_user_id_foreign` (`user_id`),
  ADD KEY `inquiries_recipient_id_foreign` (`recipient_id`),
  ADD KEY `inquiries_status_index` (`status`);

--
-- Indexes for table `inquiry_replies`
--
ALTER TABLE `inquiry_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inquiry_replies_inquiry_id_foreign` (`inquiry_id`),
  ADD KEY `inquiry_replies_sender_id_foreign` (`sender_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_conversation_id_foreign` (`conversation_id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`);

--
-- Indexes for table `message_reads`
--
ALTER TABLE `message_reads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `message_reads_message_id_user_id_unique` (`message_id`,`user_id`),
  ADD KEY `message_reads_user_id_foreign` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_reads`
--
ALTER TABLE `notification_reads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `notification_reads_notification_id_user_id_unique` (`notification_id`,`user_id`),
  ADD KEY `notification_reads_user_id_foreign` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `responses`
--
ALTER TABLE `responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `responses_user_id_foreign` (`user_id`),
  ADD KEY `responses_survey_id_user_id_index` (`survey_id`,`user_id`),
  ADD KEY `responses_question_id_index` (`question_id`),
  ADD KEY `responses_submitted_at_index` (`submitted_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `subheadings`
--
ALTER TABLE `subheadings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subheadings_section_id_display_order_index` (`section_id`,`display_order`);

--
-- Indexes for table `surveys`
--
ALTER TABLE `surveys`
  ADD PRIMARY KEY (`id`),
  ADD KEY `surveys_created_by_foreign` (`created_by`),
  ADD KEY `surveys_status_index` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_user_role_index` (`user_role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employment`
--
ALTER TABLE `employment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `employment_history`
--
ALTER TABLE `employment_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `featured_alumni`
--
ALTER TABLE `featured_alumni`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiries`
--
ALTER TABLE `inquiries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `inquiry_replies`
--
ALTER TABLE `inquiry_replies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message_reads`
--
ALTER TABLE `message_reads`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification_reads`
--
ALTER TABLE `notification_reads`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `responses`
--
ALTER TABLE `responses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=825;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subheadings`
--
ALTER TABLE `subheadings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `surveys`
--
ALTER TABLE `surveys`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `survey_drafts`
--
ALTER TABLE `survey_drafts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_coordinator_id_foreign` FOREIGN KEY (`coordinator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employment`
--
ALTER TABLE `employment`
  ADD CONSTRAINT `employment_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employment_history`
--
ALTER TABLE `employment_history`
  ADD CONSTRAINT `employment_history_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inquiries`
--
ALTER TABLE `inquiries`
  ADD CONSTRAINT `inquiries_recipient_id_foreign` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `inquiries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inquiry_replies`
--
ALTER TABLE `inquiry_replies`
  ADD CONSTRAINT `inquiry_replies_inquiry_id_foreign` FOREIGN KEY (`inquiry_id`) REFERENCES `inquiries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inquiry_replies_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_reads`
--
ALTER TABLE `message_reads`
  ADD CONSTRAINT `message_reads_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `message_reads_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_reads`
--
ALTER TABLE `notification_reads`
  ADD CONSTRAINT `notification_reads_notification_id_foreign` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notification_reads_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `responses`
--
ALTER TABLE `responses`
  ADD CONSTRAINT `responses_question_id_foreign` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  ADD CONSTRAINT `responses_survey_id_foreign` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `responses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `subheadings`
--
ALTER TABLE `subheadings`
  ADD CONSTRAINT `subheadings_section_id_foreign` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `surveys`
--
ALTER TABLE `surveys`
  ADD CONSTRAINT `surveys_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
