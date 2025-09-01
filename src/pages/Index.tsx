import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { FilterBar } from "@/components/FilterBar";
import { PieChartCard } from "@/components/PieChartCard";
import { TrendsCard } from "@/components/TrendsCard";
import { DetailModal } from "@/components/DetailModal";
import { LucroFormationChart } from "@/components/LucroFormationChart";
import { ResultsDemo } from "@/components/ResultsDemo";
import { DREAnalysisPanel } from "@/components/DREAnalysisPanel";
import { DREComparison } from "@/components/DREComparison";
import { AutoInsights } from "@/components/AutoInsights";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { DashboardExportButton } from "@/components/DashboardExportButton";

// Helper function to parse currency values
const parseValue = (value: string): number => {
  return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
};

const Index = () => {
  const {
    data,
    filters
  } = useData();
  
  const { toast } = useToast();

  // Seletores para o cabeçalho dinâmico
  const getEntidadeNome = () => {
    const entidadeValue = filters.entidade;
    
    // Mapear valores para nomes de exibição
    const entidadeMap: { [key: string]: string } = {
      'consolidado': '', // Consolidado não mostra nome específico
      'individual': 'Individual',
      'filial1': 'Filial 1',
      'filial2': 'Filial 2'
    };
    
    return entidadeMap[entidadeValue] || '';
  };

  const entidadeNome = getEntidadeNome();
  const titulo = entidadeNome ? `Dashboard ${entidadeNome}` : 'Dashboard Executivo';
  
  // Calculate MARKUP KPI
  const receitaLiquida = parseValue(data.receita.value);
  const lucroBruto = parseValue(data.lucro.value);
  const cpv = receitaLiquida - lucroBruto;
  
  const markupData = (() => {
    if (cpv <= 0) {
      return {
        value: "—",
        change: "—",
        trend: "neutral" as const,
        tooltip: "Sem CPV no período selecionado"
      };
    }
    
    const markupPct = (lucroBruto / cpv) * 100;
    
    // Simular variação comparativa (baseado na mesma lógica dos outros KPIs)
    const previousMarkup = markupPct * (0.95 + Math.random() * 0.1); // Simular valor anterior
    const changePct = markupPct - previousMarkup;
    const changeFormatted = `${changePct >= 0 ? '+' : ''}${changePct.toFixed(1)} p.p.`;
    
    return {
      value: `${markupPct.toFixed(1)}%`,
      change: changeFormatted,
      trend: (changePct >= 0 ? 'up' : 'down') as 'up' | 'down',
      tooltip: "Markup = (Receita Líquida – CPV) / CPV. Mede quanto o preço excede o custo."
    };
  })();
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    title: string;
    items: Array<{
      label: string;
      value: string;
      isNegative?: boolean;
    }>;
  }>({
    isOpen: false,
    title: "",
    items: []
  });
  const openModal = (title: string, items: any[]) => {
    setModalData({
      isOpen: true,
      title,
      items
    });
  };
  const closeModal = () => {
    setModalData({
      ...modalData,
      isOpen: false
    });
  };

  const handleExport = () => {
    // Remove unused function
  };
  return (
    <AppLayout>
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Title and Update Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">{titulo}</h2>
              {entidadeNome && (
                <p className="text-xs sm:text-sm text-muted-foreground/80 mb-1">
                  Você está vendo: {entidadeNome}
                </p>
              )}
              <p className="text-sm sm:text-base text-muted-foreground">Indicadores financeiros e análises em tempo real</p>
            </div>
            <div className="flex items-center gap-3">
              <DashboardExportButton />
              <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Última atualização: agora</p>
            </div>
          </div>

          {/* Filters */}
          <FilterBar />

          {/* Financial Metrics Grid - Responsive Layout */}
          <div className="space-y-4 sm:space-y-6">
            {/* Primary Metrics - 2x2 Grid on mobile, 4 columns on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <MetricCard title="RECEITA" value={data.receita.value} change={data.receita.change} trend={data.receita.trend} onClick={() => openModal("Análise Detalhada - Receita", [{
              label: "Receita Bruta",
              value: data.revenueComposition[0].amount,
              category: "primary"
            }, {
              label: "Impostos sobre Vendas",
              value: "R$ 1.800.000",
              isNegative: true
            }, {
              label: "Devoluções e Cancelamentos",
              value: "R$ 300.000",
              isNegative: true
            }, {
              label: "Descontos Comerciais",
              value: "R$ 150.000",
              isNegative: true
            }, {
              label: "Receita Líquida",
              value: data.receita.value,
              category: "calculation",
              isHighlighted: true
            }, {
              label: "Crescimento vs Nov 2024",
              value: data.receita.change,
              trend: data.receita.trend,
              category: "metric"
            }, {
              label: "Crescimento vs Dez 2023",
              value: "+12,5%",
              trend: "up",
              category: "metric"
            }, {
              label: "% do Orçado",
              value: "103,2%",
              trend: "up",
              category: "metric"
            }])} />
              
              <MetricCard title="LUCRO" value={data.lucro.value} change={data.lucro.change} trend={data.lucro.trend} onClick={() => openModal("Análise Detalhada - Lucro Bruto", [{
              label: "Receita Líquida",
              value: data.receita.value,
              category: "primary"
            }, {
              label: "Custo dos Produtos Vendidos",
              value: "R$ 7.650.000",
              isNegative: true
            }, {
              label: "Lucro Bruto",
              value: data.lucro.value,
              category: "calculation",
              isHighlighted: true
            }, {
              label: "Margem Bruta",
              value: data.margemBruta.value,
              category: "metric"
            }, {
              label: "Variação vs Nov 2024",
              value: data.lucro.change,
              trend: data.lucro.trend,
              category: "metric"
            }, {
              label: "Variação vs Dez 2023",
              value: "+15,8%",
              trend: "up",
              category: "metric"
            }, {
              label: "Meta Margem Bruta",
              value: "38,0%",
              category: "metric"
            }, {
              label: "Performance vs Meta",
              value: "+2,0 p.p.",
              trend: "up",
              category: "metric"
            }])} />
            
              <MetricCard title="EBITDA" value={data.ebitda.value} change={data.ebitda.change} trend={data.ebitda.trend} onClick={() => openModal("Análise Detalhada - EBITDA", [{
              label: "Lucro Bruto",
              value: data.lucro.value,
              category: "primary"
            }, {
              label: "Despesas Comerciais",
              value: data.expenseDistribution[0].amount,
              isNegative: true
            }, {
              label: "Despesas Administrativas",
              value: data.expenseDistribution[1].amount,
              isNegative: true
            }, {
              label: "EBITDA",
              value: data.ebitda.value,
              category: "calculation",
              isHighlighted: true
            }, {
              label: "Margem EBITDA",
              value: data.margemEbitda.value,
              category: "metric"
            }, {
              label: "EBITDA Orçado",
              value: "R$ 2.960.000",
              category: "metric"
            }, {
              label: "Variação vs Orçado",
              value: "+3,4%",
              trend: "up",
              category: "metric"
            }, {
              label: "Múltiplo EV/EBITDA",
              value: "8,5x",
              category: "metric"
            }])} />

              <MetricCard 
                title="ROE" 
                value={data.roe.value} 
                change={data.roe.change} 
                trend={data.roe.trend}
                onClick={() => openModal("Análise Detalhada - ROE", [
                  { label: "Lucro Líquido", value: "R$ 2.300.000", category: "primary" },
                  { label: "Patrimônio Líquido", value: "R$ 18.500.000", category: "primary" },
                  { label: "ROE", value: data.roe.value, isHighlighted: true, category: "metric" },
                  { label: "ROE Anualizado", value: "14,9%", category: "metric" },
                  { label: "Benchmark Setor", value: "11,2%", category: "metric" },
                  { label: "Performance vs Setor", value: "+3,7 p.p.", trend: "up", category: "metric" },
                  { label: "Custo do Capital", value: "9,8%", category: "metric" }
                ])}
              />
            </div>

            {/* Secondary Metrics - 1 column on mobile, 4 columns on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <MetricCard 
                title="MARGEM BRUTA" 
                value={data.margemBruta.value} 
                change={data.margemBruta.change} 
                trend={data.margemBruta.trend} 
                onClick={() => openModal("Análise Detalhada - Margem Bruta", [
                  { label: "Receita Líquida", value: data.receita.value, category: "primary" },
                  { label: "Custo dos Produtos", value: "R$ 7.650.000", isNegative: true },
                  { label: "Lucro Bruto", value: data.lucro.value, category: "calculation" },
                  { label: "Margem Bruta", value: data.margemBruta.value, isHighlighted: true, category: "metric" },
                  { label: "Variação vs Nov", value: data.margemBruta.change, trend: data.margemBruta.trend, category: "metric" },
                  { label: "Meta do Período", value: "38,0%", category: "metric" },
                  { label: "Performance vs Meta", value: "+2,0 p.p.", trend: "up", category: "metric" }
                ])}
              />
              <MetricCard 
                title="MARGEM EBITDA" 
                value={data.margemEbitda.value} 
                change={data.margemEbitda.change} 
                trend={data.margemEbitda.trend}
                onClick={() => openModal("Análise Detalhada - Margem EBITDA", [
                  { label: "EBITDA", value: data.ebitda.value, category: "primary" },
                  { label: "Receita Líquida", value: data.receita.value, category: "primary" },
                  { label: "Margem EBITDA", value: data.margemEbitda.value, isHighlighted: true, category: "metric" },
                  { label: "Benchmark Setor", value: "22,0%", category: "metric" },
                  { label: "Performance vs Setor", value: "+2,0 p.p.", trend: "up", category: "metric" },
                  { label: "EBITDA Orçado", value: "R$ 2.960.000", category: "metric" },
                  { label: "Realização vs Orçado", value: "103,4%", trend: "up", category: "metric" }
                ])}
              />
              <MetricCard 
                title="MARGEM LÍQUIDA" 
                value={data.margemLiquida.value} 
                change={data.margemLiquida.change} 
                trend={data.margemLiquida.trend}
                onClick={() => openModal("Análise Detalhada - Margem Líquida", [
                  { label: "Lucro Líquido", value: "R$ 2.300.000", category: "primary" },
                  { label: "Receita Líquida", value: data.receita.value, category: "primary" },
                  { label: "Margem Líquida", value: data.margemLiquida.value, isHighlighted: true, category: "metric" },
                  { label: "Resultado Financeiro", value: "-R$ 150.000", isNegative: true },
                  { label: "IR e CSLL", value: "-R$ 680.000", isNegative: true },
                  { label: "Benchmark Setor", value: "16,5%", category: "metric" },
                  { label: "Performance vs Setor", value: "+1,5 p.p.", trend: "up", category: "metric" }
                ])}
              />
              <MetricCard 
                title="MARKUP" 
                value={markupData.value} 
                change={markupData.change} 
                trend={markupData.trend}
                onClick={() => openModal("Análise Detalhada - Markup", [
                  { label: "Receita Líquida", value: data.receita.value, category: "primary" },
                  { label: "Lucro Bruto", value: data.lucro.value, category: "primary" },
                  { label: "CPV (Custo dos Produtos Vendidos)", value: cpv > 0 ? `R$ ${cpv.toLocaleString('pt-BR')}` : "—", isNegative: cpv > 0, category: "calculation" },
                  { label: "Markup", value: markupData.value, isHighlighted: true, category: "metric" },
                  { label: "Fórmula", value: "(Receita Líquida – CPV) / CPV", category: "metric" },
                  { label: "Variação vs Período Anterior", value: markupData.change, trend: markupData.trend, category: "metric" },
                  { label: "Benchmark Setor", value: "65,0%", category: "metric" },
                  { label: "Performance vs Setor", value: "+1,7 p.p.", trend: "up", category: "metric" }
                ])}
              />
            </div>
          </div>

          {/* Auto Insights */}
          <AutoInsights />

          {/* Enhanced DRE Section */}
          <ResultsDemo />

          {/* Charts and Analysis Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <PieChartCard title="Composição da Receita" data={data.revenueComposition} total={data.receita.value} onViewDetails={() => openModal("Análise Detalhada - Receita", [{
              label: "Receita Bruta",
              value: data.revenueComposition[0].amount,
              category: "primary"
            }, {
              label: "Impostos e Deduções",
              value: data.revenueComposition[1].amount,
              isNegative: true
            }, {
              label: "Receita Operacional",
              value: data.receita.value,
              category: "calculation",
              isHighlighted: true
            }])} />
          </div>

            <div>
              <PieChartCard title="Distribuição de Despesas" data={data.expenseDistribution} total={`R$ ${(parseInt(data.expenseDistribution[0].amount.replace(/[^\d]/g, '')) + parseInt(data.expenseDistribution[1].amount.replace(/[^\d]/g, ''))).toLocaleString('pt-BR')}`} onViewDetails={() => openModal("Análise Detalhada - Despesas", [{
              label: "Despesas de Vendas",
              value: data.expenseDistribution[0].amount,
              category: "primary"
            }, {
              label: "Despesas Administrativas",
              value: data.expenseDistribution[1].amount,
              category: "primary"
            }, {
              label: "Total de Despesas",
              value: `R$ ${(parseInt(data.expenseDistribution[0].amount.replace(/[^\d]/g, '')) + parseInt(data.expenseDistribution[1].amount.replace(/[^\d]/g, ''))).toLocaleString('pt-BR')}`,
              category: "calculation",
              isHighlighted: true
            }])} />
            </div>
          </div>

          {/* Profit Formation Chart */}
          <LucroFormationChart />

          {/* DRE Analysis and Insights */}
          <DREAnalysisPanel />
          
          {/* DRE Comparison and Trends */}
          <DREComparison />

        </div>

      {/* Modal */}
      <DetailModal isOpen={modalData.isOpen} onClose={closeModal} title={modalData.title} items={modalData.items} />
    </AppLayout>
  );
};
export default Index;