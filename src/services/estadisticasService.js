import apiAnalytics from './apiAnalytics'

export const estadisticasService = {
  obtenerResumenEstadistico: async () => {
    const response = await apiAnalytics.get('/estadisticas/resumen')
    return response.data
  },
  obtenerFacturasPorEstado: async () => {
    const response = await apiAnalytics.get('/estadisticas/facturas/estados')
    return response.data
  },
  obtenerFacturacionMensual: async (anio) => {
    const response = await apiAnalytics.get('/estadisticas/facturacion/mensual?anio=' + anio)
    return response.data
  },
  obtenerRecaudoMensual: async (anio) => {
    const response = await apiAnalytics.get('/estadisticas/recaudo/mensual?anio=' + anio)
    return response.data
  },
  obtenerPagosPorMetodo: async (anio) => {
    const response = await apiAnalytics.get('/estadisticas/pagos/metodos?anio=' + anio)
    return response.data
  },
  obtenerPrediosPorSector: async () => {
    const response = await apiAnalytics.get('/estadisticas/predios/sectores')
    return response.data
  },
  obtenerPrediosPorTipo: async () => {
    const response = await apiAnalytics.get('/estadisticas/predios/tipos')
    return response.data
  },
  obtenerTopDeudores: async () => {
    const response = await apiAnalytics.get('/estadisticas/cartera/top-deudores')
    return response.data
  }
}
