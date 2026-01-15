import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { ElementType } from '@/lib/types';

interface FiveElementsChartProps {
  data: Record<ElementType, number>;
}

export default function FiveElementsChart({ data }: FiveElementsChartProps) {
  const chartData = [
    { subject: '木 (Wood)', A: data.wood, fullMark: 100 },
    { subject: '火 (Fire)', A: data.fire, fullMark: 100 },
    { subject: '土 (Earth)', A: data.earth, fullMark: 100 },
    { subject: '金 (Metal)', A: data.metal, fullMark: 100 },
    { subject: '水 (Water)', A: data.water, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[200px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: 'serif' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Energy"
            dataKey="A"
            stroke="#FFD700"
            strokeWidth={2}
            fill="#FFD700"
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#FFD700', fontSize: '12px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
