import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PieChartCardProps {
  title: string;
  data: Array<{ name: string; value: number; color: string; percentage: string; amount: string }>;
  total: string;
  onViewDetails?: () => void;
}

export const PieChartCard = ({ title, data, total, onViewDetails }: PieChartCardProps) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dashboard-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.amount} ({data.percentage})
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1">
            {data.name === "Receita Bruta" ? "Base para cálculo de impostos" : 
             data.name === "Deduções" ? "Impostos e devoluções" :
             data.name === "Vendas" ? "Comissões e marketing" :
             "Gastos administrativos"}
          </p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setHoveredSegment(index);
  };

  const onPieLeave = () => {
    setHoveredSegment(null);
  };

  return (
    <Card className="p-4 sm:p-6 bg-dashboard-card border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-xl font-bold text-foreground">{total}</div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onViewDetails}
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            Ver detalhes →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Chart */}
        <div className="relative order-2 lg:order-1">
          <div className="h-48 sm:h-56 lg:h-64 relative w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={hoveredSegment === index ? "#ffffff" : "transparent"}
                      strokeWidth={hoveredSegment === index ? 2 : 0}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend - Only color indicators */}
        <div className="space-y-2 sm:space-y-3 order-1 lg:order-2">
          {data.map((item, index) => (
            <div 
              key={index} 
              className={cn(
                "p-2 sm:p-3 rounded-lg border transition-colors",
                hoveredSegment === index 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-accent/20 border-border/50"
              )}
              onMouseEnter={() => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{item.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};