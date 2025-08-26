import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Cell, ReferenceLine, LabelList } from "recharts";
import { useData } from "@/contexts/DataContext";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WaterfallData {
  name: string;
  value: number;
  cumulative: number;
  type: 'positive' | 'negative' | 'total';
  color: string;
}

export const WaterfallChart = () => {
  const { data, filters } = useData();

  const parseValue = (value: string) => {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  };

  const receitaValue = parseValue(data.receita.value);
  const lucroValue = parseValue(data.lucro.value);
  const ebitdaValue = parseValue(data.ebitda.value);
  
  // Calculate waterfall steps
  const receitaBruta = receitaValue * 1.18;
  const deducoes = receitaBruta - receitaValue;
  const cmv = receitaValue * 0.6;
  const despesasOp = lucroValue - ebitdaValue;
  const lucroLiquido = ebitdaValue * 0.75;

  const waterfallData: WaterfallData[] = [
    {
      name: "Receita Bruta",
      value: receitaBruta,
      cumulative: receitaBruta,
      type: 'positive',
      color: 'hsl(var(--chart-tertiary))'
    },
    {
      name: "Deduções",
      value: -deducoes,
      cumulative: receitaValue,
      type: 'negative',
      color: 'hsl(var(--chart-secondary))'
    },
    {
      name: "CMV",
      value: -cmv,
      cumulative: receitaValue - cmv,
      type: 'negative',
      color: 'hsl(var(--chart-secondary))'
    },
    {
      name: "Desp. Operacionais",
      value: -despesasOp,
      cumulative: lucroValue,
      type: 'negative',
      color: 'hsl(var(--chart-secondary))'
    },
    {
      name: "Lucro Líquido",
      value: lucroLiquido,
      cumulative: lucroLiquido,
      type: 'total',
      color: 'hsl(var(--chart-primary))'
    }
  ];

  const chartConfig = {
    value: {
      label: "Valor (R$)",
      color: "hsl(var(--chart-primary))",
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

  const CustomLabel = (props: any) => {
    const { x, y, width, value, index } = props;
    const data = waterfallData[index];
    
    return (
      <text 
        x={x + width / 2} 
        y={y - 8} 
        textAnchor="middle" 
        className="fill-foreground text-xs font-medium"
      >
        {formatCurrency(Math.abs(data.value))}
      </text>
    );
  };

  return (
    <Card className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Formação do Lucro Líquido
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Análise em cascata - {filters.periodo.replace('-', ' ')}
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 w-8 p-0 bg-background/50 border-border/60 hover:bg-accent/50"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={waterfallData} margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value: any, name: any, props: any) => [
                    formatCurrency(Math.abs(parseFloat(value))),
                    props.payload.type === 'negative' ? 'Redução' : 'Valor'
                  ]}
                />}
              />
              <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--chart-primary))"
                radius={[4, 4, 0, 0]}
              >
                {waterfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList content={CustomLabel} />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};