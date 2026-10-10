import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
  })

function handleChange(event) {
  const { name, value } = event.target

  setFormData((currentData) => ({
    ...currentData,
    [name]: value,
  }))
}
function handleSubmit(event) {
  event.preventDefault()

  if (!formData.correo.trim() || !formData.contrasena.trim()) {
    return
  }

  navigate('/inicio', { replace: true })
}

  return (
    <section className="login-card">
      <header className="login-card__header">
        <p className="login-card__eyebrow">
          Portal administrativo
        </p>

        <h2>Iniciar sesión</h2>

        <p>
          Ingresa tus datos para acceder a Aguas Paraíso.
        </p>
      </header>

      <form
        className="login-form"
        onSubmit={handleSubmit}
      >
        <div className="login-form__group">
          <label htmlFor="correo">
            Correo electrónico
          </label>

          <input
            id="correo"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            placeholder="usuario@correo.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="login-form__group">
          <label htmlFor="contrasena">
            Contraseña
          </label>

          <input
            id="contrasena"
            name="contrasena"
            type="password"
            value={formData.contrasena}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          className="login-form__button"
          type="submit"
        >
          Ingresar
        </button>
      </form>
    </section>
  )
}

export default LoginPage