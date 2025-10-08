"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { User, Mail, Phone, MapPin, Calendar, Shield, CreditCard, Edit, Save, X } from "lucide-react"

interface PatientData {
    id: string
    name: string
    email: string
    phone: string
    address: string
    password: string
    cpf: string
    role: string
    first_access: boolean
    created_at: string
    updated_at: string
    hidden: boolean
    profile_image_id?: string
}

interface ApiResponse {
    data: PatientData
    message: string
    success: boolean
}

export default function MyProfile() {
    const router = useRouter()
    const [patient, setPatient] = useState<PatientData | null>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Form state for editing
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    })

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true)
                const storedUser = localStorage.getItem("user")
                if (!storedUser) {
                    toast.error("Usuário não encontrado. Faça login novamente.")
                    router.push("/login")
                    return
                }

                const user = JSON.parse(storedUser)
                const patientId = user.id

                const response = await fetch(`http://localhost:8081/api/v1/nurse/patient/${patientId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                if (!response.ok) {
                    throw new Error("Erro ao carregar perfil")
                }

                const result: ApiResponse = await response.json()

                if (result.success && result.data) {
                    setPatient(result.data)
                    setEditForm({
                        name: result.data.name,
                        email: result.data.email,
                        phone: result.data.phone,
                        address: result.data.address,
                        password: result.data.password,
                    })
                } else {
                    throw new Error(result.message || "Erro ao carregar dados")
                }
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Erro ao carregar perfil")
            } finally {
                setLoading(false)
            }
        }

        fetchPatientData()
    }, [router])

    const handleSave = async () => {
        try {
            setIsSaving(true)

            const response = await fetch(`http://localhost:8081/api/v1/user/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(editForm),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                toast.success(result.message || "Perfil atualizado com sucesso!")

                // Update local state
                if (patient) {
                    setPatient({
                        ...patient,
                        ...editForm,
                    })
                }

                // Update localStorage
                const storedUser = localStorage.getItem("user")
                if (storedUser) {
                    const user = JSON.parse(storedUser)
                    localStorage.setItem("user", JSON.stringify({ ...user, ...editForm }))
                }

                setIsEditing(false)
            } else {
                throw new Error(result.message || "Erro ao atualizar perfil")
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erro ao atualizar perfil")
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        if (patient) {
            setEditForm({
                name: patient.name,
                email: patient.email,
                phone: patient.phone,
                address: patient.address,
                password: patient.password,
            })
        }
        setIsEditing(false)
    }

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
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="flex justify-center items-center h-48">
                        <div className="text-[#15803d] text-lg">Carregando seu perfil...</div>
                    </div>
                </div>
            </div>
        )
    }

    if (!patient) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-red-600 mb-4">Erro ao carregar perfil</h1>
                    <Button onClick={() => router.push("/")}>Voltar para Início</Button>
                </div>
            </div>
        )
    }

    const avatarUrl = patient.profile_image_id
        ? `http://localhost:8081/api/v1/user/file/${patient.profile_image_id}`
        : undefined

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header with Edit Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} className="bg-[#15803d] hover:bg-[#166534]">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Perfil
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button onClick={handleCancel} variant="outline">
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving} className="bg-[#15803d] hover:bg-[#166534]">
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column - Avatar and Status */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                {/* Avatar */}
                                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#15803d] text-white flex items-center justify-center text-4xl font-bold overflow-hidden">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl || "/placeholder.svg"}
                                            alt={patient.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        patient.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join("")
                                            .toUpperCase()
                                    )}
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{patient.name}</h2>
                                <p className="text-[#15803d] font-semibold mb-4">Paciente</p>

                                <div className="flex justify-center gap-2 mb-4">
                                    <Badge
                                        variant={patient.hidden ? "secondary" : "default"}
                                        className={patient.hidden ? "" : "bg-[#15803d]"}
                                    >
                                        {patient.hidden ? "Inativo" : "Ativo"}
                                    </Badge>
                                    {patient.first_access && (
                                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                                            Primeiro Acesso
                                        </Badge>
                                    )}
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-sm text-gray-600 mb-1">Membro desde</div>
                                    <div className="text-lg font-semibold text-[#15803d]">{formatDate(patient.created_at)}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#15803d] flex items-center gap-2">
                                    <User size={20} />
                                    Informações de Contato
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <>
                                        <div>
                                            <Label htmlFor="name">Nome Completo</Label>
                                            <Input
                                                id="name"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Telefone</Label>
                                            <Input
                                                id="phone"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="address">Endereço</Label>
                                            <Input
                                                id="address"
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="password">Senha</Label>
                                            <Input
                                                id="password"
                                                value={editForm.password}
                                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                className="mt-1"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Mail size={20} className="text-[#15803d]" />
                                            <div>
                                                <div className="text-sm text-gray-600">Email</div>
                                                <div className="font-semibold text-gray-900">{patient.email}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Phone size={20} className="text-[#15803d]" />
                                            <div>
                                                <div className="text-sm text-gray-600">Telefone</div>
                                                <div className="font-semibold text-gray-900">{formatPhone(patient.phone)}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <MapPin size={20} className="text-[#15803d]" />
                                            <div>
                                                <div className="text-sm text-gray-600">Endereço</div>
                                                <div className="font-semibold text-gray-900">{patient.address}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#15803d] flex items-center gap-2">
                                    <CreditCard size={20} />
                                    Informações Pessoais
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">CPF</div>
                                        <div className="font-semibold text-gray-900 text-lg">{formatCPF(patient.cpf)}</div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600 mb-1">Função</div>
                                        <div className="font-semibold text-gray-900 text-lg">Paciente</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[#15803d] flex items-center gap-2">
                                    <Shield size={20} />
                                    Informações da Conta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar size={20} className="text-[#15803d]" />
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-600">Data de Cadastro</div>
                                        <div className="font-semibold text-gray-900">{formatDate(patient.created_at)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar size={20} className="text-[#15803d]" />
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-600">Última Atualização</div>
                                        <div className="font-semibold text-gray-900">{formatDate(patient.updated_at)}</div>
                                    </div>
                                </div>

                                <div
                                    className={`flex items-center gap-3 p-3 rounded-lg ${patient.first_access ? "bg-amber-50" : "bg-green-50"}`}
                                >
                                    <Shield size={20} className={patient.first_access ? "text-amber-500" : "text-[#15803d]"} />
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-600">Status da Conta</div>
                                        <div className={`font-semibold ${patient.first_access ? "text-amber-500" : "text-[#15803d]"}`}>
                                            {patient.first_access ? "Aguardando primeiro acesso" : "Conta ativa"}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
