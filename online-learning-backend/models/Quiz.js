import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: [true, "Question is required"] },
  options: {
    type: [String],
    required: [true, "Options are required"],
    validate: [(arr) => arr.length >= 2, "At least two options are required"],
  },
  correctAnswer: {
    type: String,
    required: [true, "Correct answer is required"],
    validate: {
      validator: function (value) {
        return this.options.includes(value);
      },
      message: "Correct answer must be one of the provided options",
    },
  },
});

const QuizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    questions: {
      type: [QuestionSchema],
      required: [true, "At least one question is required"],
      validate: [(arr) => arr.length > 0, "Quiz must have at least one question"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", QuizSchema);
