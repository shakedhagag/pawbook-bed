import express from "express";
import cors from "cors";
import morgan from "morgan";
import { protect } from "./modules/auth.js";
import cookieParser from "cookie-parser";
import { getEnabledPages, updateEnabledPages } from "./handlers/admin.js";
import {
  createUser,
  getUserByIdRoute,
  getUserImgs,
  loginUser,
  verifyToken,
  getAllUsers,
} from "./handlers/user.js";
import { loadData, saveData } from "./handlers/data.js";
import { attachData } from "./modules/middleware.js";
import { createPost, getAllPosts, deletePost } from "./handlers/post.js";
import {
  getAllFriends,
  unfollowFriend,
  followFriend,
} from "./handlers/friends.js";
import {
  editProfileDesc,
  getProfileDesc,
  uploadDogImg,
  getDogImg,
  editProfileTitle,
} from "./handlers/profile.js";
import multer from "multer";
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// app.use("/api", protect, router);
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
app.post("/friends", attachData(data), followFriend);
app.get("/all-users", attachData(data), getAllUsers);
app.put("/profile", attachData(data), editProfileDesc);
app.post("/profile", attachData(data), editProfileTitle);
app.get("/profile", attachData(data), getProfileDesc);
app.post("/upload", attachData(data), upload.single("image"), uploadDogImg);
app.get("/uploads/:image/:id", attachData(data), getDogImg);
app.get("/admin/pages", attachData(data), getEnabledPages);
app.put("/admin/pages", attachData(data), updateEnabledPages);

export default app;
