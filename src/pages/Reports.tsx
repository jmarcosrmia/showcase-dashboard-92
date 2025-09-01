import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { NewReportModal } from "@/components/reports/NewReportModal";
import { CustomDateModal } from "@/components/reports/CustomDateModal";
import { ReportsList } from "@/components/reports/ReportsList";
import { ReportFiltersCard } from "@/components/reports/ReportFiltersCard";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { generatePageTitle, generateSubHeader, getDefaultFilters, serializeFiltersToURL, deserializeFiltersFromURL, filtersToperiodConfig } from "@/lib/filter-utils";
import { ExportFormatModal } from "@/components/ExportFormatModal";
const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);

  // Report-specific options
  const [reportFormat, setReportFormat] = useState("pdf");
  const [reportView, setReportView] = useState("resumo");
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, updateFilters } = useData();
  const { toast } = useToast();

  // Sincronizar filtros com URL na inicialização
  useEffect(() => {
    const urlFilters = deserializeFiltersFromURL(searchParams);
    if (Object.keys(urlFilters).length > 0) {
      updateFilters(urlFilters);
    }
  }, []);

  // Atualizar URL quando os filtros mudarem
  useEffect(() => {
    const urlString = serializeFiltersToURL(filters);
    if (urlString !== searchParams.toString()) {
      setSearchParams(urlString ? `?${urlString}` : '', {
        replace: true
      });
    }
  }, [filters, setSearchParams]);

  // Gerar título e sub-header dinâmicos
  const pageTitle = generatePageTitle(filters);
  const periodConfig = filtersToperiodConfig(filters);
  const subHeader = generateSubHeader(filters, periodConfig);

  // Reset filters to default
  const handleReset = () => {
    const defaultFilters = getDefaultFilters();
    updateFilters(defaultFilters);
    setReportFormat("pdf");
    setReportView("resumo");
    toast({
      title: "Filtros resetados",
      description: "Os filtros foram restaurados para os valores padrão."
    });
  };
  const handleCustomDateSelect = async (format: string, options?: any) => {
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create fictional report content
      let documentContent = `
RELATÓRIO PERSONALIZADO
=======================

Data de Geração: ${new Date().toLocaleDateString('pt-BR')}
`;

      if (options?.includeFilters) {
        documentContent += `
FILTROS APLICADOS:
- Entidade: ${filters.entidade}
- Centro de Custo: ${filters.centroCusto}
- Cenário: ${filters.cenario}
- Período: ${filters.periodo}
- Moeda: ${filters.moeda}
- Visão: ${reportView}
`;
      }

      documentContent += `
TIPO DE RELATÓRIO: ${reportView.charAt(0).toUpperCase() + reportView.slice(1)}
FORMATO: ${format.toUpperCase()}

Relatório gerado automaticamente pelo sistema.
      `;
      
      // Create and download file
      const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-personalizado-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      throw error;
    }
  };

  const handleExport = () => {
    setShowCustomDateModal(true);
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-foreground">{pageTitle}</h2>
            <p className="text-sm text-muted-foreground/80 mb-1 border-b border-border/30 pb-1">
              {subHeader}
            </p>
            <p className="text-base text-muted-foreground">
              Gere e gerencie relatórios personalizados e analise dados financeiros
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => setShowNewReportModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Relatório
            </Button>
          </div>
        </div>

        {/* Filter Card */}
        <ReportFiltersCard
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          reportFormat={reportFormat}
          onFormatChange={setReportFormat}
          reportView={reportView}
          onViewChange={setReportView}
          onReset={handleReset}
          onExport={handleExport}
        />

        {/* Main Content */}
        <ReportsList searchQuery={searchQuery} />
      </div>

      {/* Modals */}
      <NewReportModal 
        open={showNewReportModal} 
        onOpenChange={setShowNewReportModal} 
      />
      
      <ExportFormatModal 
        open={showCustomDateModal} 
        onOpenChange={setShowCustomDateModal} 
        title="Exportar Relatório"
        description="Escolha o formato para exportar o relatório"
        onExport={handleCustomDateSelect} 
        includeFilterOptions={true}
      />
    </AppLayout>
  );
};
export default Reports;