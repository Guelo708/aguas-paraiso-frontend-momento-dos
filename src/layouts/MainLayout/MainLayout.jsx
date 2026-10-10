import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />

      <main className="main-layout__content">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout