import React from "react";

const FormSucursal = ({ sucursal, setSucursal }) => {
  const handleChange = (e) => {
    setSucursal({ ...sucursal, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="nombre_sucursal" className="block text-gray-700 font-semibold mb-1">
          Nombre de la sucursal:
        </label>
        <input
          type="text"
          id="nombre_sucursal"
          name="nombre_sucursal"
          value={sucursal.nombre_sucursal}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8C8C]"
        />
      </div>
    </div>
  );
};

export default FormSucursal;
