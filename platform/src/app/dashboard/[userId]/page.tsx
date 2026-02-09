'use client';
import { motion } from "motion/react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Clock, Calendar, TrendingUp, Share2, Check } from "lucide-react";

const last30Days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 29 + i);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    hours: +(Math.random() * 6 + 1).toFixed(1),
  };
});

const languages = [
  { name: "TypeScript", seconds: 54000, color: "hsl(239 84% 67%)" },
  { name: "Python", seconds: 32000, color: "hsl(263 70% 76%)" },
  { name: "CSS", seconds: 18000, color: "hsl(200 70% 60%)" },
  { name: "Go", seconds: 12000, color: "hsl(160 60% 50%)" },
  { name: "Rust", seconds: 8000, color: "hsl(20 80% 55%)" },
];

const totalSeconds = languages.reduce((a, b) => a + b.seconds, 0);
const recentActivity = last30Days.slice(-7).reverse();

export default function Dashboard() {
  const { userId } = useParams();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-10 min-h-screen flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Coding Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {userId === "demo" ? "Demo User" : `User: ${userId}`}
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleShare}>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            {copied ? "Link Copied!" : "Share Stats"}
          </Button>
        </div>

        {/* Stats overview */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Clock,
              label: "Total Hours",
              value: Math.floor(totalSeconds / 3600).toString(),
            },
            { icon: Calendar, label: "Days Tracked", value: "30" },
            {
              icon: TrendingUp,
              label: "Avg Hours/Day",
              value: (totalSeconds / 3600 / 30).toFixed(1),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border bg-card p-6 card-elevated"
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Line chart */}
          <div className="rounded-xl border bg-card p-6 card-elevated">
            <h3 className="font-semibold mb-1">Daily Activity</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Hours coded over the last 30 days
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={last30Days}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid hsl(220 13% 91%)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(239 84% 67%)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="rounded-xl border bg-card p-6 card-elevated">
            <h3 className="font-semibold mb-1">Language Breakdown</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Top languages by coding time
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={languages}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    dataKey="seconds"
                    strokeWidth={2}
                    stroke="hsl(0 0% 100%)"
                  >
                    {languages.map((l) => (
                      <Cell key={l.name} fill={l.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {languages.map((l) => (
                  <div key={l.name} className="flex items-center gap-3 text-sm">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: l.color }}
                    />
                    <span className="flex-1">{l.name}</span>
                    <span className="text-muted-foreground">
                      {Math.round((l.seconds / totalSeconds) * 100)}%
                    </span>
                    <span className="font-medium">
                      {(l.seconds / 3600).toFixed(1)}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity table */}
        <div className="rounded-xl border bg-card overflow-hidden card-elevated">
          <div className="p-6 border-b">
            <h3 className="font-semibold">Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Total Time
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Top Language
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((day, i) => {
                  const activity = 2;
                  return (
                    <tr key={i} className="border-t">
                      <td className="px-6 py-3">{day.date}</td>
                      <td className="px-6 py-3 font-medium">{day.hours}h</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
                          {languages[activity].name}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
