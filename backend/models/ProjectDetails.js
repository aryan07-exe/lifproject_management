
const mongoose = require('mongoose');

const DayRequirementSchema = new mongoose.Schema({
  date: Date,
  timeShift: { type: String, enum: ['Half Day Morning', 'Half Day Evening', 'Full Day'], required: true },
  traditionalPhotographers: { type: Number, default: 0 },
  traditionalCinematographers: { type: Number, default: 0 },
  candidPhotographers: { type: Number, default: 0 },
  candidcinematographers: { type: Number, default: 0 },
  additionalCinematographers: { type: Number, default: 0 },
  additionalPhotographers: { type: Number, default: 0 },
  assistant: { type: Number, default: 0 },
  onSiteEditor: { type: Number, default: 0 },
  aerialCinematography: { type: Number, default: 0 },
  additionalNotes: String,
});


const DeliverableSchema = new mongoose.Schema({
  key: { type: String, required: true },
  status: { type: String, enum: ['pending', 'complete', 'client review','closed'], default: 'pending' },
  deadline: { type: Date, required: true },
});

const ProjectDetailsSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectType: { type: String, required: true }, // dropdown in frontend
  invoiceName: { type: String, required: true },
  primaryDate: { type: Date, required: true },
  // timeShift removed from project-level, now in dayWiseRequirements
  projectCategory: { type: String }, // only set if projectType is 'Wedding'
  dayWiseRequirements: [DayRequirementSchema],
  deliverables: [DeliverableSchema], // store deliverable objects
  reelCount: { type: Number, default: 0 },
  standardBookCount: { type: Number, default: 0 },
  premiumBookCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('ProjectDetails', ProjectDetailsSchema);
