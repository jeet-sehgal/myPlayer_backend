import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";

const router = Router();
router
	.route("/register")
	.post(
		upload.fields([
			{ name: "avatar", maxCount: 1 },
			{ name: "coverImg", maxCount: 1 }]
		),
		registerUser
	);

router.route("/login").post(loginUser)

export default router;
