import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';


interface Boleto {
  id_boleto: number;
  id_compra: number;
  id_disponibilidad: number;
  tipo_boleto: string;
  precio_unitario: number;
  estado: string;
  created_at: string;
  updated_at: string;
}

interface BoletoForm {
  id_boleto: string;
  id_compra: string;
  id_disponibilidad: string;
  tipo_boleto: string;
  precio_unitario: string;
  estado: string;
}

function Boletos() {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [formBoleto, setFormBoleto] = useState<BoletoForm>({
    id_boleto: '',
    id_compra: '',
    id_disponibilidad: '',
    tipo_boleto: '',
    precio_unitario: '',
    estado: 'activo',
  });

  // Verifica el token en localStorage
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    return (
      <div className="container mt-4">
        <h2>No estás autenticado</h2>
        <p>Por favor, inicia sesión para acceder a los boletos.</p>
      </div>
    );
  }
  const token = storedToken.startsWith("Bearer ") ? storedToken : `Bearer ${storedToken}`;

  const fetchBoletos = () => {
    axios
      .get('http://localhost:3000/boletos', { headers: { Authorization: token } })
      .then(response => setBoletos(response.data))
      .catch(error => {
        console.error('Error al obtener boletos:', error);
        toast.error("Error al obtener boletos");
      });
  };

  useEffect(() => {
    fetchBoletos();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormBoleto(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id_boleto, id_compra, id_disponibilidad, tipo_boleto, precio_unitario, estado } = formBoleto;

    // Validación simple de campos obligatorios
    if (!id_compra || !id_disponibilidad || !tipo_boleto || !precio_unitario) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    // Payload para enviar al backend.
    // Para crear, el backend asigna por defecto "activo".
    // Para editar, se envía también el estado.
    const payload = {
      id_compra: Number(id_compra),
      id_disponibilidad: Number(id_disponibilidad),
      tipo_boleto,
      precio_unitario: Number(precio_unitario),
      ...(id_boleto && { estado }),
    };

    try {
      if (id_boleto) {
        // Editar boleto
        await axios.put(`http://localhost:3000/boletos/${id_boleto}`, payload, { headers: { Authorization: token } });
        toast.success("Boleto actualizado correctamente");
      } else {
        // Crear boleto
        await axios.post('http://localhost:3000/boletos', { id_compra: payload.id_compra, boletos: [payload] }, { headers: { Authorization: token } });
        toast.success("Boleto creado exitosamente");
      }
      resetForm();
      fetchBoletos();
    } catch (error: any) {
      console.error('Error al procesar boleto:', error.response ? error.response.data : error);
      toast.error("Error al procesar boleto");
    }
  };

  // Carga los datos de un boleto en el formulario para editar
  const handleEdit = (boleto: Boleto) => {
    setFormBoleto({
      id_boleto: boleto.id_boleto.toString(),
      id_compra: boleto.id_compra.toString(),
      id_disponibilidad: boleto.id_disponibilidad.toString(),
      tipo_boleto: boleto.tipo_boleto,
      precio_unitario: boleto.precio_unitario.toString(),
      estado: boleto.estado,
    });
  };

  // Anula un boleto (endpoint POST /boletos/:id_boleto/anular)
  const handleAnular = async (id_boleto: number) => {
    try {
      await axios.post(`http://localhost:3000/boletos/${id_boleto}/anular`, {}, { headers: { Authorization: token } });
      toast.success("Boleto anulado exitosamente");
      fetchBoletos();
    } catch (error: any) {
      console.error('Error al anular boleto:', error.response ? error.response.data : error);
      toast.error("Error al anular boleto");
    }
  };

  // Elimina un boleto (endpoint DELETE /boletos/:id_boleto)
  const handleDelete = async (id_boleto: number) => {
    try {
      await axios.delete(`http://localhost:3000/boletos/${id_boleto}`, { headers: { Authorization: token } });
      toast.success("Boleto eliminado exitosamente");
      fetchBoletos();
    } catch (error: any) {
      console.error('Error al eliminar boleto:', error.response ? error.response.data : error);
      toast.error("Error al eliminar boleto");
    }
  };

  const resetForm = () => {
    setFormBoleto({
      id_boleto: '',
      id_compra: '',
      id_disponibilidad: '',
      tipo_boleto: '',
      precio_unitario: '',
      estado: 'activo',
    });
  };

  return (
    <div className="main-content mt-4">
      <Sidebar />
      <ToastContainer />
      <h1>Boletos</h1>
      <h2>{formBoleto.id_boleto ? "Editar Boleto" : "Crear Boleto"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id_compra"
          placeholder="ID Compra"
          className="form-control mb-2"
          value={formBoleto.id_compra}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="id_disponibilidad"
          placeholder="ID Disponibilidad"
          className="form-control mb-2"
          value={formBoleto.id_disponibilidad}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="tipo_boleto"
          placeholder="Tipo de Boleto"
          className="form-control mb-2"
          value={formBoleto.tipo_boleto}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="precio_unitario"
          placeholder="Precio Unitario"
          className="form-control mb-2"
          value={formBoleto.precio_unitario}
          onChange={handleChange}
          required
        />
        {/* Muestra el campo de estado al editar */}
        {formBoleto.id_boleto && (
          <select
            name="estado"
            className="form-control mb-2"
            value={formBoleto.estado}
            onChange={handleChange}
            required
          >
            <option value="activo">Activo</option>
            <option value="anulado">Anulado</option>
          </select>
        )}
        <button type="submit" className="btn btn-primary">
          {formBoleto.id_boleto ? "Actualizar Boleto" : "Crear Boleto"}
        </button>
      </form>

      <h3 className="mt-4">Lista de Boletos</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Compra</th>
            <th>ID Disponibilidad</th>
            <th>Tipo</th>
            <th>Precio Unitario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {boletos.map(boleto => (
            <tr key={boleto.id_boleto}>
              <td>{boleto.id_boleto}</td>
              <td>{boleto.id_compra}</td>
              <td>{boleto.id_disponibilidad}</td>
              <td>{boleto.tipo_boleto}</td>
              <td>{boleto.precio_unitario.toFixed(2)}</td>
              <td>{boleto.estado}</td>
              <td>
                <button className="btn btn-info" onClick={() => handleEdit(boleto)}>
                  Editar
                </button>
                <button className="btn btn-warning ms-2" onClick={() => handleAnular(boleto.id_boleto)}>
                  Anular
                </button>
                <button className="btn btn-danger ms-2" onClick={() => handleDelete(boleto.id_boleto)}>
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

export default Boletos;
