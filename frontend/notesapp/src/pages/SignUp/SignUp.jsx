// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../api/auth";
import { toast } from "react-toastify";
// 🔑 NEW: Import specific icons from the Font Awesome module (fa)
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const Signup = () => {
  const navigate = useNavigate();

  // ✅ State variables for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  // 🔑 State for password visibility
  const [showPassword, setShowPassword] = useState(false); 

  // 🧠 Async signup handler
  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (!fullName || !email || !password || !securityQuestion || !securityAnswer) {
      toast.error("All fields must be filled out.");
      return;
    }

    setLoading(true);
    try {
      // ✅ FIX: Using signupUser to resolve ReferenceError
      const response = await signupUser({ 
        fullName, 
        email, 
        password,
        securityQuestion,
        securityAnswer
      });

      // 🟢 Handle success response
      if (response && !response.error) {
        if (response.token) { 
          localStorage.setItem("userToken", response.token); 
          if (response.user) {
            localStorage.setItem("user", JSON.stringify(response.user));
          }
        }
        toast.success("Account created! Welcome to your Journal 🎉");
        navigate("/"); // Redirect to home (protected route)
      } else {
        toast.error(response.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.message || "Error creating account!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EAEFEA] text-[#2C3B2E] py-8">
      <h1 className="text-3xl font-semibold mb-1 text-[#2C3B2E] tracking-tight">Journal</h1>
      <p className="text-sm text-[#5C6B5E] mb-8 font-light">Create a new entry space</p>

      <div className="bg-white border border-[#D9E4DD] p-8 rounded-[12px] w-full max-w-md shadow-sm">
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] transition duration-200"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] transition duration-200"
            />
          </div>

          {/* Password Input with Toggle */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] pr-10 transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8A9B8E] hover:text-[#2C3B2E]"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />} 
              </button>
            </div>
          </div>

          {/* Security Question Selection */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Security Question</label>
            <select
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] transition duration-200"
            >
              <option value="" disabled>Select a security question</option>
              <option value="What was the name of your first pet?">What was the name of your first pet?</option>
              <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
              <option value="What city were you born in?">What city were you born in?</option>
              <option value="What was the name of your first school?">What was the name of your first school?</option>
              <option value="What is your favorite book?">What is your favorite book?</option>
            </select>
          </div>

          {/* Security Question Answer */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Security Answer</label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Enter your secret answer"
              required
              className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] transition duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-[12px] font-medium transition duration-300 ease-in-out text-sm text-white shadow-sm ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4A6B53] hover:bg-[#3A5642]" 
            }`}
          >
            {loading ? "Creating Space..." : "Create Account"}
          </button>

          <div className="text-center text-xs text-[#5C6B5E] pt-2 border-t border-[#FAFAF8]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#4A6B53] hover:text-[#2C3B2E] hover:underline font-semibold"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;