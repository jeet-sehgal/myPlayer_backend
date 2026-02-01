import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, "the username is required"],
			lowercase: true,
			trim: true,
			unique: [true, "the username is already used"],
			index: true,
		},
		email: {
			type: String,
			required: [true, "the email is required"],
			lowercase: true,
			trim: true,
			unique: [true, "the email is already used"],
		},
		fullName: {
			type: String,
			required: [true, "the full name is required"],
			trim: true,
			index: true,
		},
		avatar: {
			type: String,
		},
		coverImg: {
			type: String,
		},
		watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
		refreshToken: {
			type: String,
		},
		password: {
			type: String,
			required: [true, "the password is required"],
            // select:false
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function () {
	if (!this.isModified("password"))return 
	this.password = await bcrypt.hash(this.password, 10);
	
});

userSchema.methods.validatePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			username: this.username,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

export const User = mongoose.model("User", userSchema);
