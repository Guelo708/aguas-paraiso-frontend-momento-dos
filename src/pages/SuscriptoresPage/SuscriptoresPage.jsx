import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  actualizarUsuario,
  buscarUsuarioPorId,
  eliminarUsuario,
  listarUsuarios,
  registrarUsuario,
} from '../../services/usuarioService.js'

import SuscriptorForm from '../../components/SuscriptorForm/SuscriptorForm.jsx'
import './SuscriptoresPage.css'

function SuscriptoresPage() {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [suscriptorAEditar, setSuscriptorAEditar] = useState(null)
  const [suscriptorAEliminar, setSuscriptorAEliminar] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  })

  useEffect(() => {
    let active = true

    async function cargarUsuarios() {
      try {
        setLoading(true)
        setError('')

        const data = await listarUsuarios()

        if (active) {
          setUsuarios(Array.isArray(data) ? data : [])
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    cargarUsuarios()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!suscriptorAEliminar) {
      return undefined
    }

    document.body.classList.add('modal-open')

    function handleEscape(event) {
      if (event.key === 'Escape' && !deleting) {
        setSuscriptorAEliminar(null)
        setDeleteError('')
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', handleEscape)
    }
  }, [deleting, suscriptorAEliminar])

  const usuariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    if (!termino) {
      return usuarios
    }

    return usuarios.filter((usuario) => {
      const campos = [
        usuario.cedula,
        usuario.nombreCompleto,
        usuario.celular,
        usuario.correoElectronico,
      ]

      return campos.some((campo) =>
        String(campo ?? '')
          .toLowerCase()
          .includes(termino),
      )
    })
  }, [busqueda, usuarios])

  function handleNuevo() {
    setFeedback({
      type: '',
      message: '',
    })
    setSuscriptorAEditar(null)
    setFormOpen(true)
  }

  function handleCloseForm() {
    if (!submitting) {
      setFormOpen(false)
      setSuscriptorAEditar(null)
    }
  }

  async function handleSubmitSuscriptor(usuarioData) {
    try {
      setSubmitting(true)

      if (suscriptorAEditar) {
        const usuarioActualizado = await actualizarUsuario(
          suscriptorAEditar.id,
          usuarioData,
        )

        setUsuarios((currentUsuarios) =>
          currentUsuarios.map((u) => {
            if (u.id === suscriptorAEditar.id) {
              const nombreCompleto =
                usuarioActualizado?.nombreCompleto ||
                [
                  usuarioActualizado?.primerNombre ?? usuarioData.primerNombre,
                  usuarioActualizado?.primerApellido ??
                    usuarioData.primerApellido,
                ]
                  .filter(Boolean)
                  .join(' ') ||
                u.nombreCompleto

              return {
                ...u,
                ...usuarioData,
                ...(usuarioActualizado || {}),
                nombreCompleto,
              }
            }
            return u
          }),
        )

        setFormOpen(false)
        setSuscriptorAEditar(null)

        const nombreActualizado =
          usuarioActualizado?.nombreCompleto ||
          [usuarioData.primerNombre, usuarioData.primerApellido]
            .filter(Boolean)
            .join(' ') ||
          'El suscriptor'

        setFeedback({
          type: 'success',
          message: `${nombreActualizado} fue actualizado correctamente.`,
        })
      } else {
        const nuevoUsuario = await registrarUsuario(usuarioData)

        setUsuarios((currentUsuarios) => [
          ...currentUsuarios,
          nuevoUsuario,
        ])

        setFormOpen(false)

        const nombreRegistrado =
          nuevoUsuario.nombreCompleto ||
          [nuevoUsuario.primerNombre, nuevoUsuario.primerApellido]
            .filter(Boolean)
            .join(' ') ||
          'El suscriptor'

        setFeedback({
          type: 'success',
          message: `${nombreRegistrado} fue registrado correctamente.`,
        })
      }
    } catch (requestError) {
      setFeedback({
        type: 'error',
        message: requestError.message,
      })

      throw requestError
    } finally {
      setSubmitting(false)
    }
  }

  function handleVer(usuario) {
    navigate(`/gestion/suscriptores/${usuario.id}`)
  }

  async function handleEditar(usuario) {
    setFeedback({
      type: '',
      message: '',
    })

    if (usuario.id && !usuario.primerNombre) {
      try {
        const usuarioCompleto = await buscarUsuarioPorId(usuario.id)
        setSuscriptorAEditar(usuarioCompleto || usuario)
      } catch {
        setSuscriptorAEditar(usuario)
      }
    } else {
      setSuscriptorAEditar(usuario)
    }

    setFormOpen(true)
  }

  function handleEliminar(usuario) {
    setDeleteError('')
    setSuscriptorAEliminar(usuario)
  }

  function handleCerrarEliminar() {
    if (!deleting) {
      setSuscriptorAEliminar(null)
      setDeleteError('')
    }
  }

  async function handleConfirmarEliminar() {
    if (!suscriptorAEliminar) {
      return
    }

    try {
      setDeleting(true)
      setDeleteError('')

      await eliminarUsuario(suscriptorAEliminar.id)

      const nombreEliminado =
        suscriptorAEliminar.nombreCompleto ||
        [
          suscriptorAEliminar.primerNombre,
          suscriptorAEliminar.primerApellido,
        ]
          .filter(Boolean)
          .join(' ') ||
        'El suscriptor'

      setUsuarios((currentUsuarios) =>
        currentUsuarios.filter((u) => u.id !== suscriptorAEliminar.id),
      )

      setSuscriptorAEliminar(null)

      setFeedback({
        type: 'success',
        message: `${nombreEliminado} fue eliminado correctamente.`,
      })
    } catch (requestError) {
      setDeleteError(
        requestError.message ||
          'No fue posible eliminar el suscriptor. Intenta nuevamente.',
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="subscribers-page">
      <header className="subscribers-page__header">
        <div>
          <span className="subscribers-page__eyebrow">
            Gestión administrativa
          </span>

          <h1>Suscriptores</h1>

          <p>
            Consulta y administra las personas registradas en el
            acueducto Aguas Paraíso.
          </p>
        </div>

        <button
          className="subscribers-page__new-button"
          type="button"
          onClick={handleNuevo}
        >
          Nuevo suscriptor
        </button>
      </header>
{feedback.message && (
  <div
    className={`subscribers-feedback subscribers-feedback--${feedback.type}`}
    role={feedback.type === 'error' ? 'alert' : 'status'}
  >
    <span>{feedback.message}</span>

    <button
      type="button"
      onClick={() =>
        setFeedback({
          type: '',
          message: '',
        })
      }
      aria-label="Cerrar mensaje"
    >
      ×
    </button>
  </div>
)}
      <section
        className="subscribers-summary"
        aria-label="Resumen de suscriptores"
      >
        <article className="subscribers-summary__card">
          <span>Total registrados</span>
          <strong>{usuarios.length}</strong>
        </article>

        <article className="subscribers-summary__card">
          <span>Resultados visibles</span>
          <strong>{usuariosFiltrados.length}</strong>
        </article>
      </section>

      <section className="subscribers-panel">
        <div className="subscribers-toolbar">
          <div className="subscribers-search">
            <label htmlFor="busqueda-suscriptor">
              Buscar suscriptor
            </label>

            <input
              id="busqueda-suscriptor"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Cédula, nombre, teléfono o correo"
            />
          </div>

          {busqueda && (
            <button
              className="subscribers-toolbar__clear"
              type="button"
              onClick={() => setBusqueda('')}
            >
              Limpiar búsqueda
            </button>
          )}
        </div>

        {loading && (
          <div className="subscribers-state" role="status">
            Consultando suscriptores...
          </div>
        )}

        {!loading && error && (
          <div
            className="subscribers-state subscribers-state--error"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          usuariosFiltrados.length === 0 && (
            <div className="subscribers-state">
              No se encontraron suscriptores.
            </div>
          )}

        {!loading &&
          !error &&
          usuariosFiltrados.length > 0 && (
            <div className="subscribers-table-container">
              <table className="subscribers-table">
                <thead>
                  <tr>
                    <th>Cédula</th>
                    <th>Nombre completo</th>
                    <th>Celular</th>
                    <th>Correo electrónico</th>
                    <th className="subscribers-table__actions-heading">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.cedula}</td>

                      <td>
                        <strong>{usuario.nombreCompleto}</strong>
                      </td>

                      <td>{usuario.celular || 'No registrado'}</td>

                      <td>
                        {usuario.correoElectronico ||
                          'No registrado'}
                      </td>

                      <td>
                        <div className="subscribers-actions">
                          <button
                            className="subscribers-actions__button"
                            type="button"
                            translate="no"
                            onClick={() => handleVer(usuario)}
                          >
                            Ver
                          </button>

                          <button
                            className="subscribers-actions__button subscribers-actions__button--edit"
                            type="button"
                            onClick={() => handleEditar(usuario)}
                          >
                            Editar
                          </button>

                          <button
                            className="subscribers-actions__button subscribers-actions__button--delete"
                            type="button"
                            onClick={() => handleEliminar(usuario)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>

      {formOpen && (
        <SuscriptorForm
          key={suscriptorAEditar?.id ?? 'nuevo'}
          isOpen={formOpen}
          submitting={submitting}
          suscriptorAEditar={suscriptorAEditar}
          onClose={handleCloseForm}
          onSubmit={handleSubmitSuscriptor}
        />
      )}

      {suscriptorAEliminar && (
        <div
          className="subscribers-delete-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              handleCerrarEliminar()
            }
          }}
        >
          <section
            className="subscribers-delete-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <header className="subscribers-delete-card__header">
              <div>
                <span className="subscribers-delete-card__eyebrow">
                  Confirmación requerida
                </span>

                <h2 id="delete-dialog-title">Eliminar suscriptor</h2>
              </div>

              <button
                className="subscribers-delete-card__close"
                type="button"
                onClick={handleCerrarEliminar}
                disabled={deleting}
                aria-label="Cerrar diálogo"
              >
                ×
              </button>
            </header>

            <div className="subscribers-delete-card__body">
              {deleteError && (
                <div
                  className="subscribers-delete-card__error"
                  role="alert"
                >
                  {deleteError}
                </div>
              )}

              <p className="subscribers-delete-card__text">
                ¿Estás seguro de que deseas eliminar al suscriptor{' '}
                <strong>
                  {suscriptorAEliminar.nombreCompleto ||
                    [
                      suscriptorAEliminar.primerNombre,
                      suscriptorAEliminar.primerApellido,
                    ]
                      .filter(Boolean)
                      .join(' ') ||
                    'seleccionado'}
                </strong>
                {suscriptorAEliminar.cedula && (
                  <>
                    {' '}con cédula <strong>{suscriptorAEliminar.cedula}</strong>
                  </>
                )}
                ?
              </p>

              <p className="subscribers-delete-card__warning">
                Esta acción no se puede deshacer y removerá la información del suscriptor del sistema.
              </p>

              <div className="subscribers-delete-card__actions">
                <button
                  className="subscribers-delete-card__button subscribers-delete-card__button--cancel"
                  type="button"
                  onClick={handleCerrarEliminar}
                  disabled={deleting}
                >
                  Cancelar
                </button>

                <button
                  className="subscribers-delete-card__button subscribers-delete-card__button--delete"
                  type="button"
                  onClick={handleConfirmarEliminar}
                  disabled={deleting}
                >
                  {deleting ? 'Eliminando...' : 'Eliminar suscriptor'}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default SuscriptoresPage