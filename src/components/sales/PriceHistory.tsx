import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface PricePoint {
  date: string;
  price: number;
}

interface PriceHistoryProps {
  data: PricePoint[];
  currentPrice: number;
}

export function PriceHistory({ data, currentPrice }: PriceHistoryProps) {
  const formattedData = data.map(point => ({
    ...point,
    formattedDate: formatDistanceToNow(new Date(point.date), { addSuffix: true })
  }));

  const lowestPrice = Math.min(...data.map(point => point.price));
  const highestPrice = Math.max(...data.map(point => point.price));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Price History</span>
          <div className="text-sm font-normal">
            <span className="text-muted-foreground">Current: </span>
            <span className="font-medium">${currentPrice}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <XAxis 
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                domain={[lowestPrice * 0.9, highestPrice * 1.1]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}