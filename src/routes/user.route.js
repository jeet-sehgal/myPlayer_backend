import { Router } from "express";
import {
	changeCurrentPassword,
	getCurrentUser,
	loginUser,
	logoutUser,
	refreshJWT,
	registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/register").post(
	upload.fields([
		{ name: "avatar", maxCount: 1 },
		{ name: "coverImg", maxCount: 1 },
	]),
	registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/refresh-token").post(refreshJWT);
router.route("/change-password").post(authMiddleware, changeCurrentPassword);
router.route("/getCurrentUser").post(authMiddleware,getCurrentUser)

export default router;
