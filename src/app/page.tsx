"use client"

import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, Shield, Clock, Users, Star, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              Conectando Cuidado e Confiança
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Conectamos Você ao Cuidado que Precisa</h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 text-pretty">
              Plataforma profissional que conecta enfermeiros qualificados a pacientes, oferecendo cuidados de saúde
              personalizados e confiáveis no conforto do seu lar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  <Heart className="mr-2 h-5 w-5" />
                  Encontrar um Enfermeiro
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  Sou Enfermeiro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Nossos Serviços</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Oferecemos uma gama completa de serviços de enfermagem domiciliar com profissionais qualificados e
              experientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Cuidados Domiciliares</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Enfermeiros especializados para cuidados médicos no conforto do seu lar, incluindo administração de
                  medicamentos e monitoramento de sinais vitais.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Cuidados Pós-Operatórios</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Acompanhamento especializado durante o período de recuperação, garantindo uma reabilitação segura e
                  eficaz.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Atendimento 24h</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Disponibilidade de enfermeiros qualificados 24 horas por dia, 7 dias por semana para emergências e
                  cuidados contínuos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Cuidados Geriátricos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Cuidados especializados para idosos, focando no bem-estar, independência e qualidade de vida dos
                  pacientes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Consultas Especializadas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Avaliações de saúde, orientações médicas e acompanhamento de tratamentos com enfermeiros
                  especializados.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Cuidados Paliativos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Suporte compassivo e cuidados especializados para pacientes em situações delicadas, priorizando
                  conforto e dignidade.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Por que Escolher o MedAssist?</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Profissionais Qualificados</h3>
                    <p className="text-muted-foreground">
                      Todos os nossos enfermeiros são registrados, experientes e passam por rigoroso processo de seleção
                      e verificação de antecedentes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Segurança e Confiança</h3>
                    <p className="text-muted-foreground">
                      Plataforma segura com protocolos rigorosos de segurança, garantindo a proteção dos dados e
                      bem-estar dos pacientes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Disponibilidade Flexível</h3>
                    <p className="text-muted-foreground">
                      Agendamento flexível que se adapta às suas necessidades, com opções de cuidados pontuais ou
                      contínuos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-2xl p-8">
              <div className="text-center">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Enfermeiros Cadastrados</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">2000+</div>
                    <div className="text-sm text-muted-foreground">Pacientes Atendidos</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">4.9</div>
                    <div className="text-sm text-muted-foreground">Avaliação Média</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Suporte Disponível</div>
                  </div>
                </div>

                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "Excelente serviço! Os enfermeiros são muito profissionais e atenciosos. Recomendo para qualquer
                  pessoa que precise de cuidados domiciliares."
                </p>
                <p className="text-sm font-medium mt-2">- Maria Silva, São Paulo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Pronto para Receber o Melhor Cuidado?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
            Cadastre-se agora e conecte-se com enfermeiros qualificados na sua região. Seu bem-estar é nossa prioridade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Cadastrar como Paciente
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Cadastrar como Enfermeiro
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">MedAssist</h3>
              <p className="text-muted-foreground text-sm">
                Conectando cuidado e confiança através de uma plataforma segura e profissional de serviços de
                enfermagem.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cuidados Domiciliares
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cuidados Pós-Operatórios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Atendimento 24h
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Cuidados Geriátricos
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="/sobre" className="hover:text-primary transition-colors">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="/contato" className="hover:text-primary transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Carreiras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MedAssist. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
