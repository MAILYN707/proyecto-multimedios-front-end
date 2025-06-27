import React, { useEffect, useState } from "react";

const FormMiembro = ({ miembro, setMiembro }) => {
  const [formData, setFormData] = useState({ nombre: "", correo: "" });

  useEffect(() => {
    if (miembro) {
      setFormData(miembro);
    }
  }, [miembro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const actualizado = { ...formData, [name]: value };
    setFormData(actualizado);
    setMiembro(actualizado);
  };

  return (
    <>
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        placeholder="Nombre del miembro"
        required
      />
      <input
        type="email"
        name="correo"
        value={formData.correo}
        onChange={handleChange}
        className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
        placeholder="Correo electrónico"
        required
      />
    </>
  );
};

export default FormMiembro;
