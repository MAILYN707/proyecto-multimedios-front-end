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

  const obtenerDetalle = async (id) => {
    try {
      const { data } = await axiosClient.get(`/miembro_detalle.php?id_miembro=${id}`);
      if (data) {
        setDetalle({ ...data });
      } else {
        setDetalle({ id_miembro: id, direccion: "", telefono: "" });
      }
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

      const datos = {
        id_miembro: detalle.id_miembro,
        direccion: detalle.direccion,
        telefono: detalle.telefono,
      };

      await axiosClient.put("/miembro_detalle.php", datos);
      Toast("Detalles guardados correctamente", "success");
      setModalDetalle(false);
      setDetalle({ id_miembro: "", direccion: "", telefono: "" });
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
        await axiosClient.put("/miembro.php", miembro);
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
    <div className="p-6 min-h-screen bg-[#D3D7DE]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-[#2F8C8C] mb-4">Gestión de Miembros</h1>
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


      {miembros.length > 0 ? (
        <table className="w-full max-w-5xl text-center shadow-md rounded overflow-hidden">
          <thead className="bg-blue-200 text-[#1E3A8A] font-semibold">
            <tr>
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Correo</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white text-black">
            {miembros.map((m, index) => (
              <tr key={m.id_miembro} className="border-b">
                <td className="py-2">{index + 1}</td>
                <td>{m.nombre}</td>
                <td>{m.correo}</td>
                <td className="space-x-2 py-2">
                  {/* Botón Editar */}
                  <button
                    onClick={() => {
                      setMiembro(m);
                      setModal(true); // ✅ ID original respetado
                    }}
                    className="bg-[#489C9C] hover:bg-[#3b8a8a] text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Editar
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => solicitarEliminacion(m)} // ✅ lógica original
                    className="bg-[#E57373] hover:bg-[#d65a5a] text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Eliminar
                  </button>

                  {/* Botón Agregar Detalles */}
                  <button
                    onClick={() => verDetalle(m)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Agregar Detalles
                  </button>

                  {/* Botón Ver Detalles */}
                  <button
                    onClick={() => verSoloDetalle(m)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-700 mt-6">
          No hay miembros registrados.
        </p>
      )}







      {/* Modal Crear/Editar Miembro */}
      {modal && (
        <dialog open className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">{miembro?.id_miembro ? "Editar" : "Nuevo"} Miembro</h2>
            <FormMiembro miembro={miembro} setMiembro={setMiembro} />
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={guardarMiembro} className="bg-[#2F8C8C] text-white px-4 py-2 rounded hover:scale-105">Guardar</button>
              <button onClick={() => setModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:scale-105">Cancelar</button>
            </div>
          </div>
        </dialog>
      )}

      {/* Modal Detalles */}
      {modalDetalle && (
        <dialog open className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Agregar detalles a {miembro?.nombre}</h2>
            <p className="text-sm text-gray-500 mb-2">ID del miembro: {miembro?.id_miembro}</p>

            <input type="text" placeholder="Dirección" value={detalle.direccion} onChange={(e) => setDetalle({ ...detalle, direccion: e.target.value })} className="w-full mb-2 px-3 py-2 border rounded" />
            <input type="text" placeholder="Teléfono" value={detalle.telefono} onChange={(e) => setDetalle({ ...detalle, telefono: e.target.value })} className="w-full mb-4 px-3 py-2 border rounded" />

            <div className="flex justify-end space-x-2">
              <button onClick={guardarDetalle} className="bg-[#2F8C8C] text-white px-4 py-2 rounded hover:scale-105">Guardar</button>
              <button onClick={() => setModalDetalle(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:scale-105">Cerrar</button>
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
              <button onClick={confirmarEliminacion} className="bg-red-600 text-white px-4 py-2 rounded hover:scale-105">Eliminar</button>
              <button onClick={() => setModalEliminar(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:scale-105">Cancelar</button>
            </div>
          </div>
        </dialog>
      )}

      {/* Modal Ver Detalles */}
      {modalVerDetalle && (
        <dialog open className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Detalles de {miembro?.nombre}</h2>
            <div className="mb-4">
              <p><strong>Dirección:</strong> {detalle?.direccion || "No registrada"}</p>
              <p><strong>Teléfono:</strong> {detalle?.telefono || "No registrado"}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => { setModalVerDetalle(false); setModalDetalle(true); }} className="bg-yellow-500 text-white px-4 py-2 rounded hover:scale-105">Modificar</button>
              <button onClick={() => setModalVerDetalle(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:scale-105">Cerrar</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Miembro;