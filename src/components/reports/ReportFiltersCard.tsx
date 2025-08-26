import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Filter, RotateCcw, RefreshCw, Search, Download } from "lucide-react";
import { useData } from "@/contexts/DataContext";

interface ReportFiltersCardProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  reportFormat: string;
  onFormatChange: (format: string) => void;
  reportView: string;
  onViewChange: (view: string) => void;
  onReset: () => void;
  onExport: () => void;
}

export const ReportFiltersCard = ({
  searchQuery,
  onSearchChange,
  reportFormat,
  onFormatChange,
  reportView,
  onViewChange,
  onReset,
  onExport
}: ReportFiltersCardProps) => {
  const { filters, updateFilters } = useData();

  return (
    <div className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <Filter className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">Filtros de Relatório</span>
          
          {/* Summary Chips */}
          <div className="hidden sm:flex items-center gap-2 ml-4">
            <Badge variant="secondary" className="text-xs">
              {filters.entidade === 'consolidado' ? 'Consolidado' : 
               filters.entidade === 'individual' ? 'Individual' : 
               filters.entidade === 'filial1' ? 'Filial 1' : 'Filial 2'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {filters.cenario === 'real' ? 'Real' : 
               filters.cenario === 'orcado' ? 'Orçado' : 
               filters.cenario === 'forecast' ? 'Forecast' : 'Projetado'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {filters.periodo === 'dezembro-2024' ? 'Dezembro 2024' : 
               filters.periodo === 'novembro-2024' ? 'Novembro 2024' : 
               filters.periodo === 'q4-2024' ? 'Q4 2024' : 'Ano 2024'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset} 
            className="h-9 px-4 text-xs font-medium"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-2" />
            Reset
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="h-9 px-4 text-xs font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filter Grid */}
      <div className="space-y-6">
        {/* Row 1: Main filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Entidade
            </label>
            <Select 
              value={filters.entidade} 
              onValueChange={(value) => updateFilters({ entidade: value })}
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consolidado">Consolidado</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="filial1">Filial 1</SelectItem>
                <SelectItem value="filial2">Filial 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Centro de Custo
            </label>
            <Select 
              value={filters.entidade === 'consolidado' ? 'todos' : filters.centroCusto} 
              onValueChange={(value) => updateFilters({ centroCusto: value })}
              disabled={filters.entidade === 'consolidado'}
            >
              <SelectTrigger className="h-10 text-sm disabled:opacity-50">
                <SelectValue placeholder={filters.entidade === 'consolidado' ? 'Todos' : undefined} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Cenário
            </label>
            <Select 
              value={filters.cenario} 
              onValueChange={(value) => updateFilters({ cenario: value })}
            >
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real">Real</SelectItem>
                <SelectItem value="orcado">Orçado</SelectItem>
                <SelectItem value="forecast">Forecast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 2: Period type selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Período
          </label>
          <div className="flex rounded-lg bg-muted p-1">
            <button 
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                filters.tipoPeriodo === 'mes' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => updateFilters({ tipoPeriodo: 'mes' })}
            >
              Mês
            </button>
            <button 
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                filters.tipoPeriodo === 'intervalo' 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => updateFilters({ tipoPeriodo: 'intervalo' })}
            >
              Intervalo
            </button>
          </div>
        </div>

        {/* Row 3: Period-specific controls */}
        {filters.tipoPeriodo === 'mes' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Mês
              </label>
              <Select 
                value={filters.periodo} 
                onValueChange={(value) => updateFilters({ periodo: value })}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dezembro-2024">Dezembro 2024</SelectItem>
                  <SelectItem value="novembro-2024">Novembro 2024</SelectItem>
                  <SelectItem value="outubro-2024">Outubro 2024</SelectItem>
                  <SelectItem value="q4-2024">Q4 2024</SelectItem>
                  <SelectItem value="ano-2024">Ano 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Comparação
              </label>
              <Select 
                value={filters.comparacao} 
                onValueChange={(value) => updateFilters({ comparacao: value })}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes-anterior">M-1</SelectItem>
                  <SelectItem value="ano-anterior">M-12 (YoY)</SelectItem>
                  <SelectItem value="orcado">vs Orçado</SelectItem>
                  <SelectItem value="forecast">vs Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Moeda
              </label>
              <Select 
                value={filters.moeda} 
                onValueChange={(value) => updateFilters({ moeda: value })}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Precisão
              </label>
              <Select 
                value={filters.precisao} 
                onValueChange={(value) => updateFilters({ precisao: value })}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 casas</SelectItem>
                  <SelectItem value="2">2 casas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Início
              </label>
              <Select 
                value={filters.periodoInicial} 
                onValueChange={(value) => updateFilters({ periodoInicial: value })}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="janeiro-2024">Janeiro 2024</SelectItem>
                  <SelectItem value="fevereiro-2024">Fevereiro 2024</SelectItem>
                  <SelectItem value="marco-2024">Março 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Fim
              </label>
              <Select 
                value={filters.periodoFinal} 
                onValueChange={(value) => updateFilters({ periodoFinal: value })}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outubro-2024">Outubro 2024</SelectItem>
                  <SelectItem value="novembro-2024">Novembro 2024</SelectItem>
                  <SelectItem value="dezembro-2024">Dezembro 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Comparação
              </label>
              <Select 
                value={filters.comparacao} 
                onValueChange={(value) => updateFilters({ comparacao: value })}
              >
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="periodo-anterior">Período anterior eq.</SelectItem>
                  <SelectItem value="yoy">YoY</SelectItem>
                  <SelectItem value="orcado">vs Orçado</SelectItem>
                  <SelectItem value="forecast">vs Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Row 4: Search and export controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 pt-4 border-t border-border/30">
          <div className="space-y-2 lg:col-span-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar relatórios..." 
                className="pl-10 h-10 text-sm" 
                value={searchQuery} 
                onChange={(e) => onSearchChange(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Visão
            </label>
            <Select value={reportView} onValueChange={onViewChange}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resumo">Resumo</SelectItem>
                <SelectItem value="detalhado">Detalhado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Formato
            </label>
            <Select value={reportFormat} onValueChange={onFormatChange}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">XLSX</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide opacity-0">
              Action
            </label>
            <Button 
              variant="outline" 
              className="w-full h-10 text-sm" 
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-end pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Dados em tempo real / Última atualização: agora</span>
          </div>
        </div>
      </div>
    </div>
  );
};