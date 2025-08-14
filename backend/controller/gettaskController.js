const Task = require("../model/TaskModel");

function getWeekAndYear(date = new Date()) {
  const currentDate = new Date(date.getTime());
  currentDate.setHours(0, 0, 0, 0);

  // Move to nearest Thursday (ISO week date system)
  currentDate.setDate(currentDate.getDate() + 4 - (currentDate.getDay() || 7));

  const yearStart = new Date(currentDate.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((currentDate - yearStart) / 86400000) + 1) / 7);

  return {
    week: weekNumber,
    year: currentDate.getFullYear()
  };
}

const gettask = async (req, res) => {
  try {
    const userid = typeof req.user === "object" ? req.user.id : req.user;

    // Get all tasks for this user
    const tasks = await Task.find({ userid });

    // Get today's tasks
    const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = DAYS_OF_WEEK[new Date().getDay()];
    const todaytask = tasks.filter(item => item.day === today);

    // Get this week's tasks
    const { week, year } = getWeekAndYear();

    const weeklyTasks = tasks.filter(item => Number(item.weekNumber) === week && Number(item.year)=== year);
    res.status(200).json({
      success: true,
      week,
      year,
      tasks,
      todaytask,
      weeklyTasks
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not fetch tasks",
    });
  }
};

module.exports = gettask;
