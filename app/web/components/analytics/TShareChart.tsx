'use client';

import * as React from 'react';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ChartWrapper } from '../ui/chart';
import { HistoryEntry } from '@/lib/api';

interface TShareChartProps {
  data: HistoryEntry[];
}

export function TShareChart({ data }: TShareChartProps) {
  const chartData = React.useMemo(() => {
    return data.map((entry) => ({
      ...entry,
      price: parseFloat(entry.shareRate) / 10000,
      label: `Day ${entry.day}`,
    }));
  }, [data]);

  return (
    <div className="space-y-4">
      <ChartWrapper height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="label" 
            stroke="#71717a" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#71717a" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#10b981' }}
          />
        </LineChart>
      </ChartWrapper>
    </div>
  );
}
