import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

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
            className={({ isActive }) =>
              isActive
                ? 'navbar__link navbar__link--active'
                : 'navbar__link'
            }
            to="/inicio"
          >
            Inicio
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'navbar__link navbar__link--active'
                : 'navbar__link'
            }
            to="/predios"
          >
            Predios
          </NavLink>
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
              {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
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