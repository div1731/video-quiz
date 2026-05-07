import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Option text is required'],
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    timestamp: {
      type: Number,
      required: [true, 'Timestamp (in seconds) is required'],
    },
    type: {
      type: String,
      enum: ['multiple_choice', 'true_false'],
      default: 'multiple_choice',
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: function (v: any[]) {
          return v && v.length >= 2;
        },
        message: 'A question must have at least 2 options',
      },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index for efficient fetching of questions in chronological order
questionSchema.index({ quizId: 1, timestamp: 1 });

export const Question = mongoose.model('Question', questionSchema);
