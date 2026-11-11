import api from './api.js'
export const listarFacturas = async () => (await api.get('/facturas')).data
export const buscarFacturaPorId = async (id) => (await api.get(`/facturas/${id}`)).data
export const generarFactura = async (data) => (await api.post('/facturas/generar', data)).data
export const generarFacturasMensuales = async (mes, anio) => (await api.post('/facturas/generar-mensuales', null, { params: { mes, anio } })).data
export const actualizarFacturasVencidas = async () => (await api.put('/facturas/actualizar-vencidas')).data
export const eliminarFactura = async (id) => api.delete(`/facturas/${id}`)
