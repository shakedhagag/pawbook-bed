import { Router } from "express";
import { handleInputErrors } from "./modules/middleware.js";

import {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  getUser,
  verifyToken,
} from "./handlers/user.js";

const router = Router();

/**
 * @route all routes for the user
 */
router.get("/", getAllUsers);
router.post("/register", handleInputErrors, createUser);
router.post("/login", handleInputErrors, loginUser);
router.get("/current_user", getUser);
router.get("/verify-token", verifyToken);
// router.get("/:id", getUserById);

export default router;
