"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import { toast } from "sonner" // ⬅️ ALTERADO: Importação do Sonner

// ⬇️ REMOVIDO: import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  patients_attended: number
  appointments_today: number
  average_rating: number
  monthly_earnings: number
}

interface Visit {
  id: string
  description: string
  reason: string
  visit_type: string
  visit_value: number
  created_at: string
  date: string
  status: "PENDING" | "CONFIRMED" | "COMPLETED"
  patient_name: string
  patient_id: string
  nurse_name: string
}

interface Profile {
  name: string
  email: string
  phone: string
  coren: string
  experience_years: number
  department: string
  bio: string
}

interface Availability {
  is_available: boolean
  start_time: string
  end_time: string
  specialization: string
}

interface DashboardData {
  online: boolean
  stats: DashboardStats
  visits: Visit[]
  profile: Profile
  availability: Availability
}

interface ApiResponse {
  data: DashboardData
  message: string
  success: boolean
}

export default function NurseDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [availability, setAvailability] = useState(true)
  const [isOnline, setIsOnline] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const [availabilityForm, setAvailabilityForm] = useState({
    start_time: "",
    end_time: "",
    specialization: "",
  })
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    license_number: "",
    years_experience: 0,
    department: "",
    bio: "",
  })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // ⬇️ REMOVIDO: const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL


        const response = await fetch(`${API_BASE_URL}/nurse/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          const apiResponse: ApiResponse = await response.json()
          const data = apiResponse.data
          setDashboardData(data)
          setIsOnline(data.online)
          setAvailability(data.availability.is_available)

          setAvailabilityForm({
            start_time: data.availability.start_time,
            end_time: data.availability.end_time,
            specialization: data.availability.specialization,
          })

          setProfileForm({
            name: data.profile.name,
            email: data.profile.email,
            phone: data.profile.phone,
            license_number: data.profile.coren,
            years_experience: data.profile.experience_years,
            department: data.profile.department,
            bio: data.profile.bio,
          })
        } else {
          console.error("Failed to fetch dashboard data")
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const toggleOnlineStatus = async () => {
    setIsToggling(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

      const response = await fetch(`${API_BASE_URL}/nurse/online`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setIsOnline(!isOnline)
        // ⬅️ ALTERADO: Chamada do toast com Sonner
        toast.success(`Status alterado para ${!isOnline ? "ONLINE" : "OFFLINE"}`, {
          description: !isOnline ? "Você está disponível para novos atendimentos." : "Você está indisponível para novos atendimentos.",
        })
      } else {
        console.error("Failed to toggle online status")
        // ⬅️ ALTERADO: Chamada do toast com Sonner
        toast.error("Falha ao alternar status online.", {
          description: "Tente novamente ou verifique sua conexão.",
        })
      }
    } catch (error) {
      console.error("Error toggling online status:", error)
      // ⬅️ ALTERADO: Chamada do toast com Sonner
      toast.error("Erro ao alternar status online.", {
        description: "Um erro inesperado ocorreu.",
      })
    } finally {
      setIsToggling(false)
    }
  }

  const getScheduleVisits = () => {
    if (!dashboardData) return []
    return dashboardData.visits.filter((visit) => visit.status === "PENDING" || visit.status === "CONFIRMED")
  }

  const getCompletedVisits = () => {
    if (!dashboardData) return []
    return dashboardData.visits.filter((visit) => visit.status === "COMPLETED")
  }

  const getUniquePatients = () => {
    if (!dashboardData) return []
    const patientMap = new Map()
    dashboardData.visits.forEach((visit) => {
      if (!patientMap.has(visit.patient_id)) {
        patientMap.set(visit.patient_id, {
          id: visit.patient_id,
          name: visit.patient_name,
          last_visit: visit.date,
        })
      }
    })
    return Array.from(patientMap.values())
  }

  const formatVisitType = (type: string) => {
    const types: { [key: string]: string } = {
      clinica: "Consulta Clínica",
      domiciliar: "Consulta Domiciliar",
    }
    return types[type] || type
  }

  const formatStatus = (status: string) => {
    const statuses: { [key: string]: string } = {
      PENDING: "Pendente",
      CONFIRMED: "Confirmado",
      COMPLETED: "Concluído",
    }
    return statuses[status] || status
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          <Loader2 className="animate-spin" size={48} style={{ color: "#15803d" }} />
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 80px)",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "1.25rem", color: "#6b7280" }}>Erro ao carregar dados do dashboard</p>
          <Button onClick={() => window.location.reload()} style={{ backgroundColor: "#15803d", color: "white" }}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  const handleUpdateAvailability = async () => {
    setIsUpdatingAvailability(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

      const response = await fetch(`${API_BASE_URL}/nurse/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: availabilityForm.start_time,
          end_time: availabilityForm.end_time,
          specialization: availabilityForm.specialization,
        }),
      })

      if (response.ok) {
        // ⬅️ ALTERADO: Chamada do toast com Sonner
        toast.success("Sucesso!", {
          description: "Disponibilidade atualizada com sucesso.",
        })

        // Update local state
        if (dashboardData) {
          setDashboardData({
            ...dashboardData,
            availability: {
              ...dashboardData.availability,
              start_time: availabilityForm.start_time,
              end_time: availabilityForm.end_time,
              specialization: availabilityForm.specialization,
            },
          })
        }
      } else {
        // ⬅️ ALTERADO: Chamada do toast com Sonner
        toast.error("Erro", {
          description: "Falha ao atualizar disponibilidade.",
          // Observação: Sonner não usa 'variant', mas você pode estilizar com classes se necessário
        })
      }
    } catch (error) {
      console.error("Error updating availability:", error)
      // ⬅️ ALTERADO: Chamada do toast com Sonner
      toast.error("Erro", {
        description: "Erro ao atualizar disponibilidade.",
      })
    } finally {
      setIsUpdatingAvailability(false)
    }
  }

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true)
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

      const response = await fetch(`${API_BASE_URL}/nurse/update`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          license_number: profileForm.license_number,
          years_experience: profileForm.years_experience,
          department: profileForm.department,
          bio: profileForm.bio,
        }),
      })

      if (response.ok) {
        // ⬅️ ALTERADO: Chamada do toast com Sonner
        toast.success("Sucesso!", {
          description: "Perfil atualizado com sucesso.",
        })

        // Update local state
        if (dashboardData) {
          setDashboardData({
            ...dashboardData,
            profile: {
              ...dashboardData.profile,
              name: profileForm.name,
              email: profileForm.email,
              phone: profileForm.phone,
              coren: profileForm.license_number,
              experience_years: profileForm.years_experience,
              department: profileForm.department,
              bio: profileForm.bio,
            },
          })
        }
      } else {
        // ⬅️ ALTERADO: Chamada do toast com Sonner
        toast.error("Erro", {
          description: "Falha ao atualizar perfil.",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      // ⬅️ ALTERADO: Chamada do toast com Sonner
      toast.error("Erro", {
        description: "Erro ao atualizar perfil.",
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

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

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
            <button
              onClick={toggleOnlineStatus}
              disabled={isToggling}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem 2rem",
                fontSize: "1.125rem",
                fontWeight: "600",
                borderRadius: "9999px",
                border: "3px solid",
                borderColor: isOnline ? "#10b981" : "#6b7280",
                backgroundColor: isOnline ? "#10b981" : "#374151",
                color: "white",
                cursor: isToggling ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: isOnline
                  ? "0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3)"
                  : "0 4px 6px rgba(0, 0, 0, 0.1)",
                transform: isToggling ? "scale(0.95)" : "scale(1)",
                opacity: isToggling ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isToggling) {
                  e.currentTarget.style.transform = "scale(1.05)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isToggling) {
                  e.currentTarget.style.transform = "scale(1)"
                }
              }}
            >
              {isToggling ? (
                <Loader2 className="animate-spin" size={24} />
              ) : isOnline ? (
                <Wifi size={24} />
              ) : (
                <WifiOff size={24} />
              )}
              <span>{isToggling ? "Alterando..." : isOnline ? "ONLINE - Disponível" : "OFFLINE - Indisponível"}</span>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: isOnline ? "#ffffff" : "#9ca3af",
                  animation: isOnline ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
                }}
              />
            </button>
          </div>

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
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
                  {dashboardData.stats.patients_attended}
                </div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)" }}>Pacientes Atendidos</div>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "none" }}>
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
                  {dashboardData.stats.appointments_today}
                </div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)" }}>Consultas Hoje</div>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "none" }}>
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
                  {dashboardData.stats.average_rating.toFixed(1)}
                </div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)" }}>Avaliação Média</div>
              </CardContent>
            </Card>

            <Card style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", border: "none" }}>
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>
                  R$ {dashboardData.stats.monthly_earnings.toFixed(2)}
                </div>
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

          {/* Schedule Tab - Shows PENDING and CONFIRMED visits */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agenda de Hoje</CardTitle>
                <CardDescription>Seus próximos atendimentos agendados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getScheduleVisits().length === 0 ? (
                    <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
                      Nenhuma visita agendada no momento
                    </p>
                  ) : (
                    getScheduleVisits().map((visit) => (
                      <div
                        key={visit.id}
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
                          <div style={{ fontWeight: "bold" }}>{visit.date}</div>
                          <div style={{ color: "#6b7280" }}>{visit.patient_name}</div>
                          <div style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                            {formatVisitType(visit.visit_type)} • R$ {visit.visit_value.toFixed(2)}
                          </div>
                        </div>
                        <Badge variant={visit.status === "CONFIRMED" ? "default" : "secondary"}>
                          {formatStatus(visit.status)}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab - Shows unique patients from all visits */}
          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meus Pacientes</CardTitle>
                <CardDescription>Lista de pacientes sob seus cuidados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getUniquePatients().length === 0 ? (
                    <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>Nenhum paciente cadastrado</p>
                  ) : (
                    getUniquePatients().map((patient) => (
                      <div
                        key={patient.id}
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
                          <div style={{ color: "#6b7280" }}>ID: {patient.id}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.875rem", color: "#9ca3af" }}>Última visita:</div>
                          <div style={{ fontSize: "0.875rem", fontWeight: "medium" }}>{patient.last_visit}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab - Shows COMPLETED visits */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atendimentos</CardTitle>
                <CardDescription>Seus atendimentos realizados recentemente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getCompletedVisits().length === 0 ? (
                    <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
                      Nenhum atendimento concluído
                    </p>
                  ) : (
                    getCompletedVisits().map((visit) => (
                      <div
                        key={visit.id}
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
                          <div style={{ fontWeight: "bold" }}>{visit.patient_name}</div>
                          <div style={{ color: "#6b7280" }}>{formatVisitType(visit.visit_type)}</div>
                          <div style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                            {visit.date} • Criado em: {visit.created_at}
                          </div>
                        </div>
                        <div style={{ fontWeight: "bold", color: "#15803d" }}>R$ {visit.visit_value.toFixed(2)}</div>
                      </div>
                    ))
                  )}
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
                    <Input
                      id="start-time"
                      type="time"
                      value={availabilityForm.start_time}
                      onChange={(e) => setAvailabilityForm({ ...availabilityForm, start_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">Horário de Término</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={availabilityForm.end_time}
                      onChange={(e) => setAvailabilityForm({ ...availabilityForm, end_time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialization">Especialização</Label>
                  <Select
                    value={availabilityForm.specialization}
                    onValueChange={(value) => setAvailabilityForm({ ...availabilityForm, specialization: value })}
                  >
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

                <Button
                  onClick={handleUpdateAvailability}
                  disabled={isUpdatingAvailability}
                  style={{ backgroundColor: "#15803d", color: "white" }}
                >
                  {isUpdatingAvailability ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Configurações"
                  )}
                </Button>
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
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coren">COREN</Label>
                    <Input
                      id="coren"
                      value={profileForm.license_number}
                      onChange={(e) => setProfileForm({ ...profileForm, license_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Anos de Experiência</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={profileForm.years_experience}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, years_experience: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      value={profileForm.department}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    />
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
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleUpdateProfile}
                  disabled={isUpdatingProfile}
                  style={{ backgroundColor: "#15803d", color: "white" }}
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    "Atualizar Perfil"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}