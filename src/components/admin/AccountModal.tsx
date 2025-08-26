import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Account {
  id?: number;
  code: string;
  description: string;
  dreCategory: string;
  status: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: Account;
  onSave: (account: Account) => void;
}

export const AccountModal = ({ isOpen, onClose, account, onSave }: AccountModalProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Account>({
    code: account?.code || "",
    description: account?.description || "",
    dreCategory: account?.dreCategory || "",
    status: account?.status || "Ativo"
  });

  const dreCategories = [
    "Receita Bruta",
    "Deduções da Receita",
    "CMV",
    "Despesas Operacionais",
    "Despesas Comerciais",
    "Despesas Administrativas",
    "Resultado Financeiro",
    "Outras Receitas/Despesas"
  ];

  const handleSave = () => {
    if (!formData.code || !formData.description || !formData.dreCategory) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Sucesso",
      description: account ? "Conta atualizada com sucesso." : "Conta criada com sucesso."
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      code: "",
      description: "",
      dreCategory: "",
      status: "Ativo"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {account ? "Editar Conta" : "Nova Conta"}
          </DialogTitle>
          <DialogDescription>
            {account ? "Altere os dados da conta contábil." : "Adicione uma nova conta contábil ao sistema."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="code">Código da Conta *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="Ex: 1.01.001"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Receita de Vendas"
            />
          </div>
          
          <div>
            <Label htmlFor="dreCategory">Linha da DRE *</Label>
            <Select value={formData.dreCategory} onValueChange={(value) => setFormData({ ...formData, dreCategory: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a linha da DRE" />
              </SelectTrigger>
              <SelectContent>
                {dreCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === "Ativo"}
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "Ativo" : "Inativo" })}
            />
            <Label htmlFor="status">Conta ativa</Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {account ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};