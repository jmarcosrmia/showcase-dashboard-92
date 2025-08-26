import { FilterState } from "@/contexts/DataContext";

export type PeriodMode = 'month' | 'range';

export interface PeriodConfig {
  mode: PeriodMode;
  month?: string;
  startMonth?: string;
  endMonth?: string;
}

// Mapear valores para labels de exibição
export const getEntidadeLabel = (entidade: string): string => {
  const map: { [key: string]: string } = {
    'consolidado': 'Consolidado',
    'individual': 'Individual', 
    'filial1': 'Filial 1',
    'filial2': 'Filial 2'
  };
  return map[entidade] || 'Consolidado';
};

export const getCenarioLabel = (cenario: string): string => {
  const map: { [key: string]: string } = {
    'real': 'Real',
    'orcado': 'Orçado', 
    'forecast': 'Forecast',
    'projetado': 'Projetado',
    'realizado': 'Realizado'
  };
  return map[cenario] || 'Real';
};

export const getPeriodoLabel = (periodo: string): string => {
  const map: { [key: string]: string } = {
    'dezembro-2024': 'Dezembro/2024',
    'novembro-2024': 'Novembro/2024',
    'outubro-2024': 'Outubro/2024',
    'setembro-2024': 'Setembro/2024',
    'q4-2024': 'Q4/2024',
    'ano-2024': 'Ano/2024'
  };
  return map[periodo] || 'Dezembro/2024';
};

export const formatPeriodoRange = (periodoInicial: string, periodoFinal: string): string => {
  const formatMonth = (periodo: string): string => {
    const monthMap: { [key: string]: string } = {
      'janeiro-2024': 'Jan/2024',
      'fevereiro-2024': 'Fev/2024', 
      'marco-2024': 'Mar/2024',
      'abril-2024': 'Abr/2024',
      'maio-2024': 'Mai/2024',
      'junho-2024': 'Jun/2024',
      'julho-2024': 'Jul/2024',
      'agosto-2024': 'Ago/2024',
      'setembro-2024': 'Set/2024',
      'outubro-2024': 'Out/2024',
      'novembro-2024': 'Nov/2024',
      'dezembro-2024': 'Dez/2024'
    };
    return monthMap[periodo] || periodo;
  };

  const inicial = formatMonth(periodoInicial);
  const final = formatMonth(periodoFinal);
  
  return inicial === final ? inicial : `${inicial} – ${final}`;
};

// Gerar título dinâmico da página
export const generatePageTitle = (filters: FilterState): string => {
  const entidadeLabel = getEntidadeLabel(filters.entidade);
  return `Relatórios — ${entidadeLabel}`;
};

// Gerar sub-header com informações dos filtros
export const generateSubHeader = (filters: FilterState, periodConfig?: PeriodConfig): string => {
  const entidadeLabel = getEntidadeLabel(filters.entidade);
  const cenarioLabel = getCenarioLabel(filters.cenario);
  
  // Determinar se usar período único ou intervalo
  let periodoDisplay: string;
  if (periodConfig) {
    if (periodConfig.mode === 'range' && periodConfig.startMonth && periodConfig.endMonth) {
      periodoDisplay = formatPeriodoRange(periodConfig.startMonth, periodConfig.endMonth);
    } else if (periodConfig.mode === 'month' && periodConfig.month) {
      periodoDisplay = getPeriodoLabel(periodConfig.month);
    } else {
      periodoDisplay = getPeriodoLabel(filters.periodo);
    }
  } else {
    const isRangeMode = filters.periodoInicial && filters.periodoFinal;
    periodoDisplay = isRangeMode 
      ? formatPeriodoRange(filters.periodoInicial, filters.periodoFinal)
      : getPeriodoLabel(filters.periodo);
  }

  return `Você está vendo: ${entidadeLabel} | Cenário: ${cenarioLabel} | Período: ${periodoDisplay}`;
};

// Valores padrão para reset
export const getDefaultFilters = (): Partial<FilterState> => ({
  entidade: 'consolidado',
  centroCusto: 'consolidado', 
  cenario: 'real',
  periodo: 'dezembro-2024',
  periodoInicial: 'janeiro-2024',
  periodoFinal: 'dezembro-2024',
  comparacao: 'mes-anterior',
  visao: 'resumo',
  moeda: 'BRL',
  precisao: '2'
});

// Serializar filtros para URL
export const serializeFiltersToURL = (filters: FilterState): string => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== getDefaultFilters()[key as keyof FilterState]) {
      params.set(key, value);
    }
  });
  
  return params.toString();
};

// Deserializar filtros da URL
export const deserializeFiltersFromURL = (searchParams: URLSearchParams): Partial<FilterState> => {
  const filters: Partial<FilterState> = {};
  
  const filterKeys: (keyof FilterState)[] = [
    'entidade', 'centroCusto', 'cenario', 'periodo', 
    'periodoInicial', 'periodoFinal', 'comparacao', 
    'visao', 'moeda', 'precisao'
  ];
  
  filterKeys.forEach(key => {
    const value = searchParams.get(key);
    if (value) {
      filters[key] = value;
    }
  });
  
  return filters;
};

// Obter opções de centro de custo baseado na entidade
export const getCentroCustoOptions = (entidade: string) => {
  if (entidade === 'consolidado') {
    return [{ value: 'todos', label: 'Todos', disabled: true }];
  }
  
  const baseOptions = [
    { value: 'consolidado', label: 'Todos' },
    { value: 'vendas', label: 'Vendas' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'administrativo', label: 'Administrativo' },
    { value: 'financeiro', label: 'Financeiro' }
  ];
  
  // Adicionar opções específicas por entidade
  if (entidade === 'filial1') {
    baseOptions.push({ value: 'operacoes-sp', label: 'Operações SP' });
  } else if (entidade === 'filial2') {
    baseOptions.push({ value: 'operacoes-rj', label: 'Operações RJ' });
  }
  
  return baseOptions.map(option => ({ ...option, disabled: false }));
};

// Obter opções de comparação baseado no modo do período
export const getComparacaoOptions = (periodMode: PeriodMode) => {
  const baseOptions = [
    { value: 'orcado', label: 'vs Orçado' },
    { value: 'forecast', label: 'vs Forecast' }
  ];
  
  if (periodMode === 'month') {
    return [
      { value: 'mes-anterior', label: 'Mês Anterior (M-1)' },
      { value: 'ano-anterior', label: 'Mesmo Mês Ano Anterior (YoY)' },
      ...baseOptions
    ];
  } else {
    return [
      { value: 'periodo-anterior', label: 'Período Anterior Equivalente' },
      { value: 'mesmo-intervalo-ano-anterior', label: 'Mesmo Intervalo Ano Anterior (YoY)' },
      ...baseOptions
    ];
  }
};

// Validar se uma opção de comparação é válida para o período atual
export const isComparacaoValid = (comparacao: string, periodMode: PeriodMode): boolean => {
  const validOptions = getComparacaoOptions(periodMode);
  return validOptions.some(option => option.value === comparacao);
};

// Converter configuração de período para filtros
export const periodConfigToFilters = (config: PeriodConfig): Partial<FilterState> => {
  if (config.mode === 'month' && config.month) {
    return {
      periodo: config.month,
      periodoInicial: '',
      periodoFinal: ''
    };
  } else if (config.mode === 'range' && config.startMonth && config.endMonth) {
    return {
      periodo: '',
      periodoInicial: config.startMonth,
      periodoFinal: config.endMonth
    };
  }
  return {};
};

// Converter filtros para configuração de período
export const filtersToperiodConfig = (filters: FilterState): PeriodConfig => {
  const hasRange = filters.periodoInicial && filters.periodoFinal;
  
  if (hasRange) {
    return {
      mode: 'range',
      startMonth: filters.periodoInicial,
      endMonth: filters.periodoFinal
    };
  } else {
    return {
      mode: 'month',
      month: filters.periodo || 'dezembro-2024'
    };
  }
};