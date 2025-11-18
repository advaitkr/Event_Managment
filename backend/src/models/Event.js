// src/models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index for search
EventSchema.index({ title: 'text', description: 'text' });

// Export as a Mongoose model (CommonJS)
module.exports = mongoose.model('Event', EventSchema);
