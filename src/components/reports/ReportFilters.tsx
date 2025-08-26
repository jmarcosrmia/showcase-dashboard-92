import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RefreshCw, Filter, ChevronDown, RotateCcw, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { FilterChips } from "./FilterChips";
import { SegmentedControl } from "./SegmentedControl";
import { 
  getCentroCustoOptions, 
  getComparacaoOptions, 
  isComparacaoValid, 
  periodConfigToFilters, 
  filtersToperiodConfig,
  getDefaultFilters,
  PeriodConfig,
  PeriodMode 
} from "@/lib/filter-utils";

const monthOptions = [
  { value: 'dezembro-2024', label: 'Dezembro 2024' },
  { value: 'novembro-2024', label: 'Novembro 2024' },
  { value: 'outubro-2024', label: 'Outubro 2024' },
  { value: 'setembro-2024', label: 'Setembro 2024' },
  { value: 'agosto-2024', label: 'Agosto 2024' },
  { value: 'julho-2024', label: 'Julho 2024' },
  { value: 'junho-2024', label: 'Junho 2024' },
  { value: 'maio-2024', label: 'Maio 2024' },
  { value: 'abril-2024', label: 'Abril 2024' },
  { value: 'marco-2024', label: 'Março 2024' },
  { value: 'fevereiro-2024', label: 'Fevereiro 2024' },
  { value: 'janeiro-2024', label: 'Janeiro 2024' }
];

