import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    viewerId: {
      type: String,
      required: true,
      index: true,
    },
    watchTime: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index for querying attempts by quiz
attemptSchema.index({ quizId: 1, createdAt: -1 });

export const Attempt = mongoose.model('Attempt', attemptSchema);
