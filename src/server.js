import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router.js";
import { protect } from "./modules/auth.js";
import { createUser, getAllUsers, loginUser } from "./handlers/user.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/hello", (req, res) => {
  console.log(req);
  res.status(200);
  res.json({ message: "Hello World!" });
  res.send();
});

app.use("/api", protect, router);
app.post("/signup", createUser);
app.post("/login", loginUser);

export default app;
