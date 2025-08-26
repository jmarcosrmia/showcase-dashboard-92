import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, FileSpreadsheet, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportFormatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onExport: (format: string, options?: any) => Promise<void>;
  includeFilterOptions?: boolean;
}

export const ExportFormatModal = ({
  open,
  onOpenChange,
  title,
  description = "Selecione o formato para exportação",
  onExport,
  includeFilterOptions = false
}: ExportFormatModalProps) => {
  const [format, setFormat] = useState("pdf");
  const [includeFilters, setIncludeFilters] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const formatOptions = [
    {
      value: "pdf",
      label: "PDF",
      description: "Documento portátil para visualização",
      icon: FileText
    },
    {
      value: "excel",
      label: "Excel (XLSX)",
      description: "Planilha para análise avançada",
      icon: FileSpreadsheet
    },
    {
      value: "csv",
      label: "CSV",
      description: "Dados tabulados para importação",
      icon: FileSpreadsheet
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(format, includeFilterOptions ? { includeFilters } : undefined);
      onOpenChange(false);
      toast({
        title: "Exportação concluída",
        description: `Arquivo ${format.toUpperCase()} gerado com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o arquivo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const selectedOption = formatOptions.find(opt => opt.value === format);
  const Icon = selectedOption?.icon || FileText;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="format" className="text-sm font-medium">
              Formato do arquivo
            </Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="h-12">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-3 py-2">
                        <OptionIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {includeFilterOptions && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium">Opções de exportação</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeFilters"
                      checked={includeFilters}
                      onChange={(e) => setIncludeFilters(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="includeFilters" className="text-sm cursor-pointer">
                      Incluir filtros aplicados no relatório
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Os filtros atuais serão incluídos como informações no cabeçalho do arquivo
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {selectedOption?.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedOption?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="min-w-[120px]"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};