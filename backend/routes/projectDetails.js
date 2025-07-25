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


    // Default deadlines for each deliverable per project category (in days)
    const deliverableDeadlines = {
      'Basic Wedding': {
        rawPhotos: 40, editedPhotos: 40, firstSetPhotos: 15, digitalAlbum: 40, standardBook: 60, premiumBook: 60,
        LongFilm: 100, cineFilm: 100, highlights: 100, reel: 40, teaser: 40
      },
      'Intimate Wedding': {
       rawPhotos: 40, editedPhotos: 40, firstSetPhotos: 15, digitalAlbum: 40, standardBook: 60, premiumBook: 60,
        LongFilm: 100, cineFilm: 100, highlights: 100, reel: 40, teaser: 40
      },
      'Signature Wedding': {
        rawPhotos: 40, editedPhotos: 40, firstSetPhotos:3, digitalAlbum: 40, standardBook: 60, premiumBook: 60,
        LongFilm: 100, cineFilm: 100, highlights: 100, reel: 40, teaser: 40
      },
      'Premium Wedding': {
        rawPhotos: 40, editedPhotos: 40, firstSetPhotos: 3, digitalAlbum: 40, standardBook: 60, premiumBook: 60,
        LongFilm: 60, cineFilm: 80, highlights: 60, reel: 40, teaser: 3
      },
      'Small': {
        rawPhotos: 3, editedPhotos: 6, firstSetPhotos: 5, digitalAlbum: 15, standardBook: 18, premiumBook: 22,
        LongFilm: 12, cineFilm: 14, highlights: 16, reel: 18, teaser: 20
      },
      'Micro': {
        rawPhotos: 2, editedPhotos: 4, firstSetPhotos: 3, digitalAlbum: 10, standardBook: 12, premiumBook: 15,
        LongFilm: 10, cineFilm: 12, highlights: 14, reel: 16, teaser: 18
      },
      'Others': {
        rawPhotos: 10, editedPhotos: 20, firstSetPhotos: 15, digitalAlbum: 40, standardBook: 45, premiumBook: 50,
        LongFilm: 25, cineFilm: 27, highlights: 29, reel: 31, teaser: 33
      },
    };

    // Fallbacks
    const defaultDays = {
      rawPhotos: 7, editedPhotos: 14, firstSetPhotos: 10, digitalAlbum: 30, standardBook: 35, premiumBook: 40,
      LongFilm: 20, cineFilm: 22, highlights: 24, reel: 26, teaser: 28
    };

    const { deliverables, primaryDate, projectType, projectCategory } = req.body;
    const primaryDateObj = new Date(primaryDate);
    const mappedDeliverables = Array.isArray(deliverables)
      ? deliverables.map((key) => {
          const opt = deliverableOptions[key] || {};
          // Use per-deliverable, per-category deadline if available
          const catDeadlines = deliverableDeadlines[projectCategory] || defaultDays;
          const days = catDeadlines[key] || defaultDays[key] || 20;
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
