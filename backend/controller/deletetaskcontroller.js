const Task = require("../model/TaskModel");

const deletetask = async (req, res) => {
  try {
    const { dayid, taskid } = req.body;

    // Find the parent day document
    const day = await Task.findById(dayid);
    if (!day) return res.status(404).json({ message: "Day not found" });

    // Filter out the task to delete
    const initialLength = day.task.length;
    day.task = day.task.filter((t) => t._id.toString() !== taskid);

    if (day.task.length === initialLength) {
      return res.status(404).json({ message: "Task not found" });
    }

    await day.save();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};

module.exports = deletetask;
