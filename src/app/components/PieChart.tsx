import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  Title
} from 'chart.js';

interface PieChartProps {
  data: ChartData<'pie'>;
}

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  return (
    <div className='mb-10 flex justify-center' style={{ height: '400px' }}>
      <Pie
        data={data}
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Gráfico de Empleados mas Solicitados',
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
