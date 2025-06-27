import React, { useEffect, useState } from "react";
import { axiosClient } from "../services/axiosClient";
import Toast from "../components/Toast";
import FormSucursal from "../components/FormSucursal";

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [nueva, setNueva] = useState({ nombre_sucursal: "" });
  const [editar, setEditar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);
  const [sucursalAEliminar, setSucursalAEliminar] = useState(null);

  const cargarSucursales = async () => {
    try {
      const res = await axiosClient.get("/sucursal.php");
      setSucursales(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar sucursales:", error);
    }
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/sucursal.php", nueva);
      setNueva({ nombre_sucursal: "" });
      document.getElementById("modal-crear").close();
      cargarSucursales();
      mostrarMensaje("Sucursal registrada correctamente");
    } catch (error) {
      console.error("Error al crear sucursal:", error);
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put("/sucursal.php", editar);
      setEditar(null);
      document.getElementById("modal-editar").close();
      cargarSucursales();
      mostrarMensaje("Sucursal actualizada correctamente");
    } catch (error) {
      console.error("Error al editar sucursal:", error);
    }
  };

  const eliminar = async (id) => {
    try {
      await axiosClient.delete(`/sucursal.php?id=${id}`);
      cargarSucursales();
      mostrarMensaje("Sucursal eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar sucursal:", error);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col items-center justify-start py-6 px-4">
      <h1 className="text-3xl font-bold text-[#2F8C8C] mb-4">Sucursales</h1>

      <div className="mb-6">
        <button
          onClick={() => document.getElementById("modal-crear").showModal()}
          className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded font-medium"
        >
          Agregar Sucursal
        </button>
      </div>

      {sucursales.length > 0 ? (
        <table className="w-full max-w-5xl text-center shadow-md rounded overflow-hidden">
          <thead className="bg-blue-200 text-[#1E3A8A] font-semibold">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white text-black">
            {sucursales.map((s) => (
              <tr key={s.id_sucursal} className="border-b">
                <td className="py-2">{s.id_sucursal}</td>
                <td>{s.nombre_sucursal}</td>
                <td className="space-x-2 py-2">
                  <button
                    onClick={() => {
                      setEditar(s);
                      document.getElementById("modal-editar").showModal();
                    }}
                    className="bg-[#489C9C] hover:bg-[#3b8a8a] text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setSucursalAEliminar(s);
                      document.getElementById("modal-eliminar").showModal();
                    }}
                    className="bg-[#E57373] hover:bg-[#d65a5a] text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-700 mt-6">
          No hay sucursales registradas.
        </p>
      )}

      <div className="mt-8 w-full max-w-5xl flex justify-center">
        <Toast mensaje={mensaje} visible={mostrarToast} />
      </div>

      {/* Modal Crear */}
      <dialog id="modal-crear" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        <form method="dialog" onSubmit={handleCrear} className="space-y-4">
          <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Nueva Sucursal</h2>
          <FormSucursal sucursal={nueva} setSucursal={setNueva} />
          <div className="flex justify-end space-x-2">
            <button type="submit" className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded">
              Guardar
            </button>
            <button type="button" onClick={() => document.getElementById("modal-crear").close()} className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          </div>
        </form>
      </dialog>

      {/* Modal Editar */}
      <dialog id="modal-editar" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        {editar && (
          <form method="dialog" onSubmit={handleEditar} className="space-y-4">
            <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Editar Sucursal</h2>
            <FormSucursal sucursal={editar} setSucursal={setEditar} />
            <div className="flex justify-end space-x-2">
              <button type="submit" className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded">
                Actualizar
              </button>
              <button type="button" onClick={() => document.getElementById("modal-editar").close()} className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded">
                Cancelar
              </button>
            </div>
          </form>
        )}
      </dialog>

      {/* Modal Eliminar */}
      <dialog id="modal-eliminar" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        <h2 className="text-lg font-semibold text-center text-[#2F8C8C] mb-4">
          ¿Estás segura de que deseas eliminar esta sucursal?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              eliminar(sucursalAEliminar.id_sucursal);
              document.getElementById("modal-eliminar").close();
            }}
            className="bg-[#E57373] hover:bg-[#d65a5a] text-white px-4 py-2 rounded"
          >
            Eliminar
          </button>
          <button
            onClick={() => document.getElementById("modal-eliminar").close()}
            className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Sucursales;