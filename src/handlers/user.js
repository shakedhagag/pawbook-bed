// import e from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../db.js";
import { hashPassword } from "../modules/auth.js";
import { createToken, comparePassword } from "../modules/auth.js";
import { saveData } from "./data.js";
import e from "express";

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export const getUserByIdRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id, req.data);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function getUserById(id, data) {
  try {
    for (const userId in data.users) {
      if (userId === id) {
        return data.users[userId];
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const saveUser = async (data, email, password, name) => {
  try {
    const hashedPassword = await hashPassword(password);
    const id = uuidv4();
    data.users[id] = {
      email: email,
      name: name,
      password: hashedPassword,
    };

    return id;
  } catch (error) {
    console.log(error);
  }
};

export const getUserId = (email, data) => {
  for (const userId in data.users) {
    if (data.users[userId].email === email) {
      return userId;
    }
  }
  return null;
};

export const findUserByEmail = (email, data) => {
  try {
    for (const userId in data.users) {
      if (data.users[userId].email === email) {
        return { user: data.users[userId], id: userId };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (req, res) => {
  try {
    const { data } = req;
    const { email, password, name } = req.body;
    const existingUser = findUserByEmail(email, data)?.user;
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    let id = await saveUser(data, email, password, name);
    const newUser = data.users[id];
    const token = createToken(newUser);
    saveData(req.data);
    res.status(201).json({ id: id, user: newUser, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { data } = req;
    const { email, password } = req.body;
    const user = await findUserByEmail(email, data).user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = createToken(user);
    res.cookie("token", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true, // Add this when we have HTTPS
    });
    res.header("withCredentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.status(200).json({ user: user, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    next();
    return res.status(200).json(user);
  } catch (error) {
    next(error);
    return res.status(500).json({ error: error.message });
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const { data } = req;
    const userData = findUserByEmail(req.user.email, data);
    const currentUser = userData.user;
    const currentUserId = userData.id;
    res.status(200).json({
      success: true,
      message: "Token is valid",
      user: currentUser,
      id: currentUserId,
    });
    next();
  } catch (error) {
    next(error);
  }
};

export const getUserImgs = async (req, res) => {
  try {
    const { data } = req;
    const id = req._parsedUrl.query;
    const user = await getUserById(id, data);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const ownerImg = user.owner_img;
    const dogImg = user.dog_img;

    res.status(200).json({ ownerImg, dogImg });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
