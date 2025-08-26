import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";

interface DREItem {
  label: string;
  value: string;
  type: 'revenue' | 'deduction' | 'subtotal' | 'cost' | 'expense' | 'result';
  isNegative?: boolean;
  change?: string;
  trend?: 'up' | 'down';
  percentage?: string;
  description?: string;
}

interface DREModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dreData: DREItem[] = [
  {
    label: "Receita Bruta",
    value: "R$ 15.000.000",
    type: "revenue",
    change: "+12.5%",
    trend: "up",
    percentage: "100.0%",
    description: "Total de vendas antes de deduções"
  },
  {
    label: "(-) Impostos sobre Vendas",
    value: "R$ 1.800.000",
    type: "deduction",
    isNegative: true,
    change: "+8.2%",
    trend: "down",
    percentage: "12.0%",
    description: "ICMS, IPI, PIS/COFINS"
  },
  {
    label: "(-) Devoluções e Cancelamentos",
    value: "R$ 300.000",
    type: "deduction",
    isNegative: true,
    change: "-5.1%",
    trend: "up",
    percentage: "2.0%",
    description: "Produtos devolvidos pelos clientes"
  },
  {
    label: "(-) Descontos Comerciais",
    value: "R$ 150.000",
    type: "deduction",
    isNegative: true,
    change: "+15.3%",
    trend: "down",
    percentage: "1.0%",
    description: "Descontos concedidos nas vendas"
  },
  {
    label: "= Receita Líquida",
    value: "R$ 12.750.000",
    type: "subtotal",
    change: "+7.1%",
    trend: "up",
    percentage: "85.0%",
    description: "Base para cálculo dos custos"
  },
  {
    label: "(-) Custo dos Produtos Vendidos (CMV)",
    value: "R$ 7.650.000",
    type: "cost",
    isNegative: true,
    change: "+6.8%",
    trend: "down",
    percentage: "60.0%",
    description: "Custos diretos de produção"
  },
  {
    label: "= Lucro Bruto",
    value: "R$ 5.100.000",
    type: "subtotal",
    change: "+7.5%",
    trend: "up",
    percentage: "40.0%",
    description: "Margem antes das despesas operacionais"
  },
  {
    label: "(-) Despesas de Vendas",
    value: "R$ 1.275.000",
    type: "expense",
    isNegative: true,
    change: "+4.2%",
    trend: "down",
    percentage: "10.0%",
    description: "Comissões, marketing, logística"
  },
  {
    label: "(-) Despesas Administrativas",
    value: "R$ 765.000",
    type: "expense",
    isNegative: true,
    change: "+3.1%",
    trend: "down",
    percentage: "6.0%",
    description: "Salários, aluguel, utilities"
  },
  {
    label: "= EBITDA",
    value: "R$ 3.060.000",
    type: "result",
    change: "+8.3%",
    trend: "up",
    percentage: "24.0%",
    description: "Resultado antes de juros, impostos, depreciação"
  },
  {
    label: "(-) Depreciação e Amortização",
    value: "R$ 180.000",
    type: "expense",
    isNegative: true,
    change: "+2.5%",
    trend: "down",
    percentage: "1.4%",
    description: "Desgaste de ativos fixos"
  },
  {
    label: "= EBIT (Resultado Operacional)",
    value: "R$ 2.880.000",
    type: "result",
    change: "+8.8%",
    trend: "up",
    percentage: "22.6%",
    description: "Lucro operacional"
  },
  {
    label: "(-) Despesas Financeiras",
    value: "R$ 120.000",
    type: "expense",
    isNegative: true,
    change: "-15.2%",
    trend: "up",
    percentage: "0.9%",
    description: "Juros e taxas bancárias"
  },
  {
    label: "(+) Receitas Financeiras",
    value: "R$ 45.000",
    type: "revenue",
    change: "+25.8%",
    trend: "up",
    percentage: "0.4%",
    description: "Rendimentos de aplicações"
  },
  {
    label: "= Resultado antes do IR/CS",
    value: "R$ 2.805.000",
    type: "result",
    change: "+9.2%",
    trend: "up",
    percentage: "22.0%",
    description: "Base para cálculo dos impostos"
  },
  {
    label: "(-) Imposto de Renda e CSLL",
    value: "R$ 127.500",
    type: "expense",
    isNegative: true,
    change: "+9.2%",
    trend: "down",
    percentage: "1.0%",
    description: "Impostos sobre o lucro"
  },
  {
    label: "= Lucro Líquido",
    value: "R$ 2.677.500",
    type: "result",
    change: "+9.1%",
    trend: "up",
    percentage: "21.0%",
    description: "Resultado final do período"
  }
];

export const DREModal = ({ isOpen, onClose }: DREModalProps) => {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <div className="w-2 h-2 rounded-full bg-success"></div>;
      case 'deduction':
        return <div className="w-2 h-2 rounded-full bg-warning"></div>;
      case 'subtotal':
        return <div className="w-2 h-2 rounded-full bg-primary"></div>;
      case 'cost':
        return <div className="w-2 h-2 rounded-full bg-destructive"></div>;
      case 'expense':
        return <div className="w-2 h-2 rounded-full bg-orange-500"></div>;
      case 'result':
        return <div className="w-2 h-2 rounded-full bg-secondary"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-hidden bg-dashboard-card border-border shadow-lg flex flex-col">
        <DialogHeader className="pb-4 border-b border-border/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
                Demonstração do Resultado do Exercício
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Dezembro 2024 • Período: Jan-Dez 2024
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-2">
            <div className="space-y-1 pb-4">
              {dreData.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-border/30 bg-card/50 hover:bg-card transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getItemIcon(item.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className={`font-medium break-words ${
                            item.type === 'subtotal' || item.type === 'result' 
                              ? 'text-base text-foreground font-semibold' 
                              : 'text-sm text-foreground'
                          }`}>
                            {item.label}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {item.percentage}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-left sm:text-right flex-shrink-0">
                      <span className={`font-bold break-all ${
                        item.type === 'subtotal' || item.type === 'result'
                          ? 'text-lg text-foreground'
                          : item.isNegative 
                          ? 'text-sm text-destructive' 
                          : 'text-sm text-foreground'
                      }`}>
                        {item.value}
                      </span>
                      {item.change && (
                        <div className={`text-xs ${
                          item.trend === 'up' ? 'text-success' : 'text-destructive'
                        }`}>
                          {item.change}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 p-4 bg-muted/10 rounded-lg border border-border/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-success">24.0%</div>
                    <div className="text-xs text-muted-foreground">Margem EBITDA</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary">21.0%</div>
                    <div className="text-xs text-muted-foreground">Margem Líquida</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-success">+9.1%</div>
                    <div className="text-xs text-muted-foreground">Crescimento</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};