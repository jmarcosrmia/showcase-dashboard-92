import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { useData } from "@/contexts/DataContext";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EvolutionData {
  month: string;
  receitaLiquida: number;
  ebitda: number;
  lucroLiquido: number;
}

export const EvolutionChart = () => {
  const { data, filters } = useData();
  const [visibleSeries, setVisibleSeries] = useState({
    receitaLiquida: true,
    ebitda: true,
    lucroLiquido: true,
  });

  const parseValue = (value: string) => {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  };

  // Generate mock evolution data based on current filters
  const generateEvolutionData = (): EvolutionData[] => {
    const baseReceita = parseValue(data.receita.value);
    const baseEbitda = parseValue(data.ebitda.value);
    const baseLucro = baseEbitda * 0.75;

    const months = [
      'Jan 2024', 'Fev 2024', 'Mar 2024', 'Abr 2024', 
      'Mai 2024', 'Jun 2024', 'Jul 2024', 'Ago 2024',
      'Set 2024', 'Out 2024', 'Nov 2024', 'Dez 2024'
    ];

    return months.map((month, index) => {
      const variation = 0.8 + (Math.random() * 0.4); // 80% to 120% variation
      const seasonality = 1 + Math.sin(index * Math.PI / 6) * 0.1; // Seasonal effect
      
      return {
        month,
        receitaLiquida: baseReceita * variation * seasonality,
        ebitda: baseEbitda * variation * seasonality,
        lucroLiquido: baseLucro * variation * seasonality,
      };
    });
  };

  const evolutionData = generateEvolutionData();

  const chartConfig = {
    receitaLiquida: {
      label: "Receita Líquida",
      color: "hsl(var(--chart-tertiary))",
    },
    ebitda: {
      label: "EBITDA",
      color: "hsl(var(--chart-primary))",
    },
    lucroLiquido: {
      label: "Lucro Líquido",
      color: "hsl(var(--chart-secondary))",
    },
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

  const toggleSeries = (seriesKey: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({
      ...prev,
      [seriesKey]: !prev[seriesKey]
    }));
  };

  return (
    <Card className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Evolução Mensal
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Receita, EBITDA e Lucro - {filters.periodoInicial} a {filters.periodoFinal}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(chartConfig).map(([key, config]) => (
            <Button 
              key={key}
              variant="outline" 
              size="sm"
              onClick={() => toggleSeries(key as keyof typeof visibleSeries)}
              className="h-7 px-2 text-xs bg-background/50 border-border/60 hover:bg-accent/50"
            >
              {visibleSeries[key as keyof typeof visibleSeries] ? (
                <Eye className="h-3 w-3 mr-1" />
              ) : (
                <EyeOff className="h-3 w-3 mr-1" />
              )}
              {config.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(visibleSeries).map(([key, visible]) => (
            <Badge 
              key={key}
              variant={visible ? "default" : "outline"}
              className="text-xs"
              style={{ 
                backgroundColor: visible ? chartConfig[key as keyof typeof chartConfig].color : 'transparent',
                borderColor: chartConfig[key as keyof typeof chartConfig].color 
              }}
            >
              {chartConfig[key as keyof typeof chartConfig].label}
            </Badge>
          ))}
        </div>

        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value: any, name: any) => [
                    formatCurrency(parseFloat(value)),
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              
              {visibleSeries.receitaLiquida && (
                <Line 
                  type="monotone" 
                  dataKey="receitaLiquida" 
                  stroke={chartConfig.receitaLiquida.color}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.receitaLiquida.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartConfig.receitaLiquida.color, strokeWidth: 2 }}
                />
              )}
              
              {visibleSeries.ebitda && (
                <Line 
                  type="monotone" 
                  dataKey="ebitda" 
                  stroke={chartConfig.ebitda.color}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.ebitda.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartConfig.ebitda.color, strokeWidth: 2 }}
                />
              )}
              
              {visibleSeries.lucroLiquido && (
                <Line 
                  type="monotone" 
                  dataKey="lucroLiquido" 
                  stroke={chartConfig.lucroLiquido.color}
                  strokeWidth={2}
                  dot={{ fill: chartConfig.lucroLiquido.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartConfig.lucroLiquido.color, strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};