-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2024 at 09:29 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `das_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `attention_test_results`
--

CREATE TABLE `attention_test_results` (
  `id` int(11) NOT NULL,
  `test_type` varchar(50) DEFAULT NULL,
  `user_answer` varchar(255) DEFAULT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `result` varchar(50) DEFAULT NULL,
  `time_taken` float DEFAULT NULL,
  `correct_attempts` int(11) DEFAULT NULL,
  `incorrect_attempts` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attention_test_results`
--

INSERT INTO `attention_test_results` (`id`, `test_type`, `user_answer`, `correct_answer`, `result`, `time_taken`, `correct_attempts`, `incorrect_attempts`, `timestamp`) VALUES
(124, 'Attention', 'L', 'K', 'Incorrect', 2645, 0, 0, '2024-10-16 23:10:03'),
(125, 'Attention', 'P', 'N', 'Incorrect', 2738, 0, 1, '2024-10-16 23:10:06'),
(126, 'Attention', 'P', 'C', 'Incorrect', 259, 0, 2, '2024-10-16 23:10:08'),
(127, 'Attention', 'Z', 'C', 'Incorrect', 1061, 0, 3, '2024-10-16 23:10:08'),
(128, 'Attention', 'T', 'A', 'Incorrect', 726, 0, 4, '2024-10-16 23:10:10'),
(129, 'Attention', 'Z', 'Z', 'Correct', 2761, 1, -1, '2024-10-16 23:13:25'),
(130, 'Attention', 'Y', 'Y', 'Correct', 1479, 2, -1, '2024-10-16 23:13:27'),
(131, 'Attention', 'L', 'L', 'Correct', 1751, 3, -1, '2024-10-16 23:13:30'),
(132, 'Attention', 'H', 'H', 'Correct', 7547, 4, -1, '2024-10-16 23:13:39'),
(133, 'Attention', 'U', 'U', 'Correct', 1364, 5, -1, '2024-10-16 23:13:41');

-- --------------------------------------------------------

--
-- Table structure for table `memory_test_results`
--

CREATE TABLE `memory_test_results` (
  `id` int(11) NOT NULL,
  `test_type` varchar(50) DEFAULT NULL,
  `user_answer` varchar(255) DEFAULT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `result` varchar(50) DEFAULT NULL,
  `time_taken` float DEFAULT NULL,
  `correct_attempts` int(11) DEFAULT NULL,
  `incorrect_attempts` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `memory_test_results`
--

INSERT INTO `memory_test_results` (`id`, `test_type`, `user_answer`, `correct_answer`, `result`, `time_taken`, `correct_attempts`, `incorrect_attempts`, `timestamp`) VALUES
(21, 'Memory', '🟡🔵🟠🟠', '🟠🟡🔵🟢🔴', 'Incorrect', 7.225, 0, 1, '2024-10-16 23:10:28'),
(22, 'Memory', '🟢🟡🟠🟢🟠', '🟣🟢🔵🟠🟡', 'Incorrect', 7.754, 0, 1, '2024-10-16 23:13:55');

-- --------------------------------------------------------

--
-- Table structure for table `reading_test_results`
--

CREATE TABLE `reading_test_results` (
  `id` int(11) NOT NULL,
  `test_type` varchar(50) DEFAULT NULL,
  `user_answer` varchar(255) DEFAULT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `result` varchar(50) DEFAULT NULL,
  `time_taken` float DEFAULT NULL,
  `correct_attempts` int(11) DEFAULT NULL,
  `incorrect_attempts` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reading_test_results`
--

INSERT INTO `reading_test_results` (`id`, `test_type`, `user_answer`, `correct_answer`, `result`, `time_taken`, `correct_attempts`, `incorrect_attempts`, `timestamp`) VALUES
(24, 'Reading', 'The quick brown fox jumps over the alyz dog.', 'The quick brown fox jumps over the lazy dog.', 'Incorrect', 10, 0, 1, '2024-10-16 23:11:02'),
(25, 'Reading', 'The quick brown fox jumps over the lazy dog.', 'The quick brown fox jumps over the lazy dog.', 'Correct', 13, 1, 1, '2024-10-16 23:11:05'),
(26, 'Reading', 'The qciuk brown fox jmups over the alyz dog.', 'The quick brown fox jumps over the lazy dog.', 'Incorrect', 11, 0, 1, '2024-10-16 23:13:07'),
(27, 'Reading', 'The quick brown fox jumps over the lazy dog.', 'The quick brown fox jumps over the lazy dog.', 'Correct', 17, 1, 1, '2024-10-16 23:13:13'),
(28, 'Reading', 'The qciuk brown fox jmups over the alyz dog.', 'The quick brown fox jumps over the lazy dog.', 'Incorrect', 7, 0, 1, '2024-10-16 23:14:25'),
(29, 'Reading', 'The quick brown fox jumps over the lazy dog.', 'The quick brown fox jumps over the lazy dog.', 'Correct', 16, 1, 1, '2024-10-16 23:14:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `password`, `email`, `dob`) VALUES
(2, 'charity', 'cheruto', '$2b$12$qckeaFmDOxD776yCTV5rFOBUpVBYOnOWNh63kgCK0GBSXJVvvXnBu', '', '2024-02-06'),
(4, 'mark', 'kiarie', '$2b$12$5bZGmbx/FjrgEE0Pvol8iux3mWyx87vcVMTu.Tu4M0T97lEklUbpm', '', '2024-10-15');

-- --------------------------------------------------------

--
-- Table structure for table `user_personality`
--

CREATE TABLE `user_personality` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `personality` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attention_test_results`
--
ALTER TABLE `attention_test_results`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `memory_test_results`
--
ALTER TABLE `memory_test_results`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reading_test_results`
--
ALTER TABLE `reading_test_results`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_personality`
--
ALTER TABLE `user_personality`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attention_test_results`
--
ALTER TABLE `attention_test_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=134;

--
-- AUTO_INCREMENT for table `memory_test_results`
--
ALTER TABLE `memory_test_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `reading_test_results`
--
ALTER TABLE `reading_test_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_personality`
--
ALTER TABLE `user_personality`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_personality`
--
ALTER TABLE `user_personality`
  ADD CONSTRAINT `user_personality_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
