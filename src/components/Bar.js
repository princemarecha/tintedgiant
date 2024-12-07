import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Remove hardcoded data and options
const BarChart = ({ data, options }) => <Bar data={data} options={options} />;

export default BarChart;
