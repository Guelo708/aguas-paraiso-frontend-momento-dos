import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarUsuarios } from '../../services/usuarioService.js'
import imagenHero from '../../assets/Imagen2.png'
import imagenOperacion from '../../assets/Imagen3.png'
import './DashboardPage.css'

function DashboardPage() {
  const [totalUsuarios, setTotalUsuarios] = useState(0)
  const [loadingUsuarios, setLoadingUsuarios] = useState(true)
  const [errorUsuarios, setErrorUsuarios] = useState('')

  useEffect(() => {
    let active = true

    async function cargarUsuarios() {
      try {
        setLoadingUsuarios(true)
        setErrorUsuarios('')

        const usuarios = await listarUsuarios()

        if (active) {
          setTotalUsuarios(Array.isArray(usuarios) ? usuarios.length : 0)
        }
      } catch (error) {
        if (active) {
          setErrorUsuarios(error.message)
        }
      } finally {
        if (active) {
          setLoadingUsuarios(false)
        }
      }
    }

    cargarUsuarios()

    return () => {
      active = false
    }
  }, [])

  const irAModulos = () => {
    const seccion = document.getElementById('modulos-sistema')
    if (seccion) {
      seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="dashboard">
      <header className="dashboard__hero">
        <img
          className="dashboard__hero-image"
          src={imagenHero}
          alt=""
          aria-hidden="true"
        />

        <div className="dashboard__hero-overlay" />

        <div className="dashboard__hero-content">
          <span className="dashboard__eyebrow">
            Panel administrativo
          </span>

          <h1>Bienvenido a Aguas Paraíso</h1>

          <p>
            Gestiona la información de los predios, facturas, recaudos y
            estadísticas del acueducto comunitario desde un espacio
            centralizado, claro y seguro.
          </p>

          <div className="dashboard__hero-actions">
            <button
              type="button"
              className="dashboard__primary-button"
              onClick={irAModulos}
            >
              Explorar módulos
            </button>

            <Link
              className="dashboard__secondary-button"
              to="/estadisticas"
            >
              Ver dashboard estadístico
            </Link>
          </div>
        </div>

        <aside
          className="dashboard__hero-glass"
          aria-label="Estado operativo"
        >
          <span className="dashboard__glass-badge">
            Acueducto comunitario
          </span>

          <h2>Gestión integral</h2>

          <p>
            Control unificado de suscriptores, facturación mensual,
            recaudo por medios digitales y cartera por sector.
          </p>

          <div className="dashboard__glass-tags">
            <span>Predios y sectores</span>
            <span>Facturación</span>
            <span>Analítica en tiempo real</span>
          </div>
        </aside>
      </header>

      <section
        className="dashboard__summary"
        aria-label="Resumen del sistema"
      >
        <article className="dashboard-card dashboard-card--primary">
          <span className="dashboard-card__number">
            {loadingUsuarios ? '...' : totalUsuarios}
          </span>

          <div>
            <h2>Suscriptores</h2>

            {errorUsuarios ? (
              <p>{errorUsuarios}</p>
            ) : (
              <p>
                Usuarios registrados actualmente en Aguas Paraíso.
              </p>
            )}
          </div>
        </article>

        <article className="dashboard-card dashboard-card--secondary">
          <span className="dashboard-card__number">
            02
          </span>

          <div>
            <h2>Facturación y Recaudo</h2>

            <p>
              Registro centralizado de facturas emitidas, abonos parciales
              y pagos por transferencia o efectivo.
            </p>
          </div>
        </article>

        <article className="dashboard-card dashboard-card--accent">
          <span className="dashboard-card__number">
            03
          </span>

          <div>
            <h2>Analítica e Indicadores</h2>

            <p>
              Visualización de cartera vencida por sector, top deudores
              y comportamiento mensual en tiempo real.
            </p>
          </div>
        </article>
      </section>

      <section id="modulos-sistema" className="dashboard__information">
        <div className="dashboard__info-copy">
          <span className="dashboard__eyebrow">
            Operación institucional
          </span>

          <h2>Módulos integrados para la administración del acueducto</h2>

          <div className="dashboard__feature-list">
            <Link to="/gestion/suscriptores" className="dashboard__module-link">
              <span>Directorio de suscriptores y propietarios</span>
              <span className="dashboard__module-arrow" aria-hidden="true">→</span>
            </Link>

            <Link to="/predios" className="dashboard__module-link">
              <span>Gestión de predios, sectores y tarifas</span>
              <span className="dashboard__module-arrow" aria-hidden="true">→</span>
            </Link>

            <Link to="/facturas" className="dashboard__module-link">
              <span>Generación y seguimiento de facturas</span>
              <span className="dashboard__module-arrow" aria-hidden="true">→</span>
            </Link>

            <Link to="/pagos" className="dashboard__module-link">
              <span>Registro y conciliación de pagos</span>
              <span className="dashboard__module-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <figure className="dashboard__info-media">
          <img
            src={imagenOperacion}
            alt="Infraestructura y gestión comunitaria de Aguas Paraíso"
          />
          <div className="dashboard__info-media-overlay" />
          <figcaption className="dashboard__info-caption">
            Agua que conecta comunidad y bienestar
          </figcaption>
        </figure>
      </section>
    </section>
  )
}

export default DashboardPage
