import React, { useEffect, useState } from "react";
import { axiosClient } from "../services/axiosClient";
import FormMiembro from "../components/FormMiembro";
import Toast from "../components/Toast";

const Miembro = () => {
  const [miembros, setMiembros] = useState([]);
  const [miembro, setMiembro] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [miembroAEliminar, setMiembroAEliminar] = useState(null);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [detalle, setDetalle] = useState({ id_miembro: "", direccion: "", telefono: "" });

  const [modalVerDetalle, setModalVerDetalle] = useState(false);

  const obtenerMiembros = async () => {
    try {
      const { data } = await axiosClient.get("/miembro.php");
      setMiembros(data);
    } catch (error) {
      Toast("Error al cargar miembros", "error");
    }
  };

  // const obtenerDetalle = async (id) => {
  //   try {
  //     const { data } = await axiosClient.get(`/miembro_detalle.php?id=${id}`);
  //     setDetalle(data ?? { direccion: "", telefono: "" });
  //   } catch (error) {
  //     Toast("Error al cargar detalles", "error");
  //   }
  // };

  // const obtenerDetalle = async (id) => {
  //   try {
  //     const { data } = await axiosClient.get(`/miembro_detalle.php?id_miembro=${id}`);
  //     setDetalle(data ?? { direccion: "", telefono: "" });
  //   } catch (error) {
  //     Toast("Error al cargar detalles", "error");
  //   }
  // };

  const obtenerDetalle = async (id) => {
  try {
    const { data } = await axiosClient.get(`/miembro_detalle.php?id_miembro=${id}`);
    setDetalle({ id_miembro: "", direccion: "", telefono: "" });

  } catch (error) {
    Toast("Error al cargar detalles", "error");
  }
};




  const guardarDetalle = async () => {
    try {
      if (!detalle.direccion || !detalle.telefono) {
        Toast("Completa todos los campos de detalle", "error");
        return;
      }

      const datos = { ...detalle, id_miembro: miembro.id_miembro };

      await axiosClient.post("/miembro_detalle.php", datos);
      Toast("Detalles agregados correctamente", "success");
      setModalDetalle(false);
      setDetalle({ direccion: "", telefono: "" });
    } catch (error) {
      Toast("Error al guardar detalle", "error");
    }
  };


  useEffect(() => {
    obtenerMiembros();
  }, []);

  const guardarMiembro = async () => {
    try {
      if (!miembro.nombre || !miembro.correo) {
        Toast("Por favor completa todos los campos", "error");
        return;
      }

      if (miembro.id_miembro) {
        await axiosClient({
          method: "PUT",
          url: "/miembro.php",
          data: miembro,
        });
        Toast("Miembro actualizado");
      } else {
        await axiosClient.post("/miembro.php", miembro);
        Toast("Miembro creado");
      }

      setModal(false);
      setMiembro(null);
      obtenerMiembros();
    } catch (error) {
      Toast("Error al guardar miembro", "error");
    }
  };

  const solicitarEliminacion = (miembro) => {
    setMiembroAEliminar(miembro);
    setModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    try {
      await axiosClient.delete(`/miembro.php?id=${miembroAEliminar.id_miembro}`);
      Toast("Miembro eliminado");
      setModalEliminar(false);
      setMiembroAEliminar(null);
      obtenerMiembros();
    } catch (error) {
      Toast("Error al eliminar miembro", "error");
    }
  };

  const verDetalle = async (m) => {
    setMiembro(m);
    await obtenerDetalle(m.id_miembro);
    setModalDetalle(true);
  };

  const verSoloDetalle = async (m) => {
    setMiembro(m);
    await obtenerDetalle(m.id_miembro);
    setModalVerDetalle(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Miembros</h1>
        <button
          onClick={() => {
            setMiembro({ nombre: "", correo: "" });
            setModal(true);
          }}
          className="bg-[#2F8C8C] text-white px-4 py-2 rounded transition-all duration-200 hover:scale-105 hover:bg-[#276f6f] active:scale-95"
        >
          Nuevo Miembro
        </button>
      </div>

      <table className="w-full table-auto border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {miembros.map((m, index) => (
            <tr key={m.id_miembro}>
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{m.nombre}</td>
              <td className="p-2">{m.correo}</td>
              <td className="p-2 space-x-2">
                <button
                  className="bg-[#2F8C8C] text-white px-3 py-1 rounded transition-all duration-200 hover:scale-105 hover:bg-[#276f6f] active:scale-95"
                  onClick={() => {
                    setMiembro(m);
                    setModal(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded transition-all duration-200 hover:bg-red-700 hover:scale-105 active:scale-95"
                  onClick={() => solicitarEliminacion(m)}
                >
                  Eliminar
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded transition-all duration-200 hover:bg-yellow-600 hover:scale-105 active:scale-95"
                  onClick={() => verDetalle(m)}
                >
                  Agregar Detalles
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded transition-all duration-200 hover:bg-blue-600 hover:scale-105 active:scale-95"
                  onClick={() => verSoloDetalle(m)}
                >
                  Ver Detalles
                </button>


              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Modal Crear/Editar Miembro */}
      {modal && (
        <dialog open className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">{miembro?.id_miembro ? "Editar" : "Nuevo"} Miembro</h2>
            <FormMiembro miembro={miembro} setMiembro={setMiembro} />
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={guardarMiembro} className="bg-[#2F8C8C] text-white px-4 py-2 rounded hover:bg-[#276f6f] hover:scale-105 active:scale-95">Guardar</button>
              <button onClick={() => setModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 hover:scale-105 active:scale-95">Cancelar</button>
            </div>
          </div>
        </dialog>
      )}

      {/* Modal Detalles */}

      {modalDetalle && (
        <dialog open className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Agregar detalles a {miembro?.nombre}</h2>

            {/* Campo oculto (solo por seguridad visual, no se envía con el formulario) */}
            <p className="text-sm text-gray-500 mb-2">ID del miembro: {miembro?.id_miembro}</p>

            <input
              type="text"
              placeholder="Dirección"
              value={detalle.direccion}
              onChange={(e) => setDetalle({ ...detalle, direccion: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={detalle.telefono}
              onChange={(e) => setDetalle({ ...detalle, telefono: e.target.value })}
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={guardarDetalle}
                className="bg-[#2F8C8C] text-white px-4 py-2 rounded hover:bg-[#276f6f] hover:scale-105 active:scale-95"
              >
                Guardar
              </button>
              <button
                onClick={() => setModalDetalle(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 hover:scale-105 active:scale-95"
              >
                Cerrar
              </button>
            </div>
          </div>
        </dialog>
      )}



      {/* Modal Confirmar Eliminación */}
      {modalEliminar && (
        <dialog open className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4 text-red-600">¿Estás seguro?</h2>
            <p className="mb-4">¿Deseas eliminar al miembro <strong>{miembroAEliminar?.nombre}</strong>?</p>
            <div className="flex justify-end space-x-2">
              <button onClick={confirmarEliminacion} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover:scale-105 active:scale-95">Eliminar</button>
              <button onClick={() => setModalEliminar(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 hover:scale-105 active:scale-95">Cancelar</button>
            </div>
          </div>
        </dialog>
      )}

      {modalVerDetalle && (
        <dialog open className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Detalles de {miembro?.nombre}</h2>

            <div className="mb-4">
              <p><strong>Dirección:</strong> {detalle?.direccion || "No registrada"}</p>
              <p><strong>Teléfono:</strong> {detalle?.telefono || "No registrado"}</p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setModalVerDetalle(false);
                  setModalDetalle(true);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 hover:scale-105 active:scale-95"
              >
                Modificar
              </button>
              <button
                onClick={() => setModalVerDetalle(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 hover:scale-105 active:scale-95"
              >
                Cerrar
              </button>
            </div>
          </div>
        </dialog>
      )}





    </div>
  );
};

export default Miembro;