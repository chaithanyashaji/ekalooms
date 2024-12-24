import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/shopcontext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const {backendUrl} = useContext(ShopContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });

      if (response.data.success) {
        toast.success("Reset link sent to your email");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <h2 className="text-3xl mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 border border-gray-800"
      />
      <button type="submit" className="bg-black text-white font-light px-8 py-2 mt-4">Send Reset Link</button>
    </form>
  );
};

export default ForgotPassword;
