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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, FileText, CheckCircle, XCircle } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.18.131:8081/api/v1"

interface Nurse {
    id: string
    name: string
    specialization: string
    image: string
}

interface Visit {
    id: string
    description: string
    reason: string
    visit_type: string
    created_at: string
    date: string
    status: string
    nurse: Nurse
}

interface VisitsResponse {
    data: Visit[]
    message: string
    success: boolean
}

export default function PatientVisitsPage() {
    const [visits, setVisits] = useState<Visit[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
    const [showDialog, setShowDialog] = useState(false)

    useEffect(() => {
        fetchVisits()
    }, [])

    const fetchVisits = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_BASE_URL}/user/visits`, {
                headers: {
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

    const openVisitDialog = (visit: Visit) => {
        setSelectedVisit(visit)
        setShowDialog(true)
    }

    const formatDate = (dateString: string) => {
        const [datePart] = dateString.split(" ")
        const [day, month, year] = datePart.split("/")
        const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }

    const formatTime = (dateString: string) => {
        const [, timePart] = dateString.split(" ")
        return timePart
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

    const getSpecializationLabel = (specialization: string) => {
        const specializations: Record<string, string> = {
            geral: "Geral",
            pediatria: "Pediatria",
            geriatria: "Geriatria",
            cardiologia: "Cardiologia",
            neurologia: "Neurologia",
        }
        return specializations[specialization] || specialization
    }

    const getNurseInitials = (name: string) => {
        const names = name.split(" ")
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase()
        }
        return name.substring(0, 2).toUpperCase()
    }

    const VisitCard = ({ visit }: { visit: Visit }) => {
        return (
            <Card
                className="cursor-pointer transition-all hover:shadow-md border-blue-200 border-2"
                onClick={() => openVisitDialog(visit)}
            >
                <CardHeader className="bg-blue-50 pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                {visit.nurse.name}
                            </CardTitle>
                            <CardDescription className="mt-1">
                                <Badge variant="outline" className="mt-1">
                                    {getSpecializationLabel(visit.nurse.specialization)}
                                </Badge>
                            </CardDescription>
                        </div>
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={`${API_BASE_URL}/files/${visit.nurse.image}`} alt={visit.nurse.name} />
                            <AvatarFallback>{getNurseInitials(visit.nurse.name)}</AvatarFallback>
                        </Avatar>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{getVisitTypeLabel(visit.visit_type)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(visit.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(visit.date)}</span>
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
                    <h1 className="text-3xl font-bold mb-2">Minhas Visitas Confirmadas</h1>
                    <p className="text-muted-foreground">Visualize suas visitas agendadas com enfermeiros</p>
                </div>

                {visits.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">Nenhuma visita confirmada</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {visits.map((visit) => (
                            <VisitCard key={visit.id} visit={visit} />
                        ))}
                    </div>
                )}

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">Detalhes da Visita</DialogTitle>
                            <DialogDescription>Informações completas sobre a visita agendada</DialogDescription>
                        </DialogHeader>

                        {selectedVisit && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage
                                            src={`${API_BASE_URL}/files/${selectedVisit.nurse.image}`}
                                            alt={selectedVisit.nurse.name}
                                        />
                                        <AvatarFallback>{getNurseInitials(selectedVisit.nurse.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-lg font-semibold">{selectedVisit.nurse.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {getSpecializationLabel(selectedVisit.nurse.specialization)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4">
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

                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Agendado em</p>
                                            <p className="text-base">{selectedVisit.created_at}</p>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-sm font-medium text-green-800 mb-1 flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4" />
                                            Visita Confirmada
                                        </p>
                                        <p className="text-sm text-green-700">
                                            Sua visita está confirmada. O enfermeiro chegará no horário agendado.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (selectedVisit) {
                                        window.location.href = `/visit/nurses-list/${selectedVisit.nurse.id}`
                                    }
                                }}
                            >
                                Ver Perfil do Enfermeiro
                            </Button>
                            <Button onClick={() => setShowDialog(false)}>Fechar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}
