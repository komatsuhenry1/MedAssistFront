"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, User, Mail, Phone, MapPin, Calendar, Shield, CreditCard, Clock } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface PatientData {
    id: string
    name: string
    email: string
    phone: string
    address: string
    cpf: string
    role: string
    first_access: boolean
    created_at: string
    updated_at: string
    hidden: boolean
    profile_image_id: string
}

interface ApiResponse {
    data: PatientData
    message: string
    success: boolean
}

// [MUDANÇA] Componente reutilizável para itens de informação, inspirado no seu exemplo.
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ color: "#15803d" }}>{icon}</div>
        <div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{label}</p>
            <p style={{ fontWeight: "600", color: "#1f2937" }}>{value}</p>
        </div>
    </li>
)

export default function PatientProfile() {
    const params = useParams()
    const router = useRouter()
    const patientId = params.id as string

    const [patient, setPatient] = useState<PatientData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPatientData = async () => {
            if (!patientId) return
            try {
                setLoading(true)
                const response = await fetch(`${API_BASE_URL}/nurse/patient/${patientId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                if (!response.ok) {
                    throw new Error("Paciente não encontrado ou acesso não autorizado")
                }

                const result: ApiResponse = await response.json()

                if (result.success && result.data) {
                    setPatient(result.data)
                } else {
                    throw new Error(result.message || "Erro ao carregar dados do paciente")
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro desconhecido")
                toast.error(err instanceof Error ? err.message : "Erro ao carregar perfil")
            } finally {
                setLoading(false)
            }
        }

        fetchPatientData()
    }, [patientId])

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }

    const formatCPF = (cpf: string) => {
        if (!cpf) return "N/A"
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }

    const formatPhone = (phone: string) => {
        if (!phone) return "N/A"
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <div className="flex flex-1 items-center justify-center text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-green-700" />
                        <p className="text-lg text-gray-600">Carregando perfil do paciente...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !patient) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <div className="flex flex-1 items-center justify-center text-center">
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-red-600">{error || "Paciente não encontrado"}</h1>
                        <Button onClick={() => router.back()}>Voltar</Button>
                    </div>
                </div>
            </div>
        )
    }

    const imageUrl = patient?.profile_image_id
        ? `${API_BASE_URL}/user/file/${patient.profile_image_id}`
        : "/placeholder-avatar.png"

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto max-w-6xl p-4 md:p-8">
                <Button onClick={() => router.back()} variant="outline" className="mb-6">
                    ← Voltar
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Patient Info Card */}
                    <aside className="md:col-span-1 space-y-6">
                        <Card className="text-center">
                            <CardContent className="p-6">
                                <div className="relative w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <Image
                                        src={imageUrl}
                                        alt={`Foto de perfil de ${patient.name}`}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                <h1 className="text-2xl font-bold text-gray-800">{patient.name}</h1>
                                <p className="font-semibold text-green-700 mb-4">Paciente</p>

                                <div className="flex justify-center gap-2 mb-6">
                                    <Badge variant={patient.hidden ? "secondary" : "default"}>
                                        {patient.hidden ? "Inativo" : "Ativo"}
                                    </Badge>
                                    {patient.first_access && (
                                        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                            Primeiro Acesso
                                        </Badge>
                                    )}
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg text-left">
                                    <InfoItem
                                        icon={<Calendar size={20} />}
                                        label="Membro desde"
                                        value={formatDate(patient.created_at)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Right Column - Details */}
                    <section className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-700 flex items-center gap-2">
                                    <User size={20} /> Informações de Contato
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* [MUDANÇA] Layout simplificado para uma lista mais limpa */}
                                <ul className="space-y-4">
                                    <InfoItem icon={<Mail size={20} />} label="Email" value={patient.email} />
                                    <InfoItem icon={<Phone size={20} />} label="Telefone" value={formatPhone(patient.phone)} />
                                    <InfoItem icon={<MapPin size={20} />} label="Endereço" value={patient.address} />
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-700 flex items-center gap-2">
                                    <CreditCard size={20} /> Informações Pessoais
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    <InfoItem icon={<CreditCard size={20} />} label="CPF" value={formatCPF(patient.cpf)} />
                                    <InfoItem icon={<User size={20} />} label="Função" value={patient.role || "Paciente"} />
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-700 flex items-center gap-2">
                                    <Shield size={20} /> Informações da Conta
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    <InfoItem
                                        icon={<Clock size={20} />}
                                        label="Última Atualização"
                                        value={formatDate(patient.updated_at)}
                                    />
                                    <InfoItem
                                        icon={<Shield size={20} />}
                                        label="Status da Conta"
                                        value={patient.first_access ? "Aguardando primeiro acesso" : "Conta ativa"}
                                    />
                                </ul>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>
        </div>
    )
}