import { LucideIcon } from "lucide-react";

interface IStat {
  icon: LucideIcon;
  label: string;
  value: number | undefined;
}

export default function Stat({ icon: Icon, label, value }: IStat) {
  return (
    <div className="rounded-xl border bg-card p-6 card-elevated">
      <div className="flex gap-2 mb-2 items-center">
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
