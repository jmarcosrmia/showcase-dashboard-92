import { Badge } from "@/components/ui/badge";
import { FilterState } from "@/contexts/DataContext";
import { getEntidadeLabel, getCenarioLabel, filtersToperiodConfig, formatPeriodoRange, getPeriodoLabel } from "@/lib/filter-utils";

interface FilterChipsProps {
  filters: FilterState;
}

export const FilterChips = ({ filters }: FilterChipsProps) => {
  const periodConfig = filtersToperiodConfig(filters);
  
  // Determinar período display
  let periodoDisplay: string;
  if (periodConfig.mode === 'range' && periodConfig.startMonth && periodConfig.endMonth) {
    periodoDisplay = formatPeriodoRange(periodConfig.startMonth, periodConfig.endMonth);
  } else if (periodConfig.mode === 'month' && periodConfig.month) {
    periodoDisplay = getPeriodoLabel(periodConfig.month);
  } else {
    periodoDisplay = getPeriodoLabel(filters.periodo);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
        {getEntidadeLabel(filters.entidade)}
      </Badge>
      <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
        {getCenarioLabel(filters.cenario)}
      </Badge>
      <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
        {periodoDisplay}
      </Badge>
    </div>
  );
};