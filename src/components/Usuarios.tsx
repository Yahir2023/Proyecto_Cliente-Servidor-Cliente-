import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
}

interface UsuarioForm {
  id_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  contraseña: string;
}

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<UsuarioForm>({
    id_usuario: '',
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
  });

  // Verificar token almacenado en localStorage
  const storedToken = localStorage.getItem('token');
  if (!storedToken) {
    return (
      <div className="container mt-4">
        <h2>No estás autenticado</h2>
        <p>Por favor, inicia sesión para acceder a la información de los usuarios.</p>
      </div>
    );
  }
  // Si no viene con "Bearer ", se agrega
  const token = storedToken.startsWith("Bearer ") ? storedToken : `Bearer ${storedToken}`;

  // Obtener la lista de usuarios (solo admin podrá verlos)
  const fetchUsuarios = () => {
    axios
      .get('http://localhost:3000/usuarios', {
        headers: { Authorization: token },
      })
      .then(response => setUsuarios(response.data))
      .catch(error => {
        console.error('Error al obtener usuarios:', error.response?.data || error);
        toast.error("Error al obtener usuarios");
      });
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convertir id_usuario a número para detectar si se trata de una edición
    const usuarioAEnviar = { ...form, id_usuario: parseInt(form.id_usuario) || undefined };
    const existe = usuarios.find(u => u.id_usuario === usuarioAEnviar.id_usuario);

    if (existe) {
      // Actualizar usuario
      axios
        .put(`http://localhost:3000/usuarios/${usuarioAEnviar.id_usuario}`, usuarioAEnviar, {
          headers: { Authorization: token },
        })
        .then(() => {
          toast.success("Usuario actualizado correctamente");
          fetchUsuarios();
          setForm({ id_usuario: '', nombre: '', apellido: '', correo: '', contraseña: '' });
        })
        .catch(error => {
          console.error('Error al actualizar usuario:', error.response?.data || error);
          toast.error("Error al actualizar usuario");
        });
    } else {
      // Agregar usuario
      axios
        .post('http://localhost:3000/usuarios', usuarioAEnviar, {
          headers: { Authorization: token },
        })
        .then(() => {
          toast.success("Usuario agregado correctamente");
          fetchUsuarios();
          setForm({ id_usuario: '', nombre: '', apellido: '', correo: '', contraseña: '' });
        })
        .catch(error => {
          console.error('Error al agregar usuario:', error.response?.data || error);
          toast.error("Error al agregar usuario");
        });
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setForm({
      id_usuario: usuario.id_usuario.toString(),
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      contraseña: '',
    });
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`http://localhost:3000/usuarios/${id}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        toast.success("Usuario eliminado correctamente");
        fetchUsuarios();
      })
      .catch(error => {
        console.error('Error al eliminar usuario:', error.response?.data || error);
        toast.error("Error al eliminar usuario");
      });
  };

  return (
    <div className="main-content mt-4">
      <Sidebar />
      <ToastContainer />
      <h2>{form.id_usuario ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Apellido</label>
          <input type="text" className="form-control" name="apellido" value={form.apellido} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Correo</label>
          <input type="email" className="form-control" name="correo" value={form.correo} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" className="form-control" name="contraseña" value={form.contraseña} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">
          {form.id_usuario ? 'Actualizar' : 'Agregar'}
        </button>
      </form>

      <h1>Administración de Usuarios</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.correo}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEdit(usuario)}>
                  Editar
                </button>
                <button className="btn btn-danger ml-2" onClick={() => handleDelete(usuario.id_usuario)}>
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

export default AdminUsuarios;
