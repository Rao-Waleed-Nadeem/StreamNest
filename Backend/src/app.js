import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import mongoSanitize from "exspress-mongo-sanitize";
// import xss from "xss-clean";
// import morgan from "morgan";
// import path from "path";
import compression from "compression";
// import rateLimit from "express-rate-limit";
// import dotenv from "dotenv";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://stream-nest-eight.vercel.app"],
    credentials: true,
  })
);

app.enableCors({
  origin: "https://stream-nest-eight.vercel.app", // Allow frontend origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true, // Allow credentials if needed
});

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(cookieParser());
import authRouter from "./routes/auth.route.js";

import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import likeRouter from "./routes/like.route.js";
import commentRouter from "./routes/comment.route.js";
import playlistRouter from "./routes/playlist.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import subscriptionRouter from "./routes/subscription.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/auth/", authRouter);

// app.all("*", (req, res, next) => {
//   next(new apiError(`Can't find ${req.originalUrl} on the server`, 404));
// });

export default app;
