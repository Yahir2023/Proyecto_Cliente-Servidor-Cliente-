import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Asegúrate de instalar esta dependencia: npm install jwt-decode

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
      // Se envían los datos usando los nombres que espera el servidor: correo y contraseña
      const response = await axios.post("http://localhost:3000/auth/login", { 
        correo: email, 
        contraseña: password 
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      const decoded: any = jwtDecode(token);
      alert("Inicio de sesión exitoso");
      if (decoded.isAdmin) {
        navigate("/Admin");
      } else {
        navigate("/Usuarios");
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ingresar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
