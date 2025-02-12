import express from "express";
import Course from "../models/Course.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Only "instructor" can create a course
router.post("/", verifyToken, roleMiddleware(["instructor"]), async (req, res) => {
    try {
        const course = new Course({ ...req.body, instructor: req.user.id });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Public - Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().populate("instructor", "name email");
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Public - Get a specific course by ID
router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("instructor", "name email");
        if (!course) return res.status(404).json({ message: "Course not Found" });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Only "instructor" can update a course
router.put("/:id", verifyToken, roleMiddleware(["instructor"]), async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Only "instructor" can delete a course
router.delete("/:id", verifyToken, roleMiddleware(["instructor"]), async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
