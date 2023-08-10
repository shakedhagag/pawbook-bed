import { Router } from "express";
import { handleInputErrors } from "./modules/middleware.js";

import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  getUser,
} from "./handlers/user.js";

const router = Router();

/**
 * @route all routes for the user
 */
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/register", handleInputErrors, createUser);
router.post("/login", handleInputErrors, loginUser);
router.get("/current_user", getUser);

export default router;
