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
  const [editar, setEditar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);
  const [prestamoAEliminar, setPrestamoAEliminar] = useState(null);
  const [detallesPrestamo, setDetallesPrestamo] = useState({});
  const [prestamoExpandido, setPrestamoExpandido] = useState(null);

  const cargarPrestamos = async () => {
    try {
      const res = await axiosClient.get("/prestamo.php");
      setPrestamos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar préstamos:", error);
    }
  };

  const cargarDetallesPrestamo = async (idPrestamo) => {
    try {
      const res = await axiosClient.get(`/detalle_prestamo.php?id_prestamo=${idPrestamo}`);
      setDetallesPrestamo((prev) => ({
        ...prev,
        [idPrestamo]: res.data,
      }));
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

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put("/prestamo.php", editar);
      setEditar(null);
      document.getElementById("modal-editar-prestamo").close();
      cargarPrestamos();
      mostrarMensaje("Préstamo actualizado correctamente");
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  const eliminar = async (id) => {
    try {
      await axiosClient.delete(`/prestamo.php?id=${id}`);
      cargarPrestamos();
      mostrarMensaje("Préstamo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col items-center justify-start py-6 px-4">
      <h1 className="text-3xl font-bold text-[#2F8C8C] mb-4">Préstamos</h1>

      <div className="mb-6">
        <button
          onClick={() => document.getElementById("modal-crear-prestamo").showModal()}
          className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded font-medium"
        >
          Agregar Préstamo
        </button>
      </div>

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
                  <td>{p.fecha_prestamo?.split(" ")[0]}</td>
                  <td>{p.estado}</td>
                  <td className="space-x-2">
                    <button
                      onClick={async () => {
                        setEditar(p);
                        await cargarDetallesPrestamo(p.id_prestamo);
                        document.getElementById("modal-editar-prestamo").showModal();
                      }}
                      className="bg-[#489C9C] hover:bg-[#3b8a8a] text-white px-3 py-1 rounded-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setPrestamoAEliminar(p);
                        document.getElementById("modal-eliminar-prestamo").showModal();
                      }}
                      className="bg-[#E57373] hover:bg-[#d65a5a] text-white px-3 py-1 rounded-md"
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    >
                      {prestamoExpandido === p.id_prestamo ? "Ocultar libros" : "Ver libros"}
                    </button>
                  </td>
                </tr>

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

      <dialog id="modal-crear-prestamo" className="rounded-lg w-full max-w-2xl bg-gray-300 p-6 shadow-md">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Nuevo Préstamo</h2>
          <FormPrestamo
            prestamo={nuevo}
            setPrestamo={setNuevo}
            onSubmitSuccess={() => {
              cargarPrestamos();
              document.getElementById("modal-crear-prestamo").close();
              mostrarMensaje("Préstamo registrado correctamente");
            }}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => document.getElementById("modal-crear-prestamo").close()}
              className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="modal-editar-prestamo" className="rounded-lg w-full max-w-2xl bg-gray-300 p-6 shadow-md">

        {editar && (
          <form method="dialog" onSubmit={handleEditar} className="space-y-4">
            <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Editar Préstamo</h2>
            <FormPrestamo
              prestamo={editar}
              setPrestamo={setEditar}
              detallesIniciales={detallesPrestamo[editar?.id_prestamo] || []}
            />
            <div className="flex justify-end gap-2">
              <button type="submit" className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded">Actualizar</button>
              <button type="button" onClick={() => document.getElementById("modal-editar-prestamo").close()} className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
          </form>
        )}
      </dialog>

      <dialog id="modal-eliminar-prestamo" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        <h2 className="text-lg font-semibold text-center text-[#2F8C8C] mb-4">
          ¿Estás seguro de que deseas eliminar este préstamo?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              eliminar(prestamoAEliminar.id_prestamo);
              document.getElementById("modal-eliminar-prestamo").close();
            }}
            className="bg-[#E57373] hover:bg-[#d65a5a] text-white px-4 py-2 rounded"
          >
            Eliminar
          </button>
          <button
            onClick={() => document.getElementById("modal-eliminar-prestamo").close()}
            className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Prestamo;