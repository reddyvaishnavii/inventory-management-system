CREATE TABLE users (
    user_id          INT AUTO_INCREMENT PRIMARY KEY,

    -- Basic identity
    full_name        VARCHAR(150) NOT NULL,
    email            VARCHAR(150) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,

    -- Profile info
    phone            VARCHAR(20),
    designation      VARCHAR(100),
    city             VARCHAR(100),
    state            VARCHAR(100),
    profile_image_url VARCHAR(255),  -- image stored as file path or cloud URL
    
    -- System fields
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
