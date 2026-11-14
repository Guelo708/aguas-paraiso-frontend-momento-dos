import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { estadisticasService } from '../../services/estadisticasService';

const FacturacionChart = ({ anio }) => {
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

        const datosCombinados = facturacion.map((item, index) => ({
          mes: item.nombre_mes ? item.nombre_mes.substring(0, 3).toUpperCase() : 'M' + (index + 1),
          facturado: Number(item.valor) || 0,
          recaudado: Number(recaudo[index]?.valor) || 0
        }));

        setDatos(datosCombinados);
      } catch {
        setError('Error al cargar gráfica');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [anio]);

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
  };

  const formatearCompacto = (valor) => {
    if (!valor || valor <= 0) return '';
    return '$' + Math.round(valor / 1000) + 'k';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#0033A0' }}>Cargando gráfica...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={datos} margin={{ top: 25, right: 10, left: 5, bottom: 5 }}>
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
          cursor={{ fill: '#f5f5f5' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #00AEC7' }}
        />
        <Legend verticalAlign="bottom" height={36} />
        <Bar dataKey="facturado" name="Total Facturado" fill="#0033A0" radius={[4, 4, 0, 0]}>
          <LabelList dataKey="facturado" position="top" formatter={formatearCompacto} fill="#0033A0" fontSize={10} fontWeight="bold" />
        </Bar>
        <Bar dataKey="recaudado" name="Total Recaudado" fill="#00AEC7" radius={[4, 4, 0, 0]}>
          <LabelList dataKey="recaudado" position="top" formatter={formatearCompacto} fill="#007A8C" fontSize={10} fontWeight="bold" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FacturacionChart;
