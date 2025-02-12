import express from "express";
import Lesson from "../models/Lesson.js";
import mongoose from "mongoose";
import { verifyToken } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("Fetching lessons..."); // ✅ Debugging

    const lessons = await Lesson.find(); // MongoDB se fetch kar raha hai
    console.log("Lessons found:", lessons); // ✅ Debugging

    if (!lessons.length) {
      return res.status(404).json({ message: "No lessons found" });
    }

    res.json(lessons); // ✅ Return lessons
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Server error, please try again" });
  }
});


router.post("/", verifyToken, roleMiddleware(["instructor"]), async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:courseId", verifyToken, async (req, res) => {
  try {
    const { courseId } = req.params;

    // ✅ Check if courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid courseId" });
    }

    const lessons = await Lesson.find({ course: courseId });

    if (!lessons.length) {
      return res.status(404).json({ message: "No lessons found for this course" });
    }

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", verifyToken, roleMiddleware(["instructor"]), async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", verifyToken, roleMiddleware(["instructor"]), async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json({ message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
