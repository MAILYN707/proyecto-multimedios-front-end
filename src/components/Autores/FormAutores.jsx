import React, { useEffect, useState } from "react";

const FormAutor = ({ autor, setAutor }) => {
    const [formData, setFormData] = useState({ nombre: "", telefono: "" });

    useEffect(() => {
        if (autor) {
            setFormData(autor);
        }
    }, [autor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const actualizado = { ...formData, [name]: value };
        setFormData(actualizado);
        setAutor(actualizado);
    };

    return (
        <>
            <input
                type="text"
                name="nombre_autor"
                value={formData.nombre_autor}
                onChange={handleChange}

                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
                placeholder="Nombre"
                required
            />
            <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
                placeholder="Fecha de nacimiento"
                required
            />

        </>
    );
};

export default FormAutor;