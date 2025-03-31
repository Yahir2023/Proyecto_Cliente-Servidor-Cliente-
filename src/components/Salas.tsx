import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
//HOLA
// Definir la estructura de datos de una sala y tipo de sala
interface Sala {
  id_sala: number;
  id_tipo_sala: number;
  nombre: string;
  capacidad: number;
}

interface TipoSala {
  id_tipo_sala: number;
  nombre_tipo: string;
}

const Salas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [newSala, setNewSala] = useState<Sala>({
    id_sala: 0,
    id_tipo_sala: 1, // Por defecto a tipo "2D"
    nombre: "",
    capacidad: 0,
  });
  const [tiposSala, setTiposSala] = useState<TipoSala[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [token] = useState<string | null>(localStorage.getItem("token"));

  // Cargar las salas desde la API
  const loadSalas = async () => {
    if (!token) {
      toast.error("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/salas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalas(response.data);
    } catch (error) {
      toast.error("Error al cargar las salas");
    }
  };

  // Cargar los tipos de sala desde la API
  const loadTiposSala = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tipo_sala");
      setTiposSala(response.data);
    } catch (error) {
      toast.error("Error al cargar los tipos de sala");
    }
  };

  useEffect(() => {
    if (token) {
      loadSalas();
      loadTiposSala();
    }
  }, [token]);

  // Crear nueva sala
  const handleCreateSala = async () => {
    if (!newSala.nombre || !newSala.capacidad) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/salas", newSala, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewSala({
        id_sala: 0,
        id_tipo_sala: 1,
        nombre: "",
        capacidad: 0,
      });
      loadSalas();
      toast.success("Sala creada exitosamente");
    } catch (error) {
      toast.error("Error al crear la sala");
    }
  };

  // Editar sala
  const handleEditSala = (sala: Sala) => {
    setNewSala(sala);
    setIsEditing(true);
    setEditId(sala.id_sala);
  };

  // Actualizar sala
  const handleUpdateSala = async () => {
    if (!newSala.nombre || !newSala.capacidad) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    if (editId) {
      try {
        await axios.put(`http://localhost:3000/salas/${editId}`, newSala, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsEditing(false);
        setNewSala({
          id_sala: 0,
          id_tipo_sala: 1,
          nombre: "",
          capacidad: 0,
        });
        loadSalas();
        toast.success("Sala actualizada exitosamente");
      } catch (error) {
        toast.error("Error al actualizar la sala");
      }
    }
  };

  // Eliminar sala
  const handleDeleteSala = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/salas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadSalas();
      toast.success("Sala eliminada exitosamente");
    } catch (error) {
      toast.error("Error al eliminar la sala");
    }
  };

  return (
    <div className="container mt-5">
      <Sidebar />
      <h2 className="mb-4">Gestionar Salas</h2>

      {/* Formulario para agregar o editar salas */}
      <div className="mb-4">
        <h3>{isEditing ? "Editar Sala" : "Agregar Nueva Sala"}</h3>
        <form>
          <div className="mb-3">
            
            <label className="form-label">Nombre de la Sala</label>
            <input
              type="text"
              className="form-control"
              value={newSala.nombre}
              onChange={(e) => setNewSala({ ...newSala, nombre: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Capacidad</label>
            <input
              type="number"
              className="form-control"
              value={newSala.capacidad}
              onChange={(e) =>
                setNewSala({ ...newSala, capacidad: Number(e.target.value) })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tipo de Sala</label>
            
            <select
            
              className="form-control"
              value={newSala.id_tipo_sala}
              onChange={(e) =>
                setNewSala({ ...newSala, id_tipo_sala: Number(e.target.value) })
              }
            >
              {tiposSala.map((tipo) => (
                <option key={tipo.id_tipo_sala} value={tipo.id_tipo_sala}>
                  {tipo.nombre_tipo}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={isEditing ? handleUpdateSala : handleCreateSala}
          >
            {isEditing ? "Actualizar Sala" : "Agregar Sala"}
          </button>
        </form>
      </div>

      {/* Tabla de salas */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Capacidad</th>
            <th>Tipo de Sala</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala) => (
            <tr key={sala.id_sala}>
              <td>{sala.nombre}</td>
              <td>{sala.capacidad}</td>
              <td>
                {tiposSala.find((tipo) => tipo.id_tipo_sala === sala.id_tipo_sala)?.nombre_tipo}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditSala(sala)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteSala(sala.id_sala)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Salas;
