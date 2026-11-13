import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className={
avbar \}>
      <div className="navbar-left">
        <div className="navbar-logo">
          <span className="logo-icon">AP</span>
          <div className="logo-text">
            <h2>Aguas Paraíso</h2>
            <p>Gestión comunitaria</p>
          </div>
        </div>
        <ul className="navbar-links">
          <li><Link to="/inicio">Inicio</Link></li>
          <li><Link to="/estadisticas">Estadísticas</Link></li>
          <li><Link to="/gestion/suscriptores">Suscriptores</Link></li>
          <li><Link to="/predios">Predios</Link></li>
          <li><Link to="/facturas">Facturas</Link></li>
          <li><Link to="/pagos">Pagos</Link></li>
          <li className="dropdown">
            <span>Catálogos</span>
            <ul className="dropdown-menu">
              <li><Link to="/catalogos/sectores">Sectores</Link></li>
              <li><Link to="/catalogos/tipos-predio">Tipos de Predio</Link></li>
              <li><Link to="/catalogos/tarifas">Tarifas</Link></li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Modo oscuro' : '☀️ Modo claro'}
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
