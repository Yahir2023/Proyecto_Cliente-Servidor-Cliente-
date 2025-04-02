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

interface Pago {
  id_pago: number;
  estado_pago: string;
  monto_pagado: number;
  metodo_pago: string;
}

interface Boleto {
  id_boleto: number;
  tipo_boleto: string;
  precio_unitario: number;
  estado: string;
}

interface Promocion {
  id_promocion: number;
  descripcion: string;
  tipo_descuento: string;
  valor_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
}

const Perfil = () => {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]); // Nuevo estado para las promociones

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
          axios.get(`http://localhost:3000/reservas/${usuarioId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/compras", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/usuarios/${usuarioId}/pagos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/boletos/usuario/${usuarioId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/promociones/usuario/${usuarioId}`, { 
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
          .then(([reservasRes, comprasRes, pagosRes, boletosRes, promocionesRes]) => {
            setReservas(reservasRes.data);
            setCompras(comprasRes.data);
            setPagos(pagosRes.data);
            setBoletos(boletosRes.data);
            setPromociones(promocionesRes.data);
          })
          .catch(() => {
            toast.error("Error al cargar reservas, compras, pagos, boletos o promociones.");
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
        <div className="col-md-3 mb-4">
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

        {/* Sección de Compras */}
        <div className="col-md-3 mb-4">
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

        {/* Sección de Reservas */}
        <div className="col-md-3 mb-4">
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

        {/* Sección de Pagos */}
        <div className="col-md-3 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Pagos</h3>
            </div>
            <div className="card-body">
              {pagos.length > 0 ? (
                <ul className="list-group">
                  {pagos.map((pago) => (
                    <li className="list-group-item" key={pago.id_pago}>
                      Pago #{pago.id_pago} - {pago.estado_pago} - ${pago.monto_pagado} ({pago.metodo_pago})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay pagos registrados.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Boletos */}
        <div className="col-md-3 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Historial de Boletos</h3>
            </div>
            <div className="card-body">
              {boletos.length > 0 ? (
                <ul className="list-group">
                  {boletos.map((boleto) => (
                    <li className="list-group-item" key={boleto.id_boleto}>
                      Boleto #{boleto.id_boleto} - {boleto.tipo_boleto} - ${boleto.precio_unitario} - {boleto.estado}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay boletos registrados.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Promociones */}
        <div className="col-md-3 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h3>Historial de Promociones</h3>
            </div>
            <div className="card-body">
              {promociones.length > 0 ? (
                <ul className="list-group">
                  {promociones.map((promocion) => (
                    <li className="list-group-item" key={promocion.id_promocion}>
                      {promocion.descripcion} - {promocion.tipo_descuento} - {promocion.valor_descuento}% - {promocion.fecha_inicio} hasta {promocion.fecha_fin}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay promociones registradas.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
      <button className="btn btn-primary" onClick={() => navigate("/")}>Volver a inicio</button>
    </div>
    </div>

    
  );
};

export default Perfil;
