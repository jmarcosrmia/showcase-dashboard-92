import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar, Target } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";

interface YTDMetric {
  label: string;
  currentValue: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

export const YTDSummary = () => {
  const { data, filters } = useData();

  const parseValue = (value: string) => {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  };

  const formatCurrency = (value: number) => {
    const decimals = parseInt(filters.precisao) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: filters.moeda,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  // Calculate YTD values (mock data based on current month values)
  const currentReceita = parseValue(data.receita.value) * 12; // Simulate YTD
  const currentEbitda = parseValue(data.ebitda.value) * 12;
  const currentLucro = currentEbitda * 0.75;

  const previousReceita = currentReceita * 0.92; // -8% vs previous year
  const previousEbitda = currentEbitda * 0.88;   // -12% vs previous year
  const previousLucro = currentLucro * 0.83;     // -17% vs previous year

  const ytdMetrics: YTDMetric[] = [
    {
      label: "Receita Acumulada",
      currentValue: currentReceita,
      previousValue: previousReceita,
      change: ((currentReceita - previousReceita) / previousReceita) * 100,
      trend: currentReceita >= previousReceita ? 'up' : 'down',
      icon: TrendingUp,
      color: "text-chart-tertiary"
    },
    {
      label: "EBITDA Acumulado",
      currentValue: currentEbitda,
      previousValue: previousEbitda,
      change: ((currentEbitda - previousEbitda) / previousEbitda) * 100,
      trend: currentEbitda >= previousEbitda ? 'up' : 'down',
      icon: Target,
      color: "text-chart-primary"
    },
    {
      label: "Lucro Acumulado",
      currentValue: currentLucro,
      previousValue: previousLucro,
      change: ((currentLucro - previousLucro) / previousLucro) * 100,
      trend: currentLucro >= previousLucro ? 'up' : 'down',
      icon: TrendingUp,
      color: "text-chart-secondary"
    }
  ];

  return (
    <Card className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Resumo YTD (Acumulado no Ano)
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Janeiro a {filters.periodo.replace('-', ' ')} vs mesmo período ano anterior
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            2024 vs 2023
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {ytdMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          
          return (
            <div 
              key={index}
              className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/30 hover:bg-background/50 transition-colors gap-3 min-w-0 overflow-hidden"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg bg-background/50 border border-border/50 shrink-0",
                  metric.color
                )}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-foreground truncate" title={metric.label}>
                    {metric.label}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground shrink-0">
                      2023: {formatCurrency(metric.previousValue)}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">•</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      2024: {formatCurrency(metric.currentValue)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right shrink-0 min-w-0">
                <p className="text-lg font-bold text-foreground truncate" title={formatCurrency(metric.currentValue)}>
                  {formatCurrency(metric.currentValue)}
                </p>
                
                <div className="flex items-center justify-end gap-1 mt-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    metric.trend === 'up' ? "text-success" : "text-destructive"
                  )}>
                    {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="pt-3 border-t border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Margem EBITDA YTD:</span>
            <div className="flex items-center gap-2">
              <span>{((currentEbitda / currentReceita) * 100).toFixed(1)}%</span>
              <Badge variant={currentEbitda / currentReceita > previousEbitda / previousReceita ? "default" : "destructive"} className="text-xs">
                {((currentEbitda / currentReceita) - (previousEbitda / previousReceita) > 0 ? '+' : '')}{(((currentEbitda / currentReceita) - (previousEbitda / previousReceita)) * 100).toFixed(1)}pp
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span>Margem Líquida YTD:</span>
            <div className="flex items-center gap-2">
              <span>{((currentLucro / currentReceita) * 100).toFixed(1)}%</span>
              <Badge variant={currentLucro / currentReceita > previousLucro / previousReceita ? "default" : "destructive"} className="text-xs">
                {((currentLucro / currentReceita) - (previousLucro / previousReceita) > 0 ? '+' : '')}{(((currentLucro / currentReceita) - (previousLucro / previousReceita)) * 100).toFixed(1)}pp
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};