import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./Card";
import { useDashboardStore } from "@/store/dashboard";

export default function Charts() {
  const { data } = useDashboardStore();

  const trend = data?.charts.dailyTrend;
  const languages = data?.charts.languageBreakdown;

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <Card title="Daily Activity">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              dataKey="hours"
              stroke="hsl(239 84% 67%)"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Language Breakdown">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={languages}
              dataKey="seconds"
              innerRadius={50}
              outerRadius={85}
            >
              {languages?.map((_, i: number) => (
                <Cell key={i} fill={`hsl(${(i * 60) % 360} 70% 60%)`} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-2 mt-4">
          {languages?.map((l) => (
            <div key={l.language} className="flex justify-between text-sm">
              <span>{l.language}</span>
              <span>
                {l.hours}h ({l.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
