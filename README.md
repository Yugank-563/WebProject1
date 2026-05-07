# 🌍 WanderLust – Property Listing Web App

A full-stack web application built with the MERN stack that allows users to list, browse, review, and manage rental properties. Inspired by platforms like Airbnb, WanderLust includes features such as authentication, CRUD operations, image uploads, and cloud deployment.

🔗 [Live Demo](https://web-project-qkmu.onrender.com/listings)

---

## 🛠 Tech Stack

- **Frontend**: Bootstrap, EJS, FontAwesome
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: Passport.js (Local Strategy)
- **File Uploads**: Cloudinary
- **Deployment**: Render

---

## 🚀 Features

- 🏠 **Full CRUD**: Add, edit, and delete property listings.
- 🔒 **Secure Auth**: User registration, login, and session-based authentication.
- 📸 **Cloud Image Handling**: Seamless image uploads via Cloudinary.
- ❤️ **Personal Wishlist**: Save and manage your favorite listings with real-time feedback.
- 💬 **Interactive Reviews**: Add, view, and delete reviews with timestamps and ratings.
- 🔗 **SEO Friendly**: Human-readable slugs/URLs for listings instead of cryptic IDs.
- 🌐 **Modern UI**: Clean, responsive design optimized for all screen sizes.
- 🔍 **Search Filter**: Quickly find properties by title, location, or country.

---

## 💻 Local Installation

To run this project locally, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/ykushwaha0563/WebProject.git
cd WebProject
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
MONGO_URI=your_mongodb_connection_string
SECRET=your_session_secret_key
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 4. Seed the Database (Optional)
If you want to start with sample data:
```bash
node backend/init/index.js
```

### 5. Run the Application
```bash
npm start
```
The server will start on `http://localhost:3000`.

---

## 📸 Screenshots
![image](https://github.com/user-attachments/assets/6e893d69-d44a-4dda-88ea-3f0314697519)
