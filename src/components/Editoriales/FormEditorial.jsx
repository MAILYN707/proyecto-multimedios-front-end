import React, { useEffect, useState } from "react";

const FormEditorial = ({ editorial, setEditorial }) => {
    const [formData, setFormData] = useState({ nombre_editorial: "", telefono: "" });

    useEffect(() => {
        if (editorial) {
            setFormData(editorial);
        }
    }, [editorial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const actualizado = { ...formData, [name]: value };
        setFormData(actualizado);
        setEditorial(actualizado);
    };

    return (
        <>
            <input
                type="text"
                name="nombre_editorial"
                value={formData.nombre_editorial}
                onChange={handleChange}

                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
                placeholder="Nombre de la editorial"
                required
            />
            <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-[#2F8C8C] focus:border-transparent sm:text-sm"
                placeholder="Número de teléfono"
                required
            />

        </>
    );
};

export default FormEditorial;