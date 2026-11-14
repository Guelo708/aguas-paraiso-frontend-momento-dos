import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { estadisticasService } from '../../services/estadisticasService';

const CarteraSectorChart = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const data = await estadisticasService.obtenerCarteraPorSector();
        const normalizados = data.map((item) => ({
          sector: item.sector,
          vencida: Number(item.cartera_vencida ?? 0),
          pendiente: Number(item.cartera_pendiente ?? 0),
          total: Number(item.total_cartera ?? 0),
          facturas: Number(item.facturas_con_saldo ?? 0)
        }));
        setDatos(normalizados);
      } catch {
        setError('Error al cargar cartera por sector');
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

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#0033A0' }}>Cargando cartera por sector...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  if (datos.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Sin cartera registrada por sector</div>;

  return (
    <ResponsiveContainer width="100%" height={295}>
      <BarChart data={datos} margin={{ top: 15, right: 20, left: 5, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis
          dataKey="sector"
          tick={{ fill: '#0033A0', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          tickFormatter={(v) => (v >= 1000 ? '$' + (v / 1000) + 'k' : '$' + v)}
          tick={{ fill: '#0033A0', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value, name) => [formatearMoneda(value), name]}
          contentStyle={{ borderRadius: '8px', border: '1px solid #00AEC7', backgroundColor: '#FFF', color: '#000' }}
        />
        <Legend verticalAlign="bottom" height={36} />
        <Bar dataKey="pendiente" name="Pendiente / Parcial" stackId="cartera" fill="#00AEC7" />
        <Bar dataKey="vencida" name="Cartera Vencida" stackId="cartera" fill="#D9534F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CarteraSectorChart;
