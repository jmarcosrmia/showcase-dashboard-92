import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PieChart, TrendingUp, BarChart3, Calendar, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

export const QuickActionsPanel = () => {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const { toast } = useToast();
  const { filters } = useData();

  const quickActions = [
    {
      id: "dre-atual",
      title: "DRE do Mês Atual",
      description: "Demonstrativo de resultado do período atual",
      icon: FileText,
      color: "text-primary",
      period: "Dezembro 2024"
    },
    {
      id: "custos-analise",
      title: "Análise de Custos",
      description: "Detalhamento de custos diretos e indiretos",
      icon: PieChart,
      color: "text-warning",
      period: "Trimestre atual"
    },
    {
      id: "tendencias",
      title: "Relatório de Tendências",
      description: "Análise comparativa dos últimos meses",
      icon: TrendingUp,
      color: "text-success",
      period: "Últimos 12 meses"
    },
    {
      id: "fluxo-caixa",
      title: "Fluxo de Caixa",
      description: "Movimentações financeiras detalhadas",
      icon: BarChart3,
      color: "text-primary",
      period: "Mês atual"
    }
  ];

  const handleQuickGenerate = async (actionId: string, title: string) => {
    setGeneratingReport(actionId);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create fictional report content
      const reportContent = `
RELATÓRIO: ${title.toUpperCase()}
${'='.repeat(title.length + 12)}

Data de Geração: ${new Date().toLocaleDateString('pt-BR')}
Período: ${quickActions.find(a => a.id === actionId)?.period}

FILTROS APLICADOS:
- Entidade: ${filters.entidade}
- Centro de Custo: ${filters.centroCusto}
- Cenário: ${filters.cenario}
- Período: ${filters.periodo}
- Comparação: ${filters.comparacao}

DADOS DO RELATÓRIO:
${actionId === 'dre-atual' ? 
  '- Receita Líquida: R$ 12.750.000\n- Lucro Bruto: R$ 5.100.000\n- EBITDA: R$ 3.060.000\n- Margem EBITDA: 24,0%' :
  actionId === 'custos-analise' ?
  '- Custos Diretos: R$ 7.650.000\n- Custos Indiretos: R$ 1.530.000\n- Total de Custos: R$ 9.180.000\n- % da Receita: 72,0%' :
  actionId === 'tendencias' ?
  '- Crescimento Receita: +8,2%\n- Crescimento EBITDA: +12,5%\n- Tendência: Positiva\n- Projeção: Crescimento sustentado' :
  '- Entradas: R$ 15.200.000\n- Saídas: R$ 13.800.000\n- Saldo: R$ 1.400.000\n- Posição: Positiva'
}

Relatório gerado automaticamente pelo sistema.
      `;
      
      // Create and download file
      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Relatório gerado com sucesso!",
        description: `${title} foi criado e baixado automaticamente.`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
        <CardDescription>
          Gere relatórios instantâneos com configurações pré-definidas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action) => {
            const isGenerating = generatingReport === action.id;
            const Icon = action.icon;
            
            return (
              <div key={action.id} className="group">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto p-3 sm:p-4 hover:shadow-md transition-all"
                  onClick={() => handleQuickGenerate(action.id, action.title)}
                  disabled={isGenerating}
                >
                  <div className="flex items-center gap-3 w-full min-w-0">
                    <div className={`p-2 rounded-lg bg-muted ${action.color} group-hover:scale-110 transition-transform flex-shrink-0`}>
                      {isGenerating ? (
                        <Calendar className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                        {action.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {action.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 flex-wrap">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{action.period}</span>
                        <span>•</span>
                        <span className="truncate">{filters.entidade}</span>
                        <span>•</span>
                        <span className="truncate">{filters.cenario}</span>
                      </div>
                    </div>
                    
                    {isGenerating && (
                      <div className="text-xs text-muted-foreground flex-shrink-0">
                        Gerando...
                      </div>
                    )}
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Os relatórios serão gerados usando os filtros atuais: 
            <span className="font-medium"> {filters.entidade} • {filters.cenario}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};