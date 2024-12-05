import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct','Nov', 'Dec'],
  datasets: [
    {
      label: 'Journeys',
      data: [12, 100, 30, 55, 17, 40,30,21,90,45,13,54],
      backgroundColor: ['#AC0000'],
      borderColor: ['#AC0000'],
      borderWidth: 1,
      borderRadius:10,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },

  },
  scales: {
    y: { beginAtZero: true },
  },
};

const BarChart = () => <Bar data={data} options={options} />;

export default BarChart;
