# Project Summary: Creator Monetization Platform (Patreon Clone)

## 1. Project Overview
- **Goal:** Build a simple, full-stack creator monetization platform (like Patreon) using Next.js, MongoDB, NextAuth, and Razorpay.
- **Approach:** Step-by-step, mentor-guided development with explanations and documentation for each feature.

## 2. Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, MongoDB (Mongoose)
- **Authentication:** NextAuth (Google, GitHub, Credentials)
- **Payments:** Razorpay (Pay-per-view system)
- **Media Storage:** Cloudinary (profile/cover images, videos)

## 3. Key Features & Implementation
### a. Role-Based Access
- Users can register/login as either a **creator** or a **user**.
- Role-based navigation and dashboard access.

### b. Authentication
- OAuth (Google, GitHub) and Credentials-based login/register.
- Secure password hashing (bcryptjs).
- Custom registration API for credentials.

### c. Profile & Cover Image Upload
- Creators can upload profile and cover images via dashboard.
- Images stored on Cloudinary.
- UI updates with cache-busting for new images.

### d. Video Upload & Pay-Per-View
- Creators can upload videos (stored on Cloudinary).
- Each video has a title, description, price, and preview.
- Users can pay to unlock full videos (Razorpay integration).
- Blurred preview for non-paying users.
- Server-side access control for video URLs.

### e. Payment Integration
- Razorpay used for secure payments.
- Order creation and payment verification APIs.
- Purchase records stored in MongoDB.

### f. Creator Search
- Landing page includes a search bar to find creators by name.
- Displays matching creators and links to their public pages.

### g. Dashboard & Public Pages
- **Dashboard:** For creators to manage profile, upload videos, and view stats.
- **Public Creator Page:** Shows creator info, videos (locked/unlocked), and payment options.

### h. Security & Access Control
- All sensitive actions require authentication.
- Video access is strictly controlled server-side (only paid users/owners get full URLs).
- Basic download prevention for videos.

## 4. Database Models
- **User:** username, email, passwordHash, role, profile/cover images, etc.
- **Video:** title, description, price, videoUrl, previewUrl, creatorId.
- **Purchase:** userId, videoId, paymentId.
- **Payment:** donation/payment records.

## 5. API Endpoints
- `/api/auth/[...nextauth]`: NextAuth config (OAuth + Credentials)
- `/api/auth/register`: Custom registration
- `/api/upload`: Image upload
- `/api/upload-video`: Video upload
- `/api/videos`: Save video metadata
- `/api/creator-videos`: Fetch videos with access control
- `/api/purchases`: Purchase records
- `/api/purchases/check`: Check if user purchased video
- `/api/video-order`: Razorpay order creation
- `/api/video-verify`: Razorpay payment verification

## 6. Common Interview Questions & Answers
- **Q: How is role-based access implemented?**
  - A: User model includes a `role` field; UI and API routes check this to gate access.
- **Q: How do you handle authentication?**
  - A: NextAuth for OAuth and credentials; passwords hashed with bcryptjs; session/token used for API auth.
- **Q: How are images and videos uploaded and stored?**
  - A: Uploaded via HTML5 file input and FormData; sent to Cloudinary using unsigned upload presets; URLs saved in DB.
- **Q: How does the pay-per-view system work?**
  - A: Each video has a price; users pay via Razorpay; after payment, purchase is recorded and user can access full video.
- **Q: How is video access secured?**
  - A: Server-side API checks if user is owner or has purchased before returning full video URL; otherwise, only preview is shown.
- **Q: How is the search feature implemented?**
  - A: Simple MongoDB text search on creator usernames; results shown on landing page.
- **Q: How do you prevent unauthorized downloads?**
  - A: Only paid users/owners get full video URLs; preview is blurred; no direct download links.
- **Q: How is error handling managed?**
  - A: UI toasts for errors, server-side checks for all sensitive actions, and debug logs for troubleshooting.

## 7. Lessons Learned
- Importance of server-side access control for paid content.
- Handling session/token in Next.js API routes.
- User-centric UI/UX for login, registration, and payment flows.
- Debugging authentication and payment integration issues.

## 8. Project Status
- **All major features implemented and tested.**
- **Documentation and summary ready for interview preparation.**

---

*For a full chat transcript or more details, paste the chat here or ask for specific code explanations.*
