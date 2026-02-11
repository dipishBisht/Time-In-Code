import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboard";
import { Check, Share2 } from "lucide-react";

export default function Header() {
  const { data, copied, setCopied } = useDashboardStore();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Coding Dashboard</h1>
        <p className="text-muted-foreground">
          {data?.userName || data?.userId}
        </p>
      </div>

      <Button variant="outline" onClick={handleShare} className="gap-2">
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {copied ? "Copied" : "Share"}
      </Button>
    </div>
  );
}
