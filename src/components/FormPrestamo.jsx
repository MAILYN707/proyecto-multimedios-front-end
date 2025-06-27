import React, { useEffect, useState } from "react";
import { axiosClient } from "../services/axiosClient";
import Toast from "./Toast";

const FormPrestamo = ({ prestamo, setPrestamo, onSubmitSuccess, detallesIniciales = [] }) => {
  const [formData, setFormData] = useState({
    id_miembro: "",
    id_bibliotecario: "",
    fecha_prestamo: "",
    estado: ""
  });

  const [detalles, setDetalles] = useState([
    { id_libro: "", cantidad: 1, fecha_devolucion_prevista: "" }
  ]);

  const [libros, setLibros] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  useEffect(() => {
    if (prestamo) {
      setFormData(prestamo);
    }
  }, [prestamo]);

  useEffect(() => {
    const obtenerLibrosYDetalles = async () => {
      try {
        const res = await axiosClient.get("libro.php");
        setLibros(res.data);

        if (detallesIniciales.length > 0) {
          setDetalles(
            detallesIniciales.map((d) => ({
              id_libro: parseInt(d.id_libro),
              cantidad: d.cantidad,
              fecha_devolucion_prevista: d.fecha_devolucion_prevista
            }))
          );
        }
      } catch (error) {
        console.error("Error al cargar libros:", error);
        mostrarMensaje("Error al cargar libros");
      }
    };

    obtenerLibrosYDetalles();
  }, [detallesIniciales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const actualizado = { ...formData, [name]: value };
    setFormData(actualizado);
    setPrestamo(actualizado);
  };

  const manejarCambioDetalle = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index][campo] = campo === "id_libro" ? parseInt(valor) : valor;
    setDetalles(nuevosDetalles);
  };

  const agregarDetalle = () => {
    setDetalles([...detalles, { id_libro: "", cantidad: 1, fecha_devolucion_prevista: "" }]);
  };

  const eliminarDetalle = (index) => {
    const nuevos = [...detalles];
    nuevos.splice(index, 1);
    setDetalles(nuevos);
  };

  const guardarPrestamo = async () => {
    try {
      const prestamoRes = await axiosClient.post("prestamo.php", formData);
      const id_prestamo = prestamoRes.data.id_prestamo;

      for (const d of detalles) {
        await axiosClient.post("detalle_prestamo.php", {
          id_prestamo,
          id_libro: d.id_libro,
          cantidad: d.cantidad,
          fecha_devolucion_prevista: d.fecha_devolucion_prevista
        });
      }

      mostrarMensaje("Préstamo y libros agregados correctamente");
      setFormData({ id_miembro: "", id_bibliotecario: "", fecha_prestamo: "", estado: "" });
      setDetalles([{ id_libro: "", cantidad: 1, fecha_devolucion_prevista: "" }]);

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (error) {
      console.error("Error al guardar préstamo:", error);
      mostrarMensaje("Error al guardar el préstamo");
    }
  };

  console.log("Libros cargados:", libros);

  return (
    <>
      <div className="space-y-2">
        <input type="number" name="id_miembro" value={formData.id_miembro} onChange={handleChange} className="input" placeholder="ID del miembro" required />
        <input type="number" name="id_bibliotecario" value={formData.id_bibliotecario} onChange={handleChange} className="input" placeholder="ID del bibliotecario" required />
        <input type="date" name="fecha_prestamo" value={formData.fecha_prestamo} onChange={handleChange} className="input" required />
        <select name="estado" value={formData.estado} onChange={handleChange} className="input" required>
          <option value="">Seleccione un estado</option>
          <option value="Activo">Activo</option>
          <option value="Devuelto">Devuelto</option>
          <option value="Retrasado">Retrasado</option>
        </select>
      </div>

      <hr className="my-4" />
      <h2 className="text-lg font-semibold mb-2">Libros del préstamo</h2>

      {detalles.map((detalle, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 mb-2 items-center">
          <select value={detalle.id_libro} onChange={(e) => manejarCambioDetalle(index, "id_libro", e.target.value)} className="border p-2 rounded">
            <option value="">Seleccione un libro</option>
            {libros.map((libro) => (
              <option key={libro.id_libro} value={libro.id_libro}>
                {libro.titulo}
              </option>
            ))}
          </select>
          <input type="number" min="1" value={detalle.cantidad} onChange={(e) => manejarCambioDetalle(index, "cantidad", e.target.value)} className="border p-2 rounded" />
          <input type="date" value={detalle.fecha_devolucion_prevista} onChange={(e) => manejarCambioDetalle(index, "fecha_devolucion_prevista", e.target.value)} className="border p-2 rounded" />
          <button type="button" onClick={() => eliminarDetalle(index)} className="bg-red-500 text-white px-2 py-1 rounded">×</button>
        </div>
      ))}

      <button type="button" onClick={agregarDetalle} className="bg-green-500 text-white px-3 py-1 rounded mt-2">+ Agregar libro</button>

      <div className="mt-4">
        <button onClick={guardarPrestamo} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar Préstamo</button>
      </div>

      <Toast mensaje={mensaje} visible={mostrarToast} />
    </>
  );
};

export default FormPrestamo;
