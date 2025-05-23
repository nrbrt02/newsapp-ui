import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartData } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: any[];
  xAxis: string;
  yAxis: string;
  series: string[];
}

const LineChart = ({ data, xAxis, yAxis, series }: LineChartProps) => {
  const chartData: ChartData<'line'> = {
    labels: data.map(item => item[xAxis]),
    datasets: series.map((s, index) => ({
      label: s.charAt(0).toUpperCase() + s.slice(1),
      data: data.map(item => item[s]),
      borderColor: getColor(index),
      backgroundColor: getColor(index, 0.1),
      tension: 0.4,
      fill: true
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="w-full h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

// Helper function to generate colors
const getColor = (index: number, alpha = 1) => {
  const colors = [
    `rgba(59, 130, 246, ${alpha})`, // blue
    `rgba(16, 185, 129, ${alpha})`, // green
    `rgba(245, 158, 11, ${alpha})`, // yellow
    `rgba(239, 68, 68, ${alpha})`, // red
    `rgba(139, 92, 246, ${alpha})`, // purple
    `rgba(14, 165, 233, ${alpha})`, // sky
    `rgba(236, 72, 153, ${alpha})`, // pink
    `rgba(234, 179, 8, ${alpha})` // amber
  ];
  return colors[index % colors.length];
};

export default LineChart; 