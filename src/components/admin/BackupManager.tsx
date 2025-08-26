import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  HardDrive,
  Calendar,
  Settings,
  Trash2,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BackupManagerProps {
  isVisible: boolean;
}

export const BackupManager = ({ isVisible }: BackupManagerProps) => {
  const { toast } = useToast();
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: "daily",
    time: "02:00",
    retention: "30",
    compression: true,
    encryption: true,
    includeUploads: true,
    includeLogs: false
  });

  const [backups] = useState([
    {
      id: 1,
      name: "backup_2024-01-18_02-00.sql.gz",
      type: "Automático",
      date: "2024-01-18 02:00:15",
      size: "3.2 GB",
      status: "Concluído",
      retention: "29 dias",
      encrypted: true,
      compressed: true
    },
    {
      id: 2,
      name: "backup_manual_2024-01-17_15-30.sql.gz",
      type: "Manual",
      date: "2024-01-17 15:30:42",
      size: "3.1 GB",
      status: "Concluído",
      retention: "30 dias",
      encrypted: true,
      compressed: true
    },
    {
      id: 3,
      name: "backup_2024-01-17_02-00.sql.gz",
      type: "Automático",
      date: "2024-01-17 02:00:08",
      size: "3.0 GB",
      status: "Concluído",
      retention: "28 dias",
      encrypted: true,
      compressed: true
    },
    {
      id: 4,
      name: "backup_2024-01-16_02-00.sql.gz",
      type: "Automático",
      date: "2024-01-16 02:00:33",
      size: "2.9 GB",
      status: "Falha",
      retention: "27 dias",
      encrypted: false,
      compressed: true,
      error: "Espaço insuficiente em disco"
    },
    {
      id: 5,
      name: "backup_2024-01-15_02-00.sql.gz",
      type: "Automático",
      date: "2024-01-15 02:00:11",
      size: "2.8 GB",
      status: "Concluído",
      retention: "26 dias",
      encrypted: true,
      compressed: true
    }
  ]);

  const [storageInfo] = useState({
    used: 45.2,
    total: 100,
    backupSpace: 15.8,
    available: 54.8
  });

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCreatingBackup(false);
          toast({
            title: "Backup criado com sucesso",
            description: "O backup foi criado e está disponível para download."
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleRestoreBackup = async (backupName: string) => {
    setIsRestoring(true);
    
    // Simulate restore process
    setTimeout(() => {
      setIsRestoring(false);
      toast({
        title: "Restauração concluída",
        description: `Sistema restaurado a partir do backup: ${backupName}`
      });
    }, 3000);
  };

  const handleDeleteBackup = (backupId: number) => {
    toast({
      title: "Backup removido",
      description: "O arquivo de backup foi removido permanentemente."
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações de backup foram atualizadas."
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluído':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Falha':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluído':
        return 'default';
      case 'Falha':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-4 lg:space-y-6 container-responsive overflow-x-hidden">
      {/* Storage Alert */}
      {storageInfo.used > 80 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Espaço em Disco Crítico</AlertTitle>
          <AlertDescription>
            O espaço em disco está em {storageInfo.used}%. Considere remover backups antigos ou expandir o armazenamento.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate" title="Backup Manual">Backup Manual</p>
                <p className="text-xs text-muted-foreground truncate">Criar backup imediato</p>
              </div>
              <Button size="sm" onClick={handleCreateBackup} disabled={isCreatingBackup} className="shrink-0">
                <Database className="w-4 h-4 mr-2" />
                {isCreatingBackup ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">Próximo Backup</p>
                <p className="text-xs text-muted-foreground truncate">Hoje às {backupSettings.time}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {backupSettings.autoBackup ? (
                  <Badge variant="default">Ativo</Badge>
                ) : (
                  <Badge variant="outline">Inativo</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">Espaço Usado</p>
                <p className="text-xs text-muted-foreground truncate">{storageInfo.backupSpace} GB em backups</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold">{storageInfo.used}%</p>
                <Progress value={storageInfo.used} className="w-12 lg:w-16 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Progress */}
      {isCreatingBackup && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 animate-pulse text-primary" />
                <span className="text-sm font-medium">Criando backup...</span>
              </div>
              <Progress value={backupProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{Math.round(backupProgress)}% concluído</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="storage">Armazenamento</TabsTrigger>
        </TabsList>

        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Histórico de Backups
                  </CardTitle>
                  <CardDescription>
                    Lista de todos os backups criados automaticamente e manualmente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="table-responsive overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Nome do Arquivo</TableHead>
                      <TableHead className="min-w-[80px]">Tipo</TableHead>
                      <TableHead className="min-w-[120px]">Data/Hora</TableHead>
                      <TableHead className="min-w-[80px]">Tamanho</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="hidden lg:table-cell min-w-[80px]">Retenção</TableHead>
                      <TableHead className="min-w-[120px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {backups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex gap-1 flex-shrink-0">
                            {backup.encrypted && <Shield className="h-3 w-3 text-green-500" />}
                            {backup.compressed && <Database className="h-3 w-3 text-blue-500" />}
                          </div>
                          <span className="font-mono text-xs lg:text-sm truncate">{backup.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={backup.type === 'Automático' ? 'default' : 'secondary'}>
                          {backup.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs lg:text-sm">{backup.date}</TableCell>
                      <TableCell className="text-sm">{backup.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 lg:gap-2">
                          {getStatusIcon(backup.status)}
                          <Badge variant={getStatusColor(backup.status)} className="text-xs">
                            {backup.status}
                          </Badge>
                          {backup.status === 'Falha' && backup.error && (
                            <span className="text-xs text-red-500 flex-shrink-0" title={backup.error}>
                              ⚠️
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{backup.retention}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="Download" className="h-8 w-8 p-0 touch-target" onClick={async () => {
                            try {
                              // Create fictional backup file
                              const backupContent = `
BACKUP FILE - ${backup.name}
============================

Backup Information:
- Type: ${backup.type}
- Date: ${backup.date}
- Size: ${backup.size}
- Status: ${backup.status}
- Encrypted: ${backup.encrypted ? 'Yes' : 'No'}
- Compressed: ${backup.compressed ? 'Yes' : 'No'}

This is a fictional backup file for demonstration purposes.
                              `;
                              
                              const blob = new Blob([backupContent], { type: 'text/plain;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = backup.name.replace('.sql.gz', '.txt');
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error("Error downloading backup:", error);
                            }
                          }}>
                            <Download className="w-3 h-3 lg:w-4 lg:h-4" />
                          </Button>
                          {backup.status === 'Concluído' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" title="Restaurar" className="h-8 w-8 p-0 touch-target">
                                  <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Restauração</AlertDialogTitle>
                                  <AlertDialogDescription className="text-sm break-words">
                                    Tem certeza que deseja restaurar o sistema usando o backup "{backup.name}"? 
                                    Esta ação substituirá todos os dados atuais.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                  <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleRestoreBackup(backup.name)}
                                    disabled={isRestoring}
                                    className="w-full sm:w-auto"
                                  >
                                    {isRestoring ? 'Restaurando...' : 'Restaurar'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" title="Excluir" className="h-8 w-8 p-0 touch-target">
                                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription className="text-sm break-words">
                                  Tem certeza que deseja remover o backup "{backup.name}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteBackup(backup.id)} className="w-full sm:w-auto">
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações de Backup
              </CardTitle>
              <CardDescription>
                Configure como e quando os backups serão criados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup" className="text-sm font-medium">
                    Backup Automático
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Criar backups automaticamente no horário programado
                  </p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={backupSettings.autoBackup}
                  onCheckedChange={(checked) => 
                    setBackupSettings({ ...backupSettings, autoBackup: checked })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequência</Label>
                  <Select
                    value={backupSettings.frequency}
                    onValueChange={(value) => 
                      setBackupSettings({ ...backupSettings, frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={backupSettings.time}
                    onChange={(e) => 
                      setBackupSettings({ ...backupSettings, time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention">Retenção (dias)</Label>
                <Input
                  id="retention"
                  type="number"
                  value={backupSettings.retention}
                  onChange={(e) => 
                    setBackupSettings({ ...backupSettings, retention: e.target.value })
                  }
                  placeholder="30"
                />
                <p className="text-xs text-muted-foreground">
                  Backups mais antigos que este período serão removidos automaticamente
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compression" className="text-sm font-medium">
                      Compressão
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Reduz o tamanho dos arquivos de backup
                    </p>
                  </div>
                  <Switch
                    id="compression"
                    checked={backupSettings.compression}
                    onCheckedChange={(checked) => 
                      setBackupSettings({ ...backupSettings, compression: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="encryption" className="text-sm font-medium">
                      Criptografia
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Protege os backups com criptografia AES-256
                    </p>
                  </div>
                  <Switch
                    id="encryption"
                    checked={backupSettings.encryption}
                    onCheckedChange={(checked) => 
                      setBackupSettings({ ...backupSettings, encryption: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="uploads" className="text-sm font-medium">
                      Incluir Uploads
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Incluir arquivos enviados pelos usuários
                    </p>
                  </div>
                  <Switch
                    id="uploads"
                    checked={backupSettings.includeUploads}
                    onCheckedChange={(checked) => 
                      setBackupSettings({ ...backupSettings, includeUploads: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="logs" className="text-sm font-medium">
                      Incluir Logs
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Incluir logs de sistema e auditoria
                    </p>
                  </div>
                  <Switch
                    id="logs"
                    checked={backupSettings.includeLogs}
                    onCheckedChange={(checked) => 
                      setBackupSettings({ ...backupSettings, includeLogs: checked })
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Gerenciamento de Armazenamento
              </CardTitle>
              <CardDescription>
                Monitoramento do uso de espaço e limpeza de backups antigos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Espaço Total</span>
                  <span className="text-sm">{storageInfo.total} GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Espaço Usado</span>
                  <span className="text-sm">{storageInfo.used} GB ({storageInfo.used}%)</span>
                </div>
                <Progress value={storageInfo.used} className="w-full" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm font-medium">Backups</p>
                    <p className="text-2xl font-bold text-primary">{storageInfo.backupSpace} GB</p>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm font-medium">Disponível</p>
                    <p className="text-2xl font-bold text-green-500">{storageInfo.available} GB</p>
                  </div>
                </div>
              </div>

              <Alert>
                <HardDrive className="h-4 w-4" />
                <AlertTitle>Limpeza Automática</AlertTitle>
                <AlertDescription>
                  Backups com mais de {backupSettings.retention} dias são removidos automaticamente 
                  para economizar espaço. A próxima limpeza será executada hoje às 03:00.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Backups Antigos
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Relatório de Uso
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};