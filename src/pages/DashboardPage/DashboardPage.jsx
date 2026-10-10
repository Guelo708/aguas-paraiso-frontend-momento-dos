import { Link } from 'react-router-dom'
import './DashboardPage.css'

function DashboardPage() {
  return (
    <section className="dashboard">
      <header className="dashboard__hero">
        <div className="dashboard__hero-content">
          <span className="dashboard__eyebrow">
            Panel administrativo
          </span>

          <h1>Bienvenido a Aguas Paraíso</h1>

          <p>
            Gestiona la información de los predios del acueducto
            comunitario desde un espacio centralizado, claro y seguro.
          </p>

          <Link
            className="dashboard__primary-button"
            to="/predios"
          >
            Gestionar predios
          </Link>
        </div>

        <div
          className="dashboard__water-symbol"
          aria-hidden="true"
        >
          AP
        </div>
      </header>

      <section
        className="dashboard__summary"
        aria-label="Resumen del sistema"
      >
        <article className="dashboard-card dashboard-card--primary">
          <span className="dashboard-card__number">
            01
          </span>

          <div>
            <h2>Predios</h2>

            <p>
              Registra, consulta, edita y elimina predios temporalmente.
            </p>
          </div>
        </article>

        <article className="dashboard-card dashboard-card--secondary">
          <span className="dashboard-card__number">
            02
          </span>

          <div>
            <h2>Context API</h2>

            <p>
              Comparte los registros y las operaciones del CRUD
              entre los componentes.
            </p>
          </div>
        </article>

        <article className="dashboard-card dashboard-card--accent">
          <span className="dashboard-card__number">
            03
          </span>

          <div>
            <h2>Tema adaptable</h2>

            <p>
              Cambia entre tema claro y oscuro desde la barra
              de navegación.
            </p>
          </div>
        </article>
      </section>

      <section className="dashboard__information">
        <div>
          <span className="dashboard__eyebrow">
            Producto mínimo viable
          </span>

          <h2>Funciones preparadas para la demostración</h2>
        </div>

        <ul className="dashboard__feature-list">
          <li>Inicio de sesión con formulario controlado</li>
          <li>Navegación entre páginas sin recargar el navegador</li>
          <li>Diseño reutilizable con Navbar y Footer</li>
          <li>CRUD temporal para la gestión de predios</li>
        </ul>
      </section>
    </section>
  )
}

export default DashboardPage