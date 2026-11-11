import api from './api.js'
export const listarPagos = async () => (await api.get('/pagos')).data
export const buscarPagoPorId = async (id) => (await api.get(`/pagos/${id}`)).data
export const registrarPago = async (data) => (await api.post('/pagos', data)).data
export const eliminarPago = async (id) => api.delete(`/pagos/${id}`)
export const saldoFactura = async (facturaId) => (await api.get(`/pagos/factura/${facturaId}/saldo`)).data
