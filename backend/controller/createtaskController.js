const Task = require("../model/TaskModel");

// Helper: ISO week number
function getWeekNumber(date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  target.setDate(target.getDate() - dayNr + 3); // nearest Thursday
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const weekNo = 1 + Math.round(
    ((target - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7
  );
  return weekNo;
}

const createtask = async (req, res) => {
  try {
    const { formData } = req.body;
    if (!formData) {
      return res.status(400).json({ message: "Missing task data" });
    }

    const { title, description, priority, status, day } = formData;

    // Validate required fields
    if (!title || !description || !priority || !status || !day) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure user is authenticated
    const userid = req.user
    if (!userid) {
      return res.status(401).json({ message: "Please login first" });
    }

    // Generate backend week/year
    const now = new Date();
    const weekNumber = String(getWeekNumber(now));
    const year = String(now.getFullYear());

    // Check if a task document for this user/day/week/year already exists
    let existingDoc = await Task.findOne({ userid, day, weekNumber, year });

    if (existingDoc) {
      // Push new task into existing task array
      existingDoc.task.push({ title, description, priority, status });
      await existingDoc.save();

      return res.status(200).json({
        success: true,
        message: "Task added to existing day",
        task: existingDoc
      });
    }

    // Otherwise create a new document
    const newTask = await Task.create({
      userid,
      day,
      task: [{ title, description, priority, status }],
      weekNumber,
      year
    });

    res.status(201).json({
      success: true,
      message: "New task created successfully",
      task: newTask
    });

  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = createtask;
