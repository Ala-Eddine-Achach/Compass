import "./AbsenceChart.css";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    LineElement,
    PointElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "cookie-universal";
import { baseURL } from "../../../Api/Api.jsx";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const AbsenceChart = () => {
    const colorTable = {
        MPI: { background: 'rgba(255, 99, 132, 0.2)', border: 'rgba(255, 99, 132, 1)' },
        GL2: { background: 'rgba(54, 162, 235, 0.2)', border: 'rgba(54, 162, 235, 1)' },
        GL3: { background: 'rgba(255, 206, 86, 0.2)', border: 'rgba(255, 206, 86, 1)' },
        GL4: { background: 'rgba(75, 192, 192, 0.2)', border: 'rgba(75, 192, 192, 1)' },
        GL5: { background: 'rgba(153, 102, 255, 0.2)', border: 'rgba(153, 102, 255, 1)' },
        RT2: { background: 'rgba(255, 159, 64, 0.2)', border: 'rgba(255, 159, 64, 1)' },
        RT3: { background: 'rgba(199, 199, 199, 0.2)', border: 'rgba(199, 199, 199, 1)' },
        RT4: { background: 'rgba(83, 102, 255, 0.2)', border: 'rgba(83, 102, 255, 1)' },
        RT5: { background: 'rgba(255, 99, 71, 0.2)', border: 'rgba(255, 99, 71, 1)' },
        IIA2: { background: 'rgba(99, 255, 132, 0.2)', border: 'rgba(99, 255, 132, 1)' },
        IIA3: { background: 'rgba(128, 0, 128, 0.2)', border: 'rgba(128, 0, 128, 1)' },
        IIA4: { background: 'rgba(70, 130, 180, 0.2)', border: 'rgba(70, 130, 180, 1)' },
        IIA5: { background: 'rgba(60, 179, 113, 0.2)', border: 'rgba(60, 179, 113, 1)' },
        IMI2: { background: 'rgba(255, 215, 0, 0.2)', border: 'rgba(255, 215, 0, 1)' },
        IMI3: { background: 'rgba(218, 112, 214, 0.2)', border: 'rgba(218, 112, 214, 1)' },
        IMI4: { background: 'rgba(255, 69, 0, 0.2)', border: 'rgba(255, 69, 0, 1)' },
        IMI5: { background: 'rgba(34, 139, 34, 0.2)', border: 'rgba(34, 139, 34, 1)' },
        CBA: { background: 'rgba(127, 255, 212, 0.2)', border: 'rgba(127, 255, 212, 1)' },
        BIO2: { background: 'rgba(210, 105, 30, 0.2)', border: 'rgba(210, 105, 30, 1)' },
        BIO3: { background: 'rgba(100, 149, 237, 0.2)', border: 'rgba(100, 149, 237, 1)' },
        CH3: { background: 'rgba(255, 20, 147, 0.2)', border: 'rgba(255, 20, 147, 1)' }
    };

    const [absenceSector, setAbsenceSector] = useState([]);
    const userToken = Cookie().get('academiqa');

    useEffect(() => {
        axios
            .get(`${baseURL}/presence/monthlyAbsence/5`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then((res) => {
                setAbsenceSector(res.data);
            })
            .catch((err) => {
                console.error(`${err} - Failed to fetch absence data`);
            });
    }, [userToken]);

    const absenceByLabel = absenceSector.reduce((acc, curr) => {
        if (!acc[curr.Label]) {
            acc[curr.Label] = [];
        }
        acc[curr.Label].push(parseInt(curr.Absence));
        return acc;
    }, {});

    const labels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

    const datasets = Object.keys(absenceByLabel).map(label => ({
        label: label,
        data: absenceByLabel[label],
        backgroundColor: colorTable[label]?.background || 'rgba(0, 0, 0, 0.1)',
        borderColor: colorTable[label]?.border || 'rgba(0, 0, 0, 1)',
        borderWidth: 1.5,
    }));

    const data = {
        labels: labels,
        datasets: datasets,
    };

    const options = {
        scales: {
            x: {

            },
            y: {
                display: true,
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: 'black',
                    usePointStyle: true,
                    boxWidth: 10,
                    padding: 20,
                },
            },
            title: {
                display: true,
                position: 'top',
                text: 'Absence Rate per Level and Month',
                font: {
                    size: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + '%';
                        }
                        return label;
                    },
                },
            },
        },
    };
    //console.log('ddddddddaaaaaaaaaaaaattttttttaaaaaaaaaaaa',data);
    return (
        <Line
            className="absence-chart p-1 w-full bg-gray-50 ml-6 shadow rounded-2xl mb-4"
            data={data}
            options={options}
        />
    );
};

export default AbsenceChart;
