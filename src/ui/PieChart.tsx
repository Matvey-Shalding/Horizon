import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: number[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const backgroundColors = ['#007BFF', '#66B2FF', '#99CCFF', '#CCE5FF', '#E6F2FF']; // Blue shades

  const chartData = {
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex h-25 w-25 items-center justify-center min-[450px]:h-30 min-[450px]:w-30">
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%', // Creates a ring effect
          plugins: {
            tooltip: {
              enabled: true, // Ensure tooltips are enabled
              callbacks: {
                label: (tooltipItem) => {
                  // Customize the tooltip to show only the data value, without the label
                  return `Value: ${tooltipItem.raw}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
