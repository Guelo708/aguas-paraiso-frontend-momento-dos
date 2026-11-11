import { useEffect, useMemo, useState } from 'react'
import AdminModal from '../AdminModal/AdminModal.jsx'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog.jsx'
import './EntityManager.css'

function CatalogManager({ title, description, singular, service }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const data = await service.list()
        if (active) {
          setItems(Array.isArray(data) ? data : [])
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

    load()

    return () => {
      active = false
    }
  }, [service])

  const filtered = useMemo(() => items.filter((item) => `${item.nombre} ${item.descripcion ?? ''}`.toLowerCase().includes(search.toLowerCase())), [items, search])
  function openForm(item = null) { setEditing(item); setForm({ nombre: item?.nombre ?? '', descripcion: item?.descripcion ?? '' }); setFeedback('') }
  async function submit(event) {
    event.preventDefault()
    try { setBusy(true); const payload = { nombre: form.nombre.trim(), descripcion: form.descripcion.trim() || null }; const saved = editing?.id ? await service.update(editing.id, payload) : await service.create(payload); setItems((current) => editing?.id ? current.map((item) => item.id === editing.id ? saved : item) : [...current, saved]); setEditing(null); setFeedback(`${singular} guardado correctamente.`) }
    catch (requestError) { setError(requestError.message) }
    finally { setBusy(false) }
  }
  async function confirmDelete() {
    try { setBusy(true); await service.remove(deleting.id); setItems((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(null); setFeedback(`${singular} eliminado correctamente.`) }
    catch (requestError) { setError(requestError.message) }
    finally { setBusy(false) }
  }

  return <section className="entity-page">
    <header className="entity-hero"><div><span className="entity-hero__eyebrow">Catálogos</span><h1>{title}</h1><p>{description}</p></div><button className="admin-button admin-button--primary" type="button" onClick={() => openForm({})}>Nuevo {singular.toLowerCase()}</button></header>
    {feedback && <div className="entity-feedback entity-feedback--success">{feedback}</div>}{error && <div className="entity-feedback entity-feedback--error">{error}</div>}
    <div className="entity-toolbar"><label className="entity-toolbar__field">Buscar<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre o descripción" /></label></div>
    <div className="entity-panel">{loading ? <div className="entity-state">Consultando...</div> : <div className="entity-table-wrap"><table className="entity-table"><thead><tr><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{item.nombre}</strong></td><td>{item.descripcion || 'Sin descripción'}</td><td><div className="entity-actions"><button type="button" onClick={() => openForm(item)}>Editar</button><button className="danger" type="button" onClick={() => setDeleting(item)}>Eliminar</button></div></td></tr>)}</tbody></table>{!filtered.length && <div className="entity-state">No hay resultados.</div>}</div>}</div>
    {editing && <AdminModal title={`${editing.id ? 'Editar' : 'Nuevo'} ${singular.toLowerCase()}`} onClose={() => !busy && setEditing(null)} actions={<><button className="admin-button admin-button--secondary" type="button" onClick={() => setEditing(null)}>Cancelar</button><button className="admin-button admin-button--primary" type="submit" form="catalog-form" disabled={busy}>{busy ? 'Guardando...' : 'Guardar'}</button></>}><form id="catalog-form" className="admin-form" onSubmit={submit}><div className="admin-form__field"><label htmlFor="catalog-name">Nombre</label><input id="catalog-name" required value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} /></div><div className="admin-form__field"><label htmlFor="catalog-description">Descripción</label><textarea id="catalog-description" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} /></div></form></AdminModal>}
    {deleting && <ConfirmDialog title={`Eliminar ${singular.toLowerCase()}`} message={`Se eliminará “${deleting.nombre}”. Esta acción no se puede deshacer.`} busy={busy} error={error} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />}
  </section>
}
export default CatalogManager
