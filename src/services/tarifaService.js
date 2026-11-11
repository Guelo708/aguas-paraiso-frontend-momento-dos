import api from './api.js'
export const listarTarifas = async () => (await api.get('/tarifas')).data
export const registrarTarifa = async (data) => (await api.post('/tarifas', data)).data
export const actualizarTarifa = async (id, data) => (await api.put(`/tarifas/${id}`, data)).data
export const eliminarTarifa = async (id) => api.delete(`/tarifas/${id}`)
export const historialTarifas = async (tipoPredioId) => (await api.get(`/tarifas/tipo-predio/${tipoPredioId}/historial`)).data
