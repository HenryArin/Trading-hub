# 🎴 Whosewho - One Piece Card Trading Hub

Whosewho Version: 0.1.0 is a **local trading hub** for One Piece Card Game players.  
Users can **post the cards they need**, **comment**, and **engage with their community**.

## 🔥 Features
- ✅ **User Authentication** (Signup, Login, Logout)
- ✅ **Create, Edit, and Delete Posts**
- ✅ **Comment on Posts**
- ✅ **Admin Panel** (Manage Users, Ban, Promote, Delete)
- ✅ **Notifications** for Post Comments
- ✅ **JWT-based Authentication & Authorization**

## 📂 Project Structure
Whosewho/ 
├── database/ # Database migrations & backups 
├── trading_hub/ # Backend (Ruby on Rails API) ├── trading-hub-frontend/ # Frontend (React + TypeScript)




## 🛠️ Technologies Used
**Backend:**
- Ruby on Rails (API Mode)
- MySQL / MariaDB
- JWT Authentication

**Frontend:**
- React (Vite + TypeScript)
- Tailwind CSS
- Axios (API Requests)

## 🚀 How to Run the Project Locally
### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/yourusername/Whosewho.git
cd Whosewho

2️⃣ Setup Backend (Rails)
cd trading_hub
bundle install
rails db:create db:migrate
rails server
📌 Runs at: http://localhost:3000

3️⃣ Setup Frontend (React)
cd ../trading-hub-frontend
npm install
npm run dev
📌 Runs at: http://localhost:5173

4️⃣ Environment Variables
Create a .env file in trading_hub/ and add:

JWT_SECRET_KEY=your_secret_key_here 

Create a .env file inside trading-hub-frontend and add:

VITE_API_BASE_URL=http://localhost:3000

🔹 For Production: Change this to your live backend URL, e.g.,
VITE_API_BASE_URL=https://your-production-api.com
```


🚀 Future Features
We're actively working on improving Whosewho. Here are upcoming features:

🔔 Notification System – Add a bell icon that shows unread notifications.
🛠 Profile System – Let users customize their profile with avatars and bios.
🔎 Search & Filters – Improve search by filtering by card type, user, etc.
📊 Stats & Insights – Track trade trends, most requested cards, etc.
📱 Mobile Optimization – Make the UI better on mobile devices.
🌎 Location-Based Radius Search (Upcoming)
Users will be able to filter trade requests based on geographic radius.
Only see posts from nearby players.
🖼 Card Art & UI Improvements (Upcoming)
Posts will include official card art from the One Piece TCG database.
The UI will be modernized with a cleaner design.

📜 License

This project is licensed under the MIT License.

👥 Developers & Contributors
Henry Arinaga (Lead Developer)
Your Name Here (Open for contributions!)