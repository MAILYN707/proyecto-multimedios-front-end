// src/pages/Prestamo.jsx
import React, { useEffect, useState } from "react";
import { axiosClient } from "../services/axiosClient";
import Toast from "../components/Toast";
import FormPrestamo from "../components/FormPrestamo";

const Prestamo = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [nuevo, setNuevo] = useState({
    id_miembro: "",
    id_bibliotecario: "",
    fecha_prestamo: "",
    estado: "Activo",
  });

  // Para la edición
  const [editar, setEditar] = useState(null);
  const [detallesEdit, setDetallesEdit] = useState([]);

  // Toast
  const [mensaje, setMensaje] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);

  // Para eliminar
  const [prestamoAEliminar, setPrestamoAEliminar] = useState(null);

  // Para expandir filas
  const [prestamoExpandido, setPrestamoExpandido] = useState(null);
  const [detallesPrestamo, setDetallesPrestamo] = useState({});

  // 1) Cargar todos los préstamos
  const cargarPrestamos = async () => {
    try {
      const res = await axiosClient.get("prestamo.php");
      setPrestamos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar préstamos:", error);
    }
  };

  // 2) Cargar detalles de un préstamo para la vista expandida
  const cargarDetallesPrestamo = async (id) => {
    try {
      const res = await axiosClient.get(`detalle_prestamo.php?id_prestamo=${id}`);
      setDetallesPrestamo((prev) => ({ ...prev, [id]: res.data }));
    } catch (error) {
      console.error("Error al cargar detalles del préstamo:", error);
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  // 3) Crear préstamo (desde FormPrestamo)
  const handleCrearSuccess = () => {
    cargarPrestamos();
    document.getElementById("modal-crear-prestamo").close();
    mostrarMensaje("Préstamo registrado correctamente");
  };

  // 4) Abrir modal de edición y traer detalles
  const abrirEditar = async (p) => {
    try {
      // Primero cargá los detalles del préstamo
      const res = await axiosClient.get(`detalle_prestamo.php?id_prestamo=${p.id_prestamo}`);
      setDetallesEdit(res.data);
      
      // Luego seteás el préstamo a editar
      setEditar(p);

      // Y solo después abrís el modal
      document.getElementById("modal-editar-prestamo").showModal();
    } catch (error) {
      console.error("Error al cargar detalles para editar:", error);
      setDetallesEdit([]);
    }
  };


  // 5) Guardar edición (préstamo + detalles)
  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      // 5.1 actualizo cabeza de préstamo
      await axiosClient.put("prestamo.php", editar);

      // 5.2 actualizo o creo cada detalle
      for (const d of detallesEdit) {
        if (d.id_detalle_prestamo) {
          // existe → PUT
          await axiosClient.put("detalle_prestamo.php", {
            id_detalle_prestamo: d.id_detalle_prestamo,
            id_prestamo: editar.id_prestamo,
            id_libro: d.id_libro,
            cantidad: d.cantidad,
            fecha_devolucion_prevista: d.fecha_devolucion_prevista,
          });
        } else {
          // nuevo → POST
          await axiosClient.post("detalle_prestamo.php", {
            id_prestamo: editar.id_prestamo,
            id_libro: d.id_libro,
            cantidad: d.cantidad,
            fecha_devolucion_prevista: d.fecha_devolucion_prevista,
          });
        }
      }

      // 5.3 refresco UI
      setEditar(null);
      document.getElementById("modal-editar-prestamo").close();
      cargarPrestamos();
      mostrarMensaje("Préstamo actualizado correctamente");
    } catch (error) {
      console.error("Error al editar préstamo:", error);
      Toast("Error al actualizar préstamo", "error");
    }
  };

  // 6) Eliminación
  const eliminar = async (id) => {
    try {
      await axiosClient.delete(`prestamo.php?id=${id}`);
      cargarPrestamos();
      mostrarMensaje("Préstamo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col items-center py-6 px-4">
      <h1 className="text-3xl font-bold text-[#2F8C8C] mb-4">Préstamos</h1>

      {/* Botón Nuevo */}
      <button
        onClick={() => document.getElementById("modal-crear-prestamo").showModal()}
        className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded mb-6"
      >
        Agregar Préstamo
      </button>

      {/* Tabla */}
      {prestamos.length > 0 ? (
        <table className="w-full max-w-6xl text-center shadow-md rounded overflow-hidden">
          <thead className="bg-blue-200 text-[#1E3A8A] font-semibold">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Miembro</th>
              <th className="py-2 px-4">Bibliotecario</th>
              <th className="py-2 px-4">Fecha</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white text-black">
            {prestamos.map((p) => (
              <React.Fragment key={p.id_prestamo}>
                <tr className="border-b">
                  <td>{p.id_prestamo}</td>
                  <td>{p.nombre_miembro || p.id_miembro}</td>
                  <td>{p.nombre_bibliotecario || p.id_bibliotecario}</td>
                  <td>{p.fecha_prestamo.split(" ")[0]}</td>
                  <td>{p.estado}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => abrirEditar(p)}
                      className="bg-[#489C9C] hover:bg-[#3b8a8a] text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(p.id_prestamo)}
                      className="bg-[#E57373] hover:bg-[#d65a5a] text-white px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={async () => {
                        if (prestamoExpandido === p.id_prestamo) {
                          setPrestamoExpandido(null);
                        } else {
                          await cargarDetallesPrestamo(p.id_prestamo);
                          setPrestamoExpandido(p.id_prestamo);
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      {prestamoExpandido === p.id_prestamo ? "Ocultar libros" : "Ver libros"}
                    </button>
                  </td>
                </tr>

                {/* fila expandida */}
                {prestamoExpandido === p.id_prestamo && detallesPrestamo[p.id_prestamo] && (
                  <tr className="bg-gray-100">
                    <td colSpan="6">
                      <table className="w-full text-sm mt-2 border">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-2 py-1">Título</th>
                            <th className="px-2 py-1">Cantidad</th>
                            <th className="px-2 py-1">Fecha devolución prevista</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detallesPrestamo[p.id_prestamo].map((d, i) => (
                            <tr key={i}>
                              <td className="px-2 py-1">{d.titulo}</td>
                              <td className="px-2 py-1">{d.cantidad}</td>
                              <td className="px-2 py-1">{d.fecha_devolucion_prevista}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-700 mt-6">No hay préstamos registrados.</p>
      )}

      <Toast mensaje={mensaje} visible={mostrarToast} />

      {/* Modal Crear */}
      <dialog id="modal-crear-prestamo" className="rounded-lg w-full max-w-2xl bg-gray-300 p-6 shadow-md">
        <h2 className="text-xl font-bold text-[#2F8C8C] text-center mb-4">Nuevo Préstamo</h2>
        <FormPrestamo prestamo={nuevo} setPrestamo={setNuevo} onSubmitSuccess={handleCrearSuccess} />
        <div className="flex justify-end mt-4">
          <button
            onClick={() => document.getElementById("modal-crear-prestamo").close()}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </dialog>

      {/* Modal Editar */}
      <dialog id="modal-editar-prestamo" className="rounded-lg w-full max-w-2xl bg-gray-300 p-6 shadow-md">
        {editar && (
          <form className="space-y-4" onSubmit={handleEditar}>
            <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Editar Préstamo</h2>
            <FormPrestamo
              prestamo={editar}
              setPrestamo={setEditar}
              detallesIniciales={detallesEdit}
              onSubmitSuccess={() => {}}
            />
            <div className="flex justify-end gap-2">
              <button type="submit" className="bg-[#2F8C8C] text-white px-4 py-2 rounded">Actualizar</button>
              <button type="button" onClick={() => document.getElementById("modal-editar-prestamo").close()} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
};

export default Prestamo;
