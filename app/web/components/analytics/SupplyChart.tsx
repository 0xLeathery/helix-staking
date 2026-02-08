'use client';

import * as React from 'react';
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartWrapper } from '../ui/chart';

interface SupplyChartProps {
  staked: number;
  liquid: number;
  unclaimed: number;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

export function SupplyChart({ staked, liquid, unclaimed }: SupplyChartProps) {
  const data = React.useMemo(() => [
    { name: 'Staked', value: staked },
    { name: 'Liquid', value: liquid },
    { name: 'Unclaimed Pool', value: unclaimed },
  ], [staked, liquid, unclaimed]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Supply Breakdown</h3>
      <ChartWrapper height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
          />
          <Legend />
        </PieChart>
      </ChartWrapper>
    </div>
  );
}
