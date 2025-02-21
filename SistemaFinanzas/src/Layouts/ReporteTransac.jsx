import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import generarReporte from "../Services/Controllers/Reporte";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReporteTransac = ({ cuenta_id }) => {
    const [totales, setTotales] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cuenta_id) return;

        const obtenerTotales = async () => {
            try {
                const response = await generarReporte(cuenta_id);
                if (!response) return;
                setTotales(response);
            } catch (err) {
                setError("Error al cargar los datos del reporte");
            } finally {
                setLoading(false);
            }
        };

        obtenerTotales();
    }, [cuenta_id]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Cargando reporte...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    const data = {
        labels: Object.keys(totales),
        datasets: [
            {
                label: "Monto de Transacciones",
                data: Object.values(totales),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',  // Verde agua
                    'rgba(54, 162, 235, 0.2)',  // Azul
                    'rgba(255, 206, 86, 0.2)',  // Amarillo
                    'rgba(255, 99, 132, 0.2)',  // Rosa
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold',
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-full">
            <Bar data={data} options={options} />
        </div>
    );
};

export default ReporteTransac;