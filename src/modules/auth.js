import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

/**
 * createToken - Create a token for a client to sign in
 * @param client
 * @returns
 */
export const createToken = (client) => {
  console.log(client);
  const token = jwt.sign(
    {
      email: client.email,
      name: client.name,
      password: client.password,
      owner_img: client.owner_img,
      dog_img: client.dog_img,
    },
    process.env.JWT_SECRET
  );
  return token;
};

export const protect = (req, res, next) => {
  const cookieToken = req.cookies;

  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = bearer.split("Bearer ")[1].trim();
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    next(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
