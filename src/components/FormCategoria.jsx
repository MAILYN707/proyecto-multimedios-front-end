import React from "react";

const FormCategoria = ({ categoria, setCategoria }) => {
  const handleChange = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="nombre_categoria" className="block text-gray-700 font-semibold mb-1">
          Nombre de la categoría:
        </label>
        <input
          type="text"
          id="nombre_categoria"
          name="nombre_categoria"
          value={categoria.nombre_categoria}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8C8C]"
          required
        />
      </div>
    </div>
  );
};

export default FormCategoria;
