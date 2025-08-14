const Task = require("../model/TaskModel");

const updatetask = async (req, res) => {
  try {
    const { dayid, taskid, status } = req.body;

    // Find the day document
    const day = await Task.findOne({_id:dayid }); // or { _id: dayid } if that's your field
    if (!day) {
      return res.status(404).json({ message: "Day not found" });
    }
    console.log(day)

    day.task.forEach((item) => {
      if (item._id.toString() === taskid) {
        item.status = status;
      }
    });

    // Save the updated document
    await day.save();

    res.status(200).json({ message: "Task updated successfully", day });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

module.exports = updatetask