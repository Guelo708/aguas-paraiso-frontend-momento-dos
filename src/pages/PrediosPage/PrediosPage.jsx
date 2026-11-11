import { useEffect, useMemo, useState } from 'react'
import AdminModal from '../../components/AdminModal/AdminModal.jsx'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx'
import { listarUsuarios } from '../../services/usuarioService.js'
import { listarSectores } from '../../services/sectorService.js'
import { listarTiposPredio } from '../../services/tipoPredioService.js'
import {
  actualizarPredio,
  eliminarPredio,
  listarPredios,
  registrarPredio,
} from '../../services/predioService.js'
import '../../components/EntityManager/EntityManager.css'

const empty = {
  codigoPredio: '',
  propietarioId: '',
  sectorId: '',
  tipoPredioId: '',
  nombrePredio: '',
  vereda: '',
  corregimiento: '',
  municipio: '',
  observaciones: '',
}

function PrediosPage() {
  const [items, setItems] = useState([])
  const [users, setUsers] = useState([])
  const [sectors, setSectors] = useState([])
  const [types, setTypes] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [editing, setEditing] = useState(null)
  const [detail, setDetail] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(empty)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true

    async function initialLoad() {
      try {
        const [p, u, s, t] = await Promise.all([
          listarPredios(),
          listarUsuarios(),
          listarSectores(),
          listarTiposPredio(),
        ])
        if (active) {
          setItems(Array.isArray(p) ? p : [])
          setUsers(Array.isArray(u) ? u : [])
          setSectors(Array.isArray(s) ? s : [])
          setTypes(Array.isArray(t) ? t : [])
        }
      } catch (e) {
        if (active) {
          setError(e.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    initialLoad()

    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(
    () =>
      items.filter((x) =>
        `${x.codigoPredio} ${x.nombrePredio} ${x.propietario?.nombreCompleto} ${x.sector?.nombre}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [items, search],
  )

  function open(item = null) {
    setEditing(item || {})
    setForm(
      item
        ? {
            codigoPredio: item.codigoPredio ?? '',
            propietarioId: item.propietario?.id ?? '',
            sectorId: item.sector?.id ?? '',
            tipoPredioId: item.tipoPredio?.id ?? '',
            nombrePredio: item.nombrePredio ?? '',
            vereda: item.vereda ?? '',
            corregimiento: item.corregimiento ?? '',
            municipio: item.municipio ?? '',
            observaciones: item.observaciones ?? '',
          }
        : empty,
    )
  }

  async function submit(e) {
    e.preventDefault()
    try {
      setBusy(true)
      const payload = {
        ...form,
        propietarioId: Number(form.propietarioId),
        sectorId: Number(form.sectorId),
        tipoPredioId: Number(form.tipoPredioId),
      }
      const saved = editing.id
        ? await actualizarPredio(editing.id, payload)
        : await registrarPredio(payload)
      setItems((c) =>
        editing.id
          ? c.map((x) => (x.id === editing.id ? saved : x))
          : [...c, saved],
      )
      setEditing(null)
      setFeedback('Predio guardado correctamente.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    try {
      setBusy(true)
      await eliminarPredio(deleting.id)
      setItems((c) => c.filter((x) => x.id !== deleting.id))
      setDeleting(null)
      setFeedback('Predio eliminado correctamente.')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const field = (name, value) =>
    setForm((c) => ({ ...c, [name]: value }))

  return (
    <section className="entity-page">
      <header className="entity-hero">
        <div>
          <span className="entity-hero__eyebrow">Gestión administrativa</span>
          <h1>Predios</h1>
          <p>Administra propietarios, clasificación y ubicación de los predios.</p>
        </div>
        <button
          className="admin-button admin-button--primary"
          onClick={() => open()}
          type="button"
        >
          Nuevo predio
        </button>
      </header>

      {feedback && (
        <div className="entity-feedback entity-feedback--success">
          {feedback}
        </div>
      )}
      {error && (
        <div className="entity-feedback entity-feedback--error">{error}</div>
      )}

      <div className="entity-toolbar">
        <label className="entity-toolbar__field">
          Buscar
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Código, nombre, propietario o sector"
          />
        </label>
      </div>

      <div className="entity-panel">
        {loading ? (
          <div className="entity-state">Consultando...</div>
        ) : (
          <div className="entity-table-wrap">
            <table className="entity-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Predio</th>
                  <th>Propietario</th>
                  <th>Sector</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((x) => (
                  <tr key={x.id}>
                    <td>
                      <strong>{x.codigoPredio}</strong>
                    </td>
                    <td>{x.nombrePredio}</td>
                    <td>{x.propietario?.nombreCompleto}</td>
                    <td>{x.sector?.nombre}</td>
                    <td>{x.tipoPredio?.nombre}</td>
                    <td>
                      <div className="entity-actions">
                        <button type="button" onClick={() => setDetail(x)}>
                          Ver
                        </button>
                        <button type="button" onClick={() => open(x)}>
                          Editar
                        </button>
                        <button
                          className="danger"
                          type="button"
                          onClick={() => setDeleting(x)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="entity-state">No hay predios.</div>
            )}
          </div>
        )}
      </div>

      {editing && (
        <AdminModal
          wide
          title={editing.id ? 'Editar predio' : 'Nuevo predio'}
          onClose={() => !busy && setEditing(null)}
          actions={
            <>
              <button
                className="admin-button admin-button--secondary"
                onClick={() => setEditing(null)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="admin-button admin-button--primary"
                type="submit"
                form="predio-form"
                disabled={busy}
              >
                {busy ? 'Guardando...' : 'Guardar'}
              </button>
            </>
          }
        >
          <form id="predio-form" className="admin-form" onSubmit={submit}>
            <div className="admin-form__grid">
              <label className="admin-form__field">
                Código
                <input
                  required
                  value={form.codigoPredio}
                  onChange={(e) => field('codigoPredio', e.target.value)}
                />
              </label>
              <label className="admin-form__field">
                Nombre
                <input
                  required
                  value={form.nombrePredio}
                  onChange={(e) => field('nombrePredio', e.target.value)}
                />
              </label>
              <label className="admin-form__field">
                Propietario
                <select
                  required
                  value={form.propietarioId}
                  onChange={(e) => field('propietarioId', e.target.value)}
                >
                  <option value="">Selecciona</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.cedula} · {u.nombreCompleto}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-form__field">
                Sector
                <select
                  required
                  value={form.sectorId}
                  onChange={(e) => field('sectorId', e.target.value)}
                >
                  <option value="">Selecciona</option>
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-form__field">
                Tipo de predio
                <select
                  required
                  value={form.tipoPredioId}
                  onChange={(e) => field('tipoPredioId', e.target.value)}
                >
                  <option value="">Selecciona</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-form__field">
                Vereda
                <input
                  value={form.vereda}
                  onChange={(e) => field('vereda', e.target.value)}
                />
              </label>
              <label className="admin-form__field">
                Corregimiento
                <input
                  value={form.corregimiento}
                  onChange={(e) => field('corregimiento', e.target.value)}
                />
              </label>
              <label className="admin-form__field">
                Municipio
                <input
                  value={form.municipio}
                  onChange={(e) => field('municipio', e.target.value)}
                />
              </label>
              <label className="admin-form__field admin-form__field--full">
                Observaciones
                <textarea
                  value={form.observaciones}
                  onChange={(e) => field('observaciones', e.target.value)}
                />
              </label>
            </div>
          </form>
        </AdminModal>
      )}

      {detail && (
        <AdminModal
          title="Detalle del predio"
          onClose={() => setDetail(null)}
        >
          <dl className="detail-grid">
            {[
              ['Código', detail.codigoPredio],
              ['Nombre', detail.nombrePredio],
              ['Propietario', detail.propietario?.nombreCompleto],
              ['Cédula', detail.propietario?.cedula],
              ['Sector', detail.sector?.nombre],
              ['Tipo', detail.tipoPredio?.nombre],
              ['Vereda', detail.vereda],
              ['Corregimiento', detail.corregimiento],
              ['Municipio', detail.municipio],
              ['Observaciones', detail.observaciones],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v || 'No registrado'}</dd>
              </div>
            ))}
          </dl>
        </AdminModal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Eliminar predio"
          message={`Se eliminará ${deleting.codigoPredio}.`}
          busy={busy}
          error={error}
          onCancel={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </section>
  )
}

export default PrediosPage
