import React, { useEffect, useState } from "react";

const FormLibro = ({ libro, setLibro }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    isbn: "",
    anio_publicacion: "",
    id_editorial: "",
    id_categoria: "",
  });

  useEffect(() => {
    if (libro) {
      setFormData(libro);
    }
  }, [libro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const actualizado = { ...formData, [name]: value };
    setFormData(actualizado);
    setLibro(actualizado);
  };

  return (
    <>
      <input
        type="text"
        name="titulo"
        value={formData.titulo}
        onChange={handleChange}
        placeholder="Título"
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        required
      />
      <input
        type="text"
        name="isbn"
        value={formData.isbn}
        onChange={handleChange}
        placeholder="ISBN"
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        required
      />
      <input
        type="number"
        name="anio_publicacion"
        value={formData.anio_publicacion}
        onChange={handleChange}
        placeholder="Año de publicación"
        min="1000"
        max={new Date().getFullYear()}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        required
      />
      <input
        type="number"
        name="id_editorial"
        value={formData.id_editorial}
        onChange={handleChange}
        placeholder="ID Editorial"
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        required
      />
      <input
        type="number"
        name="id_categoria"
        value={formData.id_categoria}
        onChange={handleChange}
        placeholder="ID Categoría"
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        required
      />
    </>
  );
};

export default FormLibro;
