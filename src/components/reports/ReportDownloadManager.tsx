
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { getTemplateById, ReportGenerator } from "@/lib/report-templates";
import { ExcelGenerator } from "@/lib/excel-generator";
import { CSVGenerator } from "@/lib/csv-generator";

interface ReportDownloadManagerProps {
  reportId: number;
  title: string;
  format?: 'pdf' | 'excel' | 'csv';
  size?: string;
}

export const ReportDownloadManager = ({ 
  reportId, 
  title, 
  format = 'pdf', 
  size = '0 MB' 
}: ReportDownloadManagerProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { data, filters } = useData();

  function getTemplateByTitle(title: string): string | null {
    const titleMap: {[key: string]: string} = {
      'Demonstrativo de Resultado do Exercício': 'dre-gerencial',
      'Análise de Margem por Produto': 'analise-margem',
      'Relatório de Tendências Financeiras': 'comparativo-periodos',
      'Fluxo de Caixa Detalhado': 'fluxo-caixa',
      'Análise de Custos por Centro': 'analise-custos',
      'Dashboard Executivo': 'dashboard-executivo'
    };
    
    return titleMap[title] || null;
  }

  function generatePDFReport() {
    const templateId = getTemplateByTitle(title);
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
    const defaultTemplate = getTemplateById('dre-gerencial');
    if (defaultTemplate) {
      const reportOptions = {
        incluirComparacao: true,
        incluirGraficos: false,
        incluirDetalhamento: false,
        incluirAssinatura: true,
        incluirRodape: true,
        formato: 'pdf' as const,
        orientacao: 'portrait' as const
      };
      
      const generator = new ReportGenerator(reportOptions);
      return generator.generateFromTemplate(defaultTemplate, data, filters, reportOptions);
    }
    
    throw new Error('Não foi possível gerar o relatório');
  }

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Simulate download preparation
      await new Promise(resolve => setTimeout(resolve, 800));

      const templateId = getTemplateByTitle(title);

      if (format === 'pdf') {
        const doc = generatePDFReport();
        
        if (!doc) {
          throw new Error('Falha ao gerar o documento PDF');
        }
        
        const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        doc.save(fileName);
        
        console.log(`PDF generated successfully: ${fileName}`);
      } else if (format === 'excel') {
        ExcelGenerator.generateReport(title, data, filters, templateId || 'default');
        console.log(`Excel file generated successfully`);
      } else if (format === 'csv') {
        CSVGenerator.generateReport(title, data, filters, templateId || 'default');
        console.log(`CSV file generated successfully`);
      }

      toast({
        title: "Download concluído",
        description: `O relatório "${title}" foi baixado com sucesso em formato ${format.toUpperCase()}.`,
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o relatório. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatExtension = format.toUpperCase();
  const formatColor = format === 'pdf' ? 'text-red-600' : 
                    format === 'excel' ? 'text-green-600' : 
                    'text-blue-600';

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs text-muted-foreground">
        <span className={`font-medium ${formatColor}`}>{formatExtension}</span>
        {size && <span className="ml-1">• {size}</span>}
      </div>
      
      <Button 
        size="sm" 
        variant="outline" 
        onClick={handleDownload}
        disabled={isDownloading}
        className="h-8 w-8 p-0"
        title={`Download ${title} em formato ${formatExtension}`}
      >
        {isDownloading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Download className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};
