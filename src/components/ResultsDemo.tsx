import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DREDetailModal } from "@/components/DREDetailModal";
import { ChevronRight } from "lucide-react";
interface ResultItem {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  isNegative?: boolean;
  isHighlighted?: boolean;
}
const resultsData: ResultItem[] = [{
  id: "receitas",
  label: "Receita Bruta",
  value: "R$ 15.000.000",
  rawValue: 15000000
}, {
  id: "deducoes",
  label: "Deduções",
  value: "-R$ 2.250.000",
  rawValue: -2250000,
  isNegative: true
}, {
  id: "receita-liquida",
  label: "Receita Líquida",
  value: "R$ 12.750.000",
  rawValue: 12750000,
  isHighlighted: true
}, {
  id: "cmv",
  label: "CMV",
  value: "-R$ 7.650.000",
  rawValue: -7650000,
  isNegative: true
}, {
  id: "lucro-bruto",
  label: "Lucro Bruto",
  value: "R$ 5.100.000",
  rawValue: 5100000
}, {
  id: "despesas-operacionais",
  label: "Desp. Operacionais",
  value: "-R$ 2.040.000",
  rawValue: -2040000,
  isNegative: true
}, {
  id: "ebitda",
  label: "EBITDA",
  value: "R$ 3.060.000",
  rawValue: 3060000,
  isHighlighted: true
}, {
  id: "lucro-liquido",
  label: "Lucro Líquido",
  value: "R$ 2.677.500",
  rawValue: 2677500
}];
export const ResultsDemo = () => {
  const [selectedAccount, setSelectedAccount] = useState<{
    id: string;
    name: string;
    value: number;
    level: number;
    trend?: 'up' | 'down' | 'neutral';
    change?: string;
  } | null>(null);
  
  const handleItemClick = (item: ResultItem) => {
    setSelectedAccount({
      id: item.id,
      name: item.label,
      value: item.rawValue,
      level: 1,
      trend: item.rawValue > 0 ? 'up' : 'down',
      change: item.rawValue > 0 ? '+8.2%' : '-3.1%'
    });
  };
  
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Demonstração de Resultados</h3>
        <p className="text-sm text-muted-foreground mt-1">Clique em qualquer item para ver detalhes</p>
      </div>
      
      <div className="space-y-1">
        {resultsData.map((item, index) => (
          <div 
            key={index}
            onClick={() => handleItemClick(item)}
            className={`flex justify-between items-center p-4 rounded-lg border transition-all cursor-pointer hover:scale-[1.01] hover:shadow-sm group gap-3 min-w-0 overflow-hidden
              ${item.isHighlighted ? 'bg-primary/5 border-primary/20 hover:bg-primary/8' : 'bg-card border-border hover:bg-muted/30'}
            `}
          >
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate flex-1" title={item.label}>
              {item.label}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-sm font-semibold whitespace-nowrap ${
                item.isNegative ? 'text-red-500' : 
                item.isHighlighted ? 'text-primary' : 'text-foreground'
              }`} title={item.value}>
                {item.value}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>
      
      <DREDetailModal 
        isOpen={selectedAccount !== null}
        onClose={() => setSelectedAccount(null)}
        account={selectedAccount}
      />
    </Card>
  );
};