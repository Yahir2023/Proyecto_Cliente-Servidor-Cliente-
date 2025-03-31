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
  disponible: boolean;
}

// Definir la estructura de datos de una sala
interface Sala {
  id_sala: number;
  nombre: string;
  capacidad: number;
}

const AsientosUsuario = () => {
  const [asientos, setAsientos] = useState<Asiento[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [selectedAsientos, setSelectedAsientos] = useState<Asiento[]>([]);
  // Removed unused token state

  // Cargar los asientos desde la API
  const loadAsientos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/asientos");
      setAsientos(response.data);
    } catch (error) {
      toast.error("Error al cargar los asientos");
    }
  };

  // Cargar las salas desde la API
  const loadSalas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/salas");
      setSalas(response.data);
    } catch (error) {
      toast.error("Error al cargar las salas");
    }
  };

  useEffect(() => {
    loadAsientos();
    loadSalas();
  }, []);

  // Filtrar asientos disponibles
  const availableAsientos = (idSala: number) => {
    return asientos.filter((asiento) => asiento.id_sala === idSala && asiento.disponible);
  };

  // Seleccionar asiento
  const handleSelectAsiento = (asiento: Asiento) => {
    // Solo permitir seleccionar asientos disponibles
    if (asiento.disponible) {
      setSelectedAsientos((prev) => [...prev, asiento]);
      toast.success(`Asiento ${asiento.numero_asiento} seleccionado.`);
    } else {
      toast.error(`El asiento ${asiento.numero_asiento} no está disponible.`);
    }
  };

  return (
    <div className="container mt-5">
      <Sidebar />
      <h2 className="mb-4">Seleccionar Asientos</h2>

      {/* Lista de salas */}
      <div className="mb-4">
        <h3>Salas Disponibles</h3>
        <div className="list-group">
          {salas.map((sala) => (
            <div key={sala.id_sala} className="list-group-item">
              <h4>{sala.nombre}</h4>
              <p>Capacidad: {sala.capacidad} asientos</p>
              <div className="row">
                {availableAsientos(sala.id_sala).map((asiento) => (
                  <div key={asiento.id_asiento} className="col-2 mb-2">
                    <button
                      className={`btn ${
                        asiento.disponible ? "btn-success" : "btn-danger"
                      } btn-block`}
                      onClick={() => handleSelectAsiento(asiento)}
                      disabled={!asiento.disponible}
                    >
                      {asiento.numero_asiento}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mostrar los asientos seleccionados */}
      <div className="mb-4">
        <h4>Asientos Seleccionados</h4>
        <ul className="list-group">
          {selectedAsientos.map((asiento) => (
            <li key={asiento.id_asiento} className="list-group-item">
              Asiento {asiento.numero_asiento} - Sala:{" "}
              {salas.find((sala) => sala.id_sala === asiento.id_sala)?.nombre}
            </li>
          ))}
        </ul>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default AsientosUsuario;
