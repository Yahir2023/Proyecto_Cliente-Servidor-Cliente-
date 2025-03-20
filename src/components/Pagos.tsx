import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

// ==========================
// Interfaces y Tipado
// ==========================

export interface Pago {
  id_pago: number;
  id_compra: number;
  metodo_pago: string;
  estado_pago: string;
  transaction_id: string;
  monto_pagado: number;
  paypal_email: string;
  fecha_pago?: string;
}

export interface PagoFormData {
  id_compra: number;
  metodo_pago: string;
  estado_pago: string;
  transaction_id: string;
  monto_pagado: number;
  paypal_email: string;
}

// Se asume que el token JWT se guarda en localStorage.
const token = localStorage.getItem("token");

// ==========================
// Componente: Crear Pago
// (Accesible para usuarios autenticados)
// ==========================
const CrearPago: React.FC = () => {
  const [formData, setFormData] = useState<PagoFormData>({
    id_compra: 0,
    metodo_pago: "",
    estado_pago: "",
    transaction_id: "",
    monto_pagado: 0,
    paypal_email: "",
  });
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "id_compra" || name === "monto_pagado"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/pagos",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje(response.data.mensaje);
      // Redirige al historial del usuario o al detalle del pago creado
      navigate(`/pagos/${response.data.id_pago}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al crear el pago");
      } else {
        setError("Error desconocido");
      }
    }
  };

  return (
    <div>
      <h2>Crear Pago</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Compra: </label>
          <input
            type="number"
            name="id_compra"
            value={formData.id_compra}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Método de Pago: </label>
          <input
            type="text"
            name="metodo_pago"
            value={formData.metodo_pago}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Estado de Pago: </label>
          <input
            type="text"
            name="estado_pago"
            value={formData.estado_pago}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Transaction ID: </label>
          <input
            type="text"
            name="transaction_id"
            value={formData.transaction_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Monto Pagado: </label>
          <input
            type="number"
            name="monto_pagado"
            value={formData.monto_pagado}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Paypal Email: </label>
          <input
            type="email"
            name="paypal_email"
            value={formData.paypal_email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Crear Pago</button>
      </form>
    </div>
  );
};

// ==========================
// Componente: Listar todos los pagos (Admin)
// ==========================
const AdminPagosList: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await axios.get<Pago[]>("http://localhost:3000/pagos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPagos(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Error al obtener los pagos");
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchPagos();
  }, []);

  return (
    <div>
      <h2>Listado de Pagos (Admin)</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {pagos.map((pago) => (
          <li key={pago.id_pago}>
            <Link to={`/pagos/${pago.id_pago}`}>Pago {pago.id_pago}</Link> - Estado: {pago.estado_pago} - Monto: ${pago.monto_pagado}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ==========================
// Componente: Detalle y acciones sobre un pago (Admin)
// ==========================
const PagoDetail: React.FC = () => {
  const { id_pago } = useParams<{ id_pago: string }>();
  const [pago, setPago] = useState<Pago | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [motivoReembolso, setMotivoReembolso] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPago = async () => {
      try {
        const response = await axios.get<Pago>(
          `http://localhost:3000/pagos/${id_pago}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPago(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Error al obtener el pago");
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchPago();
  }, [id_pago]);

  const confirmarPago = async () => {
    try {
      await axios.post(
        `http://localhost:3000/pagos/${id_pago}/confirmar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (pago) setPago({ ...pago, estado_pago: "completado" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al confirmar el pago");
      } else {
        setError("Error desconocido");
      }
    }
  };

  const cancelarPago = async () => {
    try {
      await axios.post(
        `http://localhost:3000/pagos/${id_pago}/cancelar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (pago) setPago({ ...pago, estado_pago: "cancelado" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al cancelar el pago");
      } else {
        setError("Error desconocido");
      }
    }
  };

  const reembolsarPago = async () => {
    try {
      await axios.post(
        `http://localhost:3000/pagos/${id_pago}/reembolsar`,
        { motivo: motivoReembolso },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (pago) setPago({ ...pago, estado_pago: "en_reembolso" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al solicitar reembolso");
      } else {
        setError("Error desconocido");
      }
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!pago) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Detalle del Pago {pago.id_pago}</h2>
      <p>ID Compra: {pago.id_compra}</p>
      <p>Método de Pago: {pago.metodo_pago}</p>
      <p>Estado: {pago.estado_pago}</p>
      <p>Transaction ID: {pago.transaction_id}</p>
      <p>Monto Pagado: ${pago.monto_pagado}</p>
      <p>Paypal Email: {pago.paypal_email}</p>
      {pago.fecha_pago && <p>Fecha de Pago: {pago.fecha_pago}</p>}
      <div>
        {/* Acciones disponibles para el admin */}
        {pago.estado_pago !== "completado" && (
          <button onClick={confirmarPago}>Confirmar Pago</button>
        )}
        {pago.estado_pago !== "cancelado" && (
          <button onClick={cancelarPago}>Cancelar Pago</button>
        )}
        <div>
          <label>Motivo Reembolso: </label>
          <input
            type="text"
            value={motivoReembolso}
            onChange={(e) => setMotivoReembolso(e.target.value)}
          />
          <button onClick={reembolsarPago}>Reembolsar Pago</button>
        </div>
      </div>
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
};

// ==========================
// Componente: Historial de pagos de un usuario
// (El usuario autenticado o admin pueden ver el historial)
// ==========================
const PagosUsuario: React.FC = () => {
  const { id_usuario } = useParams<{ id_usuario: string }>();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPagosUsuario = async () => {
      try {
        const response = await axios.get<Pago[]>(
          `http://localhost:3000/usuarios/${id_usuario}/pagos`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPagos(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error ||
              "Error al obtener el historial de pagos"
          );
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchPagosUsuario();
  }, [id_usuario]);

  return (
    <div>
      <h2>Historial de Pagos del Usuario {id_usuario}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {pagos.map((pago) => (
          <li key={pago.id_pago}>
            <Link to={`/pagos/${pago.id_pago}`}>Pago {pago.id_pago}</Link> - Estado: {pago.estado_pago} - Monto: ${pago.monto_pagado}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ==========================
// Componente principal con rutas
// ==========================
const AppPagos: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/pagos/crear">Crear Pago</Link> |{" "}
        <Link to="/pagos">Listado de Pagos (Admin)</Link> |{" "}
        <Link to="/usuarios/1/pagos">Mis Pagos</Link>
      </nav>
      <Routes>
        <Route path="/pagos/crear" element={<CrearPago />} />
        <Route path="/pagos" element={<AdminPagosList />} />
        <Route path="/pagos/:id_pago" element={<PagoDetail />} />
        <Route path="/usuarios/:id_usuario/pagos" element={<PagosUsuario />} />
      </Routes>
    </Router>
  );
};

export default AppPagos;
