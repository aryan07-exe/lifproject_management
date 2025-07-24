// Delete by projectName

// Fetch all projects

const express = require('express');
const router = express.Router();
const ProjectDetails = require('../models/ProjectDetails');

router.get('/all', async (req, res) => {
  try {
    const projects = await ProjectDetails.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});
 

router.delete('/by-name/:projectName', async (req, res) => {
  try {
    const { projectName } = req.params;
    const decodedName = decodeURIComponent(projectName).trim();
    const deletedProject = await ProjectDetails.findOneAndDelete({
      projectName: { $regex: new RegExp('^' + decodedName + '$', 'i') }
    });
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project Not Found' });
    }
    res.json({ message: 'Project Deleted' });
  } catch (er) {
    console.error(er);
    res.status(500).json({ error: 'Server Error' });
  }
});
// Create new project
router.post('/', async (req, res) => {
  try {
    // Transform deliverables to objects with key, status, deadline

    const deliverableOptions = {
      rawPhotos: { category: 'Photo' },
      editedPhotos: { category: 'Photo' },
      firstSetPhotos: { category: 'Photo' },
      digitalAlbum: { category: 'Photo' },
      standardBook: { category: 'Photo' },
      premiumBook: { category: 'Photo' },
      LongFilm: { category: 'Video' },
      cineFilm: { category: 'Video' },
      highlights: { category: 'Video' },
      reel: { category: 'Video' },
      teaser: { category: 'Video' },
    };

    // Demo deadlines for wedding categories, separate for Photo and Video
    const weddingCategoryDeadlines = {
      'Basic Wedding': { Photo: 10, Video: 20 },
      'Intimate Wedding': { Photo: 12, Video: 22 },
      'Signature Wedding': { Photo: 14, Video: 24 },
      'Premium Wedding': { Photo: 16, Video: 26 },
      'Small': { Photo: 8, Video: 18 },
      'Micro': { Photo: 6, Video: 16 },
      'Others': { Photo: 20, Video: 30 },
    };

    const { deliverables, primaryDate, projectType, projectCategory } = req.body;
    const primaryDateObj = new Date(primaryDate);
    const mappedDeliverables = Array.isArray(deliverables)
      ? deliverables.map((key) => {
          const opt = deliverableOptions[key] || {};
          let days;
          if (projectType === 'Wedding') {
            // Use category-based demo deadlines, separate for Photo/Video
            const catDeadlines = weddingCategoryDeadlines[projectCategory] || { Photo: 20, Video: 20 };
            days = opt.category === 'Photo' ? catDeadlines.Photo : catDeadlines.Video;
          } else {
            days = opt.category === 'Photo' ? 15 : 20;
            if (!opt.category) days = 20;
          }
          const deadline = new Date(primaryDateObj.getTime() + days * 24 * 60 * 60 * 1000);
          return {
            key,
            status: 'pending',
            deadline,
          };
        })
      : [];

    const payload = {
      ...req.body,
      deliverables: mappedDeliverables,
    };
    const project = new ProjectDetails(payload);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  const projects = await ProjectDetails.find();
  res.json(projects);
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProject = await ProjectDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET /api/projects/search?name=projectName

router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i'); // 'i' for case-insensitive search
    const projects = await ProjectDetails.find({ projectName: regex });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await ProjectDetails.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project Not Found' });
    }
    res.json({ message: 'Project Deleted' });
  } catch (er) {
    console.error(er);
    res.status(500).json({ error: 'Server Error' });
  }
});
module.exports = router;
