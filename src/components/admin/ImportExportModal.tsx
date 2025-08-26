import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertTriangle } from "lucide-react";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "import" | "export";
  dataType: "accounts" | "companies" | "users";
}

export const ImportExportModal = ({ isOpen, onClose, type, dataType }: ImportExportModalProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getTitle = () => {
    const action = type === "import" ? "Importar" : "Exportar";
    const data = dataType === "accounts" ? "Contas" : dataType === "companies" ? "Empresas" : "Usuários";
    return `${action} ${data}`;
  };

  const getDescription = () => {
    if (type === "import") {
      return `Importe dados de ${dataType === "accounts" ? "contas contábeis" : dataType === "companies" ? "empresas" : "usuários"} de um arquivo Excel ou CSV.`;
    }
    return `Exporte todos os dados de ${dataType === "accounts" ? "contas contábeis" : dataType === "companies" ? "empresas" : "usuários"} para um arquivo Excel.`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const isValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!isValid) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV (.csv).",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast({
            title: "Sucesso",
            description: type === "import" 
              ? `Dados importados com sucesso! ${Math.floor(Math.random() * 1000) + 100} registros processados.`
              : "Arquivo exportado com sucesso!"
          });
          onClose();
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 200);
  };

  const handleProcess = () => {
    if (type === "import" && !selectedFile) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo para importar.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    simulateProgress();
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSelectedFile(null);
      setProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "import" ? <Upload className="h-5 w-5" /> : <Download className="h-5 w-5" />}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {type === "import" ? (
            <>
              <div>
                <Label htmlFor="file">Selecionar Arquivo</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
                {selectedFile && (
                  <div className="mt-2 p-2 bg-muted/20 rounded flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{selectedFile.name}</span>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Formato do Arquivo:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {dataType === "accounts" && (
                    <>
                      <li>• Coluna A: Código da Conta</li>
                      <li>• Coluna B: Descrição</li>
                      <li>• Coluna C: Linha da DRE</li>
                      <li>• Coluna D: Status (Ativo/Inativo)</li>
                    </>
                  )}
                  {dataType === "companies" && (
                    <>
                      <li>• Coluna A: Nome da Empresa</li>
                      <li>• Coluna B: CNPJ</li>
                      <li>• Coluna C: Filial/Centro de Custo</li>
                      <li>• Coluna D: Status (Ativo/Inativo)</li>
                    </>
                  )}
                  {dataType === "users" && (
                    <>
                      <li>• Coluna A: Nome Completo</li>
                      <li>• Coluna B: E-mail</li>
                      <li>• Coluna C: Papel (Administrador/Financeiro/Visualizador)</li>
                    </>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <span className="font-medium">Arquivo será exportado como:</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {dataType === "accounts" ? "mapa_contas" : dataType === "companies" ? "empresas_filiais" : "usuarios"}_export_{new Date().toISOString().split('T')[0]}.xlsx
              </p>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">
                  {type === "import" ? "Importando dados..." : "Exportando dados..."}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground">{Math.round(progress)}% concluído</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handleProcess} disabled={isProcessing || (type === "import" && !selectedFile)}>
            {type === "import" ? (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};