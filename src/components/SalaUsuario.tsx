import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";// Sidebar is not used
//HOLA
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

const SalaUsuario = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [tiposSala, setTiposSala] = useState<TipoSala[]>([]);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
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

  const handleSelectSala = (sala: Sala) => {
    setSelectedSala(sala);
    toast.success(`Has seleccionado la sala: ${sala.nombre}`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Salas Disponibles</h2>

      {/* Mostrar salas disponibles */}
      <div className="row">
        {salas.length === 0 ? (
          <p>No hay salas disponibles en este momento.</p>
        ) : (
          salas.map((sala) => (
            <div key={sala.id_sala} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{sala.nombre}</h5>
                  <p className="card-text">
                    Capacidad: {sala.capacidad} personas
                    <br />
                    Tipo de Sala:{" "}
                    {tiposSala.find((tipo) => tipo.id_tipo_sala === sala.id_tipo_sala)?.nombre_tipo}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSelectSala(sala)}
                  >
                    Seleccionar Sala
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mostrar la sala seleccionada */}
      {selectedSala && (
        <div className="alert alert-success mt-4">
          <strong>Has seleccionado la sala: {selectedSala.nombre}</strong>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default SalaUsuario;
