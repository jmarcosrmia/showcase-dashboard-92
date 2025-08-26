import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calculator,
  BarChart3,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  Users,
  FileText,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DREDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    id: string;
    name: string;
    value: number;
    level: number;
    trend?: 'up' | 'down' | 'neutral';
    change?: string;
    costCenter?: {
      vendas?: number;
      marketing?: number;
      administrativo?: number;
      financeiro?: number;
    };
    children?: any[];
  } | null;
}

export const DREDetailModal = ({ isOpen, onClose, account }: DREDetailModalProps) => {
  if (!account) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getAccountAnalysis = (accountId: string) => {
    const analyses = {
      'receitas': {
        description: 'Total das receitas operacionais da empresa no período',
        composition: [
          { item: 'Receita de Produtos A', value: account.value * 0.45, percentage: 45 },
          { item: 'Receita de Produtos B', value: account.value * 0.35, percentage: 35 },
          { item: 'Receita de Serviços', value: account.value * 0.15, percentage: 15 },
          { item: 'Outras Receitas', value: account.value * 0.05, percentage: 5 }
        ],
        insights: [
          'Crescimento consistente de 8.2% vs período anterior',
          'Mix de produtos equilibrado entre categorias A e B',
          'Sazonalidade normal para o período de dezembro',
          'Margem de crescimento sustentável identificada'
        ],
        actions: [
          'Manter estratégia de preços premium para produtos A',
          'Expandir linha de produtos categoria B',
          'Avaliar novos canais de distribuição',
          'Implementar programa de fidelização de clientes'
        ]
      },
      'deducoes': {
        description: 'Deduções sobre a receita bruta conforme legislação fiscal',
        composition: [
          { item: 'ICMS', value: account.value * 0.533, percentage: 53.3 },
          { item: 'PIS', value: account.value * 0.073, percentage: 7.3 },
          { item: 'COFINS', value: account.value * 0.338, percentage: 33.8 },
          { item: 'Outras Deduções', value: account.value * 0.056, percentage: 5.6 }
        ],
        insights: [
          'Carga tributária dentro da média do setor',
          'Possibilidade de otimização fiscal identificada',
          'Créditos de ICMS sendo utilizados adequadamente'
        ],
        actions: [
          'Revisar estratégia de créditos tributários',
          'Avaliar benefícios fiscais disponíveis',
          'Otimizar estrutura para redução de PIS/COFINS'
        ]
      },
      'receita-liquida': {
        description: 'Receita após dedução de todos os impostos e taxas',
        composition: [
          { item: 'Receita Bruta', value: account.value * 1.176, percentage: 117.6 },
          { item: 'ICMS', value: -account.value * 0.094, percentage: -9.4 },
          { item: 'PIS', value: -account.value * 0.013, percentage: -1.3 },
          { item: 'COFINS', value: -account.value * 0.059, percentage: -5.9 }
        ],
        insights: [
          'Margem líquida de 85% sobre receita bruta',
          'Eficiência tributária acima da média do setor',
          'Base sólida para operações rentáveis'
        ],
        actions: [
          'Manter disciplina na gestão tributária',
          'Monitorar mudanças na legislação fiscal',
          'Avaliar impacto de novos produtos na carga tributária'
        ]
      },
      'cmv': {
        description: 'Custo dos produtos e mercadorias vendidas no período',
        composition: [
          { item: 'Matéria-Prima', value: account.value * 0.65, percentage: 65 },
          { item: 'Mão de Obra Direta', value: account.value * 0.22, percentage: 22 },
          { item: 'Custos Indiretos', value: account.value * 0.08, percentage: 8 },
          { item: 'Depreciação Industrial', value: account.value * 0.05, percentage: 5 }
        ],
        insights: [
          'Custo representa 60% da receita líquida',
          'Oportunidade de redução em matéria-prima',
          'MOD bem controlada dentro do planejado',
          'Custos indiretos otimizados'
        ],
        actions: [
          'Negociar melhores condições com fornecedores',
          'Implementar programa de redução de desperdícios',
          'Avaliar automação para reduzir MOD',
          'Otimizar processo produtivo'
        ]
      },
      'lucro-bruto': {
        description: 'Resultado após dedução dos custos diretos de produção',
        composition: [
          { item: 'Receita Líquida', value: account.value * 2.5, percentage: 250 },
          { item: 'CMV - Matéria-Prima', value: -account.value * 0.98, percentage: -98 },
          { item: 'CMV - Mão de Obra', value: -account.value * 0.33, percentage: -33 },
          { item: 'CMV - Custos Indiretos', value: -account.value * 0.19, percentage: -19 }
        ],
        insights: [
          'Margem bruta de 40% acima da média do setor',
          'Eficiência operacional melhorou 2.3%',
          'Custos de matéria-prima sob controle',
          'Potencial para expansão identificado'
        ],
        actions: [
          'Manter foco na qualidade dos produtos',
          'Avaliar aumento de preços seletivo',
          'Implementar melhorias no processo produtivo',
          'Expandir produção de itens de maior margem'
        ]
      },
      'despesas-operacionais': {
        description: 'Despesas necessárias para operação e administração do negócio',
        composition: [
          { item: 'Despesas Comerciais', value: account.value * 0.52, percentage: 52 },
          { item: 'Despesas Administrativas', value: account.value * 0.31, percentage: 31 },
          { item: 'Despesas Gerais', value: account.value * 0.12, percentage: 12 },
          { item: 'Outras Despesas', value: account.value * 0.05, percentage: 5 }
        ],
        insights: [
          'Despesas representam 16% da receita líquida',
          'Área comercial com maior participação',
          'Controle eficiente de custos administrativos',
          'Oportunidades de otimização identificadas'
        ],
        actions: [
          'Revisar eficiência dos investimentos comerciais',
          'Implementar automação administrativa',
          'Renegociar contratos de fornecedores',
          'Avaliar terceirização de atividades não-core'
        ]
      },
      'ebitda': {
        description: 'Resultado operacional antes de juros, impostos, depreciação e amortização',
        composition: [
          { item: 'Lucro Bruto', value: account.value * 1.67, percentage: 167 },
          { item: 'Despesas Comerciais', value: -account.value * 0.35, percentage: -35 },
          { item: 'Despesas Administrativas', value: -account.value * 0.21, percentage: -21 },
          { item: 'Outras Despesas Operacionais', value: -account.value * 0.11, percentage: -11 }
        ],
        insights: [
          'EBITDA representa 24% da receita líquida',
          'Crescimento de 15.5% vs período anterior',
          'Controle eficiente de despesas operacionais',
          'Performance acima do planejamento'
        ],
        actions: [
          'Manter disciplina em despesas fixas',
          'Avaliar oportunidades de economia de escala',
          'Investir em tecnologia para eficiência',
          'Ampliar margem através de produtividade'
        ]
      },
      'lucro-liquido': {
        description: 'Resultado final após todas as deduções e impostos',
        composition: [
          { item: 'EBITDA', value: account.value * 1.33, percentage: 133 },
          { item: 'Depreciação', value: -account.value * 0.05, percentage: -5 },
          { item: 'Juros e Encargos', value: -account.value * 0.08, percentage: -8 },
          { item: 'IR e CSLL', value: -account.value * 0.20, percentage: -20 }
        ],
        insights: [
          'Margem líquida de 18% sobre receita',
          'Crescimento sustentável de 9.1%',
          'Estrutura de capital otimizada',
          'Resultado dentro das projeções'
        ],
        actions: [
          'Avaliar reinvestimento no negócio',
          'Considerar distribuição de dividendos',
          'Planejar expansão com recursos próprios',
          'Manter reservas para oportunidades'
        ]
      }
    };

    return analyses[accountId as keyof typeof analyses] || {
      description: 'Análise detalhada da conta selecionada',
      composition: [
        { item: 'Componente Principal', value: account.value * 0.8, percentage: 80 },
        { item: 'Componente Secundário', value: account.value * 0.2, percentage: 20 }
      ],
      insights: [
        'Dados em análise para este item',
        'Informações detalhadas sendo processadas'
      ],
      actions: [
        'Aguardando análise completa',
        'Recomendações em desenvolvimento'
      ]
    };
  };

  const analysis = getAccountAnalysis(account.id);

  const getComparisonData = () => [
    { period: 'Dez 2024', value: account.value, status: 'current' },
    { period: 'Nov 2024', value: account.value * 0.92, status: 'previous' },
    { period: 'Dez 2023', value: account.value * 0.87, status: 'year' },
    { period: 'Orçado', value: account.value * 0.97, status: 'budget' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {account.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            {analysis.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Valor Principal */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {formatCurrency(account.value)}
                  </h3>
                  <p className="text-sm text-muted-foreground">Valor atual</p>
                </div>
                {account.trend && account.change && (
                  <div className="flex items-center gap-2">
                    {account.trend === 'up' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                    <span className={cn(
                      "text-lg font-semibold",
                      account.trend === 'up' ? "text-green-500" : "text-red-500"
                    )}>
                      {account.change}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Composição */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  Composição Detalhada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.composition.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <span className="text-sm font-medium">{item.item}</span>
                      <div className="text-xs text-muted-foreground">
                        {item.percentage > 0 ? '+' : ''}{item.percentage}% do total
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "font-mono text-sm",
                        item.value >= 0 ? "text-foreground" : "text-red-500"
                      )}>
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Comparativo Temporal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Comparativo Temporal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getComparisonData().map((item, index) => {
                  const variance = ((item.value - account.value) / account.value) * 100;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.period}</span>
                        {item.status === 'current' && (
                          <Badge variant="default" className="text-xs">Atual</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm block">
                          {formatCurrency(item.value)}
                        </span>
                        {item.status !== 'current' && (
                          <span className={cn(
                            "text-xs",
                            variance > 0 ? "text-green-600" : variance < 0 ? "text-red-600" : "text-muted-foreground"
                          )}>
                            {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Centro de Custos */}
          {account.costCenter && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Distribuição por Centro de Custo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(account.costCenter).map(([center, value]) => (
                    <div key={center} className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {center}
                      </div>
                      <div className="font-mono text-sm font-semibold">
                        {formatCurrency(value)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {((value / account.value) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Insights e Análises
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{insight}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Ações Recomendadas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Ações Recomendadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.actions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};