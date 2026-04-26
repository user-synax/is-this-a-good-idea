import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
  idea: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    required: true,
    enum: ['DEAD ON ARRIVAL', 'NEEDS WORK', 'ACTUALLY VIABLE', 'SEND IT'],
  },
  reason: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Idea || mongoose.model('Idea', IdeaSchema);
