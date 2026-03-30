# 📚 PeerShelf – Buy & Sell Books Platform

PeerShelf is a full-stack web application that allows users to **buy, sell, and discover books** within a community.
Built with modern technologies, it focuses on **simplicity, usability, and real-world functionality**.

Buy • Sell • Discover • Connect 📚
---

## 🌐 Live Demo

🔗 https://peer-shelf.vercel.app/

---

## 🌟 Features

* 📖 Browse books listed by other users
* 🛒 Buy books with real-time status updates
* ➕ Add your own books for sale
* ❤️ Wishlist functionality
* 🔐 User authentication (login/signup)
* 🖼️ Image upload for books
* ⚡ Fast and responsive UI

---

## 🧠 Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS

### Backend (BaaS)

* Supabase

  * Authentication
  * Database (PostgreSQL)
  * Storage

---

## 🏗️ Architecture

Frontend communicates directly with Supabase services:

```
React Frontend
     ↓
Supabase (Auth + DB + Storage)
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yrajha18/PeerShelf.git
cd peershelf
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in the root of your frontend:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

### 4. Run the project

```bash
npm run dev
```

---

## 🚀 Deployment

* Frontend deployed on **Vercel**
* Backend services powered by **Supabase**

---

## 💡 Key Learnings

* Built a real-world full-stack application using BaaS
* Implemented authentication and database operations
* Managed state and API integration in React
* Designed clean and responsive UI using Tailwind

---

## 🔥 Future Improvements

* Add custom backend (Node.js + Express)
* Implement secure transaction handling
* Recommendation system for books

---

## 🙌 Acknowledgements

* Supabase for backend services
* React ecosystem
* Tailwind CSS

---

## 👨‍💻 Author

**YASH RAJ**

* GitHub: https://github.com/yrajha18
* LinkedIn: https://www.linkedin.com/in/yashraj1k/

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
