import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { Layout } from '@components/Layout';


import { Home } from './pages/Home';
import Bibliotecario from './pages/Bibliotecario';
import Categorias from './pages/Categorias';
import Sucursales from './pages/Sucursales';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/bibliotecario" element={<Bibliotecario/>} />
          <Route path="/categoria" element={<Categorias/>} />
          <Route path="/sucursal" element={<Sucursales/>} />  
      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;