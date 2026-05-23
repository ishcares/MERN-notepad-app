import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSecurityQuestion, resetPassword } from "../../api/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // State Definitions
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1 = enter email, 2 = verify answer & reset
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Step 1: Fetch security question
  const handleFetchQuestion = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await getSecurityQuestion(email);
      if (res.success && res.question) {
        setSecurityQuestion(res.question);
        setStep(2);
        toast.info("Security question retrieved.");
      } else {
        toast.error("Could not retrieve security question.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to find account.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Verify answer and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!securityAnswer.trim() || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        email,
        securityAnswer,
        newPassword,
      });

      if (res.success) {
        toast.success("Password reset successfully! 🎉");
        navigate("/login");
      } else {
        toast.error(res.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EAEFEA] text-[#2C3B2E] p-4">
      <h1 className="text-3xl font-semibold mb-1 text-[#2C3B2E] tracking-tight">Journal</h1>
      <p className="text-sm text-[#5C6B5E] mb-8 font-light">Recover your writing space</p>

      <div className="bg-white border border-[#D9E4DD] p-8 rounded-[12px] w-full max-w-sm shadow-sm">
        
        {step === 1 ? (
          /* STEP 1: ENTER EMAIL */
          <form onSubmit={handleFetchQuestion} className="space-y-5">
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] transition duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-[12px] font-medium transition duration-300 ease-in-out text-sm text-white shadow-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#4A6B53] hover:bg-[#3A5642]" 
              }`}
            >
              {loading ? "Searching..." : "Retrieve Question"}
            </button>
          </form>
        ) : (
          /* STEP 2: VERIFY & RESET */
          <form onSubmit={handleResetPassword} className="space-y-4">
            {/* Display Question */}
            <div className="bg-[#EAEFEA] border border-[#D9E4DD] p-4 rounded-[12px]">
              <span className="block text-xs font-semibold text-[#8A9B8E] uppercase tracking-wider mb-1">
                Security Question
              </span>
              <p className="text-sm font-medium text-[#2C3B2E] leading-relaxed">
                {securityQuestion}
              </p>
            </div>

            {/* Answer Input */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Your Answer</label>
              <input
                type="text"
                placeholder="Enter your security answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] transition duration-200"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] transition duration-200"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[#5C6B5E] uppercase tracking-wider">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-[#FCFDFD] border border-[#D9E4DD] rounded-[12px] focus:outline-none focus:border-[#4A6B53] focus:ring-0 text-sm text-[#2C3B2E] placeholder-[#A0B0A4] transition duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-[12px] font-medium transition duration-300 ease-in-out text-sm text-white shadow-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#4A6B53] hover:bg-[#3A5642]" 
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center mt-5 pt-3 text-xs border-t border-[#FAFAF8]">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#4A6B53] hover:text-[#2C3B2E] hover:underline font-semibold"
          >
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
