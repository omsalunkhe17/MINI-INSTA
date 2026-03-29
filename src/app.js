const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// ✅ import routers
const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes');
const userRouter = require('./routes/user.routes');

const app = express();

// ✅ middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS (important for local + deployed)
app.use(cors({
  credentials: true,
  origin: true
}));

// ✅ serve frontend (React build)
app.use(express.static(path.join(__dirname, '../public')));

// ✅ API routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

// ✅ fallback for React (SPA routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;