import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { estadisticasService } from '../../services/estadisticasService';

const COLORS = ['#0033A0', '#00AEC7', '#E3E829', '#4EC3E0', '#FFE946'];

const EstadoCarteraChart = ({ anio }) => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Nota: Si tu API soporta año para este endpoint, puedes pasarlo. 
        // Por ahora consume el general, pero se refrescará al cambiar el año/recargar.
        const data = await estadisticasService.obtenerFacturasPorEstado(anio);
        const dataFiltrada = data.filter(item => item.cantidad > 0);
        setDatos(dataFiltrada);
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarDatos();
  }, [anio]);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color, #0033A0)' }}>Cargando...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  if (datos.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color, #666)' }}>No hay datos para {anio}</div>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={datos}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="cantidad"
          nameKey="estado"
        >
          {datos.map((entry, index) => (
            <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
           formatter={(value, name) => [value + ' facturas', name]}
           contentStyle={{ borderRadius: '8px', border: '1px solid #00AEC7', backgroundColor: 'var(--card-bg, #FFF)', color: '#000' }}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EstadoCarteraChart;
