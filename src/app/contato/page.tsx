"use client"

import type React from "react"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useState } from "react"

export default function Contato() {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Aqui você implementaria o envio do formulário
        console.log("Formulário enviado:", formData)
        alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section
                style={{ background: "linear-gradient(to bottom right, #15803d, #16a34a)", color: "white", padding: "4rem 0" }}
            >
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <Badge
                            variant="secondary"
                            className="mb-6 text-sm font-medium"
                            style={{ backgroundColor: "white", color: "#15803d" }}
                        >
                            Estamos Aqui para Ajudar
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance" style={{ color: "white" }}>
                            Entre em Contato Conosco
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-pretty" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                            Tem dúvidas sobre nossos serviços? Precisa de ajuda? Nossa equipe está pronta para atendê-lo com todo o
                            cuidado e atenção que você merece.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6" style={{ color: "#1f2937" }}>
                                Envie sua Mensagem
                            </h2>
                            <p className="text-lg mb-8" style={{ color: "#6b7280" }}>
                                Preencha o formulário abaixo e nossa equipe entrará em contato com você o mais breve possível.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="nome">Nome Completo *</Label>
                                        <Input
                                            id="nome"
                                            type="text"
                                            value={formData.nome}
                                            onChange={(e) => handleChange("nome", e.target.value)}
                                            required
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="telefone">Telefone</Label>
                                        <Input
                                            id="telefone"
                                            type="tel"
                                            value={formData.telefone}
                                            onChange={(e) => handleChange("telefone", e.target.value)}
                                            className="mt-1"
                                            placeholder="(11) 99999-9999"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">E-mail *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="assunto">Assunto *</Label>
                                    <Select onValueChange={(value) => handleChange("assunto", value)} required>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Selecione o assunto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="informacoes">Informações sobre serviços</SelectItem>
                                            <SelectItem value="agendamento">Agendamento de consulta</SelectItem>
                                            <SelectItem value="suporte">Suporte técnico</SelectItem>
                                            <SelectItem value="parceria">Parceria/Trabalhe conosco</SelectItem>
                                            <SelectItem value="reclamacao">Reclamação</SelectItem>
                                            <SelectItem value="outros">Outros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="mensagem">Mensagem *</Label>
                                    <Textarea
                                        id="mensagem"
                                        value={formData.mensagem}
                                        onChange={(e) => handleChange("mensagem", e.target.value)}
                                        required
                                        className="mt-1 min-h-32"
                                        placeholder="Descreva sua dúvida ou solicitação..."
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full text-lg" style={{ backgroundColor: "#15803d" }}>
                                    Enviar Mensagem
                                </Button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6" style={{ color: "#1f2937" }}>
                                Informações de Contato
                            </h2>

                            <div className="space-y-6 mb-8">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: "#dcfce7" }}
                                            >
                                                <span className="text-xl">📞</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">Telefone</h3>
                                                <p style={{ color: "#6b7280" }}>
                                                    <strong>Central de Atendimento:</strong>
                                                    <br />
                                                    (11) 3000-0000
                                                    <br />
                                                    <strong>WhatsApp:</strong>
                                                    <br />
                                                    (11) 99999-9999
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: "#dcfce7" }}
                                            >
                                                <span className="text-xl">✉️</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">E-mail</h3>
                                                <p style={{ color: "#6b7280" }}>
                                                    <strong>Atendimento Geral:</strong>
                                                    <br />
                                                    contato@medassist.com.br
                                                    <br />
                                                    <strong>Suporte Técnico:</strong>
                                                    <br />
                                                    suporte@medassist.com.br
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: "#dcfce7" }}
                                            >
                                                <span className="text-xl">📍</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">Endereço</h3>
                                                <p style={{ color: "#6b7280" }}>
                                                    Av. Paulista, 1000 - Sala 1501
                                                    <br />
                                                    Bela Vista, São Paulo - SP
                                                    <br />
                                                    CEP: 01310-100
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: "#dcfce7" }}
                                            >
                                                <span className="text-xl">⏰</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">Horário de Atendimento</h3>
                                                <p style={{ color: "#6b7280" }}>
                                                    <strong>Segunda a Sexta:</strong> 8h às 18h
                                                    <br />
                                                    <strong>Sábados:</strong> 8h às 14h
                                                    <br />
                                                    <strong>Emergências:</strong> 24h por dia
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="rounded-2xl p-6" style={{ backgroundColor: "#f0fdf4" }}>
                                <h3 className="font-semibold text-lg mb-4" style={{ color: "#15803d" }}>
                                    Atendimento de Emergência
                                </h3>
                                <p className="text-sm mb-4" style={{ color: "#6b7280" }}>
                                    Para situações de emergência, nossa equipe está disponível 24 horas por dia, 7 dias por semana.
                                </p>
                                <Button size="sm" className="w-full" style={{ backgroundColor: "#15803d" }}>
                                    Ligar para Emergência
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20" style={{ backgroundColor: "#f0fdf4" }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: "#1f2937" }}>
                            Perguntas Frequentes
                        </h2>
                        <p className="text-xl max-w-2xl mx-auto text-pretty" style={{ color: "#6b7280" }}>
                            Encontre respostas para as dúvidas mais comuns sobre nossos serviços.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Como agendar uma consulta?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Você pode agendar através do nosso site, cadastrando-se como paciente e escolhendo o serviço desejado.
                                    Também pode ligar para nossa central de atendimento.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quais são os métodos de pagamento?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Aceitamos cartão de crédito, débito, PIX e boleto bancário. Para planos mensais, oferecemos desconto
                                    no pagamento à vista.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Os enfermeiros são qualificados?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Sim! Todos os nossos enfermeiros são registrados no COREN, possuem experiência comprovada e passam por
                                    rigoroso processo de seleção e verificação.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Atendem em toda São Paulo?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Atendemos em toda a Grande São Paulo. Para outras regiões, consulte nossa central de atendimento para
                                    verificar disponibilidade.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Posso cancelar um agendamento?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Sim, você pode cancelar com até 24 horas de antecedência sem custos. Cancelamentos com menos tempo
                                    podem ter taxa de cancelamento.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Como funciona o atendimento 24h?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Nosso atendimento 24h é para emergências e cuidados intensivos. Entre em contato através do telefone
                                    de emergência para avaliação da situação.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20" style={{ backgroundColor: "#15803d", color: "white" }}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance" style={{ color: "white" }}>
                        Ainda tem Dúvidas?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        Nossa equipe está pronta para esclarecer todas as suas dúvidas e ajudá-lo a encontrar o melhor cuidado.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register-patient">
                            <Button size="lg" className="text-lg px-8 py-3" style={{ backgroundColor: "white", color: "#15803d" }}>
                                Cadastrar-se Agora
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-3 bg-transparent"
                            style={{ borderColor: "rgba(255, 255, 255, 0.2)", color: "white", backgroundColor: "transparent" }}
                        >
                            Ligar Agora
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12" style={{ backgroundColor: "#f3f4f6" }}>
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">MedAssist</h3>
                            <p className="text-sm" style={{ color: "#6b7280" }}>
                                Conectando cuidado e confiança através de uma plataforma segura e profissional de serviços de
                                enfermagem.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Serviços</h4>
                            <ul className="space-y-2 text-sm" style={{ color: "#6b7280" }}>
                                <li>
                                    <a href="/servicos" className="hover:text-green-700 transition-colors">
                                        Cuidados Domiciliares
                                    </a>
                                </li>
                                <li>
                                    <a href="/servicos" className="hover:text-green-700 transition-colors">
                                        Cuidados Pós-Operatórios
                                    </a>
                                </li>
                                <li>
                                    <a href="/servicos" className="hover:text-green-700 transition-colors">
                                        Atendimento 24h
                                    </a>
                                </li>
                                <li>
                                    <a href="/servicos" className="hover:text-green-700 transition-colors">
                                        Cuidados Geriátricos
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-sm" style={{ color: "#6b7280" }}>
                                <li>
                                    <a href="/sobre" className="hover:text-green-700 transition-colors">
                                        Sobre Nós
                                    </a>
                                </li>
                                <li>
                                    <a href="/contato" className="hover:text-green-700 transition-colors">
                                        Contato
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-700 transition-colors">
                                        Carreiras
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-700 transition-colors">
                                        Blog
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Suporte</h4>
                            <ul className="space-y-2 text-sm" style={{ color: "#6b7280" }}>
                                <li>
                                    <a href="#" className="hover:text-green-700 transition-colors">
                                        Central de Ajuda
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-700 transition-colors">
                                        Política de Privacidade
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-700 transition-colors">
                                        Termos de Uso
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-700 transition-colors">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: "1px solid #d1d5db", color: "#6b7280" }}>
                        <p>&copy; 2025 MedAssist. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}
