import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DataSourceModal } from "./DataSourceModal";
import { 
  Database, 
  Plus, 
  RefreshCw, 
  Settings as SettingsIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Play,
  Pause
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataSource {
  id: string;
  name: string;
  type: string;
  host: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: string;
  enabled: boolean;
  syncProgress?: number;
}

export const DataSourceManager = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'ERP Principal',
      type: 'database',
      host: '192.168.1.100',
      status: 'connected',
      lastSync: '2025-01-15 14:30:00',
      enabled: true
    },
    {
      id: '2',
      name: 'Sistema Contábil',
      type: 'api',
      host: 'api.contabilidade.com',
      status: 'syncing',
      lastSync: '2025-01-15 14:25:00',
      enabled: true,
      syncProgress: 65
    },
    {
      id: '3',
      name: 'Backup Database',
      type: 'database',
      host: '192.168.1.200',
      status: 'disconnected',
      lastSync: '2025-01-14 18:00:00',
      enabled: false
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);
  const [globalSyncProgress, setGlobalSyncProgress] = useState(0);
  const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);
  const { toast } = useToast();

  const handleSaveSource = (sourceData: any) => {
    if (editingSource) {
      // Update existing source
      setDataSources(prev => prev.map(source => 
        source.id === editingSource.id 
          ? { ...source, ...sourceData, status: 'connected' as const }
          : source
      ));
    } else {
      // Add new source
      const newSource: DataSource = {
        id: Date.now().toString(),
        name: sourceData.name,
        type: sourceData.type,
        host: sourceData.host,
        status: 'connected',
        lastSync: new Date().toISOString().slice(0, 19).replace('T', ' '),
        enabled: sourceData.enabled
      };
      setDataSources(prev => [...prev, newSource]);
    }
    setEditingSource(null);
  };

  const handleEditSource = (source: DataSource) => {
    setEditingSource(source);
    setShowModal(true);
  };

  const handleDeleteSource = (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId);
    setDataSources(prev => prev.filter(s => s.id !== sourceId));
    toast({
      title: "Fonte removida",
      description: `A fonte "${source?.name}" foi removida com sucesso.`,
    });
  };

  const handleToggleSource = (sourceId: string) => {
    setDataSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { 
            ...source, 
            enabled: !source.enabled,
            status: !source.enabled ? 'connected' : 'disconnected' as const
          }
        : source
    ));
  };

  const handleSyncSource = async (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId);
    
    // Update source to syncing status
    setDataSources(prev => prev.map(s => 
      s.id === sourceId 
        ? { ...s, status: 'syncing', syncProgress: 0 }
        : s
    ));

    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDataSources(prev => prev.map(s => 
        s.id === sourceId 
          ? { ...s, syncProgress: i }
          : s
      ));
    }

    // Complete sync
    setDataSources(prev => prev.map(s => 
      s.id === sourceId 
        ? { 
            ...s, 
            status: 'connected',
            lastSync: new Date().toISOString().slice(0, 19).replace('T', ' '),
            syncProgress: undefined
          }
        : s
    ));

    toast({
      title: "Sincronização concluída",
      description: `A fonte "${source?.name}" foi sincronizada com sucesso.`,
    });
  };

  const handleGlobalSync = async () => {
    setIsGlobalSyncing(true);
    setGlobalSyncProgress(0);

    const enabledSources = dataSources.filter(s => s.enabled);
    
    for (let i = 0; i < enabledSources.length; i++) {
      const source = enabledSources[i];
      
      // Update individual source
      setDataSources(prev => prev.map(s => 
        s.id === source.id 
          ? { ...s, status: 'syncing', syncProgress: 0 }
          : s
      ));

      // Simulate individual sync
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 150));
        setDataSources(prev => prev.map(s => 
          s.id === source.id 
            ? { ...s, syncProgress: progress }
            : s
        ));
      }

      // Complete individual sync
      setDataSources(prev => prev.map(s => 
        s.id === source.id 
          ? { 
              ...s, 
              status: 'connected',
              lastSync: new Date().toISOString().slice(0, 19).replace('T', ' '),
              syncProgress: undefined
            }
          : s
      ));

      // Update global progress
      setGlobalSyncProgress(((i + 1) / enabledSources.length) * 100);
    }

    setIsGlobalSyncing(false);
    toast({
      title: "Sincronização global concluída",
      description: `${enabledSources.length} fontes foram sincronizadas com sucesso.`,
    });
  };

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'syncing': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: DataSource['status']) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'syncing': return 'Sincronizando';
      case 'error': return 'Erro';
      default: return 'Desconectado';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Fontes de Dados</h3>
          <p className="text-sm text-muted-foreground">Gerencie as conexões com sistemas externos</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleGlobalSync}
            disabled={isGlobalSyncing || dataSources.filter(s => s.enabled).length === 0}
          >
            {isGlobalSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sincronizar Tudo
              </>
            )}
          </Button>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Fonte
          </Button>
        </div>
      </div>

      {/* Global Sync Progress */}
      {isGlobalSyncing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Sincronização Global</p>
                <p className="text-sm text-muted-foreground">{Math.round(globalSyncProgress)}%</p>
              </div>
              <Progress value={globalSyncProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {dataSources.map((source) => (
          <Card key={source.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{source.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Database className="h-3 w-3" />
                    {source.type} • {source.host}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSource(source)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSource(source.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-sm ${getStatusColor(source.status)}`}>
                    {getStatusIcon(source.status)}
                    {getStatusText(source.status)}
                  </span>
                  {!source.enabled && (
                    <Badge variant="secondary" className="text-xs">Inativo</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleSource(source.id)}
                  >
                    {source.enabled ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </Button>
                  {source.enabled && source.status !== 'syncing' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSyncSource(source.id)}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              {source.status === 'syncing' && source.syncProgress !== undefined && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Progresso</p>
                    <p className="text-sm text-muted-foreground">{source.syncProgress}%</p>
                  </div>
                  <Progress value={source.syncProgress} className="w-full" />
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Última sincronização: {new Date(source.lastSync).toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {dataSources.length === 0 && (
        <Card className="p-8 text-center">
          <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma fonte configurada</h3>
          <p className="text-muted-foreground mb-4">
            Configure sua primeira fonte de dados para começar a sincronizar informações financeiras.
          </p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeira Fonte
          </Button>
        </Card>
      )}

      {/* Modal */}
      <DataSourceModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) setEditingSource(null);
        }}
        source={editingSource}
        onSave={handleSaveSource}
      />
    </div>
  );
};