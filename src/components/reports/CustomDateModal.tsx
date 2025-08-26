import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomDateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDateSelect: (startDate: string, endDate: string) => void;
}

export const CustomDateModal = ({ open, onOpenChange, onDateSelect }: CustomDateModalProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        title: "Datas obrigatórias",
        description: "Selecione tanto a data inicial quanto a final.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast({
        title: "Período inválido",
        description: "A data inicial deve ser anterior à data final.",
        variant: "destructive"
      });
      return;
    }

    const daysDifference = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
    
    if (daysDifference > 365) {
      toast({
        title: "Período muito longo",
        description: "O período selecionado não pode ser superior a 365 dias.",
        variant: "destructive"
      });
      return;
    }

    onDateSelect(startDate, endDate);
    toast({
      title: "Período personalizado aplicado",
      description: `Filtros atualizados para o período de ${formatDate(startDate)} a ${formatDate(endDate)}.`,
    });
    
    onOpenChange(false);
    setStartDate("");
    setEndDate("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getQuickPeriods = () => {
    const today = new Date();
    const periods = [
      {
        label: "Últimos 7 dias",
        start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      },
      {
        label: "Últimos 30 dias",
        start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      },
      {
        label: "Últimos 90 dias",
        start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      },
      {
        label: "Este mês",
        start: new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      },
      {
        label: "Mês anterior",
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0],
        end: new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0]
      }
    ];
    return periods;
  };

  const handleQuickSelect = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Período Personalizado
          </DialogTitle>
          <DialogDescription>
            Selecione um período específico para filtrar os relatórios ou escolha uma das opções rápidas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Period Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Períodos Rápidos</Label>
            <div className="grid grid-cols-1 gap-2">
              {getQuickPeriods().map((period) => (
                <Button
                  key={period.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(period.start, period.end)}
                  className="justify-start text-sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {period.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-4 block">Ou selecione datas específicas</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate || undefined}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {startDate && endDate && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Período selecionado:</strong> {formatDate(startDate)} a {formatDate(endDate)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Duração:</strong> {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))} dias
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!startDate || !endDate}>
              <CalendarDays className="h-4 w-4 mr-2" />
              Aplicar Período
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};