import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        correo: email,
        contraseña: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      const decoded: any = jwtDecode(token);

      alert("Inicio de sesión exitoso");

      decoded.isAdmin ? navigate("/Dashboard(admin)") : navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Error al iniciar sesión");
    }
  };

  return (
    <div className=".login-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="Ingrese su correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón de Login */}
          <button type="submit" className="btn btn-primary w-100">Ingresar</button>

          {/* Mensaje de error */}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </form>

        {/* Sección para crear una cuenta */}
        <div className="text-center mt-4">
          <p>¿No tienes cuenta?</p>
          <Link to="/Registro" className="btn btn-secondary">
            Crear Cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
