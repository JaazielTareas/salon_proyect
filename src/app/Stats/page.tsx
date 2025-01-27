'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import LoadingSpinner from '../components/Loading';
import { useFetchAppointments } from '../../../hooks/useFetchAppointments';

const StatsPage = () => {
  const {
    serviceChartData,
    personChartData,
    timeChartData,
    summaryData,
    isLoading,
    error,
    refetchData, // Asume que este método está disponible en tu hook
  } = useFetchAppointments();

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    const doc = new jsPDF('portrait', 'px', 'a4');

    try {
      // Sección: Total generado en productos
      doc.text('Resumen General', 20, 20);
      doc.text(`Total generado en productos: $${summaryData.totalRevenue.toFixed(2)}`, 20, 40);
      doc.text(`Producto más solicitado: ${summaryData.topService.name} (${summaryData.topService.count} veces)`, 20, 60);
      doc.text(`Empleado destacado: ${summaryData.topEmployee.name} (${summaryData.topEmployee.clients} clientes)`, 20, 80);

      const peakHoursText = summaryData.peakHours.map(
        (hour) => `- ${hour.hour}: ${hour.count} solicitudes`
      ).join('\n');
      doc.text(`Horas más concurridas:\n${peakHoursText}`, 20, 100);

      // Gráfico: Servicios
      const barChart = document.getElementById('bar-chart');
      if (barChart) {
        const canvas = await html2canvas(barChart);
        const imgData = canvas.toDataURL('image/png');
        doc.addPage();
        doc.text('Reporte de Servicios', 20, 20);
        doc.addImage(imgData, 'PNG', 20, 40, 400, 200);
      }

      // Gráfico: Empleados
      const pieChart = document.getElementById('pie-chart');
      if (pieChart) {
        const canvas = await html2canvas(pieChart);
        const imgData = canvas.toDataURL('image/png');
        doc.addPage();
        doc.text('Reporte de Empleados', 20, 20);
        doc.addImage(imgData, 'PNG', 20, 40, 400, 200);
      }

      // Gráfico: Horarios
      const lineChart = document.getElementById('line-chart');
      if (lineChart) {
        const canvas = await html2canvas(lineChart);
        const imgData = canvas.toDataURL('image/png');
        doc.addPage();
        doc.text('Reporte de Horarios', 20, 20);
        doc.addImage(imgData, 'PNG', 20, 40, 400, 200);
      }

      // Guardar PDF
      doc.save('reporte_estadisticas.pdf');
    } catch (err) {
      console.error('Error al generar el PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 flex justify-center flex-col gap-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Estadísticas del Salón</h1>
        <div className="flex gap-4">
          <button
            onClick={refetchData}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
          >
            Actualizar Datos
          </button>
          <button
            onClick={generatePDF}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generando...' : 'Generar Reporte'}
          </button>
        </div>
      </div>

      <div id="bar-chart">
        <BarChart data={serviceChartData} />
      </div>
      <div id="pie-chart">
        <PieChart data={personChartData} />
      </div>
      <div id="line-chart">
        <LineChart data={timeChartData} />
      </div>
    </div>
  );
};

export default StatsPage;
