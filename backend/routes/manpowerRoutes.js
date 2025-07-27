const express = require('express');
const router = express.Router();
const ManPower = require('../models/Manpower');
const ProjectDetails = require('../models/ProjectDetails');

router.put('/:projectId/day/:dayId/assign-manpower',async(req,res)=>{
const {projectId,dayId}=req.params;
const {manPowerassignments}=req.body;

try{
    const project=await ProjectDetails.findById(projectId);
    if(!project)
      return res.status(400).json({message:"Project not found"});
    const day= project.dayWiseRequirements.id(dayId);
    if(!day) return res.status(400).json({message:'Day not found'});

    // Get the date for this day
    const assignDate = day.date;
    // Get all eids being assigned
    const assignedEids = manPowerassignments.map(a => a.eid);

    // Find all projects (except current) with assignments for these eids on the same date
    const conflictProjects = await ProjectDetails.find({
      _id: { $ne: projectId },
      'dayWiseRequirements': {
        $elemMatch: {
          date: assignDate,
          'manpower.eid': { $in: assignedEids }
        }
      }
    });

    if (conflictProjects.length > 0) {
      // Find which eids are conflicting
      const conflictingEids = [];
      for (const p of conflictProjects) {
        for (const d of p.dayWiseRequirements) {
          if (d.date && new Date(d.date).toISOString() === new Date(assignDate).toISOString()) {
            for (const m of d.manpower) {
              if (assignedEids.includes(m.eid)) {
                conflictingEids.push(m.eid);
              }
            }
          }
        }
      }
      return res.status(400).json({
        success: false,
        message: `Employee(s) already assigned to another project on this date: ${[...new Set(conflictingEids)].join(', ')}`
      });
    }

    day.manpower=manPowerassignments;
    await project.save();
    res.json({success:true, message:"Manpower assignments updated successfully"});
}catch(err){
  console.error("Validation Error:", err.errors);
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: err.errors,
  });
}
});

router.get('/all',async(req,res)=>{
    try{
        const manpower=await ManPower.find()
        res.status(200).json(manpower);
    }catch(er){
      console.log(er);
        res.status(500).json({message:'Server Error'});
    }
});

// Add this to your existing manpower route file (if not already there)
router.post('/add', async (req, res) => {
  try {
    const { name, email, eid, role, phone } = req.body;
    const newManpower = new ManPower({ name, email, eid, role, phone });
    await newManpower.save();
    res.status(201).json({ success: true, message: "Manpower added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding manpower", error: err.message });
  }
});

router.get('/assignments/:eid',async(req,res)=>{
    const {eid}=req.params;
    try{
        const projects=await ProjectDetails.find({
            "dayWiseRequirements.manpower.eid": eid
        });
        const assignments=[];
        for (const project of projects) {
      for (const day of project.dayWiseRequirements) {
        for (const manpower of day.manpower) {
          if (manpower.eid === eid) {
            assignments.push({
              projectId: project._id,
              projectName: project.projectName,
              projectType: project.projectType,
              date: day.date,
              timeShift: day.timeShift,
              role: manpower.role,
              slotIndex: manpower.slotIndex,
            });
          }
        }
      }
    }res.json(assignments);
}catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
}
    
});

module.exports = router;