import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { estadisticasService } from '../../services/estadisticasService';

const COLORS = ['#00AEC7', '#0033A0', '#4EC3E0', '#E3E829', '#FFE946'];

const PrediosSectorChart = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const data = await estadisticasService.obtenerPrediosPorSector();
        const normalizados = data
          .map((item) => ({
            nombre: item.sector || item.nombre_sector || item.nombre || 'Sin sector',
            cantidad: Number(item.cantidad ?? item.total ?? item.valor ?? 0)
          }))
          .filter((item) => item.cantidad > 0);
        setDatos(normalizados);
      } catch {
        setError('Error al cargar predios por sector');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#0033A0' }}>Cargando...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  if (datos.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No hay predios registrados por sector</div>;

  return (
    <ResponsiveContainer width="100%" height={290}>
      <BarChart data={datos} layout="vertical" margin={{ top: 10, right: 35, left: 10, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
        <XAxis type="number" allowDecimals={false} tick={{ fill: '#0033A0', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="nombre" width={130} tick={{ fill: '#0033A0', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => [value + ' predios', 'Total']}
          cursor={{ fill: '#f5f5f5' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #00AEC7' }}
        />
        <Bar dataKey="cantidad" name="Predios" radius={[0, 6, 6, 0]}>
          {datos.map((entry, index) => (
            <Cell key={'sector-' + index} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList dataKey="cantidad" position="right" fill="#0033A0" fontSize={12} fontWeight="bold" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PrediosSectorChart;
