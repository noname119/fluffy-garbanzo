CREATE DATABASE IF NOT EXISTS `rboxlo`;
USE `rboxlo`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL,
  `password_hash` text NOT NULL,
  `email_ciphertext` text NOT NULL,
  `email_blind_index` text NOT NULL,
  `joindate_timestamp` int(11) NOT NULL,
  `last_stipend_timestamp` int(11) NOT NULL,
  `last_ping` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `avatar` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sign_in_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `register_ip_blind_index` text NOT NULL,
  `2fa_secret` text NOT NULL,
  `email_verified` int(11) NOT NULL DEFAULT 0,
  `is_banned` int(11) NOT NULL DEFAULT 0,
  `current_ban_article` int(11) NOT NULL DEFAULT 0,
  `money` int(11) NOT NULL DEFAULT 25,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `attempts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `threshold` int(11) NOT NULL,
  `created_timestamp` int(11) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 1,
  `ip` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `invite_keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uses` int(11) NOT NULL,
  `max_uses` int(11) NOT NULL,
  `key` text NOT NULL,
  `creator_id` int(11) NOT NULL,
  `created_timestamp` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `long_term_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `selector` text NOT NULL,
  `validator_hash` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_timestamp` int(11) NOT NULL,
  `expires_timestamp` int(11) NOT NULL,
  `ip` text NOT NULL,
  `user_agent` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;