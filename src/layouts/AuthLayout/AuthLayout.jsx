import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

function AuthLayout() {
  return (
    <div className="auth-layout">
      <section className="auth-layout__branding">
        <h1>Aguas Paraíso</h1>
        <p>Gestión comunitaria del servicio de agua</p>
      </section>

      <main className="auth-layout__content">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout