import { useEffect, useState } from 'react'
import AdminModal from '../../components/AdminModal/AdminModal.jsx'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx'
import { listarTiposPredio } from '../../services/tipoPredioService.js'
import {
  actualizarTarifa,
  eliminarTarifa,
  listarTarifas,
  registrarTarifa,
} from '../../services/tarifaService.js'
import '../../components/EntityManager/EntityManager.css'

const empty = {
  tipoPredioId: '',
  valor: '',
  fechaInicio: '',
  fechaFin: '',
}

const money = (v) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(v || 0)

function TarifasPage() {
  const [items, setItems] = useState([])
  const [types, setTypes] = useState([])
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true

    async function initialLoad() {
      try {
        const [tarifas, listaTipos] = await Promise.all([
          listarTarifas(),
          listarTiposPredio(),
        ])
        if (active) {
          setItems(Array.isArray(tarifas) ? tarifas : [])
          setTypes(Array.isArray(listaTipos) ? listaTipos : [])
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

  function open(x = null) {
    setEditing(x || {})
    setForm(
      x
        ? {
            tipoPredioId: x.tipoPredio?.id ?? '',
            valor: x.valor ?? '',
            fechaInicio: x.fechaInicio ?? '',
            fechaFin: x.fechaFin ?? '',
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
        tipoPredioId: Number(form.tipoPredioId),
        valor: Number(form.valor),
        fechaFin: form.fechaFin || null,
      }
      const saved = editing.id
        ? await actualizarTarifa(editing.id, payload)
        : await registrarTarifa(payload)
      setItems((c) =>
        editing.id
          ? c.map((x) => (x.id === editing.id ? saved : x))
          : [...c, saved],
      )
      setEditing(null)
      setFeedback('Tarifa guardada correctamente.')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    try {
      setBusy(true)
      await eliminarTarifa(deleting.id)
      setItems((c) => c.filter((x) => x.id !== deleting.id))
      setDeleting(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="entity-page">
      <header className="entity-hero">
        <div>
          <span className="entity-hero__eyebrow">Facturación</span>
          <h1>Tarifas</h1>
          <p>Administra valores y periodos de vigencia por tipo de predio.</p>
        </div>
        <button
          className="admin-button admin-button--primary"
          onClick={() => open()}
          type="button"
        >
          Nueva tarifa
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

      <div className="entity-panel">
        {loading ? (
          <div className="entity-state">Consultando...</div>
        ) : (
          <div className="entity-table-wrap">
            <table className="entity-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((x) => (
                  <tr key={x.id}>
                    <td>{x.tipoPredio?.nombre}</td>
                    <td>
                      <strong>{money(x.valor)}</strong>
                    </td>
                    <td>{x.fechaInicio}</td>
                    <td>{x.fechaFin || 'Vigente'}</td>
                    <td>
                      <div className="entity-actions">
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
          </div>
        )}
      </div>

      {editing && (
        <AdminModal
          title={editing.id ? 'Editar tarifa' : 'Nueva tarifa'}
          onClose={() => setEditing(null)}
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
                form="tarifa-form"
              >
                Guardar
              </button>
            </>
          }
        >
          <form id="tarifa-form" className="admin-form" onSubmit={submit}>
            <div className="admin-form__grid">
              <label className="admin-form__field">
                Tipo de predio
                <select
                  required
                  value={form.tipoPredioId}
                  onChange={(e) =>
                    setForm({ ...form, tipoPredioId: e.target.value })
                  }
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
                Valor
                <input
                  required
                  min="1"
                  type="number"
                  value={form.valor}
                  onChange={(e) =>
                    setForm({ ...form, valor: e.target.value })
                  }
                />
              </label>
              <label className="admin-form__field">
                Fecha de inicio
                <input
                  required
                  type="date"
                  value={form.fechaInicio}
                  onChange={(e) =>
                    setForm({ ...form, fechaInicio: e.target.value })
                  }
                />
              </label>
              <label className="admin-form__field">
                Fecha de fin
                <input
                  type="date"
                  value={form.fechaFin}
                  onChange={(e) =>
                    setForm({ ...form, fechaFin: e.target.value })
                  }
                />
              </label>
            </div>
          </form>
        </AdminModal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Eliminar tarifa"
          message={`Se eliminará la tarifa ${money(deleting.valor)}.`}
          busy={busy}
          error={error}
          onCancel={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </section>
  )
}

export default TarifasPage
