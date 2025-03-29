import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Usuario {
  nombre: string;
  correo: string;
}

function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/auth/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUsuario(response.data.usuario);
        })
        .catch((error) => {
          console.error("Error al obtener perfil:", error);
          toast.error("Error al cargar perfil.");
        });
    }
  }, []);

  if (!usuario) {
    return (
      <div className="container mt-4">
        <ToastContainer />
        <h2>Cargando perfil...</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2>Perfil de {usuario.nombre}</h2>
      <p><strong>Correo:</strong> {usuario.correo}</p>
    </div>
  );
}

export default Perfil;
