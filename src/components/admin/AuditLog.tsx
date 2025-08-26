import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  Eye,
  User,
  Settings,
  Database,
  FileText,
  Shield,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface AuditLogProps {
  isVisible: boolean;
}

export const AuditLog = ({ isVisible }: AuditLogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  // Mock audit data
  const [auditLogs] = useState([
    {
      id: 1,
      timestamp: "2024-01-18 15:45:32",
      user: "joão@empresa.com",
      action: "LOGIN",
      entity: "Sistema",
      details: "Login realizado com sucesso",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0",
      severity: "info",
      category: "auth"
    },
    {
      id: 2,
      timestamp: "2024-01-18 15:30:15",
      user: "maria@empresa.com",
      action: "CREATE_USER",
      entity: "Usuários",
      details: "Criou usuário: pedro@empresa.com (Papel: Visualizador)",
      ipAddress: "192.168.1.101",
      userAgent: "Chrome 120.0",
      severity: "warning",
      category: "admin"
    },
    {
      id: 3,
      timestamp: "2024-01-18 15:15:42",
      user: "admin@empresa.com",
      action: "DELETE_ACCOUNT",
      entity: "Mapa de Contas",
      details: "Removeu conta: 4.03.001 - Despesas Financeiras",
      ipAddress: "192.168.1.102",
      userAgent: "Firefox 121.0",
      severity: "critical",
      category: "data"
    },
    {
      id: 4,
      timestamp: "2024-01-18 14:50:18",
      user: "joão@empresa.com",
      action: "IMPORT_DATA",
      entity: "Importação",
      details: "Importou planilha: dre_dezembro_2024.xlsx (2.451 registros)",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0",
      severity: "info",
      category: "import"
    },
    {
      id: 5,
      timestamp: "2024-01-18 14:30:05",
      user: "maria@empresa.com",
      action: "UPDATE_SETTINGS",
      entity: "Configurações",
      details: "Alterou configuração: Moeda padrão de USD para BRL",
      ipAddress: "192.168.1.101",
      userAgent: "Chrome 120.0",
      severity: "warning",
      category: "config"
    },
    {
      id: 6,
      timestamp: "2024-01-18 14:15:33",
      user: "pedro@empresa.com",
      action: "EXPORT_REPORT",
      entity: "Relatórios",
      details: "Exportou relatório DRE para Excel (Período: Jan-Dez 2024)",
      ipAddress: "192.168.1.103",
      userAgent: "Safari 17.0",
      severity: "info",
      category: "export"
    },
    {
      id: 7,
      timestamp: "2024-01-18 13:45:21",
      user: "admin@empresa.com",
      action: "FAILED_LOGIN",
      entity: "Sistema",
      details: "Tentativa de login falhada (3ª tentativa em 5 minutos)",
      ipAddress: "201.45.123.45",
      userAgent: "Unknown",
      severity: "critical",
      category: "security"
    },
    {
      id: 8,
      timestamp: "2024-01-18 13:30:12",
      user: "sistema",
      action: "BACKUP_CREATED",
      entity: "Sistema",
      details: "Backup automático criado com sucesso (3.2GB)",
      ipAddress: "127.0.0.1",
      userAgent: "System",
      severity: "info",
      category: "system"
    }
  ]);

  const users = Array.from(new Set(auditLogs.map(log => log.user)));
  
  const actionCategories = [
    { value: "all", label: "Todas as Ações" },
    { value: "auth", label: "Autenticação" },
    { value: "admin", label: "Administração" },
    { value: "data", label: "Dados" },
    { value: "import", label: "Importação" },
    { value: "export", label: "Exportação" },
    { value: "config", label: "Configurações" },
    { value: "security", label: "Segurança" },
    { value: "system", label: "Sistema" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <Shield className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <User className="h-4 w-4" />;
      case 'admin':
        return <Settings className="h-4 w-4" />;
      case 'data':
        return <Database className="h-4 w-4" />;
      case 'import':
      case 'export':
        return <FileText className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || log.category === selectedType;
    const matchesUser = selectedUser === "all" || log.user === selectedUser;
    
    return matchesSearch && matchesType && matchesUser;
  });

  const securityAlerts = auditLogs.filter(log => 
    log.severity === 'critical' || 
    log.action.includes('FAILED') ||
    log.category === 'security'
  );

  const recentActivity = auditLogs.slice(0, 5);

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* Security Alerts */}
      {securityAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Segurança ({securityAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-3 bg-white dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.details}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.user} • {alert.timestamp} • IP: {alert.ipAddress}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os Logs</TabsTrigger>
          <TabsTrigger value="recent">Atividade Recente</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Log de Auditoria Completo
                  </CardTitle>
                  <CardDescription>
                    Histórico completo de todas as ações realizadas no sistema
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    // Create fictional logs export
                    const csvContent = [
                      "Timestamp,User,Action,Details,IP Address,Severity",
                      ...filteredLogs.map(log => 
                        `"${log.timestamp}","${log.user}","${log.action}","${log.details}","${log.ipAddress}","${log.severity}"`
                      )
                    ].join('\n');
                    
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  } catch (error) {
                    console.error("Error exporting logs:", error);
                  }
                }}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Buscar por ação, usuário ou detalhes..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Usuários</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-48">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yy", { locale: ptBR })} -{" "}
                            {format(dateRange.to, "dd/MM/yy", { locale: ptBR })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        )
                      ) : (
                        "Período"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Logs Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead>Severidade</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">
                          {log.timestamp}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {log.user}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(log.category)}
                            <span className="font-medium">{log.action}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <p className="truncate" title={log.details}>
                            {log.details}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getSeverityColor(log.severity)} className="flex items-center gap-1 w-fit">
                            {getSeverityIcon(log.severity)}
                            {log.severity === 'info' ? 'Info' : 
                             log.severity === 'warning' ? 'Atenção' : 'Crítico'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.ipAddress}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Últimas 10 ações realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(log.category)}
                      <Badge variant={getSeverityColor(log.severity)}>
                        {log.severity === 'info' ? 'Info' : 
                         log.severity === 'warning' ? 'Atenção' : 'Crítico'}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{log.action}</p>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.user} • {log.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Logs de Segurança
              </CardTitle>
              <CardDescription>
                Eventos críticos e tentativas de acesso não autorizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 p-4 border border-red-200 bg-red-50 dark:bg-red-950/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div className="flex-1">
                      <p className="font-medium text-red-700 dark:text-red-400">{log.action}</p>
                      <p className="text-sm text-red-600 dark:text-red-300">{log.details}</p>
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {log.user} • {log.timestamp} • IP: {log.ipAddress}
                      </p>
                    </div>
                    <Badge variant="destructive">
                      Crítico
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};