import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartData } from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  data: any[];
  nameKey: string;
  valueKey: string;
}

const PieChart = ({ data, nameKey, valueKey }: PieChartProps) => {
  const chartData: ChartData<'pie'> = {
    labels: data.map(item => item[nameKey]),
    datasets: [
      {
        data: data.map(item => item[valueKey]),
        backgroundColor: data.map((_, index) => getColor(index, 0.8)),
        borderColor: data.map((_, index) => getColor(index)),
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-64">
      <Pie data={chartData} options={options} />
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

export default PieChart; 