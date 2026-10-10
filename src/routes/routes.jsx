import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout/AuthLayout.jsx'
import LoginPage from '../pages/LoginPage/LoginPage.jsx'

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
    </Routes>
  )
}

export default AppRoutes