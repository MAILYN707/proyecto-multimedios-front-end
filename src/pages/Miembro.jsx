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

  // Para manejar el modal de edición/agregado de detalle
  const [modalDetalle, setModalDetalle] = useState(false);
  // Para manejar el modal de solo lectura de detalle
  const [modalVerDetalle, setModalVerDetalle] = useState(false);

  // Estado del detalle
  const [detalle, setDetalle] = useState({
    id_miembro: "",
    direccion: "",
    telefono: "",
  });
  // Flag que indica si ya existe en BD
  const [detalleExiste, setDetalleExiste] = useState(false);

  // 1) Carga inicial de miembros
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosClient.get("Miembro.php");
        setMiembros(data);
      } catch {
        Toast("Error al cargar miembros", "error");
      }
    })();
  }, []);

  // 2) Abre modal de “Agregar Detalles” con campos vacíos
  const nuevoDetalle = (m) => {
    setMiembro(m);
    setDetalle({
      id_miembro: m.id_miembro,
      direccion: "",
      telefono: "",
    });
    setDetalleExiste(false);
    setModalDetalle(true);
  };

  // 3) Abre modal de “Ver Detalles” y carga de BD (si existe)
  const verDetalle = async (m) => {
    setMiembro(m);
    try {
      const { data } = await axiosClient.get(
        `MiembroDetalle.php?id_miembro=${m.id_miembro}`
      );
      setDetalle({ ...data });       // rellena
      setDetalleExiste(true);
    } catch (err) {
      if (err.response?.status === 404) {
        // no existe aún
        setDetalle({ id_miembro: m.id_miembro, direccion: "", telefono: "" });
        setDetalleExiste(false);
      } else {
        Toast("Error al cargar detalles", "error");
      }
    }
    setModalVerDetalle(true);
  };

  // 4) Guarda o actualiza detalle según `detalleExiste`
  const guardarDetalle = async () => {
    if (!detalle.direccion || !detalle.telefono) {
      return Toast("Completa todos los campos de detalle", "error");
    }
    const payload = {
      id_miembro: detalle.id_miembro,
      direccion: detalle.direccion,
      telefono: detalle.telefono,
    };
    try {
      if (detalleExiste) {
        await axiosClient.put("MiembroDetalle.php", payload);
        Toast("Detalle actualizado correctamente", "success");
      } else {
        await axiosClient.post("MiembroDetalle.php", payload);
        Toast("Detalle agregado correctamente", "success");
      }
      setModalDetalle(false);
      setDetalle({ id_miembro: "", direccion: "", telefono: "" });
      setDetalleExiste(false);
    } catch {
      Toast("Error al guardar detalle", "error");
    }
  };

  // 5) Crea o edita miembro
  const guardarMiembro = async () => {
    if (!miembro.nombre || !miembro.correo) {
      return Toast("Por favor completa todos los campos", "error");
    }
    try {
      if (miembro.id_miembro) {
        await axiosClient.put("Miembro.php", miembro);
        Toast("Miembro actualizado", "success");
      } else {
        await axiosClient.post("Miembro.php", miembro);
        Toast("Miembro creado", "success");
      }
      setModal(false);
      setMiembro(null);
      const { data } = await axiosClient.get("Miembro.php");
      setMiembros(data);
    } catch {
      Toast("Error al guardar miembro", "error");
    }
  };

  // 6) Manejo eliminación
  const solicitarEliminacion = (m) => {
    setMiembroAEliminar(m);
    setModalEliminar(true);
  };
  const confirmarEliminacion = async () => {
    try {
      await axiosClient.delete(`Miembro.php?id=${miembroAEliminar.id_miembro}`);
      Toast("Miembro eliminado", "success");
      setModalEliminar(false);
      const { data } = await axiosClient.get("Miembro.php");
      setMiembros(data);
    } catch {
      Toast("Error al eliminar miembro", "error");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#D3D7DE]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-[#2F8C8C]">
          Gestión de Miembros
        </h1>
        <button
          onClick={() => {
            setMiembro({ nombre: "", correo: "" });
            setModal(true);
          }}
          className="bg-[#2F8C8C] text-white px-4 py-2 rounded hover:scale-105"
        >
          Nuevo Miembro
        </button>
      </div>

      {/* Tabla de miembros */}
      {miembros.length > 0 ? (
        <table className="w-full max-w-5xl mx-auto shadow-md rounded overflow-hidden">
          <thead className="bg-blue-200 text-[#1E3A8A] font-semibold">
            <tr>
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Nombre</th>
              <th className="py-2 px-4">Correo</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {miembros.map((m, i) => (
              <tr key={m.id_miembro} className="border-b">
                <td className="py-2 px-4 text-center">{i + 1}</td>
                <td className="py-2 px-4">{m.nombre}</td>
                <td className="py-2 px-4">{m.correo}</td>
                <td className="py-2 px-4 space-x-2 text-center">
                  <button
                    onClick={() => { setMiembro(m); setModal(true); }}
                    className="bg-[#489C9C] hover:bg-[#3b8a8a] text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => solicitarEliminacion(m)}
                    className="bg-[#E57373] hover:bg-[#d65a5a] text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => nuevoDetalle(m)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Agregar Detalles
                  </button>
                  <button
                    onClick={() => verDetalle(m)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-700">No hay miembros registrados.</p>
      )}

      {/* Modal crear/editar miembro */}
      {modal && (
        <dialog
          open
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
        >
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              {miembro?.id_miembro ? "Editar" : "Nuevo"} Miembro
            </h2>
            <FormMiembro miembro={miembro} setMiembro={setMiembro} />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={guardarMiembro}
                className="bg-[#2F8C8C] text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
              <button
                onClick={() => setModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Modal agregar/editar detalle */}
      {modalDetalle && (
        <dialog
          open
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
        >
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              Detallar a {miembro?.nombre}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              ID: {detalle.id_miembro}
            </p>
            <input
              type="text"
              placeholder="Dirección"
              value={detalle.direccion}
              onChange={(e) =>
                setDetalle((d) => ({ ...d, direccion: e.target.value }))
              }
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={detalle.telefono}
              onChange={(e) =>
                setDetalle((d) => ({ ...d, telefono: e.target.value }))
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={guardarDetalle}
                className="bg-[#2F8C8C] text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
              <button
                onClick={() => setModalDetalle(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Modal confirmar eliminación */}
      {modalEliminar && (
        <dialog
          open
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        >
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              ¿Estás seguro?
            </h2>
            <p className="mb-4">
              Eliminar a <strong>{miembroAEliminar?.nombre}</strong>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={confirmarEliminacion}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
              <button
                onClick={() => setModalEliminar(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Modal ver detalles */}
      {modalVerDetalle && (
        <dialog
          open
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
        >
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">
              Detalles de {miembro?.nombre}
            </h2>
            <p>
              <strong>Dirección:</strong> {detalle.direccion || "No registrada"}
            </p>
            <p>
              <strong>Teléfono:</strong> {detalle.telefono || "No registrado"}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalVerDetalle(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
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
