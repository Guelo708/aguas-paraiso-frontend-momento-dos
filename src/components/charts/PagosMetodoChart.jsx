import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { estadisticasService } from '../../services/estadisticasService';

const COLORS = ['#0033A0', '#00AEC7', '#E3E829', '#4EC3E0', '#FFE946'];

const PagosMetodoChart = ({ anio }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const data = await estadisticasService.obtenerPagosPorMetodo(anio);
        const normalizados = data
          .map((item) => ({
            nombre: item.metodo || item.metodo_pago || item.nombre || 'Otro',
            cantidad: Number(item.cantidad ?? item.total ?? item.valor ?? 0)
          }))
          .filter((item) => item.cantidad > 0);
        setDatos(normalizados);
      } catch {
        setError('Error al cargar pagos por método');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [anio]);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#0033A0' }}>Cargando...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  if (datos.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No hay pagos registrados en {anio}</div>;

  return (
    <ResponsiveContainer width="100%" height={290}>
      <BarChart data={datos} margin={{ top: 25, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
        <XAxis dataKey="nombre" interval={0} tick={{ fill: '#0033A0', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: '#0033A0', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => [value + ' pagos', 'Cantidad']}
          cursor={{ fill: '#f5f5f5' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #00AEC7' }}
        />
        <Bar dataKey="cantidad" name="Pagos" radius={[6, 6, 0, 0]}>
          {datos.map((entry, index) => (
            <Cell key={'metodo-' + index} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList dataKey="cantidad" position="top" fill="#0033A0" fontSize={12} fontWeight="bold" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PagosMetodoChart;
