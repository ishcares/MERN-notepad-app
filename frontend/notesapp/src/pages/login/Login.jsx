import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { loginUser } from "../../api/auth"; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. Call the API function. If successful, it returns data and saves the token in auth.js.
      const data = await loginUser({ email, password }); 
      
      // 2. SUCCESS: Check if data was returned (any failure is caught by the 'catch' block)
      if (data && data.token) { 
        toast.success("Login successful 🎉");
        
        // 3. ✅ FIX: Navigate immediately after success
        navigate("/"); 
      } 
      // Note: No 'else' block needed, as errors are thrown and handled below.

    } catch (error) {
      // Handles 401 (Invalid password) and 404 (User not found) thrown by auth.js
      console.error(error);
      // Display the specific error message, which is typically the one thrown from auth.response?.data
      toast.error(error.message || "Server error. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#EAEFEA] text-[#2C3B2E]">
      <h1 className="text-3xl font-semibold mb-1 text-[#2C3B2E] tracking-tight">Journal</h1>
      <p className="text-sm text-[#5C6B5E] mb-8 font-light">A quiet place for your thoughts</p>

      <form
        onSubmit={handleLogin}
        className="bg-white border border-[#D9E4DD] p-8 rounded-[12px] w-full max-w-sm flex flex-col space-y-5 shadow-sm"
      >
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] transition duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] pr-10 transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-[#8A9B8E] hover:text-[#2C3B2E] text-base"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#4A6B53] hover:bg-[#3A5642] text-white py-3 rounded-[12px] font-medium transition duration-300 ease-in-out text-sm shadow-sm"
        >
          Login
        </button>

        <div className="flex flex-col space-y-3 pt-2 text-center text-xs border-t border-[#FAFAF8]">
          <div className="text-[#5C6B5E]">
            Not registered yet?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[#4A6B53] hover:text-[#2C3B2E] hover:underline font-semibold"
            >
              Create an Account
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[#8A9B8E] hover:text-[#2C3B2E] hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;