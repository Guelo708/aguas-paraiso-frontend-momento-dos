import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import AuthLayout from '../layouts/AuthLayout/AuthLayout.jsx'
import MainLayout from '../layouts/MainLayout/MainLayout.jsx'
import DashboardPage from '../pages/DashboardPage/DashboardPage.jsx'
import LoginPage from '../pages/LoginPage/LoginPage.jsx'
import SuscriptoresPage from '../pages/SuscriptoresPage/SuscriptoresPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Route>

      <Route element={<MainLayout />}>
        <Route
          path="/inicio"
          element={<DashboardPage />}
        />

        <Route
          path="/gestion/suscriptores"
          element={<SuscriptoresPage />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default AppRoutes