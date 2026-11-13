import axios from 'axios'

const apiAnalytics = axios.create({
  baseURL: import.meta.env.VITE_ANALYTICS_API_URL,
  timeout: 90000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiAnalytics.interceptors.response.use(
  (response) => response,
  (error) => {
    // FastAPI devuelve los errores típicamente en error.response.data.detail
    const message =
      error.response?.data?.detail ||
      error.message ||
      'No fue posible conectar con el servicio de estadísticas.'

    return Promise.reject(new Error(message))
  },
)

export default apiAnalytics
