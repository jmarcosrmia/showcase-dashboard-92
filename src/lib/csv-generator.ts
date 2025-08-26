
import { DashboardData, FilterState } from '@/contexts/DataContext';

export class CSVGenerator {
  static generateReport(
    title: string,
    data: DashboardData,
    filters: FilterState,
    templateType: string
  ): void {
    let csvContent = '';
    
    switch (templateType) {
      case 'dre-gerencial':
        csvContent = this.generateDRECSV(data, filters);
        break;
      case 'analise-margem':
        csvContent = this.generateMarginCSV(data, filters);
        break;
      case 'fluxo-caixa':
        csvContent = this.generateCashFlowCSV(data, filters);
        break;
      case 'analise-custos':
        csvContent = this.generateCostCSV(data, filters);
        break;
      case 'dashboard-executivo':
        csvContent = this.generateExecutiveCSV(data, filters);
        break;
      case 'comparativo-periodos':
        csvContent = this.generateComparativeCSV(data, filters);
        break;
      default:
        csvContent = this.generateDefaultCSV(data, filters);
    }
    
    // Create and download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static generateDRECSV(data: DashboardData, filters: FilterState): string {
    const lines = [
      '═══════════════════════════════════════════════════════════════',
      'DEMONSTRATIVO DE RESULTADO DO EXERCÍCIO - CODI JEANS',
      '═══════════════════════════════════════════════════════════════',
      '',
      `Período:,${this.getPeriodString(filters)}`,
      `Entidade:,${filters.entidade || 'Codi Jeans Ltda'}`,
      `Cenário:,${filters.cenario || 'Real'}`,
      `Gerado em:,${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      '',
      '┌─────────────────────────────────────────────────────────────┐',
      '│                    RESUMO EXECUTIVO                         │',
      '└─────────────────────────────────────────────────────────────┘',
      '',
      'Indicador,Valor Atual,Variação,Tendência,Performance',
      `Receita Líquida,${data.receita.value},${data.receita.change},${data.receita.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      `Lucro Líquido,${data.lucro.value},${data.lucro.change},${data.lucro.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      `EBITDA,${data.ebitda.value},${data.ebitda.change},${data.ebitda.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      `Margem Bruta,${data.margemBruta.value},${data.margemBruta.change},${data.margemBruta.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      `Margem EBITDA,${data.margemEbitda.value},${data.margemEbitda.change},${data.margemEbitda.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      `Margem Líquida,${data.margemLiquida.value},${data.margemLiquida.change},${data.margemLiquida.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      '',
      'DRE DETALHADO',
      'Conta,Valor Atual,Período Anterior,Variação %,% Receita',
      'RECEITA BRUTA,R$ 15.045.000,R$ 14.200.000,+5.9%,118.0%',
      '(-) Deduções da Receita,R$ (2.295.000),R$ (2.130.000),+7.7%,(18.0%)',
      `RECEITA LÍQUIDA,${data.receita.value},R$ 12.070.000,${data.receita.change},100.0%`,
      '(-) Custo Produtos Vendidos,R$ (7.650.000),R$ (7.242.000),+5.6%,(60.0%)',
      'LUCRO BRUTO,R$ 5.100.000,R$ 4.828.000,+5.6%,40.0%',
      '(-) Despesas Operacionais,R$ (1.950.000),R$ (1.863.000),+4.7%,(15.3%)',
      `EBITDA,${data.ebitda.value},R$ 2.965.000,${data.ebitda.change},24.0%`,
      '(-) Depreciação/Amortização,R$ (450.000),R$ (435.000),+3.4%,(3.5%)',
      'LUCRO OPERACIONAL,R$ 2.700.000,R$ 2.530.000,+6.7%,21.2%',
      '(+/-) Resultado Financeiro,R$ (450.000),R$ (358.000),+25.7%,(3.5%)',
      'LUCRO ANTES IR/CSLL,R$ 2.250.000,R$ 2.172.000,+3.6%,17.6%',
      '(-) IR e CSLL,R$ (765.000),R$ (738.000),+3.7%,(6.0%)',
      `LUCRO LÍQUIDO,${data.lucro.value},R$ 1.434.000,${data.lucro.change},11.6%`,
      '',
      'COMPOSIÇÃO DA RECEITA',
      'Item,Percentual,Valor',
      ...data.revenueComposition.map(item => `${item.name},${item.percentage},${item.amount}`),
      '',
      'DISTRIBUIÇÃO DE DESPESAS',
      'Item,Percentual,Valor',
      ...data.expenseDistribution.map(item => `${item.name},${item.percentage},${item.amount}`)
    ];
    
    return lines.join('\n');
  }

  private static generateMarginCSV(data: DashboardData, filters: FilterState): string {
    const lines = [
      'ANÁLISE DE MARGEM POR PRODUTO',
      `Período,${this.getPeriodString(filters)}`,
      '',
      'RESUMO DE MARGENS',
      'Indicador,Valor,Variação',
      `Margem Bruta Média,${data.margemBruta.value},${data.margemBruta.change}`,
      'Margem Contribuição,45.2%,+2.1pp',
      `Margem EBITDA,${data.margemEbitda.value},${data.margemEbitda.change}`,
      'Produto Mais Rentável,Jeans Premium,52.8%',
      'Ticket Médio,R$ 189.50,+8.7%',
      'Volume Total,67.3k un,+12.4%',
      '',
      'ANÁLISE POR PRODUTO',
      'Produto,Receita,Custo Direto,Margem Bruta,% Margem,Volume',
      'Calça Jeans Premium,R$ 4.590.000,R$ 2.204.400,R$ 2.385.600,52.0%,24.2k un',
      'Jaqueta Jeans,R$ 3.315.000,R$ 2.155.750,R$ 1.159.250,35.0%,17.5k un',
      'Bermuda Jeans,R$ 2.295.000,R$ 1.491.750,R$ 803.250,35.0%,15.3k un',
      'Saia Jeans,R$ 1.530.000,R$ 918.000,R$ 612.000,40.0%,10.2k un',
      'Colete Jeans,R$ 1.020.000,R$ 663.000,R$ 357.000,35.0%,6.8k un'
    ];
    
    return lines.join('\n');
  }

  private static generateCashFlowCSV(data: DashboardData, filters: FilterState): string {
    const lines = [
      'DEMONSTRATIVO DE FLUXO DE CAIXA',
      `Período,${this.getPeriodString(filters)}`,
      '',
      'POSIÇÃO DE CAIXA',
      'Item,Valor,Variação',
      'Saldo Inicial,R$ 8.500.000,+12.3%',
      'Geração Operacional,R$ 3.060.000,+8.1%',
      'Investimentos,R$ (459.000),-15.2%',
      'Financiamentos,R$ (850.000),+22.5%',
      'Saldo Final,R$ 10.251.000,+20.6%',
      'Variação Líquida,R$ 1.751.000,+35.2%',
      '',
      'FLUXO OPERACIONAL',
      'Descrição,Valor,% Receita,Mês Anterior',
      'Recebimento de Vendas,R$ 13.005.000,102.0%,R$ 12.350.000',
      '(-) Pagto. Fornecedores,R$ (7.140.000),(56.0%),R$ (6.785.000)',
      '(-) Pagto. Pessoal,R$ (1.530.000),(12.0%),R$ (1.485.000)',
      '(-) Impostos e Taxas,R$ (765.000),(6.0%),R$ (735.000)',
      '(-) Despesas Gerais,R$ (510.000),(4.0%),R$ (498.000)',
      'CAIXA OPERACIONAL,R$ 3.060.000,24.0%,R$ 2.847.000'
    ];
    
    return lines.join('\n');
  }

  private static generateCostCSV(data: DashboardData, filters: FilterState): string {
    const lines = [
      'ANÁLISE DE CUSTOS DETALHADA',
      `Período,${this.getPeriodString(filters)}`,
      '',
      'RESUMO DE CUSTOS',
      'Item,Valor,Variação',
      'Custo Total,R$ 9.600.000,+5.8%',
      'Custo Variável,R$ 7.650.000,+5.6%',
      'Custo Fixo,R$ 1.950.000,+6.5%',
      'Custo por Unidade,R$ 142.60,-5.3%',
      '% Custo/Receita,75.3%,+0.4pp',
      'Eficiência Produtiva,94.2%,+2.1pp',
      '',
      'CUSTOS POR CENTRO DE CUSTO',
      'Centro de Custo,Custo Atual,Mês Anterior,Variação,% Total',
      'Produção,R$ 7.650.000,R$ 7.242.000,+5.6%,79.7%',
      'Vendas e Marketing,R$ 1.218.750,R$ 1.163.625,+4.7%,12.7%',
      'Administrativo,R$ 731.250,R$ 699.375,+4.6%,7.6%',
      'TOTAL CUSTOS,R$ 9.600.000,R$ 9.105.000,+5.4%,100.0%'
    ];
    
    return lines.join('\n');
  }

  private static generateExecutiveCSV(data: DashboardData, filters: FilterState): string {
    const lines = [
      'DASHBOARD EXECUTIVO',
      `Período,${this.getPeriodString(filters)}`,
      '',
      'INDICADORES CHAVE DE PERFORMANCE',
      'KPI,Valor,Variação,Tendência',
      `Receita,${data.receita.value},${data.receita.change},${data.receita.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      `EBITDA,${data.ebitda.value},${data.ebitda.change},${data.ebitda.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      `Margem EBITDA,${data.margemEbitda.value},${data.margemEbitda.change},${data.margemEbitda.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      `ROE,${data.roe.value},${data.roe.change},${data.roe.trend === 'up' ? 'Positiva' : 'Negativa'}`,
      'Giro Estoque,8.4x,+0.7x,Positiva',
      'Prazo Médio Receb.,28 dias,-3 dias,Positiva',
      '',
      'TENDÊNCIAS',
      'Indicador,Variação,Tendência',
      ...data.trends.map(trend => `${trend.name},${trend.change},${trend.trend === 'up' ? 'Positiva' : 'Negativa'}`)
    ];
    
    return lines.join('\n');
  }

  private static generateComparativeCSV(data: DashboardData, filters: FilterState): string {
    const lines = [
      'ANÁLISE COMPARATIVA DE PERÍODOS',
      `Período,${this.getPeriodString(filters)}`,
      '',
      'RESUMO COMPARATIVO',
      'Indicador,Valor,Variação',
      `Crescimento Receita,${data.receita.change},vs anterior`,
      `Evolução EBITDA,${data.ebitda.change},vs anterior`,
      `Variação Margem,${data.margemBruta.change},pontos base`,
      `Performance ROE,${data.roe.change},vs meta`,
      'Crescimento YoY,+18.4%,anualizado',
      'Meta Atingimento,104.2%,do orçado',
      '',
      'EVOLUÇÃO TRIMESTRAL',
      'Indicador,Q1 2024,Q2 2024,Q3 2024,Q4 2024,Tendência',
      'Receita (R$ mi),30.6,33.2,35.8,38.3,Crescente',
      'EBITDA (R$ mi),7.3,8.1,8.6,9.2,Crescente',
      'Margem EBITDA (%),23.9%,24.4%,24.0%,24.0%,Estável',
      'ROE (%),18.2%,19.7%,20.8%,21.5%,Crescente',
      'Giro Estoque (x),7.1,7.8,8.0,8.4,Crescente'
    ];
    
    return lines.join('\n');
  }

  private static generateDefaultCSV(data: DashboardData, filters: FilterState): string {
    const lines = [
      'RELATÓRIO FINANCEIRO',
      `Período,${this.getPeriodString(filters)}`,
      '',
      'RESUMO EXECUTIVO',
      'Indicador,Valor,Variação',
      `Receita,${data.receita.value},${data.receita.change}`,
      `Lucro,${data.lucro.value},${data.lucro.change}`,
      `EBITDA,${data.ebitda.value},${data.ebitda.change}`
    ];
    
    return lines.join('\n');
  }

  private static getPeriodString(filters: FilterState): string {
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
    return `${filters.periodoInicial} a ${filters.periodoFinal}`;
  }
}
