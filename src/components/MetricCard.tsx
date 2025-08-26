import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Info, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  onClick?: () => void;
}

export const MetricCard = ({ title, value, change, trend, onClick }: MetricCardProps) => {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  const getTrendBg = () => {
    if (trend === "up") return "bg-success/10 border-success/20";
    if (trend === "down") return "bg-destructive/10 border-destructive/20";
    return "bg-muted/10 border-border";
  };

  // Detalhes adicionais por tipo de métrica
  const getAdditionalInfo = () => {
    if (title === "RECEITA") {
      return {
        subtitle: "Receita Líquida",
        description: "Comparado ao mês anterior",
        period: "vs Nov 2024"
      };
    }
    if (title === "LUCRO") {
      return {
        subtitle: "Lucro Bruto",
        description: "Margem de 40%",
        period: "vs Meta 38%"
      };
    }
    if (title === "EBITDA") {
      return {
        subtitle: "EBITDA Ajustado",
        description: "Margem de 24%",
        period: "vs Orçado 21%"
      };
    }
    if (title === "MARGEM") {
      return {
        subtitle: "Margem Operacional",
        description: "Estável no período",
        period: "Dentro da meta"
      };
    }
    return null;
  };

  const additionalInfo = getAdditionalInfo();

  return (
    <Card className="p-4 sm:p-6 bg-dashboard-card border-border hover:border-primary/30 transition-all duration-200 overflow-hidden">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wide truncate">
              {title}
            </p>
            {additionalInfo && (
              <p className="text-xs text-muted-foreground/80 mt-1 truncate">
                {additionalInfo.subtitle}
              </p>
            )}
          </div>
          {onClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClick}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 group shrink-0"
              title="Ver detalhes"
            >
              <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
            </Button>
          )}
        </div>
        
        <div className="space-y-2 min-w-0">
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight break-words" title={value}>
            {value}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
            {change && (
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium w-fit shrink-0",
                getTrendBg(),
                getTrendColor()
              )}>
                {getTrendIcon()}
                <span className="whitespace-nowrap">{change}</span>
              </div>
            )}
            
            {additionalInfo && (
              <div className="text-left sm:text-right min-w-0 overflow-hidden">
                <p className="text-xs text-muted-foreground truncate" title={additionalInfo.description}>
                  {additionalInfo.description}
                </p>
                <p className="text-xs text-primary font-medium truncate" title={additionalInfo.period}>
                  {additionalInfo.period}
                </p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </Card>
  );
};