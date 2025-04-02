import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    // Validación de campos obligatorios
    if (!nombre || !apellido || !correo) {
      setError("Los campos Nombre, Apellido y Correo son obligatorios.");
      return;
    }

    // Validación de contraseña: si se ingresa una contraseña, se debe confirmar
    if (contraseña) {
      if (contraseña !== confirmarContraseña) {
        setError("La contraseña y su confirmación no coinciden.");
        return;
      }
    }

    // Validación de token
    if (!token) {
      setError("Debes ingresar el token de verificación que recibiste en tu correo.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/usuarios", {
        nombre,
        apellido,
        correo,
        contraseña,  // Si el usuario deja la contraseña vacía, el endpoint asignará "usuario" por defecto.
        token,       // Se envía el token para validación en el backend
      });
      setMensaje("Usuario registrado correctamente. ID: " + response.data.id);
      // Opcional: redirigir al login tras unos segundos o al hacer clic en un botón.
      // navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Error al registrar usuario");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          {/* Campo Apellido */}
          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese su apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>
          {/* Campo Correo */}
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingrese su correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          {/* Campo Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingrese su contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </div>
          {/* Campo Confirmar Contraseña */}
          <div className="mb-3">
            <label className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirme su contraseña"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
            />
          </div>
          {/* Campo Token de Verificación */}
          <div className="mb-3">
            <label className="form-label">Token de Verificación</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese el token enviado a su correo"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Registrar
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
        </form>
        <div className="text-center mt-3 d-flex justify-content-center align-items-center">
          <p className="mb-0 me-2">¿No tienes cuenta?</p>
          <Link to="/login" className="text-decoration-none">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Registro;
