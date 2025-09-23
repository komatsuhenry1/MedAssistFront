"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const nurseDetails = {
    1: {
        id: 1,
        name: "Ana Silva",
        specialization: "Pediatria",
        experience: 5,
        rating: 4.8,
        price: 80,
        shift: "Manhã",
        department: "Departamento de Pediatria",
        image: "/nurse-woman-professional.jpg",
        available: true,
        location: "São Paulo - SP",
        bio: "Enfermeira especializada em pediatria com 5 anos de experiência. Formada pela USP, com pós-graduação em cuidados intensivos pediátricos. Apaixonada por cuidar de crianças e proporcionar conforto às famílias.",
        qualifications: [
            "Graduação em Enfermagem - USP",
            "Pós-graduação em Pediatria - UNIFESP",
            "Certificação em Primeiros Socorros",
            "Curso de Cuidados Intensivos Pediátricos",
        ],
        services: [
            "Cuidados domiciliares pediátricos",
            "Administração de medicamentos",
            "Acompanhamento hospitalar",
            "Cuidados pós-operatórios",
            "Orientação aos pais",
        ],
        reviews: [
            {
                patient: "Maria Santos",
                rating: 5,
                comment: "Excelente profissional! Muito cuidadosa com minha filha.",
                date: "15/12/2023",
            },
            {
                patient: "João Silva",
                rating: 5,
                comment: "Ana é muito competente e carinhosa. Recomendo!",
                date: "10/12/2023",
            },
            {
                patient: "Carla Oliveira",
                rating: 4,
                comment: "Ótimo atendimento, muito profissional.",
                date: "05/12/2023",
            },
        ],
        availability: [
            { day: "Segunda", hours: "08:00 - 12:00" },
            { day: "Terça", hours: "08:00 - 12:00" },
            { day: "Quarta", hours: "08:00 - 12:00" },
            { day: "Quinta", hours: "08:00 - 12:00" },
            { day: "Sexta", hours: "08:00 - 12:00" },
        ],
    },
}

