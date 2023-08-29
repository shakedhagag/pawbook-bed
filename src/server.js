import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router.js";
import { protect } from "./modules/auth.js";
import cookieParser from "cookie-parser";
import {
  createUser,
  getUserByIdRoute,
  getUserImgs,
  loginUser,
  verifyToken,
} from "./handlers/user.js";
import { loadData, saveData } from "./handlers/data.js";
import {
  attachData,
  hashEveryPassword,
  initOwnerImg,
  initDogImg,
} from "./modules/middleware.js";
import { createPost, getAllPosts, deletePost } from "./handlers/post.js";
import { getAllFriends, unfollowFriend } from "./handlers/friends.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
export let data = await loadData();
// data = await hashEveryPassword(data);
// data = await initOwnerImg(data);
// data = await initDogImg(data);
// saveData(data);
app.get("/init", (req, res) => {
  res.status(200);
  res.json(data);
  res.send();
});

app.get("/hello", (req, res) => {
  res.status(200);
  res.json({ message: "Hello World!" });
  res.send();
});
app.use("/api", protect, router);
app.post("/signup", attachData(data), createUser);
app.post("/login", attachData(data), loginUser);
app.post("/create-post", attachData(data), createPost);
app.get("/posts", attachData(data), getAllPosts);
app.get("/user-images", attachData(data), getUserImgs);
app.get("/verify-token", protect, attachData(data), verifyToken);
app.get("/user/:id", attachData(data), getUserByIdRoute);
app.post("/create-post", attachData(data), createPost);
app.post("/delete-post", attachData(data), deletePost);
app.get("/friends", attachData(data), getAllFriends);
app.delete("/friends", attachData(data), unfollowFriend);

export default app;
