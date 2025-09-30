"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api/v1"

interface Visit {
    id: string
    description: string
    reason: string
    visit_type: string
    created_at: string
    date: string
    status: "PENDING" | "CONFIRMED" | "COMPLETED"
    patient_name: string
    nurse_name: string
}

interface VisitsResponse {
    data: {
        pending: Visit[]
        confirmed: Visit[]
        completed: Visit[]
    }
    message: string
    success: boolean
}

export default function NurseVisitsPage() {
    const [visits, setVisits] = useState<VisitsResponse["data"]>({
        pending: [],
        confirmed: [],
        completed: [],
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [showCancelForm, setShowCancelForm] = useState(false)
    const [cancelReason, setCancelReason] = useState("")
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        fetchVisits()
    }, [])

    const fetchVisits = async () => {
        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/nurse/visits`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            console.log("Response:", response)


            if (!response.ok) {
                throw new Error("Erro ao carregar visitas")
            }

            const data: VisitsResponse = await response.json()
            setVisits(data.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido")
        } finally {
            setLoading(false)
        }
    }

    const handleVisitClick = (visit: Visit) => {
        setSelectedVisit(visit)
        setShowDialog(true)
        setShowCancelForm(false)
        setCancelReason("")
    }

    const handleConfirmVisit = async () => {
        if (!selectedVisit) return

        try {
            setActionLoading(true)
            const token = localStorage.getItem("token")

            const response = await fetch(`${API_BASE_URL}/nurse/visit/${selectedVisit.id}/confirm`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Erro ao confirmar visita")
            }

            // Refresh visits list
            await fetchVisits()
            setShowDialog(false)
            setSelectedVisit(null)
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao confirmar visita")
        } finally {
            setActionLoading(false)
        }
    }

    const handleCancelVisit = async () => {
        if (!selectedVisit || !cancelReason.trim()) {
            alert("Por favor, informe o motivo do cancelamento")
            return
        }

        try {
            setActionLoading(true)
            const token = localStorage.getItem("token")

            const response = await fetch(`${API_BASE_URL}/nurse/visit/${selectedVisit.id}/cancel`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reason: cancelReason }),
            })

            if (!response.ok) {
                throw new Error("Erro ao cancelar visita")
            }

            // Refresh visits list
            await fetchVisits()
            setShowDialog(false)
            setSelectedVisit(null)
            setCancelReason("")
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao cancelar visita")
        } finally {
            setActionLoading(false)
        }
    }

    const handleViewPatientProfile = () => {
        // Navigate to patient profile - you can implement this based on your routing
        alert("Navegar para perfil do paciente")
    }

    const getVisitTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            domiciliar: "Domiciliar",
            hospitalar: "Hospitalar",
            "": "Não especificado",
        }
        return types[type] || type
    }

    const calculateCancellationDeadline = (visitDate: string) => {
        // Assuming cancellation must be done 24 hours before the visit
        const visit = new Date(visitDate.split(" ").reverse().join(" "))
        const deadline = new Date(visit.getTime() - 24 * 60 * 60 * 1000)
        return deadline.toLocaleString("pt-BR")
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Carregando visitas...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="text-red-600">Erro ao carregar visitas</CardTitle>
                            <CardDescription>{error}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={fetchVisits}>Tentar novamente</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Minhas Visitas</h1>
                    <p className="text-gray-600">Gerencie suas visitas agendadas</p>
                </div>

                {/* Pending Visits */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                        <h2 className="text-2xl font-semibold text-gray-900">Pendentes</h2>
                        <Badge variant="secondary">{visits.pending.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {visits.pending.length === 0 ? (
                            <p className="text-gray-500 col-span-full">Nenhuma visita pendente</p>
                        ) : (
                            visits.pending.map((visit) => (
                                <Card
                                    key={visit.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow border-yellow-200 bg-yellow-50"
                                    onClick={() => handleVisitClick(visit)}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            {visit.patient_name}
                                        </CardTitle>
                                        <CardDescription>{visit.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>{visit.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{getVisitTypeLabel(visit.visit_type)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

                {/* Confirmed Visits */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h2 className="text-2xl font-semibold text-gray-900">Confirmadas</h2>
                        <Badge variant="secondary">{visits.confirmed.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {visits.confirmed.length === 0 ? (
                            <p className="text-gray-500 col-span-full">Nenhuma visita confirmada</p>
                        ) : (
                            visits.confirmed.map((visit) => (
                                <Card
                                    key={visit.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 bg-green-50"
                                    onClick={() => handleVisitClick(visit)}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            {visit.patient_name}
                                        </CardTitle>
                                        <CardDescription>{visit.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>{visit.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{getVisitTypeLabel(visit.visit_type)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

                {/* Completed Visits */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                        <h2 className="text-2xl font-semibold text-gray-900">Concluídas</h2>
                        <Badge variant="secondary">{visits.completed.length}</Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {visits.completed.length === 0 ? (
                            <p className="text-gray-500 col-span-full">Nenhuma visita concluída</p>
                        ) : (
                            visits.completed.map((visit) => (
                                <Card
                                    key={visit.id}
                                    className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200 bg-blue-50"
                                    onClick={() => handleVisitClick(visit)}
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            {visit.patient_name}
                                        </CardTitle>
                                        <CardDescription>{visit.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>{visit.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{getVisitTypeLabel(visit.visit_type)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </section>

                {/* Visit Details Dialog */}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent className="max-w-2xl">
                        {selectedVisit && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl">Detalhes da Visita</DialogTitle>
                                    <DialogDescription>
                                        Status: <Badge>{selectedVisit.status}</Badge>
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-600">Paciente</Label>
                                            <p className="text-lg">{selectedVisit.patient_name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-600">Data e Hora</Label>
                                            <p className="text-lg">{selectedVisit.date}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Tipo de Visita</Label>
                                        <p className="text-lg">{getVisitTypeLabel(selectedVisit.visit_type)}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Descrição</Label>
                                        <p className="text-lg">{selectedVisit.description}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Motivo</Label>
                                        <p className="text-lg">{selectedVisit.reason}</p>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-semibold text-gray-600">Criado em</Label>
                                        <p className="text-lg">{selectedVisit.created_at}</p>
                                    </div>

                                    {/* Cancellation deadline for confirmed visits */}
                                    {selectedVisit.status === "CONFIRMED" && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <Label className="text-sm font-semibold text-yellow-800">Prazo para Cancelamento</Label>
                                            <p className="text-sm text-yellow-700">
                                                Você pode cancelar esta visita até:{" "}
                                                <strong>{calculateCancellationDeadline(selectedVisit.date)}</strong>
                                            </p>
                                        </div>
                                    )}

                                    {/* Cancel form for confirmed visits */}
                                    {selectedVisit.status === "CONFIRMED" && showCancelForm && (
                                        <div className="space-y-2">
                                            <Label htmlFor="cancelReason">Motivo do Cancelamento</Label>
                                            <Textarea
                                                id="cancelReason"
                                                placeholder="Informe o motivo do cancelamento..."
                                                value={cancelReason}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                    )}
                                </div>

                                <DialogFooter className="flex gap-2">
                                    <Button variant="outline" onClick={handleViewPatientProfile}>
                                        <User className="w-4 h-4 mr-2" />
                                        Ver Perfil do Paciente
                                    </Button>

                                    {selectedVisit.status === "PENDING" && (
                                        <Button onClick={handleConfirmVisit} disabled={actionLoading}>
                                            {actionLoading ? (
                                                "Confirmando..."
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Confirmar Visita
                                                </>
                                            )}
                                        </Button>
                                    )}

                                    {selectedVisit.status === "CONFIRMED" && !showCancelForm && (
                                        <Button variant="destructive" onClick={() => setShowCancelForm(true)}>
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Cancelar Visita
                                        </Button>
                                    )}

                                    {selectedVisit.status === "CONFIRMED" && showCancelForm && (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setShowCancelForm(false)
                                                    setCancelReason("")
                                                }}
                                            >
                                                Voltar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleCancelVisit}
                                                disabled={actionLoading || !cancelReason.trim()}
                                            >
                                                {actionLoading ? "Cancelando..." : "Confirmar Cancelamento"}
                                            </Button>
                                        </>
                                    )}
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
