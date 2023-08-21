import { validationResult } from "express-validator";
import { hashPassword } from "./auth.js";
import fetch from "node-fetch";
import axios from "axios";

export const handleInputErrors = (err, req, res, next) => {
  const errors = validationResult(req);
  if (err) {
    res.status(400);
    res.json({ error: err.message });
  } else {
    next();
  }
};

export const attachData = (data) => {
  return (req, res, next) => {
    req.data = data;
    next();
  };
};

export const hashEveryPassword = async (data) => {
  for (const userId in data.users) {
    const user = data.users[userId];
    user.password = await hashPassword(user.password);
  }
  return data;
};

export const initOwnerImg = async (data) => {
  for (const userId in data.users) {
    const img = await fetch("https://thispersondoesnotexist.com/image");
    const user = data.users[userId];
    user.owner_img = img.url;
  }
  return data;
};

export const initDogImg = async (data) => {
  const response = await axios.get("https://dog.ceo/api/breeds/image/random");
  const img = response.data.message;
  for (const userId in data.users) {
    const user = data.users[userId];
    user.dog_img = img;
  }
  return data;
};
