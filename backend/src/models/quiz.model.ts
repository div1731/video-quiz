import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a quiz title'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    videoUrl: {
      type: String,
      required: [true, 'Please provide a video URL'],
    },
    youtubeVideoId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    shareUrlSlug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
