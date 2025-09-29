"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Qualification {
    id: string
    text: string
}

interface Service {
    id: string
    text: string
}

interface AvailabilitySlot {
    day: string
    startTime: string
    endTime: string
    available: boolean
}

export default function NurseProfileForm() {
    const router = useRouter()

    // Basic Information
    const [name, setName] = useState("")
    const [specialization, setSpecialization] = useState("")
    const [experience, setExperience] = useState("")
    const [price, setPrice] = useState("")
    const [shift, setShift] = useState("")
    const [department, setDepartment] = useState("")
    const [location, setLocation] = useState("")
    const [bio, setBio] = useState("")
    const [image, setImage] = useState("")

    // Dynamic Lists
    const [qualifications, setQualifications] = useState<Qualification[]>([])
    const [newQualification, setNewQualification] = useState("")

    const [services, setServices] = useState<Service[]>([])
    const [newService, setNewService] = useState("")

    // Availability
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([
        { day: "Segunda", startTime: "", endTime: "", available: false },
        { day: "Terça", startTime: "", endTime: "", available: false },
        { day: "Quarta", startTime: "", endTime: "", available: false },
        { day: "Quinta", startTime: "", endTime: "", available: false },
        { day: "Sexta", startTime: "", endTime: "", available: false },
        { day: "Sábado", startTime: "", endTime: "", available: false },
        { day: "Domingo", startTime: "", endTime: "", available: false },
    ])

    const addQualification = () => {
        if (newQualification.trim()) {
            setQualifications([...qualifications, { id: Date.now().toString(), text: newQualification.trim() }])
            setNewQualification("")
        }
    }

    const removeQualification = (id: string) => {
        setQualifications(qualifications.filter((q) => q.id !== id))
    }

    const addService = () => {
        if (newService.trim()) {
            setServices([...services, { id: Date.now().toString(), text: newService.trim() }])
            setNewService("")
        }
    }

    const removeService = (id: string) => {
        setServices(services.filter((s) => s.id !== id))
    }

    const updateAvailability = (index: number, field: keyof AvailabilitySlot, value: string | boolean) => {
        const updated = [...availability]
        updated[index] = { ...updated[index], [field]: value }
        setAvailability(updated)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const profileData = {
            name,
            specialization,
            experience: Number.parseInt(experience),
            price: Number.parseFloat(price),
            shift,
            department,
            location,
            bio,
            image,
            qualifications: qualifications.map((q) => q.text),
            services: services.map((s) => s.text),
            availability: availability.filter((slot) => slot.available),
        }

        console.log("Profile Data:", profileData)
        alert("Perfil criado com sucesso! Você será redirecionado para a página de visualização.")
        // Here you would typically send the data to your API
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
            <Header />

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#15803d", marginBottom: "0.5rem" }}>
                        Criar Perfil de Enfermeiro
                    </h1>
                    <p style={{ color: "#6b7280", fontSize: "1.125rem" }}>
                        Preencha as informações abaixo para criar seu perfil profissional
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                        {/* Left Column */}
                        <div>
                            {/* Basic Information */}
                            <Card style={{ marginBottom: "1.5rem" }}>
                                <CardHeader>
                                    <CardTitle style={{ color: "#15803d" }}>Informações Básicas</CardTitle>
                                </CardHeader>
                                <CardContent style={{ display: "grid", gap: "1rem" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                                            Nome Completo *
                                        </label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Digite seu nome completo"
                                            required
                                        />
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                        <div>
                                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                                                Especialização *
                                            </label>
                                            <Select value={specialization} onValueChange={setSpecialization}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione sua especialização" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Pediatria">Pediatria</SelectItem>
                                                    <SelectItem value="UTI">UTI</SelectItem>
                                                    <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                                                    <SelectItem value="Oncologia">Oncologia</SelectItem>
                                                    <SelectItem value="Geriatria">Geriatria</SelectItem>
                                                    <SelectItem value="Emergência">Emergência</SelectItem>
                                                    <SelectItem value="Cirúrgica">Cirúrgica</SelectItem>
                                                    <SelectItem value="Domiciliar">Domiciliar</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                                                Anos de Experiência *
                                            </label>
                                            <Input
                                                type="number"
                                                value={experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                                placeholder="Ex: 5"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                        <div>
                                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                                                Preço por Hora (R$) *
                                            </label>
                                            <Input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="Ex: 80"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                                                Turno Preferencial
                                            </label>
                                            <Select value={shift} onValueChange={setShift}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o turno" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Manhã">Manhã</SelectItem>
                                                    <SelectItem value="Tarde">Tarde</SelectItem>
                                                    <SelectItem value="Noite">Noite</SelectItem>
                                                    <SelectItem value="Integral">Integral</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Departamento</label>
                                        <Input
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            placeholder="Ex: Departamento de Pediatria"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Localização *</label>
                                        <Input
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Ex: São Paulo - SP"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                                            URL da Foto de Perfil
                                        </label>
                                        <Input
                                            value={image}
                                            onChange={(e) => setImage(e.target.value)}
                                            placeholder="https://exemplo.com/sua-foto.jpg"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Bio */}
                            <Card style={{ marginBottom: "1.5rem" }}>
                                <CardHeader>
                                    <CardTitle style={{ color: "#15803d" }}>Sobre Você</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                                        Biografia Profissional *
                                    </label>
                                    <Textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Descreva sua experiência, formação e paixão pela enfermagem..."
                                        rows={6}
                                        required
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div>
                            {/* Qualifications */}
                            <Card style={{ marginBottom: "1.5rem" }}>
                                <CardHeader>
                                    <CardTitle style={{ color: "#15803d" }}>Qualificações</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                                        <Input
                                            value={newQualification}
                                            onChange={(e) => setNewQualification(e.target.value)}
                                            placeholder="Ex: Graduação em Enfermagem - USP"
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addQualification())}
                                        />
                                        <Button
                                            type="button"
                                            onClick={addQualification}
                                            style={{ backgroundColor: "#15803d", color: "white" }}
                                        >
                                            Adicionar
                                        </Button>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {qualifications.map((qualification) => (
                                            <div
                                                key={qualification.id}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: "0.75rem",
                                                    backgroundColor: "#f0fdf4",
                                                    borderRadius: "0.5rem",
                                                    border: "1px solid #bbf7d0",
                                                }}
                                            >
                                                <span style={{ color: "#15803d" }}>✓ {qualification.text}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeQualification(qualification.id)}
                                                    style={{ color: "#dc2626" }}
                                                >
                                                    Remover
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Services */}
                            <Card style={{ marginBottom: "1.5rem" }}>
                                <CardHeader>
                                    <CardTitle style={{ color: "#15803d" }}>Serviços Oferecidos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                                        <Input
                                            value={newService}
                                            onChange={(e) => setNewService(e.target.value)}
                                            placeholder="Ex: Cuidados domiciliares pediátricos"
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                                        />
                                        <Button type="button" onClick={addService} style={{ backgroundColor: "#15803d", color: "white" }}>
                                            Adicionar
                                        </Button>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {services.map((service) => (
                                            <div
                                                key={service.id}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: "0.75rem",
                                                    backgroundColor: "#f0fdf4",
                                                    borderRadius: "0.5rem",
                                                    border: "1px solid #bbf7d0",
                                                }}
                                            >
                                                <span style={{ color: "#15803d" }}>• {service.text}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeService(service.id)}
                                                    style={{ color: "#dc2626" }}
                                                >
                                                    Remover
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Availability */}
                            <Card style={{ marginBottom: "1.5rem" }}>
                                <CardHeader>
                                    <CardTitle style={{ color: "#15803d" }}>Disponibilidade</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        {availability.map((slot, index) => (
                                            <div
                                                key={slot.day}
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "auto 1fr 1fr auto",
                                                    gap: "0.5rem",
                                                    alignItems: "center",
                                                    padding: "0.75rem",
                                                    backgroundColor: slot.available ? "#f0fdf4" : "#f9fafb",
                                                    borderRadius: "0.5rem",
                                                    border: `1px solid ${slot.available ? "#bbf7d0" : "#e5e7eb"}`,
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={slot.available}
                                                    onChange={(e) => updateAvailability(index, "available", e.target.checked)}
                                                    style={{ accentColor: "#15803d" }}
                                                />
                                                <span style={{ fontWeight: "600", minWidth: "80px" }}>{slot.day}</span>
                                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                                    <Input
                                                        type="time"
                                                        value={slot.startTime}
                                                        onChange={(e) => updateAvailability(index, "startTime", e.target.value)}
                                                        disabled={!slot.available}
                                                        style={{ fontSize: "0.875rem" }}
                                                    />
                                                    <span>até</span>
                                                    <Input
                                                        type="time"
                                                        value={slot.endTime}
                                                        onChange={(e) => updateAvailability(index, "endTime", e.target.value)}
                                                        disabled={!slot.available}
                                                        style={{ fontSize: "0.875rem" }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            style={{ borderColor: "#15803d", color: "#15803d" }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" style={{ backgroundColor: "#15803d", color: "white", minWidth: "200px" }}>
                            Criar Perfil
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
