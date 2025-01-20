'use client'
export const config = {
    ssr: false,
  };
  
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/Loading';

interface Appointment {
  timestamp: string; // Fecha de creación de la cita
  name: string; // Nombre del cliente
  email: string; // Email del cliente
  date: string; // Fecha de la cita
  time: string; // Hora de la cita
  service: string; // Servicios solicitados
  person: string; // Persona con la cual se realizará el servicio
}

const Page = () => {
  const [data, setData] = useState<Appointment[]>([]);
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

        // Filtrar y mapear los datos correctamente, eliminando filas irrelevantes y columnas no necesarias
        const filteredData: Appointment[] = rows.slice(4).map((row) => ({
          timestamp: row[1], // Fecha de creación de la cita
          name: row[2], // Nombre
          email: row[3], // Email
          date: row[4], // Fecha de la cita
          time: row[5], // Hora de la cita
          service: row[6], // Servicios solicitados
          person: row[7], // Persona con la cual se realizará el servicio
        }));

        setData(filteredData);
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
    <div className="p-6 font-sans space-y-4" >
    <h1 className="text-4xl font-[family-name:var(--font-kalnia-glaze)] text-gray-900 my-12">Citas Agendadas</h1>
    {data.map((row, index) => (
      <div
        key={index}
        className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition flex items-center space-x-4 animate-fade-right animate-once animate-ease-in"
      >
        <div className="flex-1">
          <p className="text-gray-900 text-sm font-semibold">
            {row.name} - {row.date} {row.time}
          </p>
          <p className="text-gray-500 text-xs">
            <span className="font-medium">Servicio:</span> {row.service}
          </p>
          <p className="text-gray-500 text-xs">
            <span className="font-medium">Con:</span> {row.person || 'No asignado'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">{row.timestamp}</p>
          <p className="text-gray-500 text-xs">
            <span className="font-medium">Email:</span> {row.email}
          </p>
        </div>
      </div>
    ))}
  </div>
  );
};

export default Page;
