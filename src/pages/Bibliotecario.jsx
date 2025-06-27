import React, { useEffect, useState } from "react";
import { axiosClient } from "../services/axiosClient";
import FormBibliotecario from "../components/FormBibliotecario";
import Toast from "../components/Toast";

const Bibliotecario = () => {
  const [bibliotecarios, setBibliotecarios] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: "", correo: "" });
  const [editar, setEditar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);
  const [bibliotecarioAEliminar, setBibliotecarioAEliminar] = useState(null);

  const cargarBibliotecarios = async () => {
    try {
      const res = await axiosClient.get("/bibliotecario.php");
      setBibliotecarios(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar bibliotecarios:", error);
    }
  };

  useEffect(() => {
    cargarBibliotecarios();
  }, []);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/bibliotecario.php", nuevo);
      setNuevo({ nombre: "", correo: "" });
      document.getElementById("modal-crear").close();
      cargarBibliotecarios();
      mostrarMensaje("Bibliotecario registrado correctamente");
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put("/bibliotecario.php", editar);
      setEditar(null);
      document.getElementById("modal-editar").close();
      cargarBibliotecarios();
      mostrarMensaje("Bibliotecario actualizado correctamente");
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  const eliminar = async (id) => {
    try {
      await axiosClient.delete(`/bibliotecario.php?id=${id}`);
      cargarBibliotecarios();
      mostrarMensaje("Bibliotecario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col items-center justify-start py-6 px-4">
      <h1 className="text-3xl font-bold text-[#2F8C8C] mb-4">Bibliotecarios</h1>

      <div className="mb-6">
        <button
          onClick={() => document.getElementById("modal-crear").showModal()}
          className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded font-medium"
        >
          Agregar Bibliotecario
        </button>
      </div>

      {bibliotecarios.length > 0 ? (
        <table className="w-full max-w-5xl text-center shadow-md rounded overflow-hidden">
          <thead className="bg-blue-200 text-[#1E3A8A] font-semibold">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Correo</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white text-black">
            {bibliotecarios.map((b) => (
              <tr key={b.id_bibliotecario} className="border-b">
                <td className="py-2">{b.id_bibliotecario}</td>
                <td>{b.nombre}</td>
                <td>{b.correo}</td>
                <td className="space-x-2 py-2">
                  <button
                    onClick={() => {
                      setEditar(b);
                      document.getElementById("modal-editar").showModal();
                    }}
                    className="bg-[#489C9C] hover:bg-[#3b8a8a] text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setBibliotecarioAEliminar(b);
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
          No hay bibliotecarios registrados.
        </p>
      )}

      {/* Toast */}
      <div className="mt-8 w-full max-w-5xl flex justify-center">
        <Toast mensaje={mensaje} visible={mostrarToast} />
      </div>

      {/* Modal Crear */}
      <dialog id="modal-crear" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md"> 
        <form method="dialog" onSubmit={handleCrear} className="space-y-4">
          <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Nuevo Bibliotecario</h2>
          <FormBibliotecario bibliotecario={nuevo} setBibliotecario={setNuevo} />
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("modal-crear").close()}
              className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </dialog>

      {/* Modal Editar */}
      <dialog id="modal-editar" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        {editar && (
          <form method="dialog" onSubmit={handleEditar} className="space-y-4">
            <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Editar Bibliotecario</h2>
            <FormBibliotecario bibliotecario={editar} setBibliotecario={setEditar} />
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("modal-editar").close()}
                className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </dialog>

      {/* Modal Eliminar */}
      <dialog id="modal-eliminar" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        <h2 className="text-lg font-semibold text-center text-[#2F8C8C] mb-4">
          ¿Estás segura de que deseas eliminar este bibliotecario?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              eliminar(bibliotecarioAEliminar.id_bibliotecario);
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

export default Bibliotecario;