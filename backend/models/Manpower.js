const mongoose=require('mongoose');

const Manpower=new mongoose.Schema({
    name:{type:String,required:true},
    eid:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    role:{type:String,required:true},
});
module.exports=mongoose.model('Manpower',Manpower);