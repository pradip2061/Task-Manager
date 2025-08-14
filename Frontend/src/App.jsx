import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import WeeklyProgress from './pages/WeeklyProgress';
import AddTask from './pages/AddTask';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from 'react-redux';
import store from '../store/store';
import axios from 'axios';
import LoadingIndicator from './components/LoadingIndicator';

const NavBar = lazy(() => import('./components/NavBar'));
const DashBoard = lazy(() => import('./pages/DashBoard'));

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
      if (!localStorage.getItem('user')) {
        return;
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
        if (error.response && error.response.status === 401) {
          console.warn("Token expired. Logging out...");
          localStorage.removeItem("user");
        }
      }
    };

    checkToken();
  }, []);

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <Suspense fallback={<LoadingIndicator />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<DashBoard />} />
                <Route path="/weekly" element={<WeeklyProgress />} />
                <Route path="/addtask/:state" element={<AddTask />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  );
};

export default App;
