import jsPDF from 'jspdf';
import { DashboardData, FilterState } from '@/contexts/DataContext';
import { PDFLayoutManager } from './pdf-layout-manager';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'analysis';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  sections: ReportSection[];
  defaultOptions: ReportOptions;
}

export interface ReportSection {
  title: string;
  type: 'header' | 'table' | 'chart' | 'text' | 'metrics' | 'summary';
  data?: any;
  config?: any;
}

export interface ReportOptions {
  incluirComparacao: boolean;
  incluirGraficos: boolean;
  incluirDetalhamento: boolean;
  incluirAssinatura: boolean;
  incluirRodape: boolean;
  formato: 'pdf' | 'excel' | 'csv';
  orientacao: 'portrait' | 'landscape';
  logoUrl?: string;
}

// Template definitions
export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'dre-gerencial',
    name: 'DRE Gerencial',
    description: 'Demonstrativo completo com análise de resultados e indicadores',
    category: 'financial',
    frequency: 'monthly',
    sections: [
      { title: 'Cabeçalho', type: 'header' },
      { title: 'DRE Resumido', type: 'table' },
      { title: 'Indicadores de Performance', type: 'metrics' },
      { title: 'Análise Comparativa', type: 'table' },
      { title: 'Resumo Executivo', type: 'summary' }
    ],
    defaultOptions: {
      incluirComparacao: true,
      incluirGraficos: true,
      incluirDetalhamento: true,
      incluirAssinatura: true,
      incluirRodape: true,
      formato: 'pdf',
      orientacao: 'portrait'
    }
  },
  {
    id: 'analise-custos',
    name: 'Análise de Custos',
    description: 'Relatório detalhado de custos diretos e indiretos por centro de custo',
    category: 'analysis',
    frequency: 'monthly',
    sections: [
      { title: 'Cabeçalho', type: 'header' },
      { title: 'Resumo de Custos', type: 'metrics' },
      { title: 'Custos por Centro', type: 'table' },
      { title: 'Evolução de Custos', type: 'chart' },
      { title: 'Análise de Variações', type: 'table' }
    ],
    defaultOptions: {
      incluirComparacao: true,
      incluirGraficos: true,
      incluirDetalhamento: true,
      incluirAssinatura: false,
      incluirRodape: true,
      formato: 'pdf',
      orientacao: 'landscape'
    }
  },
  {
    id: 'fluxo-caixa',
    name: 'Fluxo de Caixa',
    description: 'Demonstrativo detalhado de entradas e saídas de caixa',
    category: 'financial',
    frequency: 'weekly',
    sections: [
      { title: 'Cabeçalho', type: 'header' },
      { title: 'Saldo Inicial', type: 'metrics' },
      { title: 'Fluxo Operacional', type: 'table' },
      { title: 'Fluxo de Investimentos', type: 'table' },
      { title: 'Fluxo de Financiamentos', type: 'table' },
      { title: 'Saldo Final', type: 'summary' }
    ],
    defaultOptions: {
      incluirComparacao: false,
      incluirGraficos: false,
      incluirDetalhamento: true,
      incluirAssinatura: true,
      incluirRodape: true,
      formato: 'pdf',
      orientacao: 'portrait'
    }
  },
  {
    id: 'dashboard-executivo',
    name: 'Dashboard Executivo',
    description: 'Síntese visual dos principais KPIs e indicadores estratégicos',
    category: 'operational',
    frequency: 'weekly',
    sections: [
      { title: 'Cabeçalho', type: 'header' },
      { title: 'KPIs Principais', type: 'metrics' },
      { title: 'Gráficos de Tendência', type: 'chart' },
      { title: 'Alertas e Observações', type: 'text' }
    ],
    defaultOptions: {
      incluirComparacao: true,
      incluirGraficos: true,
      incluirDetalhamento: false,
      incluirAssinatura: false,
      incluirRodape: true,
      formato: 'pdf',
      orientacao: 'landscape'
    }
  },
  {
    id: 'analise-margem',
    name: 'Análise de Margem',
    description: 'Relatório detalhado de margens por produto e linha de negócio',
    category: 'analysis',
    frequency: 'monthly',
    sections: [
      { title: 'Cabeçalho', type: 'header' },
      { title: 'Margem Consolidada', type: 'metrics' },
      { title: 'Margem por Produto', type: 'table' },
      { title: 'Evolução das Margens', type: 'chart' },
      { title: 'Oportunidades de Melhoria', type: 'text' }
    ],
    defaultOptions: {
      incluirComparacao: true,
      incluirGraficos: true,
      incluirDetalhamento: true,
      incluirAssinatura: false,
      incluirRodape: true,
      formato: 'pdf',
      orientacao: 'portrait'
    }
  },
  {
    id: 'comparativo-periodos',
    name: 'Análise Comparativa',
    description: 'Comparação detalhada entre períodos, cenários ou entidades',
    category: 'analysis',
    frequency: 'quarterly',
    sections: [
      { title: 'Cabeçalho', type: 'header' },
      { title: 'Resumo Comparativo', type: 'metrics' },
      { title: 'Variações Principais', type: 'table' },
      { title: 'Gráficos Comparativos', type: 'chart' },
      { title: 'Análise de Desvios', type: 'text' }
    ],
    defaultOptions: {
      incluirComparacao: true,
      incluirGraficos: true,
      incluirDetalhamento: true,
      incluirAssinatura: true,
      incluirRodape: true,
      formato: 'pdf',
      orientacao: 'landscape'
    }
  }
];

export class ReportGenerator {
  private layout: PDFLayoutManager;

  constructor(options: ReportOptions) {
    // Initialize layout manager
    this.layout = new PDFLayoutManager();
  }

  generateFromTemplate(
    template: ReportTemplate, 
    data: DashboardData, 
    filters: FilterState, 
    options: ReportOptions
  ): jsPDF {
    // Generate the report using the new layout manager interface
    return this.layout.generateReport(
      template.name,
      data,
      filters,
      template.id
    );
  }

  private shouldIncludeSection(section: any, options: ReportOptions): boolean {
    // Always include required sections
    if (section.required) return true;
    
    // Include comparison sections only if comparison is enabled
    if (section.id.includes('comparison') || section.id.includes('comp')) {
      return options.incluirComparacao;
    }
    
    // Include detailed sections only if detailing is enabled
    if (section.id.includes('detailed') || section.id.includes('analysis')) {
      return options.incluirDetalhamento;
    }
    
    // Include chart sections only if graphics are enabled
    if (section.type === 'chart') {
      return options.incluirGraficos;
    }
    
    // Include all other sections by default
    return true;
  }
}

export function getTemplateById(id: string): ReportTemplate | undefined {
  return REPORT_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): ReportTemplate[] {
  return REPORT_TEMPLATES.filter(template => template.category === category);
}