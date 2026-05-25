# AI-Powered OTT Discovery Platform

## Overview

This project is a full-stack AI-powered OTT discovery platform developed using React, Node.js, Express, SQLite, OMDb API, and TMDB API. The application allows users to search for movies, receive AI-based movie recommendations, manage favorites, watch trailers, and discover the OTT platforms where movies are available for streaming.

The platform focuses on delivering a modern cinematic user experience with smooth animations, dynamic movie cards, trending sections, and responsive UI design.

---

# Features

AI-based movie recommendations

Movie search with real-time results

Trending movie carousel

Movie detail modal with poster, plot, genre, cast, and ratings

Watch trailer functionality using YouTube

OTT platform availability using TMDB Watch Providers API

Favorites system with persistent backend storage

Hero movie banner

Loading animations and cinematic UI effects

Responsive frontend design

SQLite database integration for favorites management

TMDB integration for improved movie metadata and streaming provider support

---

# Technologies Used

Frontend

React.js

Vite

CSS3

Axios

Backend

Node.js

Express.js

SQLite

better-sqlite3

External APIs

OMDb API

TMDB API

---

# Project Structure

```plaintext
movie-recommendation-website/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── package.json
│
├── README.md
└── .gitignore
```

---

# Installation

## Clone the Repository

```bash
git clone https://github.com/Jyo-08/Movie-recommendation-website.git
```

## Navigate to Project Folder

```bash
cd movie-recommendation-website
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create a `.env` file inside the backend folder and add:

```env
OMDB_API_KEY=your_omdb_api_key
TMDB_API_KEY=your_tmdb_api_key
PORT=5050
```

## Start Backend Server

```bash
node server.js
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Start Frontend

```bash
npm run dev
```

---

# API Endpoints

## Movie Search

```plaintext
GET /movies/search?q=movie_name
```

## AI Recommendations

```plaintext
GET /movies/recommend?mood=keyword
```

## Movie Details

```plaintext
GET /movies/details/:id
```

## Favorites

```plaintext
POST /favorites
GET /favorites
DELETE /favorites/:id
```

## TMDB Search

```plaintext
GET /tmdb/search?q=movie_name
```

## OTT Watch Providers

```plaintext
GET /tmdb/watch/:id
```

---

# Future Improvements

Complete migration from OMDb to TMDB

Authentication and user accounts

Personalized recommendation engine

Advanced filtering and sorting

Dark and light theme switching

Mobile application version

Watchlist synchronization

Genre-based recommendation system

---

# Deployment

Frontend can be deployed using Vercel.

Backend can be deployed using Render.

---

# Author

Developed by Jyotish N

GitHub: [https://github.com/Jyo-08](https://github.com/Jyo-08)
