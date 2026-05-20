CREATE DATABASE secure_vault;

USE secure_vault;



CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role ENUM(
        'user',
        'manager',
        'admin'
    ) DEFAULT 'user',

    twofa_secret VARCHAR(255) NULL,

    created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE documents (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    filename VARCHAR(255) NOT NULL,

    encrypted_path TEXT NOT NULL,

    hash TEXT NOT NULL,

    signature LONGTEXT NOT NULL,

    file_size VARCHAR(50),

    uploaded_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);