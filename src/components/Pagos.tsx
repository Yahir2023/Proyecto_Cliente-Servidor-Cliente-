import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';

interface Pago {
  id_pago: number;
  id_compra: number;
  metodo_pago: string;
  estado_pago: string;
  transaction_id: string;
  monto_pagado: number;
  paypal_email: string | null;
  fecha_pago: string;
}

interface PagoForm {
  id_pago: string;
  id_compra: string;
  metodo_pago: string;
  estado_pago: string;
  transaction_id: string;
  monto_pagado: string;
  paypal_email: string;
  fecha_pago: string;
}

function Pagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [nuevoPago, setNuevoPago] = useState<PagoForm>({
    id_pago: '',
    id_compra: '',
    metodo_pago: '',
    estado_pago: '',
    transaction_id: '',
    monto_pagado: '',
    paypal_email: '',
    fecha_pago: '',
  });

  // Verifica el token almacenado en localStorage
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    return (
      <div className="container mt-4">
        <h2>No estás autenticado</h2>
        <p>Por favor, inicia sesión para acceder a los pagos.</p>
      </div>
    );
  }
  const token = storedToken.startsWith("Bearer ") ? storedToken : `Bearer ${storedToken}`;

  // Función para obtener la lista de pagos desde el backend
  const fetchPagos = () => {
    axios
      .get('http://localhost:3000/pagos', { headers: { Authorization: token } })
      .then(response => setPagos(response.data))
      .catch(error => {
        console.error('Error al obtener pagos:', error);
        toast.error("Error al obtener pagos");
      });
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoPago(prev => ({ ...prev, [name]: value }));
  };

  // Valida y convierte los datos del formulario para enviarlos al backend
  const parsearPago = (): Partial<Pago> | null => {
    const { id_compra, metodo_pago, estado_pago, transaction_id, monto_pagado, paypal_email, fecha_pago } = nuevoPago;
    if (!id_compra.trim() || !metodo_pago.trim() || !estado_pago.trim() || !transaction_id.trim() || !monto_pagado.trim() || !fecha_pago.trim()) {
      toast.error("Por favor, llena todos los campos obligatorios.");
      return null;
    }
    const id_compraNum = Number(id_compra);
    const monto_pagadoNum = Number(monto_pagado);
    if (isNaN(id_compraNum) || isNaN(monto_pagadoNum)) {
      toast.error("Por favor, ingresa valores numéricos válidos.");
      return null;
    }
    return {
      id_compra: id_compraNum,
      metodo_pago,
      estado_pago,
      transaction_id,
      monto_pagado: monto_pagadoNum,
      paypal_email: paypal_email || null,
      fecha_pago,
    };
  };

  // Envía el formulario para agregar o actualizar un pago
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pagoData = parsearPago();
    if (!pagoData) return;

    try {
      if (nuevoPago.id_pago) {
        // Actualización: se usa PUT en /pagos/:id_pago
        await axios.put(`http://localhost:3000/pagos/${nuevoPago.id_pago}`, pagoData, { headers: { Authorization: token } });
        toast.success("Pago actualizado exitosamente");
      } else {
        // Agregar nuevo pago
        await axios.post('http://localhost:3000/pagos', pagoData, { headers: { Authorization: token } });
        toast.success("Pago agregado exitosamente");
      }
      // Reinicia el formulario y actualiza la lista
      setNuevoPago({
        id_pago: '',
        id_compra: '',
        metodo_pago: '',
        estado_pago: '',
        transaction_id: '',
        monto_pagado: '',
        paypal_email: '',
        fecha_pago: '',
      });
      fetchPagos();
    } catch (error) {
      console.error('Error en la operación del pago:', error);
      toast.error("Hubo un error al procesar el pago");
    }
  };

  // Carga los datos de un pago en el formulario para editarlo
  const handleEdit = (pago: Pago) => {
    setNuevoPago({
      id_pago: pago.id_pago.toString(),
      id_compra: pago.id_compra.toString(),
      metodo_pago: pago.metodo_pago,
      estado_pago: pago.estado_pago,
      transaction_id: pago.transaction_id,
      monto_pagado: pago.monto_pagado.toString(),
      paypal_email: pago.paypal_email || '',
      fecha_pago: pago.fecha_pago,
    });
  };

  // Elimina un pago llamando al endpoint DELETE
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/pagos/${id}`, { headers: { Authorization: token } });
      toast.success("Pago eliminado correctamente");
      fetchPagos();
    } catch (error) {
      console.error('Error al eliminar pago:', error);
      toast.error("Hubo un error al eliminar el pago");
    }
  };

  return (
    <div className="main-content">
        <div className="container mt-4 flex-grow-1">
          <Sidebar />
        </div>
          <ToastContainer />
          <h1>Pagos</h1>
          <h2>{nuevoPago.id_pago ? 'Editar Pago' : 'Agregar Nuevo Pago'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              name="id_compra"
              placeholder="ID Compra"
              className="form-control mb-2"
              value={nuevoPago.id_compra}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="metodo_pago"
              placeholder="Método de Pago"
              className="form-control mb-2"
              value={nuevoPago.metodo_pago}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="estado_pago"
              placeholder="Estado del Pago"
              className="form-control mb-2"
              value={nuevoPago.estado_pago}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="transaction_id"
              placeholder="ID de Transacción"
              className="form-control mb-2"
              value={nuevoPago.transaction_id}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="monto_pagado"
              placeholder="Monto Pagado"
              className="form-control mb-2"
              value={nuevoPago.monto_pagado}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="paypal_email"
              placeholder="Correo de PayPal (opcional)"
              className="form-control mb-2"
              value={nuevoPago.paypal_email}
              onChange={handleChange}
            />
            <input
              type="date"
              name="fecha_pago"
              placeholder="Fecha de Pago"
              className="form-control mb-2"
              value={nuevoPago.fecha_pago}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn btn-primary">
              {nuevoPago.id_pago ? 'Actualizar' : 'Agregar'}
            </button>
          </form>

          <h3 className="mt-4">Lista de Pagos</h3>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Compra</th>
                <th>Método de Pago</th>
                <th>Estado</th>
                <th>Transacción ID</th>
                <th>Monto Pagado</th>
                <th>Correo PayPal</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map(pago => (
                <tr key={pago.id_pago}>
                  <td>{pago.id_pago}</td>
                  <td>{pago.id_compra}</td>
                  <td>{pago.metodo_pago}</td>
                  <td>{pago.estado_pago}</td>
                  <td>{pago.transaction_id}</td>
                  <td>${pago.monto_pagado.toFixed(2)}</td>
                  <td>{pago.paypal_email || 'N/A'}</td>
                  <td>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => handleEdit(pago)}>
                      Editar
                    </button>
                    <button className="btn btn-danger ms-2" onClick={() => handleDelete(pago.id_pago)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
  );
}

export default Pagos;
