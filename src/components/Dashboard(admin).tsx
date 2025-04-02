import { useState, useEffect } from "react";   
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function DashboardA() {
  // Se amplía la definición del objeto usuario para incluir el rol.
  const [usuario, setUsuario] = useState<{ nombre?: string; rol?: string } | null>(null);
  const navigate = useNavigate(); // Para redireccionar

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:3000/auth/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.usuario && response.data.usuario.nombre) {
          setUsuario(response.data.usuario);
        } else {
          console.error("Respuesta inesperada del servidor", response.data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el perfil:", error.response?.data || error.message);
      });
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="main-content">
      <Sidebar />
      <div className="ml-250 p-4" style={{ width: "100%" }}>
        <h1>
          Bienvenido al Dashboard {usuario?.nombre}{" "}
          {usuario?.rol && <span>({usuario.rol})</span>}
        </h1>
        <button 
          className="btn btn-primary mt-3"
          onClick={handleCerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default DashboardA;
