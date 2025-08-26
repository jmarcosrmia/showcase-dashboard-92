import jsPDF from 'jspdf';
import { DashboardData, FilterState } from '@/contexts/DataContext';

export class PDFLayoutManager {
  private doc: jsPDF;
  private currentY: number = 25;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private contentWidth: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.contentWidth = this.pageWidth - (this.margin * 2);
  }

  // Exact header format matching the reference
  addCodiHeader(reportType: string, period: string): void {
    // Header bar with company name and report info
    this.doc.setFillColor(45, 55, 72); // Dark blue background
    this.doc.rect(0, 0, this.pageWidth, 20, 'F');
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`CODI JEANS — ${reportType} — ${period}`, this.margin, 12);
    
    this.currentY = 35;
  }

  // Main title exactly like the reference
  addMainTitle(title: string): void {
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 15;
  }

  // Metadata section matching reference style
  addMetadata(period: string, entity: string = 'Codi Jeans Ltda', confidential: string = 'Confidencial — Uso Interno'): void {
    this.doc.setFontSize(9);
    this.doc.setTextColor(120, 120, 120);
    this.doc.setFont('helvetica', 'normal');
    
    this.doc.text(`Período: ${period}`, this.margin, this.currentY);
    this.currentY += 6;
    
    this.doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })}`, this.margin, this.currentY);
    this.currentY += 6;
    
    this.doc.text(confidential, this.margin, this.currentY);
    this.currentY += 15;
  }

  // Section headers exactly like reference
  addSectionHeader(title: string): void {
    this.checkPageBreak(25);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 10;
  }

  // Executive summary table matching reference style
  addExecutiveSummaryTable(data: DashboardData): void {
    this.addSectionHeader('Resumo Executivo');
    
    const tableData = [
      ['Indicador', 'Valor', 'Variação'],
      ['Receita Líquida', data.receita.value, data.receita.change],
      ['Lucro Líquido', data.lucro.value, data.lucro.change],
      ['EBITDA', data.ebitda.value, data.ebitda.change],
      ['Margem Bruta', data.margemBruta.value, data.margemBruta.change],
      ['Margem EBITDA', data.margemEbitda.value, data.margemEbitda.change],
      ['Margem Líquida', data.margemLiquida.value, data.margemLiquida.change]
    ];

    this.addStyledTable(tableData);
  }

  // Styled table exactly matching reference format
  addStyledTable(data: string[][], hasHeader: boolean = true): void {
    const rowHeight = 7;
    const colWidths = [70, 50, 50]; // Adjust based on content
    
    this.checkPageBreak(data.length * rowHeight + 10);
    
    data.forEach((row, index) => {
      const isHeader = hasHeader && index === 0;
      const isEvenRow = !isHeader && index % 2 === 0;
      
      // Header styling
      if (isHeader) {
        this.doc.setFillColor(70, 80, 95);
        this.doc.rect(this.margin, this.currentY - 5, this.contentWidth, rowHeight, 'F');
        this.doc.setTextColor(255, 255, 255);
        this.doc.setFont('helvetica', 'bold');
      } else {
        // Alternating row colors
        if (isEvenRow) {
          this.doc.setFillColor(248, 249, 250);
          this.doc.rect(this.margin, this.currentY - 5, this.contentWidth, rowHeight, 'F');
        }
        this.doc.setTextColor(0, 0, 0);
        this.doc.setFont('helvetica', 'normal');
      }
      
      this.doc.setFontSize(9);
      
      let xPos = this.margin + 3;
      row.forEach((cell, colIndex) => {
        this.doc.text(cell, xPos, this.currentY);
        xPos += colWidths[colIndex] || 50;
      });
      
      // Table borders
      this.doc.setDrawColor(200, 200, 200);
      this.doc.setLineWidth(0.1);
      this.doc.rect(this.margin, this.currentY - 5, this.contentWidth, rowHeight, 'S');
      
      this.currentY += rowHeight;
    });
    
    this.currentY += 10;
  }

  // Highlights section with orange background like reference
  addHighlightsSection(highlights: string[]): void {
    this.addSectionHeader('Destaques');
    
    // Orange background box
    this.doc.setFillColor(255, 237, 213);
    const boxHeight = highlights.length * 6 + 8;
    this.doc.rect(this.margin, this.currentY - 3, this.contentWidth, boxHeight, 'F');
    
    this.doc.setDrawColor(255, 193, 7);
    this.doc.setLineWidth(0.5);
    this.doc.rect(this.margin, this.currentY - 3, this.contentWidth, boxHeight, 'S');
    
    this.doc.setFontSize(9);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');
    
    highlights.forEach(highlight => {
      this.doc.text(`• ${highlight}`, this.margin + 5, this.currentY + 2);
      this.currentY += 6;
    });
    
    this.currentY += 12;
  }

  // Detailed DRE table matching reference
  addDetailedDRETable(): void {
    this.addSectionHeader('DRE Detalhado (R$)');
    
    const dreData = [
      ['Conta', 'Atual', 'Anterior', 'Var. %', '% Receita'],
      ['RECEITA BRUTA', '15.045.000', '14.200.000', '+5,9%', '118,0%'],
      ['(-) Deduções da Receita', '(2.295.000)', '(2.130.000)', '+7,7%', '(18,0%)'],
      ['RECEITA LÍQUIDA', '12.750.000', '12.070.000', '+5,3%', '100,0%'],
      ['(-) Custo dos Produtos Vendidos (CPV)', '(7.650.000)', '(7.242.000)', '+5,6%', '(60,0%)'],
      ['LUCRO BRUTO', '5.100.000', '4.828.000', '+5,6%', '40,0%'],
      ['(-) Despesas Operacionais', '(1.950.000)', '(1.863.000)', '+4,7%', '(15,3%)'],
      ['• Vendas e Marketing', '(1.218.750)', '(1.163.625)', '+4,7%', '(9,6%)'],
      ['• Administrativas', '(731.250)', '(699.375)', '+4,6%', '(5,7%)'],
      ['EBITDA', '3.060.000', '2.965.000', '+10,0%', '24,0%'],
      ['(-) Depreciação/Amortização', '(450.000)', '(435.000)', '+3,4%', '(3,5%)'],
      ['LUCRO OPERACIONAL (EBIT)', '2.700.000', '2.530.000', '+6,7%', '21,2%'],
      ['(+/-) Resultado Financeiro', '(450.000)', '(358.000)', '+25,7%', '(3,5%)'],
      ['LUCRO ANTES DE IR/CSLL', '2.250.000', '2.172.000', '+3,6%', '17,6%'],
      ['(-) IR e CSLL', '(765.000)', '(738.000)', '+3,7%', '(6,0%)'],
      ['LUCRO LÍQUIDO', '1.485.000', '1.434.000', '+3,6%', '11,6%']
    ];

    this.addStyledTable(dreData);
  }

  // Management analysis section like second page of reference
  addManagementAnalysis(data: DashboardData): void {
    this.addPage();
    
    this.addSectionHeader('Análise Gerencial');
    
    // Performance paragraph
    this.doc.setFontSize(9);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');
    
    const performanceText = `A receita líquida cresceu +5,3%, indicando expansão consistente das operações. O EBITDA atingiu R$ 3.060.000 (margem 23,5%), sugerindo eficiência operacional adequada.`;
    const lines1 = this.doc.splitTextToSize(performanceText, this.contentWidth);
    this.doc.text(lines1, this.margin, this.currentY);
    this.currentY += lines1.length * 5 + 8;
    
    // Profitability section
    this.addSectionHeader('Rentabilidade');
    const profitabilityText = `A margem bruta de 41,6% reflete controle de custos diretos. A margem líquida de 17,1% indica rentabilidade final satisfatória após tributos e resultado financeiro.`;
    const lines2 = this.doc.splitTextToSize(profitabilityText, this.contentWidth);
    this.doc.text(lines2, this.margin, this.currentY);
    this.currentY += lines2.length * 5 + 10;
    
    // Main highlights
    this.addSectionHeader('Principais Destaques');
    const highlights = [
      'Crescimento sustentável da receita.',
      'Controle efetivo de custos operacionais.',
      'Margens dentro de parâmetros setoriais.',
      'Geração de caixa operacional positiva.'
    ];
    
    highlights.forEach(highlight => {
      this.doc.text(`- ${highlight}`, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 10;
    
    // Recommendations section
    this.addSectionHeader('Recomendações');
    const recommendations = [
      'Manter foco em expansão controlada de vendas.',
      'Otimizar estrutura de custos variáveis (compras, logística, perdas).',
      'Acompanhar indicadores de eficiência (giro de estoque, prazo médio).',
      'Monitorar tendências de mercado e riscos de crédito.'
    ];
    
    recommendations.forEach(rec => {
      this.doc.text(`- ${rec}`, this.margin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 15;
    
    // Consistency observations box (orange)
    this.addConsistencyBox();
  }

  // Orange consistency box like in reference
  addConsistencyBox(): void {
    const boxHeight = 35;
    this.checkPageBreak(boxHeight);
    
    // Orange background
    this.doc.setFillColor(255, 237, 213);
    this.doc.rect(this.margin, this.currentY, this.contentWidth, boxHeight, 'F');
    
    this.doc.setDrawColor(255, 193, 7);
    this.doc.setLineWidth(0.8);
    this.doc.rect(this.margin, this.currentY, this.contentWidth, boxHeight, 'S');
    
    // Title
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Observações de Consistência (para conferência)', this.margin + 5, this.currentY + 8);
    
    // Content
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    
    const observations = [
      '• O Lucro Líquido aparece como R$ 5.100.000 no resumo e no fechamento da tabela.',
      'Considerando LAIR de R$ 2.250.000 e IR/CSLL de R$ 765.000, o valor esperado seria R$',
      '1.485.000. Recomenda-se validar a base de cálculo de IR/CSLL, eventuais créditos fiscais e/ou a',
      'classificação do Lucro Bruto vs. Lucro Líquido.'
    ];
    
    let yPos = this.currentY + 15;
    observations.forEach(obs => {
      this.doc.text(obs, this.margin + 8, yPos);
      yPos += 5;
    });
    
    this.currentY += boxHeight + 10;
  }

  // Page break management
  checkPageBreak(requiredHeight: number): boolean {
    if (this.currentY + requiredHeight > this.pageHeight - 30) {
      this.addPage();
      return true;
    }
    return false;
  }

  addPage(): void {
    this.doc.addPage();
    this.currentY = 25;
  }

  // Footer exactly like reference
  addFooter(pageNumber: number = 1): void {
    const footerY = this.pageHeight - 15;
    
    this.doc.setFontSize(8);
    this.doc.setTextColor(120, 120, 120);
    this.doc.setFont('helvetica', 'normal');
    
    this.doc.text('Relatório Confidencial — Uso Interno', this.margin, footerY);
    this.doc.text(`Página ${pageNumber}`, this.pageWidth - this.margin - 20, footerY);
  }

  // Generate different report types with exact reference styling
  generateReport(
    title: string,
    data: DashboardData,
    filters: FilterState,
    templateType: string
  ): jsPDF {
    const period = this.getPeriodString(filters);
    
    switch (templateType) {
      case 'dre-gerencial':
        this.generateDREReport(data, period);
        break;
      case 'analise-margem':
        this.generateMarginReport(data, period);
        break;
      case 'fluxo-caixa':
        this.generateCashFlowReport(data, period);
        break;
      case 'analise-custos':
        this.generateCostReport(data, period);
        break;
      case 'dashboard-executivo':
        this.generateExecutiveReport(data, period);
        break;
      case 'comparativo-periodos':
        this.generateComparativeReport(data, period);
        break;
      default:
        this.generateDREReport(data, period);
    }
    
    // Add footers to all pages
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.addFooter(i);
    }
    
    return this.doc;
  }

  private generateDREReport(data: DashboardData, period: string): void {
    this.addCodiHeader('DRE', period);
    this.addMainTitle('Demonstrativo de Resultado do Exercício (DRE)');
    this.addMetadata(period);
    
    this.addExecutiveSummaryTable(data);
    
    const highlights = [
      'Crescimento sustentável de receita e manutenção de margens.',
      'Eficiência operacional refletida no EBITDA.',
      'Rentabilidade final dentro de parâmetros saudáveis.'
    ];
    this.addHighlightsSection(highlights);
    
    this.addDetailedDRETable();
    this.addManagementAnalysis(data);
  }

  private generateMarginReport(data: DashboardData, period: string): void {
    this.addCodiHeader('MARGEM', period);
    this.addMainTitle('Análise de Margem por Produto');
    this.addMetadata(period);
    
    this.addExecutiveSummaryTable(data);
    
    const marginData = [
      ['Produto', 'Receita', 'Margem %', 'Volume'],
      ['Calça Jeans Premium', 'R$ 4.590.000', '52,0%', '24.2k un'],
      ['Jaqueta Jeans', 'R$ 3.315.000', '35,0%', '17.5k un'],
      ['Bermuda Jeans', 'R$ 2.295.000', '35,0%', '15.3k un'],
      ['Saia Jeans', 'R$ 1.530.000', '40,0%', '10.2k un']
    ];
    
    this.addStyledTable(marginData);
  }

  private generateCashFlowReport(data: DashboardData, period: string): void {
    this.addCodiHeader('FLUXO', period);
    this.addMainTitle('Demonstrativo de Fluxo de Caixa');
    this.addMetadata(period);
    
    const cashFlowData = [
      ['Item', 'Valor', 'Variação'],
      ['Saldo Inicial', 'R$ 8.500.000', '+12,3%'],
      ['Geração Operacional', 'R$ 3.060.000', '+8,1%'],
      ['Investimentos', 'R$ (459.000)', '-15,2%'],
      ['Saldo Final', 'R$ 10.251.000', '+20,6%']
    ];
    
    this.addStyledTable(cashFlowData);
  }

  private generateCostReport(data: DashboardData, period: string): void {
    this.addCodiHeader('CUSTOS', period);
    this.addMainTitle('Análise de Custos Detalhada');
    this.addMetadata(period);
    
    const costData = [
      ['Centro de Custo', 'Valor Atual', 'Variação', '% Total'],
      ['Produção', 'R$ 7.650.000', '+5,6%', '79,7%'],
      ['Vendas e Marketing', 'R$ 1.218.750', '+4,7%', '12,7%'],
      ['Administrativo', 'R$ 731.250', '+4,6%', '7,6%']
    ];
    
    this.addStyledTable(costData);
  }

  private generateExecutiveReport(data: DashboardData, period: string): void {
    this.addCodiHeader('EXEC', period);
    this.addMainTitle('Dashboard Executivo');
    this.addMetadata(period);
    
    this.addExecutiveSummaryTable(data);
    
    const kpiData = [
      ['KPI', 'Valor', 'Tendência'],
      ['Giro Estoque', '8,4x', '↑'],
      ['Prazo Médio Receb.', '28 dias', '↓'],
      ['ROE', data.roe.value, data.roe.trend === 'up' ? '↑' : '↓']
    ];
    
    this.addStyledTable(kpiData);
  }

  private generateComparativeReport(data: DashboardData, period: string): void {
    this.addCodiHeader('COMP', period);
    this.addMainTitle('Análise Comparativa de Períodos');
    this.addMetadata(period);
    
    const comparativeData = [
      ['Indicador', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      ['Receita (R$ mi)', '30,6', '33,2', '35,8', '38,3'],
      ['EBITDA (R$ mi)', '7,3', '8,1', '8,6', '9,2'],
      ['Margem EBITDA (%)', '23,9%', '24,4%', '24,0%', '24,0%']
    ];
    
    this.addStyledTable(comparativeData);
  }

  private getPeriodString(filters: FilterState): string {
    if (filters.tipoPeriodo === 'mes') {
      const periodMap: {[key: string]: string} = {
        'dezembro-2024': 'Dez/2024',
        'novembro-2024': 'Nov/2024',
        'outubro-2024': 'Out/2024',
        'q4-2024': 'Q4/2024',
        'ano-2024': 'Ano/2024'
      };
      return periodMap[filters.periodo] || filters.periodo;
    }
    return `${filters.periodoInicial} - ${filters.periodoFinal}`;
  }
}