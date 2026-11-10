import { useCallback, useEffect, useState } from 'react'
import './SuscriptorForm.css'

const initialFormData = {
  cedula: '',
  primerNombre: '',
  segundoNombre: '',
  primerApellido: '',
  segundoApellido: '',
  celular: '',
  correoElectronico: '',
}

function getInitialFormData(suscriptor) {
  if (!suscriptor) {
    return initialFormData
  }

  let primerNombre = suscriptor.primerNombre ?? ''
  let segundoNombre = suscriptor.segundoNombre ?? ''
  let primerApellido = suscriptor.primerApellido ?? ''
  let segundoApellido = suscriptor.segundoApellido ?? ''

  if (!primerNombre && suscriptor.nombreCompleto) {
    const partes = suscriptor.nombreCompleto.trim().split(/\s+/)
    if (partes.length === 1) {
      primerNombre = partes[0]
    } else if (partes.length === 2) {
      primerNombre = partes[0]
      primerApellido = partes[1]
    } else if (partes.length === 3) {
      primerNombre = partes[0]
      primerApellido = partes[1]
      segundoApellido = partes[2]
    } else if (partes.length >= 4) {
      primerNombre = partes[0]
      segundoNombre = partes[1]
      primerApellido = partes[2]
      segundoApellido = partes.slice(3).join(' ')
    }
  }

  return {
    cedula: suscriptor.cedula ?? '',
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    celular: suscriptor.celular ?? '',
    correoElectronico: suscriptor.correoElectronico ?? '',
  }
}

function SuscriptorForm({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  suscriptorAEditar = null,
}) {
  const isEditing = Boolean(suscriptorAEditar)
  const [formData, setFormData] = useState(() =>
    getInitialFormData(suscriptorAEditar),
  )
  const [validationError, setValidationError] = useState('')

  const handleClose = useCallback(() => {
    if (!submitting) {
      setFormData(initialFormData)
      setValidationError('')
      onClose()
    }
  }, [onClose, submitting])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    document.body.classList.add('modal-open')

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleClose, isOpen])

  if (!isOpen) {
    return null
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    if (validationError) {
      setValidationError('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const cedula = formData.cedula.trim()
    const primerNombre = formData.primerNombre.trim()
    const primerApellido = formData.primerApellido.trim()

    if (!cedula || !primerNombre || !primerApellido) {
      setValidationError(
        'Completa la cédula, el primer nombre y el primer apellido.',
      )
      return
    }

    if (!/^\d+$/.test(cedula)) {
      setValidationError(
        'La cédula debe contener únicamente números.',
      )
      return
    }

    const usuario = {
      cedula,
      primerNombre,
      segundoNombre: formData.segundoNombre.trim() || null,
      primerApellido,
      segundoApellido:
        formData.segundoApellido.trim() || null,
      celular: formData.celular.trim() || null,
      correoElectronico:
        formData.correoElectronico.trim() || null,
    }

    try {
      await onSubmit(usuario)
    } catch (error) {
      setValidationError(
        error.message ||
          (isEditing
            ? 'No fue posible actualizar el suscriptor. Revisa los datos e intenta nuevamente.'
            : 'No fue posible registrar el suscriptor. Revisa los datos e intenta nuevamente.'),
      )
    }
  }

  function handleBackdropClick(event) {
    if (
      event.target === event.currentTarget &&
      !submitting
    ) {
      handleClose()
    }
  }

  return (
    <div
      className="subscriber-modal"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <section
        className="subscriber-form-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="subscriber-form-title"
      >
        <header className="subscriber-form-card__header">
          <div>
            <span className="subscriber-form-card__eyebrow">
              Gestión administrativa
            </span>

            <h2 id="subscriber-form-title">
              {isEditing ? 'Editar suscriptor' : 'Nuevo suscriptor'}
            </h2>

            <p>
              {isEditing
                ? 'Actualiza los datos personales y de contacto del suscriptor.'
                : 'Registra los datos personales y de contacto del nuevo suscriptor.'}
            </p>
          </div>

          <button
            className="subscriber-form-card__close"
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </header>

        <form
          className="subscriber-form"
          onSubmit={handleSubmit}
        >
          {validationError && (
            <div
              className="subscriber-form__message subscriber-form__message--error"
              role="alert"
            >
              {validationError}
            </div>
          )}

          <fieldset className="subscriber-form__section">
            <legend>Identificación</legend>

            <div className="subscriber-form__grid">
              <div className="subscriber-form__group">
                <label htmlFor="cedula">
                  Cédula
                  <span aria-hidden="true"> *</span>
                </label>

                <input
                  id="cedula"
                  name="cedula"
                  type="text"
                  inputMode="numeric"
                  value={formData.cedula}
                  onChange={handleChange}
                  placeholder="Número de identificación"
                  autoComplete="off"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="subscriber-form__section">
            <legend>Nombres y apellidos</legend>

            <div className="subscriber-form__grid">
              <div className="subscriber-form__group">
                <label htmlFor="primerNombre">
                  Primer nombre
                  <span aria-hidden="true"> *</span>
                </label>

                <input
                  id="primerNombre"
                  name="primerNombre"
                  type="text"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  placeholder="Primer nombre"
                  autoComplete="given-name"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="subscriber-form__group">
                <label htmlFor="segundoNombre">
                  Segundo nombre
                </label>

                <input
                  id="segundoNombre"
                  name="segundoNombre"
                  type="text"
                  value={formData.segundoNombre}
                  onChange={handleChange}
                  placeholder="Opcional"
                  autoComplete="additional-name"
                  disabled={submitting}
                />
              </div>

              <div className="subscriber-form__group">
                <label htmlFor="primerApellido">
                  Primer apellido
                  <span aria-hidden="true"> *</span>
                </label>

                <input
                  id="primerApellido"
                  name="primerApellido"
                  type="text"
                  value={formData.primerApellido}
                  onChange={handleChange}
                  placeholder="Primer apellido"
                  autoComplete="family-name"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="subscriber-form__group">
                <label htmlFor="segundoApellido">
                  Segundo apellido
                </label>

                <input
                  id="segundoApellido"
                  name="segundoApellido"
                  type="text"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                  placeholder="Opcional"
                  disabled={submitting}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="subscriber-form__section">
            <legend>Datos de contacto</legend>

            <div className="subscriber-form__grid">
              <div className="subscriber-form__group">
                <label htmlFor="celular">
                  Celular
                </label>

                <input
                  id="celular"
                  name="celular"
                  type="tel"
                  inputMode="tel"
                  value={formData.celular}
                  onChange={handleChange}
                  placeholder="Número de contacto"
                  autoComplete="tel"
                  disabled={submitting}
                />
              </div>

              <div className="subscriber-form__group">
                <label htmlFor="correoElectronico">
                  Correo electrónico
                </label>

                <input
                  id="correoElectronico"
                  name="correoElectronico"
                  type="email"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  placeholder="nombre@correo.com"
                  autoComplete="email"
                  disabled={submitting}
                />
              </div>
            </div>
          </fieldset>

          <p className="subscriber-form__required-note">
            Los campos marcados con * son obligatorios.
          </p>

          <div className="subscriber-form__actions">
            <button
              className="subscriber-form__button subscriber-form__button--secondary"
              type="button"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancelar
            </button>

            <button
              className="subscriber-form__button subscriber-form__button--primary"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? isEditing
                  ? 'Guardando cambios...'
                  : 'Registrando...'
                : isEditing
                  ? 'Guardar cambios'
                  : 'Registrar suscriptor'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default SuscriptorForm