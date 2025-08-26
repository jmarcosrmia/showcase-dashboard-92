import { DashboardData, FilterState } from '@/contexts/DataContext';

export class XMLGenerator {
  static generateReport(
    title: string,
    data: DashboardData,
    filters: FilterState,
    templateType: string
  ): void {
    let xmlContent = '';
    
    switch (templateType) {
      case 'dre-gerencial':
        xmlContent = this.generateDREXML(data, filters);
        break;
      case 'analise-margem':
        xmlContent = this.generateMarginXML(data, filters);
        break;
      case 'fluxo-caixa':
        xmlContent = this.generateCashFlowXML(data, filters);
        break;
      case 'analise-custos':
        xmlContent = this.generateCostXML(data, filters);
        break;
      case 'dashboard-executivo':
        xmlContent = this.generateExecutiveXML(data, filters);
        break;
      case 'comparativo-periodos':
        xmlContent = this.generateComparativeXML(data, filters);
        break;
      default:
        xmlContent = this.generateDefaultXML(data, filters);
    }
    
    // Create and download XML
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}.xml`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static generateDREXML(data: DashboardData, filters: FilterState): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<relatorio_financeiro>
  <cabecalho>
    <titulo>Demonstrativo de Resultado do Exercício - Codi Jeans</titulo>
    <periodo>${this.escapeXML(this.getPeriodString(filters))}</periodo>
    <entidade>${this.escapeXML(filters.entidade || 'Codi Jeans Ltda')}</entidade>
    <cenario>${this.escapeXML(filters.cenario || 'Real')}</cenario>
    <data_geracao>${new Date().toISOString()}</data_geracao>
    <data_formatada>${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</data_formatada>
  </cabecalho>
  
  <resumo_executivo>
    <indicadores>
      <indicador>
        <nome>Receita Líquida</nome>
        <valor>${this.escapeXML(data.receita.value)}</valor>
        <variacao>${this.escapeXML(data.receita.change)}</variacao>
        <tendencia>${data.receita.trend}</tendencia>
        <status>${data.receita.trend === 'up' ? 'positiva' : 'negativa'}</status>
      </indicador>
      <indicador>
        <nome>Lucro Líquido</nome>
        <valor>${this.escapeXML(data.lucro.value)}</valor>
        <variacao>${this.escapeXML(data.lucro.change)}</variacao>
        <tendencia>${data.lucro.trend}</tendencia>
        <status>${data.lucro.trend === 'up' ? 'positiva' : 'negativa'}</status>
      </indicador>
      <indicador>
        <nome>EBITDA</nome>
        <valor>${this.escapeXML(data.ebitda.value)}</valor>
        <variacao>${this.escapeXML(data.ebitda.change)}</variacao>
        <tendencia>${data.ebitda.trend}</tendencia>
        <status>${data.ebitda.trend === 'up' ? 'positiva' : 'negativa'}</status>
      </indicador>
      <indicador>
        <nome>Margem Bruta</nome>
        <valor>${this.escapeXML(data.margemBruta.value)}</valor>
        <variacao>${this.escapeXML(data.margemBruta.change)}</variacao>
        <tendencia>${data.margemBruta.trend}</tendencia>
        <status>${data.margemBruta.trend === 'up' ? 'positiva' : 'negativa'}</status>
      </indicador>
      <indicador>
        <nome>Margem EBITDA</nome>
        <valor>${this.escapeXML(data.margemEbitda.value)}</valor>
        <variacao>${this.escapeXML(data.margemEbitda.change)}</variacao>
        <tendencia>${data.margemEbitda.trend}</tendencia>
        <status>${data.margemEbitda.trend === 'up' ? 'positiva' : 'negativa'}</status>
      </indicador>
      <indicador>
        <nome>Margem Líquida</nome>
        <valor>${this.escapeXML(data.margemLiquida.value)}</valor>
        <variacao>${this.escapeXML(data.margemLiquida.change)}</variacao>
        <tendencia>${data.margemLiquida.trend}</tendencia>
        <status>${data.margemLiquida.trend === 'up' ? 'positiva' : 'negativa'}</status>
      </indicador>
      <indicador>
        <nome>ROE</nome>
        <valor>${this.escapeXML(data.roe.value)}</valor>
        <variacao>${this.escapeXML(data.roe.change)}</variacao>
        <tendencia>${data.roe.trend}</tendencia>
        <status>${data.roe.trend === 'up' ? 'positiva' : 'negativa'}</status>
      </indicador>
    </indicadores>
  </resumo_executivo>
  
  <dre_detalhado>
    <contas>
      <conta>
        <nome>RECEITA BRUTA</nome>
        <valor_atual>R$ 15.045.000</valor_atual>
        <periodo_anterior>R$ 14.200.000</periodo_anterior>
        <variacao_percentual>+5.9%</variacao_percentual>
        <percentual_receita>118.0%</percentual_receita>
      </conta>
      <conta>
        <nome>(-) Deduções da Receita</nome>
        <valor_atual>R$ (2.295.000)</valor_atual>
        <periodo_anterior>R$ (2.130.000)</periodo_anterior>
        <variacao_percentual>+7.7%</variacao_percentual>
        <percentual_receita>(18.0%)</percentual_receita>
      </conta>
      <conta>
        <nome>RECEITA LÍQUIDA</nome>
        <valor_atual>${this.escapeXML(data.receita.value)}</valor_atual>
        <periodo_anterior>R$ 12.070.000</periodo_anterior>
        <variacao_percentual>${this.escapeXML(data.receita.change)}</variacao_percentual>
        <percentual_receita>100.0%</percentual_receita>
      </conta>
      <conta>
        <nome>(-) Custo Produtos Vendidos</nome>
        <valor_atual>R$ (7.650.000)</valor_atual>
        <periodo_anterior>R$ (7.242.000)</periodo_anterior>
        <variacao_percentual>+5.6%</variacao_percentual>
        <percentual_receita>(60.0%)</percentual_receita>
      </conta>
      <conta>
        <nome>LUCRO BRUTO</nome>
        <valor_atual>R$ 5.100.000</valor_atual>
        <periodo_anterior>R$ 4.828.000</periodo_anterior>
        <variacao_percentual>+5.6%</variacao_percentual>
        <percentual_receita>40.0%</percentual_receita>
      </conta>
      <conta>
        <nome>(-) Despesas Operacionais</nome>
        <valor_atual>R$ (1.950.000)</valor_atual>
        <periodo_anterior>R$ (1.863.000)</periodo_anterior>
        <variacao_percentual>+4.7%</variacao_percentual>
        <percentual_receita>(15.3%)</percentual_receita>
      </conta>
      <conta>
        <nome>EBITDA</nome>
        <valor_atual>${this.escapeXML(data.ebitda.value)}</valor_atual>
        <periodo_anterior>R$ 2.965.000</periodo_anterior>
        <variacao_percentual>${this.escapeXML(data.ebitda.change)}</variacao_percentual>
        <percentual_receita>24.0%</percentual_receita>
      </conta>
      <conta>
        <nome>(-) Depreciação/Amortização</nome>
        <valor_atual>R$ (450.000)</valor_atual>
        <periodo_anterior>R$ (435.000)</periodo_anterior>
        <variacao_percentual>+3.4%</variacao_percentual>
        <percentual_receita>(3.5%)</percentual_receita>
      </conta>
      <conta>
        <nome>LUCRO OPERACIONAL</nome>
        <valor_atual>R$ 2.700.000</valor_atual>
        <periodo_anterior>R$ 2.530.000</periodo_anterior>
        <variacao_percentual>+6.7%</variacao_percentual>
        <percentual_receita>21.2%</percentual_receita>
      </conta>
      <conta>
        <nome>(+/-) Resultado Financeiro</nome>
        <valor_atual>R$ (450.000)</valor_atual>
        <periodo_anterior>R$ (358.000)</periodo_anterior>
        <variacao_percentual>+25.7%</variacao_percentual>
        <percentual_receita>(3.5%)</percentual_receita>
      </conta>
      <conta>
        <nome>LUCRO ANTES IR/CSLL</nome>
        <valor_atual>R$ 2.250.000</valor_atual>
        <periodo_anterior>R$ 2.172.000</periodo_anterior>
        <variacao_percentual>+3.6%</variacao_percentual>
        <percentual_receita>17.6%</percentual_receita>
      </conta>
      <conta>
        <nome>(-) IR e CSLL</nome>
        <valor_atual>R$ (765.000)</valor_atual>
        <periodo_anterior>R$ (738.000)</periodo_anterior>
        <variacao_percentual>+3.7%</variacao_percentual>
        <percentual_receita>(6.0%)</percentual_receita>
      </conta>
      <conta>
        <nome>LUCRO LÍQUIDO</nome>
        <valor_atual>${this.escapeXML(data.lucro.value)}</valor_atual>
        <periodo_anterior>R$ 1.434.000</periodo_anterior>
        <variacao_percentual>${this.escapeXML(data.lucro.change)}</variacao_percentual>
        <percentual_receita>11.6%</percentual_receita>
      </conta>
    </contas>
  </dre_detalhado>
  
  <composicao_receita>
    ${data.revenueComposition.map(item => `
    <item>
      <nome>${this.escapeXML(item.name)}</nome>
      <valor>${this.escapeXML(String(item.value))}</valor>
      <percentual>${this.escapeXML(item.percentage)}</percentual>
      <valor_monetario>${this.escapeXML(item.amount)}</valor_monetario>
    </item>`).join('')}
  </composicao_receita>
  
  <distribuicao_despesas>
    ${data.expenseDistribution.map(item => `
    <item>
      <nome>${this.escapeXML(item.name)}</nome>
      <valor>${this.escapeXML(String(item.value))}</valor>
      <percentual>${this.escapeXML(item.percentage)}</percentual>
      <valor_monetario>${this.escapeXML(item.amount)}</valor_monetario>
    </item>`).join('')}
  </distribuicao_despesas>
  
  <metadados>
    <sistema>Sistema Financeiro Codi Jeans</sistema>
    <versao>2.0</versao>
    <formato>XML</formato>
    <encoding>UTF-8</encoding>
  </metadados>
</relatorio_financeiro>`;
  }

  private static generateMarginXML(data: DashboardData, filters: FilterState): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<analise_margem>
  <cabecalho>
    <titulo>Análise de Margem por Produto</titulo>
    <periodo>${this.escapeXML(this.getPeriodString(filters))}</periodo>
    <data_geracao>${new Date().toISOString()}</data_geracao>
  </cabecalho>
  
  <resumo_margens>
    <indicador>
      <nome>Margem Bruta Média</nome>
      <valor>${this.escapeXML(data.margemBruta.value)}</valor>
      <variacao>${this.escapeXML(data.margemBruta.change)}</variacao>
    </indicador>
    <indicador>
      <nome>Margem Contribuição</nome>
      <valor>45.2%</valor>
      <variacao>+2.1pp</variacao>
    </indicador>
    <indicador>
      <nome>Margem EBITDA</nome>
      <valor>${this.escapeXML(data.margemEbitda.value)}</valor>
      <variacao>${this.escapeXML(data.margemEbitda.change)}</variacao>
    </indicador>
    <indicador>
      <nome>Produto Mais Rentável</nome>
      <valor>Jeans Premium</valor>
      <margem>52.8%</margem>
    </indicador>
    <indicador>
      <nome>Ticket Médio</nome>
      <valor>R$ 189,50</valor>
      <variacao>+8.7%</variacao>
    </indicador>
    <indicador>
      <nome>Volume Total</nome>
      <valor>67.3k un</valor>
      <variacao>+12.4%</variacao>
    </indicador>
  </resumo_margens>
  
  <produtos>
    <produto>
      <nome>Calça Jeans Premium</nome>
      <receita>R$ 4.590.000</receita>
      <custo_direto>R$ 2.204.400</custo_direto>
      <margem_bruta>R$ 2.385.600</margem_bruta>
      <percentual_margem>52.0%</percentual_margem>
      <volume>24.2k un</volume>
    </produto>
    <produto>
      <nome>Jaqueta Jeans</nome>
      <receita>R$ 3.315.000</receita>
      <custo_direto>R$ 2.155.750</custo_direto>
      <margem_bruta>R$ 1.159.250</margem_bruta>
      <percentual_margem>35.0%</percentual_margem>
      <volume>17.5k un</volume>
    </produto>
    <produto>
      <nome>Bermuda Jeans</nome>
      <receita>R$ 2.295.000</receita>
      <custo_direto>R$ 1.491.750</custo_direto>
      <margem_bruta>R$ 803.250</margem_bruta>
      <percentual_margem>35.0%</percentual_margem>
      <volume>15.3k un</volume>
    </produto>
    <produto>
      <nome>Saia Jeans</nome>
      <receita>R$ 1.530.000</receita>
      <custo_direto>R$ 918.000</custo_direto>
      <margem_bruta>R$ 612.000</margem_bruta>
      <percentual_margem>40.0%</percentual_margem>
      <volume>10.2k un</volume>
    </produto>
    <produto>
      <nome>Colete Jeans</nome>
      <receita>R$ 1.020.000</receita>
      <custo_direto>R$ 663.000</custo_direto>
      <margem_bruta>R$ 357.000</margem_bruta>
      <percentual_margem>35.0%</percentual_margem>
      <volume>6.8k un</volume>
    </produto>
  </produtos>
