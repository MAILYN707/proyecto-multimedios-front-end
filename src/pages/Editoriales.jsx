import React, { useEffect, useState } from "react";
import { axiosClient } from "@services/axiosClient";
import FormEditorial from "@components/Editoriales/FormEditorial";
import Toast from "@components/Toast";

const Editorial = () => {
  const [editoriales, setEditoriales] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre_editorial: "", telefono:"" });
  const [editar, setEditar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);
  const [editorialAEliminar, setEditorialAEliminar] = useState(null);

  const cargarEditoriales = async () => {
    try {
      const res = await axiosClient.get("/editorial.php");
      setEditoriales(Array.isArray(res.data) ? res.data : []);
      console.log("Respuesta editoriales:", res.data);

    } catch (error) {
      console.error("Error al cargar editoriales:", error);
    }
  };

  useEffect(() => {
    cargarEditoriales();
  }, []);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/editorial.php", nuevo);
      setNuevo({ nombre_editorial: "", telefono: "" });
      document.getElementById("modal-crear").close();
      cargarEditoriales();
      mostrarMensaje("Editorial registrada correctamente");
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put("/editorial.php", editar);
      setEditar(null);
      document.getElementById("modal-editar").close();
      cargarEditoriales();
      mostrarMensaje("Editorial actualizada correctamente");
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  const eliminar = async (id) => {
    try {
      await axiosClient.delete(`/editorial.php?id=${id}`);
      cargarEditoriales();
      mostrarMensaje("Editorial eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col items-center justify-start py-6 px-4">
      <h1 className="text-3xl font-bold text-[#2F8C8C] mb-4">Editoriales</h1>

      <div className="mb-6">
        <button
          onClick={() => document.getElementById("modal-crear").showModal()}
          className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded font-medium"
        >
          Agregar Editorial
        </button>
      </div>

      {editoriales.length > 0 ? (
        <table className="w-full max-w-5xl text-center shadow-md rounded overflow-hidden">
          <thead className="bg-blue-200 text-[#1E3A8A] font-semibold">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nombre de la Editorial</th>
              <th className="py-2 px-4">Teléfono</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white text-black">
            {editoriales.map((b) => (
              <tr key={b.id_editorial} className="border-b">
                <td className="py-2">{b.id_editorial}</td>
                <td>{b.nombre_editorial}</td>
                <td>{b.telefono}</td>
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
                      setEditorialAEliminar(b);
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
          No hay editoriales registradas.
        </p>
      )}

      {/* Toast */}
      <div className="mt-8 w-full max-w-5xl flex justify-center">
        <Toast mensaje={mensaje} visible={mostrarToast} />
      </div>

      {/* Modal Crear */}
      <dialog id="modal-crear" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md"> 
        <form method="dialog" onSubmit={handleCrear} className="space-y-4">
          <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Nueva Editorial</h2>
          <FormEditorial editorial={nuevo} setEditorial={setNuevo} />
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
            <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Editar Editorial</h2>
            <FormEditorial editorial={editar} setEditorial={setEditar} />
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
          ¿Estás seguro de que deseas eliminar esta editorial?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              eliminar(editorialAEliminar.id_editorial);
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

export default Editorial;