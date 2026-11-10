import api from './api.js'

export async function listarUsuarios() {
  const response = await api.get('/usuarios')
  return response.data
}

export async function buscarUsuarioPorId(id) {
  const response = await api.get(`/usuarios/${id}`)
  return response.data
}

export async function buscarUsuarioPorCedula(cedula) {
  const response = await api.get(`/usuarios/cedula/${cedula}`)
  return response.data
}

export async function registrarUsuario(usuario) {
  const response = await api.post('/usuarios', usuario)
  return response.data
}

export async function actualizarUsuario(id, usuario) {
  const response = await api.put(`/usuarios/${id}`, usuario)
  return response.data
}

export async function eliminarUsuario(id) {
  await api.delete(`/usuarios/${id}`)
}