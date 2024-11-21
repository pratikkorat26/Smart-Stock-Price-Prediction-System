import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartContainerProps {
  title: string;
  data: any[];
  dataKey: string;
  lineColor: string;
  isLogScale?: boolean;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, data, dataKey, lineColor, isLogScale }) => {
  return (
    <Box mb={6}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis scale={isLogScale ? 'log' : 'auto'} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={lineColor} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ChartContainer;