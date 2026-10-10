import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <span
            className="footer__logo"
            aria-hidden="true"
          >
            AP
          </span>

          <div className="footer__brand-text">
            <strong>Aguas Paraíso</strong>

            <span>
              Gestión comunitaria del servicio de agua
            </span>
          </div>
        </div>

        <div className="footer__project">
          <span>Proyecto académico</span>

          <strong>
            CESDE · {currentYear}
          </strong>
        </div>

        <div className="footer__status">
          <span
            className="footer__status-indicator"
            aria-hidden="true"
          />

          <span>Sistema en demostración</span>
        </div>
      </div>

      <div className="footer__bottom">
        <p>
          Agua que conecta comunidad, tecnología y bienestar.
        </p>
      </div>
    </footer>
  )
}

export default Footer