export const ReportFilters = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();
  const { filters, updateFilters, refreshData, isRefreshing } = useData();

  // Convert filters to period config for the period selector
  const periodConfig = filtersToperiodConfig(filters);
  
  // Get dynamic options
  const centroCustoOptions = getCentroCustoOptions(filters.entidade);
  const comparacaoOptions = getComparacaoOptions(periodConfig.mode);
  const isCentroCustoDisabled = filters.entidade === 'consolidado';

  const handleRefresh = async () => {
    await refreshData();
    toast({
      title: "Dados atualizados",
      description: "Filtros aplicados e dados atualizados com sucesso.",
    });
  };

  const handleReset = () => {
    const defaultFilters = getDefaultFilters();
    updateFilters(defaultFilters);
    toast({
      title: "Filtros resetados",
      description: "Os filtros foram restaurados para os valores padrão."
    });
  };

  const handlePeriodModeChange = (mode: PeriodMode) => {
    if (mode === 'month') {
      let updatedFilters: any = {
        periodo: periodConfig.month || 'dezembro-2024',
        periodoInicial: '',
        periodoFinal: ''
      };
      
      // Validate and adjust comparison if needed
      if (!isComparacaoValid(filters.comparacao, mode)) {
        const newComparacaoOptions = getComparacaoOptions(mode);
        updatedFilters.comparacao = newComparacaoOptions[0]?.value || 'mes-anterior';
      }
      
      updateFilters(updatedFilters);
    } else {
      let updatedFilters: any = {
        periodo: '',
        periodoInicial: periodConfig.startMonth || 'janeiro-2024',
        periodoFinal: periodConfig.endMonth || 'dezembro-2024'
      };
      
      // Validate and adjust comparison if needed
      if (!isComparacaoValid(filters.comparacao, mode)) {
        const newComparacaoOptions = getComparacaoOptions(mode);
        updatedFilters.comparacao = newComparacaoOptions[0]?.value || 'periodo-anterior';
      }
      
      updateFilters(updatedFilters);
    }
  };

  const handleEntidadeChange = (entidade: string) => {
    let updates: any = { entidade };
    
    // Reset centro de custo when changing entidade
    if (entidade === 'consolidado') {
      updates.centroCusto = 'todos';
    } else {
      updates.centroCusto = 'consolidado';
    }
    
    updateFilters(updates);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                  <Filter className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">Filtros de Relatório</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")} />
              </button>
            </CollapsibleTrigger>
            
            <div className="flex lg:hidden items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReset}
                className="h-8 px-3 text-xs font-medium"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 px-3 text-xs font-medium"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
          
          {/* Chips e botões para desktop */}
          <div className="flex items-center justify-between gap-4">
            <FilterChips filters={filters} />
            
            <div className="hidden lg:flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleReset}
                className="h-8 px-3 text-xs font-medium"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-2" />
                Reset
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 px-3 text-xs font-medium"
              >
                <RefreshCw className={cn("h-3.5 w-3.5 mr-2", isRefreshing && "animate-spin")} />
                {isRefreshing ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </div>
        </div>

        <CollapsibleContent className="space-y-6">
          <div className="mt-6">
            {/* Grid responsivo 12 colunas */}
            <div className="grid grid-cols-12 gap-4">
              
              {/* Linha 1: Entidade + Centro de Custo */}
              <div className="col-span-12 sm:col-span-6 space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Entidade</label>
                <Select value={filters.entidade} onValueChange={handleEntidadeChange}>
                  <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl z-50">
                    <SelectItem value="consolidado" className="text-sm">Consolidado</SelectItem>
                    <SelectItem value="individual" className="text-sm">Individual</SelectItem>
                    <SelectItem value="filial1" className="text-sm">Filial 1</SelectItem>
                    <SelectItem value="filial2" className="text-sm">Filial 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 sm:col-span-6 space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Centro de Custo</label>
                <Select 
                  value={isCentroCustoDisabled ? 'todos' : filters.centroCusto} 
                  onValueChange={(value) => !isCentroCustoDisabled && updateFilters({ centroCusto: value })}
                  disabled={isCentroCustoDisabled}
                >
                  <SelectTrigger className={cn(
                    "h-10 text-sm bg-background/60 border-border/60 transition-colors duration-200 focus:ring-2 focus:ring-primary/20",
                    isCentroCustoDisabled ? "opacity-50 cursor-not-allowed" : "hover:border-border"
                  )}>
                    <SelectValue placeholder={isCentroCustoDisabled ? "Todos" : "Selecione..."} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl z-50">
                    {centroCustoOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-sm">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isCentroCustoDisabled && (
                  <p className="text-xs text-muted-foreground">Disponível apenas para entidades específicas</p>
                )}
              </div>

              {/* Linha 2: Cenário + Controle de Período */}
              <div className="col-span-12 sm:col-span-4 space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cenário</label>
                <Select value={filters.cenario} onValueChange={(value) => updateFilters({ cenario: value })}>
                  <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl z-50">
                    <SelectItem value="real" className="text-sm">Real</SelectItem>
                    <SelectItem value="orcado" className="text-sm">Orçado</SelectItem>
                    <SelectItem value="forecast" className="text-sm">Forecast</SelectItem>
                    <SelectItem value="projetado" className="text-sm">Projetado</SelectItem>
                    <SelectItem value="realizado" className="text-sm">Realizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 sm:col-span-8 space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Período</label>
                <SegmentedControl
                  value={periodConfig.mode}
                  onChange={handlePeriodModeChange}
                  options={[
                    { value: 'month', label: 'Mês' },
                    { value: 'range', label: 'Intervalo' }
                  ]}
                  className="w-full"
                />
              </div>

              {/* Linha 3: Render condicional baseado no modo de período */}
              {periodConfig.mode === 'month' ? (
                // Modo Mês: Seletor centralizado
                <div className="col-span-12 sm:col-start-5 sm:col-span-4 space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Mês</label>
                  <Select 
                    value={periodConfig.month || filters.periodo} 
                    onValueChange={(value) => updateFilters({ periodo: value, periodoInicial: '', periodoFinal: '' })}
                  >
                    <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl z-50">
                      {monthOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-sm">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                // Modo Intervalo: Início + Fim + Comparação
                <>
                  <div className="col-span-12 sm:col-span-4 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Início</label>
                    <Select 
                      value={periodConfig.startMonth || filters.periodoInicial} 
                      onValueChange={(value) => updateFilters({ periodoInicial: value, periodo: '' })}
                    >
                      <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Mês inicial" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl z-50">
                        {monthOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-sm">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-12 sm:col-span-4 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fim</label>
                    <Select 
                      value={periodConfig.endMonth || filters.periodoFinal} 
                      onValueChange={(value) => updateFilters({ periodoFinal: value, periodo: '' })}
                    >
                      <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Mês final" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl z-50">
                        {monthOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-sm">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-12 sm:col-span-4 space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Comparação</label>
                    <Select value={filters.comparacao} onValueChange={(value) => updateFilters({ comparacao: value })}>
                      <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl z-50">
                        {comparacaoOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="text-sm">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Linha 4: Moeda + Precisão + Indicador de dados */}
              <div className="col-span-12 sm:col-span-3 space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Moeda</label>
                <Select value={filters.moeda} onValueChange={(value) => updateFilters({ moeda: value })}>
                  <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl z-50">
                    <SelectItem value="BRL" className="text-sm">BRL (R$)</SelectItem>
                    <SelectItem value="USD" className="text-sm">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 sm:col-span-3 space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Precisão</label>
                <Select value={filters.precisao} onValueChange={(value) => updateFilters({ precisao: value })}>
                  <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl z-50">
                    <SelectItem value="0" className="text-sm">0 casas decimais</SelectItem>
                    <SelectItem value="2" className="text-sm">2 casas decimais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-12 sm:col-span-6 flex items-end justify-end">
                <div className="text-xs text-muted-foreground text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Dados em tempo real</span>
                  </div>
                  <p className="mt-1">Última atualização: agora</p>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};