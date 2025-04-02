import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

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

const Dashboard: React.FC = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);

  // Obtener las películas desde la API pública (GET /peliculas)
  useEffect(() => {
    axios.get("http://localhost:3000/peliculas")
      .then((res) => {
        setPeliculas(res.data);
      })
      .catch((err) => {
        console.error("Error al cargar películas:", err);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-fluid my-4 pt-5">
        <div className="row g-3 mb-5">
          <div className="col-md-4">
            <img
              src="https://static.cinepolis.com/img/promociones/1/202521218252127.jpg"
              className="img-fluid rounded"
              alt="Promoción 1"
            />
          </div>
          <div className="col-md-4">
            <img
              src="https://static.cinepolis.com/img/promociones/1/202521218610956.jpg"
              className="img-fluid rounded"
              alt="Promoción 2"
            />
          </div>
          <div className="col-md-4">
            <img
              src="https://static.cinepolis.com/img/promociones/1/2025212187034.jpg"
              className="img-fluid rounded"
              alt="Promoción 3"
            />
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 g-3">
          {peliculas.map((pelicula) => (
            <div className="col" key={pelicula.id_pelicula}>
              <div className="card h-100">
                <img
                  src={`http://localhost:3000${pelicula.ruta_imagen}`}
                  className="card-img-top"
                  alt={pelicula.titulo}
                />
                <div className="card-body">
                  <h5 className="card-title">{pelicula.titulo}</h5>
                  <p className="card-text">
                    {pelicula.sinopsis.length > 100
                      ? pelicula.sinopsis.substring(0, 100) + '...'
                      : pelicula.sinopsis}
                  </p>
                </div>
                <div className="card-footer text-center">
                  <a href="#" className="btn btn-primary">
                    Comprar boletos
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
