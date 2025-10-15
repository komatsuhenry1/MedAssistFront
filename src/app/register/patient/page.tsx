"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, XCircle, Upload } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

const heroStyle = {
  backgroundImage: `
    linear-gradient(rgba(21, 128, 61, 0.7), rgba(83, 83, 83, 0.8)),
    url('/sobre_imagem.png')
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "white",
  padding: "5rem 0",
}

// Funções de validação e formatação (sem alterações)
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateCPF = (cpf: string) => {
  const cleanCPF = cpf.replace(/\D/g, "")
  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let checkDigit = 11 - (sum % 11)
  if (checkDigit >= 10) checkDigit = 0
  if (checkDigit !== Number.parseInt(cleanCPF.charAt(9))) return false
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  checkDigit = 11 - (sum % 11)
  if (checkDigit >= 10) checkDigit = 0
  if (checkDigit !== Number.parseInt(cleanCPF.charAt(10))) return false
  return true
}

const validatePassword = (password: string) => {
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return {
    isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
  }
}

const formatPhone = (value: string) => {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
  }
  return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
}

const formatCPF = (value: string) => {
  const cleaned = value.replace(/\D/g, "")
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4")
}

export default function PatientRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cpf: "",
    password: "",
  })

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    cpf: "",
    password: "",
    phone: "",
  })

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value
    if (field === "phone") {
      formattedValue = formatPhone(value)
    } else if (field === "cpf") {
      formattedValue = formatCPF(value)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

    if (field === "email" && value) {
      setValidationErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Email inválido",
      }))
    } else if (field === "cpf" && value.replace(/\D/g, "").length === 11) {
      setValidationErrors((prev) => ({
        ...prev,
        cpf: validateCPF(value) ? "" : "CPF inválido",
      }))
    } else if (field === "phone" && value) {
      const cleaned = value.replace(/\D/g, "")
      setValidationErrors((prev) => ({
        ...prev,
        phone: cleaned.length >= 10 ? "" : "Telefone incompleto",
      }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 👇 INÍCIO DAS MUDANÇAS AQUI 👇
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailValid = validateEmail(formData.email)
    const cpfValid = validateCPF(formData.cpf)
    const passwordValidation = validatePassword(formData.password)

    if (!emailValid || !cpfValid || !passwordValidation.isValid) {
      setValidationErrors({
        email: emailValid ? "" : "Email inválido",
        cpf: cpfValid ? "" : "CPF inválido",
        password: passwordValidation.isValid ? "" : "Senha não atende aos requisitos",
        phone: formData.phone.replace(/\D/g, "").length >= 10 ? "" : "Telefone incompleto",
      })
      return
    }

    setIsLoading(true)
    setSubmitError(null)

    // MUDANÇA 1: Usar FormData para enviar arquivos e texto juntos.
    const dataToSend = new FormData()

    // MUDANÇA 2: Adicionar todos os campos de texto ao FormData,
    // garantindo que os valores "limpos" (sem formatação) sejam enviados.
    dataToSend.append("name", formData.name)
    dataToSend.append("email", formData.email)
    dataToSend.append("phone", formData.phone.replace(/\D/g, ""))
    dataToSend.append("address", formData.address)
    dataToSend.append("cpf", formData.cpf.replace(/\D/g, ""))
    dataToSend.append("password", formData.password)

    // MUDANÇA 3: Adicionar o arquivo de imagem, se existir.
    if (profileImage) {
      dataToSend.append("image_profile", profileImage)
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

      const response = await fetch(`${apiBaseUrl}/auth/user`, {
        method: "POST",
        // MUDANÇA 4: Remover o header 'Content-Type'. O navegador o definirá
        // automaticamente para 'multipart/form-data' com o boundary correto.
        // headers: { "Content-Type": "application/json" },

        // MUDANÇA 5: Usar o objeto FormData como corpo da requisição.
        body: dataToSend,
      })

      const data = await response.json()
      console.log("=======")
      console.log(data)
      console.log("=======")

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta. Tente novamente.")
      }

      toast.success("Conta criada com sucesso! Você será redirecionado para o login.")
      window.location.href = "/login"
    } catch (error) {
      console.error("Registration error:", error)
      setSubmitError(error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }
  // 👆 FIM DAS MUDANÇAS AQUI 👆

  const passwordValidation = validatePassword(formData.password)

  return (
    <>
      <Header />

      {/* O restante do seu componente JSX permanece exatamente o mesmo */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Criando sua conta...</h3>
            <p className="text-sm text-gray-600">Por favor, aguarde. Isso pode levar alguns instantes.</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={heroStyle}>
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Bem-vindo ao MedAssist
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Cadastro de Paciente</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto text-pretty">
            Cadastre-se para ter acesso aos melhores profissionais de enfermagem. Cuidado profissional e personalizado
            na sua casa.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold mb-2">Cuidado Domiciliar</h3>
              <p className="text-sm text-gray-600">Receba cuidados profissionais no conforto da sua casa</p>
            </div>
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <span className="text-2xl">👩‍⚕️</span>
              </div>
              <h3 className="font-semibold mb-2">Profissionais Qualificados</h3>
              <p className="text-sm text-gray-600">Enfermeiros certificados e com experiência comprovada</p>
            </div>
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: "#dcfce7" }}
              >
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="font-semibold mb-2">Disponibilidade 24h</h3>
              <p className="text-sm text-gray-600">Atendimento disponível todos os dias da semana</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
                <CardDescription className="text-center">
                  Preencha seus dados para se cadastrar como paciente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {submitError}
                    </div>
                  )}

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
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={
                          validationErrors.email
                            ? "border-red-500"
                            : formData.email && !validationErrors.email
                              ? "border-green-500"
                              : ""
                        }
                        required
                      />
                      {formData.email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationErrors.email ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {validationErrors.email && <p className="text-xs text-red-500">{validationErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className={
                          validationErrors.phone
                            ? "border-red-500"
                            : formData.phone.replace(/\D/g, "").length >= 10
                              ? "border-green-500"
                              : ""
                        }
                        maxLength={15}
                        required
                      />
                      {formData.phone && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationErrors.phone ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : formData.phone.replace(/\D/g, "").length >= 10 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {validationErrors.phone && <p className="text-xs text-red-500">{validationErrors.phone}</p>}
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

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <div className="relative">
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => handleInputChange("cpf", e.target.value)}
                        className={
                          validationErrors.cpf
                            ? "border-red-500"
                            : formData.cpf.replace(/\D/g, "").length === 11 && !validationErrors.cpf
                              ? "border-green-500"
                              : ""
                        }
                        maxLength={14}
                        required
                      />
                      {formData.cpf.replace(/\D/g, "").length === 11 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationErrors.cpf ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {validationErrors.cpf && <p className="text-xs text-red-500">{validationErrors.cpf}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={
                        formData.password && !passwordValidation.isValid
                          ? "border-red-500"
                          : formData.password && passwordValidation.isValid
                            ? "border-green-500"
                            : ""
                      }
                      required
                      minLength={8}
                    />
                    {formData.password && (
                      <div className="text-xs space-y-1 mt-2">
                        <div
                          className={`flex items-center gap-2 ${passwordValidation.hasMinLength ? "text-green-600" : "text-gray-500"}`}
                        >
                          {passwordValidation.hasMinLength ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          Mínimo 8 caracteres
                        </div>
                        <div
                          className={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-500"}`}
                        >
                          {passwordValidation.hasUpperCase ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          Uma letra maiúscula
                        </div>
                        <div
                          className={`flex items-center gap-2 ${passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-500"}`}
                        >
                          {passwordValidation.hasLowerCase ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          Uma letra minúscula
                        </div>
                        <div
                          className={`flex items-center gap-2 ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-500"}`}
                        >
                          {passwordValidation.hasNumber ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          Um número
                        </div>
                        <div
                          className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-gray-500"}`}
                        >
                          {passwordValidation.hasSpecialChar ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          Um caractere especial
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Foto de Perfil (Opcional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="profileImage" className="cursor-pointer">
                        {imagePreview ? (
                          <div className="space-y-3">
                            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary">
                              <Image
                                src={imagePreview || "/placeholder.svg"}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <p className="text-sm font-medium text-green-600">Imagem carregada com sucesso!</p>
                            <Button type="button" variant="outline" size="sm" className="mt-2 bg-transparent">
                              <Upload className="h-4 w-4 mr-2" />
                              Alterar foto
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm font-medium">Clique para enviar ou tirar foto</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG até 5MB</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      style={{ backgroundColor: "#15803d" }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Ao se cadastrar, você concorda com nossos{" "}
                      <Link href="/termos" className="text-green-700 hover:underline">
                        Termos de Uso
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacidade" className="text-green-700 hover:underline">
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

      {/* How it Works Section */}
      <section className="py-16" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Como Funciona</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div
                  className="w-10 h-10 text-white rounded-full flex items-center justify-center mx-auto font-bold"
                  style={{ backgroundColor: "#15803d" }}
                >
                  1
                </div>
                <h3 className="font-semibold">Cadastre-se</h3>
                <p className="text-sm text-gray-600">Complete seu cadastro com suas informações pessoais</p>
              </div>
              <div className="space-y-3">
                <div
                  className="w-10 h-10 text-white rounded-full flex items-center justify-center mx-auto font-bold"
                  style={{ backgroundColor: "#15803d" }}
                >
                  2
                </div>
                <h3 className="font-semibold">Solicite Atendimento</h3>
                <p className="text-sm text-gray-600">Descreva suas necessidades e escolha o profissional ideal</p>
              </div>
              <div className="space-y-3">
                <div
                  className="w-10 h-10 text-white rounded-full flex items-center justify-center mx-auto font-bold"
                  style={{ backgroundColor: "#15803d" }}
                >
                  3
                </div>
                <h3 className="font-semibold">Receba o Cuidado</h3>
                <p className="text-sm text-gray-600">Profissional qualificado vai até você no horário agendado</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}