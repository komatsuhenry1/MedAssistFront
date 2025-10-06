"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, MapPin, FileText, AlertCircle, CheckCircle, XCircle, DollarSign } from "lucide-react"
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.18.131:8081/api/v1"

interface Visit {
    id: number
    description: string
    reason: string
    visit_type: string
    created_at: string
    date: string
    status: string
    patient_name: string
    patient_id: string
    nurse_name: string
    visit_value: number
}

interface VisitsResponse {
    pending: Visit[]
    confirmed: Visit[]
    completed: Visit[]
}

export default function NurseVisitsPage() {
    const [visits, setVisits] = useState<VisitsResponse>({
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
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/nurse/visits`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Erro ao carregar visitas")
            }

            const result = await response.json()

            if (result.success && result.data) {
                const normalizedData = {
                    pending: result.data.pending.map((visit: Visit) => ({ ...visit, status: "pending" })),
                    confirmed: result.data.confirmed.map((visit: Visit) => ({ ...visit, status: "confirmed" })),
                    completed: result.data.completed.map((visit: Visit) => ({ ...visit, status: "completed" })),
                }
                setVisits(normalizedData)
                console.log("[v0] Visits loaded:", normalizedData)
            } else {
                throw new Error(result.message || "Erro ao carregar visitas")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido")
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmVisit = async () => {
        if (!selectedVisit) return

        try {
            setActionLoading(true)
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/nurse/visit/${selectedVisit.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ reason: cancelReason }),
            })

            console.log("response: ", response)

            if (!response.ok) {
                throw new Error("Erro ao confirmar visita")
            } else {
                toast.success("Visita confirmada com sucesso!")
            }

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
            toast.error("Por favor, informe o motivo do cancelamento")
            return
        }

        try {
            setActionLoading(true)
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/nurse/visit/${selectedVisit.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ reason: cancelReason }),
            })

            if (!response.ok) {
                throw new Error("Erro ao cancelar visita")
            } else {
                toast.success("Visita cancelada com sucesso!")
            }

            await fetchVisits()
            setShowDialog(false)
            setShowCancelForm(false)
            setSelectedVisit(null)
            setCancelReason("")
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao cancelar visita")
        } finally {
            setActionLoading(false)
        }
    }

    const openVisitDialog = (visit: Visit) => {
        console.log("[v0] Opening visit dialog for visit:", visit)
        console.log("[v0] Visit status:", visit.status)
        setSelectedVisit(visit)
        setShowDialog(true)
        setShowCancelForm(false)
        setCancelReason("")
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    const getVisitTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            domiciliar: "Domiciliar",
            hospitalar: "Hospitalar",
            consulta: "Consulta",
            emergencia: "Emergência",
        }
        return types[type] || type
    }
    
    const getCancellationDeadline = (visitDate: string) => {
        const visit = new Date(visitDate)
    
        // 💡 Alteração: Adicionar verificação para data inválida
        if (isNaN(visit.getTime())) {
            console.error("Data da visita inválida:", visitDate)
            return "Data de limite indisponível"
        }
    
        // 24 hours before em milissegundos
        const twentyFourHours = 24 * 60 * 60 * 1000 
        const deadline = new Date(visit.getTime() - twentyFourHours) 
        
        // 💡 Boa Prática: Verifica se o deadline também é válido
        if (isNaN(deadline.getTime())) {
            return "Erro ao calcular limite"
        }
    
        return formatDate(deadline.toISOString()) + " às " + formatTime(deadline.toISOString())
    }

    const VisitCard = ({ visit }: { visit: Visit }) => {
        const statusConfig = {
            pending: { icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
            confirmed: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
            completed: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
        }

        const config = statusConfig[visit.status as keyof typeof statusConfig] || statusConfig.pending
        const StatusIcon = config.icon

        return (
            <Card
                className={`cursor-pointer transition-all hover:shadow-md ${config.border} border-2`}
                onClick={() => openVisitDialog(visit)}
            >
                <CardHeader className={`${config.bg} pb-3`}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <StatusIcon className={`h-5 w-5 ${config.color}`} />
                                {visit.patient_name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                <Badge variant="outline" className="mt-1">
                                    {getVisitTypeLabel(visit.visit_type)}
                                </Badge>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(visit.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(visit.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold text-green-700">{formatCurrency(visit.visit_value)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4 mt-0.5" />
                            <span className="line-clamp-2">{visit.reason}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Carregando visitas...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-600 flex items-center gap-2">
                            <XCircle className="h-5 w-5" />
                            Erro ao Carregar Visitas
                        </CardTitle>
                        <CardDescription className="text-red-600">{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={fetchVisits} variant="outline">
                            Tentar Novamente
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <>
            <Header />
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Minhas Visitas</h1>
                    <p className="text-muted-foreground">Gerencie suas visitas agendadas</p>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="pending" className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Pendentes ({visits.pending.length})
                        </TabsTrigger>
                        <TabsTrigger value="confirmed" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Confirmadas ({visits.confirmed.length})
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Concluídas ({visits.completed.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-4">
                        {visits.pending.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Nenhuma visita pendente</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {visits.pending.map((visit) => (
                                    <VisitCard key={visit.id} visit={visit} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="confirmed" className="space-y-4">
                        {visits.confirmed.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Nenhuma visita confirmada</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {visits.confirmed.map((visit) => (
                                    <VisitCard key={visit.id} visit={visit} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="space-y-4">
                        {visits.completed.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Nenhuma visita concluída</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {visits.completed.map((visit) => (
                                    <VisitCard key={visit.id} visit={visit} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Detalhes da Visita</DialogTitle>
                            <DialogDescription>Informações completas sobre a visita agendada</DialogDescription>
                        </DialogHeader>

                        {selectedVisit && (
                            <div className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="flex items-start gap-3">
                                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Paciente</p>
                                            <p className="text-base font-semibold">{selectedVisit.patient_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Tipo de Visita</p>
                                            <p className="text-base">{getVisitTypeLabel(selectedVisit.visit_type)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Data e Hora</p>
                                            <p className="text-base">
                                                {formatDate(selectedVisit.date)} às {formatTime(selectedVisit.date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Valor da Visita</p>
                                            <p className="text-base font-semibold text-green-700">
                                                {formatCurrency(selectedVisit.visit_value)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-muted-foreground">Motivo</p>
                                            <p className="text-base">{selectedVisit.reason}</p>
                                        </div>
                                    </div>

                                    {selectedVisit.description && (
                                        <div className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                                                <p className="text-base">{selectedVisit.description}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedVisit.status === "confirmed" && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <p className="text-sm font-medium text-yellow-800 mb-1">Prazo para Cancelamento</p>
                                            <p className="text-sm text-yellow-700">Até {getCancellationDeadline(selectedVisit.date)}</p>
                                        </div>
                                    )}
                                </div>

                                {showCancelForm && (
                                    <div className="space-y-3 border-t pt-4">
                                        <Label htmlFor="cancelReason">Motivo do Cancelamento *</Label>
                                        <Select value={cancelReason} onValueChange={setCancelReason}>
                                            <SelectTrigger id="cancelReason">
                                                <SelectValue placeholder="Selecione o motivo do cancelamento" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Conflito de horário">Conflito de horário</SelectItem>
                                                <SelectItem value="Paciente indisponível">Paciente indisponível</SelectItem>
                                                <SelectItem value="Emergência pessoal">Emergência pessoal</SelectItem>
                                                <SelectItem value="Condições climáticas adversas">Condições climáticas adversas</SelectItem>
                                                <SelectItem value="Problemas de saúde do enfermeiro">
                                                    Problemas de saúde do enfermeiro
                                                </SelectItem>
                                                <SelectItem value="Outro motivo">Outro motivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (selectedVisit) {
                                        window.location.href = `/patient-profile/${selectedVisit.patient_id}`
                                    }
                                }}
                            >
                                Ver Perfil do Paciente
                            </Button>

                            {selectedVisit?.status === "pending" && (
                                <Button onClick={handleConfirmVisit} disabled={actionLoading}>
                                    {actionLoading ? "Confirmando..." : "Confirmar Visita"}
                                </Button>
                            )}

                            {selectedVisit?.status === "confirmed" && !showCancelForm && (
                                <Button variant="destructive" onClick={() => setShowCancelForm(true)}>
                                    Cancelar Visita
                                </Button>
                            )}

                            {selectedVisit?.status === "confirmed" && showCancelForm && (
                                <>
                                    <Button variant="outline" onClick={() => setShowCancelForm(false)}>
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
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}
