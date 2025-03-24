import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Administrador {
  id_admin: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
}

interface AdministradorForm {
  id_admin: string;
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
  rol: string;
}

function Administradores() {
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [nuevoAdmin, setNuevoAdmin] = useState<AdministradorForm>({
    id_admin: '',
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    rol: '',
  });

  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    return (
      <div className="container mt-4">
        <h2>No estás autenticado</h2>
        <p>Por favor, inicia sesión para acceder a la información de los administradores.</p>
      </div>
    );
  }

  const token = storedToken.startsWith("Bearer ") ? storedToken : `Bearer ${storedToken}`;

  const fetchAdministradores = () => {
    axios
      .get('http://localhost:3000/admin', {
        headers: { Authorization: token },
      })
      .then(response => setAdministradores(response.data))
      .catch(error => {
        console.error('Error al obtener administradores:', error);
        toast.error("Error al obtener administradores");
      });
  };

  useEffect(() => {
    fetchAdministradores();
  }, [token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const adminAInsertar = { ...nuevoAdmin, id_admin: parseInt(nuevoAdmin.id_admin) || undefined };
    const existeAdmin = administradores.find(a => a.id_admin === adminAInsertar.id_admin);

    if (existeAdmin) {
      axios
        .put(`http://localhost:3000/admin/${adminAInsertar.id_admin}`, adminAInsertar, {
          headers: { Authorization: token },
        })
        .then(() => {
          fetchAdministradores();
          toast.success("Administrador actualizado exitosamente");
        })
        .catch(error => {
          console.error('Error al actualizar administrador:', error);
          toast.error("Hubo un error al actualizar");
        });
    } else {
      axios
        .post('http://localhost:3000/admin', adminAInsertar, {
          headers: { Authorization: token },
        })
        .then(() => {
          fetchAdministradores();
          toast.success("Administrador registrado exitosamente");
        })
        .catch(error => {
          console.error('Error al agregar administrador:', error);
          toast.error("Hubo un error al registrar");
        });
    }
    setNuevoAdmin({ id_admin: '', nombre: '', apellido: '', correo: '', contraseña: '', rol: '' });
  };

  const handleEdit = (admin: Administrador) => {
    setNuevoAdmin({
      id_admin: admin.id_admin.toString(),
      nombre: admin.nombre,
      apellido: admin.apellido,
      correo: admin.correo,
      contraseña: '',
      rol: admin.rol,
    });
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`http://localhost:3000/admin/${id}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        fetchAdministradores();
        toast.success("Administrador eliminado correctamente");
      })
      .catch(error => {
        console.error('Error al eliminar administrador:', error);
        toast.error("Hubo un error al eliminar");
      });
  };

  return (
    <div className="container mt-4">
      <ToastContainer /> {/* Asegura que las notificaciones se muestren */}
      
      <h1>Administradores</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {administradores.map(admin => (
            <tr key={admin.id_admin}>
              <td>{admin.id_admin}</td>
              <td>{admin.nombre}</td>
              <td>{admin.apellido}</td>
              <td>{admin.correo}</td>
              <td>{admin.rol}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEdit(admin)}>
                  Editar
                </button>
                <button className="btn btn-danger ml-2" onClick={() => handleDelete(admin.id_admin)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{nuevoAdmin.id_admin ? 'Editar Administrador' : 'Agregar Nuevo Administrador'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input type="text" className="form-control" name="nombre" value={nuevoAdmin.nombre} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Apellido</label>
          <input type="text" className="form-control" name="apellido" value={nuevoAdmin.apellido} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Correo</label>
          <input type="email" className="form-control" name="correo" value={nuevoAdmin.correo} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" className="form-control" name="contraseña" value={nuevoAdmin.contraseña} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Rol</label>
          <input type="text" className="form-control" name="rol" value={nuevoAdmin.rol} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">
          {nuevoAdmin.id_admin ? 'Actualizar' : 'Agregar'}
        </button>
      </form>
    </div>
  );
}

export default Administradores;
