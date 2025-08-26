import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Code, File, Loader2, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { getTemplateById, ReportGenerator } from "@/lib/report-templates";
import { ExcelGenerator } from "@/lib/excel-generator";
import { CSVGenerator } from "@/lib/csv-generator";
import { TXTGenerator } from "@/lib/txt-generator";
import { XMLGenerator } from "@/lib/xml-generator";

export const DashboardExportButton = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string>("");
  const { toast } = useToast();
  const { data, filters } = useData();

  const exportFormats = [
    {
      key: 'pdf',
      label: 'PDF',
      description: 'Documento com formatação completa',
      icon: FileText,
      color: 'text-red-600'
    },
    {
      key: 'excel',
      label: 'Excel (XLSX)',
      description: 'Planilha para análise avançada',
      icon: FileSpreadsheet,
      color: 'text-green-600'
    },
    {
      key: 'csv',
      label: 'CSV',
      description: 'Dados tabulados separados por vírgula',
      icon: FileSpreadsheet,
      color: 'text-blue-600'
    },
    {
      key: 'txt',
      label: 'TXT',
      description: 'Texto formatado para leitura',
      icon: File,
      color: 'text-gray-600'
    },
    {
      key: 'xml',
      label: 'XML',
      description: 'Dados estruturados hierarquicamente',
      icon: Code,
      color: 'text-orange-600'
    }
  ];

  function getTemplateByTitle(title: string): string | null {
    const titleMap: {[key: string]: string} = {
      'Dashboard Executivo': 'dashboard-executivo',
      'Dashboard': 'dashboard-executivo',
      'Demonstrativo de Resultado do Exercício': 'dre-gerencial',
      'Análise de Margem por Produto': 'analise-margem',
      'Relatório de Tendências Financeiras': 'comparativo-periodos',
      'Fluxo de Caixa Detalhado': 'fluxo-caixa',
      'Análise de Custos por Centro': 'analise-custos'
    };
    
    return titleMap[title] || 'dashboard-executivo';
  }

  function generatePDFReport() {
    const templateId = getTemplateByTitle('Dashboard Executivo');
    const template = templateId ? getTemplateById(templateId) : null;
    
    if (template) {
      const reportOptions = {
        incluirComparacao: true,
        incluirGraficos: true,
        incluirDetalhamento: true,
        incluirAssinatura: true,
        incluirRodape: true,
        formato: 'pdf' as const,
        orientacao: template.defaultOptions.orientacao
      };
      
      const generator = new ReportGenerator(reportOptions);
      return generator.generateFromTemplate(template, data, filters, reportOptions);
    }
    
    // Fallback to default template
    const defaultTemplate = getTemplateById('dashboard-executivo');
    if (defaultTemplate) {
      const reportOptions = {
        incluirComparacao: true,
        incluirGraficos: true,
        incluirDetalhamento: false,
        incluirAssinatura: true,
        incluirRodape: true,
        formato: 'pdf' as const,
        orientacao: 'landscape' as const
      };
      
      const generator = new ReportGenerator(reportOptions);
      return generator.generateFromTemplate(defaultTemplate, data, filters, reportOptions);
    }
    
    throw new Error('Não foi possível gerar o relatório PDF');
  }

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportingFormat(format);

    try {
      // Simulate download preparation
      await new Promise(resolve => setTimeout(resolve, 800));

      const title = 'Dashboard Executivo';
      const templateId = getTemplateByTitle(title);

      if (format === 'pdf') {
        const doc = generatePDFReport();
        
        if (!doc) {
          throw new Error('Falha ao gerar o documento PDF');
        }
        
        const fileName = `dashboard-executivo-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        console.log(`PDF generated successfully: ${fileName}`);
      } else if (format === 'excel') {
        ExcelGenerator.generateReport(title, data, filters, templateId || 'dashboard-executivo');
        console.log(`Excel file generated successfully`);
      } else if (format === 'csv') {
        CSVGenerator.generateReport(title, data, filters, templateId || 'dashboard-executivo');
        console.log(`CSV file generated successfully`);
      } else if (format === 'txt') {
        TXTGenerator.generateReport(title, data, filters, templateId || 'dashboard-executivo');
        console.log(`TXT file generated successfully`);
      } else if (format === 'xml') {
        XMLGenerator.generateReport(title, data, filters, templateId || 'dashboard-executivo');
        console.log(`XML file generated successfully`);
      }

      toast({
        title: "Download concluído",
        description: `O dashboard foi exportado com sucesso em formato ${format.toUpperCase()}.`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o dashboard. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setExportingFormat("");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando {exportingFormat.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Exportar Dashboard
              <ChevronDown className="h-3 w-3 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Escolha o formato de exportação
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {exportFormats.map((format) => {
          const Icon = format.icon;
          return (
            <DropdownMenuItem
              key={format.key}
              onClick={() => handleExport(format.key)}
              disabled={isExporting}
              className="flex items-start gap-3 py-3 cursor-pointer"
            >
              <Icon className={`h-4 w-4 mt-0.5 ${format.color}`} />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{format.label}</span>
                  {isExporting && exportingFormat === format.key && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {format.description}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground">
            Todos os dados do dashboard serão incluídos com formatação padrão dos relatórios
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};