import { useEffect, useMemo, useState } from 'react'
import AdminModal from '../../components/AdminModal/AdminModal.jsx'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx'
import { listarFacturas } from '../../services/facturaService.js'
import {
  eliminarPago,
  listarPagos,
  registrarPago,
  saldoFactura,
} from '../../services/pagoService.js'
import '../../components/EntityManager/EntityManager.css'

const methods = [
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

function PagosPage() {
  const [items, setItems] = useState([])
  const [bills, setBills] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [detail, setDetail] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [balance, setBalance] = useState(null)
  const [form, setForm] = useState({
    facturaId: '',
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
      const [pagos, facturas] = await Promise.all([
        listarPagos(),
        listarFacturas(),
      ])
      setItems(Array.isArray(pagos) ? pagos : [])
      setBills(
        Array.isArray(facturas)
          ? facturas.filter((x) => x.estado !== 'PAGADA')
          : [],
      )
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
        const [pagos, facturas] = await Promise.all([
          listarPagos(),
          listarFacturas(),
        ])
        if (active) {
          setItems(Array.isArray(pagos) ? pagos : [])
          setBills(
            Array.isArray(facturas)
              ? facturas.filter((x) => x.estado !== 'PAGADA')
              : [],
          )
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
    () =>
      items.filter((x) =>
        `${x.cedulaPropietario} ${x.nombrePropietario} ${x.codigoPredio}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [items, search],
  )

  async function submit(e) {
    e.preventDefault()
    try {
      setBusy(true)
      const saved = await registrarPago({
        ...form,
        facturaId: Number(form.facturaId),
        valorPagado: Number(form.valorPagado),
        observacion: form.observacion || null,
      })
      setItems((c) => [...c, saved])
      setModal(false)
      setFeedback('Pago registrado correctamente.')
      await cargarDatos(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  async function showDetail(x) {
    setDetail(x)
    try {
      const data = await saldoFactura(x.facturaId)
      setBalance(data)
    } catch {
      setBalance(null)
    }
  }

  async function remove() {
    try {
      setBusy(true)
      await eliminarPago(deleting.id)
      setItems((c) => c.filter((x) => x.id !== deleting.id))
      setDeleting(null)
      setFeedback('Pago eliminado y estado de factura actualizado.')
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
          <span className="entity-hero__eyebrow">Gestión administrativa</span>
          <h1>Pagos</h1>
          <p>Registra pagos y abonos, y consulta el saldo de cada factura.</p>
        </div>
        <button
          className="admin-button admin-button--primary"
          onClick={() => setModal(true)}
          type="button"
        >
          Registrar pago
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
            placeholder="Cédula, propietario o predio"
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
                  <th>Fecha</th>
                  <th>Propietario</th>
                  <th>Predio</th>
                  <th>Periodo</th>
                  <th>Pago</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((x) => (
                  <tr key={x.id}>
                    <td>{x.fechaPago}</td>
                    <td>
                      {x.nombrePropietario}
                      <br />
                      <small>{x.cedulaPropietario}</small>
                    </td>
                    <td>{x.codigoPredio}</td>
                    <td>
                      {x.mesFactura}/{x.anioFactura}
                    </td>
                    <td>{money(x.valorPagado)}</td>
                    <td>{x.metodoPago?.replaceAll('_', ' ')}</td>
                    <td>
                      <span
                        className={`status-badge status-badge--${x.estadoFactura}`}
                      >
                        {x.estadoFactura}
                      </span>
                    </td>
                    <td>
                      <div className="entity-actions">
                        <button
                          type="button"
                          onClick={() => showDetail(x)}
                        >
                          Ver
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
          title="Registrar pago o abono"
          onClose={() => setModal(false)}
          actions={
            <>
              <button
                className="admin-button admin-button--secondary"
                onClick={() => setModal(false)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="admin-button admin-button--primary"
                type="submit"
                form="pago-form"
                disabled={busy}
              >
                Registrar
              </button>
            </>
          }
        >
          <form id="pago-form" className="admin-form" onSubmit={submit}>
            <div className="admin-form__grid">
              <label className="admin-form__field admin-form__field--full">
                Factura
                <select
                  required
                  value={form.facturaId}
                  onChange={(e) =>
                    setForm({ ...form, facturaId: e.target.value })
                  }
                >
                  <option value="">Selecciona una factura por pagar</option>
                  {bills.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.codigoPredio} · {x.nombrePropietario} · {x.mes}/
                      {x.anio} · {money(x.valorFactura)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-form__field">
                Valor pagado
                <input
                  required
                  min="1"
                  type="number"
                  value={form.valorPagado}
                  onChange={(e) =>
                    setForm({ ...form, valorPagado: e.target.value })
                  }
                />
              </label>
              <label className="admin-form__field">
                Fecha
                <input
                  required
                  type="date"
                  value={form.fechaPago}
                  onChange={(e) =>
                    setForm({ ...form, fechaPago: e.target.value })
                  }
                />
              </label>
              <label className="admin-form__field">
                Método
                <select
                  value={form.metodoPago}
                  onChange={(e) =>
                    setForm({ ...form, metodoPago: e.target.value })
                  }
                >
                  {methods.map((x) => (
                    <option key={x} value={x}>
                      {x.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-form__field admin-form__field--full">
                Observación
                <textarea
                  value={form.observacion}
                  onChange={(e) =>
                    setForm({ ...form, observacion: e.target.value })
                  }
                />
              </label>
            </div>
          </form>
        </AdminModal>
      )}

      {detail && (
        <AdminModal
          title={`Pago #${detail.id}`}
          onClose={() => {
            setDetail(null)
            setBalance(null)
          }}
        >
          <dl className="detail-grid">
            {Object.entries({
              Propietario: detail.nombrePropietario,
              Cédula: detail.cedulaPropietario,
              Predio: detail.codigoPredio,
              Factura: money(detail.valorFactura),
              Pago: money(detail.valorPagado),
              Saldo:
                balance === null ? 'Consultando...' : money(balance),
              Fecha: detail.fechaPago,
              Método: detail.metodoPago?.replaceAll('_', ' '),
              Estado: detail.estadoFactura,
              Observación: detail.observacion || 'Sin observación',
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
          title="Eliminar pago"
          message={`Se eliminará el pago de ${money(deleting.valorPagado)} y el backend recalculará el estado de la factura.`}
          busy={busy}
          error={error}
          onCancel={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </section>
  )
}

export default PagosPage
