import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

interface Promocion {
  id: number;
  titulo: string;
  descripcion: string;
  descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
}

const AdminPromociones: React.FC = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [form, setForm] = useState<Partial<Promocion>>({});
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      cargarPromociones();
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.rol !== 'admin') {
        cargarPromociones();
      }
    } catch {
      navigate('/login');
    }

    cargarPromociones();
  }, []);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const cargarPromociones = async () => {
    try {
      const res = await axios.get('/promociones', { headers });
      setPromociones(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/promociones', form, { headers });
      setForm({});
      cargarPromociones();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar esta promoción?')) return;
    try {
      await axios.delete(`/promociones/${id}`, { headers });
      cargarPromociones();
    } catch (err) {
      console.error(err);
    }
  };

  const handleActualizar = async () => {
    try {
      await axios.put(`/promociones/${editandoId}`, form, { headers });
      setEditandoId(null);
      setForm({});
      cargarPromociones();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Sidebar />
      <h2>Gestión de Promociones</h2>

      {/* FORMULARIO */}
      <form onSubmit={editandoId ? handleActualizar : handleCrear}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="titulo">Título</label>
          <input id="titulo" value={form.titulo || ''} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="descripcion">Descripción</label>
          <input id="descripcion" value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="descuento">Descuento</label>
          <input id="descuento" type="number" step="0.01" value={form.descuento || ''} onChange={(e) => setForm({ ...form, descuento: parseFloat(e.target.value) })} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="fecha_inicio">Inicio</label>
          <input id="fecha_inicio" type="date" value={form.fecha_inicio || ''} onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="fecha_fin">Fin</label>
          <input id="fecha_fin" type="date" value={form.fecha_fin || ''} onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} />
        </div>

        <div style={{ alignSelf: 'end' }}>
          <button type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
        </div>
      </form>

      {/* TABLA DE PROMOCIONES */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Descuento</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {promociones.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.titulo}</td>
              <td>{p.descripcion}</td>
              <td>{p.descuento}%</td>
              <td>{p.fecha_inicio}</td>
              <td>{p.fecha_fin}</td>
              <td>
                <button onClick={() => {
                  setEditandoId(p.id);
                  setForm(p);
                }}>Editar</button>
                <button onClick={() => handleEliminar(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPromociones;
