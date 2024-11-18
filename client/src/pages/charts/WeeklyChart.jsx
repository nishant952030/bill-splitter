import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { expenseRoute } from '../../components/constant';
import axios from 'axios';
import CategoriesSpentOn from './categoriesSpentOn';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeeklyChart = () => {
    const [completedata, setData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState([]);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const [classifeidData, setClassifeidData] = useState([]);

    const getMonthName = (year, month) => {
        return new Date(year, month).toLocaleString('default', { month: 'long' });
    };

    const getPreviousMonthName = () => {
        const prevDate = new Date(currentYear, currentMonth - 1);
        return getMonthName(prevDate.getFullYear(), prevDate.getMonth());
    };

    const getNextMonthName = () => {
        const nextDate = new Date(currentYear, currentMonth + 1);
        return getMonthName(nextDate.getFullYear(), nextDate.getMonth());
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${expenseRoute}/for-chart`, {
                    withCredentials: true,
                });
                if (response.data.success) {
                    setData(response.data.expenses);
                    setClassifeidData(response.data.classifiedData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        console.log(classifeidData)
     },[classifeidData])
    useEffect(() => {
        const processChartData = () => {
            const initialData = Array(daysInMonth).fill(0);
            completedata.forEach((expense) => {
                const expenseDate = new Date(expense.createdAt);
                if (
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
                ) {
                    const dayIndex = expenseDate.getDate() - 1;
                    initialData[dayIndex] += expense.splitAmount;
                }
            });
            setChartData(initialData);
        };
        if (completedata.length > 0) {
            processChartData();
        }
    }, [completedata, currentMonth, currentYear, daysInMonth]);

    const handlePreviousMonth = () => {
        const newDate = new Date(currentYear, currentMonth - 1, 1);
        const oldestDate = new Date(completedata[completedata.length - 1]?.createdAt);
        if (oldestDate.getFullYear() < newDate.getFullYear() ||
            (oldestDate.getFullYear() === newDate.getFullYear() && oldestDate.getMonth() <= newDate.getMonth())) {
            setCurrentMonth(newDate.getMonth());
            setCurrentYear(newDate.getFullYear());
        }
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentYear, currentMonth + 1, 1);
        const newestDate = new Date(completedata[0]?.createdAt);
        if (newestDate.getFullYear() > newDate.getFullYear() ||
            (newestDate.getFullYear() === newDate.getFullYear() && newestDate.getMonth() >= newDate.getMonth())) {
            setCurrentMonth(newDate.getMonth());
            setCurrentYear(newDate.getFullYear());
        }
    };

    const data = {
        labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
        datasets: [
            {
                label: `Expenses for ${getMonthName(currentYear, currentMonth)} ${currentYear}`,
                data: chartData,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Monthly Expenses',
            },
            legend: {
                position: 'top',
            },
        },
    };

    // Generate a unique key for the chart
    const chartKey = `${currentMonth}-${currentYear}-${chartData.join(',')}`;

    return (
        <div>
            <div className="flex justify-between my-4">
                <button
                    onClick={handlePreviousMonth}
                    className="px-4 py-2 text-white bg-[#1F2937] rounded hover:bg-gray-800"
                >
                    ← {getPreviousMonthName()}
                </button>
                <button
                    onClick={handleNextMonth}
                    className="px-4 py-2 text-white bg-[#1F2937] rounded hover:bg-gray-800"
                >
                    {getNextMonthName()} →
                </button>
            </div>

            <Line key={chartKey} data={data} options={options} />
            <CategoriesSpentOn classifiedData={classifeidData} />
        </div>
    );
};

export default WeeklyChart;