export default function NurseProfile() {
    const params = useParams()
    const router = useRouter()
    const nurseId = Number.parseInt(params.id as string)
    const nurse = nurseDetails[nurseId as keyof typeof nurseDetails]

    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")
    const [message, setMessage] = useState("")
    const [showBookingForm, setShowBookingForm] = useState(false)

    if (!nurse) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
                <Header />
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
                    <h1>Enfermeiro não encontrado</h1>
                    <Button onClick={() => router.back()} style={{ marginTop: "1rem" }}>
                        Voltar
                    </Button>
                </div>
            </div>
        )
    }

    const handleBooking = () => {
        // Here you would typically send the booking data to your API
        alert("Solicitação de agendamento enviada! Você receberá uma confirmação em breve.")
        setShowBookingForm(false)
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
            <Header />

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
                {/* Back Button */}
                <Button
                    onClick={() => router.back()}
                    variant="outline"
                    style={{ marginBottom: "1.5rem", borderColor: "#15803d", color: "#15803d" }}
                >
                    ← Voltar à Lista
                </Button>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
                    {/* Left Column - Nurse Info */}
                    <div>
                        <Card style={{ marginBottom: "1.5rem" }}>
                            <CardContent style={{ padding: "2rem", textAlign: "center" }}>
                                <img
                                    src={nurse.image || "/placeholder.svg"}
                                    alt={nurse.name}
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        margin: "0 auto 1rem",
                                    }}
                                />
                                <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#1f2937" }}>
                                    {nurse.name}
                                </h1>
                                <p style={{ color: "#15803d", fontWeight: "600", fontSize: "1.125rem", marginBottom: "0.5rem" }}>
                                    {nurse.specialization}
                                </p>
                                <p style={{ color: "#6b7280", marginBottom: "1rem" }}>{nurse.department}</p>

                                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
                                    <Badge
                                        variant={nurse.available ? "default" : "secondary"}
                                        style={{ backgroundColor: nurse.available ? "#15803d" : "#6b7280" }}
                                    >
                                        {nurse.available ? "Disponível" : "Indisponível"}
                                    </Badge>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#15803d" }}>{nurse.experience}</div>
                                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Anos de experiência</div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#15803d" }}>⭐ {nurse.rating}</div>
                                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>Avaliação</div>
                                    </div>
                                </div>

                                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#15803d", marginBottom: "0.25rem" }}>
                                    R$ {nurse.price}/hora
                                </div>
                                <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem" }}>📍 {nurse.location}</p>

                                {nurse.available && (
                                    <Button
                                        onClick={() => setShowBookingForm(!showBookingForm)}
                                        style={{ backgroundColor: "#15803d", color: "white", width: "100%" }}
                                    >
                                        {showBookingForm ? "Cancelar Agendamento" : "Agendar Consulta"}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Availability */}
                        <Card>
                            <CardHeader>
                                <CardTitle style={{ color: "#15803d" }}>Disponibilidade</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {nurse.availability.map((slot, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "0.5rem 0",
                                            borderBottom: index < nurse.availability.length - 1 ? "1px solid #e5e7eb" : "none",
                                        }}
                                    >
                                        <span style={{ fontWeight: "600" }}>{slot.day}</span>
                                        <span style={{ color: "#6b7280" }}>{slot.hours}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div>
                        {/* Booking Form */}
                        {showBookingForm && (
                            <Card style={{ marginBottom: "1.5rem", border: "2px solid #15803d" }}>
                                <CardHeader>
                                    <CardTitle style={{ color: "#15803d" }}>Agendar Consulta</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                                        <div>
                                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Data</label>
                                            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Horário</label>
                                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o horário" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="08:00">08:00</SelectItem>
                                                    <SelectItem value="09:00">09:00</SelectItem>
                                                    <SelectItem value="10:00">10:00</SelectItem>
                                                    <SelectItem value="11:00">11:00</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: "1rem" }}>
                                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                                            Mensagem (opcional)
                                        </label>
                                        <Textarea
                                            placeholder="Descreva brevemente o tipo de cuidado necessário..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleBooking}
                                        style={{ backgroundColor: "#15803d", color: "white", width: "100%" }}
                                        disabled={!selectedDate || !selectedTime}
                                    >
                                        Confirmar Agendamento
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Bio */}
                        <Card style={{ marginBottom: "1.5rem" }}>
                            <CardHeader>
                                <CardTitle style={{ color: "#15803d" }}>Sobre</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p style={{ lineHeight: "1.6", color: "#4b5563" }}>{nurse.bio}</p>
                            </CardContent>
                        </Card>

                        {/* Qualifications */}
                        <Card style={{ marginBottom: "1.5rem" }}>
                            <CardHeader>
                                <CardTitle style={{ color: "#15803d" }}>Qualificações</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {nurse.qualifications.map((qualification, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                padding: "0.5rem 0",
                                                borderBottom: index < nurse.qualifications.length - 1 ? "1px solid #e5e7eb" : "none",
                                            }}
                                        >
                                            <span style={{ color: "#15803d", marginRight: "0.5rem" }}>✓</span>
                                            {qualification}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Services */}
                        <Card style={{ marginBottom: "1.5rem" }}>
                            <CardHeader>
                                <CardTitle style={{ color: "#15803d" }}>Serviços Oferecidos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    {nurse.services.map((service, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                padding: "0.5rem 0",
                                                borderBottom: index < nurse.services.length - 1 ? "1px solid #e5e7eb" : "none",
                                            }}
                                        >
                                            <span style={{ color: "#15803d", marginRight: "0.5rem" }}>•</span>
                                            {service}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Reviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle style={{ color: "#15803d" }}>Avaliações dos Pacientes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {nurse.reviews.map((review, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: "1rem 0",
                                            borderBottom: index < nurse.reviews.length - 1 ? "1px solid #e5e7eb" : "none",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            <span style={{ fontWeight: "600" }}>{review.patient}</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                <span style={{ color: "#15803d" }}>{"⭐".repeat(review.rating)}</span>
                                                <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>{review.date}</span>
                                            </div>
                                        </div>
                                        <p style={{ color: "#4b5563", lineHeight: "1.5" }}>{review.comment}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}