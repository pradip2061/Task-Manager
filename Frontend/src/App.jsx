import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import WeeklyProgress from './pages/WeeklyProgress';
import AddTask from './pages/AddTask';
import { GoogleOAuthProvider } from "@react-oauth/google";
const NavBar = lazy(() => import('./components/NavBar'));
const DashBoard = lazy(() => import('./pages/DashBoard'));
import {Provider} from 'react-redux'
import store from '../store/store';
import axios from 'axios';
import { useEffect } from 'react';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const Layout = () => (
  <>
    <NavBar />
    <Outlet /> 
  </>
);

const App = () => {
  useEffect(() => {
    const checkToken = async () => {
      if(!localStorage.getItem('user')){
        return
      }
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/checktoken`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          console.log("Token is valid");
        }
      } catch (error) {
        // If token is invalid or expired, clear localStorage
        if (error.response && error.response.status === 401) {
          console.warn("Token expired. Logging out...");
          localStorage.removeItem("user");
        }
      }
    };

    checkToken(); // ✅ Call the function
  }, []);
  return (
    <Provider store={store}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashBoard />} />
            <Route path="/weekly" element={<WeeklyProgress />} />
            <Route path="/addtask/:state" element={<AddTask/>} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
    </GoogleOAuthProvider>
    </Provider>
  );
};

export default App;
