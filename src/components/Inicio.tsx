import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const inicio = () => {
  return (
    <div className="container my-4">
      <div className="row g-3 mb-4">
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

      {/* Sección de Películas */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
        {/* Tarjeta de Película 1 */}
        <div className="col">
          <div className="card h-100">
            <img
              src="https://www.imagemfilmeslatam.com/micrositios/implacable/poster_final_alta.jpg"
              className="card-img-top"
              alt="Implacable"
            />
            <div className="card-body">
              <h5 className="card-title">Implacable</h5>
              <p className="card-text">
                Película de acción con altas dosis de adrenalina.
              </p>
            </div>
            <div className="card-footer text-center">
              <a href="sinopsis.html" className="btn btn-primary">
                Comprar boletos
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta de Película 2 */}
        <div className="col">
          <div className="card h-100">
            <img
              src="https://pics.filmaffinity.com/The_Medium-287597499-large.jpg"
              className="card-img-top"
              alt="Medium"
            />
            <div className="card-body">
              <h5 className="card-title">Medium</h5>
              <p className="card-text">
                Terror y misterio que te mantendrán en suspenso.
              </p>
            </div>
            <div className="card-footer text-center">
              <a href="#" className="btn btn-primary">
                Comprar boletos
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta de Película 3 */}
        <div className="col">
          <div className="card h-100">
            <img
              src="https://m.media-amazon.com/images/M/MV5BNjIxNzkyZWMtMmM2Ni00MWQ5LTllNzMtMzAzNGU5MjYxMDBmXkEyXkFqcGc@._V1_.jpg"
              className="card-img-top"
              alt="La sobreviviente: La caída del vuelo 811"
            />
            <div className="card-body">
              <h5 className="card-title">
                La sobreviviente: La caída del vuelo 811
              </h5>
              <p className="card-text">
                Un drama de supervivencia lleno de emociones.
              </p>
            </div>
            <div className="card-footer text-center">
              <a href="#" className="btn btn-primary">
                Comprar boletos
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta de Película 4 */}
        <div className="col">
          <div className="card h-100">
            <img
              src="https://cultura.nexos.com.mx/wp-content/uploads/2025/02/mv5botrizme4ndctntf.jpg"
              className="card-img-top"
              alt="El brutalista"
            />
            <div className="card-body">
              <h5 className="card-title">El brutalista</h5>
              <p className="card-text">
                Drama intenso que explora la oscuridad humana.
              </p>
            </div>
            <div className="card-footer text-center">
              <a href="#" className="btn btn-primary">
                Comprar boletos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default inicio;
