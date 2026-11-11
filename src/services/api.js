import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 90000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.mensaje ||
      error.response?.data?.message ||
      error.message ||
      'No fue posible completar la solicitud.'

    return Promise.reject(new Error(message))
  },
)

export default api
