import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { estadisticasService } from '../../services/estadisticasService';

const TendenciaRecaudoChart = ({ anio }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [facturacion, recaudo] = await Promise.all([
          estadisticasService.obtenerFacturacionMensual(anio),
          estadisticasService.obtenerRecaudoMensual(anio)
        ]);

        let acumFacturado = 0;
        let acumRecaudado = 0;

        const serieAcumulada = facturacion.map((item, index) => {
          const factMes = Number(item.valor) || 0;
          const recMes = Number(recaudo[index]?.valor) || 0;
          acumFacturado += factMes;
          acumRecaudado += recMes;

          return {
            mes: item.nombre_mes ? item.nombre_mes.substring(0, 3).toUpperCase() : 'M' + (index + 1),
            facturadoAcum: acumFacturado,
            recaudadoAcum: acumRecaudado,
            tuvoMovimiento: factMes > 0 || recMes > 0
          };
        });

        setDatos(serieAcumulada);
      } catch {
        setError('Error al cargar tendencia acumulada');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [anio]);

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  };

  const formatearEtiqueta = (valor) => {
    if (!valor || valor <= 0) return '';
    return '$' + Math.round(valor / 1000) + 'k';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#0033A0' }}>Cargando tendencia...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <ResponsiveContainer width="100%" height={290}>
      <AreaChart data={datos} margin={{ top: 25, right: 15, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id="gradFacturado" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0033A0" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#0033A0" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="gradRecaudado" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00AEC7" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#00AEC7" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis dataKey="mes" interval={0} tick={{ fill: '#0033A0', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(val) => '$' + (val / 1000) + 'k'}
          tick={{ fill: '#0033A0', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => formatearMoneda(value)}
          contentStyle={{ borderRadius: '8px', border: '1px solid #00AEC7' }}
        />
        <Legend verticalAlign="bottom" height={36} />
        <Area
          type="monotone"
          dataKey="facturadoAcum"
          name="Facturación Acumulada"
          stroke="#0033A0"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#gradFacturado)"
        >
          <LabelList dataKey="facturadoAcum" position="top" formatter={formatearEtiqueta} fill="#0033A0" fontSize={10} fontWeight="bold" />
        </Area>
        <Area
          type="monotone"
          dataKey="recaudadoAcum"
          name="Recaudo Acumulado"
          stroke="#00AEC7"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#gradRecaudado)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TendenciaRecaudoChart;
