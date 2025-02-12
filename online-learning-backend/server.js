import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import CourseRoute from "./routes/CourseRoute.js";
import EnrollmentRoute from "./routes/EnrollmentRoute.js";
import LessonRoute from "./routes/LessonRoute.js";
import QuizRoute from "./routes/QuizRoute.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/courses", CourseRoute);
app.use("/api/lessons", LessonRoute);
app.use("/api/quizzes", QuizRoute);
app.use("/api/enrollements", EnrollmentRoute);

app.get("/", (req, res) => res.send("API is Running..."));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("JWT Secret:", process.env.JWT_SECRET);

