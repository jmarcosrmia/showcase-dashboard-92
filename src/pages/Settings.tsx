import React, { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataSourceManager } from "@/components/settings/DataSourceManager";
import { DataProcessingCenter } from "@/components/settings/DataProcessingCenter";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Globe,
  Mail,
  Phone,
  Building,
  Calendar,
  CreditCard,
  Download,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reports: true,
    alerts: true
  });

  const [profile, setProfile] = useState({
    name: "João Silva",
    email: "admin@empresa.com",
    phone: "+55 11 99999-9999",
    department: "Financeiro",
    role: "Administrador"
  });

  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  return (
    <AppLayout>
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Configurações</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Gerencie suas preferências e configurações do sistema</p>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2 text-xs sm:text-sm">
                <User className="h-4 w-4" />
                <span>Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2 text-xs sm:text-sm">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificações</span>
                <span className="sm:hidden">Notif.</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 text-xs sm:text-sm">
                <Shield className="h-4 w-4" />
                <span>Segurança</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>Atualize suas informações de perfil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                    <Button className="w-full" onClick={handleSaveProfile}>Salvar Alterações</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informações Profissionais</CardTitle>
                    <CardDescription>Detalhes da sua posição na empresa</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Select value={profile.department}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Financeiro">Financeiro</SelectItem>
                          <SelectItem value="Contabilidade">Contabilidade</SelectItem>
                          <SelectItem value="Controladoria">Controladoria</SelectItem>
                          <SelectItem value="Diretoria">Diretoria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo</Label>
                      <Select value={profile.role}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Administrador">Administrador</SelectItem>
                          <SelectItem value="Analista">Analista</SelectItem>
                          <SelectItem value="Gerente">Gerente</SelectItem>
                          <SelectItem value="Diretor">Diretor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-4">
                      <Badge variant="secondary" className="flex items-center gap-2 w-fit">
                        <Building className="h-3 w-3" />
                        Empresa ABC Ltda
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>Configure como você deseja receber notificações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">Receba atualizações por e-mail</p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">Notificações no navegador</p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="report-notifications">Relatórios Automáticos</Label>
                      <p className="text-sm text-muted-foreground">Receber relatórios periódicos</p>
                    </div>
                    <Switch 
                      id="report-notifications"
                      checked={notifications.reports}
                      onCheckedChange={(checked) => setNotifications({...notifications, reports: checked})}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="alert-notifications">Alertas de Sistema</Label>
                      <p className="text-sm text-muted-foreground">Notificações críticas e alertas</p>
                    </div>
                    <Switch 
                      id="alert-notifications"
                      checked={notifications.alerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, alerts: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>Mantenha sua conta segura</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="w-full">Alterar Senha</Button>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
    </AppLayout>
  );
};

export default Settings;