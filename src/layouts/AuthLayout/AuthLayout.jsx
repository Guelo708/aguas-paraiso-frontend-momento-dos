import { Outlet } from 'react-router-dom'
import imagenPrincipal from '../../assets/imagen1.png'
import './AuthLayout.css'

function AuthLayout() {
  return (
    <div className="auth-layout">
      <section className="auth-layout__branding">
        <img
          className="auth-layout__image"
          src={imagenPrincipal}
          alt=""
          aria-hidden="true"
        />

        <div className="auth-layout__overlay" />

        <div className="auth-layout__branding-content">
          <span className="auth-layout__badge">
            Acueducto comunitario
          </span>

          <h1>Aguas Paraíso</h1>

          <p className="auth-layout__description">
            Tecnología y gestión al servicio de nuestra comunidad.
          </p>

          <div className="auth-layout__features">
            <span>Gestión de predios</span>
            <span>Facturación transparente</span>
            <span>Control seguro de pagos</span>
          </div>
        </div>

        <footer className="auth-layout__footer">
          Agua que conecta comunidad y bienestar
        </footer>
      </section>

      <main className="auth-layout__content">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
