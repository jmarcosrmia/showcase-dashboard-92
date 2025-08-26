import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, PieChart, TrendingUp, BarChart3, Calculator, GitCompare } from "lucide-react";
import { ReportDownloadManager } from "./ReportDownloadManager";
import { useData } from "@/contexts/DataContext";

const REPORT_ICONS = {
  'DRE': FileText,
  'Análise': PieChart,
  'Tendências': TrendingUp,
  'Fluxo': BarChart3,
  'Custos': Calculator,
  'Comparativo': GitCompare
};

export const ReportsList = ({ searchQuery }: { searchQuery: string }) => {
  const { filters } = useData();
  
  // Define utility functions using function declarations (hoisted)
  function getPeriodDescription(filters: any) {
    if (filters.tipoPeriodo === 'mes') {
      const periodMap: {[key: string]: string} = {
        'dezembro-2024': 'Dezembro 2024',
        'novembro-2024': 'Novembro 2024',
        'outubro-2024': 'Outubro 2024',
        'q4-2024': 'Q4 2024',
        'ano-2024': 'Ano 2024'
      };
      return periodMap[filters.periodo] || filters.periodo;
    }
    return `${filters.periodoInicial} - ${filters.periodoFinal}`;
  }

  function getEntityDescription(filters: any) {
    const entityMap: {[key: string]: string} = {
      'consolidado': 'Consolidado',
      'individual': 'Individual',
      'filial1': 'Filial 1',
      'filial2': 'Filial 2'
    };
    return entityMap[filters.entidade] || filters.entidade;
  }

  function getScenarioDescription(filters: any) {
    const scenarioMap: {[key: string]: string} = {
      'real': 'Real',
      'orcado': 'Orçado',
      'forecast': 'Forecast',
      'projetado': 'Projetado'
    };
    return scenarioMap[filters.cenario] || filters.cenario;
  }
  
  // Generate reports based on available templates and current filters
  function generateReports() {
    const baseReports = [
      {
        id: 1,
        title: "Demonstrativo de Resultado do Exercício",
        description: "Relatório completo de receitas, custos e despesas com análise gerencial",
        type: "DRE",
        templateId: "dre-gerencial",
        status: "Disponível",
        size: "2.1 MB",
        formats: ['pdf', 'excel']
      },
      {
        id: 2,
        title: "Análise de Margem por Produto",
        description: "Detalhamento da margem de contribuição por linha de produto",
        type: "Análise",
        templateId: "analise-margem",
        status: "Disponível",
        size: "1.8 MB",
        formats: ['pdf', 'excel', 'csv']
      },
      {
        id: 3,
        title: "Relatório de Tendências Financeiras",
        description: "Análise comparativa dos últimos 12 meses com projeções",
        type: "Comparativo",
        templateId: "comparativo-periodos",
        status: "Disponível",
        size: "3.2 MB",
        formats: ['pdf', 'excel']
      },
      {
        id: 4,
        title: "Fluxo de Caixa Detalhado",
        description: "Movimentações de entrada e saída por categoria",
        type: "Fluxo",
        templateId: "fluxo-caixa",
        status: "Disponível",
        size: "1.9 MB",
        formats: ['pdf', 'excel']
      },
      {
        id: 5,
        title: "Análise de Custos por Centro",
        description: "Custos diretos e indiretos detalhados por centro de custo",
        type: "Custos",
        templateId: "analise-custos",
        status: "Disponível",
        size: "2.4 MB",
        formats: ['pdf', 'excel', 'csv']
      },
      {
        id: 6,
        title: "Dashboard Executivo",
        description: "Síntese visual dos principais KPIs e indicadores estratégicos",
        type: "Análise",
        templateId: "dashboard-executivo",
        status: "Disponível",
        size: "1.5 MB",
        formats: ['pdf']
      }
    ];

    // Add period context to reports
    return baseReports.map(report => ({
      ...report,
      period: getPeriodDescription(filters),
      entity: getEntityDescription(filters),
      scenario: getScenarioDescription(filters)
    }));
  }

  const reports = generateReports();

  // Filter reports based on search query
  const filteredReports = searchQuery 
    ? reports.filter(report => 
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : reports;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponível': return 'default';
      case 'Processando': return 'secondary';
      case 'Erro': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    const colorMap: {[key: string]: string} = {
      'DRE': 'text-blue-600',
      'Análise': 'text-green-600',
      'Tendências': 'text-purple-600',
      'Fluxo': 'text-orange-600',
      'Custos': 'text-red-600',
      'Comparativo': 'text-indigo-600'
    };
    return colorMap[type] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-3">
      {filteredReports.length === 0 ? (
        <Card className="p-6 text-center border-dashed">
          <div className="text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">Nenhum relatório encontrado</h3>
            <p className="text-sm">Tente ajustar os filtros de busca ou criar um novo relatório</p>
          </div>
        </Card>
      ) : (
        filteredReports.map(report => {
          const IconComponent = REPORT_ICONS[report.type as keyof typeof REPORT_ICONS] || FileText;
          
          return (
            <Card key={report.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary/60">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Left content */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`p-3 rounded-xl bg-background border-2 border-border/50 ${getTypeColor(report.type)} flex-shrink-0`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Title and status */}
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-foreground text-lg leading-tight" title={report.title}>
                          {report.title}
                        </h4>
                        <Badge variant={getStatusColor(report.status)} className="shrink-0 text-xs">
                          {report.status}
                        </Badge>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {report.description}
                      </p>
                      
                      {/* Context info */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            {report.type}
                          </Badge>
                        </div>
                        <span>•</span>
                        <span title="Entidade">{report.entity}</span>
                        <span>•</span>
                        <span title="Cenário">{report.scenario}</span>
                        <span>•</span>
                        <span title="Período">{report.period}</span>
                        <span>•</span>
                        <span title="Tamanho do arquivo">{report.size}</span>
                      </div>
                      
                      {/* Available formats */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Formatos:</span>
                        <div className="flex gap-1">
                          {report.formats.map(format => (
                            <Badge key={format} variant="secondary" className="text-xs px-2 py-0">
                              {format.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right content - Download options */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {report.formats.map(format => (
                      <ReportDownloadManager
                        key={`${report.id}-${format}`}
                        reportId={report.id}
                        title={report.title}
                        format={format as 'pdf' | 'excel' | 'csv'}
                        size={report.size}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};