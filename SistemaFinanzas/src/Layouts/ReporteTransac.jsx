import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import generarReporte from "../Services/Controllers/Reporte"

// Registra los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReporteTransac = ({ cuenta_id }) => {
    const [totales, setTotales] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!cuenta_id) return; // Evita hacer la petición si cuenta_id aún no está definido

        const obtenerTotales = async () => {
            try {
                console.log("Llamando a la API con cuenta_id:", cuenta_id);
                const response = await generarReporte(cuenta_id);
                if (!response) return;
                setTotales(response);
            } catch (err) {
                setError("Hubo un error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };

        obtenerTotales();
    }, [cuenta_id]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Formateamos los datos para Chart.js
    const data = {
        labels: Object.keys(totales), // Las categorías (DEPOSITO, PAGO, etc.)
        datasets: [
            {
                label: "Monto de Transacciones",
                data: Object.values(totales), // Los valores de cada tipo de transacción
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Color de fondo de las barras
                borderColor: "rgba(75, 192, 192, 1)", // Color del borde de las barras
                borderWidth: 3, // Ancho del borde
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Reporte de Transacciones por Tipo",
                font: {
                    size: 24,  // Tamaño de la fuente del título
                    weight: 'bold',  // Grosor de la fuente del título
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14, // Tamaño de la fuente para las etiquetas del eje X
                        weight: 'bold', // Grosor de la fuente para las etiquetas del eje X
                    },
                }, // Empieza el eje X en 0
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14, // Tamaño de la fuente para las etiquetas del eje X
                        weight: 'bold', // Grosor de la fuente para las etiquetas del eje X
                    },
                }, // Empieza el eje X en 0 // Empieza el eje Y en 0
            },
        },
    };

    return (
        <div className="w-full h-full flex justify-center items-center">
            <Bar data={data} options={options} />
        </div>
    );
};

export default ReporteTransac;
