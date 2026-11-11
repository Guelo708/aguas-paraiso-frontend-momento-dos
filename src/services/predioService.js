import api from './api.js'
export const listarPredios = async () => (await api.get('/predios')).data
export const buscarPredioPorId = async (id) => (await api.get(`/predios/${id}`)).data
export const registrarPredio = async (data) => (await api.post('/predios', data)).data
export const actualizarPredio = async (id, data) => (await api.put(`/predios/${id}`, data)).data
export const eliminarPredio = async (id) => api.delete(`/predios/${id}`)
