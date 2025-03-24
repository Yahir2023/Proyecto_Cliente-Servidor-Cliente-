import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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

function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nuevoUsuario, setNuevoUsuario] = useState<UsuarioForm>({
    id_usuario: '',
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
  });

  // Verificar que se tenga un token en el localStorage
  const storedToken = localStorage.getItem('token');
  console.log("Token en localStorage:", storedToken);
  if (!storedToken) {
    return (
      <div className="container mt-4">
        <h2>No estás autenticado</h2>
        <p>Por favor, inicia sesión para acceder a la información de los usuarios.</p>
      </div>
    );
  }

  // Si el token no viene con el prefijo "Bearer ", lo agregamos
  const token = storedToken.startsWith("Bearer ") ? storedToken : `Bearer ${storedToken}`;

  // Función para obtener usuarios (requiere que el token pertenezca a un administrador)
  const fetchUsuarios = () => {
    axios
      .get('http://localhost:3000/usuarios', {
        headers: { Authorization: token },
      })
      .then(response => setUsuarios(response.data))
      .catch(error => {
        console.error('Error al obtener usuarios:', error);
        if (error.response && error.response.status === 401) {
          console.error("Token enviado:", token);
        }
      });
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convertir id_usuario a número (en caso de edición)
    const usuarioAInsertar = { ...nuevoUsuario, id_usuario: parseInt(nuevoUsuario.id_usuario) || undefined };
    const existeUsuario = usuarios.find(u => u.id_usuario === usuarioAInsertar.id_usuario);

    if (existeUsuario) {
      // Si existe, actualizar mediante PUT
      axios
        .put(`http://localhost:3000/usuarios/${usuarioAInsertar.id_usuario}`, usuarioAInsertar, {
          headers: { Authorization: token },
        })
        .then(() => fetchUsuarios())
        .catch(error => console.error('Error al actualizar usuario:', error));
    } else {
      // Sino, agregar mediante POST
      axios
        .post('http://localhost:3000/usuarios', usuarioAInsertar, {
          headers: { Authorization: token },
        })
        .then(() => fetchUsuarios())
        .catch(error => console.error('Error al agregar usuario:', error));
    }

    // Limpiar formulario
    setNuevoUsuario({ id_usuario: '', nombre: '', apellido: '', correo: '', contraseña: '' });
  };

  const handleEdit = (usuario: Usuario) => {
    setNuevoUsuario({
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
      .then(() => fetchUsuarios())
      .catch(error => console.error('Error al eliminar usuario:', error));
  };

  return (
    <div className="container mt-4">
      <h1>Usuarios</h1>
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

      <h2>{nuevoUsuario.id_usuario ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input type="text" className="form-control" name="nombre" value={nuevoUsuario.nombre} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Apellido</label>
          <input type="text" className="form-control" name="apellido" value={nuevoUsuario.apellido} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Correo</label>
          <input type="email" className="form-control" name="correo" value={nuevoUsuario.correo} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" className="form-control" name="contraseña" value={nuevoUsuario.contraseña} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">
          {nuevoUsuario.id_usuario ? 'Actualizar' : 'Agregar'}
        </button>
      </form>
    </div>
  );
}

export default Usuarios;
