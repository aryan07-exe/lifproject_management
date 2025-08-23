const express = require('express');
const router = express.Router();
const Project = require('../models/ProjectDetails');

// Simple request logger for this router to help debug 404s
router.use((req, res, next) => {
  try {
    console.log(`[comments] ${req.method} ${req.originalUrl} params=${JSON.stringify(req.params)} body=${JSON.stringify(req.body)}`);
  } catch (e) { /* ignore logging errors */ }
  next();
});

// Fetch comments for a deliverable by invoice number
// GET /api/comments/invoice/:invoiceNumber/deliverable/:deliverableId
router.get('/invoice/:invoiceNumber/deliverable/:deliverableId', async (req, res) => {
  const { invoiceNumber, deliverableId } = req.params;
  try {
    const project = await Project.findOne({ invoiceNumber: invoiceNumber }).select('deliverables');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const deliverable = project.deliverables.id(deliverableId);
    if (!deliverable) return res.status(404).json({ message: 'Deliverable not found' });
    return res.json({ comments: deliverable.comments || [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Add comment to deliverable by invoice number
// POST /api/comments/invoice/:invoiceNumber/deliverable/:deliverableId
router.post('/invoice/:invoiceNumber/deliverable/:deliverableId', async (req, res) => {
  const { invoiceNumber, deliverableId } = req.params;
  const { text, author } = req.body;
  try {
    const project = await Project.findOne({ invoiceNumber: invoiceNumber });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const deliverable = project.deliverables.id(deliverableId);
    if (!deliverable) return res.status(404).json({ message: 'Deliverable not found' });
    const comment = { text, author };
    deliverable.comments = deliverable.comments || [];
    deliverable.comments.push(comment);
    await project.save();
    const added = deliverable.comments[deliverable.comments.length - 1];
    return res.status(201).json(added);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Edit comment by invoice number
// PUT /api/comments/invoice/:invoiceNumber/deliverable/:deliverableId/:commentId
router.put('/invoice/:invoiceNumber/deliverable/:deliverableId/:commentId', async (req, res) => {
  const { invoiceNumber, deliverableId, commentId } = req.params;
  const { text, author } = req.body;
  try {
    const project = await Project.findOne({ invoiceNumber: invoiceNumber });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const deliverable = project.deliverables.id(deliverableId);
    if (!deliverable) return res.status(404).json({ message: 'Deliverable not found' });
    const comment = deliverable.comments && deliverable.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (typeof text !== 'undefined') comment.text = text;
    if (typeof author !== 'undefined') comment.author = author;
    comment.createdAt = new Date();
    await project.save();
    return res.json(comment);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
