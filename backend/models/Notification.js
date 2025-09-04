// models/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  kind: { type: String, enum: ['deadline'], default: 'deadline' },
  message: { type: String, required: true },
  deliverableId: { type: mongoose.Schema.Types.ObjectId, ref: "Deliverable", required: true },
  deadline: { type: Date, required: true },
  windowKey: { type: String, required: true }, // e.g., "2025-09-04"
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicates for the same deliverable on the same day
NotificationSchema.index({ deliverableId: 1, kind: 1, windowKey: 1 }, { unique: true });

module.exports = mongoose.model("Notification", NotificationSchema);
