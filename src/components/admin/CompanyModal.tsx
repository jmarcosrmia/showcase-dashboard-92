import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id?: number;
  name: string;
  cnpj: string;
  branch: string;
  active: boolean;
  consolidated: boolean;
}

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company;
  onSave: (company: Company) => void;
}

export const CompanyModal = ({ isOpen, onClose, company, onSave }: CompanyModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Company>({
    name: company?.name || "",
    cnpj: company?.cnpj || "",
    branch: company?.branch || "",
    active: company?.active ?? true,
    consolidated: company?.consolidated ?? true
  });

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '');
    return numbers.length === 14;
  };

  const handleSave = () => {
    if (!formData.name || !formData.cnpj || !formData.branch) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive"
      });
      return;
    }

    if (!validateCNPJ(formData.cnpj)) {
      toast({
        title: "Erro",
        description: "CNPJ deve ter 14 dígitos.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Sucesso",
      description: company ? "Empresa atualizada com sucesso." : "Empresa criada com sucesso."
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      cnpj: "",
      branch: "",
      active: true,
      consolidated: true
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {company ? "Editar Empresa" : "Nova Empresa"}
          </DialogTitle>
          <DialogDescription>
            {company ? "Altere os dados da empresa." : "Adicione uma nova empresa ao sistema."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Empresa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Prime Flow LTDA"
            />
          </div>
          
          <div>
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </div>
          
          <div>
            <Label htmlFor="branch">Filial/Centro de Custo *</Label>
            <Input
              id="branch"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              placeholder="Ex: Matriz, Filial São Paulo"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
            <Label htmlFor="active">Empresa ativa</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="consolidated"
              checked={formData.consolidated}
              onCheckedChange={(checked) => setFormData({ ...formData, consolidated: checked })}
            />
            <Label htmlFor="consolidated">Participar do consolidado</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {company ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};