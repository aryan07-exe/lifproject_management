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
if(!day)return res.status(400).json({message:'Day not found'});

day.manpower=manPowerassignments;

console.log("Manpower being assigned:", manPowerassignments);

await project.save();
res.json({success:true, message:"Manpower assignments updated successfully"});
}catch(err){
console.error("Validation Error:", err.errors); // 🔥 shows exact field with issue
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: err.errors, // send this to frontend to see the real issue
  });}
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

module.exports = router;