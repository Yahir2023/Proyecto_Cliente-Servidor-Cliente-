import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";

function DashboardA() {
  const [usuario, setUsuario] = useState<{ nombre?: string } | null>(null);
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

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h1>Bienvenido al Dashboard {usuario?.nombre}</h1>
         {/* Botón de Bootstrap */}
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate("/Dashboard")}
        >
        salir
        </button>
      </div>
    </div>
  );
}

export default DashboardA;
