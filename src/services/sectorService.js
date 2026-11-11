import api from './api.js'
export const listarSectores = async () => (await api.get('/sectores')).data
export const registrarSector = async (data) => (await api.post('/sectores', data)).data
export const actualizarSector = async (id, data) => (await api.put(`/sectores/${id}`, data)).data
export const eliminarSector = async (id) => api.delete(`/sectores/${id}`)
