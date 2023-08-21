import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { saveData } from "./data.js";
import { getUserId } from "./user.js";

export const createPost = async (req, res) => {
  const { data } = req;
  const { email, text, image, feeling } = req.body;
  const users_id = getUserId(email, data);
  if (!data.users[users_id]) {
    return res.status(400).json({ error: "User not found." });
  }
  const timestamp = Date.now();
  const newPost = {
    users_id,
    text,
    image,
    feeling,
    timestamp,
  };
  const postID = uuidv4();
  data.posts[postID] = newPost;

  saveData(req.data);
  res.status(201).json({ message: "Post created successfully", postID });
};

export const getAllPosts = (req, res) => {
  const { data } = req;
  const posts = data.posts;
  res.status(200).json({ posts });
};

export const deletePost = (req, res) => {
  const { data } = req;
  const { id } = req.body;
  const posts = data.posts;
  if (!posts[id]) {
    return res.status(400).json({ error: "Post not found." });
  }
  delete posts[id];
  saveData(data);
  res.status(200).json({ message: "Post deleted successfully" });
};
