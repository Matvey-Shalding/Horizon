import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { BLUE_SHADES } from 'constants/colors';
import { useMemo } from 'react';
import clsx from 'clsx';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: number[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return {
      datasets: [
        {
          data,
          backgroundColor: BLUE_SHADES,
          borderWidth: 0,
        },
      ],
    };
  },[data])

  return (
    <div className={clsx(
      'flex items-center justify-center',
      'h-25 w-25',
      'min-[450px]:h-30 min-[450px]:w-30'
    )}
>
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            tooltip: {
              enabled: true,
              callbacks: {
                label: (tooltipItem) => `Value: ${tooltipItem.raw}`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
