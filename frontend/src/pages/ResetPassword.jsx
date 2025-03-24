import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/shopcontext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { backendUrl } = useContext(ShopContext);
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password/${token}`, { password });
      if (response.data.success) {
        toast.success("Password reset successful. Please login.");
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col prata-regular items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4"
      style={{
        color: '#65000B',
       
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 className="text-xl mb-4" style={{ color: '#D3756B' }}>
        Reset Password
      </h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
         className="w-full px-3 py-2 border-2  text-[#65000B] border-[#D3756B] focus:border-[#F0997D] focus:outline-none"
       
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
         className="w-full px-3 py-2 border-2 r text-[#65000B] border-[#D3756B] focus:border-[#F0997D] focus:outline-none"
        
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-[#dcb7a2] to-[#D3756B] shadow-md rounded-md text-white px-8 py-2 mt-4"
        style={{
          cursor: password === confirmPassword && password !== '' ? 'pointer' : 'not-allowed',
        }}
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
