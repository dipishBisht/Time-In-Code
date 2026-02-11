import { useDashboardStore } from "@/store/dashboard";

export default function Table() {
  const { data } = useDashboardStore();
  const recent = data?.recentActivity;

  return (
    <div className="rounded-xl border bg-card card-elevated">
      <div className="p-6 border-b font-semibold">Recent Activity</div>
      <table className="w-full text-sm">
        <thead className="bg-muted/30">
          <tr>
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-left">Time</th>
            <th className="px-6 py-3 text-left">Top Language</th>
          </tr>
        </thead>
        <tbody>
          {recent?.map((d) => (
            <tr key={d.date} className="border-t">
              <td className="px-6 py-3">{d.date}</td>
              <td className="px-6 py-3">{d.formattedTime}</td>
              <td className="px-6 py-3">{d.topLanguage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
