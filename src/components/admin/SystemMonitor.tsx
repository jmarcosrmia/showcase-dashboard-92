import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Activity, 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Users,
  FileText
} from "lucide-react";

interface SystemMonitorProps {
  isVisible: boolean;
}

export const SystemMonitor = ({ isVisible }: SystemMonitorProps) => {
  const [systemStats, setSystemStats] = useState({
    cpu: { usage: 45, status: 'normal' },
    memory: { usage: 68, status: 'warning' },
    disk: { usage: 82, status: 'critical' },
    network: { status: 'connected', latency: 23 },
    database: { connections: 15, maxConnections: 100, status: 'normal' },
    lastUpdate: new Date()
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    activeUsers: 42,
    requestsPerMinute: 156,
    responseTime: 250,
    errorRate: 0.8,
    uptime: 99.7
  });

  const [services, setServices] = useState([
    { name: 'API Principal', status: 'online', uptime: '99.9%', responseTime: '150ms' },
    { name: 'Banco de Dados', status: 'online', uptime: '99.8%', responseTime: '50ms' },
    { name: 'Processamento de Planilhas', status: 'online', uptime: '98.5%', responseTime: '2.5s' },
    { name: 'Sistema de Backup', status: 'warning', uptime: '95.2%', responseTime: '5s' },
    { name: 'Notificações Email', status: 'offline', uptime: '0%', responseTime: 'N/A' }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { time: '10:45', action: 'Usuário joão@empresa.com fez login', type: 'auth' },
    { time: '10:30', action: 'Importação de DRE concluída - 2.450 registros', type: 'import' },
    { time: '10:15', action: 'Backup automático executado com sucesso', type: 'backup' },
    { time: '09:50', action: 'Nova empresa cadastrada: Prime Flow RJ', type: 'admin' },
    { time: '09:30', action: 'Usuário maria@empresa.com exportou relatório', type: 'export' }
  ]);

  const refreshStats = () => {
    // Simulate real-time data updates
    setSystemStats(prev => ({
      ...prev,
      cpu: { usage: Math.floor(Math.random() * 100), status: Math.random() > 0.7 ? 'warning' : 'normal' },
      memory: { usage: Math.floor(Math.random() * 100), status: Math.random() > 0.8 ? 'critical' : 'normal' },
      disk: { usage: prev.disk.usage + Math.floor(Math.random() * 3 - 1), status: prev.disk.usage > 85 ? 'critical' : 'normal' },
      lastUpdate: new Date()
    }));

    setPerformanceMetrics(prev => ({
      ...prev,
      activeUsers: Math.floor(Math.random() * 20) + 30,
      requestsPerMinute: Math.floor(Math.random() * 50) + 130,
      responseTime: Math.floor(Math.random() * 100) + 200
    }));
  };

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(refreshStats, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* Status Alerts */}
      {systemStats.disk.status === 'critical' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Espaço em Disco Crítico</AlertTitle>
          <AlertDescription>
            O espaço em disco está em {systemStats.disk.usage}%. Considere limpar arquivos desnecessários ou expandir o armazenamento.
          </AlertDescription>
        </Alert>
      )}

      {services.some(s => s.status === 'offline') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Serviços Offline</AlertTitle>
          <AlertDescription>
            Alguns serviços críticos estão offline. Verifique a seção de serviços para mais detalhes.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Cpu className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">CPU</p>
                <div className="flex items-center gap-2">
                  <Progress value={systemStats.cpu.usage} className="flex-1" />
                  <span className="text-sm font-medium">{systemStats.cpu.usage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Server className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Memória</p>
                <div className="flex items-center gap-2">
                  <Progress value={systemStats.memory.usage} className="flex-1" />
                  <span className="text-sm font-medium">{systemStats.memory.usage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <HardDrive className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Disco</p>
                <div className="flex items-center gap-2">
                  <Progress value={systemStats.disk.usage} className="flex-1" />
                  <span className="text-sm font-medium">{systemStats.disk.usage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Usuários Ativos</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{performanceMetrics.activeUsers}</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring */}
      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Status dos Serviços
                  </CardTitle>
                  <CardDescription>
                    Monitoramento em tempo real dos serviços do sistema
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refreshStats}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Uptime: {service.uptime} | Tempo de resposta: {service.responseTime}
                        </p>
                      </div>
                    </div>
                    <Badge variant={service.status === 'online' ? 'default' : service.status === 'warning' ? 'secondary' : 'destructive'}>
                      {service.status === 'online' ? 'Online' : service.status === 'warning' ? 'Atenção' : 'Offline'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Métricas de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Requisições/min</span>
                  <span className="text-2xl font-bold text-primary">{performanceMetrics.requestsPerMinute}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tempo de resposta médio</span>
                  <span className="text-2xl font-bold text-primary">{performanceMetrics.responseTime}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Taxa de erro</span>
                  <span className="text-2xl font-bold text-primary">{performanceMetrics.errorRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-2xl font-bold text-green-500">{performanceMetrics.uptime}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Banco de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Conexões ativas</span>
                  <span className="text-2xl font-bold text-primary">
                    {systemStats.database.connections}/{systemStats.database.maxConnections}
                  </span>
                </div>
                <Progress 
                  value={(systemStats.database.connections / systemStats.database.maxConnections) * 100} 
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="default">Operacional</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Latência</span>
                  <span className="text-sm font-medium">{systemStats.network.latency}ms</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Últimas ações realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{activity.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last Update Info */}
      <div className="text-center text-xs text-muted-foreground">
        Última atualização: {systemStats.lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
};