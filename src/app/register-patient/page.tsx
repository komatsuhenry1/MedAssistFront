"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function PatientRegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cpf: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const registerUrl = `${API_BASE_URL}/auth/user`;

      const res = await fetch(registerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      console.log("Resposta da API:", data)


      if (data.success) {
        toast.success("Cadastro realizado com sucesso! Realize o login no sistema!")
      } else {
        toast.error("Erro ao realizar cadastro.")
      }
    } catch (error) {
      console.error("Erro no cadastro:", error)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section style={{ background: "#15803d", color: "white", padding: "4rem 0" }}>
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            Bem-vindo ao Vita
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
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Rua, número, bairro, cidade - UF"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                    />
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
