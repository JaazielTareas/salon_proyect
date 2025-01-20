import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ChartData,
} from 'chart.js';

interface LineChartProps {
  data: ChartData<'line'>;
}

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <div className='mb-10 flex justify-center' style={{ height: '400px' }}>
      <Line
        data={data}
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Gráfico de Horas Más Solicitadas',
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
