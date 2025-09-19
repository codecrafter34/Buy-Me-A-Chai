# Buy Me a Chai ☕

A simple platform where creators can share their work and supporters can encourage them by buying them a "chai" (similar to Buy Me a Coffee).  

## 🚀 Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Payments:** Razorpay Integration  
- **Auth:** NextAuth.js / Custom JWT Auth  
- **Deployment:** Vercel / Render / Railway  

---

## 📌 Features
- 🔑 Secure authentication (login/signup)  
- 🎨 Responsive UI built with Tailwind CSS  
- 💳 Razorpay integration for payments (support creators with chai)  
- 📊 Creator dashboard to track donations  
- 📨 Email/notification system (optional)  
- 🌍 Deployed on Vercel (frontend) & any Node host (backend)  

---

## ⚙️ Installation & Setup  

### 1. Clone the repo
       git clone https://github.com/your-username/buy-me-a-chai.git
       cd buy-me-a-chai
### 2. Install dependencies
       npm install
### 3. Setup environment variables
     Create a .env.local file in the root folder and add:
     MONGODB_URI=your-mongodb-connection
     RAZORPAY_KEY_ID=your-razorpay-key
     RAZORPAY_KEY_SECRET=your-razorpay-secret
     NEXTAUTH_SECRET=your-next-auth-secret
### 4. Run the project
      npm run dev
### 📂 Folder Structure

- /app            -> Next.js app pages
- /components     -> Navbar, Footer, Dashboard etc.
- /db            -> Database connection
- /models        -> MongoDB Models (User, Payment)
- /api           -> API Routes (auth, payments, dashboard)
- /public        -> Static assets (favicon, images)

## 📸 Screenshots  

### 🏠 Homepage  
<img width="1885" height="1002" alt="image" src="https://github.com/user-attachments/assets/3366aaff-9b47-4e05-8513-694d927b55de" />


### $ Payment Page  
 <img width="1893" height="1000" alt="image" src="https://github.com/user-attachments/assets/c6b03eaf-0cfc-4aef-ac63-3393ae6f8dde" />


