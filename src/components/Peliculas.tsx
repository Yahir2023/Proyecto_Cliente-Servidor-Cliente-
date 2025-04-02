import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './Sidebar';

interface Pelicula {
  id_pelicula: number;
  titulo: string;
  duracion: number;
  clasificacion: string;
  sinopsis: string;
  director: string;
  genero: string;
  ruta_imagen: string;
  created_at: string;
  updated_at: string;
}

const AdminPeliculas: React.FC = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [current, setCurrent] = useState<Pelicula | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    duracion: 0,
    clasificacion: '',
    sinopsis: '',
    director: '',
    genero: '',
    ruta_imagen: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Obtén el token de administrador (puedes almacenarlo en localStorage o definirlo aquí)
  const token = localStorage.getItem("token") || "Bearer TU_TOKEN_ADMIN_AQUI";

  // Función para obtener las películas (endpoint protegido para administradores)
  const fetchMovies = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/peliculas", {
        headers: { Authorization: token }
      });
      setPeliculas(res.data);
    } catch (error) {
      console.error("Error al obtener películas", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar selección de archivo
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Función para subir la imagen y obtener la ruta
  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return "";
    const data = new FormData();
    data.append("imagen", imageFile);
    try {
      const res = await axios.post("http://localhost:3000/admin/peliculas/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token
        }
      });
      return res.data.rutaImagen;
    } catch (error) {
      console.error("Error al subir la imagen", error);
      return "";
    }
  };

  // Manejar envío del formulario para agregar/actualizar
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let rutaImagen = formData.ruta_imagen;
    if (imageFile) {
      rutaImagen = await uploadImage();
    }
    // Corrige el payload para que la clave sea "ruta_imagen"
    const payload = { ...formData, ruta_imagen: rutaImagen };
    try {
      if (editing && current) {
        await axios.put(`http://localhost:3000/peliculas/${current.id_pelicula}`, payload, {
          headers: { Authorization: token }
        });
      } else {
        await axios.post("http://localhost:3000/admin/peliculas", payload, {
          headers: { Authorization: token }
        });
      }
      setFormData({
        titulo: '',
        duracion: 0,
        clasificacion: '',
        sinopsis: '',
        director: '',
        genero: '',
        ruta_imagen: ''
      });
      setImageFile(null);
      setEditing(false);
      setCurrent(null);
      fetchMovies();
    } catch (error) {
      console.error("Error al guardar la película", error);
    }
  };

  // Manejar edición: carga los datos de la película en el formulario
  const handleEdit = (pelicula: Pelicula) => {
    setEditing(true);
    setCurrent(pelicula);
    setFormData({
      titulo: pelicula.titulo,
      duracion: pelicula.duracion,
      clasificacion: pelicula.clasificacion,
      sinopsis: pelicula.sinopsis,
      director: pelicula.director,
      genero: pelicula.genero,
      ruta_imagen: pelicula.ruta_imagen
    });
  };

  // Manejar eliminación de una película
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/peliculas/${id}`, {
        headers: { Authorization: token }
      });
      fetchMovies();
    } catch (error) {
      console.error("Error al eliminar la película", error);
    }
  };

  return (
    <div className="main-content mt-5">
      <Sidebar />
      <h2 className="mb-4">Administrar Películas</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Título</label>
            <input
              type="text"
              className="form-control"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Duración (minutos)</label>
            <input
              type="number"
              className="form-control"
              name="duracion"
              value={formData.duracion}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Clasificación</label>
            <input
              type="text"
              className="form-control"
              name="clasificacion"
              value={formData.clasificacion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Género</label>
            <input
              type="text"
              className="form-control"
              name="genero"
              value={formData.genero}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label>Sinopsis</label>
          <textarea
            className="form-control"
            name="sinopsis"
            value={formData.sinopsis}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Director</label>
          <input
            type="text"
            className="form-control"
            name="director"
            value={formData.director}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Imagen</label>
          <input type="file" className="form-control" onChange={handleImageChange} />
        </div>
        <button type="submit" className="btn btn-primary">
          {editing ? "Actualizar Película" : "Agregar Película"}
        </button>
      </form>

      <h3 className="mb-3">Listado de Películas</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Duración</th>
            <th>Clasificación</th>
            <th>Género</th>
            <th>Director</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {peliculas.map((pelicula) => (
            <tr key={pelicula.id_pelicula}>
              <td>{pelicula.id_pelicula}</td>
              <td>{pelicula.titulo}</td>
              <td>{pelicula.duracion}</td>
              <td>{pelicula.clasificacion}</td>
              <td>{pelicula.genero}</td>
              <td>{pelicula.director}</td>
              <td>
                {pelicula.ruta_imagen && (
                  <img
                    src={`http://localhost:3000${pelicula.ruta_imagen}`}
                    alt={pelicula.titulo}
                    width="100"
                  />
                )}
              </td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(pelicula)}>
                  Editar
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(pelicula.id_pelicula)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPeliculas;
