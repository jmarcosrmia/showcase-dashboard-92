import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useData } from "@/contexts/DataContext";
import { TrendingUp } from "lucide-react";

export const LucroFormationChart = () => {
  const { data, filters } = useData();

  // Dados simulados para formação do lucro ao longo do período
  const formationData = [
    {
      periodo: "14/01",
      valor: 1250000,
      label: "R$ 1,25M"
    },
    {
      periodo: "15/01", 
      valor: 980000,
      label: "R$ 980k"
    },
    {
      periodo: "16/01",
      valor: 1850000,
      label: "R$ 1,85M"
    },
    {
      periodo: "17/01",
      valor: 650000,
      label: "R$ 650k"
    },
    {
      periodo: "18/01",
      valor: 1150000,
      label: "R$ 1,15M"
    }
  ];

  const chartConfig = {
    valor: {
      label: "Lucro Líquido",
      color: "hsl(var(--primary))",
    },
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = Math.max(...formationData.map(d => d.valor));
  const yAxisMax = Math.ceil(maxValue * 1.2 / 100000) * 100000;

  return (
    <Card className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Formação do Lucro Líquido
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Desempenho do lucro ao longo do período
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={formationData} 
              margin={{ top: 30, right: 20, bottom: 20, left: 60 }}
              barCategoryGap="25%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="periodo" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: 'hsl(var(--muted-foreground))',
                  fontWeight: '500'
                }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                domain={[0, yAxisMax]}
                tick={{ 
                  fontSize: 12, 
                  fill: 'hsl(var(--muted-foreground))',
                  fontWeight: '500'
                }}
                tickFormatter={formatCurrency}
                width={50}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-medium text-foreground">{`${label}`}</p>
                        <p className="text-sm text-primary font-semibold">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="valor" 
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};