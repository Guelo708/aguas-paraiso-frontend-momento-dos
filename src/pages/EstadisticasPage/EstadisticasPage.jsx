import React, { useState, useEffect } from 'react'
import { estadisticasService } from '../../services/estadisticasService'
import EstadoCarteraChart from '../../components/charts/EstadoCarteraChart'
import FacturacionChart from '../../components/charts/FacturacionChart'
import PagosMetodoChart from '../../components/charts/PagosMetodoChart'
import PrediosSectorChart from '../../components/charts/PrediosSectorChart'
import TendenciaRecaudoChart from '../../components/charts/TendenciaRecaudoChart'
import TopDeudoresChart from '../../components/charts/TopDeudoresChart'
import './EstadisticasPage.css'

const EstadisticasPage = () => {
  const [anio, setAnio] = useState('2026')
  const [resumen, setResumen] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const cargarDatos = async () => {
    try {
      const dataResumen = await estadisticasService.obtenerResumenEstadistico()
      setResumen(dataResumen)
    } catch (err) {
      setError(err.message || 'Error al conectar con el microservicio de estadísticas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        const dataResumen = await estadisticasService.obtenerResumenEstadistico()
        setResumen(dataResumen)
      } catch (err) {
        setError(err.message || 'Error al conectar con el microservicio de estadísticas.')
      } finally {
        setLoading(false)
      }
    }

    inicializarDatos()
  }, [])

  const handleActualizar = () => {
    setLoading(true)
    setError(null)
    cargarDatos()
    setRefreshKey(prev => prev + 1)
  }

  const formatearMoneda = (valor) => {
    if (!valor) return '$0'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor)
  }

  if (loading && !resumen) {
    return (
      <div className="estadisticas-container">
        <div className="loading-state">
          <p>Cargando estadísticas...</p>
          <small>(Puede tardar hasta 90 segundos si el servidor en Render estaba en reposo)</small>
        </div>
      </div>
    )
  }

  if (error && !resumen) {
    return (
      <div className="estadisticas-container">
        <div className="error-state">
          <p>{error}</p>
          <button className="btn-reintentar" onClick={handleActualizar}>Reintentar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="estadisticas-container">
      <header className="estadisticas-header">
        <h1>Dashboard Estadístico</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleActualizar} 
            title="Actualizar datos de la base de datos"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#00AEC7',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            🔄 Actualizar
          </button>
          <select 
            className="year-selector" 
            value={anio} 
            onChange={(e) => {
              setAnio(e.target.value)
              setRefreshKey(prev => prev + 1)
            }}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </header>

      {resumen && (
        <section className="kpi-grid">
          <div className="kpi-card">
            <h3>Total Suscriptores</h3>
            <p className="kpi-value">{resumen.total_suscriptores}</p>
          </div>
          <div className="kpi-card">
            <h3>Total Predios</h3>
            <p className="kpi-value">{resumen.total_predios}</p>
          </div>
          <div className="kpi-card">
            <h3>Total Facturas</h3>
            <p className="kpi-value">{resumen.total_facturas}</p>
          </div>
          <div className="kpi-card">
            <h3>Total Pagos</h3>
            <p className="kpi-value">{resumen.total_pagos}</p>
          </div>
          <div className="kpi-card">
            <h3>Cartera Pendiente</h3>
            <p className="kpi-value">{formatearMoneda(resumen.cartera_pendiente)}</p>
          </div>
          <div className="kpi-card">
            <h3>Recaudo Acumulado</h3>
            <p className="kpi-value">{formatearMoneda(resumen.recaudo_acumulado)}</p>
          </div>
        </section>
      )}

      <section className="charts-grid">
        <div className="chart-card" style={{ borderTopColor: '#E3E829' }}>
          <h3>Facturación vs Recaudo Mensual</h3>
          <div className="chart-wrapper">
            <FacturacionChart key={'fact-' + anio + '-' + refreshKey} anio={anio} />
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Estado de la Cartera</h3>
          <div className="chart-wrapper">
            <EstadoCarteraChart key={'cartera-' + anio + '-' + refreshKey} anio={anio} />
          </div>
        </div>

        <div className="chart-card" style={{ borderTopColor: '#0033A0' }}>
          <h3>Pagos por Método de Pago</h3>
          <div className="chart-wrapper">
            <PagosMetodoChart key={'metodos-' + anio + '-' + refreshKey} anio={anio} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Predios por Sector</h3>
          <div className="chart-wrapper">
            <PrediosSectorChart key={'sectores-' + refreshKey} />
          </div>
        </div>

        <div className="chart-card" style={{ borderTopColor: '#E3E829' }}>
          <h3>Tendencia Acumulada: Facturación vs Recaudo</h3>
          <div className="chart-wrapper">
            <TendenciaRecaudoChart key={'tendencia-' + anio + '-' + refreshKey} anio={anio} />
          </div>
        </div>

        <div className="chart-card" style={{ borderTopColor: '#0033A0' }}>
          <h3>Top 5 Mayor Cartera Pendiente</h3>
          <div className="chart-wrapper">
            <TopDeudoresChart key={'deudores-' + refreshKey} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default EstadisticasPage
