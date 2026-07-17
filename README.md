# BeeMagz CMS

A modern, lightweight, dynamic digital magazine and Content Management System (CMS) built with a Node.js/Express backend, PostgreSQL (via Neon), Cloudinary, and a responsive React/Tailwind frontend.

> ⚠️ **Important Note:** This system includes an automatic cleanup pipeline. Deleting or updating stories automatically triggers a backend script to purge deleted or orphaned media assets from your Cloudinary storage.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js, PostgreSQL (Neon), JWT, bcrypt, Multer, Cloudinary SDK
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router Dom, Axios

---

## 📂 Database Schema

```sql
-- 1. Users Table (Admin accounts)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    url TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Stories Table (Main Content Engine)
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    url TEXT NOT NULL,
    published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_date DATE,
    admin_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    video_urls TEXT[] DEFAULT '{}',
    music_urls TEXT[] DEFAULT '{}',
    image_urls TEXT[] DEFAULT '{}'
);
