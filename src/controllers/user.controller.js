import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (user) => {
	try {
		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();

		return { accessToken, refreshToken };
	} catch (err) {
		throw new ApiError(500, "Error while generating the tokens");
	}
};

const registerUser = asyncHandler(async (req, res) => {
	const requiredFiled = ["username", "fullName", "email", "password"];

	// checking the field should be filled with data
	const emptyFields = requiredFiled.filter(
		(field) => !req.body[field] || req.body[field].trim() === ""
	);
	if (emptyFields.length > 0) {
		throw new ApiError(
			400,
			`${emptyFields.join(", ")} ${emptyFields.length > 1 ? "fields are" : "field is"} required`
		);
	}

	//trim the data
	Object.keys(req.body).forEach((key) => {
		if (typeof req.body[key] === "string") {
			req.body[key] = req.body[key].trim();
		}
	});

	// derefer the request body
	const { email, username, fullName, password } = req.body;

	// validate the email and the username of the user
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		throw new ApiError(422, "Invalid email format");
	}
	if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
		throw new ApiError(
			422,
			"Username must be 3–20 characters and contain only letters, numbers, or underscore"
		);
	}

	// check the username already exist or not
	const existingUser = await User.findOne({
		$or: [{ email }, { username }],
	});
	if (existingUser) {
		throw new ApiError(409, "username or email already exist ");
	}

	// fetch the files from multer
	const avatarFile = req.files.avatar ? req.files?.avatar[0] : "";
	const coverImgFile = req.files.coverImg ? req.files?.coverImg[0] : "";
	if (!avatarFile) {
		throw new ApiError(400, "the avatar image is required");
	}

	// create a user and get the _id for uploading in the cloudinary with unique id to overwrite
	const user = await User.create({
		fullName,
		password,
		username,
		email,
	});

	const uploadedAvatar = await uploadOnCloudinary(
		avatarFile.path,
		avatarFile.fieldname,
		user._id
	);
	const uploadedCoverImg = coverImgFile
		? await uploadOnCloudinary(
				coverImgFile.path,
				coverImgFile.fieldname,
				user._id
			)
		: "";

	user.avatar = uploadedAvatar.url;
	user.coverImg = uploadedCoverImg.url;

	await user.save();

	if (!user) {
		throw new ApiError(500, "internal server error while creating the user");
	}

	res
		.status(200)
		.json(new ApiResponse(user, "user created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, username, password } = req.body;

	if (!(email || username)) {
		throw new ApiError(400, "the username or email is required");
	}
	if (!password) {
		throw new ApiError(400, "the password is required");
	}

	const user = await User.findOne({ $or: [{ username }, { email }] });

	if (!user) {
		throw new ApiError(404, "User not found ");
	}

	const isPasswordValid = await user.validatePassword(password);

	if (!isPasswordValid) {
		throw new ApiError(401, "invalid user credentials");
	}

	const { accessToken, refreshToken } =await generateAccessAndRefreshToken(user);
	user.refreshToken = refreshToken;

	await user.save();

    const options={
        secure:true,
        httpOnly:true
    }

	return res
		.status(200)
		.cookie("accessToken", accessToken,options)
		.cookie("refreshToken", refreshToken,options)
		.json(new ApiResponse(user, "user loged in successfully"));
});

export { registerUser, loginUser };
