// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Pages and Components
import Login from "./pages/login/Login";// <--- Removed .jsx
import SignUp from './pages/SignUp/SignUp'; // <--- Removed .jsx
import ForgotPassword from './pages/login/ForgotPassword';
import Home from './pages/Home/Home'; 
import PrivateRoute from "./components/PrivateRoute";// The gatekeeper component

function App() {
  return (
    // Wrap the entire app in the Router
    <Router>
      {/* Container for toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Routes>
        
        {/* 1. Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 2. Protected Routes Wrapper */}
        <Route element={<PrivateRoute />}>
          {/* This route (the homepage) is protected */}
          <Route path="/" element={<Home />} /> 
        </Route>
        
        {/* 3. Fallback Route: Redirects any unknown URL to the homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;