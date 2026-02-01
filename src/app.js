import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import userRoute from "./routes/user.route.js"
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user",userRoute)


app.use(errorHandler)
export { app };
