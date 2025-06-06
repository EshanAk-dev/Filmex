# 🎬 Filmex

**Filmex** is a sleek **React Native** mobile app built with **TypeScript**, allowing users to **browse**, **search**, and **save movies**. Powered by **TMDB API** for real-time movie data and **Appwrite** for authentication and storage, Filmex offers a personalized movie discovery experience — enhanced by a custom trending engine that tracks user interest.

---

## 🧰 Tech Stack

### Mobile App

* ⚛️ React Native
* 🟦 TypeScript
* 🔐 React Navigation
* 🌀 NativeWind (Tailwind CSS for React Native)
* 📦 Appwrite (Auth + Database)
* 🎬 TMDB API (movie metadata)

---

## ✨ Features

### 🎥 User Experience

* Browse trending, latest, and top-rated movies
* Search movies by title in real-time
* Genre filtering
* Infinite scroll for smooth browsing
* View detailed movie info (overview, ratings, release date, etc.)
* Save favorite movies to user account
* Fully mobile-responsive with modern UI styled using **NativeWind**

### 🔥 Trending Engine (Custom Feature)

* Tracks user search terms and associated movies in **Appwrite**
* Implements logic to:
  * Count repeated searches and store metadata (title, poster, rating, etc.)
  * Automatically identify and display **trending movies** based on most-searched terms

### 🔐 Auth & Storage

* User sign-up & login (via Appwrite)
* Secure user sessions
* Save and fetch favorites linked to user profiles
* Appwrite database integration for saved movie entries
