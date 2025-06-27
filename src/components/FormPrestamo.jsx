// src/components/FormPrestamo.jsx
import React, { useEffect, useState } from "react";
import { axiosClient } from "../services/axiosClient";
import Toast from "./Toast";

const FormPrestamo = ({
  prestamo,
  setPrestamo,
  detallesIniciales = [],
  onSubmitSuccess,
}) => {
  // Estado del préstamo
  const [formData, setFormData] = useState({
    id_prestamo: null,
    id_miembro: "",
    id_bibliotecario: "",
    fecha_prestamo: "",
    estado: "Activo",
  });

  // Estado de los detalles (cada uno puede tener id_detalle_prestamo)
  const [detalles, setDetalles] = useState([
    { id_libro: "", cantidad: 1, fecha_devolucion_prevista: "" },
  ]);

  const [libros, setLibros] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  // Cuando cambia el préstamo (crear vs editar), inicializamos el form
  useEffect(() => {
    if (prestamo) {
      setFormData({
        id_prestamo: prestamo.id_prestamo || null,
        id_miembro: prestamo.id_miembro || "",
        id_bibliotecario: prestamo.id_bibliotecario || "",
        fecha_prestamo: prestamo.fecha_prestamo
          ? prestamo.fecha_prestamo.split(" ")[0]
          : "",
        estado: prestamo.estado || "Activo",
      });
    }
  }, [prestamo]);

  // Cuando llegan detallesIniciales (al editar), los cargamos
  useEffect(() => {
    if (detallesIniciales.length > 0) {
      setDetalles(
        detallesIniciales.map((d) => ({
          id_detalle_prestamo: d.id_detalle_prestamo,
          id_libro: d.id_libro,
          cantidad: d.cantidad,
          fecha_devolucion_prevista: d.fecha_devolucion_prevista,
        }))
      );
    } else {
      setDetalles([{ id_libro: "", cantidad: 1, fecha_devolucion_prevista: "" }]);
    }
  }, [detallesIniciales]);

  // Cargar la lista de libros para el <select>
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get("libro.php");
        setLibros(res.data);
      } catch (error) {
        console.error("Error al cargar libros:", error);
        mostrarMensaje("Error al cargar libros");
      }
    })();
  }, []);

  // Manejo de cambios en los inputs del préstamo
  const handleChange = (e) => {
    const { name, value } = e.target;
    const actualizado = { ...formData, [name]: value };
    setFormData(actualizado);
    setPrestamo(actualizado);
  };

  // Manejo de cambios en cada detalle
  const handleDetalleChange = (idx, campo, valor) => {
    const copia = [...detalles];
    copia[idx] = {
      ...copia[idx],
      [campo]: campo === "id_libro" ? parseInt(valor) : valor,
    };
    setDetalles(copia);
  };

  // Agregar una nueva línea de detalle
  const addDetalle = () =>
    setDetalles([
      ...detalles,
      { id_libro: "", cantidad: 1, fecha_devolucion_prevista: "" },
    ]);

  // Eliminar un detalle
  const removeDetalle = (idx) => {
    const copia = [...detalles];
    copia.splice(idx, 1);
    setDetalles(copia);
  };

  // Guardar (crear o editar) préstamo + detalles
  const guardarPrestamo = async () => {
    try {
      let id = formData.id_prestamo;

      // 1) Cabeza del préstamo
      if (id) {
        // Modo edición
        await axiosClient.put("prestamo.php", {
          id_prestamo: id,
          ...formData,
        });
      } else {
        // Modo creación
        const res = await axiosClient.post("prestamo.php", {
          id_miembro: formData.id_miembro,
          id_bibliotecario: formData.id_bibliotecario,
          fecha_prestamo: formData.fecha_prestamo,
          estado: formData.estado,
        });
        id = res.data.id_prestamo;
      }

      // 2) Detalles: PUT si ya existe, POST si es nuevo
      for (const d of detalles) {
        if (d.id_detalle_prestamo) {
          // Actualizar
          await axiosClient.put("detalle_prestamo.php", {
            id_detalle_prestamo: d.id_detalle_prestamo,
            id_prestamo: id,
            id_libro: d.id_libro,
            cantidad: d.cantidad,
            fecha_devolucion_prevista: d.fecha_devolucion_prevista,
          });
        } else {
          // Crear
          await axiosClient.post("detalle_prestamo.php", {
            id_prestamo: id,
            id_libro: d.id_libro,
            cantidad: d.cantidad,
            fecha_devolucion_prevista: d.fecha_devolucion_prevista,
          });
        }
      }

      mostrarMensaje("Préstamo guardado correctamente");
      // Reiniciar formulario
      setFormData({
        id_prestamo: null,
        id_miembro: "",
        id_bibliotecario: "",
        fecha_prestamo: "",
        estado: "Activo",
      });
      setDetalles([{ id_libro: "", cantidad: 1, fecha_devolucion_prevista: "" }]);

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error("Error al guardar préstamo:", error);
      mostrarMensaje("Error al guardar el préstamo");
    }
  };

  return (
    <>
      {/* Campos cabeza */}
      <div className="space-y-2">
        <input
          type="number"
          name="id_miembro"
          value={formData.id_miembro}
          onChange={handleChange}
          className="input"
          placeholder="ID del miembro"
          required
        />
        <input
          type="number"
          name="id_bibliotecario"
          value={formData.id_bibliotecario}
          onChange={handleChange}
          className="input"
          placeholder="ID del bibliotecario"
          required
        />
        <input
          type="date"
          name="fecha_prestamo"
          value={formData.fecha_prestamo}
          onChange={handleChange}
          className="input"
          required
        />
        <select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="Activo">Activo</option>
          <option value="Devuelto">Devuelto</option>
          <option value="Retrasado">Retrasado</option>
        </select>
      </div>

      <hr className="my-4" />

      {/* Detalles */}
      <h2 className="text-lg font-semibold mb-2">Libros del préstamo</h2>
      {detalles.map((d, i) => (
        <div key={i} className="grid grid-cols-4 gap-2 mb-2">
          <select
            value={d.id_libro}
            onChange={(e) => handleDetalleChange(i, "id_libro", e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Seleccione un libro</option>
            {libros.map((libro) => (
              <option key={libro.id_libro} value={libro.id_libro}>
                {libro.titulo}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={d.cantidad}
            onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={d.fecha_devolucion_prevista}
            onChange={(e) =>
              handleDetalleChange(i, "fecha_devolucion_prevista", e.target.value)
            }
            className="border p-2 rounded"
          />
          <button
            type="button"
            onClick={() => removeDetalle(i)}
            className="bg-red-500 text-white px-2 rounded"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addDetalle}
        className="bg-green-500 text-white px-3 py-1 rounded mb-4"
      >
        + Agregar libro
      </button>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          onClick={guardarPrestamo}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar Préstamo
        </button>
      </div>

      {/* Toast de mensajes */}
      <Toast mensaje={mensaje} visible={mostrarToast} />
    </>
  );
};

export default FormPrestamo;
