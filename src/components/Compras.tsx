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

// Definición de interfaces para tipado

interface Compra {
  id_compra: number;
  id_usuario: string;
  id_funcion: string;
  id_promocion: string;
  cantidad_adultos: number;
  cantidad_niños: number;
  total: number;
  estado: string;
  // Otras propiedades que la API pueda retornar...
}

interface CompraFormData {
  id_funcion: string;
  id_promocion: string;
  cantidad_adultos: number;
  cantidad_niños: number;
  total: number;
}

// Se asume que el token JWT se almacena en localStorage
const token = localStorage.getItem("token");

//////////////////////////
/// Lista de Compras   ///
//////////////////////////

const ComprasList: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await axios.get<Compra[]>("http://localhost:3000/compras", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompras(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Error al obtener compras");
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchCompras();
  }, []);

  return (
    <div>
      <h2>Lista de Compras</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {compras.map((compra) => (
          <li key={compra.id_compra}>
            <Link to={`/compras/${compra.id_compra}`}>Compra {compra.id_compra}</Link> - Estado: {compra.estado} - Total: ${compra.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

//////////////////////////
/// Detalle de Compra  ///
//////////////////////////

const CompraDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [compra, setCompra] = useState<Compra | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<CompraFormData>({
    id_funcion: "",
    id_promocion: "",
    cantidad_adultos: 0,
    cantidad_niños: 0,
    total: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await axios.get<Compra>(`http://localhost:3000/compras/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompra(response.data);
        setFormData({
          id_funcion: response.data.id_funcion,
          id_promocion: response.data.id_promocion,
          cantidad_adultos: response.data.cantidad_adultos,
          cantidad_niños: response.data.cantidad_niños,
          total: response.data.total,
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Error al obtener la compra");
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchCompra();
  }, [id]);

  const confirmarCompra = async () => {
    try {
      await axios.post(
        `http://localhost:3000/compras/${id}/confirmar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (compra) setCompra({ ...compra, estado: "confirmada" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al confirmar la compra");
      } else {
        setError("Error desconocido");
      }
    }
  };

  const cancelarCompra = async () => {
    try {
      await axios.post(
        `http://localhost:3000/compras/${id}/cancelar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (compra) setCompra({ ...compra, estado: "cancelada" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al cancelar la compra");
      } else {
        setError("Error desconocido");
      }
    }
  };

  const actualizarCompra = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/compras/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (compra) setCompra({ ...compra, ...formData });
      setEditMode(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al actualizar la compra");
      } else {
        setError("Error desconocido");
      }
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!compra) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Detalle de la Compra {compra.id_compra}</h2>
      <p>Estado: {compra.estado}</p>
      <p>Total: ${compra.total}</p>
      <p>ID Función: {compra.id_funcion}</p>
      <p>ID Promoción: {compra.id_promocion}</p>
      <p>Cantidad Adultos: {compra.cantidad_adultos}</p>
      <p>Cantidad Niños: {compra.cantidad_niños}</p>

      {compra.estado === "pendiente" && (
        <div>
          <button onClick={confirmarCompra}>Confirmar Compra</button>
          <button onClick={cancelarCompra}>Cancelar Compra</button>
          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancelar Edición" : "Editar Compra"}
          </button>
        </div>
      )}

      {editMode && (
        <form onSubmit={actualizarCompra}>
          <div>
            <label>ID Función: </label>
            <input
              type="text"
              value={formData.id_funcion}
              onChange={(e) =>
                setFormData({ ...formData, id_funcion: e.target.value })
              }
            />
          </div>
          <div>
            <label>ID Promoción: </label>
            <input
              type="text"
              value={formData.id_promocion}
              onChange={(e) =>
                setFormData({ ...formData, id_promocion: e.target.value })
              }
            />
          </div>
          <div>
            <label>Cantidad Adultos: </label>
            <input
              type="number"
              value={formData.cantidad_adultos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cantidad_adultos: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>Cantidad Niños: </label>
            <input
              type="number"
              value={formData.cantidad_niños}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cantidad_niños: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>Total: </label>
            <input
              type="number"
              value={formData.total}
              onChange={(e) =>
                setFormData({ ...formData, total: Number(e.target.value) })
              }
            />
          </div>
          <button type="submit">Actualizar Compra</button>
        </form>
      )}

      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
};

//////////////////////////
/// Crear Compra       ///
//////////////////////////

const CrearCompra: React.FC = () => {
  const [formData, setFormData] = useState<CompraFormData>({
    id_funcion: "",
    id_promocion: "",
    cantidad_adultos: 0,
    cantidad_niños: 0,
    total: 0,
  });
  const [idUsuario, setIdUsuario] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "id_usuario") {
      setIdUsuario(value);
    } else {
      setFormData({
        ...formData,
        [name]:
          name === "cantidad_adultos" ||
          name === "cantidad_niños" ||
          name === "total"
            ? Number(value)
            : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = { id_usuario: idUsuario, ...formData };
      const response = await axios.post(
        "http://localhost:3000/compras",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje(response.data.mensaje);
      navigate(`/compras/${response.data.id_compra}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Error al crear la compra");
      } else {
        setError("Error desconocido");
      }
    }
  };

  return (
    <div>
      <h2>Crear Compra</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Usuario: </label>
          <input
            type="text"
            name="id_usuario"
            value={idUsuario}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ID Función: </label>
          <input
            type="text"
            name="id_funcion"
            value={formData.id_funcion}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ID Promoción: </label>
          <input
            type="text"
            name="id_promocion"
            value={formData.id_promocion}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Cantidad Adultos: </label>
          <input
            type="number"
            name="cantidad_adultos"
            value={formData.cantidad_adultos}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Cantidad Niños: </label>
          <input
            type="number"
            name="cantidad_niños"
            value={formData.cantidad_niños}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Total: </label>
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Crear Compra</button>
      </form>
    </div>
  );
};

//////////////////////////
/// Compras Usuario    ///
//////////////////////////

const ComprasUsuario: React.FC = () => {
  const { id_usuario } = useParams<{ id_usuario: string }>();
  const [compras, setCompras] = useState<Compra[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComprasUsuario = async () => {
      try {
        const response = await axios.get<Compra[]>(
          `http://localhost:3000/compras/usuario/${id_usuario}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompras(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error || "Error al obtener las compras del usuario"
          );
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchComprasUsuario();
  }, [id_usuario]);

  return (
    <div>
      <h2>Compras del Usuario {id_usuario}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {compras.map((compra) => (
          <li key={compra.id_compra}>
            <Link to={`/compras/${compra.id_compra}`}>
              Compra {compra.id_compra}
            </Link>{" "}
            - Estado: {compra.estado} - Total: ${compra.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

//////////////////////////
/// Rutas Principales  ///
//////////////////////////

const AppCompras: React.FC = () => {
  return (
    <Router>
      <nav>
        <Link to="/compras">Listar Compras</Link> |{" "}
        <Link to="/compras/crear">Crear Compra</Link>
      </nav>
      <Routes>
        <Route path="/compras" element={<ComprasList />} />
        <Route path="/compras/crear" element={<CrearCompra />} />
        <Route path="/compras/usuario/:id_usuario" element={<ComprasUsuario />} />
        <Route path="/compras/:id" element={<CompraDetail />} />
      </Routes>
    </Router>
  );
};

export default AppCompras;
