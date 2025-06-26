import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { Layout } from '@components/Layout';


import { Home, Autores } from './pages';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<Home />} />
          <Route path="/autores" element={<Autores/>} />
      
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;