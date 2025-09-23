"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function Servicos() {
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
                            Cuidados Profissionais
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance" style={{ color: "white" }}>
                            Nossos Serviços de Enfermagem
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-pretty" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                            Oferecemos uma ampla gama de serviços de enfermagem domiciliar com profissionais qualificados, garantindo
                            cuidados de qualidade no conforto do seu lar.
                        </p>
                    </div>
                </div>
            </section>

            {/* Detailed Services Section */}
            <section className="py-20" style={{ backgroundColor: "#f0fdf4" }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: "#1f2937" }}>
                            Serviços Especializados
                        </h2>
                        <p className="text-xl max-w-3xl mx-auto text-pretty" style={{ color: "#6b7280" }}>
                            Cada serviço é prestado por enfermeiros registrados e experientes, seguindo os mais altos padrões de
                            qualidade e segurança em cuidados de saúde.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div
                                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                    style={{ backgroundColor: "#dcfce7" }}
                                >
                                    <span className="text-2xl">❤️</span>
                                </div>
                                <CardTitle>Cuidados Domiciliares</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base mb-4">
                                    Cuidados médicos completos no conforto do seu lar, incluindo administração de medicamentos,
                                    monitoramento de sinais vitais e acompanhamento de tratamentos.
                                </CardDescription>
                                <ul className="text-sm space-y-2" style={{ color: "#6b7280" }}>
                                    <li>• Administração de medicamentos</li>
                                    <li>• Monitoramento de sinais vitais</li>
                                    <li>• Curativos e cuidados com feridas</li>
                                    <li>• Acompanhamento de tratamentos</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div
                                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                    style={{ backgroundColor: "#dcfce7" }}
                                >
                                    <span className="text-2xl">🛡️</span>
                                </div>
                                <CardTitle>Cuidados Pós-Operatórios</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base mb-4">
                                    Acompanhamento especializado durante o período de recuperação, garantindo uma reabilitação segura e
                                    eficaz após procedimentos cirúrgicos.
                                </CardDescription>
                                <ul className="text-sm space-y-2" style={{ color: "#6b7280" }}>
                                    <li>• Cuidados com incisões cirúrgicas</li>
                                    <li>• Controle da dor pós-operatória</li>
                                    <li>• Fisioterapia respiratória</li>
                                    <li>• Orientações para recuperação</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div
                                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                    style={{ backgroundColor: "#dcfce7" }}
                                >
                                    <span className="text-2xl">⏰</span>
                                </div>
                                <CardTitle>Atendimento 24h</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base mb-4">
                                    Disponibilidade de enfermeiros qualificados 24 horas por dia, 7 dias por semana para emergências e
                                    cuidados contínuos.
                                </CardDescription>
                                <ul className="text-sm space-y-2" style={{ color: "#6b7280" }}>
                                    <li>• Plantões noturnos</li>
                                    <li>• Atendimento de emergência</li>
                                    <li>• Cuidados intensivos domiciliares</li>
                                    <li>• Suporte familiar 24h</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div
                                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                    style={{ backgroundColor: "#dcfce7" }}
                                >
                                    <span className="text-2xl">👥</span>
                                </div>
                                <CardTitle>Cuidados Geriátricos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base mb-4">
                                    Cuidados especializados para idosos, focando no bem-estar, independência e qualidade de vida dos
                                    pacientes da terceira idade.
                                </CardDescription>
                                <ul className="text-sm space-y-2" style={{ color: "#6b7280" }}>
                                    <li>• Cuidados com mobilidade</li>
                                    <li>• Prevenção de quedas</li>
                                    <li>• Estimulação cognitiva</li>
                                    <li>• Cuidados com higiene pessoal</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div
                                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                    style={{ backgroundColor: "#dcfce7" }}
                                >
                                    <span className="text-2xl">✅</span>
                                </div>
                                <CardTitle>Consultas Especializadas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base mb-4">
                                    Avaliações de saúde, orientações médicas e acompanhamento de tratamentos com enfermeiros
                                    especializados em diferentes áreas.
                                </CardDescription>
                                <ul className="text-sm space-y-2" style={{ color: "#6b7280" }}>
                                    <li>• Avaliação de saúde geral</li>
                                    <li>• Orientações nutricionais</li>
                                    <li>• Educação em saúde</li>
                                    <li>• Acompanhamento de doenças crônicas</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div
                                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
                                    style={{ backgroundColor: "#dcfce7" }}
                                >
                                    <span className="text-2xl">💚</span>
                                </div>
                                <CardTitle>Cuidados Paliativos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base mb-4">
                                    Suporte compassivo e cuidados especializados para pacientes em situações delicadas, priorizando
                                    conforto, dignidade e qualidade de vida.
                                </CardDescription>
                                <ul className="text-sm space-y-2" style={{ color: "#6b7280" }}>
                                    <li>• Controle de sintomas</li>
                                    <li>• Suporte emocional</li>
                                    <li>• Cuidados de conforto</li>
                                    <li>• Apoio à família</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: "#1f2937" }}>
                            Como Funciona
                        </h2>
                        <p className="text-xl max-w-2xl mx-auto text-pretty" style={{ color: "#6b7280" }}>
                            Um processo simples e seguro para conectar você aos melhores profissionais de enfermagem.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div
                                className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
                                style={{ backgroundColor: "#15803d", color: "white" }}
                            >
                                <span className="text-2xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Cadastre-se</h3>
                            <p style={{ color: "#6b7280" }}>
                                Crie sua conta e preencha suas informações de saúde e necessidades específicas de cuidado.
                            </p>
                        </div>

                        <div className="text-center">
                            <div
                                className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
                                style={{ backgroundColor: "#15803d", color: "white" }}
                            >
                                <span className="text-2xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Escolha o Serviço</h3>
                            <p style={{ color: "#6b7280" }}>
                                Selecione o tipo de cuidado necessário e agende o horário que melhor se adequa à sua rotina.
                            </p>
                        </div>

                        <div className="text-center">
                            <div
                                className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6"
                                style={{ backgroundColor: "#15803d", color: "white" }}
                            >
                                <span className="text-2xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Receba o Cuidado</h3>
                            <p style={{ color: "#6b7280" }}>
                                Um enfermeiro qualificado chegará ao seu local no horário agendado para prestar o cuidado necessário.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20" style={{ backgroundColor: "#f0fdf4" }}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance" style={{ color: "#1f2937" }}>
                            Planos e Preços
                        </h2>
                        <p className="text-xl max-w-2xl mx-auto text-pretty" style={{ color: "#6b7280" }}>
                            Escolha o plano que melhor atende às suas necessidades de cuidado.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-2xl mb-2">Consulta Única</CardTitle>
                                <div className="text-4xl font-bold mb-2" style={{ color: "#15803d" }}>
                                    R$ 150
                                </div>
                                <CardDescription>Por consulta</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm mb-6" style={{ color: "#6b7280" }}>
                                    <li>✅ Consulta domiciliar</li>
                                    <li>✅ Avaliação de saúde</li>
                                    <li>✅ Orientações básicas</li>
                                    <li>✅ Relatório de atendimento</li>
                                </ul>
                                <Link href="/register-patient">
                                    <Button className="w-full" style={{ backgroundColor: "#15803d" }}>
                                        Agendar Consulta
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow border-2" style={{ borderColor: "#15803d" }}>
                            <CardHeader>
                                <Badge className="mb-4" style={{ backgroundColor: "#15803d", color: "white" }}>
                                    Mais Popular
                                </Badge>
                                <CardTitle className="text-2xl mb-2">Plano Mensal</CardTitle>
                                <div className="text-4xl font-bold mb-2" style={{ color: "#15803d" }}>
                                    R$ 500
                                </div>
                                <CardDescription>Por mês</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm mb-6" style={{ color: "#6b7280" }}>
                                    <li>✅ 4 consultas mensais</li>
                                    <li>✅ Atendimento prioritário</li>
                                    <li>✅ Suporte 24h</li>
                                    <li>✅ Relatórios detalhados</li>
                                    <li>✅ Desconto de 15%</li>
                                </ul>
                                <Link href="/register-patient">
                                    <Button className="w-full" style={{ backgroundColor: "#15803d" }}>
                                        Assinar Plano
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-2xl mb-2">Cuidado Intensivo</CardTitle>
                                <div className="text-4xl font-bold mb-2" style={{ color: "#15803d" }}>
                                    R$ 1200
                                </div>
                                <CardDescription>Por mês</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm mb-6" style={{ color: "#6b7280" }}>
                                    <li>✅ Cuidados diários</li>
                                    <li>✅ Enfermeiro dedicado</li>
                                    <li>✅ Atendimento 24h</li>
                                    <li>✅ Equipamentos inclusos</li>
                                    <li>✅ Suporte familiar</li>
                                </ul>
                                <Link href="/register-patient">
                                    <Button className="w-full" style={{ backgroundColor: "#15803d" }}>
                                        Contratar Serviço
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20" style={{ backgroundColor: "#15803d", color: "white" }}>
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance" style={{ color: "white" }}>
                        Pronto para Receber Cuidados Profissionais?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                        Cadastre-se agora e conecte-se com enfermeiros qualificados na sua região. Sua saúde é nossa prioridade.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register-patient">
                            <Button size="lg" className="text-lg px-8 py-3" style={{ backgroundColor: "white", color: "#15803d" }}>
                                Cadastrar como Paciente
                            </Button>
                        </Link>
                        <Link href="/contato">
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-lg px-8 py-3 bg-transparent"
                                style={{ borderColor: "rgba(255, 255, 255, 0.2)", color: "white", backgroundColor: "transparent" }}
                            >
                                Falar Conosco
                            </Button>
                        </Link>
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
                                    <a href="#" className="hover:text-green-700 transition-colors">
                                        Cuidados Domiciliares
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-700 transition-colors">
                                        Cuidados Pós-Operatórios
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-700 transition-colors">
                                        Atendimento 24h
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-700 transition-colors">
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
