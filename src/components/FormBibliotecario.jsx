import React, { useEffect, useState } from "react";

const FormBibliotecario = ({ bibliotecario, setBibliotecario }) => {
  const [formData, setFormData] = useState({ nombre: "", correo: "" });

  useEffect(() => {
    if (bibliotecario) {
      setFormData(bibliotecario);
    }
  }, [bibliotecario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const actualizado = { ...formData, [name]: value };
    setFormData(actualizado);
    setBibliotecario(actualizado);
  };

  return (
    <>
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        placeholder="Nombre"
        required
      />
      <input
        type="email" 
        name="correo"
        value={formData.correo}
        onChange={handleChange}
        
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        placeholder="Correo"
        required
      />
    </>
  );
};

export default FormBibliotecario;