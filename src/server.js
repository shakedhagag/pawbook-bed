import express from "express";
import cors from "cors";
import morgan from "morgan";
import { protect } from "./modules/auth.js";
import cookieParser from "cookie-parser";
import {
  getEnabledPages,
  updateEnabledPages,
  getAllUsersActivity,
} from "./handlers/admin.js";
import {
  createUser,
  getUserByIdRoute,
  getUserImgs,
  loginUser,
  verifyToken,
  getAllUsers,
  removeUser,
  logoutUser,
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
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { log } from "console";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
app.use(express.static(path.join(__dirname, "public")));
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
app.delete("/admin/remove-user", attachData(data), removeUser);
app.post("/login", attachData(data), loginUser);
app.post("/logout", attachData(data), logoutUser);
app.get("/posts", attachData(data), getAllPosts);
app.post("/create-post", attachData(data), createPost);
app.post("/delete-post", attachData(data), deletePost);
app.get("/user-images", attachData(data), getUserImgs);
app.get("/verify-token", protect, attachData(data), verifyToken);
app.get("/user/:id", attachData(data), getUserByIdRoute);
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
app.get("/admin/login-activity", attachData(data), getAllUsersActivity);
app.get("/readme.html", (req, res) => {
  res.sendFile(path.join(path.dirname, "public", "README.html"));
});

export default app;
