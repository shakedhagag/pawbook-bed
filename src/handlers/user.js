import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../modules/auth.js";
import { createToken, comparePassword } from "../modules/auth.js";
import { saveData } from "./data.js";

export const getAllUsers = async (req, res) => {
  try {
    const { data } = req;
    const users = data.users;
    const ReplaceKeys = (input) => {
      return Object.entries(input).reduce((acc, [id, value]) => {
        const { name, dog_img } = value;
        acc[name] = { id, dog_img };
        return acc;
      }, {});
    };
    const newUsers = ReplaceKeys(users);
    res.status(200).json(newUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    data.profiles[id] = {};
    data.posts[id] = [];
    const now = new Date();
    data.admin.loginActivity[id] = {
      loginTime: now,
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

    saveData(req.data);
    // res.cookie("token", token);
    loginUser(req, res);
    // res.status(201).json({ id: id, user: newUser, token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { data } = req;
    const { email, password } = req.body;
    let user = await findUserByEmail(email, data);
    const id = user.id;
    user = user.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const loginActivity = data.admin.loginActivity;
    if (!loginActivity[id]) {
      loginActivity[id] = {};
    }
    loginActivity[id].loginTime = new Date();
    loginActivity[id].logoutTime = "";

    const token = createToken(user);

    res.cookie("token", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true, // Add this when we have HTTPS
    });
    res.header("withCredentials", true);
    res.status(200).json({ user: user, token: token, id: id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { data } = req;
    const { id } = req.body;
    const loginActivity = data.admin.loginActivity;
    if (!loginActivity[id]) {
      loginActivity[id] = {};
    }
    loginActivity[id].logoutTime = new Date();
    saveData(data);
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
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
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const currentUser = userData.user;
    const currentUserId = userData.id;
    res.status(200).json({
      success: true,
      message: "Token is valid",
      user: currentUser,
      id: currentUserId,
      isAdmin: currentUser?.isAdmin,
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

export const removeUser = async (req, res) => {
  try {
    const { data } = req;
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "User not found." });
    }
    delete data.users[id];
    delete data.profiles[id];
    delete data.posts[id];
    const users = data.users;
    for (const userId in users) {
      const user = users[userId];
      if (user.friends.includes(id)) {
        const index = user.friends.indexOf(id);
        user.friends.splice(index, 1);
      }
    }

    saveData(data);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
