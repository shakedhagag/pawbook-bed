import prisma from "../db.js";
import { hashPassword } from "../modules/auth.js";
import { createToken, comparePassword } from "../modules/auth.js";

export async function getAllUsers() {
  return await prisma.user.findMany();
}

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id: id },
  });
}

export const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, name } = req.body;
    const hashedPassword = await hashPassword(password);

    // Check if user already exists
    console.log(name, email, hashedPassword);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        dogs: req.body.dogs,
      },
    });
    //Create token
    const token = createToken(newUser);
    res.status(201).json({ user: newUser, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const match = await comparePassword(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = createToken(user);
    res.cookie("token", token, {
      maxAge: 86400 * 10,
      httpOnly: true,
      // secure: true, // Add this when we have HTTPS
    });
    res.status(200).json({ user: user, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
