import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { Layout } from '@components/Layout';


import { Home } from './pages/Home';
import Bibliotecario from './pages/Bibliotecario';
import Miembro from "./pages/Miembro";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/bibliotecario" element={<Bibliotecario/>} />
          <Route path="/miembros" element={<Miembro />} />
      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;