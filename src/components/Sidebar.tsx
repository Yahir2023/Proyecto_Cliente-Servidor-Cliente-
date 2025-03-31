import { Link } from "react-router-dom";
import "./Sidebar.css"; // Asegúrate de crear este archivo

function Sidebar() {
  return (
    <div className="sidebar">
      <h4 className="sidebar-title">Menú</h4>
      <ul className="sidebar-nav">
        <li><Link to="/dashboard(admin)">Inicio</Link></li>
        <li><Link to="/admin">Administradores</Link></li>
        <li><Link to="/Usuarios">Usuarios</Link></li>
        <li><Link to="/asientos">Asientos</Link></li>
        <li><Link to="/boletos">Boletos</Link></li>
        <li><Link to="/compras">Compras</Link></li>
        <li><Link to="/funciones">Funciones</Link></li>
        <li><Link to="/pagos">Pagos</Link></li>
        <li><Link to="/peliculas">Películas</Link></li>
        <li><Link to="/promociones">Promociones</Link></li>
        <li><Link to="/reservas">Reservas</Link></li>
        <li><Link to="/salas">Salas</Link></li>
        <li><Link to="/salausuario">SalaUsuarioS</Link></li>
        
      </ul>
    </div>
  );
}

export default Sidebar;
