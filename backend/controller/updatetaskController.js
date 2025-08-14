const Task = require("../model/TaskModel");

const updatetaskdata = async (req, res) => {
  try {
    const { dayid, taskid,formData } = req.body;
    const{ title, description, priority, status, day}=formData

    // Find the day document
    const dayDoc = await Task.findOne({ _id: dayid });
    if (!dayDoc) {
      return res.status(404).json({ message: "Day not found" });
    }

    // Find the specific task in the day
    const task = dayDoc.task.id(taskid); // Mongoose subdocument lookup
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (day !== undefined) task.day = day;

    // Save updated document
    await dayDoc.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

module.exports = updatetaskdata;
