import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DREDetailModal } from "@/components/DREDetailModal";
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  TableProperties,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  FileText,
  BarChart3,
  Target,
  AlertTriangle,
  Calculator,
  Eye,
  Filter,
  Info,
  Maximize2
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";

interface DREAccount {
  id: string;
  name: string;
  value: number;
  percentage?: number;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  level: number;
  parent?: string;
  children?: DREAccount[];
  costCenter?: {
    vendas?: number;
    marketing?: number;
    administrativo?: number;
    financeiro?: number;
  };
}

export const DRETable = () => {
  const { data, filters } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(['receitas', 'despesas']));
  const [viewMode, setViewMode] = useState("table");
  const [compareMode, setCompareMode] = useState("none");
  const [selectedAccount, setSelectedAccount] = useState<DREAccount | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const parseValue = (value: string) => {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  };

  const receitaValue = parseValue(data.receita.value);
  const lucroValue = parseValue(data.lucro.value);
  const ebitdaValue = parseValue(data.ebitda.value);

  const dreAccounts: DREAccount[] = [
    {
      id: 'receitas',
      name: 'RECEITAS',
      value: receitaValue * 1.18,
      level: 0,
      trend: 'up',
      change: '+8.2%',
      children: [
        {
          id: 'receita-bruta',
          name: 'Receita Bruta de Vendas',
          value: receitaValue * 1.18,
          level: 1,
          parent: 'receitas',
          costCenter: {
            vendas: receitaValue * 0.6,
            marketing: receitaValue * 0.3,
            administrativo: receitaValue * 0.08,
            financeiro: receitaValue * 0.02,
          }
        },
        {
          id: 'deducoes',
          name: 'Deduções e Abatimentos',
          value: -(receitaValue * 0.18),
          level: 1,
          parent: 'receitas',
          children: [
            { id: 'impostos', name: 'Impostos sobre Vendas', value: -(receitaValue * 0.12), level: 2, parent: 'deducoes' },
            { id: 'devolucoes', name: 'Devoluções e Cancelamentos', value: -(receitaValue * 0.04), level: 2, parent: 'deducoes' },
            { id: 'descontos', name: 'Descontos Comerciais', value: -(receitaValue * 0.02), level: 2, parent: 'deducoes' },
          ]
        },
        {
          id: 'receita-liquida',
          name: 'RECEITA LÍQUIDA',
          value: receitaValue,
          level: 1,
          parent: 'receitas',
          trend: 'up',
          change: '+5.7%',
        }
      ]
    },
    {
      id: 'cmv',
      name: 'CUSTO DOS PRODUTOS VENDIDOS',
      value: -(receitaValue * 0.6),
      level: 0,
      trend: 'down',
      change: '+3.2%',
      children: [
        { id: 'materiais', name: 'Materiais Diretos', value: -(receitaValue * 0.35), level: 1, parent: 'cmv' },
        { id: 'mao-obra', name: 'Mão de Obra Direta', value: -(receitaValue * 0.15), level: 1, parent: 'cmv' },
        { id: 'custos-indiretos', name: 'Custos Indiretos de Fabricação', value: -(receitaValue * 0.1), level: 1, parent: 'cmv' },
      ]
    },
    {
      id: 'lucro-bruto',
      name: 'LUCRO BRUTO',
      value: lucroValue,
      level: 0,
      trend: 'up',
      change: data.lucro.change,
    },
    {
      id: 'despesas',
      name: 'DESPESAS OPERACIONAIS',
      value: -(lucroValue - ebitdaValue),
      level: 0,
      trend: 'down',
      change: '+2.1%',
      children: [
        {
          id: 'desp-vendas',
          name: 'Despesas de Vendas',
          value: -(lucroValue * 0.25),
          level: 1,
          parent: 'despesas',
          costCenter: {
            vendas: lucroValue * 0.15,
            marketing: lucroValue * 0.08,
            administrativo: lucroValue * 0.02,
          },
          children: [
            { id: 'comissoes', name: 'Comissões', value: -(lucroValue * 0.08), level: 2, parent: 'desp-vendas' },
            { id: 'marketing', name: 'Marketing e Publicidade', value: -(lucroValue * 0.12), level: 2, parent: 'desp-vendas' },
            { id: 'frete', name: 'Frete e Entregas', value: -(lucroValue * 0.05), level: 2, parent: 'desp-vendas' },
          ]
        },
        {
          id: 'desp-admin',
          name: 'Despesas Administrativas',
          value: -(lucroValue * 0.15),
          level: 1,
          parent: 'despesas',
          costCenter: {
            administrativo: lucroValue * 0.1,
            financeiro: lucroValue * 0.03,
            vendas: lucroValue * 0.02,
          },
          children: [
            { id: 'salarios', name: 'Salários e Encargos', value: -(lucroValue * 0.08), level: 2, parent: 'desp-admin' },
            { id: 'aluguel', name: 'Aluguel e Condomínio', value: -(lucroValue * 0.04), level: 2, parent: 'desp-admin' },
            { id: 'tecnologia', name: 'Tecnologia e Software', value: -(lucroValue * 0.03), level: 2, parent: 'desp-admin' },
          ]
        }
      ]
    },
    {
      id: 'ebitda',
      name: 'EBITDA',
      value: ebitdaValue,
      level: 0,
      trend: data.ebitda.trend as 'up' | 'down',
      change: data.ebitda.change,
    },
    {
      id: 'depreciacoes',
      name: 'Depreciações e Amortizações',
      value: -(ebitdaValue * 0.1),
      level: 0,
    },
    {
      id: 'resultado-financeiro',
      name: 'Resultado Financeiro',
      value: -(ebitdaValue * 0.05),
      level: 0,
      children: [
        { id: 'receitas-financeiras', name: 'Receitas Financeiras', value: ebitdaValue * 0.02, level: 1, parent: 'resultado-financeiro' },
        { id: 'despesas-financeiras', name: 'Despesas Financeiras', value: -(ebitdaValue * 0.07), level: 1, parent: 'resultado-financeiro' },
      ]
    },
    {
      id: 'lucro-liquido',
      name: 'LUCRO LÍQUIDO',
      value: ebitdaValue * 0.75,
      level: 0,
      trend: 'up',
      change: '+6.8%',
    }
  ];

  const formatCurrency = (value: number) => {
    const decimals = parseInt(filters.precisao) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: filters.moeda,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const filteredAccounts = useMemo(() => {
    const filterAccounts = (accounts: DREAccount[]): DREAccount[] => {
      return accounts.filter(account => {
        const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase());
        const hasMatchingChildren = account.children ? 
          filterAccounts(account.children).length > 0 : false;
        
        return matchesSearch || hasMatchingChildren;
      }).map(account => ({
        ...account,
        children: account.children ? filterAccounts(account.children) : undefined
      }));
    };

    return filterAccounts(dreAccounts);
  }, [searchTerm]);

  const openDetailModal = (account: DREAccount) => {
    setSelectedAccount(account);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedAccount(null);
  };

  const renderAccount = (account: DREAccount, isVisible: boolean = true) => {
    if (!isVisible) return null;

    const hasChildren = account.children && account.children.length > 0;
    const isExpanded = expandedRows.has(account.id);
    const isMainAccount = account.level === 0 && ['receitas', 'lucro-bruto', 'ebitda', 'lucro-liquido'].includes(account.id);
    const receitaLiquidaValue = receitaValue;
    const percentage = account.level === 0 ? (Math.abs(account.value) / receitaLiquidaValue) * 100 : 0;

    return (
      <React.Fragment key={account.id}>
        <tr 
          className={cn(
            "hover:bg-accent/30 transition-all duration-200 group cursor-pointer",
            account.level === 0 && "font-semibold border-t border-border/30",
            isMainAccount && "bg-gradient-to-r from-primary/8 to-primary/3 border-l-4 border-l-primary/60 shadow-sm",
            account.level === 1 && "bg-muted/20",
            account.level === 2 && "bg-muted/10"
          )}
          onClick={() => openDetailModal(account)}
        >
          <td className="p-3 pl-4">
            <div 
              className="flex items-center gap-3"
              style={{ paddingLeft: `${account.level * 20}px` }}
            >
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren) toggleRow(account.id);
                }}
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors flex-shrink-0" />
                  )
                ) : (
                  <div className="w-4 h-4 flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-medium transition-colors truncate",
                      account.level === 0 && "font-bold text-foreground text-base",
                      account.level === 1 && "text-foreground/90",
                      account.level === 2 && "text-muted-foreground text-sm",
                      isMainAccount && "text-primary font-bold text-lg"
                    )}>
                      {account.name}
                    </span>
                    
                    {isMainAccount && (
                      <Badge variant="secondary" className="text-xs bg-primary/15 text-primary border-primary/30">
                        Principal
                      </Badge>
                    )}
                  </div>
                  
                  {/* Cost center info for level 1 accounts */}
                  {account.costCenter && account.level === 1 && (
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(account.costCenter).slice(0, 2).map(([center, value]) => (
                        <span key={center} className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                          {center}: {formatCurrency(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
          
          <td className="p-3 text-right">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-mono font-semibold",
                  account.value >= 0 ? "text-foreground" : "text-red-600 dark:text-red-400",
                  isMainAccount ? "text-lg font-bold text-primary" : "text-sm",
                  account.level === 1 && "text-base"
                )}>
                  {formatCurrency(account.value)}
                </span>
                
                {account.level === 0 && percentage > 0 && (
                  <span className="text-xs font-medium text-muted-foreground bg-muted/30 px-2 py-0.5 rounded">
                    {percentage.toFixed(1)}%
                  </span>
                )}
              </div>
              
              {account.trend && account.change && (
                <div className="flex items-center gap-1 text-xs">
                  {account.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : account.trend === 'down' ? (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  ) : (
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={cn(
                    "font-medium",
                    account.trend === 'up' ? "text-emerald-600 dark:text-emerald-400" : 
                    account.trend === 'down' ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  )}>
                    {account.change}
                  </span>
                </div>
              )}
            </div>
          </td>
          
          <td className="p-3 text-right">
            <div className="flex items-center justify-end gap-2">
              {account.costCenter && Object.keys(account.costCenter).length > 2 && (
                <span className="text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-full">
                  +{Object.keys(account.costCenter).length - 2} centros
                </span>
              )}
              
              <div className="w-2 h-2 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </td>
        </tr>
        
        {hasChildren && isExpanded && account.children?.map(child => 
          renderAccount(child, true)
        )}
      </React.Fragment>
    );
  };

  const exportToPDF = async () => {
    try {
      // Create fictional PDF content
      const documentContent = `
DRE REPORT - PDF FORMAT
=======================

Date: ${new Date().toLocaleDateString('pt-BR')}
Period: ${filters.periodo}
Entity: ${filters.entidade}
Scenario: ${filters.cenario}

INCOME STATEMENT:
- Revenue: ${formatCurrency(receitaValue)}
- Gross Profit: ${formatCurrency(lucroValue)}
- EBITDA: ${formatCurrency(ebitdaValue)}

Report generated automatically from DRE system.
      `;
      
      // Create and download file
      const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dre-report-${filters.periodo.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  const exportToExcel = async () => {
    try {
      // Create fictional Excel content in CSV format
      const csvContent = [
        "Conta,Valor,Categoria",
        `Receita,${receitaValue},Receita`,
        `Lucro Bruto,${lucroValue},Lucro`,
        `EBITDA,${ebitdaValue},EBITDA`,
        `Período,${filters.periodo},Metadata`,
        `Entidade,${filters.entidade},Metadata`
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dre-data-${filters.periodo.replace(/\s+/g, '-').toLowerCase()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  return (
    <Card className="bg-dashboard-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <TableProperties className="h-4 w-4 text-primary" />
              Demonstração do Resultado
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Análise detalhada por conta - {filters.cenario} {filters.periodo.replace('-', ' ')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={compareMode} onValueChange={setCompareMode}>
              <SelectTrigger className="h-8 w-32 bg-background/50 border-border/60 text-xs">
                <SelectValue placeholder="Comparar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem comparação</SelectItem>
                <SelectItem value="previous">Período anterior</SelectItem>
                <SelectItem value="budget">Orçado</SelectItem>
                <SelectItem value="ytd">Ano anterior</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={exportToExcel} className="h-8 text-xs">
              <Download className="h-3 w-3 mr-1" />
              Excel
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportToPDF} className="h-8 text-xs">
              <FileText className="h-3 w-3 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="grid w-fit grid-cols-3 bg-muted/50">
              <TabsTrigger value="table" className="text-xs">
                <TableProperties className="h-3 w-3 mr-1" />
                Tabela
              </TabsTrigger>
              <TabsTrigger value="visual" className="text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs">
                <Calculator className="h-3 w-3 mr-1" />
                Análise
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar conta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-8 w-48 bg-background/60 border-border/60 text-sm"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedRows(new Set(dreAccounts.map(acc => acc.id)))}
                className="h-8 text-xs bg-background/50 border-border/60 hover:bg-accent/50"
              >
                <Eye className="h-3 w-3 mr-1" />
                Expandir
              </Button>
            </div>
          </div>

          <TabsContent value="table" className="mt-4 space-y-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-y border-border/30">
                  <tr>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Conta
                    </th>
                    <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Valor & Variação
                    </th>
                    <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Detalhes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map(account => renderAccount(account))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="visual" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Composição da Receita
                </h4>
                <div className="space-y-2">
                  {['Receita Bruta', 'Deduções', 'Receita Líquida'].map((item, i) => (
                    <div key={item} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-2 rounded-full bg-gradient-to-r ${i === 0 ? 'from-blue-500 to-blue-600' : i === 1 ? 'from-red-500 to-red-600' : 'from-green-500 to-green-600'}`} />
                        <span className="font-mono text-xs">{formatCurrency([receitaValue * 1.18, -(receitaValue * 0.18), receitaValue][i])}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Margens Chave
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Margem Bruta</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600 w-10/12" />
                      </div>
                      <span className="text-sm font-mono">{data.margemBruta.value}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Margem EBITDA</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-8/12" />
                      </div>
                      <span className="text-sm font-mono">{data.margemEbitda.value}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Margem Líquida</span>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 w-6/12" />
                      </div>
                      <span className="text-sm font-mono">{data.margemLiquida.value}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Alertas e Desvios
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                    <span className="text-xs">CMV acima da meta (+3.2%)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs">Despesas admin. crescendo</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Performance vs Budget
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Receita</span>
                    <span className="text-green-600 font-medium">+3.2%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">EBITDA</span>
                    <span className="text-green-600 font-medium">+5.8%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Lucro Líquido</span>
                    <span className="text-green-600 font-medium">+6.8%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-blue-500" />
                  Indicadores Chave
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">ROE</span>
                    <span className="font-mono">{data.roe.value}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Giro do Ativo</span>
                    <span className="font-mono">1.8x</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Endividamento</span>
                    <span className="font-mono">42.5%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0">
        {viewMode === "table" && (
          <div className="border-t border-border/50 pt-4 px-4 pb-4">
            <div className="text-xs text-muted-foreground">
              💡 <strong>Dica:</strong> Clique nas contas para expandir detalhes ou use os filtros para análises específicas
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal de Detalhes */}
      <DREDetailModal 
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        account={selectedAccount}
      />
    </Card>
  );
};