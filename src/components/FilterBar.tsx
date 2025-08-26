import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RefreshCw, Download, Filter, Calendar, Database, Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { ExportFormatModal } from "@/components/ExportFormatModal";

export const FilterBar = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const { toast } = useToast();
  const { filters, updateFilters, refreshData, isRefreshing } = useData();

  const handleRefresh = async () => {
    await refreshData();
    toast({
      title: "Dados atualizados",
      description: "Dashboard atualizado com os dados mais recentes.",
    });
  };

  const handleExportWithFormat = async (format: string, options?: any) => {
    setIsExporting(true);
    
    try {
      // Simulate document generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create fictional document content
      let documentContent = `
RELATÓRIO DE FILTROS APLICADOS
==============================

Data de Geração: ${new Date().toLocaleDateString('pt-BR')}
`;

      if (options?.includeFilters) {
        documentContent += `
FILTROS ATUAIS:
- Entidade: ${filters.entidade}
- Centro de Custo: ${filters.centroCusto}
- Cenário: ${filters.cenario}
- Período: ${filters.periodo}
- Período Inicial: ${filters.periodoInicial}
- Período Final: ${filters.periodoFinal}
- Comparação: ${filters.comparacao}
- Visão: ${filters.visao}
- Moeda: ${filters.moeda}
- Precisão: ${filters.precisao} casas decimais
`;
      }

      documentContent += `
Relatório gerado automaticamente pelo sistema de filtros.
Formato: ${format.toUpperCase()}
      `;
      
      // Create and download file
      const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `filtros-aplicados-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  return (
    <>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                  <Filter className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">Filtros</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
              </button>
            </CollapsibleTrigger>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="h-8 sm:h-9 px-3 sm:px-4 text-xs font-medium bg-background/50 border-border/60 hover:bg-accent/50 hover:border-border transition-all duration-200"
              >
                <Download className={cn("h-3.5 w-3.5 sm:mr-2", isExporting && "animate-spin")} />
                <span className="hidden sm:inline">{isExporting ? "Exportando..." : "Exportar"}</span>
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 sm:h-9 px-3 sm:px-4 text-xs font-medium bg-primary hover:bg-primary/90 transition-all duration-200"
              >
                <RefreshCw className={cn("h-3.5 w-3.5 sm:mr-2", isRefreshing && "animate-spin")} />
                <span className="hidden sm:inline">{isRefreshing ? "Atualizando..." : "Atualizar"}</span>
              </Button>
            </div>
          </div>

          <CollapsibleContent className="space-y-4 sm:space-y-5">
            <div className="mt-4">
              {/* Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8 gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Entidade</label>
                  <Select value={filters.entidade} onValueChange={(value) => updateFilters({ entidade: value })}>
                    <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="consolidado" className="text-sm">Consolidado</SelectItem>
                      <SelectItem value="individual" className="text-sm">Individual</SelectItem>
                      <SelectItem value="filial1" className="text-sm">Filial 1</SelectItem>
                      <SelectItem value="filial2" className="text-sm">Filial 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Centro de Custo</label>
                  <Select value={filters.centroCusto} onValueChange={(value) => updateFilters({ centroCusto: value })}>
                    <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="consolidado" className="text-sm">Consolidado</SelectItem>
                      <SelectItem value="vendas" className="text-sm">Vendas</SelectItem>
                      <SelectItem value="marketing" className="text-sm">Marketing</SelectItem>
                      <SelectItem value="administrativo" className="text-sm">Administrativo</SelectItem>
                      <SelectItem value="financeiro" className="text-sm">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cenário</label>
                  <Select value={filters.cenario} onValueChange={(value) => updateFilters({ cenario: value })}>
                    <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="real" className="text-sm">Real</SelectItem>
                      <SelectItem value="orcado" className="text-sm">Orçado</SelectItem>
                      <SelectItem value="forecast" className="text-sm">Forecast</SelectItem>
                      <SelectItem value="projetado" className="text-sm">Projetado</SelectItem>
                      <SelectItem value="realizado" className="text-sm">Realizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Período</label>
                  <Select value={filters.periodo} onValueChange={(value) => updateFilters({ periodo: value })}>
                    <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="dezembro-2024" className="text-sm">Dezembro 2024</SelectItem>
                      <SelectItem value="novembro-2024" className="text-sm">Novembro 2024</SelectItem>
                      <SelectItem value="outubro-2024" className="text-sm">Outubro 2024</SelectItem>
                      <SelectItem value="setembro-2024" className="text-sm">Setembro 2024</SelectItem>
                      <SelectItem value="q4-2024" className="text-sm">Q4 2024</SelectItem>
                      <SelectItem value="ano-2024" className="text-sm">Ano 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Período Inicial</label>
                  <Select value={filters.periodoInicial} onValueChange={(value) => updateFilters({ periodoInicial: value })}>
                    <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="janeiro-2024" className="text-sm">Janeiro 2024</SelectItem>
                      <SelectItem value="fevereiro-2024" className="text-sm">Fevereiro 2024</SelectItem>
                      <SelectItem value="marco-2024" className="text-sm">Março 2024</SelectItem>
                      <SelectItem value="abril-2024" className="text-sm">Abril 2024</SelectItem>
                      <SelectItem value="maio-2024" className="text-sm">Maio 2024</SelectItem>
                      <SelectItem value="junho-2024" className="text-sm">Junho 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Período Final</label>
                  <Select value={filters.periodoFinal} onValueChange={(value) => updateFilters({ periodoFinal: value })}>
                    <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="julho-2024" className="text-sm">Julho 2024</SelectItem>
                      <SelectItem value="agosto-2024" className="text-sm">Agosto 2024</SelectItem>
                      <SelectItem value="setembro-2024" className="text-sm">Setembro 2024</SelectItem>
                      <SelectItem value="outubro-2024" className="text-sm">Outubro 2024</SelectItem>
                      <SelectItem value="novembro-2024" className="text-sm">Novembro 2024</SelectItem>
                      <SelectItem value="dezembro-2024" className="text-sm">Dezembro 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Comparação</label>
                  <Select value={filters.comparacao} onValueChange={(value) => updateFilters({ comparacao: value })}>
                    <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="mes-anterior" className="text-sm">Mês Anterior</SelectItem>
                      <SelectItem value="ano-anterior" className="text-sm">Ano Anterior</SelectItem>
                      <SelectItem value="mes-ano-anterior" className="text-sm">Mês do Ano Anterior</SelectItem>
                      <SelectItem value="ytd" className="text-sm">Acumulado no Ano (YTD)</SelectItem>
                      <SelectItem value="mesmo-periodo" className="text-sm">Mesmo Período Ano Ant.</SelectItem>
                      <SelectItem value="orcado" className="text-sm">vs Orçado</SelectItem>
                      <SelectItem value="media-12m" className="text-sm">vs Média 12M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Visão</label>
                  <Select value={filters.visao} onValueChange={(value) => updateFilters({ visao: value })}>
                    <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="resumo" className="text-sm">Resumo</SelectItem>
                      <SelectItem value="detalhado" className="text-sm">Detalhado</SelectItem>
                      <SelectItem value="analitico" className="text-sm">Analítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 sm:pt-4 border-t border-border/30 gap-3 sm:gap-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-medium text-foreground">Dados em tempo real</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Última atualização: agora</span>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-1.5 text-muted-foreground">
                    <Database className="h-3 w-3" />
                    <span>Conectado: ERP Sistema</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  <Select value={filters.moeda} onValueChange={(value) => updateFilters({ moeda: value })}>
                    <SelectTrigger className="h-6 w-16 text-xs bg-transparent border-none p-0 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="BRL" className="text-xs">BRL</SelectItem>
                      <SelectItem value="USD" className="text-xs">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-muted-foreground">Precisão:</span>
                  <Select value={filters.precisao} onValueChange={(value) => updateFilters({ precisao: value })}>
                    <SelectTrigger className="h-6 w-20 text-xs bg-transparent border-none p-0 focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                      <SelectItem value="0" className="text-xs">0 casas</SelectItem>
                      <SelectItem value="2" className="text-xs">2 casas</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">decimais</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
      
      <ExportFormatModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        title="Exportar Filtros"
        description="Escolha o formato para exportar os filtros aplicados"
        onExport={handleExportWithFormat}
        includeFilterOptions={true}
      />
    </>
  );
};