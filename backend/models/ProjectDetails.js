
const mongoose = require('mongoose');
const ManpowerAssignmentSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: [
      'traditionalPhotographer',
      'traditionalCinematographer',
      'candidPhotographer',
      'candidCinematographer',
      'additionalCinematographer',
      'additionalPhotographer',
      'assistant',
      'onSiteEditor',
      'aerialCinematography'
    ],
    required: true
  },
  eid: {
    type: String,
    required: true
  },
  slotIndex: {
    type: Number,
    required: true
  }
});


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
  manpower: [ManpowerAssignmentSchema],
});


const DeliverableSchema = new mongoose.Schema({
  key: { type: String, required: true },
  status: { type: String, enum: ['pending', 'complete', 'client review','closed'], default: 'pending' },
  deadline: { type: Date }, // Not required for count deliverables
  count: { type: Number, default: 0 } // Only used for count deliverables
});

const ProjectDetailsSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectType: { type: String, required: true }, // dropdown in frontend
  invoiceName: { type: String, required: true },
  invoiceNumber: { type: String },
  mobileNumber: { type: String },
  primaryDate: { type: Date, required: true },
  // timeShift removed from project-level, now in dayWiseRequirements
  projectCategory: { type: String }, // only set if projectType is 'Wedding'
  dayWiseRequirements: [DayRequirementSchema],
  deliverables: [DeliverableSchema], // store deliverable objects, including counts
   projectStage: {
    type: String,
    enum: ['incomplete', 'in progress', 'review', 'completed'],
    default: 'incomplete'}
});

module.exports = mongoose.model('ProjectDetails', ProjectDetailsSchema);
