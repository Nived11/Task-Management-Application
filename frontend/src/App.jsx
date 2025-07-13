import React from 'react';
import { BrowserRouter, Routes,Route, Router } from "react-router-dom";
import Login from './Components/Login';
import Register from './Components/Registration';
import Dashboard from './Components/Dashboard';



function App() {
 
  return (
   <BrowserRouter>
   <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={
        <>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <img src="https://cdn-icons-png.flaticon.com/512/190/190406.png" alt="404" style={{ width: '150px', height: '150px' }} />
        <h1 >404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <p>Please check the URL or return to the <a href="/dashboard">home page</a>.</p>
        </div>
        </>} />
    </Routes>
   </BrowserRouter>
  );
}

export default App
