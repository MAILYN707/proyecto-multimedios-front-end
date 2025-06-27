import React, { useEffect, useState } from "react";
import { axiosClient } from "../services/axiosClient";
import Toast from "../components/Toast";
import FormLibro from "../components/FormLibro";

const Libro = () => {
  const [libros, setLibros] = useState([]);
  const [nuevo, setNuevo] = useState({
    titulo: "",
    isbn: "",
    anio_publicacion: "",
    id_editorial: "",
    id_categoria: "",
  });
  const [editar, setEditar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [mostrarToast, setMostrarToast] = useState(false);
  const [libroAEliminar, setLibroAEliminar] = useState(null);

  const cargarLibros = async () => {
    try {
      const res = await axiosClient.get("/libro.php");
      setLibros(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar libros:", error);
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/libro.php", nuevo);
      setNuevo({
        titulo: "",
        isbn: "",
        anio_publicacion: "",
        id_editorial: "",
        id_categoria: "",
      });
      document.getElementById("modal-crear-libro").close();
      cargarLibros();
      mostrarMensaje("Libro registrado correctamente");
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    try {
        console.log("Editando libro:", editar);

      await axiosClient.put("/libro.php", editar);
      setEditar(null);
      document.getElementById("modal-editar-libro").close();
      cargarLibros();
      mostrarMensaje("Libro actualizado correctamente");
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  const eliminar = async (id) => {
    try {
      await axiosClient.delete(`/libro.php?id=${id}`);
      cargarLibros();
      mostrarMensaje("Libro eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col items-center justify-start py-6 px-4">
      <h1 className="text-3xl font-bold text-[#2F8C8C] mb-4">Libros</h1>

      <div className="mb-6">
        <button
          onClick={() => document.getElementById("modal-crear-libro").showModal()}
          className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded font-medium"
        >
          Agregar Libro
        </button>
      </div>

      {libros.length > 0 ? (
        <table className="w-full max-w-6xl text-center shadow-md rounded overflow-hidden">
          <thead className="bg-blue-200 text-[#1E3A8A] font-semibold">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Título</th>
              <th className="py-2 px-4">ISBN</th>
              <th className="py-2 px-4">Año</th>
              <th className="py-2 px-4">Editorial</th>
              <th className="py-2 px-4">Categoría</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white text-black">
            {libros.map((l) => (
              <tr key={l.id_libro} className="border-b">
                <td>{l.id_libro}</td>
                <td>{l.titulo}</td>
                <td>{l.isbn}</td>
                <td>{l.anio_publicacion}</td>
                <td>{l.nombre_editorial}</td>
                <td>{l.nombre_categoria}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => {
                        const libroEdit = {
                            id_libro: l.id_libro,
                            titulo: l.titulo,
                            isbn: l.isbn,
                            anio_publicacion: l.anio_publicacion,
                            id_editorial: l.id_editorial,
                            id_categoria: l.id_categoria
                        };
                        setEditar(libroEdit);
                        document.getElementById("modal-editar-libro").showModal();
                        }}

                    className="bg-[#489C9C] hover:bg-[#3b8a8a] text-white px-3 py-1 rounded-md"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setLibroAEliminar(l);
                      document.getElementById("modal-eliminar-libro").showModal();
                    }}
                    className="bg-[#E57373] hover:bg-[#d65a5a] text-white px-3 py-1 rounded-md"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-700 mt-6">No hay libros registrados.</p>
      )}

      {/* Toast */}
      <Toast mensaje={mensaje} visible={mostrarToast} />

      {/* Modal Crear */}
      <dialog id="modal-crear-libro" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        <form method="dialog" onSubmit={handleCrear} className="space-y-4">
          <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Nuevo Libro</h2>
          <FormLibro libro={nuevo} setLibro={setNuevo} />
          <div className="flex justify-end gap-2">
            <button type="submit" className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded">Guardar</button>
            <button type="button" onClick={() => document.getElementById("modal-crear-libro").close()} className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      </dialog>

      {/* Modal Editar */}
      <dialog id="modal-editar-libro" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        {editar && (
          <form method="dialog" onSubmit={handleEditar} className="space-y-4">
            <h2 className="text-xl font-bold text-[#2F8C8C] text-center">Editar Libro</h2>
            <FormLibro libro={editar} setLibro={setEditar} />
            <div className="flex justify-end gap-2">
              <button type="submit" className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded">Actualizar</button>
              <button type="button" onClick={() => document.getElementById("modal-editar-libro").close()} className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
          </form>
        )}
      </dialog>

      {/* Modal Eliminar */}
      <dialog id="modal-eliminar-libro" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        <h2 className="text-lg font-semibold text-center text-[#2F8C8C] mb-4">
          ¿Estás seguro de que deseas eliminar este libro?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              eliminar(libroAEliminar.id_libro);
              document.getElementById("modal-eliminar-libro").close();
            }}
            className="bg-[#E57373] hover:bg-[#d65a5a] text-white px-4 py-2 rounded"
          >
            Eliminar
          </button>
          <button
            onClick={() => document.getElementById("modal-eliminar-libro").close()}
            className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Libro;
