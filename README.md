# 🍔 Food Reels – Full Stack Application

⚠️ Currently in Active Development
This project is under continuous improvement — new features, UI refinements, and backend optimizations are being added regularly.
💡 Suggestions, ideas, and contributions are highly appreciated!

# 🎯 Overview

Food Reels is a full-stack web app where users can explore, like, and save short food videos (“reels”), visit food partner stores, and authenticate securely.
Built with React (Vite) for the frontend and Node.js + Express + MongoDB for the backend.

# 🚀 Features  👤 User Features

Register and log in

Like and save food reels

Visit food partner stores

Authenticated actions via secure cookies

# 🧑‍🍳 Food Partner Features

Register and log in as a food partner

Upload and manage food items (video + details)

View user engagement

# 🖼️ Reel Feed

Infinite-scroll style feed

Autoplaying videos

Protected “like/save/visit” if not logged in

## 🧠 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React.js (Vite), Axios, React Router DOM |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose) |
| **Cloud & Storage** | ImageKit, Vercel |
| **Authentication** | JWT, Cookies |
| **Utilities** | Multer, CORS |


# 🔒 Authentication Flow

JWT is created and stored in an HTTP-only cookie at login.

Frontend calls /api/auth/check-auth on load.

Unauthenticated users are redirected to /user/login.

Authenticated users can like, save, and visit stores seamlessly.\


# 🧩 Core Highlights

Secure cross-origin setup with CORS + cookies

Frontend restriction logic for guests

Modular backend structure (controllers, routes, middlewares)

Smooth ImageKit upload integration

Scalable for production deployment

## 🚧 Development Status

| Status | Description |
|---------|--------------|
| 🟡 **In Progress** | This project is actively being developed. Features, UI, and performance are continuously being improved. |
| 💡 **Suggestions Welcome** | We appreciate all ideas, feedback, or feature requests — feel free to open an issue or pull request! |
| 🔄 **Frequent Updates** | Expect new commits, bug fixes, and enhancements as the project evolves. |


	
# 🤝 Contributing

We’d ❤️ your input!
If you have an idea, spot a bug, or want to enhance the project:

Fork the repo

Create a feature branch

Commit and push your changes

Submit a pull request

💬 All constructive feedback and creative feature suggestions are welcome!


# 📜 License

Licensed under the MIT License — you’re free to use, modify, and share.


# 👨‍💻 Author

Mifzal Najid
mifzalnajid@gmail.com
