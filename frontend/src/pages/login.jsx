import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/shopcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("one number");
    if (!/[!@#$%^&*]/.test(password)) errors.push("one special character");
    return errors;
  };

  const onPasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (currentState === 'Sign Up') {
      const errors = validatePassword(newPassword);
      if (errors.length > 0) {
        setPasswordError(`Password must contain ${errors.join(', ')}`);
      } else {
        setPasswordError('');
      }
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (currentState === 'Sign Up') {
        const errors = validatePassword(password);
        if (errors.length > 0) {
            toast.error('Please enter a strong password');
            return;
        }
    }

    try {
        const url = currentState === 'Sign Up'
            ? `${backendUrl}/api/user/register`
            : `${backendUrl}/api/user/login`;

        const payload = currentState === 'Sign Up'
            ? { name, email, password }
            : { email, password };

        const response = await axios.post(url, payload);
       

        if (response.data.success) {
            const { accessToken, refreshToken } = response.data;

            // Save tokens to localStorage
            localStorage.setItem("token", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // Update state/context
            setToken(accessToken);

            // Redirect after successful login
            navigate('/');
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error("Error in Submit Handler:", error);
        toast.error("Something went wrong. Please try again.");
    }
};


  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-[#A75D5D]">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-[#A75D5D]" />
      </div>
      
      {currentState === 'Sign Up' && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-[#D3756B]"
          placeholder="Name"
          required
        />
      )}
      
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-[#D3756B]"
        placeholder="Email"
        required
      />
      
      <div className="w-full">
        <input
          onChange={onPasswordChange}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-[#D3756B]"
          placeholder="Password"
          required
        />
        {passwordError && currentState === 'Sign Up' && (
          <p className="text-red-500 text-xs mt-1">{passwordError}</p>
        )}
      </div>

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p onClick={() => navigate('/forgot-password')} className="cursor-pointer text-[#A75D5D]">
          Forgot your password?
        </p>
        <p
          onClick={() => {
            setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login');
            setPasswordError('');
          }}
          className="cursor-pointer text-[#A75D5D]"
        >
          {currentState === 'Login' ? 'Create account' : 'Login Here'}
        </p>
      </div>

      <button className="bg-gradient-to-r from-[#dcb7a2] to-[#D3756B] shadow-md rounded-md text-white px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;