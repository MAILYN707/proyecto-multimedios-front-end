import React, { useEffect, useState } from "react";
import { axiosClient } from "../services/axiosClient";
import Toast from "../components/Toast";
import FormLibro from "../components/FormLibro";
import { useSearchParams } from "react-router-dom";

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

  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [autoresDelLibro, setAutoresDelLibro] = useState([]);
  const [autoresDisponibles, setAutoresDisponibles] = useState([]);
  const [autorSeleccionado, setAutorSeleccionado] = useState("");

  const [cargandoAutores, setCargandoAutores] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [editoriales, setEditoriales] = useState([]);

  const [searchParams] = useSearchParams();
  const idAutor = searchParams.get("autor");

  const cargarLibros = async () => {
    try {
      const res = await axiosClient.get("/libro.php");
      setLibros(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar libros:", error);
    }
  };

  const cargarAutoresDeLibro = async (id_libro) => {
    try {
      setCargandoAutores(true);
      const res = await axiosClient.get("/libroautor.php");
      const relaciones = res.data.filter((rel) => rel.id_libro === id_libro);
      const autores = await axiosClient.get("/autor.php");
      const autoresAsociados = autores.data.filter((a) =>
        relaciones.some((rel) => rel.id_autor === a.id_autor)
      );
      setAutoresDelLibro(autoresAsociados);
    } catch (error) {
      console.error("Error al cargar autores del libro:", error);
    } finally {
      setCargandoAutores(false); // se desactiva la carga
    }
  };


  const cargarTodosLosAutores = async () => {
    try {
      const res = await axiosClient.get("/autor.php");
      setAutoresDisponibles(res.data);
    } catch (error) {
      console.error("Error al cargar autores disponibles:", error);
    }
  };

  const asociarAutor = async () => {
    if (!libroSeleccionado || !libroSeleccionado.id_libro) {
      mostrarMensaje("⚠️ No hay un libro seleccionado correctamente.");
      return;
    }

    const yaExiste = autoresDelLibro.some(
      (a) => a.id_autor === parseInt(autorSeleccionado)
    );

    if (yaExiste) {
      mostrarMensaje("⚠️ Este autor ya está asignado a este libro.");
      return;
    }

    try {
      const idLibroActual = libroSeleccionado.id_libro;

      await axiosClient.post("/libroautor.php", {
        id_libro: idLibroActual,
        id_autor: parseInt(autorSeleccionado),
      });

      mostrarMensaje("Autor asignado correctamente");
      setAutorSeleccionado("");
      document.getElementById("modal-agregar-autor").close();

      // ⚠️ Asegurarse de recargar autores del libro correcto
      cargarAutoresDeLibro(idLibroActual);

    } catch (error) {
      console.error("Error al asociar autor:", error);
    }
  };

  const eliminarRelacionAutor = async (idAutor) => {
    try {
      if (!libroSeleccionado?.id_libro) return;

      await axiosClient.delete("/libroautor.php", {
        data: {
          id_libro: libroSeleccionado.id_libro,
          id_autor: idAutor,
        },
      });

      mostrarMensaje("Autor eliminado del libro");
      cargarAutoresDeLibro(libroSeleccionado.id_libro);
      document.getElementById("modal-eliminar-autor").close();
      setAutorSeleccionado(""); // ← agregar esto después de eliminar
    } catch (error) {
      console.error("Error al eliminar autor del libro:", error);
    }
  };

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
  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const url = idAutor ? `/libro.php?id_autor=${idAutor}` : "/libro.php";
        const res = await axiosClient.get(url);

        if (Array.isArray(res.data)) {
          setLibros(res.data);
        } else {
          console.warn("La respuesta de libros no es un array:", res.data);
          setLibros([]); // Para evitar errores al renderizar
        }
      } catch (error) {
        console.error("Error al cargar libros:", error);
        setLibros([]); // También importante si hay error
      }
    };

    fetchLibros();
  }, [idAutor]);


  // Cargar todos los autores una sola vez
  useEffect(() => {
    cargarTodosLosAutores();
  }, []);

  useEffect(() => {
    const cargarCategoriasYEditoriales = async () => {
      try {
        const [catRes, edRes] = await Promise.all([
          axiosClient.get("/categoria.php"),
          axiosClient.get("/editorial.php")
        ]);
        setCategorias(catRes.data);
        setEditoriales(edRes.data);
      } catch (error) {
        console.error("Error al cargar categorías o editoriales:", error);
      }
    };

    cargarCategoriasYEditoriales();
  }, []);

  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  return (
    <div className="bg-gray-300 min-h-screen flex flex-col items-center justify-start py-6 px-4">
            <h1 className="text-3xl font-bold text-[#2F8C8C] mb-4">Libros</h1>
            { idAutor && (
              <p className="text-lg text-gray-700 mb-2">
                Mostrando libros del autor: <span className="font-semibold text-[#2F8C8C]">
                  {autoresDisponibles.find(a => a.id_autor == idAutor)?.nombre_autor || `ID ${idAutor}`}
                </span>
              </p>
            )}
          <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
        <button
          onClick={() => document.getElementById("modal-crear-libro").showModal()}
          className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded font-medium"
        >
          Agregar Libro
        </button>

        <input
          type="text"
          placeholder="Buscar por título"
          value={filtroTitulo}
          onChange={(e) => setFiltroTitulo(e.target.value)}
          className="px-4 py-2 rounded border border-gray-400"
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-4 py-2 rounded border border-gray-400"
        >
          <option value="">Todas las categorías</option>
          {[...new Set(libros.map((l) => l.nombre_categoria))].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
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
            {libros
            .filter((l) =>
              l.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) &&
              (filtroCategoria === "" || l.nombre_categoria === filtroCategoria)
            )
            .map((l) => (

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
                      console.log("Seleccionado:", l);
                      setLibroSeleccionado(l); // 1. Seleccionamos el libro
                      setAutoresDelLibro([]);  // 2. Limpiamos los autores anteriores
                      setCargandoAutores(true); // 3. Mostramos el "cargando..."
                      document.getElementById("modal-detalles-libro").showModal(); // 4. Mostramos el modal primero
                      cargarAutoresDeLibro(l.id_libro); // 5. Cargamos autores en segundo plano
                    }}

                    className="bg-[#94B0B0] hover:bg-[#7a9999] text-white px-3 py-1 rounded-md"
                  >
                    Detalles
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
          <FormLibro
              libro={nuevo}
              setLibro={setNuevo}
              categorias={categorias}
              editoriales={editoriales}
            />
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
            <FormLibro
              libro={editar}
              setLibro={setEditar}
              categorias={categorias}
              editoriales={editoriales}
            />
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

      {/* Modal Detalles */}
      <dialog id="modal-detalles-libro" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        {libroSeleccionado && (
          <div>
            <h2 className="text-xl font-bold text-[#2F8C8C] text-center mb-4">Detalles del Libro</h2>
            <p><strong>Título:</strong> {libroSeleccionado.titulo}</p>
            <p><strong>ISBN:</strong> {libroSeleccionado.isbn}</p>
            <p><strong>Año:</strong> {libroSeleccionado.anio_publicacion}</p>
            <p><strong>Editorial:</strong> {libroSeleccionado.nombre_editorial}</p>
            <p><strong>Categoría:</strong> {libroSeleccionado.nombre_categoria}</p>
            <p className="mt-2 font-semibold">Autores asociados:</p>
            <ul className="list-disc list-inside">
              {cargandoAutores ? (
                <li className="text-gray-600 italic">Cargando autores...</li>
              ) : autoresDelLibro.length > 0 ? (
                autoresDelLibro.map((a) => <li key={a.id_autor}>{a.nombre_autor}</li>)
              ) : (
                <li className="text-gray-600">Sin autores asociados</li>
              )}
            </ul>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  cargarTodosLosAutores(); // Cargar autores existentes
                  document.getElementById("modal-agregar-autor").showModal();
                }}
                className="bg-[#2F8C8C] hover:bg-[#267676] text-white px-4 py-2 rounded"
              >
                Agregar Autor
              </button>
              {autoresDelLibro.length > 0 && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => document.getElementById("modal-eliminar-autor").showModal()}
                >
                  Eliminar Autor
                </button>
              )}
              <button
                onClick={() => document.getElementById("modal-detalles-libro").close()}
                className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </dialog>

      <dialog id="modal-agregar-autor" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-[#2F8C8C] text-center mb-4">Asignar Autor</h2>
          <p><strong>Libro:</strong> {libroSeleccionado?.titulo}</p>
          <select
            value={autorSeleccionado}
            onChange={(e) => setAutorSeleccionado(e.target.value)}
            className="mt-2 block w-full px-3 py-2 border rounded"
          >
            <option value="">Seleccione un autor</option>
            {autoresDisponibles.map((a) => {
              const yaAsignado = autoresDelLibro.some((al) => al.id_autor === a.id_autor);
              return (
                <option key={a.id_autor} value={a.id_autor} disabled={yaAsignado}>
                  {a.nombre_autor} {yaAsignado ? "(ya asignado)" : ""}
                </option>
              );
            })}
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={!autorSeleccionado}
              onClick={asociarAutor}
              className={`${
                autorSeleccionado ? 'bg-[#2F8C8C] hover:bg-[#267676]' : 'bg-gray-400 cursor-not-allowed'
              } text-white px-4 py-2 rounded`}
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setAutorSeleccionado("");
                document.getElementById("modal-agregar-autor").close();
              }}
              className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </dialog>
      
      <dialog id="modal-eliminar-autor" className="rounded-lg w-full max-w-md bg-gray-300 p-6 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-[#2F8C8C] text-center mb-4">Eliminar Autor</h2>
          <p><strong>Libro:</strong> {libroSeleccionado?.titulo}</p>
          <select
            value={autorSeleccionado}
            onChange={(e) => setAutorSeleccionado(e.target.value)}
            className="mt-2 block w-full px-3 py-2 border rounded"
          >
            <option value="">Seleccione un autor a eliminar</option>
            {autoresDelLibro.map((a) => (
              <option key={a.id_autor} value={a.id_autor}>{a.nombre_autor}</option>
            ))}
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <button
              disabled={!autorSeleccionado}
              onClick={() => eliminarRelacionAutor(parseInt(autorSeleccionado))}
              className={`${
                autorSeleccionado ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
              } text-white px-4 py-2 rounded`}

            >
              Eliminar
            </button>
            <button
              onClick={() => {
                setAutorSeleccionado("");
                document.getElementById("modal-eliminar-autor").close();
              }}
              className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </dialog>

    </div>
  );
};

export default Libro;
