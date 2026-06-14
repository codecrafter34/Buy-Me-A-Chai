# Buy Me a Chai ☕

A simple platform where creators can share their work and supporters can encourage them by buying them a "chai" .  
## 🚀 Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes (Node.js environment)
- **Database:** MongoDB (Mongoose)
- **Payments:** Razorpay Integration
- **Auth:** NextAuth.js (Session & JWT Auth)
- **Media Storage:** Cloudinary (For Images & Videos)
- **Deployment:** Vercel (Recommended for Next.js)

---

## 📌 Features
- 🔑 Secure authentication (Login/Signup) with separate 'User' and 'Creator' roles
- 🎨 Responsive & compact UI built with Tailwind CSS (Netflix-style horizontal scrolling rows)
- 💳 Razorpay integration for general donations (support creators with chai)
- 📊 Creator Dashboard to track donations, edit profile, and manage uploads
- 🎥 Locked Premium Videos: Creators can upload exclusive locked videos with custom prices
- 💰 Pay-to-Unlock System: Fans can pay a specific amount securely via Razorpay to unlock premium video content
- ☁️ Cloudinary Media Upload: Securely upload profile pictures, covers, and large video files
- 🔒 Video Previews: Logged-out users or non-paying fans only see a locked thumbnail/preview of the video
- 🔄 Smart Routing & Redirection: Users and creators are intelligently redirected to their respective pages after login/signup
- 👁️ Show/Hide Password Toggle: Easy password viewing option during login and signup

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
### 📁 Folder Structure

```text
get-me-a-chai
│
├── 📁 actions
│   └── useractions.js          -> Profile update, role change, video delete actions
│
├── 📁 app
│   ├── 📁 [username]          -> Creator public profile page
│   ├── 📁 api                 -> Auth, Razorpay, Upload, Video APIs
│   ├── 📁 dashboard           -> Creator dashboard
│   ├── 📁 explore             -> Explore creators page
│   ├── 📁 login               -> Login & Signup page
│   ├── globals.css            -> Global Tailwind styles
│   ├── layout.js              -> Main layout (Navbar + Footer)
│   └── page.js                -> Homepage
│
├── 📁 components
│   ├── Dashboard.js           -> Dashboard UI
│   ├── PaymentPage.js         -> Creator page & payment form
│   ├── Navbar.js              -> Navigation bar
│   ├── Footer.js              -> Footer
│   └── SessionWrapper.js      -> NextAuth provider wrapper
│
├── 📁 db
│   └── connectDb.js           -> MongoDB connection
│
├── 📁 models
│   ├── User.js                -> User schema
│   ├── Payment.js             -> Donation records
│   └── Video.js               -> Video schema
│
├── 📁 public
│   └── Images, GIFs, Icons
│
├── .env.local                 -> Environment variables
├── next.config.mjs            -> Next.js configuration
├── package.json               -> Dependencies & scripts
└── tailwind.config.js         -> Tailwind configuration
```

## 📸 Screenshots  

### 🏠 Homepage 
<img width="4694" height="2570" alt="localhost_3000_" src="https://github.com/user-attachments/assets/41f92ff7-7c42-4e4d-a972-2114f519dad5" />




### $ Creator Page  
 <img width="941" height="485" alt="image" src="https://github.com/user-attachments/assets/414d9224-3a1b-4570-a2d3-ad98c926a69d" />
<img width="935" height="449" alt="image" src="https://github.com/user-attachments/assets/aa3e7a55-198a-4e97-a8b3-7d0a253e2172" />
<img width="941" height="281" alt="image" src="https://github.com/user-attachments/assets/361dbc24-da60-4354-8329-c4acb5b932b3" />




