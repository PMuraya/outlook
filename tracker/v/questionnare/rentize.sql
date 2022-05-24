-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2022 at 03:03 PM
-- Server version: 8.0.28
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rentize`
--

-- --------------------------------------------------------

--
-- Table structure for table `agreement`
--

CREATE TABLE `agreement` (
  `agreement` int NOT NULL,
  `room` int NOT NULL,
  `tenant` int NOT NULL,
  `amount` double NOT NULL,
  `start_date` date NOT NULL,
  `duration` int NOT NULL DEFAULT '5',
  `review` int NOT NULL DEFAULT '3',
  `end_date` date NOT NULL DEFAULT '9999-12-31',
  `is_valid` int NOT NULL,
  `comment` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"715","cy":"1263"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `eaccount`
--

CREATE TABLE `eaccount` (
  `eaccount` int NOT NULL,
  `num` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_invalid` int NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"1427","cy":"273"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `ebill`
--

CREATE TABLE `ebill` (
  `ebill` int NOT NULL,
  `msg` int DEFAULT NULL,
  `eaccount` int NOT NULL,
  `invoice` int DEFAULT NULL,
  `due_date` date NOT NULL,
  `current_amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"1765","cy":"265"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `econnection`
--

CREATE TABLE `econnection` (
  `econnection` int NOT NULL,
  `room` int NOT NULL,
  `emeter` int NOT NULL,
  `rate` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date NOT NULL,
  `start_reading` int DEFAULT NULL,
  `share` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"695","cy":"547"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `elink`
--

CREATE TABLE `elink` (
  `elink` int NOT NULL,
  `emeter` int NOT NULL,
  `eaccount` int NOT NULL,
  `origin` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"1075","cy":"277"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `emeter`
--

CREATE TABLE `emeter` (
  `emeter` int NOT NULL,
  `num` varchar(50) NOT NULL,
  `uid` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_invalid` int NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `new_num` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"685","cy":"273"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `ereading`
--

CREATE TABLE `ereading` (
  `ereading` int NOT NULL,
  `emeter` int NOT NULL,
  `invoice` int DEFAULT NULL,
  `date` date NOT NULL,
  `value` double DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"307","cy":"273"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `landlord`
--

CREATE TABLE `landlord` (
  `landlord` int NOT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `paybill` int DEFAULT NULL,
  `user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"-74","cy":"889"}';

--
-- Dumping data for table `landlord`
--

INSERT INTO `landlord` (`landlord`, `email`, `paybill`, `user`) VALUES
(1, 'mutallcompany@gmail.com', NULL, 1237);

-- --------------------------------------------------------

--
-- Table structure for table `msg`
--

CREATE TABLE `msg` (
  `msg` int NOT NULL,
  `id` varchar(32) NOT NULL,
  `body` longtext,
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"2124","cy":"258"}';

-- --------------------------------------------------------

--
-- Table structure for table `picture`
--

CREATE TABLE `picture` (
  `picture` int NOT NULL,
  `room` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `elevation` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"411","cy":"648"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

CREATE TABLE `property` (
  `property` int NOT NULL,
  `uid` varchar(200) NOT NULL,
  `landlord` int NOT NULL,
  `business` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"259","cy":"889"}';

--
-- Dumping data for table `property`
--

INSERT INTO `property` (`property`, `uid`, `landlord`, `business`, `name`, `location`) VALUES
(1, 'mutall_rental', 1, 47, 'Mutall Investment Co. Ltd', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `room` int NOT NULL,
  `property` int DEFAULT NULL,
  `uid` varchar(255) NOT NULL,
  `is_psuedo` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `floor` varchar(255) DEFAULT NULL,
  `wing` varchar(255) DEFAULT NULL,
  `width_ft` int DEFAULT NULL,
  `width_inch` int DEFAULT NULL,
  `breadth_ft` int DEFAULT NULL,
  `breadth_inch` int DEFAULT NULL,
  `area_sq_m` double DEFAULT NULL,
  `area_sq_ft` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"707","cy":"896"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `service` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `auto` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"1371","cy":"1267"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `subscription` int NOT NULL,
  `agreement` int DEFAULT NULL,
  `service` int NOT NULL,
  `amount` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"1041","cy":"1263"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `tenant`
--

CREATE TABLE `tenant` (
  `tenant` int NOT NULL,
  `quarterly` int NOT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `user` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":724,"cy":1518}' ROW_FORMAT=COMPACT;

--
-- Dumping data for table `tenant`
--

INSERT INTO `tenant` (`tenant`, `quarterly`, `contact`, `email`, `user`) VALUES
(1, 1, 'ASHLEY', 'fridah.wangui@4g-capital.com', 1211),
(2, 1, 'KEN KIMANI', 'chikjoint@gmail.com', 1212),
(3, 1, 'MUREITHI WAMBUGU', 'deekosb@yahoo.com\r\n', 1213),
(4, 1, 'HUBERT', 'jemimahndege@yahoo.com\r\n', 1214),
(5, 1, 'PETER KAAKUA', 'rieskaakua.co@gmail.com', 1215),
(6, 0, 'YUSUF', 'yusufosando@gmail.com', 1216),
(7, 1, 'ISAAC LEBOI', 'kleboi07@gmail.com\r\n', 1217),
(8, 0, 'ELIZABETH', 'sidaigroup@gmail.com\r\n', 1218),
(9, 1, 'DANIEL SINKIRA', 'kiserian@nnm.co.ke\r\n', 1219),
(10, 1, 'BORNIFACE', 'kiserian@ukristonaufanisicoop.com\r\n', 1220),
(11, 0, NULL, 'kiserianbr@co-opbank.co.ke\r\n', 1221),
(12, 0, NULL, 'simadvo@yahoo.com\r\n', 1222),
(13, 1, NULL, 'info@kecobat.org', 1223),
(14, 1, NULL, 'plotecltd4@gmail.com\r\n', 1224),
(15, 1, NULL, 'vanekwambokaadvocates@gmail.com\r\n', 1225),
(16, 1, NULL, 'isaackntari@yahoo.com', 1226),
(17, 1, NULL, 'archihubconstruction@yahoo.com\r\n', 1227),
(18, 1, NULL, 'info@orusatours.com\r\n', 1228),
(19, 1, NULL, 'fredrickchomba@ymail.com\r\n', 1229),
(20, 1, 'John, Finance manager', 'accounts@girlchildnetwork.org', 1230),
(21, 1, 'Gregory ', 'gathirwandunyu@gmail.com', 1231),
(22, 0, 'Waweru Munyi', 'wawerumunyi@yahoo.com', 1232),
(23, 1, NULL, 'info@orusatours.com', 1233),
(24, 1, 'John Accounts', 'v.wangari@girlchildnetwork.org', 1234),
(25, 1, NULL, 'kentagon.enterprises@gmail.com', 1235),
(26, 0, NULL, 'simadvo@yahoo.com', 1236),
(27, 1, 'Lawrence Munene', 'info@timchist.co.ke', 1237),
(28, 1, 'PETER KAMAU', 'ipa', 1238),
(29, 1, 'TITUS SAITOTI', 'kashanga', 1239),
(30, 0, 'LILIAN MUNGAI', 'kinyozi', 1240),
(31, 1, NULL, 'lovinah', 1241),
(32, 0, 'DENNIS', 'masabi', 1242),
(33, 1, NULL, 'misatis', 1243),
(34, 1, 'NOAH', 'mwamba', 1244),
(35, 0, 'RICHARD KIRISIA', 'fairdeal', 1245),
(36, 0, NULL, 'puan', 1246),
(37, 1, 'Kerea, Chairman Oloolaiser', 'kerea', 1247),
(38, 1, NULL, 'forces', 1248),
(39, 1, NULL, 'coop/hq', 1249),
(40, 0, 'Jimmy', 'mzalendo', 1250),
(41, 0, 'Jimmy', 'mzalendo_ex', 1251),
(42, 0, 'Jimmy', 'Grand_midways', 1252);

-- --------------------------------------------------------

--
-- Table structure for table `wconnection`
--

CREATE TABLE `wconnection` (
  `wconnection` int NOT NULL,
  `room` int NOT NULL,
  `wmeter` int NOT NULL,
  `rate` double DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date NOT NULL,
  `start_reading` int DEFAULT NULL,
  `end_reading` int DEFAULT NULL,
  `disconnected` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"1149","cy":"892"}' ROW_FORMAT=COMPACT;

-- --------------------------------------------------------

--
-- Table structure for table `wmeter`
--

CREATE TABLE `wmeter` (
  `wmeter` int NOT NULL,
  `serial_no` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `is_supply` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='{"cx":"1583","cy":"889"}' ROW_FORMAT=COMPACT;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agreement`
--
ALTER TABLE `agreement`
  ADD PRIMARY KEY (`agreement`),
  ADD UNIQUE KEY `identification1` (`tenant`,`room`,`start_date`),
  ADD KEY `room` (`room`);

--
-- Indexes for table `eaccount`
--
ALTER TABLE `eaccount`
  ADD PRIMARY KEY (`eaccount`),
  ADD UNIQUE KEY `id9` (`num`);

--
-- Indexes for table `ebill`
--
ALTER TABLE `ebill`
  ADD PRIMARY KEY (`ebill`),
  ADD UNIQUE KEY `identification10` (`eaccount`,`due_date`),
  ADD KEY `msg` (`msg`),
  ADD KEY `invoice` (`invoice`);

--
-- Indexes for table `econnection`
--
ALTER TABLE `econnection`
  ADD PRIMARY KEY (`econnection`),
  ADD UNIQUE KEY `id11` (`room`,`emeter`,`end_date`),
  ADD KEY `emeter` (`emeter`),
  ADD KEY `end_date` (`end_date`),
  ADD KEY `room` (`room`);

--
-- Indexes for table `elink`
--
ALTER TABLE `elink`
  ADD PRIMARY KEY (`elink`),
  ADD UNIQUE KEY `id13` (`emeter`,`eaccount`),
  ADD KEY `eaccount` (`eaccount`);

--
-- Indexes for table `emeter`
--
ALTER TABLE `emeter`
  ADD PRIMARY KEY (`emeter`),
  ADD UNIQUE KEY `id14` (`num`),
  ADD UNIQUE KEY `id` (`new_num`);

--
-- Indexes for table `ereading`
--
ALTER TABLE `ereading`
  ADD PRIMARY KEY (`ereading`),
  ADD UNIQUE KEY `identification15` (`emeter`,`date`),
  ADD KEY `invoice` (`invoice`);

--
-- Indexes for table `landlord`
--
ALTER TABLE `landlord`
  ADD PRIMARY KEY (`landlord`),
  ADD UNIQUE KEY `id` (`email`) USING BTREE,
  ADD UNIQUE KEY `paybill` (`paybill`),
  ADD KEY `landlord_user` (`user`);

--
-- Indexes for table `msg`
--
ALTER TABLE `msg`
  ADD PRIMARY KEY (`msg`),
  ADD UNIQUE KEY `id19` (`id`);

--
-- Indexes for table `picture`
--
ALTER TABLE `picture`
  ADD PRIMARY KEY (`picture`),
  ADD UNIQUE KEY `identification23` (`room`,`name`);

--
-- Indexes for table `property`
--
ALTER TABLE `property`
  ADD PRIMARY KEY (`property`),
  ADD UNIQUE KEY `landlord_pk` (`landlord`),
  ADD UNIQUE KEY `uid` (`uid`),
  ADD UNIQUE KEY `id` (`uid`),
  ADD UNIQUE KEY `property_name` (`name`),
  ADD KEY `busi_prop` (`business`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`room`),
  ADD UNIQUE KEY `identification25` (`uid`),
  ADD KEY `property` (`property`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`service`),
  ADD UNIQUE KEY `id26` (`name`);

--
-- Indexes for table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`subscription`),
  ADD KEY `service` (`service`),
  ADD KEY `id` (`agreement`);

--
-- Indexes for table `tenant`
--
ALTER TABLE `tenant`
  ADD PRIMARY KEY (`tenant`) USING BTREE,
  ADD UNIQUE KEY `client_user` (`user`),
  ADD UNIQUE KEY `id` (`email`),
  ADD KEY `user_fk` (`tenant`) USING BTREE;

--
-- Indexes for table `wconnection`
--
ALTER TABLE `wconnection`
  ADD PRIMARY KEY (`wconnection`),
  ADD UNIQUE KEY `id29` (`room`,`wmeter`,`end_date`),
  ADD KEY `wmeter` (`wmeter`);

--
-- Indexes for table `wmeter`
--
ALTER TABLE `wmeter`
  ADD PRIMARY KEY (`wmeter`),
  ADD UNIQUE KEY `id30` (`serial_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agreement`
--
ALTER TABLE `agreement`
  MODIFY `agreement` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eaccount`
--
ALTER TABLE `eaccount`
  MODIFY `eaccount` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ebill`
--
ALTER TABLE `ebill`
  MODIFY `ebill` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `econnection`
--
ALTER TABLE `econnection`
  MODIFY `econnection` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `elink`
--
ALTER TABLE `elink`
  MODIFY `elink` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emeter`
--
ALTER TABLE `emeter`
  MODIFY `emeter` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ereading`
--
ALTER TABLE `ereading`
  MODIFY `ereading` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `landlord`
--
ALTER TABLE `landlord`
  MODIFY `landlord` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `msg`
--
ALTER TABLE `msg`
  MODIFY `msg` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `picture`
--
ALTER TABLE `picture`
  MODIFY `picture` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property`
--
ALTER TABLE `property`
  MODIFY `property` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `room` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `service` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `subscription` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tenant`
--
ALTER TABLE `tenant`
  MODIFY `tenant` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `wconnection`
--
ALTER TABLE `wconnection`
  MODIFY `wconnection` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wmeter`
--
ALTER TABLE `wmeter`
  MODIFY `wmeter` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `agreement`
--
ALTER TABLE `agreement`
  ADD CONSTRAINT `agreement_ibfk_1` FOREIGN KEY (`room`) REFERENCES `room` (`room`),
  ADD CONSTRAINT `agreement_ibfk_2` FOREIGN KEY (`tenant`) REFERENCES `tenant` (`tenant`);

--
-- Constraints for table `ebill`
--
ALTER TABLE `ebill`
  ADD CONSTRAINT `ebill_ibfk_1` FOREIGN KEY (`msg`) REFERENCES `msg` (`msg`),
  ADD CONSTRAINT `ebill_ibfk_2` FOREIGN KEY (`eaccount`) REFERENCES `eaccount` (`eaccount`);

--
-- Constraints for table `econnection`
--
ALTER TABLE `econnection`
  ADD CONSTRAINT `econnection_ibfk_1` FOREIGN KEY (`room`) REFERENCES `room` (`room`),
  ADD CONSTRAINT `econnection_ibfk_2` FOREIGN KEY (`emeter`) REFERENCES `emeter` (`emeter`);

--
-- Constraints for table `elink`
--
ALTER TABLE `elink`
  ADD CONSTRAINT `elink_ibfk_1` FOREIGN KEY (`emeter`) REFERENCES `emeter` (`emeter`),
  ADD CONSTRAINT `elink_ibfk_2` FOREIGN KEY (`eaccount`) REFERENCES `eaccount` (`eaccount`);

--
-- Constraints for table `ereading`
--
ALTER TABLE `ereading`
  ADD CONSTRAINT `ereading_ibfk_1` FOREIGN KEY (`emeter`) REFERENCES `emeter` (`emeter`);

--
-- Constraints for table `landlord`
--
ALTER TABLE `landlord`
  ADD CONSTRAINT `landlord_user` FOREIGN KEY (`user`) REFERENCES `mutall_users`.`user` (`user`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `picture`
--
ALTER TABLE `picture`
  ADD CONSTRAINT `picture_ibfk_1` FOREIGN KEY (`room`) REFERENCES `room` (`room`);

--
-- Constraints for table `property`
--
ALTER TABLE `property`
  ADD CONSTRAINT `busi_prop` FOREIGN KEY (`business`) REFERENCES `mutall_users`.`business` (`business`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `property_ibfk_1` FOREIGN KEY (`landlord`) REFERENCES `landlord` (`landlord`);

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`property`) REFERENCES `property` (`property`);

--
-- Constraints for table `subscription`
--
ALTER TABLE `subscription`
  ADD CONSTRAINT `subscription_ibfk_2` FOREIGN KEY (`service`) REFERENCES `service` (`service`),
  ADD CONSTRAINT `subscription_ibfk_3` FOREIGN KEY (`agreement`) REFERENCES `agreement` (`agreement`);

--
-- Constraints for table `tenant`
--
ALTER TABLE `tenant`
  ADD CONSTRAINT `user_ten` FOREIGN KEY (`user`) REFERENCES `mutall_users`.`user` (`user`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `wconnection`
--
ALTER TABLE `wconnection`
  ADD CONSTRAINT `wconnection_ibfk_1` FOREIGN KEY (`room`) REFERENCES `room` (`room`),
  ADD CONSTRAINT `wconnection_ibfk_2` FOREIGN KEY (`wmeter`) REFERENCES `wmeter` (`wmeter`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