</analise_margem>`;
  }

  private static generateCashFlowXML(data: DashboardData, filters: FilterState): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<fluxo_caixa>
  <cabecalho>
    <titulo>Demonstrativo de Fluxo de Caixa</titulo>
    <periodo>${this.escapeXML(this.getPeriodString(filters))}</periodo>
    <data_geracao>${new Date().toISOString()}</data_geracao>
  </cabecalho>
  
  <posicao_caixa>
    <item>
      <nome>Saldo Inicial</nome>
      <valor>R$ 8.500.000</valor>
      <variacao>+12.3%</variacao>
    </item>
    <item>
      <nome>Geração Operacional</nome>
      <valor>R$ 3.060.000</valor>
      <variacao>+8.1%</variacao>
    </item>
    <item>
      <nome>Investimentos</nome>
      <valor>R$ (459.000)</valor>
      <variacao>-15.2%</variacao>
    </item>
    <item>
      <nome>Financiamentos</nome>
      <valor>R$ (850.000)</valor>
      <variacao>+22.5%</variacao>
    </item>
    <item>
      <nome>Saldo Final</nome>
      <valor>R$ 10.251.000</valor>
      <variacao>+20.6%</variacao>
    </item>
    <item>
      <nome>Variação Líquida</nome>
      <valor>R$ 1.751.000</valor>
      <variacao>+35.2%</variacao>
    </item>
  </posicao_caixa>
  
  <fluxo_operacional>
    <movimentacao>
      <descricao>Recebimento de Vendas</descricao>
      <valor>R$ 13.005.000</valor>
      <percentual_receita>102.0%</percentual_receita>
      <mes_anterior>R$ 12.350.000</mes_anterior>
    </movimentacao>
    <movimentacao>
      <descricao>(-) Pagto. Fornecedores</descricao>
      <valor>R$ (7.140.000)</valor>
      <percentual_receita>(56.0%)</percentual_receita>
      <mes_anterior>R$ (6.785.000)</mes_anterior>
    </movimentacao>
    <movimentacao>
      <descricao>(-) Pagto. Pessoal</descricao>
      <valor>R$ (1.530.000)</valor>
      <percentual_receita>(12.0%)</percentual_receita>
      <mes_anterior>R$ (1.485.000)</mes_anterior>
    </movimentacao>
    <movimentacao>
      <descricao>(-) Impostos e Taxas</descricao>
      <valor>R$ (765.000)</valor>
      <percentual_receita>(6.0%)</percentual_receita>
      <mes_anterior>R$ (735.000)</mes_anterior>
    </movimentacao>
    <movimentacao>
      <descricao>(-) Despesas Gerais</descricao>
      <valor>R$ (510.000)</valor>
      <percentual_receita>(4.0%)</percentual_receita>
      <mes_anterior>R$ (498.000)</mes_anterior>
    </movimentacao>
    <total>
      <descricao>CAIXA OPERACIONAL</descricao>
      <valor>R$ 3.060.000</valor>
      <percentual_receita>24.0%</percentual_receita>
      <mes_anterior>R$ 2.847.000</mes_anterior>
    </total>
  </fluxo_operacional>
</fluxo_caixa>`;
  }

  private static generateCostXML(data: DashboardData, filters: FilterState): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<analise_custos>
  <cabecalho>
    <titulo>Análise de Custos Detalhada</titulo>
    <periodo>${this.escapeXML(this.getPeriodString(filters))}</periodo>
    <data_geracao>${new Date().toISOString()}</data_geracao>
  </cabecalho>
  
  <resumo_custos>
    <item>
      <nome>Custo Total</nome>
      <valor>R$ 9.600.000</valor>
      <variacao>+5.8%</variacao>
    </item>
    <item>
      <nome>Custo Variável</nome>
      <valor>R$ 7.650.000</valor>
      <variacao>+5.6%</variacao>
    </item>
    <item>
      <nome>Custo Fixo</nome>
      <valor>R$ 1.950.000</valor>
      <variacao>+6.5%</variacao>
    </item>
    <item>
      <nome>Custo por Unidade</nome>
      <valor>R$ 142,60</valor>
      <variacao>-5.3%</variacao>
    </item>
    <item>
      <nome>% Custo/Receita</nome>
      <valor>75.3%</valor>
      <variacao>+0.4pp</variacao>
    </item>
    <item>
      <nome>Eficiência Produtiva</nome>
      <valor>94.2%</valor>
      <variacao>+2.1pp</variacao>
    </item>
  </resumo_custos>
  
  <centros_custo>
    <centro>
      <nome>Produção</nome>
      <custo_atual>R$ 7.650.000</custo_atual>
      <mes_anterior>R$ 7.242.000</mes_anterior>
      <variacao>+5.6%</variacao>
      <percentual_total>79.7%</percentual_total>
    </centro>
    <centro>
      <nome>Vendas e Marketing</nome>
      <custo_atual>R$ 1.218.750</custo_atual>
      <mes_anterior>R$ 1.163.625</mes_anterior>
      <variacao>+4.7%</variacao>
      <percentual_total>12.7%</percentual_total>
    </centro>
    <centro>
      <nome>Administrativo</nome>
      <custo_atual>R$ 731.250</custo_atual>
      <mes_anterior>R$ 699.375</mes_anterior>
      <variacao>+4.6%</variacao>
      <percentual_total>7.6%</percentual_total>
    </centro>
    <total>
      <nome>TOTAL CUSTOS</nome>
      <custo_atual>R$ 9.600.000</custo_atual>
      <mes_anterior>R$ 9.105.000</mes_anterior>
      <variacao>+5.4%</variacao>
      <percentual_total>100.0%</percentual_total>
    </total>
  </centros_custo>
