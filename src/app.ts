import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5172","https://bcsit-frontend-jcpf.vercel.app","https://bcsit-admin-gmas.vercel.app","https://bcsit-frontend.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

import "./database/connection.js";
import userRouter from "./routes/userRoute.js";
import semesterRouter from "./routes/semesterRoute.js";
import subjectRouter from "./routes/subjectRoute.js";
import noteRouter from "./routes/noteRoute.js";
import questionRoute from "./routes/questionRoute.js";
import contentRouter from "./routes/contentRoute.js";
import quizRouter from "./routes/quizRoute.js";
import quizQuestionRouter from "./routes/quizQuestionRoute.js";
import quizAttempt from "./routes/quizAttemptRoute.js";
import subContentRouter from "./routes/subContentRoute.js";
import syllabusRouter from "./routes/syllabusRoute.js";
import savedNoteRouter from "./routes/savedNoteRoute.js";

app.use("/api/user", userRouter);
app.use("/api/sem", semesterRouter);
app.use("/api/sub", subjectRouter);
app.use("/api/note", noteRouter);
app.use("/api/question", questionRoute);
app.use("/api/content", contentRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/quizques", quizQuestionRouter);
app.use("/api/quizattempt", quizAttempt);
app.use("/api/subcontent", subContentRouter);
app.use("/api/syllabus", syllabusRouter);
app.use("/api/savednote", savedNoteRouter);

export default app;
