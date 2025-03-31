import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/home">
            PelisPlus
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCine"
            aria-controls="navbarCine"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCine">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2">
                <select className="form-select" aria-label="Selecciona un cine">
                  <option value="">Selecciona un cine</option>
                  <option value="1">Cine 1</option>
                  <option value="2">Cine 2</option>
                  <option value="3">Cine 3</option>
                </select>
              </li>
              <li className="nav-item mx-2">
                <select className="form-select" aria-label="Selecciona una ciudad">
                  <option value="">Selecciona una ciudad</option>
                  <option value="1">Ciudad 1</option>
                  <option value="2">Ciudad 2</option>
                  <option value="3">Ciudad 3</option>
                </select>
              </li>
            </ul>
            {/* Icono de usuario o botón de login */}
            <div className="d-flex">
              <Link to="/login" className="nav-link">
                <img
                  src="images/user.png"
                  alt="Usuario"
                  className="rounded-circle"
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container my-4">
        {/* Sección de Promociones */}
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
                src="src/images/Avengers.jpg"
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
                <Link to="/sinopsis" className="btn btn-primary">
                  Comprar boletos
                </Link>
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
                <Link to="/sinopsis" className="btn btn-primary">
                  Comprar boletos
                </Link>
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
                <Link to="/sinopsis" className="btn btn-primary">
                  Comprar boletos
                </Link>
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
                <Link to="/sinopsis" className="btn btn-primary">
                  Comprar boletos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
