import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Filter, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
interface ComparisonItem {
  id: string;
  name: string;
  realized: number;
  budget: number;
  previousPeriod?: number;
  category: 'receitas' | 'despesas' | 'margem';
  format: 'currency' | 'percentage';
}
const rawComparisonData: ComparisonItem[] = [{
  id: 'receita-liquida',
  name: "Receita Líquida",
  realized: 12750000,
  budget: 12325000,
  previousPeriod: 11900000,
  category: 'receitas',
  format: 'currency'
}, {
  id: 'lucro-bruto',
  name: "Lucro Bruto",
  realized: 5100000,
  budget: 4930000,
  previousPeriod: 4780000,
  category: 'receitas',
  format: 'currency'
}, {
  id: 'ebitda',
  name: "EBITDA",
  realized: 3060000,
  budget: 2958000,
  previousPeriod: 2820000,
  category: 'receitas',
  format: 'currency'
}, {
  id: 'lucro-liquido',
  name: "Lucro Líquido",
  realized: 2678000,
  budget: 2588000,
  previousPeriod: 2450000,
  category: 'receitas',
  format: 'currency'
}, {
  id: 'despesas-operacionais',
  name: "Despesas Operacionais",
  realized: 2040000,
  budget: 1972000,
  previousPeriod: 1950000,
  category: 'despesas',
  format: 'currency'
}, {
  id: 'margem-ebitda',
  name: "Margem EBITDA",
  realized: 0.24,
  budget: 0.21,
  previousPeriod: 0.22,
  category: 'margem',
  format: 'percentage'
}];
type ComparisonType = 'vs-orcado' | 'vs-anterior';
type AnalysisType = 'valores-absolutos' | 'percentuais';
type MetricFilter = 'todos' | 'receitas' | 'despesas' | 'margem';
const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(2)}M`;
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};
const formatValue = (value: number, format: 'currency' | 'percentage'): string => {
  return format === 'currency' ? formatCurrency(value) : formatPercentage(value);
};
const calculateVariance = (realized: number, comparison: number): number => {
  if (comparison === 0) return 0;
  return (realized - comparison) / Math.abs(comparison) * 100;
};
export const ComparativeAnalysis = () => {
  const [comparisonType, setComparisonType] = useState<ComparisonType>('vs-orcado');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('valores-absolutos');
  const [metricFilter, setMetricFilter] = useState<MetricFilter>('todos');
  const filteredData = useMemo(() => {
    let data = rawComparisonData;
    if (metricFilter !== 'todos') {
      data = data.filter(item => item.category === metricFilter);
    }
    return data;
  }, [metricFilter]);
  const processedData = useMemo(() => {
    return filteredData.map(item => {
      const comparisonValue = comparisonType === 'vs-orcado' ? item.budget : item.previousPeriod || item.budget;
      const variance = calculateVariance(item.realized, comparisonValue);
      return {
        ...item,
        comparisonValue,
        variance,
        isPositive: item.category === 'despesas' ? variance < 0 : variance > 0
      };
    });
  }, [filteredData, comparisonType]);
  const getVarianceDisplay = (variance: number, isPositive: boolean) => {
    const sign = variance > 0 ? '+' : '';
    const color = isPositive ? 'text-success' : 'text-destructive';
    const icon = isPositive ? TrendingUp : TrendingDown;
    const IconComponent = icon;
    return <div className={cn("flex items-center gap-1.5", color)}>
        <IconComponent className="h-3.5 w-3.5" />
        <span className="font-semibold">{sign}{variance.toFixed(1)}%</span>
      </div>;
  };
  return <Card className="p-4 sm:p-6 bg-dashboard-card border-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-chart-primary/10 border border-chart-primary/20">
            <BarChart3 className="h-5 w-5 text-chart-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Análise Comparativa</h3>
        </div>
        
      </div>

      {/* Filters Section */}
      <div className="mb-6 p-4 bg-muted/20 rounded-lg border border-border/50">
        <div className="flex items-center gap-2 text-sm text-foreground mb-4">
          <Filter className="h-4 w-4 text-primary" />
          <span className="font-medium">Filtros de Análise</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Comparação
            </label>
            <Select value={comparisonType} onValueChange={(value: ComparisonType) => setComparisonType(value)}>
              <SelectTrigger className="h-10 bg-background/60 border-border/60 hover:border-border transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vs-orcado">vs Orçado</SelectItem>
                <SelectItem value="vs-anterior">vs Período Anterior</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Tipo de Análise
            </label>
            <Select value={analysisType} onValueChange={(value: AnalysisType) => setAnalysisType(value)}>
              <SelectTrigger className="h-10 bg-background/60 border-border/60 hover:border-border transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valores-absolutos">Valores Absolutos</SelectItem>
                <SelectItem value="percentuais">Percentuais</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Métricas
            </label>
            <Select value={metricFilter} onValueChange={(value: MetricFilter) => setMetricFilter(value)}>
              <SelectTrigger className="h-10 bg-background/60 border-border/60 hover:border-border transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="receitas">Receitas</SelectItem>
                <SelectItem value="despesas">Despesas</SelectItem>
                <SelectItem value="margem">Margens</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {processedData.map((item, index) => <div key={item.id} className="p-4 rounded-lg bg-accent/10 border border-border/40 hover:border-primary/30 transition-all duration-200 group" style={{
        animationDelay: `${index * 0.05}s`,
        animation: `fadeInUp 0.4s ease-out forwards`
      }}>
            {/* Metric Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>
              <div className="flex-shrink-0">
                {getVarianceDisplay(item.variance, item.isPositive)}
              </div>
            </div>
            
            {/* Values Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Realizado</span>
                <p className="text-base sm:text-lg font-bold text-foreground">
                  {formatValue(item.realized, item.format)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {comparisonType === 'vs-orcado' ? 'Orçado' : 'Período Anterior'}
                </span>
                <p className="text-base sm:text-lg font-bold text-muted-foreground">
                  {formatValue(item.comparisonValue, item.format)}
                </p>
              </div>
            </div>

            {/* Additional Info for Analysis Type */}
            {analysisType === 'percentuais' && <div className="mt-3 pt-3 border-t border-border/30">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Representatividade:</span>
                  <span className="font-medium text-foreground">
                    {item.format === 'currency' ? `${(item.realized / rawComparisonData[0].realized * 100).toFixed(1)}% da Receita` : 'Margem Operacional'}
                  </span>
                </div>
              </div>}
          </div>)}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-success/5 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Performance Geral</p>
            <p className="text-xs text-muted-foreground">
              {processedData.filter(item => item.isPositive).length} de {processedData.length} métricas positivas
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-success">
              {(processedData.filter(item => item.isPositive).length / processedData.length * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">Taxa de sucesso</p>
          </div>
        </div>
      </div>
    </Card>;
};