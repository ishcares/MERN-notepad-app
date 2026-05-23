import axiosInstance from "../utils/axiosInstance";

export const loginUser = async (data) => {
  try {
    // 🟢 FIX: Added 'api/' prefix to trigger the Vite proxy
    const res = await axiosInstance.post("api/login", data);
    
    // 🟢 CRITICAL: Save the token and user data to Local Storage
    if (res.data.token) {
        localStorage.setItem("userToken", res.data.token);
        // Store user details for application state (optional, but common)
        localStorage.setItem("user", JSON.stringify(res.data.user)); 
    }

    return res.data; // Return the full response data
  } catch (error) {
    // If login fails (401, 404 from Express), throw error with message
    throw error.response?.data || { message: "Login failed" };
  }
};

export const signupUser = async (data) => {
    try {
        // 🟢 FIX: Added 'api/' prefix to trigger the Vite proxy
        const res = await axiosInstance.post("api/create-account", data); 
        return res.data;
    } catch (error) {
        // 🟢 BEST PRACTICE: Add error handling for proper feedback in signup component
        throw error.response?.data || { message: "Account creation failed" };
    }
};

export const getSecurityQuestion = async (email) => {
    try {
        const res = await axiosInstance.post("api/forgot-password/question", { email });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to retrieve security question" };
    }
};

export const resetPassword = async (data) => {
    try {
        const res = await axiosInstance.post("api/forgot-password/reset", data);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Password reset failed" };
    }
};