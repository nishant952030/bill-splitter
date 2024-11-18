import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required elements for Chart.js
Chart.register(ArcElement, Tooltip, Legend);

const CategoriesSpentOn = ({ classifiedData }) => {
   console.log(classifiedData);
    const labels = Object.keys(classifiedData || {}); // Categories like 'Bills', 'Education', etc.
    const dataValues = labels.map(category => (classifiedData[category]?.total || 0)); // Extract totals

    // Data for the chart
    const data = {
        labels: labels, // Categories as labels
        datasets: [
            {
                label: 'Spending Breakdown',
                data: dataValues, // Values (e.g., 5100 for Bills)
                backgroundColor: [
                    '#FF6384', // Colors for each category
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF9A40',
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#FF9A20',
                ],
            },
        ],
    };

    // Show message if no data is available
    if (!classifiedData || Object.keys(classifiedData).length === 0) {
        return <p className="text-center mt-4">No data available to display.</p>;
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            <h3 className="text-xl font-semibold text-center">Expense Breakdown categories wise</h3>
            <Doughnut data={data} />
        </div>
    );
};

export default CategoriesSpentOn;
