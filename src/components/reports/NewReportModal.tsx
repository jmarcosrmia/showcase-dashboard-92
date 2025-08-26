import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, FileText, PieChart, TrendingUp, BarChart3, Building2, LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { REPORT_TEMPLATES, ReportGenerator } from "@/lib/report-templates";

interface NewReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewReportModal = ({ open, onOpenChange }: NewReportModalProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    periodo: "",
    formato: "pdf",
    descricao: "",
    entidade: "consolidado",
    cenario: "real",
    incluirComparacao: true,
    incluirGraficos: true,
    incluirDetalhamento: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { data, filters } = useData();

  const reportTypes = [
    { value: "dre-gerencial", label: "DRE Gerencial", icon: FileText, template: REPORT_TEMPLATES.find(t => t.id === 'dre-gerencial') },
    { value: "analise-custos", label: "Análise de Custos", icon: Building2, template: REPORT_TEMPLATES.find(t => t.id === 'analise-custos') },
    { value: "fluxo-caixa", label: "Fluxo de Caixa", icon: BarChart3, template: REPORT_TEMPLATES.find(t => t.id === 'fluxo-caixa') },
    { value: "dashboard-executivo", label: "Dashboard Executivo", icon: LineChart, template: REPORT_TEMPLATES.find(t => t.id === 'dashboard-executivo') },
    { value: "analise-margem", label: "Análise de Margem", icon: PieChart, template: REPORT_TEMPLATES.find(t => t.id === 'analise-margem') },
    { value: "comparativo-periodos", label: "Análise Comparativa", icon: TrendingUp, template: REPORT_TEMPLATES.find(t => t.id === 'comparativo-periodos') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.tipo || !formData.periodo) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Find the selected template
      const selectedTemplate = reportTypes.find(type => type.value === formData.tipo)?.template;
      
      if (!selectedTemplate) {
        throw new Error('Template não encontrado');
      }

      // Create report options
      const reportOptions = {
        incluirComparacao: formData.incluirComparacao,
        incluirGraficos: formData.incluirGraficos,
        incluirDetalhamento: formData.incluirDetalhamento,
        incluirAssinatura: true,
        incluirRodape: true,
        formato: formData.formato as 'pdf' | 'excel' | 'csv',
        orientacao: selectedTemplate.defaultOptions.orientacao
      };

      // Generate PDF using the new template system
      if (formData.formato === 'pdf') {
        const generator = new ReportGenerator(reportOptions);
        const doc = generator.generateFromTemplate(selectedTemplate, data, filters, reportOptions);
        
        const fileName = `${formData.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`;
        doc.save(fileName);
        
        console.log(`Generated professional report: ${fileName} using template: ${selectedTemplate.name}`);
      }

      const reportTitle = formData.nome;

      toast({
        title: "Relatório criado com sucesso!",
        description: `O relatório "${reportTitle}" foi gerado e está disponível para download.`,
      });

      setIsGenerating(false);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        nome: "",
        tipo: "",
        periodo: "",
        formato: "pdf",
        descricao: "",
        entidade: "consolidado",
        cenario: "real",
        incluirComparacao: true,
        incluirGraficos: true,
        incluirDetalhamento: false
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const selectedType = reportTypes.find(type => type.value === formData.tipo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Criar Novo Relatório
          </DialogTitle>
          <DialogDescription>
            Configure os parâmetros do relatório e gere automaticamente sua análise financeira.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Relatório *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: DRE Dezembro 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Relatório *</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (Opcional)</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Adicione uma descrição personalizada para este relatório..."
              className="resize-none"
              rows={3}
            />
          </div>

          {selectedType && selectedType.template && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <selectedType.icon className="h-4 w-4" />
                {selectedType.label}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedType.template.description}
              </p>
              
              {/* Template configuration preview */}
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Configurações do Template:</div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="incluirComparacao"
                      checked={formData.incluirComparacao}
                      onChange={(e) => setFormData(prev => ({ ...prev, incluirComparacao: e.target.checked }))}
                      className="rounded border border-input"
                    />
                    <Label htmlFor="incluirComparacao" className="text-xs">Incluir análise comparativa</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="incluirGraficos"
                      checked={formData.incluirGraficos}
                      onChange={(e) => setFormData(prev => ({ ...prev, incluirGraficos: e.target.checked }))}
                      className="rounded border border-input"
                    />
                    <Label htmlFor="incluirGraficos" className="text-xs">Incluir gráficos</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="incluirDetalhamento"
                      checked={formData.incluirDetalhamento}
                      onChange={(e) => setFormData(prev => ({ ...prev, incluirDetalhamento: e.target.checked }))}
                      className="rounded border border-input"
                    />
                    <Label htmlFor="incluirDetalhamento" className="text-xs">Incluir detalhamento</Label>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  Gerar Relatório
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};