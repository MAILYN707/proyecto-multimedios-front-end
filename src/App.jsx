import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { Layout } from '@components/Layout';


import { Home } from './pages';

import Bibliotecario from './pages/Bibliotecario';
import Categorias from './pages/Categorias';
import Sucursales from './pages/Sucursales';
import Libro from './pages/Libro';
import Prestamo from './pages/Prestamo';

import Autor from './pages/Autores';
import Editorial from './pages/Editoriales';

import Miembro from "./pages/Miembro";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/bibliotecario" element={<Bibliotecario/>} />

          <Route path="/categoria" element={<Categorias/>} />
          <Route path="/sucursal" element={<Sucursales/>} />  


          <Route path="/libro" element={<Libro />} />
          <Route path="/prestamo" element={<Prestamo />} />


          <Route path="/autores" element={<Autor/>} />
           <Route path="/editoriales" element={<Editorial/>} />


          <Route path="/miembros" element={<Miembro />} />
      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;