import { DashboardData, FilterState } from '@/contexts/DataContext';

export class TXTGenerator {
  static generateReport(
    title: string,
    data: DashboardData,
    filters: FilterState,
    templateType: string
  ): void {
    let txtContent = '';
    
    switch (templateType) {
      case 'dre-gerencial':
        txtContent = this.generateDRETXT(data, filters);
        break;
      case 'analise-margem':
        txtContent = this.generateMarginTXT(data, filters);
        break;
      case 'fluxo-caixa':
        txtContent = this.generateCashFlowTXT(data, filters);
        break;
      case 'analise-custos':
        txtContent = this.generateCostTXT(data, filters);
        break;
      case 'dashboard-executivo':
        txtContent = this.generateExecutiveTXT(data, filters);
        break;
      case 'comparativo-periodos':
        txtContent = this.generateComparativeTXT(data, filters);
        break;
      default:
        txtContent = this.generateDefaultTXT(data, filters);
    }
    
    // Create and download TXT
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static generateDRETXT(data: DashboardData, filters: FilterState): string {
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║           DEMONSTRATIVO DE RESULTADO DO EXERCÍCIO - CODI JEANS               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│ INFORMAÇÕES DO RELATÓRIO                                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Período........: ${this.getPeriodString(filters).padEnd(60)} │
│ Entidade.......: ${(filters.entidade || 'Codi Jeans Ltda').padEnd(60)} │
│ Cenário........: ${(filters.cenario || 'Real').padEnd(60)} │
│ Data de Geração: ${(new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR')).padEnd(60)} │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ RESUMO EXECUTIVO - INDICADORES PRINCIPAIS                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ INDICADOR           │ VALOR ATUAL     │ VARIAÇÃO        │ TENDÊNCIA        │
├─────────────────────┼─────────────────┼─────────────────┼──────────────────┤
│ Receita Líquida     │ ${data.receita.value.padEnd(15)} │ ${data.receita.change.padEnd(15)} │ ${(data.receita.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(16)} │
│ Lucro Líquido       │ ${data.lucro.value.padEnd(15)} │ ${data.lucro.change.padEnd(15)} │ ${(data.lucro.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(16)} │
│ EBITDA              │ ${data.ebitda.value.padEnd(15)} │ ${data.ebitda.change.padEnd(15)} │ ${(data.ebitda.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(16)} │
│ Margem Bruta        │ ${data.margemBruta.value.padEnd(15)} │ ${data.margemBruta.change.padEnd(15)} │ ${(data.margemBruta.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(16)} │
│ Margem EBITDA       │ ${data.margemEbitda.value.padEnd(15)} │ ${data.margemEbitda.change.padEnd(15)} │ ${(data.margemEbitda.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(16)} │
│ Margem Líquida      │ ${data.margemLiquida.value.padEnd(15)} │ ${data.margemLiquida.change.padEnd(15)} │ ${(data.margemLiquida.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(16)} │
│ ROE                 │ ${data.roe.value.padEnd(15)} │ ${data.roe.change.padEnd(15)} │ ${(data.roe.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(16)} │
└─────────────────────┴─────────────────┴─────────────────┴──────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ DRE DETALHADO                                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ CONTA                        │ VALOR ATUAL     │ MÊS ANTERIOR    │ VAR. %     │
├──────────────────────────────┼─────────────────┼─────────────────┼────────────┤
│ RECEITA BRUTA                │ R$ 15.045.000   │ R$ 14.200.000   │   +5.9%    │
│ (-) Deduções da Receita      │ R$ (2.295.000)  │ R$ (2.130.000)  │   +7.7%    │
│ RECEITA LÍQUIDA              │ ${data.receita.value.padEnd(15)} │ R$ 12.070.000   │ ${data.receita.change.padEnd(10)} │
│ (-) Custo Produtos Vendidos  │ R$ (7.650.000)  │ R$ (7.242.000)  │   +5.6%    │
│ LUCRO BRUTO                  │ R$ 5.100.000    │ R$ 4.828.000    │   +5.6%    │
│ (-) Despesas Operacionais    │ R$ (1.950.000)  │ R$ (1.863.000)  │   +4.7%    │
│ EBITDA                       │ ${data.ebitda.value.padEnd(15)} │ R$ 2.965.000    │ ${data.ebitda.change.padEnd(10)} │
│ (-) Depreciação/Amortização  │ R$ (450.000)    │ R$ (435.000)    │   +3.4%    │
│ LUCRO OPERACIONAL            │ R$ 2.700.000    │ R$ 2.530.000    │   +6.7%    │
│ (+/-) Resultado Financeiro   │ R$ (450.000)    │ R$ (358.000)    │  +25.7%    │
│ LUCRO ANTES IR/CSLL          │ R$ 2.250.000    │ R$ 2.172.000    │   +3.6%    │
│ (-) IR e CSLL                │ R$ (765.000)    │ R$ (738.000)    │   +3.7%    │
│ LUCRO LÍQUIDO                │ ${data.lucro.value.padEnd(15)} │ R$ 1.434.000    │ ${data.lucro.change.padEnd(10)} │
└──────────────────────────────┴─────────────────┴─────────────────┴────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ COMPOSIÇÃO DA RECEITA                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
${data.revenueComposition.map(item => 
  `│ ${item.name.padEnd(30)} │ ${item.percentage.padEnd(15)} │ ${item.amount.padEnd(15)} │`
).join('\n')}
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ DISTRIBUIÇÃO DE DESPESAS                                                     │
├──────────────────────────────────────────────────────────────────────────────┤
${data.expenseDistribution.map(item => 
  `│ ${item.name.padEnd(30)} │ ${item.percentage.padEnd(15)} │ ${item.amount.padEnd(15)} │`
).join('\n')}
└──────────────────────────────────────────────────────────────────────────────┘

══════════════════════════════════════════════════════════════════════════════
Relatório gerado automaticamente pelo Sistema Financeiro Codi Jeans
Data: ${new Date().toLocaleDateString('pt-BR')} - Hora: ${new Date().toLocaleTimeString('pt-BR')}
══════════════════════════════════════════════════════════════════════════════
`;
  }

  private static generateMarginTXT(data: DashboardData, filters: FilterState): string {
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                     ANÁLISE DE MARGEM POR PRODUTO                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

Período: ${this.getPeriodString(filters)}
Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

┌──────────────────────────────────────────────────────────────────────────────┐
│ RESUMO DE MARGENS                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ INDICADOR                    │ VALOR           │ VARIAÇÃO                     │
├──────────────────────────────┼─────────────────┼──────────────────────────────┤
│ Margem Bruta Média           │ ${data.margemBruta.value.padEnd(15)} │ ${data.margemBruta.change.padEnd(28)} │
│ Margem Contribuição          │ 45.2%           │ +2.1pp                       │
│ Margem EBITDA                │ ${data.margemEbitda.value.padEnd(15)} │ ${data.margemEbitda.change.padEnd(28)} │
│ Produto Mais Rentável        │ Jeans Premium   │ 52.8%                        │
│ Ticket Médio                 │ R$ 189,50       │ +8.7%                        │
│ Volume Total                 │ 67.3k un        │ +12.4%                       │
└──────────────────────────────┴─────────────────┴──────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ ANÁLISE POR PRODUTO                                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ PRODUTO              │ RECEITA      │ CUSTO DIRETO │ MARGEM BRUTA │ % MARGEM │
├──────────────────────┼──────────────┼──────────────┼──────────────┼──────────┤
│ Calça Jeans Premium  │ R$ 4.590.000 │ R$ 2.204.400 │ R$ 2.385.600 │   52.0%  │
│ Jaqueta Jeans        │ R$ 3.315.000 │ R$ 2.155.750 │ R$ 1.159.250 │   35.0%  │
│ Bermuda Jeans        │ R$ 2.295.000 │ R$ 1.491.750 │ R$   803.250 │   35.0%  │
│ Saia Jeans           │ R$ 1.530.000 │ R$   918.000 │ R$   612.000 │   40.0%  │
│ Colete Jeans         │ R$ 1.020.000 │ R$   663.000 │ R$   357.000 │   35.0%  │
└──────────────────────┴──────────────┴──────────────┴──────────────┴──────────┘

══════════════════════════════════════════════════════════════════════════════
Sistema Financeiro Codi Jeans - Análise de Margem
══════════════════════════════════════════════════════════════════════════════
`;
  }

  private static generateCashFlowTXT(data: DashboardData, filters: FilterState): string {
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                      DEMONSTRATIVO DE FLUXO DE CAIXA                         ║
╚══════════════════════════════════════════════════════════════════════════════╝

Período: ${this.getPeriodString(filters)}
Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

┌──────────────────────────────────────────────────────────────────────────────┐
│ POSIÇÃO DE CAIXA                                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ ITEM                         │ VALOR           │ VARIAÇÃO                     │
├──────────────────────────────┼─────────────────┼──────────────────────────────┤
│ Saldo Inicial                │ R$ 8.500.000    │ +12.3%                       │
│ Geração Operacional          │ R$ 3.060.000    │ +8.1%                        │
│ Investimentos                │ R$ (459.000)    │ -15.2%                       │
│ Financiamentos               │ R$ (850.000)    │ +22.5%                       │
│ Saldo Final                  │ R$ 10.251.000   │ +20.6%                       │
│ Variação Líquida             │ R$ 1.751.000    │ +35.2%                       │
└──────────────────────────────┴─────────────────┴──────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FLUXO OPERACIONAL DETALHADO                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ DESCRIÇÃO                    │ VALOR           │ % RECEITA │ MÊS ANTERIOR     │
├──────────────────────────────┼─────────────────┼───────────┼──────────────────┤
│ Recebimento de Vendas        │ R$ 13.005.000   │  102.0%   │ R$ 12.350.000   │
│ (-) Pagto. Fornecedores      │ R$ (7.140.000)  │ (56.0%)   │ R$ (6.785.000)  │
│ (-) Pagto. Pessoal           │ R$ (1.530.000)  │ (12.0%)   │ R$ (1.485.000)  │
│ (-) Impostos e Taxas         │ R$   (765.000)  │  (6.0%)   │ R$   (735.000)  │
│ (-) Despesas Gerais          │ R$   (510.000)  │  (4.0%)   │ R$   (498.000)  │
├──────────────────────────────┼─────────────────┼───────────┼──────────────────┤
│ CAIXA OPERACIONAL            │ R$ 3.060.000    │  24.0%    │ R$ 2.847.000    │
└──────────────────────────────┴─────────────────┴───────────┴──────────────────┘

══════════════════════════════════════════════════════════════════════════════
Sistema Financeiro Codi Jeans - Fluxo de Caixa
══════════════════════════════════════════════════════════════════════════════
`;
  }

  private static generateCostTXT(data: DashboardData, filters: FilterState): string {
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                         ANÁLISE DE CUSTOS DETALHADA                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

Período: ${this.getPeriodString(filters)}
Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

┌──────────────────────────────────────────────────────────────────────────────┐
│ RESUMO DE CUSTOS                                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ ITEM                         │ VALOR           │ VARIAÇÃO                     │
├──────────────────────────────┼─────────────────┼──────────────────────────────┤
│ Custo Total                  │ R$ 9.600.000    │ +5.8%                        │
│ Custo Variável               │ R$ 7.650.000    │ +5.6%                        │
│ Custo Fixo                   │ R$ 1.950.000    │ +6.5%                        │
│ Custo por Unidade            │ R$ 142,60       │ -5.3%                        │
│ % Custo/Receita              │ 75.3%           │ +0.4pp                       │
│ Eficiência Produtiva         │ 94.2%           │ +2.1pp                       │
└──────────────────────────────┴─────────────────┴──────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ CUSTOS POR CENTRO DE CUSTO                                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ CENTRO DE CUSTO              │ CUSTO ATUAL     │ MÊS ANTERIOR │ VARIAÇÃO │ %  │
├──────────────────────────────┼─────────────────┼──────────────┼──────────┼────┤
│ Produção                     │ R$ 7.650.000    │ R$ 7.242.000 │   +5.6%  │79.7│
│ Vendas e Marketing           │ R$ 1.218.750    │ R$ 1.163.625 │   +4.7%  │12.7│
│ Administrativo               │ R$   731.250    │ R$   699.375 │   +4.6%  │ 7.6│
├──────────────────────────────┼─────────────────┼──────────────┼──────────┼────┤
│ TOTAL CUSTOS                 │ R$ 9.600.000    │ R$ 9.105.000 │   +5.4%  │100%│
└──────────────────────────────┴─────────────────┴──────────────┴──────────┴────┘

══════════════════════════════════════════════════════════════════════════════
Sistema Financeiro Codi Jeans - Análise de Custos
══════════════════════════════════════════════════════════════════════════════
`;
  }

  private static generateExecutiveTXT(data: DashboardData, filters: FilterState): string {
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                           DASHBOARD EXECUTIVO                                ║
╚══════════════════════════════════════════════════════════════════════════════╝

Período: ${this.getPeriodString(filters)}
Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

┌──────────────────────────────────────────────────────────────────────────────┐
│ INDICADORES CHAVE DE PERFORMANCE (KPIs)                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ KPI                          │ VALOR           │ VARIAÇÃO    │ TENDÊNCIA      │
├──────────────────────────────┼─────────────────┼─────────────┼────────────────┤
│ Receita                      │ ${data.receita.value.padEnd(15)} │ ${data.receita.change.padEnd(11)} │ ${(data.receita.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(14)} │
│ EBITDA                       │ ${data.ebitda.value.padEnd(15)} │ ${data.ebitda.change.padEnd(11)} │ ${(data.ebitda.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(14)} │
│ Margem EBITDA                │ ${data.margemEbitda.value.padEnd(15)} │ ${data.margemEbitda.change.padEnd(11)} │ ${(data.margemEbitda.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(14)} │
│ ROE                          │ ${data.roe.value.padEnd(15)} │ ${data.roe.change.padEnd(11)} │ ${(data.roe.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(14)} │
│ Giro Estoque                 │ 8.4x            │ +0.7x       │ ↗ Positiva     │
│ Prazo Médio Receb.           │ 28 dias         │ -3 dias     │ ↗ Positiva     │
└──────────────────────────────┴─────────────────┴─────────────┴────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ TENDÊNCIAS DE MERCADO E PERFORMANCE                                          │
├──────────────────────────────────────────────────────────────────────────────┤
${data.trends.map(trend => 
  `│ ${trend.name.padEnd(30)} │ ${trend.change.padEnd(15)} │ ${(trend.trend === 'up' ? '↗ Positiva' : '↘ Negativa').padEnd(28)} │`
).join('\n')}
└──────────────────────────────────────────────────────────────────────────────┘

══════════════════════════════════════════════════════════════════════════════
Sistema Financeiro Codi Jeans - Dashboard Executivo
══════════════════════════════════════════════════════════════════════════════
`;
  }

  private static generateComparativeTXT(data: DashboardData, filters: FilterState): string {
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                       ANÁLISE COMPARATIVA DE PERÍODOS                        ║
╚══════════════════════════════════════════════════════════════════════════════╝

Período: ${this.getPeriodString(filters)}
Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

┌──────────────────────────────────────────────────────────────────────────────┐
│ RESUMO COMPARATIVO                                                           │
├──────────────────────────────────────────────────────────────────────────────┤
│ INDICADOR                    │ VALOR           │ VARIAÇÃO                     │
├──────────────────────────────┼─────────────────┼──────────────────────────────┤
│ Crescimento Receita          │ ${data.receita.change.padEnd(15)} │ vs anterior                  │
│ Evolução EBITDA              │ ${data.ebitda.change.padEnd(15)} │ vs anterior                  │
│ Variação Margem              │ ${data.margemBruta.change.padEnd(15)} │ pontos base                  │
│ Performance ROE              │ ${data.roe.change.padEnd(15)} │ vs meta                      │
│ Crescimento YoY              │ +18.4%          │ anualizado                   │
│ Meta Atingimento             │ 104.2%          │ do orçado                    │
└──────────────────────────────┴─────────────────┴──────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ EVOLUÇÃO TRIMESTRAL 2024                                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│ INDICADOR            │ Q1 2024 │ Q2 2024 │ Q3 2024 │ Q4 2024 │ TENDÊNCIA    │
├──────────────────────┼─────────┼─────────┼─────────┼─────────┼──────────────┤
│ Receita (R$ mi)      │  30.6   │  33.2   │  35.8   │  38.3   │ ↗ Crescente  │
│ EBITDA (R$ mi)       │   7.3   │   8.1   │   8.6   │   9.2   │ ↗ Crescente  │
│ Margem EBITDA (%)    │ 23.9%   │ 24.4%   │ 24.0%   │ 24.0%   │ → Estável    │
│ ROE (%)              │ 18.2%   │ 19.7%   │ 20.8%   │ 21.5%   │ ↗ Crescente  │
│ Giro Estoque (x)     │   7.1   │   7.8   │   8.0   │   8.4   │ ↗ Crescente  │
└──────────────────────┴─────────┴─────────┴─────────┴─────────┴──────────────┘

══════════════════════════════════════════════════════════════════════════════
Sistema Financeiro Codi Jeans - Análise Comparativa
══════════════════════════════════════════════════════════════════════════════
`;
  }

  private static generateDefaultTXT(data: DashboardData, filters: FilterState): string {
    return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                            RELATÓRIO FINANCEIRO                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

Período: ${this.getPeriodString(filters)}
Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}

┌──────────────────────────────────────────────────────────────────────────────┐
│ RESUMO EXECUTIVO                                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ INDICADOR                    │ VALOR           │ VARIAÇÃO                     │
├──────────────────────────────┼─────────────────┼──────────────────────────────┤
│ Receita                      │ ${data.receita.value.padEnd(15)} │ ${data.receita.change.padEnd(28)} │
│ Lucro                        │ ${data.lucro.value.padEnd(15)} │ ${data.lucro.change.padEnd(28)} │
│ EBITDA                       │ ${data.ebitda.value.padEnd(15)} │ ${data.ebitda.change.padEnd(28)} │
└──────────────────────────────┴─────────────────┴──────────────────────────────┘

══════════════════════════════════════════════════════════════════════════════
Sistema Financeiro Codi Jeans
══════════════════════════════════════════════════════════════════════════════
`;
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