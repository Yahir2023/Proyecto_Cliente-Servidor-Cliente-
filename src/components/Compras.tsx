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
import "bootstrap/dist/css/bootstrap.min.css";

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
}

interface CompraFormData {
  id_funcion: string;
  id_promocion: string;
  cantidad_adultos: number;
  cantidad_niños: number;
  total: number;
}

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
    <div className="container mt-4">
      <h2 className="mb-3">Lista de Compras</h2>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {compras.map((compra) => (
          <li key={compra.id_compra} className="list-group-item">
            <Link to={`/compras/${compra.id_compra}`} className="text-decoration-none">
              Compra {compra.id_compra}
            </Link> - Estado: {compra.estado} - Total: ${compra.total}
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const response = await axios.get<Compra>(`http://localhost:3000/compras/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompra(response.data);
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

  if (error) return <p className="text-danger">{error}</p>;
  if (!compra) return <p>Cargando...</p>;

  return (
    <div className="container mt-4">
      <h2>Detalle de la Compra {compra.id_compra}</h2>
      <p>Estado: {compra.estado}</p>
      <p>Total: ${compra.total}</p>
      <p>ID Función: {compra.id_funcion}</p>
      <p>ID Promoción: {compra.id_promocion}</p>
      <p>Cantidad Adultos: {compra.cantidad_adultos}</p>
      <p>Cantidad Niños: {compra.cantidad_niños}</p>
      <button className="btn btn-primary me-2" onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
};

//////////////////////////
/// Rutas Principales  ///
//////////////////////////

const AppCompras: React.FC = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/compras">Compras</Link>
          <div className="navbar-nav">
            <Link className="nav-item nav-link" to="/compras">Listar Compras</Link>
            <Link className="nav-item nav-link" to="/compras/crear">Crear Compra</Link>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/compras" element={<ComprasList />} />
          <Route path="/compras/:id" element={<CompraDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppCompras;
