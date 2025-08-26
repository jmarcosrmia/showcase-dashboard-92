import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { AccountModal } from "@/components/admin/AccountModal";
import { CompanyModal } from "@/components/admin/CompanyModal";
import { UserModal } from "@/components/admin/UserModal";
import { LogDetailsModal } from "@/components/admin/LogDetailsModal";
import { ImportExportModal } from "@/components/admin/ImportExportModal";
import { SystemMonitor } from "@/components/admin/SystemMonitor";
import { AuditLog } from "@/components/admin/AuditLog";
import { BackupManager } from "@/components/admin/BackupManager";
import {
  Settings,
  Users,
  MapPin,
  FileText,
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Play,
  Building2,
  Database,
  UserPlus,
  CreditCard,
  Globe,
  RefreshCw,
  ChevronRight,
  Activity,
  Shield,
  HardDrive
} from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  
  // Estado para controlar a seção ativa
  const [activeSection, setActiveSection] = useState("accounts");
  
  // Estados para modais
  const [accountModal, setAccountModal] = useState<{ isOpen: boolean; account: any }>({ isOpen: false, account: null });
  const [companyModal, setCompanyModal] = useState<{ isOpen: boolean; company: any }>({ isOpen: false, company: null });
  const [userModal, setUserModal] = useState<{ isOpen: boolean; user: any; isInvite: boolean }>({ isOpen: false, user: null, isInvite: false });
  const [logModal, setLogModal] = useState<{ isOpen: boolean; log: any }>({ isOpen: false, log: null });
  const [importExportModal, setImportExportModal] = useState<{ isOpen: boolean; type: "import" | "export"; dataType: "accounts" | "companies" | "users" }>({ isOpen: false, type: "import", dataType: "accounts" });
  
  // Estados para busca e filtros
  const [searchTerms, setSearchTerms] = useState({
    accounts: "",
    logs: ""
  });
  const [filters, setFilters] = useState({
    logs: "all"
  });

  // Mock data para Mapa de Contas
  const [accounts, setAccounts] = useState([
    { id: 1, code: "1.01.001", description: "Receita de Vendas", dreCategory: "Receita Bruta", status: "Ativo" },
    { id: 2, code: "1.01.002", description: "Prestação de Serviços", dreCategory: "Receita Bruta", status: "Ativo" },
    { id: 3, code: "3.01.001", description: "CMV - Mercadorias", dreCategory: "CMV", status: "Ativo" },
    { id: 4, code: "4.01.001", description: "Despesas Comerciais", dreCategory: "Despesas Operacionais", status: "Ativo" },
    { id: 5, code: "4.02.001", description: "Despesas Administrativas", dreCategory: "Despesas Operacionais", status: "Ativo" }
  ]);

  // Mock data para Empresas & Filiais
  const [companies, setCompanies] = useState([
    { id: 1, name: "Prime Flow LTDA", cnpj: "12.345.678/0001-90", branch: "Matriz", active: true, consolidated: true },
    { id: 2, name: "Prime Flow SP", cnpj: "12.345.678/0002-71", branch: "Filial São Paulo", active: true, consolidated: true },
    { id: 3, name: "Prime Flow RJ", cnpj: "12.345.678/0003-52", branch: "Filial Rio de Janeiro", active: false, consolidated: false }
  ]);

  // Mock data para Logs de Importação
  const [importLogs] = useState([
    { id: 1, filename: "dre_dezembro_2024.xlsx", date: "2024-01-18 15:30", status: "Sucesso", records: 2451, details: null },
    { id: 2, filename: "balancete_janeiro_2024.csv", date: "2024-01-18 14:15", status: "Sucesso", records: 1876, details: null },
    { id: 3, filename: "lancamentos_contabeis.xlsx", date: "2024-01-18 10:45", status: "Erro", records: 0, details: "Formato de data inválido na linha 45" },
    { id: 4, filename: "dados_orcamento_2024.xlsx", date: "2024-01-17 16:20", status: "Sucesso", records: 3205, details: null }
  ]);

  // Mock data para Usuários
  const [users, setUsers] = useState([
    { id: 1, name: "João Silva", email: "joao@empresa.com", role: "Administrador", status: "Ativo", lastLogin: "2024-01-18 14:30" },
    { id: 2, name: "Maria Santos", email: "maria@empresa.com", role: "Financeiro", status: "Ativo", lastLogin: "2024-01-18 09:15" },
    { id: 3, name: "Pedro Costa", email: "pedro@empresa.com", role: "Visualizador", status: "Inativo", lastLogin: "2024-01-15 16:45" }
  ]);

  // Estado para configurações gerais
  const [settings, setSettings] = useState({
    currency: "BRL",
    decimals: 2,
    driveFolder: "1a2b3c4d5e6f7g8h9i0j",
    defaultScenario: "Real"
  });

  // Handlers para modais e ações
  const handleSaveAccount = (accountData: any) => {
    if (accountModal.account) {
      setAccounts(accounts.map(acc => acc.id === accountModal.account.id ? { ...accountData, id: accountModal.account.id } : acc));
    } else {
      setAccounts([...accounts, { ...accountData, id: Date.now() }]);
    }
    setAccountModal({ isOpen: false, account: null });
  };

  const handleSaveCompany = (companyData: any) => {
    if (companyModal.company) {
      setCompanies(companies.map(comp => comp.id === companyModal.company.id ? { ...companyData, id: companyModal.company.id } : comp));
    } else {
      setCompanies([...companies, { ...companyData, id: Date.now() }]);
    }
    setCompanyModal({ isOpen: false, company: null });
  };

  const handleSaveUser = (userData: any) => {
    if (userModal.user) {
      setUsers(users.map(user => user.id === userModal.user.id ? { ...userData, id: userModal.user.id, lastLogin: user.lastLogin } : user));
    } else {
      setUsers([...users, { ...userData, id: Date.now(), lastLogin: "Nunca" }]);
    }
    setUserModal({ isOpen: false, user: null, isInvite: false });
  };

  const handleDeleteAccount = (accountId: number) => {
    setAccounts(accounts.filter(acc => acc.id !== accountId));
    toast({
      title: "Conta removida",
      description: "A conta foi removida com sucesso.",
    });
  };

  const handleDeleteCompany = (companyId: number) => {
    setCompanies(companies.filter(comp => comp.id !== companyId));
    toast({
      title: "Empresa removida",
      description: "A empresa foi removida com sucesso.",
    });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso.",
    });
  };

  const handleRunPipeline = () => {
    toast({
      title: "Pipeline executado",
      description: "O processamento das planilhas foi iniciado.",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As alterações foram aplicadas com sucesso.",
    });
  };

  // Filtros de dados
  const filteredAccounts = accounts.filter(account =>
    account.code.toLowerCase().includes(searchTerms.accounts.toLowerCase()) ||
    account.description.toLowerCase().includes(searchTerms.accounts.toLowerCase()) ||
    account.dreCategory.toLowerCase().includes(searchTerms.accounts.toLowerCase())
  );

  const filteredLogs = importLogs.filter(log => {
    const matchesSearch = log.filename.toLowerCase().includes(searchTerms.logs.toLowerCase());
    const matchesFilter = filters.logs === "all" || 
      (filters.logs === "success" && log.status === "Sucesso") ||
      (filters.logs === "error" && log.status === "Erro");
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="container-responsive max-w-7xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6 overflow-x-hidden">
        {/* Header Section */}
        <div className="flex flex-col gap-2 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Painel Administrativo</h2>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Controle completo do sistema, dados e configurações</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 touch-target ${activeSection === 'accounts' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
            onClick={() => setActiveSection('accounts')}
          >
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-blue-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-xs sm:text-sm truncate">Mapa de Contas</p>
                  <p className="text-xs text-muted-foreground truncate">Contas contábeis</p>
                </div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 ${activeSection === 'companies' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              onClick={() => setActiveSection('companies')}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">Empresas & Filiais</p>
                    <p className="text-xs text-muted-foreground truncate">Entidades</p>
                  </div>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 ${activeSection === 'logs' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              onClick={() => setActiveSection('logs')}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">Logs Importação</p>
                    <p className="text-xs text-muted-foreground truncate">Processamento</p>
                  </div>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 ${activeSection === 'users' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              onClick={() => setActiveSection('users')}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">Usuários</p>
                    <p className="text-xs text-muted-foreground truncate">Permissões</p>
                  </div>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 ${activeSection === 'settings' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">Configurações</p>
                    <p className="text-xs text-muted-foreground truncate">Sistema</p>
                  </div>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 ${activeSection === 'monitor' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              onClick={() => setActiveSection('monitor')}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 flex-shrink-0">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">Monitoramento</p>
                    <p className="text-xs text-muted-foreground truncate">Sistema</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 ${activeSection === 'audit' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              onClick={() => setActiveSection('audit')}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 flex-shrink-0">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">Auditoria</p>
                    <p className="text-xs text-muted-foreground truncate">Logs</p>
                  </div>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 ${activeSection === 'backup' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              onClick={() => setActiveSection('backup')}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 flex-shrink-0">
                    <HardDrive className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">Backup</p>
                    <p className="text-xs text-muted-foreground truncate">Segurança</p>
                  </div>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Sections */}
          {activeSection === 'accounts' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      Mapa de Contas
                    </CardTitle>
                    <CardDescription>
                      Gerenciamento das contas contábeis e mapeamento para DRE
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" onClick={() => setImportExportModal({ isOpen: true, type: "import", dataType: "accounts" })}>
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Importar</span>
                      <span className="sm:hidden">Import</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setImportExportModal({ isOpen: true, type: "export", dataType: "accounts" })}>
                      <Download className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Exportar</span>
                      <span className="sm:hidden">Export</span>
                    </Button>
                    <Button size="sm" onClick={() => setAccountModal({ isOpen: true, account: null })}>
                      <Plus className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Nova Conta</span>
                      <span className="sm:hidden">Nova</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Buscar contas..." 
                      className="pl-10" 
                      value={searchTerms.accounts}
                      onChange={(e) => setSearchTerms({ ...searchTerms, accounts: e.target.value })}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </div>
                <div className="table-responsive overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Código</TableHead>
                        <TableHead className="min-w-[200px]">Descrição</TableHead>
                        <TableHead className="hidden md:table-cell min-w-[150px]">Linha DRE</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[80px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-mono text-xs sm:text-sm">{account.code}</TableCell>
                          <TableCell className="max-w-[150px] sm:max-w-[200px] truncate">{account.description}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary" className="text-xs">{account.dreCategory}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={account.status === 'Ativo' ? 'default' : 'outline'} className="text-xs">
                              {account.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 touch-target"
                                onClick={() => setAccountModal({ isOpen: true, account })}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive touch-target">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm">
                                      Tem certeza que deseja remover a conta "{account.description}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                    <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteAccount(account.id)}
                                      className="w-full sm:w-auto"
                                    >
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
          )}

          {activeSection === 'companies' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-green-500" />
                      Empresas & Filiais
                    </CardTitle>
                    <CardDescription>
                      Gerenciamento de entidades empresariais e centros de custo
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setCompanyModal({ isOpen: true, company: null })}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Empresa
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="table-responsive overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Empresa</TableHead>
                        <TableHead className="hidden sm:table-cell min-w-[150px]">CNPJ</TableHead>
                        <TableHead className="min-w-[100px]">Tipo</TableHead>
                        <TableHead className="hidden lg:table-cell min-w-[100px]">Status</TableHead>
                        <TableHead className="hidden lg:table-cell min-w-[120px]">Consolidado</TableHead>
                        <TableHead className="min-w-[80px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{company.name}</p>
                              <p className="text-xs text-muted-foreground">{company.branch}</p>
                              <p className="sm:hidden text-xs text-muted-foreground font-mono">{company.cnpj}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell font-mono text-sm">{company.cnpj}</TableCell>
                          <TableCell>
                            <Badge variant={company.branch === 'Matriz' ? 'default' : 'secondary'} className="text-xs">
                              {company.branch === 'Matriz' ? 'Matriz' : 'Filial'}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <Switch checked={company.active} />
                              <span className="text-sm">{company.active ? 'Ativo' : 'Inativo'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-2">
                              <Switch checked={company.consolidated} />
                              <span className="text-sm">{company.consolidated ? 'Sim' : 'Não'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 touch-target" onClick={() => setCompanyModal({ isOpen: true, company })}>
                                <Edit className="w-3 h-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 touch-target">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription className="text-sm">
                                      Tem certeza que deseja remover a empresa "{company.name}"? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                    <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteCompany(company.id)}
                                      className="w-full sm:w-auto"
                                    >
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
          )}

          {activeSection === 'logs' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      Logs de Importação
                    </CardTitle>
                    <CardDescription>
                      Histórico de processamento de planilhas e dados
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Buscar arquivos..." 
                        className="pl-10 w-48" 
                        value={searchTerms.logs}
                        onChange={(e) => setSearchTerms({ ...searchTerms, logs: e.target.value })}
                      />
                    </div>
                    <Select value={filters.logs} onValueChange={(value) => setFilters({ ...filters, logs: value })}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="success">Sucesso</SelectItem>
                        <SelectItem value="error">Erro</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Atualizar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Arquivo</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registros</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.filename}</TableCell>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {log.status === 'Sucesso' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <Badge variant={log.status === 'Sucesso' ? 'default' : 'destructive'}>
                              {log.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{log.records.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => setLogModal({ isOpen: true, log })}>
                            <Eye className="w-4 h-4 mr-2" />
                            {log.status === 'Erro' ? 'Ver Erro' : 'Detalhes'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeSection === 'users' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-indigo-500" />
                      Usuários e Permissões
                    </CardTitle>
                    <CardDescription>
                      Controle de acesso e gerenciamento de usuários
                    </CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setUserModal({ isOpen: true, user: null, isInvite: true })}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Convidar Usuário
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'Administrador' ? 'destructive' : user.role === 'Financeiro' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Ativo' ? 'default' : 'outline'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setUserModal({ isOpen: true, user, isInvite: false })}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja remover o usuário "{user.name}"? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
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
              </CardContent>
            </Card>
          )}

          {activeSection === 'settings' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Configurações Gerais
                </CardTitle>
                <CardDescription>
                  Definições globais do sistema e integração
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currency">Moeda Padrão</Label>
                      <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                          <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                          <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="decimals">Casas Decimais</Label>
                      <Select value={settings.decimals.toString()} onValueChange={(value) => setSettings({...settings, decimals: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 casas decimais</SelectItem>
                          <SelectItem value="2">2 casas decimais</SelectItem>
                          <SelectItem value="4">4 casas decimais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="scenario">Cenário Padrão</Label>
                      <Select value={settings.defaultScenario} onValueChange={(value) => setSettings({...settings, defaultScenario: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Real">Real</SelectItem>
                          <SelectItem value="Orçado">Orçado</SelectItem>
                          <SelectItem value="Forecast">Forecast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="driveFolder">ID da Pasta Google Drive</Label>
                      <Input 
                        id="driveFolder" 
                        value={settings.driveFolder}
                        onChange={(e) => setSettings({...settings, driveFolder: e.target.value})}
                        placeholder="1a2b3c4d5e6f7g8h9i0j"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Pipeline de Importação</h4>
                    <p className="text-sm text-muted-foreground">Executar processamento manual das planilhas</p>
                  </div>
                  <Button onClick={handleRunPipeline}>
                    <Play className="w-4 h-4 mr-2" />
                    Executar Pipeline
                  </Button>
                </div>

                <Separator />

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* New Sections */}
          <SystemMonitor isVisible={activeSection === 'monitor'} />
          <AuditLog isVisible={activeSection === 'audit'} />
          <BackupManager isVisible={activeSection === 'backup'} />
        </div>

      {/* Modals */}
      <AccountModal
        isOpen={accountModal.isOpen}
        onClose={() => setAccountModal({ isOpen: false, account: null })}
        account={accountModal.account}
        onSave={handleSaveAccount}
      />

      <CompanyModal
        isOpen={companyModal.isOpen}
        onClose={() => setCompanyModal({ isOpen: false, company: null })}
        company={companyModal.company}
        onSave={handleSaveCompany}
      />

      <UserModal
        isOpen={userModal.isOpen}
        onClose={() => setUserModal({ isOpen: false, user: null, isInvite: false })}
        user={userModal.user}
        onSave={handleSaveUser}
        isInvite={userModal.isInvite}
      />

      <LogDetailsModal
        isOpen={logModal.isOpen}
        onClose={() => setLogModal({ isOpen: false, log: null })}
        log={logModal.log}
      />

      <ImportExportModal
        isOpen={importExportModal.isOpen}
        onClose={() => setImportExportModal({ isOpen: false, type: "import", dataType: "accounts" })}
        type={importExportModal.type}
        dataType={importExportModal.dataType}
      />
    </AppLayout>
  );
};

export default Admin;