import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Settings as SettingsIcon,
  Save,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: any;
  onSave: (source: any) => void;
}

export const DataSourceModal = ({ open, onOpenChange, source, onSave }: DataSourceModalProps) => {
  const [formData, setFormData] = useState({
    name: source?.name || "",
    type: source?.type || "database",
    host: source?.host || "",
    port: source?.port || "",
    database: source?.database || "",
    username: source?.username || "",
    password: source?.password || "",
    enabled: source?.enabled ?? true,
    autoSync: source?.autoSync ?? true,
    syncInterval: source?.syncInterval || "daily"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.host) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e host da conexão.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: source ? "Fonte atualizada" : "Fonte criada",
      description: `A fonte de dados "${formData.name}" foi ${source ? 'atualizada' : 'criada'} com sucesso.`,
    });
    onOpenChange(false);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus('testing');

    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isSuccess = Math.random() > 0.3; // 70% success rate
    setConnectionStatus(isSuccess ? 'success' : 'error');
    
    toast({
      title: isSuccess ? "Conexão bem-sucedida" : "Falha na conexão",
      description: isSuccess 
        ? "A conexão com a fonte de dados foi estabelecida com sucesso."
        : "Não foi possível conectar. Verifique as credenciais e tente novamente.",
      variant: isSuccess ? "default" : "destructive"
    });

    setIsTestingConnection(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {source ? 'Editar' : 'Nova'} Fonte de Dados
          </DialogTitle>
          <DialogDescription>
            Configure uma fonte de dados para sincronização automática de informações financeiras.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome da Fonte *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: ERP Principal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Fonte</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Banco de Dados</SelectItem>
                  <SelectItem value="api">API REST</SelectItem>
                  <SelectItem value="file">Arquivo (CSV/Excel)</SelectItem>
                  <SelectItem value="erp">Sistema ERP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="host">Host/Servidor *</Label>
              <Input
                id="host"
                value={formData.host}
                onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                placeholder="localhost ou IP do servidor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">Porta</Label>
              <Input
                id="port"
                type="number"
                value={formData.port}
                onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                placeholder="3306, 1433, 5432..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="database">Base de Dados</Label>
              <Input
                id="database"
                value={formData.database}
                onChange={(e) => setFormData(prev => ({ ...prev, database: e.target.value }))}
                placeholder="Nome da base de dados"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Nome de usuário"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Senha de acesso"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="syncInterval">Intervalo de Sincronização</Label>
              <Select value={formData.syncInterval} onValueChange={(value) => setFormData(prev => ({ ...prev, syncInterval: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Tempo Real</SelectItem>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enabled">Fonte Ativa</Label>
                  <p className="text-sm text-muted-foreground">Permitir sincronização automática</p>
                </div>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSync">Sincronização Automática</Label>
                  <p className="text-sm text-muted-foreground">Sincronizar dados automaticamente</p>
                </div>
                <Switch
                  id="autoSync"
                  checked={formData.autoSync}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoSync: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Connection Test */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Teste de Conexão</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={isTestingConnection || !formData.host}
              >
                {isTestingConnection ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Testar Conexão
                  </>
                )}
              </Button>
            </div>

            {connectionStatus !== 'idle' && (
              <div className="flex items-center gap-2">
                {connectionStatus === 'testing' && (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm">Estabelecendo conexão...</span>
                  </>
                )}
                {connectionStatus === 'success' && (
                  <>
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">Conexão estabelecida com sucesso</span>
                  </>
                )}
                {connectionStatus === 'error' && (
                  <>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">Falha na conexão</span>
                  </>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              {source ? 'Atualizar' : 'Criar'} Fonte
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};