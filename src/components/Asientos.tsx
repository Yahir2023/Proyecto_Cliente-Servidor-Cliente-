import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";

// Definir la estructura de datos de un asiento
interface Asiento {
  id_asiento: number;
  id_sala: number;
  numero_asiento: string;
  fila: string;
  tipo_asiento: string;
  precio_extra: number;
}

// Definir la estructura de datos de una sala
interface Sala {
  id_sala: number;
  nombre: string;
  capacidad: number;
}

const Asientos = () => {
  const [asientos, setAsientos] = useState<Asiento[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [newAsiento, setNewAsiento] = useState<Asiento>({
    id_asiento: 0,
    id_sala: 0,
    numero_asiento: "",
    fila: "",
    tipo_asiento: "Standard",  // Valor inicial "Standard"
    precio_extra: 0.0,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [token] = useState<string | null>(localStorage.getItem("token"));
  const [maxCapacityReached, setMaxCapacityReached] = useState<boolean>(false);

  // Cargar los asientos desde la API
  const loadAsientos = async () => {
    if (!token) {
      toast.error("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3000/asientos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAsientos(response.data);
    } catch (error) {
      toast.error("Error al cargar los asientos");
    }
  };

  // Cargar las salas desde la API
  const loadSalas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/salas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalas(response.data);
    } catch (error) {
      toast.error("Error al cargar las salas");
    }
  };

  useEffect(() => {
    if (token) {
      loadAsientos();
      loadSalas();
    }
  }, [token]);

  // Verificar si la sala ha alcanzado su capacidad máxima
  const checkMaxCapacity = (idSala: number) => {
    const sala = salas.find((s) => s.id_sala === idSala);
    const seatsInRoom = asientos.filter((asiento) => asiento.id_sala === idSala).length;

    if (sala && seatsInRoom >= sala.capacidad) {
      setMaxCapacityReached(true);
    } else {
      setMaxCapacityReached(false);
    }
  };

  // Verificar si el asiento ya existe en la misma sala
  const isDuplicateAsiento = (idSala: number, numero_asiento: string, fila: string) => {
    return asientos.some(
      (asiento) => asiento.id_sala === idSala && asiento.numero_asiento === numero_asiento && asiento.fila === fila
    );
  };

  // Crear nuevo asiento
  const handleCreateAsiento = async () => {
    if (!newAsiento.numero_asiento || !newAsiento.fila || newAsiento.id_sala === 0) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    // Verificar si la sala ha alcanzado la capacidad máxima antes de crear el asiento
    checkMaxCapacity(newAsiento.id_sala);

    if (maxCapacityReached) {
      toast.error("La sala ha alcanzado su capacidad máxima.");
      return;
    }

    // Verificar si el asiento ya existe
    if (isDuplicateAsiento(newAsiento.id_sala, newAsiento.numero_asiento, newAsiento.fila)) {
      toast.error("El asiento ya existe en la misma sala, fila y número.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/asientos", newAsiento, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewAsiento({
        id_asiento: 0,
        id_sala: 0,
        numero_asiento: "",
        fila: "",
        tipo_asiento: "Standard",  // Reiniciar a "Standard"
        precio_extra: 0.0,
      });
      loadAsientos();
      toast.success("Asiento creado exitosamente");
    } catch (error) {
      toast.error("Error al crear el asiento");
    }
  };

  // Editar asiento
  const handleEditAsiento = (asiento: Asiento) => {
    setNewAsiento(asiento);
    setIsEditing(true);
    setEditId(asiento.id_asiento);
  };

  // Actualizar asiento
  const handleUpdateAsiento = async () => {
    if (!newAsiento.numero_asiento || !newAsiento.fila || newAsiento.id_sala === 0) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    // Verificar si la sala ha alcanzado la capacidad máxima antes de actualizar el asiento
    checkMaxCapacity(newAsiento.id_sala);

    if (maxCapacityReached) {
      toast.error("La sala ha alcanzado su capacidad máxima.");
      return;
    }

    // Verificar si el asiento ya existe en la misma sala (para actualizar)
    if (isDuplicateAsiento(newAsiento.id_sala, newAsiento.numero_asiento, newAsiento.fila)) {
      toast.error("El asiento ya existe en la misma sala, fila y número.");
      return;
    }

    if (editId) {
      try {
        await axios.put(`http://localhost:3000/asientos/${editId}`, newAsiento, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsEditing(false);
        setNewAsiento({
          id_asiento: 0,
          id_sala: 0,
          numero_asiento: "",
          fila: "",
          tipo_asiento: "Standard",  // Reiniciar a "Standard"
          precio_extra: 0.0,
        });
        loadAsientos();
        toast.success("Asiento actualizado exitosamente");
      } catch (error) {
        toast.error("Error al actualizar el asiento");
      }
    }
  };

  // Eliminar asiento
  const handleDeleteAsiento = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/asientos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadAsientos();
      toast.success("Asiento eliminado exitosamente");
    } catch (error) {
      toast.error("Error al eliminar el asiento");
    }
  };

  // Función para ordenar los asientos por el nombre de la sala
  const sortAsientosBySala = () => {
    return asientos.sort((a, b) => {
      const salaA = salas.find((sala) => sala.id_sala === a.id_sala)?.nombre || "";
      const salaB = salas.find((sala) => sala.id_sala === b.id_sala)?.nombre || "";
      return salaA.localeCompare(salaB);
    });
  };

  return (
    <div className="main-content mt-5">
      <Sidebar />
      <h2 className="mb-4">Gestionar Asientos</h2>

      {/* Formulario para agregar o editar asientos */}
      <div className="mb-4">
        <h3>{isEditing ? "Editar Asiento" : "Agregar Nuevo Asiento"}</h3>
        <form>
          <div className="mb-3">
            <label className="form-label">Sala</label>
            <select
              className="form-control"
              value={newAsiento.id_sala}
              onChange={(e) => {
                const idSala = parseInt(e.target.value);
                setNewAsiento({ ...newAsiento, id_sala: idSala });
                checkMaxCapacity(idSala); // Verificar capacidad al cambiar de sala
              }}
            >
              <option value="0">Seleccione una sala</option>
              {salas.map((sala) => (
                <option key={sala.id_sala} value={sala.id_sala}>
                  {sala.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Número de Asiento</label>
            <input
              type="text"
              className="form-control"
              value={newAsiento.numero_asiento}
              onChange={(e) => setNewAsiento({ ...newAsiento, numero_asiento: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Fila</label>
            <input
              type="text"
              className="form-control"
              value={newAsiento.fila}
              onChange={(e) => setNewAsiento({ ...newAsiento, fila: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tipo de Asiento</label>
            <select
              className="form-control"
              value={newAsiento.tipo_asiento}
              onChange={(e) => setNewAsiento({ ...newAsiento, tipo_asiento: e.target.value })}
            >
              <option value="Standard">Estándar</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={isEditing ? handleUpdateAsiento : handleCreateAsiento}
          >
            {isEditing ? "Actualizar Asiento" : "Agregar Asiento"}
          </button>
        </form>
      </div>

      {/* Tabla de asientos */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sala</th>
            <th>Número de Asiento</th>
            <th>Fila</th>
            <th>Tipo de Asiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortAsientosBySala().map((asiento) => (
            <tr key={asiento.id_asiento}>
              <td>{salas.find((sala) => sala.id_sala === asiento.id_sala)?.nombre}</td>
              <td>{asiento.numero_asiento}</td>
              <td>{asiento.fila}</td>
              <td>{asiento.tipo_asiento}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditAsiento(asiento)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleDeleteAsiento(asiento.id_asiento)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Asientos;
