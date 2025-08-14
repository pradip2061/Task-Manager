import { Calendar, Edit3 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { gettaskThunk } from "../../store/get/getTaskThunk";
import axios from "axios";

const WeeklyProgress = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { weeklyTasks } = useSelector((state) => state.gettask);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null); // store taskId being deleted

  const initialDay = localStorage.getItem("day") || "Sunday";
  const [day, setDay] = useState(initialDay);

  useEffect(() => {
    dispatch(gettaskThunk());
  }, [dispatch]);

  const handleStatusChange = async (dayid, taskid, currentStatus) => {
    try {
      setStatusLoading(true);
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await axios.put(`${import.meta.env.VITE_BASE_URL}/updatestatustask`, {
        dayid,
        taskid,
        status: newStatus
      });
      dispatch(gettaskThunk());
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setStatusLoading(false);
    }
  };

  const storeDay = (item) => {
    setDay(item);
    localStorage.setItem("day", item);
  };

  const deletetask = async (dayid, taskid) => {
    try {
      setDeleteLoading(taskid);
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/deletetask`, {
        data: { dayid, taskid } // axios delete with body requires `data` field
      });
      dispatch(gettaskThunk());
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredTasks = weeklyTasks?.filter((task) => task?.day === day);

  return (
    <div className="pt-20 px-4 md:px-20 flex flex-col gap-y-6">
      <h1 className="text-2xl font-bold mt-6 md:mt-10 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
        Weekly Overview
      </h1>

      {/* Days Selector */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex gap-x-3 md:gap-x-4 pb-2">
          {days.map((item, index) => (
            <button
              key={index}
              onClick={() => storeDay(item)}
              className={`whitespace-nowrap rounded-md px-4 py-2 text-sm md:text-base transition-all ${
                day === item
                  ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Overview */}
      <div className="w-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-white">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6" />
          <div>
            <h1 className="text-lg font-semibold">{day}</h1>
            <h2 className="text-sm opacity-80">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
            </h2>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No tasks yet
              </h3>
              <p className="text-gray-600">Create your first task to get started!</p>
            </div>
          ) : (
            filteredTasks[0]?.task?.map((task) => (
              <div
                key={task._id}
                className="px-4 py-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                {/* Task Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className={`font-medium text-gray-900 ${task.status === 'completed' ? 'line-through':null}`}>{task.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {filteredTasks[0]?.day}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className={`text-sm text-gray-600 ${task.status === 'completed' ? 'line-through':null}`}>{task.description}</p>
                  )}
                </div>

                {/* Status + Checkbox + Delete + Edit */}
                <div className="flex items-center gap-3 sm:gap-6">
                  <button className="text-sm font-medium text-gray-700 pointer-events-none">
                    {task.status === "completed"
                      ? "Completed"
                      : task.status === "in-progress"
                      ? "In Progress"
                      : "Pending"}
                  </button>
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={task.status === "completed"}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() =>
                      handleStatusChange(filteredTasks[0]._id, task._id, task.status)
                    }
                    disabled={statusLoading}
                  />
                  <Edit3
                    className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800"
                    onClick={() =>
                      navigate(
                        `/addtask/update?dayid=${filteredTasks[0]._id}&taskid=${task._id}&currentDay=${day}`
                      )
                    }
                  />
                  <button
                    onClick={() => deletetask(filteredTasks[0]._id, task._id)}
                    className={`px-3 py-1 text-sm border rounded transition-colors ${
                      deleteLoading === task._id
                        ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                        : "text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    }`}
                    type="button"
                    disabled={deleteLoading === task._id}
                  >
                    {deleteLoading === task._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;
