import {
  Activity,
  Calendar,
  CheckCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gettaskThunk } from "../../store/get/getTaskThunk";
import axios from "axios";

const ProgressBar = ({ dayProgress }) => {
  const total = dayProgress?.task?.length || 0;
  const complete =
    dayProgress?.task?.filter((item) => item.status === "completed")?.length ||
    0;
  const value = total > 0 ? (complete / total) * 100 : 0;
  const isComplete = total > 0 && total === complete;

  return (
    <div className="flex flex-col items-center z-[-10]">
      <div className="relative w-12 h-28 bg-gray-200 rounded-lg overflow-hidden flex flex-col-reverse">
        <div
          className={`transition-all duration-700 ease-in-out ${
            isComplete ? "bg-green-400" : "bg-blue-400"
          }`}
          style={{ height: `${value}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow-sm">
          {complete}/{total}
        </span>
      </div>
      <span className="mt-2 text-sm font-medium">{dayProgress.day}</span>
    </div>
  );
};

const DashBoard = () => {
  const { todaytask, weeklyTasks } = useSelector((item) => item.gettask);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const dispatch = useDispatch();

  const [statusLoading, setStatusLoading] = useState(false);

  const totalTasks = weeklyTasks?.reduce(
    (sum, day) => sum + (day.task?.length || 0),
    0
  );
  const completedTasks = weeklyTasks?.reduce(
    (sum, day) =>
      sum + (day?.task?.filter((t) => t.status === "completed")?.length || 0),
    0
  );
  const totalProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statsArray = [
    { title: "Total Tasks", icon: <Target />, value: totalTasks },
    { title: "Completed", icon: <CheckCircle />, value: completedTasks },
    { title: "Total Progress", icon: <Activity />, value: `${totalProgress}%` },
  ];

  useEffect(() => {
    dispatch(gettaskThunk());
  }, [dispatch]);

  const handleStatusChange = async (dayid, taskid, currentStatus) => {
    try {
      setStatusLoading(true);
      const newStatus =
        currentStatus === "completed" ? "pending" : "completed";

      await axios.put(`${import.meta.env.VITE_BASE_URL}/updatestatustask`,{ dayid, taskid, status: newStatus });
      // Refresh tasks
      dispatch(gettaskThunk());
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-28 lg:pt-20">
      {/* Profile + Stats */}
      <div className="w-[90%] lg:w-[80%] bg-gradient-to-r from-blue-500 to-blue-500 rounded-2xl p-4 mt-10 flex flex-col gap-6">
        <div className="flex gap-6 pl-6">
          <img
            src={user?.profilepic}
            alt=""
            className="h-16 w-16 bg-gray-100 rounded-full"
          />
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-lg text-white">{user?.name}</h1>
            <h1 className="text-md text-white">{user?.email}</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row flex-wrap gap-5 lg:gap-10 lg:pl-6">
          {statsArray?.map((item, index) => (
            <div
              key={index}
              className="lg:w-60 w-full pl-6 py-4 bg-gray-100 rounded-2xl"
            >
              <div
                className={`flex gap-3 items-center font-medium ${
                  item?.title === "Completed"
                    ? "text-green-500"
                    : "text-gray-800"
                }`}
              >
                {item?.icon}
                {item?.title}
              </div>
              <h1 className="ml-2 mt-2 text-2xl font-bold">{item?.value}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mt-10 w-[90%] lg:w-[80%]">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Weekly Progress
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 justify-items-center mt-10">
          {weeklyTasks.map((dayProgress) => (
            <ProgressBar key={dayProgress.day} dayProgress={dayProgress} />
          ))}
        </div>
      </div>

      {/* Today Tasks */}
      <div className="w-[80%] mt-20 mb-20">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Today Tasks
        </h2>

        {statusLoading && (
          <div className="text-center mb-3 text-blue-500">Updating...</div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {todaytask?.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No tasks yet
              </h3>
              <p className="text-gray-600">
                Create your first task? to get started!
              </p>
            </div>
          ) : (
            todaytask[0]?.task?.map((task, index) => (
              <div
                key={index}
                className="px-4 py-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className={`font-medium text-gray-900 ${task.status === 'completed' ? 'line-through':null}`}>{task?.title}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {todaytask[0].day}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task?.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task?.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task?.priority}
                    </span>
                  </div>
                  {task?.description && (
                    <p className={`text-sm text-gray-600 ${task.status === 'completed' ? 'line-through':null}`}>{task?.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <button className="text-sm font-medium">
                    {task?.status === "completed"
                      ? "Completed"
                      : task?.status === "in-progress"
                      ? "In Progress"
                      : "Pending"}
                  </button>
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() =>
                      handleStatusChange(todaytask[0]._id, task._id, task.status)
                    }
                    disabled={statusLoading}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
