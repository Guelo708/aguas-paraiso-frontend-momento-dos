import { useEffect } from 'react'
import './AdminModal.css'

function AdminModal({ title, eyebrow = 'Gestión administrativa', children, actions, onClose, wide = false }) {
  useEffect(() => {
    document.body.classList.add('modal-open')
    const handleEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div className="admin-modal" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`admin-modal__card${wide ? ' admin-modal__card--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">
        <header className="admin-modal__header">
          <div><span>{eyebrow}</span><h2 id="admin-modal-title">{title}</h2></div>
          <button type="button" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <div className="admin-modal__body">{children}</div>
        {actions && <footer className="admin-modal__actions">{actions}</footer>}
      </section>
    </div>
  )
}

export default AdminModal
