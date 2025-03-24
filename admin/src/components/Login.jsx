import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });

            if (response.data.success) {
                const { token } = response.data;
                localStorage.setItem("token", token); // Store token securely in localStorage
                setToken(token); // Update parent state with the token
                toast.success("Logged in successfully!");
            } else {
                toast.error(response.data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full">
            <div className="bg-white shadow-md border border-[#D3756B] rounded-lg px-8 py-6 max-w-md">
                <h1 className="text-2xl text-[#65000B] font-bold mb-4">Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div>
                        <p className="text-sm font-medium text-[#65000B] mb-2">Email Address</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                            type="email"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#65000B] mb-2">Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                            type="password"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        className="mt-4 w-full py-2 px-4 rounded-md text-white bg-gradient-to-r from-[#FFC3A1] to-[#D3756B] border border-[#65000B]"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
