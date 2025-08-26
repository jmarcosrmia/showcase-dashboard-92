import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  type?: "card" | "chart" | "table";
}

export const LoadingState = ({ className, type = "card" }: LoadingStateProps) => {
  if (type === "chart") {
    return (
      <Card className={cn("p-6 bg-dashboard-card border-border", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-40 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (type === "table") {
    return (
      <Card className={cn("p-6 bg-dashboard-card border-border", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6 bg-dashboard-card border-border animate-pulse", className)}>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="h-8 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-1/4"></div>
      </div>
    </Card>
  );
};