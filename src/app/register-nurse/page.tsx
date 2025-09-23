"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Shield, Heart, CheckCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cpf: "",
    password: "",
    license_number: "",
    specialization: "",
    shift: "",
    department: "",
    years_experience: "",
    qualifications: null as File | null,
    general_register: null as File | null,
    residence_comprovant: null as File | null,
    license_document: null as File | null,
    face_image: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log(formData)
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      console.log(key, value)
      if (value) {
        formDataToSend.append(key, value);
      }
    });

    try {
      console.log("Dados a serem enviados:", formDataToSend);

      const registerUrl = `http://localhost:8081/api/v1/auth/nurse`;

      const response = await fetch(registerUrl, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success("Cadastro solicitado com sucesso!");
      } else {
        const errorData = await response.json();
        console.log("errorData: ", errorData);

        toast.error("Erro ao cadastrar", {
          description: errorData.message,
        });
      }
    } catch (error) {
      console.error("Erro de rede ou na requisição:", error);
      alert("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <section className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Junte-se à Nossa Equipe
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Cadastro de Enfermeiro</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
            Faça parte da maior plataforma de cuidados domiciliares do Brasil. Conecte-se com pacientes que precisam do
            seu cuidado profissional.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Flexibilidade Total</h3>
              <p className="text-sm text-muted-foreground">Escolha seus horários e locais de trabalho</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Segurança Garantida</h3>
              <p className="text-sm text-muted-foreground">Plataforma segura com verificação rigorosa</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Renda Extra</h3>
              <p className="text-sm text-muted-foreground">Aumente sua renda com trabalhos adicionais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Cadastro Completo</CardTitle>
                <CardDescription className="text-center">
                  Preencha todos os campos para completar seu cadastro como enfermeiro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Informações Pessoais</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          placeholder="Seu nome completo"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={(e) => handleInputChange("cpf", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço Completo *</Label>
                      <Input
                        id="address"
                        placeholder="Rua, número, bairro, cidade - UF"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          required
                          minLength={8}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="license_number">Número COREN *</Label>
                        <Input
                          id="license_number"
                          placeholder="Ex: COREN-SP 123456"
                          value={formData.license_number}
                          onChange={(e) => handleInputChange("license_number", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Informações Profissionais</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Especialização *</Label>
                        <Input
                          id="specialization"
                          placeholder="Ex: Pediatria, Geriatria, UTI..."
                          value={formData.specialization}
                          onChange={(e) => handleInputChange("specialization", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shift">Turno Preferencial *</Label>
                        <Select onValueChange={(value) => handleInputChange("shift", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o turno" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manha">Manhã</SelectItem>
                            <SelectItem value="tarde">Tarde</SelectItem>
                            <SelectItem value="noite">Noite</SelectItem>
                            <SelectItem value="integral">Integral</SelectItem>
                            <SelectItem value="plantao">Plantão 12x36</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento/Área de Atuação *</Label>
                      <Input
                        id="department"
                        placeholder="Ex: Departamento de Pediatria, Unidade de Terapia Intensiva..."
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="years_experience">Anos de Experiência *</Label>
                      <Select onValueChange={(value) => handleInputChange("years_experience", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua experiência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 a 3 anos</SelectItem>
                          <SelectItem value="3">3 a 5 anos</SelectItem>
                          <SelectItem value="5">5 a 10 anos</SelectItem>
                          <SelectItem value="10">Mais de 10 anos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Document Upload Section */}
                  <div className="space-y-4">
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Documentos Obrigatórios
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Todos os documentos devem estar em formato PDF, JPG ou PNG (máx. 5MB cada)
                      </p>
                    </div>

                    {/* Qualifications */}
                    <div className="space-y-2">
                      <Label htmlFor="qualifications">Certificados de Qualificação *</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="qualifications"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("qualifications", e.target.files?.[0] || null)}
                          className="hidden"
                          required
                        />
                        <label htmlFor="qualifications" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">
                            {formData.qualifications ? formData.qualifications.name : "Clique para enviar certificados"}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 5MB</p>
                        </label>
                      </div>
                    </div>

                    {/* General Register */}
                    <div className="space-y-2">
                      <Label htmlFor="general_register">Registro Geral (RG) *</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="general_register"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("general_register", e.target.files?.[0] || null)}
                          className="hidden"
                          required
                        />
                        <label htmlFor="general_register" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">
                            {formData.general_register ? formData.general_register.name : "Clique para enviar RG"}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 5MB</p>
                        </label>
                      </div>
                    </div>

                    {/* Residence Proof */}
                    <div className="space-y-2">
                      <Label htmlFor="residence_comprovant">Comprovante de Residência *</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="residence_comprovant"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("residence_comprovant", e.target.files?.[0] || null)}
                          className="hidden"
                          required
                        />
                        <label htmlFor="residence_comprovant" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">
                            {formData.residence_comprovant
                              ? formData.residence_comprovant.name
                              : "Clique para enviar comprovante"}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 5MB</p>
                        </label>
                      </div>
                    </div>

                    {/* License Document */}
                    <div className="space-y-2">
                      <Label htmlFor="license_document">Registro Profissional (COREN) *</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="license_document"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("license_document", e.target.files?.[0] || null)}
                          className="hidden"
                          required
                        />
                        <label htmlFor="license_document" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">
                            {formData.license_document ? formData.license_document.name : "Clique para enviar COREN"}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 5MB</p>
                        </label>
                      </div>
                    </div>

                    {/* Face image*/}
                    <div className="space-y-2">
                      <Label htmlFor="face_image">Foto de Perfil *</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                        <input
                          type="file"
                          id="face_image"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("face_image", e.target.files?.[0] || null)}
                          className="hidden"
                          required
                        />
                        <label htmlFor="face_image" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium">
                            {formData.face_image ? formData.face_image.name : "Clique para enviar foto de perfil"}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, JPG, PNG até 5MB</p>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col justify-center" >
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "#15803d",
                        color: "white",
                        padding: "0.75rem",
                        fontSize: "1rem",
                        fontWeight: "600",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                      disabled={isSubmitting}
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Ao se cadastrar, você concorda com nossos{" "}
                      <Link href="/termos" className="text-primary hover:underline">
                        Termos de Uso
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacidade" className="text-primary hover:underline">
                        Política de Privacidade
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Próximos Passos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  1
                </div>
                <h3 className="font-semibold">Análise de Documentos</h3>
                <p className="text-sm text-muted-foreground">Nossa equipe analisará seus documentos em até 48 horas</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  2
                </div>
                <h3 className="font-semibold">Verificação de Antecedentes</h3>
                <p className="text-sm text-muted-foreground">
                  Realizamos verificação completa para garantir a segurança
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                  3
                </div>
                <h3 className="font-semibold">Aprovação e Ativação</h3>
                <p className="text-sm text-muted-foreground">
                  Após aprovação, você poderá começar a receber solicitações
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
