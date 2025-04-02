import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface Reserva {
  id: number;
  fila: string;
  numero: number;
  id_funcion: number;
  id_usuario: number;
  fecha: string;
}

const token = localStorage.getItem('token');
const headers = {
  Authorization: `Bearer ${token}`,
};

function obtenerRolDesdeToken(): 'admin' | 'usuario' | null {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload.rol;
  } catch {
    return null;
  }
}

const AdminReservas: React.FC = () => {
  const navigate = useNavigate();
  const rol = obtenerRolDesdeToken();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [editando, setEditando] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Reserva>>({});

  useEffect(() => {
    if (rol !== 'admin') {
      navigate('/unauthorized');
    } else {
      cargarReservas();
    }
  }, []);

  const cargarReservas = async () => {
    try {
      const res = await axios.get('http://localhost:3000/reservas', { headers });
      setReservas(res.data);
    } catch (err) {
      console.error('Error cargando reservas', err);
    }
  };

  const handleEditar = (reserva: Reserva) => {
    setEditando(reserva.id);
    setForm(reserva);
  };

  const handleGuardar = async () => {
    if (!editando || !form.fila || !form.numero || !form.id_funcion) return;

    try {
      await axios.put(`http://localhost:3000/reservas/${editando}`, {
        fila: form.fila,
        numero: form.numero,
        id_funcion: form.id_funcion
      }, { headers });
      setEditando(null);
      cargarReservas();
    } catch (err) {
      console.error('Error actualizando reserva', err);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar esta reserva?')) return;

    try {
      await axios.delete(`http://localhost:3000/reservas/${id}`, { headers });
      cargarReservas();
    } catch (err) {
      console.error('Error eliminando reserva', err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Sidebar />
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Gestión de Reservas (Administrador)</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Usuario</th>
            <th>Fila</th>
            <th>Número</th>
            <th>Función</th>
            <th>Fecha</th>
            {rol === 'admin' && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id} style={{ textAlign: 'center' }}>
              <td>{reserva.id}</td>
              <td>{reserva.id_usuario}</td>
              <td>
                {editando === reserva.id ? (
                  <input
                    value={form.fila || ''}
                    onChange={(e) => setForm({ ...form, fila: e.target.value.toUpperCase() })}
                    maxLength={1}
                  />
                ) : (
                  reserva.fila
                )}
              </td>
              <td>
                {editando === reserva.id ? (
                  <input
                    type="number"
                    value={form.numero || ''}
                    onChange={(e) => setForm({ ...form, numero: parseInt(e.target.value) })}
                    min={1}
                    max={12}
                  />
                ) : (
                  reserva.numero
                )}
              </td>
              <td>
                {editando === reserva.id ? (
                  <input
                    type="number"
                    value={form.id_funcion || ''}
                    onChange={(e) => setForm({ ...form, id_funcion: parseInt(e.target.value) })}
                  />
                ) : (
                  reserva.id_funcion
                )}
              </td>
              <td>{new Date(reserva.fecha).toLocaleString()}</td>
              {rol === 'admin' && (
                <td>
                  {editando === reserva.id ? (
                    <>
                      <button onClick={handleGuardar} style={{ marginRight: '5px' }}>💾</button>
                      <button onClick={() => setEditando(null)}>✖</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditar(reserva)} style={{ marginRight: '5px' }}>✏️</button>
                      <button onClick={() => handleEliminar(reserva.id)}>🗑️</button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReservas;