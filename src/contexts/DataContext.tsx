import { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
  entidade: string;
  centroCusto: string;
  cenario: string;
  periodo: string;
  periodoInicial: string;
  periodoFinal: string;
  comparacao: string;
  visao: string;
  moeda: string;
  precisao: string;
  tipoPeriodo: string;
}

export interface DashboardData {
  receita: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  lucro: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  ebitda: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  margemBruta: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  margemEbitda: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  margemLiquida: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  roe: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  revenueComposition: Array<{
    name: string;
    value: number;
    color: string;
    percentage: string;
    amount: string;
  }>;
  expenseDistribution: Array<{
    name: string;
    value: number;
    color: string;
    percentage: string;
    amount: string;
  }>;
  trends: Array<{
    name: string;
    change: string;
    trend: 'up' | 'down';
  }>;
}

interface DataContextType {
  filters: FilterState;
  data: DashboardData;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  refreshData: () => void;
  isRefreshing: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Dados fictícios para diferentes combinações de filtros
const generateMockData = (filters: FilterState): DashboardData => {
  // Base multipliers based on filters
  const entidadeMultiplier = filters.entidade === 'consolidado' ? 1 : 
                             filters.entidade === 'individual' ? 0.7 :
                             filters.entidade === 'filial1' ? 0.4 : 0.3;
  
  const cenarioMultiplier = filters.cenario === 'real' ? 1 :
                           filters.cenario === 'orcado' ? 1.1 :
                           filters.cenario === 'projetado' ? 1.05 : 0.95;
  
  const periodoMultiplier = filters.periodo === 'dezembro-2024' ? 1 :
                           filters.periodo === 'novembro-2024' ? 0.92 :
                           filters.periodo === 'outubro-2024' ? 0.88 :
                           filters.periodo === 'q4-2024' ? 2.8 : 11.5;

  const baseReceita = 12750000 * entidadeMultiplier * cenarioMultiplier * periodoMultiplier;
  const baseLucro = baseReceita * 0.4;
  const baseEbitda = baseLucro * 0.6;

  // Generate change percentages based on comparison
  const getChangeData = (base: number) => {
    const changeMultiplier = filters.comparacao === 'mes-anterior' ? 
      Math.random() * 0.15 + 0.02 : // 2% to 17%
      filters.comparacao === 'ano-anterior' ?
      Math.random() * 0.25 + 0.05 : // 5% to 30%
      Math.random() * 0.20 + 0.03; // 3% to 23%
    
    const isPositive = Math.random() > 0.3; // 70% chance of positive change
    const change = isPositive ? changeMultiplier : -changeMultiplier * 0.5;
    
    return {
      change: `${change >= 0 ? '+' : ''}${(change * 100).toFixed(1)}%`,
      trend: (change >= 0 ? 'up' : 'down') as 'up' | 'down'
    };
  };

  const receitaChange = getChangeData(baseReceita);
  const lucroChange = getChangeData(baseLucro);
  const ebitdaChange = getChangeData(baseEbitda);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const receitaBruta = baseReceita * 1.18;
  const deducoes = receitaBruta - baseReceita;
  const despesasVendas = baseLucro * 0.25;
  const despesasAdmin = baseLucro * 0.15;

  return {
    receita: {
      value: formatCurrency(baseReceita),
      ...receitaChange,
    },
    lucro: {
      value: formatCurrency(baseLucro),
      ...lucroChange,
    },
    ebitda: {
      value: formatCurrency(baseEbitda),
      ...ebitdaChange,
    },
    margemBruta: {
      value: `${(40.0 + Math.random() * 5 - 2.5).toFixed(1)}%`,
      change: `${(Math.random() * 4 - 2).toFixed(1)}pp`,
      trend: Math.random() > 0.5 ? 'up' : 'down',
    },
    margemEbitda: {
      value: `${(24.0 + Math.random() * 6 - 3).toFixed(1)}%`,
      change: `${(Math.random() * 3 - 1.5).toFixed(1)}pp`,
      trend: Math.random() > 0.6 ? 'up' : 'down',
    },
    margemLiquida: {
      value: `${(17.2 + Math.random() * 4 - 2).toFixed(1)}%`,
      change: `${(Math.random() * 2 - 1).toFixed(1)}pp`,
      trend: Math.random() > 0.5 ? 'up' : 'down',
    },
    roe: {
      value: `${(21.5 + Math.random() * 8 - 4).toFixed(1)}%`,
      change: `${(Math.random() * 6 - 3).toFixed(1)}pp`,
      trend: Math.random() > 0.4 ? 'up' : 'down',
    },
    revenueComposition: [
      {
        name: "Receita Bruta",
        value: 85,
        color: "#10b981",
        percentage: "85.0%",
        amount: formatCurrency(receitaBruta),
      },
      {
        name: "Deduções",
        value: 15,
        color: "#ef4444",
        percentage: "15.0%",
        amount: formatCurrency(deducoes),
      },
    ],
    expenseDistribution: [
      {
        name: "Vendas",
        value: 62.5,
        color: "#ef4444",
        percentage: "62.5%",
        amount: formatCurrency(despesasVendas),
      },
      {
        name: "Administrativas",
        value: 37.5,
        color: "#f59e0b",
        percentage: "37.5%",
        amount: formatCurrency(despesasAdmin),
      },
    ],
    trends: [
      {
        name: "Receita",
        ...getChangeData(baseReceita),
      },
      {
        name: "EBITDA",
        ...getChangeData(baseEbitda),
      },
      {
        name: "Despesas",
        change: `${(Math.random() * 10 + 2).toFixed(1)}%`,
        trend: Math.random() > 0.7 ? 'up' : 'down',
      },
    ],
  };
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>({
    entidade: 'consolidado',
    centroCusto: 'consolidado',
    cenario: 'real',
    periodo: 'dezembro-2024',
    periodoInicial: 'janeiro-2024',
    periodoFinal: 'dezembro-2024',
    comparacao: 'mes-anterior',
    visao: 'resumo',
    moeda: 'BRL',
    precisao: '2',
    tipoPeriodo: 'mes',
  });
  
  const [data, setData] = useState<DashboardData>(() => generateMockData(filters));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setData(generateMockData(updatedFilters));
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setData(generateMockData(filters));
    setIsRefreshing(false);
  };

  return (
    <DataContext.Provider value={{
      filters,
      data,
      updateFilters,
      refreshData,
      isRefreshing,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};