import { useCallback, useEffect, useState } from "react";
import { ChartData } from "chart.js";

interface Appointment {
    timestamp: string;
    name: string;
    email: string;
    date: string;
    time: string;
    service: string;
    person: string;
}

type SummaryData = {
    totalRevenue: number;
    topService: { name: string; count: number };
    topEmployee: { name: string; clients: number };
    peakHours: { hour: string; count: number }[];
};

export const useFetchAppointments = () => {
    const [serviceChartData, setServiceChartData] = useState<ChartData<"bar">>({
        labels: [],
        datasets: [],
    });

    const [personChartData, setPersonChartData] = useState<ChartData<"pie">>({
        labels: [],
        datasets: [],
    });

    const [timeChartData, setTimeChartData] = useState<ChartData<"line">>({
        labels: [],
        datasets: [],
    });

    const [summaryData, setSummaryData] = useState<SummaryData>({
        totalRevenue: 0,
        topService: { name: "", count: 0 },
        topEmployee: { name: "", clients: 0 },
        peakHours: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const spreadsheetUrl =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vScIiueHJ7x287mbbdA3R1i6t8-c-SL-hgY5ENDR5il6er9NsKE1gHNo2i3qqNz0eU9h1OY03EESXAU/pubhtml";


    const processChartData = useCallback((appointments: Appointment[]) => {
        const serviceData: Record<string, { count: number; revenue: number }> = {};
        const personCount: Record<string, number> = {};
        const timeCount: Record<string, number> = {};

        appointments.forEach((appointment) => {
            if (!appointment.service) return;

            const services = appointment.service.split(", ").map((s) => s.trim());
            services.forEach((service) => {
                const match = service.match(/^(.*?)\s[–-]\s\$(\d+(?:\.\d{2})?)$/);
                if (match) {
                    const [_, name, price] = match;
                    const serviceName = name.trim();
                    const servicePrice = parseFloat(price);
                    if (!serviceData[serviceName]) {
                        serviceData[serviceName] = { count: 0, revenue: 0 };
                    }
                    serviceData[serviceName].count += 1;
                    serviceData[serviceName].revenue += servicePrice;
                }
            });

            personCount[appointment.person] =
                (personCount[appointment.person] || 0) + 1;

            timeCount[appointment.time] =
                (timeCount[appointment.time] || 0) + 1;
        });

        const totalRevenue = Object.values(serviceData).reduce(
            (sum, data) => sum + data.revenue,
            0
        );

        const [topServiceName, topServiceData] =
            Object.entries(serviceData).sort((a, b) => b[1].count - a[1].count)[0] ||
            ["", { count: 0 }];

        const [topEmployeeName, topEmployeeClients] =
            Object.entries(personCount).sort((a, b) => b[1] - a[1])[0] || ["", 0];

        const peakHours = Object.entries(timeCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([hour, count]) => ({ hour, count }));

        const sortedServices = Object.entries(serviceData).sort(
            (a, b) => b[1].revenue - a[1].revenue
        );

        const sortedTimes = Object.keys(timeCount)
            .map((time) => ({
                time,
                numericValue: convertTimeTo12HourValue(time),
            }))
            .sort((a, b) => a.numericValue - b.numericValue);

        const sortedLabels = sortedTimes.map((item) => item.time);
        const sortedData = sortedTimes.map((item) => timeCount[item.time]);

        const personLabels = Object.keys(personCount);
        const personData = Object.values(personCount);

        setServiceChartData({
            labels: sortedServices.map(([name]) => name),
            datasets: [
                {
                    label: "Ingresos Generados ($)",
                    data: sortedServices.map(([_, data]) => data.revenue),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Veces Solicitado",
                    data: sortedServices.map(([_, data]) => data.count),
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                },
            ],
        });

        setPersonChartData({
            labels: personLabels,
            datasets: [
                {
                    label: "Personas",
                    data: personData,
                    backgroundColor: generateSalonColors(personLabels.length),
                    borderColor: "#4b4747",
                },
            ],
        });

        setTimeChartData({
            labels: sortedLabels,
            datasets: [
                {
                    label: "Solicitudes por Hora",
                    data: sortedData,
                    fill: false,
                    borderColor: "rgba(75, 192, 192, 1)",
                    tension: 0.1,
                },
            ],
        });

        setSummaryData({
            totalRevenue,
            topService: { name: topServiceName, count: topServiceData.count },
            topEmployee: { name: topEmployeeName, clients: topEmployeeClients },
            peakHours,
        });
    }, []);

    const convertTimeTo12HourValue = (time: string): number => {
        const [hour, minutePart] = time.split(":");
        const [minute, period] = minutePart.split(" ");
        let numericHour = parseInt(hour);
        if (period.toLowerCase() === "pm" && numericHour !== 12) {
            numericHour += 12;
        }
        if (period.toLowerCase() === "am" && numericHour === 12) {
            numericHour = 0;
        }
        return numericHour * 60 + parseInt(minute);
    };

    const generateSalonColors = (count: number): string[] => {
        const pastelPalette = [
            "#FADADD",
            "#BEE3F8",
            "#B2F5EA",
            "#FEFCBF",
            "#FEB2B2",
            "#C6F6D5",
            "#FAF089",
        ];
        return Array.from({ length: count }, (_, i) =>
            pastelPalette[i % pastelPalette.length]
        );
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(spreadsheetUrl);
            if (!response.ok) {
                throw new Error(`Error al cargar los datos: ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const table = doc.querySelector("table");
            if (!table) {
                throw new Error("No se encontró la tabla en el HTML.");
            }

            const rows = Array.from(table.rows).map((row) =>
                Array.from(row.cells).map((cell) => cell.textContent?.trim() || "")
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

            processChartData(filteredData);
        } catch (err: any) {
            console.error("Error:", err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [processChartData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    return {
        isLoading,
        error,
        serviceChartData,
        personChartData,
        timeChartData,
        summaryData,
        refetchData: fetchData,
    };
};
