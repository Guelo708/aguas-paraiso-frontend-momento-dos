import AdminModal from '../AdminModal/AdminModal.jsx'

function ConfirmDialog({ title, message, busy, error, onCancel, onConfirm }) {
  return (
    <AdminModal title={title} eyebrow="Confirmación requerida" onClose={onCancel} actions={<><button className="admin-button admin-button--secondary" type="button" onClick={onCancel} disabled={busy}>Cancelar</button><button className="admin-button admin-button--danger" type="button" onClick={onConfirm} disabled={busy}>{busy ? 'Procesando...' : 'Confirmar'}</button></>}>
      <p>{message}</p>{error && <p className="entity-feedback entity-feedback--error" role="alert">{error}</p>}
    </AdminModal>
  )
}
export default ConfirmDialog
