import { useEffect, useMemo, useState } from 'react'
import AdminModal from '../../components/AdminModal/AdminModal.jsx'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx'
import { listarPredios } from '../../services/predioService.js'
import {
  actualizarFacturasVencidas,
  eliminarFactura,
  generarFactura,
  generarFacturasMensuales,
  listarFacturas,
} from '../../services/facturaService.js'
import { registrarPago, saldoFactura } from '../../services/pagoService.js'
import '../../components/EntityManager/EntityManager.css'

const paymentMethods = [
  'EFECTIVO',
  'TRANSFERENCIA',
  'NEQUI',
  'TARJETA_DEBITO',
  'TARJETA_CREDITO',
  'DAVIPLATA',
  'RECAUDO_CONVENIO',
]

const money = (v) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(v || 0)

function FacturasPage() {
  const [items, setItems] = useState([])
  const [predios, setPredios] = useState([])
  const [filter, setFilter] = useState('')
  const [modal, setModal] = useState(null)
  const [detail, setDetail] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [paying, setPaying] = useState(null)
  const [payBalance, setPayBalance] = useState(null)
  const [form, setForm] = useState({
    predioId: '',
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear(),
  })
  const [payForm, setPayForm] = useState({
    valorPagado: '',
    fechaPago: new Date().toISOString().slice(0, 10),
    metodoPago: 'EFECTIVO',
    observacion: '',
  })
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  async function cargarDatos(showLoading = false) {
    try {
      if (showLoading) setLoading(true)
      const [facturas, listaPredios] = await Promise.all([
        listarFacturas(),
        listarPredios(),
      ])
      setItems(Array.isArray(facturas) ? facturas : [])
      setPredios(Array.isArray(listaPredios) ? listaPredios : [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    async function initialLoad() {
      try {
        const [facturas, listaPredios] = await Promise.all([
          listarFacturas(),
          listarPredios(),
        ])
        if (active) {
          setItems(Array.isArray(facturas) ? facturas : [])
          setPredios(Array.isArray(listaPredios) ? listaPredios : [])
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

  const shown = useMemo(
    () => items.filter((x) => !filter || x.estado === filter),
    [items, filter],
  )

  async function generate(e) {
    e.preventDefault()
    try {
      setBusy(true)
      if (modal === 'monthly') {
        const data = await generarFacturasMensuales(
          Number(form.mes),
          Number(form.anio),
        )
        setItems((c) => [...c, ...(Array.isArray(data) ? data : [])])
        setFeedback(`${data?.length ?? 0} facturas generadas.`)
      } else {
        const saved = await generarFactura({
          predioId: Number(form.predioId),
          mes: Number(form.mes),
          anio: Number(form.anio),
        })
        setItems((c) => [...c, saved])
        setFeedback('Factura generada correctamente.')
      }
      setModal(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function updateOverdue() {
    try {
      setBusy(true)
      const count = await actualizarFacturasVencidas()
      setFeedback(`${count} facturas actualizadas.`)
      await cargarDatos(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    try {
      setBusy(true)
      await eliminarFactura(deleting.id)
      setItems((c) => c.filter((x) => x.id !== deleting.id))
      setDeleting(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function openPayModal(factura) {
    setPaying(factura)
    setPayBalance(null)
    setPayForm({
      valorPagado: factura.valorFactura ?? '',
      fechaPago: new Date().toISOString().slice(0, 10),
      metodoPago: 'EFECTIVO',
      observacion: '',
    })

    try {
      const balance = await saldoFactura(factura.id)
      setPayBalance(balance)
      if (typeof balance === 'number' && balance > 0) {
        setPayForm((prev) => ({ ...prev, valorPagado: balance }))
      }
    } catch {
      setPayBalance(factura.valorFactura)
    }
  }

  async function handlePaySubmit(e) {
    e.preventDefault()
    try {
      setBusy(true)
      await registrarPago({
        facturaId: Number(paying.id),
        valorPagado: Number(payForm.valorPagado),
        fechaPago: payForm.fechaPago,
        metodoPago: payForm.metodoPago,
        observacion: payForm.observacion || null,
      })
      const facturaInfo = `${paying.codigoPredio} (${paying.mes}/${paying.anio})`
      setPaying(null)
      setFeedback(
        `Pago de ${money(payForm.valorPagado)} registrado con éxito para la factura ${facturaInfo}.`,
      )
      await cargarDatos(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="entity-page">
      <header className="entity-hero">
        <div>
          <span className="entity-hero__eyebrow">Gestión administrativa</span>
          <h1>Facturas</h1>
          <p>Genera periodos, consulta estados y administra la facturación.</p>
        </div>
        <div className="entity-actions">
          <button
            className="admin-button admin-button--primary"
            onClick={() => setModal('single')}
            type="button"
          >
            Generar factura
          </button>
          <button
            className="admin-button admin-button--secondary"
            onClick={() => setModal('monthly')}
            type="button"
          >
            Generación mensual
          </button>
        </div>
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
          Estado
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Todos</option>
            {['PENDIENTE', 'PARCIAL', 'PAGADA', 'VENCIDA'].map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </label>
        <button
          className="admin-button admin-button--secondary"
          onClick={updateOverdue}
          disabled={busy}
          type="button"
        >
          Actualizar vencidas
        </button>
      </div>

      <div className="entity-panel">
        {loading ? (
          <div className="entity-state">Consultando...</div>
        ) : (
          <div className="entity-table-wrap">
            <table className="entity-table">
              <thead>
                <tr>
                  <th>Predio</th>
                  <th>Propietario</th>
                  <th>Periodo</th>
                  <th>Valor</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((x) => (
                  <tr key={x.id}>
                    <td>{x.codigoPredio}</td>
                    <td>{x.nombrePropietario}</td>
                    <td>
                      {x.mes}/{x.anio}
                    </td>
                    <td>{money(x.valorFactura)}</td>
                    <td>{x.fechaVencimiento}</td>
                    <td>
                      <span className={`status-badge status-badge--${x.estado}`}>
                        {x.estado}
                      </span>
                    </td>
                    <td>
                      <div className="entity-actions">
                        <button type="button" onClick={() => setDetail(x)}>
                          Ver
                        </button>
                        <button
                          className="success"
                          type="button"
                          disabled={x.estado === 'PAGADA'}
                          onClick={() => openPayModal(x)}
                          title={
                            x.estado === 'PAGADA'
                              ? 'Factura completamente pagada'
                              : 'Registrar pago'
                          }
                        >
                          Pagar
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

      {modal && (
        <AdminModal
          title={
            modal === 'monthly'
              ? 'Generar facturas mensuales'
              : 'Generar factura'
          }
          onClose={() => setModal(null)}
          actions={
            <>
              <button
                className="admin-button admin-button--secondary"
                onClick={() => setModal(null)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="admin-button admin-button--primary"
                type="submit"
                form="factura-form"
                disabled={busy}
              >
                Generar
              </button>
            </>
          }
        >
          <form id="factura-form" className="admin-form" onSubmit={generate}>
            <div className="admin-form__grid">
              {modal === 'single' && (
                <label className="admin-form__field admin-form__field--full">
                  Predio
                  <select
                    required
                    value={form.predioId}
                    onChange={(e) =>
                      setForm({ ...form, predioId: e.target.value })
                    }
                  >
                    <option value="">Selecciona</option>
                    {predios.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.codigoPredio} · {p.nombrePredio}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="admin-form__field">
                Mes
                <input
                  required
                  type="number"
                  min="1"
                  max="12"
                  value={form.mes}
                  onChange={(e) =>
                    setForm({ ...form, mes: e.target.value })
                  }
                />
              </label>
              <label className="admin-form__field">
                Año
                <input
                  required
                  type="number"
                  min="2020"
                  value={form.anio}
                  onChange={(e) =>
                    setForm({ ...form, anio: e.target.value })
                  }
                />
              </label>
            </div>
          </form>
        </AdminModal>
      )}

      {paying && (
        <AdminModal
          title={`Registrar pago · ${paying.codigoPredio} (${paying.mes}/${paying.anio})`}
          onClose={() => !busy && setPaying(null)}
          actions={
            <>
              <button
                className="admin-button admin-button--secondary"
                onClick={() => setPaying(null)}
                type="button"
                disabled={busy}
              >
                Cancelar
              </button>
              <button
                className="admin-button admin-button--primary"
                type="submit"
                form="pago-factura-form"
                disabled={busy}
              >
                {busy ? 'Registrando...' : 'Registrar pago'}
              </button>
            </>
          }
        >
          <div
            style={{
              marginBottom: '1.2rem',
              padding: '0.9rem',
              background: 'var(--theme-surface-soft)',
              borderRadius: 'var(--radius-small)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <p style={{ margin: '0 0 0.35rem' }}>
              <strong>Propietario:</strong> {paying.nombrePropietario} (
              {paying.cedulaPropietario})
            </p>
            <p style={{ margin: '0 0 0.35rem' }}>
              <strong>Valor total factura:</strong>{' '}
              {money(paying.valorFactura)}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Saldo pendiente:</strong>{' '}
              {payBalance === null ? 'Consultando...' : money(payBalance)}
            </p>
          </div>

          <form
            id="pago-factura-form"
            className="admin-form"
            onSubmit={handlePaySubmit}
          >
            <div className="admin-form__grid">
              <label className="admin-form__field">
                Valor a pagar
                <input
                  required
                  min="1"
                  type="number"
                  value={payForm.valorPagado}
                  onChange={(e) =>
                    setPayForm({ ...payForm, valorPagado: e.target.value })
                  }
                />
              </label>
              <label className="admin-form__field">
                Fecha de pago
                <input
                  required
                  type="date"
                  value={payForm.fechaPago}
                  onChange={(e) =>
                    setPayForm({ ...payForm, fechaPago: e.target.value })
                  }
                />
              </label>
              <label className="admin-form__field admin-form__field--full">
                Método de pago
                <select
                  value={payForm.metodoPago}
                  onChange={(e) =>
                    setPayForm({ ...payForm, metodoPago: e.target.value })
                  }
                >
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>
                      {m.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-form__field admin-form__field--full">
                Observación
                <textarea
                  placeholder="Opcional: recibo, referencia de consignación o nota"
                  value={payForm.observacion}
                  onChange={(e) =>
                    setPayForm({ ...payForm, observacion: e.target.value })
                  }
                />
              </label>
            </div>
          </form>
        </AdminModal>
      )}

      {detail && (
        <AdminModal
          title={`Factura ${detail.codigoPredio} · ${detail.mes}/${detail.anio}`}
          onClose={() => setDetail(null)}
        >
          <dl className="detail-grid">
            {Object.entries({
              Propietario: detail.nombrePropietario,
              Cédula: detail.cedulaPropietario,
              Predio: detail.codigoPredio,
              'Tipo de predio': detail.tipoPredio,
              Valor: money(detail.valorFactura),
              'Fecha de generación': detail.fechaGeneracion,
              Vencimiento: detail.fechaVencimiento,
              Estado: detail.estado,
            }).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </AdminModal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Eliminar factura"
          message={`Se eliminará la factura ${deleting.codigoPredio} ${deleting.mes}/${deleting.anio}.`}
          busy={busy}
          error={error}
          onCancel={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </section>
  )
}

export default FacturasPage
