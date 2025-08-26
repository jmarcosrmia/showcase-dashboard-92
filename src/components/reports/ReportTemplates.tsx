import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, PieChart, TrendingUp, BarChart3, Calculator, GitCompare, Calendar, Play } from "lucide-react";
import { REPORT_TEMPLATES } from "@/lib/report-templates";

const TEMPLATE_ICONS = {
  'dre-gerencial': FileText,
  'analise-custos': Calculator,
  'fluxo-caixa': BarChart3,
  'dashboard-executivo': TrendingUp,
  'analise-margem': PieChart,
  'comparativo-periodos': GitCompare
};

interface ReportTemplatesProps {
  onTemplateSelect: (template: any) => void;
}

export const ReportTemplates = ({ onTemplateSelect }: ReportTemplatesProps) => {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-red-100 text-red-800 border-red-200';
      case 'weekly': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'monthly': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quarterly': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'annual': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: {[key: string]: string} = {
      'daily': 'Diário',
      'weekly': 'Semanal',
      'monthly': 'Mensal',
      'quarterly': 'Trimestral',
      'annual': 'Anual'
    };
    return labels[frequency] || frequency;
  };

  const getCategoryLabel = (category: string) => {
    const labels: {[key: string]: string} = {
      'financial': 'Financeiro',
      'operational': 'Operacional',
      'analysis': 'Análise'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'operational': return 'bg-green-50 text-green-700 border-green-200';
      case 'analysis': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Templates de Relatórios</h3>
        <p className="text-sm text-muted-foreground">
          Use templates pré-configurados para gerar relatórios rapidamente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_TEMPLATES.map((template) => {
          const IconComponent = TEMPLATE_ICONS[template.id as keyof typeof TEMPLATE_ICONS] || FileText;
          
          return (
            <Card key={template.id} className="hover:shadow-lg transition-all duration-300 group border-border/50 hover:border-primary/30">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold leading-tight">
                        {template.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className={`text-xs px-2 py-0 ${getCategoryColor(template.category)}`}>
                          {getCategoryLabel(template.category)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs px-2 py-0 ${getFrequencyColor(template.frequency)}`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {getFrequencyLabel(template.frequency)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
                
                {/* Template sections preview */}
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Seções incluídas:
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.slice(0, 4).map((section, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs px-2 py-0 bg-background border border-border/50"
                      >
                        {section.title}
                      </Badge>
                    ))}
                    {template.sections.length > 4 && (
                      <Badge variant="secondary" className="text-xs px-2 py-0 bg-background border border-border/50">
                        +{template.sections.length - 4} mais
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Template options preview */}
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Configurações:
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${template.defaultOptions.incluirGraficos ? 'bg-green-500' : 'bg-gray-300'}`} />
                      Gráficos
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${template.defaultOptions.incluirComparacao ? 'bg-green-500' : 'bg-gray-300'}`} />
                      Comparação
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${template.defaultOptions.incluirDetalhamento ? 'bg-green-500' : 'bg-gray-300'}`} />
                      Detalhado
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${template.defaultOptions.incluirAssinatura ? 'bg-green-500' : 'bg-gray-300'}`} />
                      Assinatura
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => onTemplateSelect(template)}
                  className="w-full h-9 text-sm group-hover:bg-primary/90 transition-colors"
                  size="sm"
                >
                  <Play className="h-3 w-3 mr-2" />
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};