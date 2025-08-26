import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";

interface ImportLog {
  id: number;
  filename: string;
  date: string;
  status: string;
  records: number;
  details?: string;
  processingTime?: string;
  errors?: Array<{
    line: number;
    message: string;
    severity: "error" | "warning";
  }>;
}

interface LogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log?: ImportLog;
}

export const LogDetailsModal = ({ isOpen, onClose, log }: LogDetailsModalProps) => {
  if (!log) return null;

  const mockErrors = [
    { line: 45, message: "Formato de data inválido: '32/13/2024'. Use DD/MM/YYYY.", severity: "error" as const },
    { line: 78, message: "Valor monetário inválido: 'ABC'. Esperado formato numérico.", severity: "error" as const },
    { line: 156, message: "Código de conta não encontrado: '9.99.999'.", severity: "warning" as const },
    { line: 203, message: "Centro de custo vazio na linha.", severity: "warning" as const }
  ];

  const hasErrors = log.status === "Erro";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes da Importação
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre o processamento do arquivo
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Informações Gerais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Arquivo</p>
              <p className="font-mono text-sm">{log.filename}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data/Hora</p>
              <p className="text-sm">{log.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                {log.status === 'Sucesso' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={log.status === 'Sucesso' ? 'default' : 'destructive'}>
                  {log.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Registros Processados</p>
              <p className="text-sm font-semibold">{log.records.toLocaleString()}</p>
            </div>
          </div>

          <Separator />

          {/* Métricas de Processamento */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <p className="text-xs text-muted-foreground">Tempo de Processamento</p>
              <p className="font-semibold">2m 34s</p>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-500" />
              <p className="text-xs text-muted-foreground">Linhas Válidas</p>
              <p className="font-semibold">{hasErrors ? log.records - 4 : log.records}</p>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-red-500" />
              <p className="text-xs text-muted-foreground">Erros/Avisos</p>
              <p className="font-semibold">{hasErrors ? 4 : 0}</p>
            </div>
          </div>

          {/* Lista de Erros/Avisos */}
          {hasErrors && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3">Erros e Avisos Encontrados</h4>
                <ScrollArea className="h-48 rounded-md border p-4">
                  <div className="space-y-3">
                    {mockErrors.map((error, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                        <AlertTriangle className={`h-4 w-4 mt-0.5 ${error.severity === 'error' ? 'text-red-500' : 'text-yellow-500'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={error.severity === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                              {error.severity === 'error' ? 'ERRO' : 'AVISO'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Linha {error.line}</span>
                          </div>
                          <p className="text-sm">{error.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </>
          )}

          {/* Resumo Final */}
          {log.status === 'Sucesso' && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-800 dark:text-green-200">Importação Concluída com Sucesso</p>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Todos os {log.records.toLocaleString()} registros foram processados sem erros.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};