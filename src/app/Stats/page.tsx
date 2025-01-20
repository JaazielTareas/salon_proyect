'use client';

import { useEffect, useState } from 'react';
import BarChart from '../components/BarChart';
import LoadingSpinner from '../components/Loading';
import { ChartData } from 'chart.js';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';

interface Appointment {
  timestamp: string;
  name: string;
  email: string;
  date: string;
  time: string;
  service: string;
  person: string;
}

const StatsPage = () => {
  const [data, setData] = useState<Appointment[]>([]);
  const [serviceChartData, setServiceChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: []
  });
  
  const [personChartData, setPersonChartData] = useState<ChartData<'pie'>>({
    labels: [],
    datasets: []
  });
  
  const [timeChartData, setTimeChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const spreadsheetUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vScIiueHJ7x287mbbdA3R1i6t8-c-SL-hgY5ENDR5il6er9NsKE1gHNo2i3qqNz0eU9h1OY03EESXAU/pubhtml';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(spreadsheetUrl);
        if (!response.ok) {
          throw new Error(`Error al cargar los datos: ${response.status}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const table = doc.querySelector('table');
        if (!table) {
          throw new Error('No se encontró la tabla en el HTML.');
        }

        const rows = Array.from(table.rows).map((row) =>
          Array.from(row.cells).map((cell) => cell.textContent?.trim() || '')
        );

        const filteredData: Appointment[] = rows.slice(4).map((row) => ({
          timestamp: row[1],
          name: row[2],
          email: row[3],
          date: row[4],
          time: row[5],
          service: row[6],
          person: row[7],
        }));

        setData(filteredData);

        // Contar servicios
        const serviceCount: Record<string, number> = {};
        const personCount: Record<string, number> = {};
        const timeCount: Record<string, number> = {};

        filteredData.forEach((appointment) => {
          serviceCount[appointment.service] = (serviceCount[appointment.service] || 0) + 1;
          personCount[appointment.person] = (personCount[appointment.person] || 0) + 1;
          timeCount[appointment.time] = (timeCount[appointment.time] || 0) + 1;
        });

        // Configuración de datos para gráficos
        setServiceChartData({
          labels: Object.keys(serviceCount),
          datasets: [
            {
              label: 'Servicios',
              data: Object.values(serviceCount),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }
          ],
        });

        setPersonChartData({
          labels: Object.keys(personCount),
          datasets: [
            {
              label: 'Personas',
              data: Object.values(personCount),
              backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 1,
            }
          ],
        });

        setTimeChartData({
          labels: Object.keys(timeCount),
          datasets: [
            {
              label: 'Horas',
              data: Object.values(timeCount),
              fill: false,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.1,
            }
          ],
        });

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-6 flex justify-center flex-col gap-16">
      <h1 className="text-2xl font-bold mb-4">Estadísticas del Salon</h1>
        <BarChart data={serviceChartData} />
        <PieChart data={personChartData} />
        <LineChart data={timeChartData} />
    </div>
  );
};

export default StatsPage;
