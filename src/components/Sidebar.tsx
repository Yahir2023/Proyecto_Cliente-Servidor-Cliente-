import { Link } from "react-router-dom";
import "./Sidebar.css"; // Asegúrate de crear este archivo

function Sidebar() {
  return (
    <div className="sidebar bg-dark text-white">
      <h4 className="sidebar-title">Menú</h4>
      <ul className="sidebar-nav">
        <li><Link to="/dashboard(admin)" className="nav-link">🏠 Inicio</Link></li>
        <li><Link to="/admin" className="nav-link">👨‍💼 Administradores</Link></li>
        <li><Link to="/Usuarios" className="nav-link">👥 Usuarios</Link></li>
        <li><Link to="/asientos" className="nav-link">💺 Asientos</Link></li>
        <li><Link to="/boletos" className="nav-link">🎟️ Boletos</Link></li>
        <li><Link to="/compras" className="nav-link">🛒 Compras</Link></li>
        <li><Link to="/funciones" className="nav-link">🎭 Funciones</Link></li>
        <li><Link to="/pagos" className="nav-link">💳 Pagos</Link></li>
        <li><Link to="/peliculas" className="nav-link">🎬 Películas</Link></li>
        <li><Link to="/promociones" className="nav-link">🔥 Promociones</Link></li>
        <li><Link to="/reservas" className="nav-link">📅 Reservas</Link></li>
        <li><Link to="/salas" className="nav-link">🏢 Salas</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
