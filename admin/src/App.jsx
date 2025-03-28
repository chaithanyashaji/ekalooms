import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BottomNavBar from './components/BottomNavBar';
import CouponManager from './pages/CouponManager';
import AdminFeaturedImages from './pages/AdminFeaturedImages'; // Import Featured Manager

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = 'INR';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <BottomNavBar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/coupons' element={<CouponManager token={token} />} />
                <Route path='/featured-images' element={<AdminFeaturedImages token={token} />} /> {/* New Route */}
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  );
}

export default App;
