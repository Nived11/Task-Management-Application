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
        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <p>Please check the URL or return to the <a href="/dashboard">home page</a>.</p>
        </>} />
    </Routes>
   </BrowserRouter>
  );
}

export default App
