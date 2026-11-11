import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import './Navbar.css'
import './AdminNavigation.css'

function Navbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  function getLinkClass({ isActive }) {
    return isActive
      ? 'navbar__link navbar__link--active'
      : 'navbar__link'
  }

  function handleLogout() {
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar__container">
        <NavLink
          className="navbar__brand"
          to="/inicio"
        >
          <span
            className="navbar__logo"
            aria-hidden="true"
          >
            AP
          </span>

          <span className="navbar__brand-text">
            <strong>Aguas Paraíso</strong>
            <small>Gestión comunitaria</small>
          </span>
        </NavLink>

        <nav
          className="navbar__navigation"
          aria-label="Navegación principal"
        >
          <NavLink
            className={getLinkClass}
            to="/inicio"
          >
            Inicio
          </NavLink>

          <NavLink
            className={getLinkClass}
            to="/gestion/suscriptores"
          >
            Suscriptores
          </NavLink>

          <NavLink className={getLinkClass} to="/predios">Predios</NavLink>
          <NavLink className={getLinkClass} to="/facturas">Facturas</NavLink>
          <NavLink className={getLinkClass} to="/pagos">Pagos</NavLink>
          <details className="navbar__catalogs">
            <summary>Catálogos</summary>
            <div className="navbar__catalog-menu">
              <NavLink className={getLinkClass} to="/catalogos/sectores">Sectores</NavLink>
              <NavLink className={getLinkClass} to="/catalogos/tipos-predio">Tipos de predio</NavLink>
              <NavLink className={getLinkClass} to="/catalogos/tarifas">Tarifas</NavLink>
            </div>
          </details>
        </nav>

        <div className="navbar__actions">
          <button
            className="navbar__theme-button"
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'light'
                ? 'Activar tema oscuro'
                : 'Activar tema claro'
            }
          >
            <span
              className="navbar__theme-icon"
              aria-hidden="true"
            >
              {theme === 'light' ? '☾' : '☀'}
            </span>

            <span>
              {theme === 'light'
                ? 'Modo oscuro'
                : 'Modo claro'}
            </span>
          </button>

          <button
            className="navbar__logout-button"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
