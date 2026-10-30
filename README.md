# Task 34 – Mongoose Schema Reference (Express + React)

A full-stack application demonstrating a MongoDB/Mongoose reference between `User` and `Post` documents, with a React frontend.

## Features

- Express.js backend connected to MongoDB using Mongoose.
- `User` schema: `name`, `email`.
- `Post` schema: `title`, `content`, and `user` reference to the User model.
- `POST /api/users` creates a user.
- `POST /api/posts` creates a post linked to an existing user.
- `GET /api/posts` retrieves posts and populates the related user information.
- `GET /api/users` retrieves users for the post form dropdown.
- React forms to create users and posts.
- React list showing each post with the populated author's name and email.

## Project structure

```text
Task34_Mongoose_Reference/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── postRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   ├── index.html
│   └── package.json
└── README.md
```

## Requirements

- Node.js and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## 1. Configure MongoDB

Open `backend/.env.example`, copy its contents into a new file named `.env` in the same `backend` folder, and set your MongoDB connection string.

For local MongoDB:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/task34_schema_reference
```

For MongoDB Atlas, replace the value with your Atlas connection string.

## 2. Start the backend

Open a terminal in the `backend` folder:

```bash
npm install
```

Create `backend/.env` from `.env.example`, then run:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

## 3. Start the React frontend

Open a second terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## 4. Test the flow

1. Add a user using the **Create User** form.
2. Select that user in the **Create Post** form.
3. Add a post.
4. The post appears in **Posts with Author Details** with the related user's name and email.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend status |
| POST | `/api/users` | Create a user |
| GET | `/api/users` | List users |
| POST | `/api/posts` | Create a post linked to a user |
| GET | `/api/posts` | List posts with populated user details |

Example create-post body:

```json
{
  "title": "My first post",
  "content": "This post is linked to a user.",
  "userId": "MongoDB_USER_DOCUMENT_ID"
}
```

## Important

- The frontend and backend are separate apps, so run them in two terminals.
- MongoDB must be running and `MONGO_URI` must be valid before the backend can connect.
- Never upload your real `.env` file or MongoDB password to GitHub.
