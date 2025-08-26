import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PeriodConfig, PeriodMode } from "@/lib/filter-utils";

interface PeriodSelectorProps {
  value: PeriodConfig;
  onChange: (config: PeriodConfig) => void;
  className?: string;
}

const monthOptions = [
  { value: 'dezembro-2024', label: 'Dezembro 2024' },
  { value: 'novembro-2024', label: 'Novembro 2024' },
  { value: 'outubro-2024', label: 'Outubro 2024' },
  { value: 'setembro-2024', label: 'Setembro 2024' },
  { value: 'agosto-2024', label: 'Agosto 2024' },
  { value: 'julho-2024', label: 'Julho 2024' },
  { value: 'junho-2024', label: 'Junho 2024' },
  { value: 'maio-2024', label: 'Maio 2024' },
  { value: 'abril-2024', label: 'Abril 2024' },
  { value: 'marco-2024', label: 'Março 2024' },
  { value: 'fevereiro-2024', label: 'Fevereiro 2024' },
  { value: 'janeiro-2024', label: 'Janeiro 2024' }
];

export const PeriodSelector = ({ value, onChange, className }: PeriodSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleModeChange = (mode: PeriodMode) => {
    if (mode === 'month') {
      onChange({
        mode: 'month',
        month: value.month || 'dezembro-2024'
      });
    } else {
      onChange({
        mode: 'range',
        startMonth: value.startMonth || 'janeiro-2024',
        endMonth: value.endMonth || 'dezembro-2024'
      });
    }
  };

  const handleMonthChange = (month: string) => {
    onChange({
      ...value,
      month
    });
  };

  const handleStartMonthChange = (startMonth: string) => {
    onChange({
      ...value,
      startMonth
    });
  };

  const handleEndMonthChange = (endMonth: string) => {
    onChange({
      ...value,
      endMonth
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={value.mode === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeChange('month')}
          className="text-xs px-3 h-7"
        >
          Mês
        </Button>
        <Button
          variant={value.mode === 'range' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeChange('range')}
          className="text-xs px-3 h-7"
        >
          Intervalo
        </Button>
      </div>

      {/* Period Inputs */}
      <div className="space-y-2">
        {value.mode === 'month' ? (
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
              Mês
            </label>
            <Select value={value.month || ''} onValueChange={handleMonthChange}>
              <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
                Início
              </label>
              <Select value={value.startMonth || ''} onValueChange={handleStartMonthChange}>
                <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Mês inicial" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-sm">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
                Fim
              </label>
              <Select value={value.endMonth || ''} onValueChange={handleEndMonthChange}>
                <SelectTrigger className="h-10 text-sm bg-background/60 border-border/60 hover:border-border transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Mês final" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/60 shadow-xl">
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-sm">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};