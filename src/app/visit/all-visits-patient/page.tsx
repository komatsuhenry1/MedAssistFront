"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Visit {
    id: string
    description: string
    reason: string
    visit_type: string
    date: string
    status: string
    nurse: {
        id: string
        name: string
        specialization: string
        image: string
    }
    created_at: string
}

interface VisitsResponse {
    data: Visit[]
    message: string
    success: boolean
}

export default function VisitsPage() {
    const router = useRouter()
    const [visits, setVisits] = useState<Visit[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem("token")

                if (!token) {
                    router.push("/login")
                    return
                }

                const response = await fetch("http://localhost:8081/api/v1/user/visits", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error("Erro ao carregar visitas")
                }

                const result: VisitsResponse = await response.json()

                if (result.success && result.data) {
                    setVisits(result.data)
                } else {
                    throw new Error(result.message || "Erro ao carregar visitas")
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido")
            } finally {
                setLoading(false)
            }
        }

        fetchVisits()
    }, [router])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "agendada":
            case "scheduled":
                return "#15803d"
            case "concluída":
            case "completed":
                return "#0891b2"
            case "cancelada":
            case "cancelled":
                return "#dc2626"
            default:
                return "#6b7280"
        }
    }

    const getVisitTypeLabel = (type: string) => {
        switch (type) {
            case "domiciliar":
                return "Domiciliar"
            case "hospitalar":
                return "Hospitalar"
            case "clinica":
                return "Clínica"
            default:
                return type
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
                <Header />
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                        <div style={{ color: "#15803d", fontSize: "1.125rem" }}>Carregando suas visitas...</div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
                <Header />
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
                    <h1 style={{ color: "#dc2626", marginBottom: "1rem" }}>{error}</h1>
                    <Button onClick={() => router.back()} style={{ marginTop: "1rem" }}>
                        Voltar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
            <Header />

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", marginBottom: "0.5rem" }}>
                        Minhas Visitas
                    </h1>
                    <p style={{ color: "#6b7280" }}>Acompanhe todas as suas consultas agendadas</p>
                </div>

                {visits.length === 0 ? (
                    <Card>
                        <CardContent style={{ padding: "3rem", textAlign: "center" }}>
                            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem" }}>
                                Nenhuma visita agendada
                            </h2>
                            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
                                Você ainda não tem visitas agendadas. Encontre um enfermeiro e agende sua primeira consulta!
                            </p>
                            <Button onClick={() => router.push("/")} style={{ backgroundColor: "#15803d", color: "white" }}>
                                Buscar Enfermeiros
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div style={{ display: "grid", gap: "1.5rem" }}>
                        {visits.map((visit) => (
                            <Card key={visit.id} style={{ overflow: "hidden" }}>
                                <CardContent style={{ padding: "1.5rem" }}>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "auto 1fr auto",
                                            gap: "1.5rem",
                                            alignItems: "start",
                                        }}
                                    >
                                        {/* Nurse Image */}
                                        <div>
                                            <img
                                                src={
                                                    visit.nurse?.image
                                                        ? `http://localhost:8081/api/v1/user/file/${visit.nurse.image}`
                                                        : "/nurse-profile.jpg"
                                                }
                                                alt={visit.nurse?.name || "Enfermeiro"}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>

                                        {/* Visit Details */}
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                                                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1f2937" }}>
                                                    {visit.nurse?.name || "Enfermeiro não especificado"}
                                                </h3>
                                                <Badge style={{ backgroundColor: getStatusColor(visit.status) }}>
                                                    {visit.status || "Agendada"}
                                                </Badge>
                                            </div>

                                            <p style={{ color: "#15803d", fontWeight: "500", marginBottom: "0.75rem" }}>
                                                {visit.nurse?.specialization || "Enfermagem"}
                                            </p>

                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(2, 1fr)",
                                                    gap: "0.75rem",
                                                    marginBottom: "0.75rem",
                                                }}
                                            >
                                                <div>
                                                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>📅 Data:</span>
                                                    <span style={{ marginLeft: "0.5rem", fontWeight: "500" }}>{formatDate(visit.date)}</span>
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>🏥 Tipo:</span>
                                                    <span style={{ marginLeft: "0.5rem", fontWeight: "500" }}>
                                                        {getVisitTypeLabel(visit.visit_type)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: "0.5rem" }}>
                                                <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "600" }}>Motivo: </span>
                                                <span style={{ color: "#4b5563" }}>{visit.reason}</span>
                                            </div>

                                            {visit.description && (
                                                <div>
                                                    <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "600" }}>Descrição: </span>
                                                    <span style={{ color: "#4b5563" }}>{visit.description}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            <Button
                                                variant="outline"
                                                onClick={() => router.push(`/nurse/${visit.nurse?.id}`)}
                                                style={{ borderColor: "#15803d", color: "#15803d" }}
                                            >
                                                Ver Perfil
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
