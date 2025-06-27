import React, { useEffect, useState } from "react";

const FormLibro = ({ libro, setLibro, categorias, editoriales}) => {
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

  if (!Array.isArray(categorias)) categorias = [];
  if (!Array.isArray(editoriales)) editoriales = [];


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
     {/* Select Editorial */}
      <select
        name="id_editorial"
        value={formData.id_editorial}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        required
      >
        <option value="">Seleccione Editorial</option>
        {editoriales.map((e) => (
          <option key={e.id_editorial} value={e.id_editorial}>
            {e.nombre_editorial}
          </option>
        ))}
      </select>

      {/* Select Categoría */}
      <select
        name="id_categoria"
        value={formData.id_categoria}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        required
      >
        <option value="">Seleccione Categoría</option>
        {categorias.map((c) => (
          <option key={c.id_categoria} value={c.id_categoria}>
            {c.nombre_categoria}
          </option>
        ))}
      </select>
    </>
  );
};

export default FormLibro;
