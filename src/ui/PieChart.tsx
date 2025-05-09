import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: number[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const backgroundColors = [
    "#007BFF",
    "#66B2FF",
    "#99CCFF",
    "#CCE5FF",
    "#E6F2FF",
  ]; // Blue shades

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
    <div className="flex h-[120px] w-[120px] items-center justify-center">
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%", // Creates a ring effect
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
