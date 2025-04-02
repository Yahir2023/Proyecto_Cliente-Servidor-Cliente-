import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';

interface Compra {
  id_compra: number;
  id_usuario: number;
  id_funcion: number;
  id_promocion: number | null;
  cantidad_adultos: number;
  cantidad_ninos: number;
  total: number;
  estado: string;
}

interface CompraForm {
  id_compra: string;
  id_usuario: string;
  id_funcion: string;
  id_promocion: string;
  cantidad_adultos: string;
  cantidad_ninos: string;
  total: string;
  estado: string;
}

interface JwtPayload {
  id: number;
  isAdmin: boolean;
}

function Compras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [nuevoCompra, setNuevoCompra] = useState<CompraForm>({
    id_compra: '',
    id_usuario: '',
    id_funcion: '',
    id_promocion: '',
    cantidad_adultos: '',
    cantidad_ninos: '',
    total: '',
    estado: 'pendiente',
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const storedToken = localStorage.getItem('token');

  useEffect(() => {
    if (!storedToken) {
      toast.error("No estás autenticado");
      return;
    }
    const token =
      storedToken.startsWith("Bearer ") ? storedToken : `Bearer ${storedToken}`;
    try {
      const payload = jwtDecode<JwtPayload>(token.replace("Bearer ", ""));
      console.log("Token decodificado:", payload); // DEBUG
      setIsAdmin(payload.isAdmin);
      setUsuarioId(payload.id);
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      toast.error("Token inválido");
    }
  }, [storedToken]);

  const fetchCompras = () => {
    if (!storedToken) return;
    const token =
      storedToken.startsWith("Bearer ") ? storedToken : `Bearer ${storedToken}`;
    axios
      .get('http://localhost:3000/compras', {
        headers: { Authorization: token },
      })
      .then(response => {
        const dataTransformada = response.data.map((compra: any) => ({
          ...compra,
          cantidad_ninos: compra.cantidad_ninos, // ya se llama así en la BD
        }));
        setCompras(dataTransformada);
      })
      .catch(error => {
        console.error('Error al obtener compras:', error);
        toast.error("Error al obtener compras");
      });
  };

  useEffect(() => {
    fetchCompras();
  }, [storedToken]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoCompra(prev => ({ ...prev, [name]: value }));
  };

  const parsearCompra = (): Partial<any> | null => {
    if (
      !nuevoCompra.id_funcion.trim() ||
      !nuevoCompra.cantidad_adultos.trim() ||
      !nuevoCompra.cantidad_ninos.trim() ||
      !nuevoCompra.total.trim()
    ) {
      toast.error("Por favor, llena todos los campos obligatorios.");
      return null;
    }

    // Si el usuario no es admin, se toma el id desde el token
    const id_usuario = isAdmin ? Number(nuevoCompra.id_usuario) : usuarioId;
    if (!id_usuario) {
      toast.error("No se encontró el ID del usuario.");
      return null;
    }
    const id_funcion = Number(nuevoCompra.id_funcion);
    const id_promocion = nuevoCompra.id_promocion.trim() ? Number(nuevoCompra.id_promocion) : null;
    const cantidad_adultos = Number(nuevoCompra.cantidad_adultos);
    const cantidad_ninos = Number(nuevoCompra.cantidad_ninos);
    const total = Number(nuevoCompra.total);

    if (
      isNaN(id_usuario) ||
      isNaN(id_funcion) ||
      (nuevoCompra.id_promocion.trim() && isNaN(Number(nuevoCompra.id_promocion))) ||
      isNaN(cantidad_adultos) ||
      isNaN(cantidad_ninos) ||
      isNaN(total)
    ) {
      toast.error("Por favor, ingresa valores numéricos válidos.");
      return null;
    }

    const datos = {
      id_usuario,
      id_funcion,
      id_promocion,
      cantidad_adultos,
      cantidad_ninos, // La BD espera 'cantidad_ninos'
      total,
      estado: nuevoCompra.estado || 'pendiente',
    };
    console.log("Datos a enviar:", datos); // DEBUG
    return datos;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const compraData = parsearCompra();
    if (!compraData || !storedToken) return;
    const token =
      storedToken.startsWith("Bearer ") ? storedToken : `Bearer ${storedToken}`;

    if (nuevoCompra.id_compra !== '') {
      axios
        .put(`http://localhost:3000/compras/${nuevoCompra.id_compra}`, compraData, {
          headers: { Authorization: token },
        })
        .then(() => {
          fetchCompras();
          toast.success("Compra actualizada exitosamente");
        })
        .catch(error => {
          console.error('Error al actualizar compra:', error.response?.data || error);
          toast.error(error.response?.data?.error || "Hubo un error al actualizar la compra");
        });
    } else {
      axios
        .post('http://localhost:3000/compras', compraData, {
          headers: { Authorization: token },
        })
        .then(() => {
          fetchCompras();
          toast.success("Compra agregada exitosamente");
        })
        .catch(error => {
          console.error('Error al agregar compra:', error.response?.data || error);
          toast.error(error.response?.data?.error || "Hubo un error al registrar la compra");
        });
    }

    setNuevoCompra({
      id_compra: '',
      id_usuario: '',
      id_funcion: '',
      id_promocion: '',
      cantidad_adultos: '',
      cantidad_ninos: '',
      total: '',
      estado: 'pendiente',
    });
  };

  const handleEdit = (compra: Compra) => {
    if (compra.estado !== 'pendiente') {
      toast.error("Solo se pueden editar compras en estado pendiente");
      return;
    }
    setNuevoCompra({
      id_compra: compra.id_compra.toString(),
      id_usuario: compra.id_usuario.toString(),
      id_funcion: compra.id_funcion.toString(),
      id_promocion: compra.id_promocion !== null ? compra.id_promocion.toString() : '',
      cantidad_adultos: compra.cantidad_adultos.toString(),
      cantidad_ninos: compra.cantidad_ninos.toString(),
      total: compra.total.toString(),
      estado: compra.estado,
    });
  };

  const handleDelete = (id: number) => {
    if (!storedToken) return;
    const token =
      storedToken.startsWith("Bearer ") ? storedToken : `Bearer ${storedToken}`;
    axios
      .delete(`http://localhost:3000/compras/${id}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        fetchCompras();
        toast.success("Compra eliminada correctamente");
      })
      .catch(error => {
        console.error('Error al eliminar compra:', error.response?.data || error);
        toast.error(error.response?.data?.error || "Hubo un error al eliminar la compra");
      });
  };

  return (
    <div className="main-content d-flex">
      <Sidebar />
      <div className="container mt-4 flex-grow-1">
        <ToastContainer />
        <h1>Compras</h1>
        <h2>{nuevoCompra.id_compra ? 'Editar Compra' : 'Agregar Nueva Compra'}</h2>
        <form onSubmit={handleSubmit}>
          {isAdmin && (
            <div className="mb-3">
              <label>ID Usuario</label>
              <input 
                type="number" 
                className="form-control" 
                name="id_usuario" 
                value={nuevoCompra.id_usuario} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          <div className="mb-3">
            <label>ID Función</label>
            <input 
              type="number" 
              className="form-control" 
              name="id_funcion" 
              value={nuevoCompra.id_funcion} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label>ID Promoción</label>
            <input 
              type="number" 
              className="form-control" 
              name="id_promocion" 
              value={nuevoCompra.id_promocion} 
              onChange={handleChange} 
            />
          </div>
          <div className="mb-3">
            <label>Cantidad Adultos</label>
            <input 
              type="number" 
              className="form-control" 
              name="cantidad_adultos" 
              value={nuevoCompra.cantidad_adultos} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label>Cantidad Niños</label>
            <input 
              type="number" 
              className="form-control" 
              name="cantidad_ninos" 
              value={nuevoCompra.cantidad_ninos} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label>Total</label>
            <input 
              type="number" 
              step="0.01" 
              className="form-control" 
              name="total" 
              value={nuevoCompra.total} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label>Estado</label>
            <select 
              className="form-control" 
              name="estado" 
              value={nuevoCompra.estado} 
              onChange={handleChange} 
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            {nuevoCompra.id_compra ? 'Actualizar' : 'Agregar'}
          </button>
        </form>

        <hr />

        <h2>Listado de Compras</h2>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID Compra</th>
              <th>ID Usuario</th>
              <th>ID Función</th>
              <th>ID Promoción</th>
              <th>Adultos</th>
              <th>Niños</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.map(compra => (
              <tr key={compra.id_compra}>
                <td>{compra.id_compra}</td>
                <td>{compra.id_usuario}</td>
                <td>{compra.id_funcion}</td>
                <td>{compra.id_promocion !== null ? compra.id_promocion : '-'}</td>
                <td>{compra.cantidad_adultos}</td>
                <td>{compra.cantidad_ninos}</td>
                <td>${compra.total}</td>
                <td>{compra.estado}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => handleEdit(compra)}>Editar</button>
                  <button className="btn btn-danger ms-2" onClick={() => handleDelete(compra.id_compra)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Compras;
