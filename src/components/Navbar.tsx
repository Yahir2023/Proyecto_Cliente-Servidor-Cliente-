import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Navbar() {
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/auth/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setNombreUsuario(response.data.usuario.nombre);
        })
        .catch((error) => {
          console.error("Error al cargar perfil:", error);
          toast.error("Error al cargar perfil.");
        });
    } else {
      setNombreUsuario(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setNombreUsuario(null);
    toast.info("Sesión cerrada correctamente.");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            CINE-LIVE
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/peliculas">
                  Películas
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto">
              {nombreUsuario ? (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {nombreUsuario}
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link className="dropdown-item" to="/perfil">
                        Ver Perfil
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/mis-funciones">
                        Mis Funciones
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogin}>
                    Iniciar sesión
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
