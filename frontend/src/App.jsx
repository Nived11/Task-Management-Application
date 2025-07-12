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
    </Routes>
   </BrowserRouter>
  );
}

export default App
