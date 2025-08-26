import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Lightbulb, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";
interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'alert' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  icon: React.ElementType;
  value?: string;
}
const insights: Insight[] = [{
  id: '1',
  type: 'positive',
  title: 'Margem EBITDA Excepcional',
  description: 'EBITDA de 24% está 6 pontos acima da média do setor',
  impact: 'high',
  category: 'Rentabilidade',
  icon: TrendingUp,
  value: '+6pp vs setor'
}, {
  id: '2',
  type: 'opportunity',
  title: 'Otimização de CMV',
  description: 'Identificada oportunidade de redução de 2.5% nos custos de matéria-prima',
  impact: 'medium',
  category: 'Custos',
  icon: Target,
  value: 'R$ 191k economia'
}, {
  id: '3',
  type: 'alert',
  title: 'Concentração em Produtos A',
  description: 'Alta dependência (45%) em uma única linha de produtos',
  impact: 'medium',
  category: 'Risco',
  icon: AlertTriangle,
  value: '45% concentração'
}, {
  id: '4',
  type: 'positive',
  title: 'Crescimento Sustentável',
  description: 'Receitas crescendo 8.2% com manutenção das margens',
  impact: 'high',
  category: 'Crescimento',
  icon: BarChart3,
  value: '+8.2% YoY'
}, {
  id: '5',
  type: 'opportunity',
  title: 'Eficiência Administrativa',
  description: 'Despesas administrativas podem ser otimizadas em 1.2%',
  impact: 'low',
  category: 'Eficiência',
  icon: Users,
  value: 'R$ 24k economia'
}];
export const AutoInsights = () => {
  const getInsightColors = (type: string, impact: string) => {
    const colors = {
      positive: {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        icon: 'text-green-600 dark:text-green-400',
        badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      },
      negative: {
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-200 dark:border-red-800',
        icon: 'text-red-600 dark:text-red-400',
        badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      },
      alert: {
        bg: 'bg-yellow-50 dark:bg-yellow-950/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        icon: 'text-yellow-600 dark:text-yellow-400',
        badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      },
      opportunity: {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
        icon: 'text-blue-600 dark:text-blue-400',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      }
    };
    return colors[type as keyof typeof colors] || colors.opportunity;
  };
  const getImpactLabel = (impact: string) => {
    const labels = {
      high: 'Alto Impacto',
      medium: 'Médio Impacto',
      low: 'Baixo Impacto'
    };
    return labels[impact as keyof typeof labels];
  };
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Insights Automatizados</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight) => {
            const colors = getInsightColors(insight.type, insight.impact);
            const Icon = insight.icon;
            
            return (
              <div
                key={insight.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                  colors.bg,
                  colors.border
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", colors.icon)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm text-foreground leading-tight">
                        {insight.title}
                      </h4>
                      {insight.value && (
                        <Badge variant="secondary" className={cn("text-xs", colors.badge)}>
                          {insight.value}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {getImpactLabel(insight.impact)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};