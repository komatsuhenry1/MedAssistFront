"use client"

import type React from "react"
// MUDANÇA: Adicionados useRef e useEffect para a lógica da câmera
import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
// MUDANÇA: Adicionado o ícone de Câmera
import { Upload, FileText, Shield, Heart, CheckCircle, Camera } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
// MUDANÇA: Adicionados os componentes para o Modal (Dialog)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// MUDANÇA: NOVO COMPONENTE REUTILIZÁVEL
// Componente para lidar com a entrada de documentos, oferecendo upload ou captura de foto.
// Isso evita a repetição de código e torna o formulário principal mais limpo.
const DocumentInput = ({
  field,
  label,
  file,
  onFileChange,
  onOpenCamera,
}: {
  field: string
  label: string
  file: File | null
  onFileChange: (field: string, file: File | null) => void
  onOpenCamera: (field: string) => void
}) => (
  <div className="space-y-2">
    <Label htmlFor={field}>{label}</Label>
    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
      <div className="flex justify-center items-center gap-4">
        {/* Botão para Upload de Arquivo */}
        <input
          type="file"
          id={field}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onFileChange(field, e.target.files?.[0] || null)}
          className="hidden"
          required={!file} // O campo só é obrigatório se não houver um arquivo (seja por upload ou foto)
        />
        <label
          htmlFor={field}
          className="cursor-pointer flex flex-col items-center gap-2 p-2 rounded-md hover:bg-muted"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">Enviar Arquivo</span>
        </label>
        {/* Botão para Tirar Foto */}
        <button
          type="button"
          onClick={() => onOpenCamera(field)}
          className="cursor-pointer flex flex-col items-center gap-2 p-2 rounded-md hover:bg-muted"
        >
          <Camera className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">Tirar Foto</span>
        </button>
      </div>
      {file && <p className="text-sm font-medium mt-4 text-green-600">Arquivo selecionado: {file.name}</p>}
      <p className="text-xs text-muted-foreground mt-2">PDF, JPG, PNG até 5MB</p>
    </div>
  </div>
)

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
    profile_image: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // MUDANÇA: Estados e Refs para controlar a câmera
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [capturingField, setCapturingField] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // MUDANÇA: Função para iniciar a câmera do dispositivo
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err)
      toast.error("Não foi possível acessar a câmera.", {
        description: "Por favor, verifique as permissões da câmera no seu navegador.",
      })
      setIsCameraOpen(false)
    }
  }

  // MUDANÇA: Função para parar a câmera e liberar o recurso
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  // MUDANÇA: Hook para gerenciar o ciclo de vida da câmera (liga/desliga com o modal)
  useEffect(() => {
    if (isCameraOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    // Função de limpeza para garantir que a câmera pare se o componente for desmontado
    return () => {
      stopCamera()
    }
  }, [isCameraOpen])

  // MUDANÇA: Função para abrir o modal da câmera e definir qual campo está sendo preenchido
  const handleOpenCamera = (field: string) => {
    setCapturingField(field)
    setIsCameraOpen(true)
  }

  // MUDANÇA: Função para capturar a imagem do vídeo, converter para File e salvar no estado
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && capturingField) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext("2d")
      if (context) {
        // Espelha a imagem horizontalmente no canvas para corresponder à visualização do vídeo
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          if (blob) {
            const fileName = `${capturingField}_${Date.now()}.jpg`
            const file = new File([blob], fileName, { type: "image/jpeg" })
            handleFileChange(capturingField, file)
            setIsCameraOpen(false)
          }
        }, "image/jpeg")
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value)
      }
    })

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
      const registerUrl = `${API_BASE_URL}/auth/nurse`
      const response = await fetch(registerUrl, {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success("Cadastro solicitado com sucesso!")
      } else {
        const errorData = await response.json()
        toast.error("Erro ao cadastrar", {
          description: errorData.message,
        })
      }
    } catch (error) {
      console.error("Erro de rede ou na requisição:", error)
      alert("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
                  {/* Informações Pessoais (Sem alterações) */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Informações Pessoais</h3>
                    {/* ... campos de nome, email, telefone, etc. ... */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input id="name" placeholder="Seu nome completo" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input id="phone" placeholder="(11) 99999-9999" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input id="cpf" placeholder="000.000.000-00" value={formData.cpf} onChange={(e) => handleInputChange("cpf", e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço Completo *</Label>
                      <Input id="address" placeholder="Rua, número, bairro, cidade - UF" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha *</Label>
                        <Input id="password" type="password" placeholder="Mínimo 8 caracteres" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required minLength={8} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license_number">Número COREN *</Label>
                        <Input id="license_number" placeholder="Ex: COREN-SP 123456" value={formData.license_number} onChange={(e) => handleInputChange("license_number", e.target.value)} required />
                      </div>
                    </div>
                  </div>

                  {/* Informações Profissionais (Sem alterações) */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Informações Profissionais</h3>
                    {/* ... campos de especialização, turno, etc. ... */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Especialização *</Label>
                        <Input id="specialization" placeholder="Ex: Pediatria, Geriatria, UTI..." value={formData.specialization} onChange={(e) => handleInputChange("specialization", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shift">Turno Preferencial *</Label>
                        <Select onValueChange={(value) => handleInputChange("shift", value)} required>
                          <SelectTrigger><SelectValue placeholder="Selecione o turno" /></SelectTrigger>
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
                      <Input id="department" placeholder="Ex: Departamento de Pediatria, Unidade de Terapia Intensiva..." value={formData.department} onChange={(e) => handleInputChange("department", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="years_experience">Anos de Experiência *</Label>
                      <Select onValueChange={(value) => handleInputChange("years_experience", value)} required>
                        <SelectTrigger><SelectValue placeholder="Selecione sua experiência" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 a 3 anos</SelectItem>
                          <SelectItem value="3">3 a 5 anos</SelectItem>
                          <SelectItem value="5">5 a 10 anos</SelectItem>
                          <SelectItem value="10">Mais de 10 anos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* MUDANÇA: Seção de Documentos refatorada para usar o componente DocumentInput */}
                  <div className="space-y-4">
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Documentos Obrigatórios
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Envie um arquivo ou tire uma foto de cada documento.
                      </p>
                    </div>

                    <DocumentInput label="Certificados de Qualificação *" field="qualifications" file={formData.qualifications} onFileChange={handleFileChange} onOpenCamera={handleOpenCamera} />
                    <DocumentInput label="Registro Geral (RG) *" field="general_register" file={formData.general_register} onFileChange={handleFileChange} onOpenCamera={handleOpenCamera} />
                    <DocumentInput label="Comprovante de Residência *" field="residence_comprovant" file={formData.residence_comprovant} onFileChange={handleFileChange} onOpenCamera={handleOpenCamera} />
                    <DocumentInput label="Registro Profissional (COREN) *" field="license_document" file={formData.license_document} onFileChange={handleFileChange} onOpenCamera={handleOpenCamera} />
                    <DocumentInput label="Foto de Perfil *" field="profile_image" file={formData.profile_image} onFileChange={handleFileChange} onOpenCamera={handleOpenCamera} />
                  </div>

                  <div className="pt-6 flex flex-col justify-center">
                    <Button type="submit" style={{ backgroundColor: "#15803d", color: "white", padding: "0.75rem", fontSize: "1rem", fontWeight: "600", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, }} disabled={isSubmitting}>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      {isSubmitting ? "Cadastrando..." : "Finalizar Cadastro"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Ao se cadastrar, você concorda com nossos{" "}
                      <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link>{" "} e {" "}
                      <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção Próximos Passos (Sem alterações) */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Próximos Passos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">1</div>
                <h3 className="font-semibold">Análise de Documentos</h3>
                <p className="text-sm text-muted-foreground">Nossa equipe analisará seus documentos em até 48 horas</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">2</div>
                <h3 className="font-semibold">Verificação de Antecedentes</h3>
                <p className="text-sm text-muted-foreground">Realizamos verificação completa para garantir a segurança</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">3</div>
                <h3 className="font-semibold">Aprovação e Ativação</h3>
                <p className="text-sm text-muted-foreground">Após aprovação, você poderá começar a receber solicitações</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MUDANÇA: Modal da Câmera */}
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Tirar Foto do Documento</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-md" style={{ transform: "scaleX(-1)" }} />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCameraOpen(false)}>Cancelar</Button>
            <Button onClick={handleCapture} className="bg-primary hover:bg-primary/90">
              <Camera className="mr-2 h-4 w-4" /> Capturar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}