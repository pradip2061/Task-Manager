const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({
    userid:{
   type: String,
    },
      day: {
    type: String
  },
  task:[{title:{
    type: String,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    default: "medium",
  },
  status: {
    type: String,
    enum:['pending','completed'],
    default: "pending",

  }}],
  weekNumber:{
    type:String
  },
  year:{
    type:String
  }
},{timestamps:true});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
