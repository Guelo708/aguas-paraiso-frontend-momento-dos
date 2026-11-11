import api from './api.js'
export const listarTiposPredio = async () => (await api.get('/tipos-predio')).data
export const registrarTipoPredio = async (data) => (await api.post('/tipos-predio', data)).data
export const actualizarTipoPredio = async (id, data) => (await api.put(`/tipos-predio/${id}`, data)).data
export const eliminarTipoPredio = async (id) => api.delete(`/tipos-predio/${id}`)
