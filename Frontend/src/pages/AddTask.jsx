import React, { useEffect, useState } from 'react';
import { X, Save, Calendar, Flag, FileText } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createtaskThunk } from '../../store/create/createThunk';
import { resetdata } from '../../store/create/createReducer';
import axios from 'axios';

const AddTask = () => {
  const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, message } = useSelector((state) => state.createtask);
  const weeklytask = useSelector((state) => state.gettask.weeklyTasks); // ✅ your weekly tasks list

  const { state } = useParams(); // 'create' or 'update'
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dayid = queryParams.get("dayid");
  const taskid = queryParams.get("taskid");

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day: DAYS_OF_WEEK[today.getDay()],
    priority: 'medium',
    status: 'pending'
  });

  // ✅ If updating, find the existing task and set the form values
  useEffect(() => {
    if (state === "update" && weeklytask?.length) {
      const dayData = weeklytask.find(day => day._id === dayid);
      if (dayData) {
        const taskData = dayData.task.find(task => task._id === taskid);
        if (taskData) {
          setFormData({
            title: taskData.title || '',
            description: taskData.description || '',
            day: dayData.day || DAYS_OF_WEEK[today.getDay()],
            priority: taskData.priority || 'medium',
            status: taskData.status || 'pending'
          });
        }
      }
    }
  }, [state, weeklytask, dayid, taskid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!localStorage.getItem('user')){
      return alert('login first!')
    }

    if (state === 'create') {
      await dispatch(createtaskThunk(formData));
    } else {
const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/updatetask`,{ dayid, taskid, formData });
if(response.status === 200){
  navigate('/weekly')
}
    }
  };

  const handleCancel = () => {
    navigate(state === 'update' ? '/weekly' : '/');
  };

  useEffect(() => {
    if (status === 'success' && state === 'create') {
      setFormData({
        title: '',
        description: '',
        day: DAYS_OF_WEEK[today.getDay()],
        priority: 'medium',
        status: 'pending'
      });
    }
  }, [status, state]);

  useEffect(() => {
    if (message) {
      alert(message);
      dispatch(resetdata());
    }
  }, [dispatch, message]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 mt-58 lg:mt-20">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {state === 'update' ? 'Update Task' : 'Create New Task'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter task title..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Enter task description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day
              </label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {DAYS_OF_WEEK.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
              disabled={status === 'pending'}
            >
              <Save className="w-4 h-4" />
              {state === 'update' ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
