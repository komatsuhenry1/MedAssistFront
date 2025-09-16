"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function NurseDashboard() {
  const [availability, setAvailability] = useState(true)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <Header />

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #15803d 0%, #166534 100%)",
          color: "white",
          padding: "4rem 1rem 2rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Dashboard do Enfermeiro</h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.9, marginBottom: "2rem" }}>
            Gerencie seus atendimentos e acompanhe sua carreira profissional
          </p>

          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "none" }}>
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>24</div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)" }}>Pacientes Atendidos</div>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "none" }}>
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>8</div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)" }}>Consultas Hoje</div>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "none" }}>
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>4.8</div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)" }}>Avaliação Média</div>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "none" }}>
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>R$ 2.450</div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)" }}>Ganhos do Mês</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section style={{ padding: "3rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agenda de Hoje</CardTitle>
                <CardDescription>Seus próximos atendimentos agendados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "09:00", patient: "Maria Silva", type: "Consulta Domiciliar", status: "confirmado" },
                    { time: "11:30", patient: "João Santos", type: "Aplicação de Medicamento", status: "pendente" },
                    { time: "14:00", patient: "Ana Costa", type: "Curativo", status: "confirmado" },
                    { time: "16:30", patient: "Pedro Lima", type: "Consulta Domiciliar", status: "confirmado" },
                  ].map((appointment, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "bold" }}>{appointment.time}</div>
                        <div style={{ color: "#6b7280" }}>{appointment.patient}</div>
                        <div style={{ fontSize: "0.875rem", color: "#9ca3af" }}>{appointment.type}</div>
                      </div>
                      <Badge variant={appointment.status === "confirmado" ? "default" : "secondary"}>
                        {appointment.status === "confirmado" ? "Confirmado" : "Pendente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meus Pacientes</CardTitle>
                <CardDescription>Lista de pacientes sob seus cuidados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Maria Silva", age: 65, condition: "Diabetes", lastVisit: "Hoje" },
                    { name: "João Santos", age: 45, condition: "Hipertensão", lastVisit: "Ontem" },
                    { name: "Ana Costa", age: 78, condition: "Pós-cirúrgico", lastVisit: "2 dias atrás" },
                    { name: "Pedro Lima", age: 52, condition: "Fisioterapia", lastVisit: "3 dias atrás" },
                  ].map((patient, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "bold" }}>{patient.name}</div>
                        <div style={{ color: "#6b7280" }}>
                          {patient.age} anos • {patient.condition}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.875rem", color: "#9ca3af" }}>Última visita:</div>
                        <div style={{ fontSize: "0.875rem", fontWeight: "medium" }}>{patient.lastVisit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atendimentos</CardTitle>
                <CardDescription>Seus atendimentos realizados recentemente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: "15/01/2024",
                      patient: "Carlos Oliveira",
                      service: "Consulta Domiciliar",
                      duration: "45 min",
                      payment: "R$ 120",
                    },
                    {
                      date: "14/01/2024",
                      patient: "Lucia Ferreira",
                      service: "Aplicação de Medicamento",
                      duration: "30 min",
                      payment: "R$ 80",
                    },
                    {
                      date: "13/01/2024",
                      patient: "Roberto Silva",
                      service: "Curativo",
                      duration: "25 min",
                      payment: "R$ 60",
                    },
                    {
                      date: "12/01/2024",
                      patient: "Helena Costa",
                      service: "Consulta Domiciliar",
                      duration: "50 min",
                      payment: "R$ 130",
                    },
                  ].map((record, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "bold" }}>{record.patient}</div>
                        <div style={{ color: "#6b7280" }}>{record.service}</div>
                        <div style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                          {record.date} • {record.duration}
                        </div>
                      </div>
                      <div style={{ fontWeight: "bold", color: "#15803d" }}>{record.payment}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurar Disponibilidade</CardTitle>
                <CardDescription>Defina seus horários de trabalho e disponibilidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <Label htmlFor="availability-toggle" style={{ fontSize: "1rem", fontWeight: "medium" }}>
                      Disponível para novos atendimentos
                    </Label>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                      Ative para receber solicitações de novos pacientes
                    </p>
                  </div>
                  <Switch id="availability-toggle" checked={availability} onCheckedChange={setAvailability} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-time">Horário de Início</Label>
                    <Input id="start-time" type="time" defaultValue="08:00" />
                  </div>
                  <div>
                    <Label htmlFor="end-time">Horário de Término</Label>
                    <Input id="end-time" type="time" defaultValue="18:00" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialization">Especialização</Label>
                  <Select defaultValue="pediatria">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua especialização" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pediatria">Pediatria</SelectItem>
                      <SelectItem value="geriatria">Geriatria</SelectItem>
                      <SelectItem value="cardiologia">Cardiologia</SelectItem>
                      <SelectItem value="oncologia">Oncologia</SelectItem>
                      <SelectItem value="geral">Enfermagem Geral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button style={{ backgroundColor: "#15803d", color: "white" }}>Salvar Configurações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>Gerencie suas informações pessoais e profissionais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" defaultValue="Ana Paula Silva" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="ana.silva@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" defaultValue="(11) 99999-9999" />
                  </div>
                  <div>
                    <Label htmlFor="coren">COREN</Label>
                    <Input id="coren" defaultValue="123456-SP" />
                  </div>
                  <div>
                    <Label htmlFor="experience">Anos de Experiência</Label>
                    <Input id="experience" type="number" defaultValue="5" />
                  </div>
                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Input id="department" defaultValue="Pediatria" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografia Profissional</Label>
                  <textarea
                    id="bio"
                    style={{
                      width: "100%",
                      minHeight: "100px",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                    }}
                    placeholder="Conte um pouco sobre sua experiência e especialidades..."
                    defaultValue="Enfermeira especializada em pediatria com 5 anos de experiência em atendimento domiciliar. Focada em cuidados especializados para crianças e adolescentes."
                  />
                </div>

                <Button style={{ backgroundColor: "#15803d", color: "white" }}>Atualizar Perfil</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
