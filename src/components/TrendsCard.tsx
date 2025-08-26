import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendItem {
  name: string;
  change: string;
  trend: "up" | "down";
}

interface TrendsCardProps {
  title: string;
  items: TrendItem[];
}

export const TrendsCard = ({ title, items }: TrendsCardProps) => {
  return (
    <Card className="group p-6 bg-dashboard-card border-border hover-lift animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow"></div>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={cn(
              "group/item flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:shadow-sm border",
              "bg-accent/20 hover:bg-accent/30 border-transparent hover:border-border/50",
              "animate-slide-up"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 group-hover/item:scale-125",
                item.trend === "up" ? "bg-success shadow-success/50" : "bg-destructive shadow-destructive/50"
              )} />
              <span className="text-sm text-foreground font-medium group-hover/item:text-primary transition-colors">
                {item.name}
              </span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 border",
              item.trend === "up" 
                ? "text-success bg-success/10 border-success/20 group-hover/item:bg-success/20" 
                : "text-destructive bg-destructive/10 border-destructive/20 group-hover/item:bg-destructive/20"
            )}>
              {item.trend === "up" ? (
                <TrendingUp className="h-3 w-3 animate-bounce-subtle" />
              ) : (
                <TrendingDown className="h-3 w-3 animate-bounce-subtle" />
              )}
              <span>{item.change}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Atualizado automaticamente</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
            <span>Tempo real</span>
          </div>
        </div>
      </div>
    </Card>
  );
};