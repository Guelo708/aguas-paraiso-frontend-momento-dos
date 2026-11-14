import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { estadisticasService } from '../../services/estadisticasService';

const COLORS = ['#0033A0', '#00AEC7', '#4EC3E0', '#E3E829', '#FFE946'];

const TopDeudoresChart = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const data = await estadisticasService.obtenerTopDeudores();
        const normalizados = data
          .map((item) => ({
            nombre: item.nombre || item.suscriptor || item.predio || 'Sin identificar',
            predio: item.predio || item.codigo_predio || '',
            facturas: Number(item.facturas ?? item.cantidad ?? 0),
            deuda: Number(item.deuda ?? item.saldo ?? item.valor ?? item.total ?? 0)
          }))
          .filter((item) => item.deuda > 0)
          .slice(0, 5);
        setDatos(normalizados);
      } catch {
        setError('Endpoint /estadisticas/cartera/top-deudores pendiente o sin conexión');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  };

  const formatearCompacto = (valor) => {
    if (!valor || valor <= 0) return '';
    if (valor >= 1000000) return '$' + (valor / 1000000).toFixed(1) + 'M';
    return '$' + Math.round(valor / 1000) + 'k';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#0033A0' }}>Cargando top deudores...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: '#0033A0', fontSize: '0.9rem' }}>{error}</div>;
  if (datos.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', color: '#007A8C', fontWeight: 'bold' }}>Sin cartera pendiente o vencida registrada</div>;

  return (
    <ResponsiveContainer width="100%" height={295}>
      <BarChart data={datos} layout="vertical" margin={{ top: 10, right: 55, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
        <XAxis
          type="number"
          tickFormatter={(val) => '$' + Math.round(val / 1000) + 'k'}
          tick={{ fill: '#0033A0', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="nombre"
          width={135}
          tick={{ fill: '#0033A0', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value, name, props) => {
            const detallePredio = props.payload.predio ? ' | Predio: ' + props.payload.predio : '';
            const detalleFact = props.payload.facturas ? ' (' + props.payload.facturas + ' fact.)' : '';
            return [formatearMoneda(value) + detalleFact + detallePredio, 'Saldo'];
          }}
          cursor={{ fill: '#f5f5f5' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #00AEC7' }}
        />
        <Bar dataKey="deuda" name="Deuda Pendiente" radius={[0, 6, 6, 0]}>
          {datos.map((entry, index) => (
            <Cell key={'deudor-' + index} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList dataKey="deuda" position="right" formatter={formatearCompacto} fill="#0033A0" fontSize={12} fontWeight="bold" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopDeudoresChart;
