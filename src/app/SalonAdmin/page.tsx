'use client';
export const config = {
  ssr: false,
};

import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/Loading';

interface Appointment {
  timestamp: string;
  name: string;
  email: string;
  date: string;
  time: string;
  service: string;
  person: string;
}

const Page = () => {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [tomorrowAppointments, setTomorrowAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const spreadsheetUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vScIiueHJ7x287mbbdA3R1i6t8-c-SL-hgY5ENDR5il6er9NsKE1gHNo2i3qqNz0eU9h1OY03EESXAU/pubhtml';

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

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

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (date: Date) =>
        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

      const todayStr = formatDate(today);
      const tomorrowStr = formatDate(tomorrow);

      const todayAppointments = filteredData.filter(
        (appointment) => appointment.date === todayStr
      );
      const tomorrowAppointments = filteredData.filter(
        (appointment) => appointment.date === tomorrowStr
      );

      setTodayAppointments(todayAppointments);
      setTomorrowAppointments(tomorrowAppointments);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
  };

  const calculateTotal = (services: string): number => {
    const pricePattern = /\$([0-9]+\.?[0-9]*)/g;
    let total = 0;
    let match;
    while ((match = pricePattern.exec(services)) !== null) {
      total += parseFloat(match[1]);
    }
    return total;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-6 font-sans space-y-4">
      <h1 className="text-4xl font-bold text-gray-900 my-12">Citas Agendadas</h1>

      <button
        onClick={fetchData}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Actualizar Datos
      </button>

      <section>
        <h2 className="text-2xl font-semibold text-black mb-7">Citas de Hoy</h2>
        {todayAppointments.map((appointment, index) => (
          <div
            key={index}
            onClick={() => handleOpenModal(appointment)}
            className="border rounded-lg shadow-sm p-4 mb-4 bg-white hover:shadow-md transition cursor-pointer"
          >
            <p className="text-gray-900 text-sm font-semibold">
              {appointment.name} - {appointment.time}
            </p>
            <p className="text-gray-500 text-xs">
              <span className="font-medium">Servicio:</span> {appointment.service}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-7 mt-10 text-black">Citas de Mañana</h2>
        {tomorrowAppointments.map((appointment, index) => (
          <div
            key={index}
            onClick={() => handleOpenModal(appointment)}
            className="border rounded-lg shadow-sm p-4 mb-4 bg-white hover:shadow-md transition cursor-pointer"
          >
            <p className="text-gray-900 text-sm font-semibold">
              {appointment.name} - {appointment.time}
            </p>
            <p className="text-gray-500 text-xs">
              <span className="font-medium">Servicio:</span> {appointment.service}
            </p>
          </div>
        ))}
      </section>

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 space-y-4">
            <h3 className="text-lg font-semibold">Detalles de la Cita</h3>
            <p>
              <span className="font-medium">Cliente:</span> {selectedAppointment.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {selectedAppointment.email}
            </p>
            <p>
              <span className="font-medium">Fecha:</span> {selectedAppointment.date}
            </p>
            <p>
              <span className="font-medium">Hora:</span> {selectedAppointment.time}
            </p>
            <p>
              <span className="font-medium">Servicios:</span> {selectedAppointment.service}
            </p>
            <p className="font-bold text-gray-700">
              Total: ${calculateTotal(selectedAppointment.service).toFixed(2)}
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