</analise_custos>`;
  }

  private static generateExecutiveXML(data: DashboardData, filters: FilterState): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<dashboard_executivo>
  <cabecalho>
    <titulo>Dashboard Executivo</titulo>
    <periodo>${this.escapeXML(this.getPeriodString(filters))}</periodo>
    <data_geracao>${new Date().toISOString()}</data_geracao>
  </cabecalho>
  
  <kpis>
    <kpi>
      <nome>Receita</nome>
      <valor>${this.escapeXML(data.receita.value)}</valor>
      <variacao>${this.escapeXML(data.receita.change)}</variacao>
      <tendencia>${data.receita.trend}</tendencia>
      <status>${data.receita.trend === 'up' ? 'positiva' : 'negativa'}</status>
    </kpi>
    <kpi>
      <nome>EBITDA</nome>
      <valor>${this.escapeXML(data.ebitda.value)}</valor>
      <variacao>${this.escapeXML(data.ebitda.change)}</variacao>
      <tendencia>${data.ebitda.trend}</tendencia>
      <status>${data.ebitda.trend === 'up' ? 'positiva' : 'negativa'}</status>
    </kpi>
    <kpi>
      <nome>Margem EBITDA</nome>
      <valor>${this.escapeXML(data.margemEbitda.value)}</valor>
      <variacao>${this.escapeXML(data.margemEbitda.change)}</variacao>
      <tendencia>${data.margemEbitda.trend}</tendencia>
      <status>${data.margemEbitda.trend === 'up' ? 'positiva' : 'negativa'}</status>
    </kpi>
    <kpi>
      <nome>ROE</nome>
      <valor>${this.escapeXML(data.roe.value)}</valor>
      <variacao>${this.escapeXML(data.roe.change)}</variacao>
      <tendencia>${data.roe.trend}</tendencia>
      <status>${data.roe.trend === 'up' ? 'positiva' : 'negativa'}</status>
    </kpi>
    <kpi>
      <nome>Giro Estoque</nome>
      <valor>8.4x</valor>
      <variacao>+0.7x</variacao>
      <tendencia>up</tendencia>
      <status>positiva</status>
    </kpi>
    <kpi>
      <nome>Prazo Médio Receb.</nome>
      <valor>28 dias</valor>
      <variacao>-3 dias</variacao>
      <tendencia>up</tendencia>
      <status>positiva</status>
    </kpi>
  </kpis>
  
  <tendencias>
    ${data.trends.map(trend => `
    <tendencia>
      <nome>${this.escapeXML(trend.name)}</nome>
      <variacao>${this.escapeXML(trend.change)}</variacao>
      <direcao>${trend.trend}</direcao>
      <status>${trend.trend === 'up' ? 'positiva' : 'negativa'}</status>
    </tendencia>`).join('')}
  </tendencias>
</dashboard_executivo>`;
  }

  private static generateComparativeXML(data: DashboardData, filters: FilterState): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<analise_comparativa>
  <cabecalho>
    <titulo>Análise Comparativa de Períodos</titulo>
    <periodo>${this.escapeXML(this.getPeriodString(filters))}</periodo>
    <data_geracao>${new Date().toISOString()}</data_geracao>
  </cabecalho>
  
  <resumo_comparativo>
    <indicador>
      <nome>Crescimento Receita</nome>
      <valor>${this.escapeXML(data.receita.change)}</valor>
      <referencia>vs anterior</referencia>
    </indicador>
    <indicador>
      <nome>Evolução EBITDA</nome>
      <valor>${this.escapeXML(data.ebitda.change)}</valor>
      <referencia>vs anterior</referencia>
    </indicador>
    <indicador>
      <nome>Variação Margem</nome>
      <valor>${this.escapeXML(data.margemBruta.change)}</valor>
      <referencia>pontos base</referencia>
    </indicador>
    <indicador>
      <nome>Performance ROE</nome>
      <valor>${this.escapeXML(data.roe.change)}</valor>
      <referencia>vs meta</referencia>
    </indicador>
    <indicador>
      <nome>Crescimento YoY</nome>
      <valor>+18.4%</valor>
      <referencia>anualizado</referencia>
    </indicador>
    <indicador>
      <nome>Meta Atingimento</nome>
      <valor>104.2%</valor>
      <referencia>do orçado</referencia>
    </indicador>
  </resumo_comparativo>
  
  <evolucao_trimestral>
    <ano>2024</ano>
    <trimestres>
      <trimestre periodo="Q1">
        <receita_milhoes>30.6</receita_milhoes>
        <ebitda_milhoes>7.3</ebitda_milhoes>
        <margem_ebitda>23.9%</margem_ebitda>
        <roe>18.2%</roe>
        <giro_estoque>7.1</giro_estoque>
      </trimestre>
      <trimestre periodo="Q2">
        <receita_milhoes>33.2</receita_milhoes>
        <ebitda_milhoes>8.1</ebitda_milhoes>
        <margem_ebitda>24.4%</margem_ebitda>
        <roe>19.7%</roe>
        <giro_estoque>7.8</giro_estoque>
      </trimestre>
      <trimestre periodo="Q3">
        <receita_milhoes>35.8</receita_milhoes>
        <ebitda_milhoes>8.6</ebitda_milhoes>
        <margem_ebitda>24.0%</margem_ebitda>
        <roe>20.8%</roe>
        <giro_estoque>8.0</giro_estoque>
      </trimestre>
      <trimestre periodo="Q4">
        <receita_milhoes>38.3</receita_milhoes>
        <ebitda_milhoes>9.2</ebitda_milhoes>
        <margem_ebitda>24.0%</margem_ebitda>
        <roe>21.5%</roe>
        <giro_estoque>8.4</giro_estoque>
      </trimestre>
    </trimestres>
    <tendencias>
      <indicador nome="Receita">crescente</indicador>
      <indicador nome="EBITDA">crescente</indicador>
      <indicador nome="Margem EBITDA">estável</indicador>
      <indicador nome="ROE">crescente</indicador>
      <indicador nome="Giro Estoque">crescente</indicador>
    </tendencias>
  </evolucao_trimestral>
</analise_comparativa>`;
  }

  private static generateDefaultXML(data: DashboardData, filters: FilterState): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<relatorio_financeiro>
  <cabecalho>
    <titulo>Relatório Financeiro</titulo>
    <periodo>${this.escapeXML(this.getPeriodString(filters))}</periodo>
    <data_geracao>${new Date().toISOString()}</data_geracao>
  </cabecalho>
  
  <resumo_executivo>
    <indicador>
      <nome>Receita</nome>
      <valor>${this.escapeXML(data.receita.value)}</valor>
      <variacao>${this.escapeXML(data.receita.change)}</variacao>
    </indicador>
    <indicador>
      <nome>Lucro</nome>
      <valor>${this.escapeXML(data.lucro.value)}</valor>
      <variacao>${this.escapeXML(data.lucro.change)}</variacao>
    </indicador>
    <indicador>
      <nome>EBITDA</nome>
      <valor>${this.escapeXML(data.ebitda.value)}</valor>
      <variacao>${this.escapeXML(data.ebitda.change)}</variacao>
    </indicador>
  </resumo_executivo>
</relatorio_financeiro>`;
  }

  private static escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
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