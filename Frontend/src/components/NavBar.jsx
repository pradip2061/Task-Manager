import { Bell, Calendar, LayoutDashboard, Plus } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const NavBar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const[loading,setLoading]=useState(false)
  // Get user from localStorage and parse it
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const signwithgoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/google`,
          { access_token: tokenResponse.access_token },
          { withCredentials: true }
        );
        console.log("User logged in:", res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.location.reload()
      } catch (err) {
        console.error("Google login error:", err);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  const logout = async () => {
  try {
      setLoading(true)
    await axios.post(`${import.meta.env.VITE_BASE_URL}/logout`,{},{withCredentials:true});
    localStorage.removeItem("user");
        window.location.reload()
  } catch (error) {
    console.log(error)
  }finally{
    setLoading(false)
  }

  };

  return (
    <div className="fixed py-4 w-full lg:px-14 flex gap-24 lg:gap-140 items-center bg-gray-50 shadow shadow-gray-300">
      {/* Desktop Nav */}
      <div className="gap-x-10 hidden lg:flex">
        <h1 className="font-cursive text-3xl ">Daily <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">MileStone</span></h1>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-2 gap-2 rounded ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
            }`
          }
        >
          <LayoutDashboard />
          <button>DashBoard</button>
        </NavLink>
        <NavLink
          to="/weekly"
          className={({ isActive }) =>
            `flex items-center px-2 gap-2 rounded ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
            }`
          }
        >
          <Calendar />
          <button>WeeklyProgress</button>
        </NavLink>
        <NavLink
          to="/addtask/create"
          className={({ isActive }) =>
            `flex items-center px-2 gap-2 rounded ${
              isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
            }`
          }
        >
          <Plus />
          <button>Add Task</button>
        </NavLink>
      </div>

      {/* Mobile Nav */}
      <div className="flex lg:hidden">
        <h1 className="font-cursive font-bold text-xl ml-3">Daily MileStone</h1>
        <div className="absolute flex mt-12 gap-4 px-8 py-4 bg-gray-50 shadow-md">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-2 py-1 gap-2 rounded ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <LayoutDashboard />
            <button>DashBoard</button>
          </NavLink>
          <NavLink
            to="/weekly"
            className={({ isActive }) =>
              `flex items-center px-2 py-1 gap-2 rounded ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <Calendar />
            <button>Progress</button>
          </NavLink>
          <NavLink
            to="/addtask/create"
            className={({ isActive }) =>
              `flex items-center px-2 gap-2 py-1 rounded ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            <Plus />
            <button>Task</button>
          </NavLink>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5 ml-8 lg:ml-0 ">
        <Bell />
        {user ? (
          <div
            className="relative group"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
          >
            <img
              src={user.profilepic || "#"}
              alt="#"
              className="rounded-full w-12 h-12 bg-gray-200 object-cover cursor-pointer"
            />
            {/* Logout Button on Hover */}
            {showLogout && (
              <div className="absolute top-12 right-1 bg-white  shadow-md rounded p-2">
                <button
                  onClick={logout}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full disabled:bg-blue-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={signwithgoogle}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
