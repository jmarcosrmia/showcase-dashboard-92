import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Database, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

interface ProcessingJob {
  id: string;
  name: string;
  type: 'import' | 'calculation' | 'report' | 'backup';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  endTime?: string;
  recordsProcessed?: number;
  totalRecords?: number;
  errorMessage?: string;
}

export const DataProcessingCenter = () => {
  const [jobs, setJobs] = useState<ProcessingJob[]>([
    {
      id: '1',
      name: 'Importação DRE Dezembro',
      type: 'import',
      status: 'completed',
      progress: 100,
      startTime: '2025-01-15 14:30:00',
      endTime: '2025-01-15 14:32:15',
      recordsProcessed: 2500,
      totalRecords: 2500
    },
    {
      id: '2',
      name: 'Cálculo de Margens',
      type: 'calculation',
      status: 'running',
      progress: 65,
      startTime: '2025-01-15 14:35:00',
      recordsProcessed: 1300,
      totalRecords: 2000
    },
    {
      id: '3',
      name: 'Geração Relatório Mensal',
      type: 'report',
      status: 'pending',
      progress: 0,
      startTime: '2025-01-15 14:40:00'
    }
  ]);

  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({
    totalRecordsProcessed: 156789,
    averageProcessingTime: '2.3s',
    successRate: 98.5,
    lastBackup: '2025-01-15 02:00:00'
  });

  const { refreshData } = useData();
  const { toast } = useToast();

  const getJobIcon = (type: ProcessingJob['type']) => {
    switch (type) {
      case 'import': return <Database className="h-4 w-4" />;
      case 'calculation': return <BarChart3 className="h-4 w-4" />;
      case 'report': return <PieChart className="h-4 w-4" />;
      case 'backup': return <RefreshCw className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getJobTypeLabel = (type: ProcessingJob['type']) => {
    switch (type) {
      case 'import': return 'Importação';
      case 'calculation': return 'Cálculo';
      case 'report': return 'Relatório';
      case 'backup': return 'Backup';
      default: return 'Processamento';
    }
  };

  const getStatusIcon = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin text-warning" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'running': return 'Executando';
      case 'failed': return 'Falhou';
      default: return 'Pendente';
    }
  };

  const getStatusColor = (status: ProcessingJob['status']) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'running': return 'text-warning';
      case 'failed': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const handleStartJob = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || job.status === 'running') return;

    // Start job
    setJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { ...j, status: 'running', progress: 0, startTime: new Date().toISOString().slice(0, 19).replace('T', ' ') }
        : j
    ));

    // Simulate progress
    for (let i = 0; i <= 100; i += Math.random() * 20) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const progress = Math.min(i, 100);
      setJobs(prev => prev.map(j => 
        j.id === jobId 
          ? { 
              ...j, 
              progress,
              recordsProcessed: j.totalRecords ? Math.round((progress / 100) * j.totalRecords) : undefined
            }
          : j
      ));
    }

    // Complete job
    const success = Math.random() > 0.1; // 90% success rate
    setJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { 
            ...j, 
            status: success ? 'completed' : 'failed',
            progress: success ? 100 : j.progress,
            endTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            errorMessage: !success ? 'Erro de conexão com o banco de dados' : undefined
          }
        : j
    ));

    toast({
      title: success ? "Processamento concluído" : "Erro no processamento",
      description: success 
        ? `O job "${job.name}" foi executado com sucesso.`
        : `O job "${job.name}" falhou. Verifique os logs para mais detalhes.`,
      variant: success ? "default" : "destructive"
    });

    if (success && job.type === 'calculation') {
      // Refresh dashboard data after calculation
      refreshData();
    }
  };

  const handleProcessAll = async () => {
    setIsProcessingAll(true);
    
    const pendingJobs = jobs.filter(j => j.status === 'pending');
    
    for (const job of pendingJobs) {
      await handleStartJob(job.id);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsProcessingAll(false);
    
    toast({
      title: "Processamento em lote concluído",
      description: `${pendingJobs.length} jobs foram processados.`,
    });
  };

  const addNewJob = (type: ProcessingJob['type'], name: string) => {
    const newJob: ProcessingJob = {
      id: Date.now().toString(),
      name,
      type,
      status: 'pending',
      progress: 0,
      startTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      totalRecords: Math.floor(Math.random() * 5000) + 1000
    };

    setJobs(prev => [...prev, newJob]);
    
    toast({
      title: "Novo job adicionado",
      description: `O job "${name}" foi adicionado à fila de processamento.`,
    });
  };

  const runningJobs = jobs.filter(j => j.status === 'running').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending').length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const failedJobs = jobs.filter(j => j.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Centro de Processamento</h3>
          <p className="text-sm text-muted-foreground">Monitore e gerencie jobs de processamento de dados</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => addNewJob('calculation', 'Recálculo Geral de Métricas')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Novo Cálculo
          </Button>
          <Button 
            onClick={handleProcessAll}
            disabled={isProcessingAll || pendingJobs === 0}
          >
            {isProcessingAll ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Processar Tudo
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Registros Processados</p>
                <p className="text-2xl font-bold">{systemMetrics.totalRecordsProcessed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <div>
                <p className="text-sm font-medium">Tempo Médio</p>
                <p className="text-2xl font-bold">{systemMetrics.averageProcessingTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm font-medium">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">{systemMetrics.successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Último Backup</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(systemMetrics.lastBackup).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold text-warning">{runningJobs}</p>
          <p className="text-sm text-muted-foreground">Executando</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold text-muted-foreground">{pendingJobs}</p>
          <p className="text-sm text-muted-foreground">Pendentes</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold text-success">{completedJobs}</p>
          <p className="text-sm text-muted-foreground">Concluídos</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold text-destructive">{failedJobs}</p>
          <p className="text-sm text-muted-foreground">Falharam</p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        <h4 className="text-md font-semibold">Jobs Ativos</h4>
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {getJobIcon(job.type)}
                  </div>
                  <div>
                    <h5 className="font-medium">{job.name}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getJobTypeLabel(job.type)}
                      </Badge>
                      <span className={`flex items-center gap-1 text-xs ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {getStatusText(job.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {job.status === 'pending' && (
                  <Button size="sm" onClick={() => handleStartJob(job.id)}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Iniciar
                  </Button>
                )}
              </div>

              {job.status === 'running' && (
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Progresso</p>
                    <p className="text-sm text-muted-foreground">{Math.round(job.progress)}%</p>
                  </div>
                  <Progress value={job.progress} className="w-full" />
                  {job.recordsProcessed && job.totalRecords && (
                    <p className="text-xs text-muted-foreground">
                      {job.recordsProcessed.toLocaleString()} de {job.totalRecords.toLocaleString()} registros processados
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Iniciado: {new Date(job.startTime).toLocaleString('pt-BR')}</span>
                {job.endTime && (
                  <span>Concluído: {new Date(job.endTime).toLocaleString('pt-BR')}</span>
                )}
              </div>

              {job.errorMessage && (
                <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{job.errorMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ações Rápidas</CardTitle>
          <CardDescription>Inicie jobs comuns de processamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => addNewJob('import', 'Importação de Dados Financeiros')}
          >
            <Database className="h-4 w-4 mr-2" />
            Importar Dados Financeiros
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => addNewJob('calculation', 'Recálculo de Indicadores')}
          >
            <LineChart className="h-4 w-4 mr-2" />
            Recalcular Indicadores
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => addNewJob('backup', 'Backup Completo do Sistema')}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Executar Backup Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};