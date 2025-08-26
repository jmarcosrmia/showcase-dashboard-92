import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";

interface DetailItem {
  label: string;
  value: string;
  isNegative?: boolean;
  isHighlighted?: boolean;
  trend?: 'up' | 'down';
  category?: 'primary' | 'calculation' | 'metric';
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: DetailItem[];
}

export const DetailModal = ({ isOpen, onClose, title, items }: DetailModalProps) => {
  const getItemIcon = (item: DetailItem) => {
    if (item.trend === 'up') return <TrendingUp className="w-4 h-4 text-success" />;
    if (item.trend === 'down') return <TrendingDown className="w-4 h-4 text-destructive" />;
    if (item.isNegative) return <span className="text-destructive font-bold">(-)</span>;
    return <DollarSign className="w-4 h-4 text-muted-foreground" />;
  };

  const getItemStyle = (item: DetailItem) => {
    if (item.category === 'primary') {
      return "bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 shadow-md";
    }
    if (item.category === 'calculation') {
      return "bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary/30";
    }
    if (item.isHighlighted) {
      return "bg-gradient-to-r from-accent/30 to-accent/15 border-accent/40 shadow-sm";
    }
    return "bg-card/50 border-border/40 hover:bg-card/80";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] bg-gradient-to-br from-dashboard-card to-dashboard-card/95 border-border/50 shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 sm:pb-6 flex-shrink-0">
          <DialogTitle className="text-lg sm:text-2xl font-bold text-foreground flex items-start gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="break-words">{title}</span>
                <Badge variant="secondary" className="text-xs font-medium self-start">
                  Detalhado
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-normal mt-1">
                Análise financeira completa
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-2">
            <div className="space-y-4 sm:space-y-6 pb-4">
              <div className="grid gap-2 sm:gap-3">
                {items.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-3 sm:p-4 rounded-xl border transition-all duration-300 hover:shadow-md group ${getItemStyle(item)}`}
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      animation: `fadeInUp 0.5s ease-out forwards`
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex-shrink-0">
                          {getItemIcon(item)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors break-words">
                            {item.label}
                          </span>
                          {item.category === 'calculation' && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Cálculo automático
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <span className={`text-base sm:text-lg font-bold transition-all duration-300 group-hover:scale-105 break-all ${
                          item.isNegative 
                            ? 'text-destructive' 
                            : item.isHighlighted 
                            ? 'text-primary' 
                            : 'text-foreground'
                        }`}>
                          {item.value}
                        </span>
                        {item.trend && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Tendência {item.trend === 'up' ? 'positiva' : 'negativa'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-success/10 border border-success/20">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">Última atualização</span>
                      <div className="text-xs text-muted-foreground">Dados em tempo real</div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-sm font-semibold text-foreground">Agora mesmo</span>
                    <div className="text-xs text-muted-foreground">Sistema automático</div>
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