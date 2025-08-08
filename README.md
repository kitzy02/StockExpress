# 📊 Stock Portfolio Management Website

This is a simple and interactive stock portfolio management web application. It allows users to buy and sell stocks, view their holdings, track transactions, add stocks to a watchlist, and ask financial questions through an AI chatbot named FINN.

The project was built using **HTML, CSS, and JavaScript** for the frontend, **Node.js and Express** for the backend, and **MySQL** for the database.

---

## 🔧 Features

- Users can **buy and sell stocks** based on simulated prices.
- Stock prices are **randomly generated and updated every minute** using JavaScript.
- All purchased stocks are recorded in the **holdings table**.
- Every buy or sell action is saved in the **transactions table**, allowing users to view their full trade history.
- Users can add specific stocks to a **watchlist** if they want to monitor them without buying.
- An integrated AI chatbot named **FINN** helps users by answering basic financial questions like “What is a stock?” or “What is P/E ratio?”
- The user interface is designed to be **simple, clean, and easy to navigate**.

---

## 🧱 Project Architecture

The backend of the project follows the **MVC (Model-View-Controller)** architecture:
- **Routes** handle incoming API requests.
- **Controllers** manage the business logic.
- **Models** interact with the MySQL database.

The frontend communicates with the backend using **RESTful APIs** to perform all database operations.

---

## 🗄️ Database Structure

The project uses five main tables:
1. `users` – Stores user information
2. `stocks` – Contains stock names and current prices
3. `holdings` – Tracks which stocks a user owns
4. `transactions` – Logs every trade made by a user
5. `watchlist` – Stores stocks users want to monitor
---

## 🤖 About FINN

FINN is a built-in AI chatbot that helps users by answering simple finance-related questions. This makes the platform beginner-friendly and educational.
---

## ⚙️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js, Express.js  
- **Database:** MySQL

---

