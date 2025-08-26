import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { GitCompare, TrendingUp, TrendingDown, Calendar, Target, DollarSign } from "lucide-react";
import { useData } from "@/contexts/DataContext";
export const DREComparison = () => {
  const {
    data
  } = useData();
  const [comparisonType, setComparisonType] = useState<"period" | "budget" | "forecast">("period");

  // Dados simulados para comparação
  const comparisonData = [{
    account: "Receita Líquida",
    current: 12750000,
    previous: 11800000,
    budget: 12500000,
    forecast: 13200000,
    variance: 8.1
  }, {
    account: "CMV",
    current: -7650000,
    previous: -7200000,
    budget: -7500000,
    forecast: -7800000,
    variance: -6.3
  }, {
    account: "Lucro Bruto",
    current: 5100000,
    previous: 4600000,
    budget: 5000000,
    forecast: 5400000,
    variance: 10.9
  }, {
    account: "Despesas Operacionais",
    current: -2040000,
    previous: -1950000,
    budget: -2000000,
    forecast: -2100000,
    variance: -4.6
  }, {
    account: "EBITDA",
    current: 3060000,
    previous: 2650000,
    budget: 3000000,
    forecast: 3300000,
    variance: 15.5
  }, {
    account: "Lucro Líquido",
    current: 2295000,
    previous: 1987500,
    budget: 2250000,
    forecast: 2475000,
    variance: 15.5
  }];
  const monthlyTrend = [{
    month: "Jul",
    receita: 11200,
    lucro: 1890,
    ebitda: 2520
  }, {
    month: "Ago",
    receita: 11500,
    lucro: 2100,
    ebitda: 2650
  }, {
    month: "Set",
    receita: 11800,
    lucro: 1988,
    ebitda: 2650
  }, {
    month: "Out",
    receita: 12100,
    lucro: 2150,
    ebitda: 2850
  }, {
    month: "Nov",
    receita: 11800,
    lucro: 2200,
    ebitda: 2950
  }, {
    month: "Dez",
    receita: 12750,
    lucro: 2295,
    ebitda: 3060
  }];
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };
  const getVarianceColor = (variance: number) => {
    if (variance > 5) return "text-green-600";
    if (variance > 0) return "text-green-500";
    if (variance > -5) return "text-orange-500";
    return "text-red-500";
  };
  const getComparisonValue = (item: any) => {
    switch (comparisonType) {
      case "budget":
        return item.budget;
      case "forecast":
        return item.forecast;
      default:
        return item.previous;
    }
  };
  const getComparisonLabel = () => {
    switch (comparisonType) {
      case "budget":
        return "Orçado";
      case "forecast":
        return "Projeção";
      default:
        return "Período Anterior";
    }
  };
  return <div className="space-y-6">
      {/* Análise Comparativa */}
      <Card className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-primary" />
            Análise Comparativa
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Comparação detalhada de indicadores financeiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={comparisonType} onValueChange={value => setComparisonType(value as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="period" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                vs Período
              </TabsTrigger>
              <TabsTrigger value="budget" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                vs Orçado
              </TabsTrigger>
              <TabsTrigger value="forecast" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                vs Projeção
              </TabsTrigger>
            </TabsList>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Conta</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground">Atual</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground">{getComparisonLabel()}</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground">Variação</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground">%</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => {
                  const compValue = getComparisonValue(item);
                  const variance = (item.current - compValue) / Math.abs(compValue) * 100;
                  const absolute = item.current - compValue;
                  return <tr key={index} className="border-b border-border/20 hover:bg-accent/10">
                        <td className="py-3 text-sm font-medium">{item.account}</td>
                        <td className="py-3 text-right font-mono text-sm">
                          {formatCurrency(item.current)}
                        </td>
                        <td className="py-3 text-right font-mono text-sm text-muted-foreground">
                          {formatCurrency(compValue)}
                        </td>
                        <td className="py-3 text-right font-mono text-sm">
                          <span className={getVarianceColor(variance)}>
                            {formatCurrency(absolute)}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Badge variant={variance > 0 ? "default" : "destructive"} className="text-xs">
                            {formatPercent(variance)}
                          </Badge>
                        </td>
                      </tr>;
                })}
                </tbody>
              </table>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Evolução Mensal */}
      <Card className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
        
        
      </Card>
    </div>;
};