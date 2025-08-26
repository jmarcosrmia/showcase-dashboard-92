import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, Settings, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { getTemplateById, ReportGenerator } from "@/lib/report-templates";

interface TemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: {
    name: string;
    description: string;
    frequency: string;
  };
}

export const TemplateModal = ({ open, onOpenChange, template }: TemplateModalProps) => {
  const [formData, setFormData] = useState({
    nomeRelatorio: template?.name.replace(/Template|Modelo/gi, '').trim() || "",
    periodo: "",
    entidade: "consolidado",
    cenario: "real",
    formato: "pdf",
    incluirComparacao: true,
    incluirGraficos: true,
    incluirDetalhamento: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { data, filters } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomeRelatorio || !formData.periodo) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome do relatório e selecione um período.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Map template names to template IDs
      const templateIdMap: {[key: string]: string} = {
        'DRE Gerencial': 'dre-gerencial',
        'Análise de Custos': 'analise-custos',
        'Dashboard Executivo': 'dashboard-executivo',
        'Fluxo de Caixa': 'fluxo-caixa',
        'Análise de Margem': 'analise-margem',
        'Análise Comparativa': 'comparativo-periodos'
      };
      
      const templateId = templateIdMap[template?.name || ''];
      const reportTemplate = templateId ? getTemplateById(templateId) : null;
      
      if (!reportTemplate) {
        throw new Error('Template não encontrado');
      }

      // Create report options based on form data
      const reportOptions = {
        incluirComparacao: formData.incluirComparacao,
        incluirGraficos: formData.incluirGraficos,
        incluirDetalhamento: formData.incluirDetalhamento,
        incluirAssinatura: true,
        incluirRodape: true,
        formato: formData.formato as 'pdf' | 'excel' | 'csv',
        orientacao: reportTemplate.defaultOptions.orientacao
      };

      // Generate PDF using the professional template system
      if (formData.formato === 'pdf') {
        const generator = new ReportGenerator(reportOptions);
        const doc = generator.generateFromTemplate(reportTemplate, data, filters, reportOptions);
        
        const fileName = `${formData.nomeRelatorio.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        doc.save(fileName);
        
        console.log(`Generated professional template report: ${fileName}`);
      }

      const reportTitle = formData.nomeRelatorio || `${template?.name} - ${formData.periodo}`;

      toast({
        title: "Relatório criado com sucesso!",
        description: `O relatório "${reportTitle}" foi gerado usando o template "${template?.name}".`,
      });

      setIsGenerating(false);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        nomeRelatorio: "",
        periodo: "",
        entidade: "consolidado",
        cenario: "real",
        formato: "pdf",
        incluirComparacao: true,
        incluirGraficos: true,
        incluirDetalhamento: false
      });
    } catch (error) {
      console.error('Error generating template report:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const templateConfig = template ? {
    "DRE Gerencial": {
      defaultOptions: { incluirComparacao: true, incluirGraficos: true, incluirDetalhamento: true },
      description: "Inclui demonstrativos detalhados, análise de margem e comparativos"
    },
    "Análise de Custos": {
      defaultOptions: { incluirComparacao: false, incluirGraficos: true, incluirDetalhamento: true },
      description: "Foco em detalhamento de custos diretos e indiretos"
    },
    "Dashboard Executivo": {
      defaultOptions: { incluirComparacao: true, incluirGraficos: true, incluirDetalhamento: false },
      description: "Síntese visual com KPIs principais e gráficos"
    }
  }[template.name] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Usar Template: {template?.name}
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros específicos para gerar um relatório baseado neste template.
          </DialogDescription>
        </DialogHeader>

        {template && (
          <div className="p-4 bg-muted rounded-lg mb-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-foreground">{template.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
              </div>
              <Badge variant="outline" className="ml-4">{template.frequency}</Badge>
            </div>
            {templateConfig && (
              <p className="text-sm text-muted-foreground border-t border-border pt-2 mt-2">
                <strong>Configuração:</strong> {templateConfig.description}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nomeRelatorio">Nome do Relatório *</Label>
              <Input
                id="nomeRelatorio"
                value={formData.nomeRelatorio}
                onChange={(e) => setFormData(prev => ({ ...prev, nomeRelatorio: e.target.value }))}
                placeholder={`Ex: ${template?.name} - Dezembro 2024`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodo">Período *</Label>
              <Select value={formData.periodo} onValueChange={(value) => setFormData(prev => ({ ...prev, periodo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dezembro-2024">Dezembro 2024</SelectItem>
                  <SelectItem value="novembro-2024">Novembro 2024</SelectItem>
                  <SelectItem value="outubro-2024">Outubro 2024</SelectItem>
                  <SelectItem value="q4-2024">Q4 2024</SelectItem>
                  <SelectItem value="ano-2024">Ano 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entidade">Entidade</Label>
              <Select value={formData.entidade} onValueChange={(value) => setFormData(prev => ({ ...prev, entidade: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consolidado">Consolidado</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="filial1">Filial 1</SelectItem>
                  <SelectItem value="filial2">Filial 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cenario">Cenário</Label>
              <Select value={formData.cenario} onValueChange={(value) => setFormData(prev => ({ ...prev, cenario: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="real">Real</SelectItem>
                  <SelectItem value="orcado">Orçado</SelectItem>
                  <SelectItem value="projetado">Projetado</SelectItem>
                  <SelectItem value="revisado">Revisado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formato">Formato</Label>
              <Select value={formData.formato} onValueChange={(value) => setFormData(prev => ({ ...prev, formato: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Opções de Conteúdo</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="incluirComparacao"
                  checked={formData.incluirComparacao}
                  onChange={(e) => setFormData(prev => ({ ...prev, incluirComparacao: e.target.checked }))}
                  className="rounded border border-input"
                />
                <Label htmlFor="incluirComparacao" className="text-sm">Incluir análise comparativa</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="incluirGraficos"
                  checked={formData.incluirGraficos}
                  onChange={(e) => setFormData(prev => ({ ...prev, incluirGraficos: e.target.checked }))}
                  className="rounded border border-input"
                />
                <Label htmlFor="incluirGraficos" className="text-sm">Incluir gráficos e visualizações</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="incluirDetalhamento"
                  checked={formData.incluirDetalhamento}
                  onChange={(e) => setFormData(prev => ({ ...prev, incluirDetalhamento: e.target.checked }))}
                  className="rounded border border-input"
                />
                <Label htmlFor="incluirDetalhamento" className="text-sm">Incluir detalhamento de contas</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Calendar className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar com Template
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};