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
        const data = await estadisticasService.obtenerFacturasPorEstado(anio);
        const normalizados = data
          .map((item) => {
            const esPagada = item.estado === 'PAGADA';
            const monto = esPagada
              ? Number(item.valor_facturado ?? 0)
              : Number(item.saldo_pendiente ?? item.valor_facturado ?? 0);

            return {
              estado: item.estado,
              monto,
              cantidad: Number(item.cantidad ?? 0),
              valorFacturado: Number(item.valor_facturado ?? 0),
              saldoPendiente: Number(item.saldo_pendiente ?? 0)
            };
          })
          .filter((item) => item.monto > 0);

        setDatos(normalizados);
      } catch {
        setError('Error al cargar cartera en pesos');
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

  const formatearEtiqueta = ({ value }) => {
    if (!value || value <= 0) return '';
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    return '$' + Math.round(value / 1000) + 'k';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#0033A0' }}>Cargando...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  if (datos.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No hay cartera registrada</div>;

  return (
    <ResponsiveContainer width="100%" height={295}>
      <PieChart>
        <Pie
          data={datos}
          cx="50%"
          cy="45%"
          innerRadius={52}
          outerRadius={75}
          paddingAngle={5}
          dataKey="monto"
          nameKey="estado"
          label={formatearEtiqueta}
        >
          {datos.map((entry, index) => (
            <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [
            formatearMoneda(value) + ' (' + props.payload.cantidad + ' fact.)',
            name
          ]}
          contentStyle={{ borderRadius: '8px', border: '1px solid #00AEC7', backgroundColor: '#FFF', color: '#000' }}
        />
        <Legend verticalAlign="bottom" height={40} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EstadoCarteraChart;
