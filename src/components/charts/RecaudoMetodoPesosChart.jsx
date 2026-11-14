import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { estadisticasService } from '../../services/estadisticasService';

const COLORS = ['#0033A0', '#00AEC7', '#4EC3E0', '#E3E829', '#FFE946'];

const RecaudoMetodoPesosChart = ({ anio }) => {
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
            metodo: item.metodo_pago,
            valor: Number(item.valor_recaudado ?? 0),
            cantidad: Number(item.cantidad ?? 0),
            porcentaje: Number(item.porcentaje_valor ?? 0)
          }))
          .filter((item) => item.valor > 0);
        setDatos(normalizados);
      } catch {
        setError('Error al cargar recaudo en pesos por método');
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

  const formatearEtiquetaBarra = (valor) => {
    if (!valor || valor <= 0) return '';
    if (valor >= 1000000) return '$' + (valor / 1000000).toFixed(1) + 'M';
    if (valor >= 1000) return '$' + Math.round(valor / 1000) + 'k';
    return '$' + valor;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: '#0033A0' }}>Cargando recaudo por medio...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  if (datos.length === 0) return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Sin pagos registrados en {anio}</div>;

  return (
    <ResponsiveContainer width="100%" height={295}>
      <BarChart
        data={datos}
        layout="vertical"
        margin={{ top: 10, right: 55, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e0e0e0" />
        <XAxis
          type="number"
          tickFormatter={(v) => (v >= 1000 ? '$' + (v / 1000) + 'k' : '$' + v)}
          tick={{ fill: '#0033A0', fontSize: 11 }}
        />
        <YAxis
          type="category"
          dataKey="metodo"
          width={105}
          tick={{ fill: '#0033A0', fontSize: 11, fontWeight: 500 }}
        />
        <Tooltip
          formatter={(value, name, props) => [
            formatearMoneda(value) + ' (' + props.payload.porcentaje.toFixed(1) + '% · ' + props.payload.cantidad + ' pagos)',
            'Recaudado'
          ]}
          cursor={{ fill: '#f5f5f5' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #00AEC7', backgroundColor: '#FFF', color: '#000' }}
        />
        <Bar dataKey="valor" name="Recaudo" radius={[0, 6, 6, 0]} barSize={24}>
          {datos.map((entry, index) => (
            <Cell key={'metodo-pesos-' + index} fill={COLORS[index % COLORS.length]} />
          ))}
          <LabelList
            dataKey="valor"
            position="right"
            formatter={formatearEtiquetaBarra}
            fill="#0033A0"
            fontSize={11}
            fontWeight="bold"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RecaudoMetodoPesosChart;
