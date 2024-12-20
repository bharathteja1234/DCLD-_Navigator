-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 20, 2024 at 04:58 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dcld`
--

-- --------------------------------------------------------

--
-- Table structure for table `dailyassessment`
--

CREATE TABLE `dailyassessment` (
  `id` int(255) NOT NULL,
  `p_id` varchar(255) NOT NULL,
  `assessment_date` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `stomachAche` varchar(255) DEFAULT NULL,
  `stomachAcheLocation` varchar(255) DEFAULT NULL,
  `stomachAcheIntensity` varchar(255) DEFAULT NULL,
  `yellowSkinEyes` varchar(255) DEFAULT NULL,
  `swelling` varchar(255) DEFAULT NULL,
  `swellingLocation` varchar(255) DEFAULT NULL,
  `tiredness` varchar(255) DEFAULT NULL,
  `confusion` varchar(255) DEFAULT NULL,
  `medsTaken` varchar(255) DEFAULT NULL,
  `missedMeds` varchar(255) DEFAULT NULL,
  `highSaltFood` varchar(255) DEFAULT NULL,
  `enoughProtein` varchar(255) DEFAULT NULL,
  `bowelMovements` varchar(255) DEFAULT NULL,
  `bpMorning` varchar(255) DEFAULT NULL,
  `bpEvening` varchar(255) DEFAULT NULL,
  `heartRateMorning` varchar(255) DEFAULT NULL,
  `heartRateEvening` varchar(255) DEFAULT NULL,
  `fluidIntake` varchar(255) DEFAULT NULL,
  `fluidList` varchar(255) DEFAULT NULL,
  `abdominalCircumference` varchar(255) DEFAULT NULL,
  `activityDetails` varchar(255) DEFAULT NULL,
  `bloodInStool` varchar(255) DEFAULT NULL,
  `bowelConsistency` varchar(255) DEFAULT NULL,
  `bowelFrequency` varchar(255) DEFAULT NULL,
  `urineOutput` varchar(255) DEFAULT NULL,
  `physicalActivity` varchar(255) DEFAULT NULL,
  `proteinFoods` varchar(255) DEFAULT NULL,
  `missedMedsReason` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dischargesummary`
--

CREATE TABLE `dischargesummary` (
  `id` int(255) NOT NULL,
  `p_id` varchar(255) NOT NULL,
  `discharge_summary` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `summary` text DEFAULT NULL,
  `bp` varchar(255) DEFAULT NULL,
  `sugar` varchar(255) DEFAULT NULL,
  `cbc_hemoglobin` varchar(255) DEFAULT NULL,
  `cbc_platelet_count` varchar(255) DEFAULT NULL,
  `cbc_tlc_count` varchar(255) DEFAULT NULL,
  `rft_urea` varchar(255) DEFAULT NULL,
  `rft_creatinine` varchar(255) DEFAULT NULL,
  `lft_total_bilirubin` varchar(255) DEFAULT NULL,
  `lft_direct_bilirubin` varchar(255) DEFAULT NULL,
  `lft_total_protein` varchar(255) DEFAULT NULL,
  `lft_ast` varchar(255) DEFAULT NULL,
  `lft_alt` varchar(255) DEFAULT NULL,
  `lft_alp` varchar(255) DEFAULT NULL,
  `lft_albumin` varchar(255) DEFAULT NULL,
  `electrolytes_sodium` varchar(255) DEFAULT NULL,
  `electrolytes_potassium` varchar(255) DEFAULT NULL,
  `electrolytes_bicarbonate` varchar(255) DEFAULT NULL,
  `pt_inr` varchar(255) DEFAULT NULL,
  `aptt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctorlogin`
--

CREATE TABLE `doctorlogin` (
  `id` int(5) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `doctor_name` varchar(255) NOT NULL,
  `d_id` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `speciality` varchar(255) NOT NULL,
  `contactNo` varchar(255) NOT NULL,
  `image` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctor_questions`
--

CREATE TABLE `doctor_questions` (
  `id` int(100) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `question` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medication`
--

CREATE TABLE `medication` (
  `id` int(255) NOT NULL,
  `p_id` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `duration` varchar(255) NOT NULL,
  `medicine` varchar(255) NOT NULL,
  `medicine_duration` varchar(255) NOT NULL,
  `frequency` varchar(255) NOT NULL,
  `guidelines` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification_table`
--

CREATE TABLE `notification_table` (
  `id` int(255) NOT NULL,
  `p_id` varchar(255) NOT NULL,
  `Notification` varchar(255) NOT NULL,
  `NotificationDate` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patientlogin`
--

CREATE TABLE `patientlogin` (
  `id` int(5) NOT NULL,
  `p_id` varchar(255) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contactNo` int(100) NOT NULL,
  `age` int(5) NOT NULL,
  `disease` varchar(100) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `admittedOn` varchar(20) NOT NULL,
  `dischargeOn` varchar(20) NOT NULL,
  `image` longtext NOT NULL,
  `Treatment_Given` varchar(1000) NOT NULL,
  `Course_in_Hospital` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `patientnotes`
--

CREATE TABLE `patientnotes` (
  `id` int(255) NOT NULL,
  `p_id` varchar(255) NOT NULL,
  `Notes_Index` varchar(255) NOT NULL,
  `Notes` text NOT NULL,
  `notes_date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `questionresponses`
--

CREATE TABLE `questionresponses` (
  `id` int(255) NOT NULL,
  `p_id` varchar(255) NOT NULL,
  `Questions_No` varchar(255) NOT NULL,
  `questions` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `response` varchar(255) NOT NULL,
  `response_time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dailyassessment`
--
ALTER TABLE `dailyassessment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dischargesummary`
--
ALTER TABLE `dischargesummary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctorlogin`
--
ALTER TABLE `doctorlogin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctor_questions`
--
ALTER TABLE `doctor_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medication`
--
ALTER TABLE `medication`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_table`
--
ALTER TABLE `notification_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patientlogin`
--
ALTER TABLE `patientlogin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patientnotes`
--
ALTER TABLE `patientnotes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questionresponses`
--
ALTER TABLE `questionresponses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dailyassessment`
--
ALTER TABLE `dailyassessment`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `dischargesummary`
--
ALTER TABLE `dischargesummary`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `doctorlogin`
--
ALTER TABLE `doctorlogin`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `doctor_questions`
--
ALTER TABLE `doctor_questions`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `medication`
--
ALTER TABLE `medication`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `notification_table`
--
ALTER TABLE `notification_table`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `patientlogin`
--
ALTER TABLE `patientlogin`
  MODIFY `id` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `patientnotes`
--
ALTER TABLE `patientnotes`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `questionresponses`
--
ALTER TABLE `questionresponses`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
