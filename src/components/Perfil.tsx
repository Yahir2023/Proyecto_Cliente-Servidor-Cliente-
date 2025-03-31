import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

interface Compra {
  id_compra: number;
  estado: string;
}

interface Reserva {
  id_reserva: number;
  estado: string;
}

interface Boleto {
  id: number;
  detalle: string;
}

interface Pago {
  id: number;
  monto: number;
}

interface Promocion {
  id: number;
  titulo: string;
  descripcion: string;
}

const Perfil = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("No hay token. Inicia sesión.");
      return;
    }
    axios
      .get("http://localhost:3000/auth/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const usuario: Usuario = response.data.usuario;
        if (!usuario) {
          toast.error("No se pudo obtener el perfil.");
          return;
        }
        setPerfil(usuario);
        const usuarioId = usuario.id;

        Promise.all([
          axios.get("http://localhost:3000/compras", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/reservas/${usuarioId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/boletos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/pagos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/promociones", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
          .then(
            ([
              comprasRes,
              reservasRes,
              boletosRes,
              pagosRes,
              promocionesRes,
            ]) => {
              setCompras(comprasRes.data);
              setReservas(reservasRes.data);
              setBoletos(boletosRes.data);
              setPagos(pagosRes.data);
              setPromociones(promocionesRes.data);
              toast.success("Datos de perfil cargados correctamente");
            }
          )
          .catch(() => {
            toast.error("Error al cargar datos adicionales del perfil.");
          });
      })
      .catch(() => {
        toast.error("Error al cargar perfil.");
      });
  }, [token]);

  if (!perfil) {
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
      <h2 className="mb-4">Perfil de {perfil.nombre}</h2>

      <div className="row">
        {/* Tarjeta de Perfil */}
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Perfil</h3>
            </div>
            <div className="card-body">
              <p>
                <strong>Correo:</strong> {perfil.correo}
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Historial de Compras */}
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Compras</h3>
            </div>
            <div className="card-body">
              {compras.length > 0 ? (
                <ul className="list-group">
                  {compras.map((compra) => (
                    <li className="list-group-item" key={compra.id_compra}>
                      Compra #{compra.id_compra} - {compra.estado}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay compras registradas.</p>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de Historial de Reservas */}
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Reservas</h3>
            </div>
            <div className="card-body">
              {reservas.length > 0 ? (
                <ul className="list-group">
                  {reservas.map((reserva) => (
                    <li className="list-group-item" key={reserva.id_reserva}>
                      Reserva #{reserva.id_reserva} - {reserva.estado}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay reservas registradas.</p>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de Boletos Comprados */}
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Boletos</h3>
            </div>
            <div className="card-body">
              {boletos.length > 0 ? (
                <ul className="list-group">
                  {boletos.map((boleto) => (
                    <li className="list-group-item" key={boleto.id}>
                      {boleto.detalle}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay boletos comprados.</p>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de Historial de Pagos */}
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Pagos</h3>
            </div>
            <div className="card-body">
              {pagos.length > 0 ? (
                <ul className="list-group">
                  {pagos.map((pago) => (
                    <li className="list-group-item" key={pago.id}>
                      Pago #{pago.id} - ${pago.monto}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay pagos registrados.</p>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de Promociones */}
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Promociones</h3>
            </div>
            <div className="card-body">
              {promociones.length > 0 ? (
                <ul className="list-group">
                  {promociones.map((promo) => (
                    <li className="list-group-item" key={promo.id}>
                      {promo.titulo} - {promo.descripcion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay promociones disponibles.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al Dashboard
        </button>
      </div>
    </div>
    
  );
};

export default Perfil;
