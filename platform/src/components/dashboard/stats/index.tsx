import Stat from "./Stat";
import { useDashboardStore } from "@/store/dashboard";
import { Calendar, Clock, TrendingUp } from "lucide-react";

export default function Stats() {
  const { data } = useDashboardStore();
  return (
    <div className="grid sm:grid-cols-3 gap-4 mb-8">
      <Stat
        icon={Clock}
        label="Total Hours"
        value={data?.overview.totalHours}
      />
      <Stat
        icon={Calendar}
        label="Days Tracked"
        value={data?.overview.totalDays}
      />
      <Stat
        icon={TrendingUp}
        label="Avg Hours/Day"
        value={data?.overview.averageHoursPerDay}
      />
    </div>
  );
}
