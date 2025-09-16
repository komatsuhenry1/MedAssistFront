"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, User, Mail, Phone, MapPin, CreditCard, Lock } from "lucide-react"
import { toast } from "sonner"


interface RegisterRequestDTO {
  email: string
  phone: string
  address: string
  name: string
  cpf: string
  password: string
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterRequestDTO>({
    email: "",
    phone: "",
    address: "",
    name: "",
    cpf: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof RegisterRequestDTO, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "")

    // Aplica a máscara XXX.XXX.XXX-XX
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    }
    return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")

    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
    }
    return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value)
    handleInputChange("cpf", formatted)
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value)
    handleInputChange("phone", formatted)
  }

  const validateForm = () => {
    const { name, email, phone, address, cpf, password } = formData

    if (!name.trim()) {
      toast.error("Erro de validação", { description: "Nome é obrigatório" })
      return false
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Erro de validação", { description: "Email válido é obrigatório" })
      return false
    }

    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      toast.error("Erro de validação", { description: "Telefone válido é obrigatório" })
      return false
    }
    
    if (!address.trim()) {
        toast.error("Erro de validação", { description: "Endereço é obrigatório" })
        return false
    }

    if (!cpf.trim() || cpf.replace(/\D/g, "").length !== 11) {
      toast.error("Erro de validação", { description: "CPF válido é obrigatório" })
      return false
    }

    if (!password.trim() || password.length < 6) {
      toast.error("Erro de validação", { description: "Senha deve ter pelo menos 6 caracteres" })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Aqui você faria a chamada para sua API
      console.log("Dados do formulário:", formData)

      // Simula uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Cadastro realizado!", {
        description: "Sua conta foi criada com sucesso.",
      })

      // Reset do formulário
      setFormData({
        email: "",
        phone: "",
        address: "",
        name: "",
        cpf: "",
        password: "",
      })
    } catch (error) {
      toast.error("Erro no cadastro", {
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Cadastro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nome Completo
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              required
            />
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <Label htmlFor="cpf" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              CPF
            </Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => handleCPFChange(e.target.value)}
              required
            />
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Rua, número, bairro, cidade"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
