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

// Tipos e Interfaces

export interface Boleto {
  id_boleto: number;
  id_compra: number;
  id_disponibilidad: number;
  tipo_boleto: string;
  precio_unitario: number;
  estado: string;
}

export interface BoletoCreation {
  id_compra: number;
  boletos: {
    id_disponibilidad: number;
    tipo_boleto: string;
    precio_unitario: number;
  }[];
}

const token = localStorage.getItem("token");

// ==================================================
// Componente: Listar todos los boletos (solo Admin)
// ==================================================
const AdminBoletosList: React.FC = () => {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        const response = await axios.get<Boleto[]>("http://localhost:3000/boletos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoletos(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Error al obtener los boletos");
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchBoletos();
  }, []);

  return (
    <div>
      <h2>Todos los Boletos (Admin)</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {boletos.map((boleto) => (
          <li key={boleto.id_boleto}>
            <Link to={`/boletos/${boleto.id_boleto}`}>
              Boleto {boleto.id_boleto}
            </Link>{" "}
            - Estado: {boleto.estado} - Precio: ${boleto.precio_unitario}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ==================================================
// Componente: Listar boletos de un usuario
// ==================================================
const BoletosUsuario: React.FC = () => {
  const { id_usuario } = useParams<{ id_usuario: string }>();
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoletosUsuario = async () => {
      try {
        const response = await axios.get<Boleto[]>(
          `http://localhost:3000/boletos/usuario/${id_usuario}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBoletos(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Error al obtener boletos del usuario");
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchBoletosUsuario();
  }, [id_usuario]);

  return (
    <div>
      <h2>Boletos del Usuario {id_usuario}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {boletos.map((boleto) => (
          <li key={boleto.id_boleto}>
            <Link to={`/boletos/${boleto.id_boleto}`}>
              Boleto {boleto.id_boleto}
            </Link>{" "}
            - Estado: {boleto.estado} - Precio: ${boleto.precio_unitario}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ==================================================
// Componente: Detalle y acciones sobre un boleto
// ==================================================
const BoletoDetail: React.FC = () => {
  const { id_boleto } = useParams<{ id_boleto: string }>();
  const [boleto, setBoleto] = useState<Boleto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoleto = async () => {
      try {
        const response = await axios.get<Boleto>(
          `http://localhost:3000/boletos/${id_boleto}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBoleto(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Error al obtener el boleto");
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchBoleto();
  }, [id_boleto]);

  const anularBoleto = async () => {
    try {
      await axios.post(
        `http://localhost:3000/boletos/${id_boleto}/anular`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (boleto) setBoleto({ ...boleto, estado: "anulado" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al anular el boleto");
      } else {
        setError("Error desconocido");
      }
    }
  };

  const eliminarBoleto = async () => {
    try {
      await axios.delete(`http://localhost:3000/boletos/${id_boleto}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(-1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al eliminar el boleto");
      } else {
        setError("Error desconocido");
      }
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!boleto) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Detalle del Boleto {boleto.id_boleto}</h2>
      <p>ID Compra: {boleto.id_compra}</p>
      <p>ID Disponibilidad: {boleto.id_disponibilidad}</p>
      <p>Tipo de Boleto: {boleto.tipo_boleto}</p>
      <p>Precio Unitario: ${boleto.precio_unitario}</p>
      <p>Estado: {boleto.estado}</p>
      <div>
        {boleto.estado === "activo" && (
          <button onClick={anularBoleto}>Anular Boleto</button>
        )}
        {/* Se muestra el botón de eliminar solo para Admin */}
        <button onClick={eliminarBoleto}>Eliminar Boleto</button>
      </div>
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
};

// ==================================================
// Componente: Crear boletos tras una compra
// ==================================================
const CrearBoletos: React.FC = () => {
  const [idCompra, setIdCompra] = useState<number>(0);
  // Para simplificar, se creará un único boleto (pero se envía como array)
  const [boletoData, setBoletoData] = useState({
    id_disponibilidad: 0,
    tipo_boleto: "",
    precio_unitario: 0,
  });
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: BoletoCreation = {
      id_compra: idCompra,
      boletos: [boletoData],
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/boletos",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje(response.data.mensaje);
      // Redirigir al detalle del primer boleto creado, por ejemplo.
      navigate("/boletos");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al crear boletos");
      } else {
        setError("Error desconocido");
      }
    }
  };

  return (
    <div>
      <h2>Crear Boletos</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Compra: </label>
          <input
            type="number"
            value={idCompra}
            onChange={(e) => setIdCompra(Number(e.target.value))}
            required
          />
        </div>
        <h3>Datos del Boleto</h3>
        <div>
          <label>ID Disponibilidad: </label>
          <input
            type="number"
            value={boletoData.id_disponibilidad}
            onChange={(e) =>
              setBoletoData({
                ...boletoData,
                id_disponibilidad: Number(e.target.value),
              })
            }
            required
          />
        </div>
        <div>
          <label>Tipo de Boleto: </label>
          <input
            type="text"
            value={boletoData.tipo_boleto}
            onChange={(e) =>
              setBoletoData({ ...boletoData, tipo_boleto: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Precio Unitario: </label>
          <input
            type="number"
            value={boletoData.precio_unitario}
            onChange={(e) =>
              setBoletoData({
                ...boletoData,
                precio_unitario: Number(e.target.value),
              })
            }
            required
          />
        </div>
        <button type="submit">Crear Boletos</button>
      </form>
    </div>
  );
};

// ==================================================
// Componente: Validar un boleto
// ==================================================
const ValidarBoleto: React.FC = () => {
  const [idBoleto, setIdBoleto] = useState<number>(0);
  const [resultado, setResultado] = useState<string | null>(null);
  const [boleto, setBoleto] = useState<Boleto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/boletos/validar",
        { id_boleto: idBoleto },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResultado(response.data.mensaje);
      setBoleto(response.data.boleto);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al validar el boleto");
      } else {
        setError("Error desconocido");
      }
    }
  };

  return (
    <div>
      <h2>Validar Boleto</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleValidar}>
        <div>
          <label>ID Boleto: </label>
          <input
            type="number"
            value={idBoleto}
            onChange={(e) => setIdBoleto(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Validar</button>
      </form>
      {resultado && <p>{resultado}</p>}
      {boleto && (
        <div>
          <h3>Detalles del Boleto</h3>
          <p>ID Boleto: {boleto.id_boleto}</p>
          <p>ID Compra: {boleto.id_compra}</p>
          <p>ID Disponibilidad: {boleto.id_disponibilidad}</p>
          <p>Tipo de Boleto: {boleto.tipo_boleto}</p>
          <p>Precio Unitario: ${boleto.precio_unitario}</p>
          <p>Estado: {boleto.estado}</p>
        </div>
      )}
    </div>
  );
};

// ==================================================
// Componente principal con las rutas
// ==================================================
const AppBoletos: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/boletos">Todos los Boletos (Admin)</Link> |{" "}
        <Link to="/boletos/usuario/1">Mis Boletos (Usuario)</Link> |{" "}
        <Link to="/boletos/crear">Crear Boletos</Link> |{" "}
        <Link to="/boletos/validar">Validar Boleto</Link>
      </nav>
      <Routes>
        <Route path="/boletos" element={<AdminBoletosList />} />
        <Route path="/boletos/usuario/:id_usuario" element={<BoletosUsuario />} />
        <Route path="/boletos/crear" element={<CrearBoletos />} />
        <Route path="/boletos/validar" element={<ValidarBoleto />} />
        <Route path="/boletos/:id_boleto" element={<BoletoDetail />} />
      </Routes>
    </Router>
  );
};

export default AppBoletos;
