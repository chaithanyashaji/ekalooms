import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/shopcontext';
import validator from 'validator';
import Title from '../components/Title';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(ShopContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!validator.isEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email });

      // Success message
      toast.success(response.data.message || "If the email exists, a reset link will be sent.");
    } catch (error) {
      // Display error message from backend
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4"
      style={{ color: '#A75D5D', borderRadius: '10px', padding: '20px' }}
    >
      <Title text1={"FORGOT "} text2={"PASSWORD"} />
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-3 py-2 border-2 border-[#D3756B] focus:border-[#F0997D] focus:outline-none text-[#A75D5D]"
      />
      <button
        type="submit"
        className={`bg-gradient-to-r from-[#dcb7a2] to-[#D3756B] shadow-md rounded-md text-white px-8 py-2 mt-4 ${
          loading ? 'cursor-not-allowed opacity-70' : 'hover:shadow-lg cursor-pointer'
        }`}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
};

export default ForgotPassword;
