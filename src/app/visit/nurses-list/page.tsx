"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

//APLICAR LOGICA DE CHAMAR A API PRA PEGAR ENFERMEIRAS

// Mock data for nurses
const nurses = [
  {
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
  },
  {
    id: 2,
    name: "Carlos Santos",
    specialization: "UTI",
    experience: 8,
    rating: 4.9,
    price: 120,
    shift: "Noite",
    department: "Unidade de Terapia Intensiva",
    image: "/nurse-man-professional.jpg",
    available: true,
    location: "São Paulo - SP",
  },
  {
    id: 3,
    name: "Maria Oliveira",
    specialization: "Cardiologia",
    experience: 12,
    rating: 4.7,
    price: 100,
    shift: "Tarde",
    department: "Departamento de Cardiologia",
    image: "/nurse-woman-cardiology.jpg",
    available: false,
    location: "São Paulo - SP",
  },
  {
    id: 4,
    name: "João Pereira",
    specialization: "Ortopedia",
    experience: 6,
    rating: 4.6,
    price: 90,
    shift: "Manhã",
    department: "Departamento de Ortopedia",
    image: "/nurse-man-orthopedics.jpg",
    available: true,
    location: "São Paulo - SP",
  },
  {
    id: 5,
    name: "Fernanda Costa",
    specialization: "Neurologia",
    experience: 10,
    rating: 4.9,
    price: 110,
    shift: "Tarde",
    department: "Departamento de Neurologia",
    image: "/nurse-woman-neurology.jpg",
    available: true,
    location: "São Paulo - SP",
  },
  {
    id: 6,
    name: "Roberto Lima",
    specialization: "Emergência",
    experience: 7,
    rating: 4.8,
    price: 95,
    shift: "Noite",
    department: "Pronto Socorro",
    image: "/nurse-man-emergency.jpg",
    available: true,
    location: "São Paulo - SP",
  },
]

export default function PatientDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("")
  const [shiftFilter, setShiftFilter] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("")
  const [priceRange, setPriceRange] = useState("")

  const filteredNurses = nurses.filter((nurse) => {
    const matchesSearch =
      nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = !specializationFilter || nurse.specialization === specializationFilter
    const matchesShift = !shiftFilter || nurse.shift === shiftFilter
    const matchesAvailability =
      !availabilityFilter ||
      (availabilityFilter === "available" && nurse.available) ||
      (availabilityFilter === "unavailable" && !nurse.available)
    const matchesPrice =
      !priceRange ||
      (priceRange === "low" && nurse.price <= 80) ||
      (priceRange === "medium" && nurse.price > 80 && nurse.price <= 100) ||
      (priceRange === "high" && nurse.price > 100)

    return matchesSearch && matchesSpecialization && matchesShift && matchesAvailability && matchesPrice
  })

  const clearFilters = () => {
    setSearchTerm("")
    setSpecializationFilter("")
    setShiftFilter("")
    setAvailabilityFilter("")
    setPriceRange("")
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
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
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Encontre o Enfermeiro Ideal</h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.9, maxWidth: "600px", margin: "0 auto" }}>
            Conecte-se com profissionais qualificados e experientes para receber o melhor cuidado de saúde
          </p>
        </div>
      </section>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Filters Section */}
        <Card style={{ marginBottom: "2rem" }}>
          <CardHeader>
            <CardTitle style={{ color: "#15803d" }}>Filtros de Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <Input
                placeholder="Buscar por nome ou especialização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Especialização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pediatria">Pediatria</SelectItem>
                  <SelectItem value="UTI">UTI</SelectItem>
                  <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                  <SelectItem value="Ortopedia">Ortopedia</SelectItem>
                  <SelectItem value="Neurologia">Neurologia</SelectItem>
                  <SelectItem value="Emergência">Emergência</SelectItem>
                </SelectContent>
              </Select>

              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manhã">Manhã</SelectItem>
                  <SelectItem value="Tarde">Tarde</SelectItem>
                  <SelectItem value="Noite">Noite</SelectItem>
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="unavailable">Indisponível</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Faixa de Preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Até R$ 80</SelectItem>
                  <SelectItem value="medium">R$ 81 - R$ 100</SelectItem>
                  <SelectItem value="high">Acima de R$ 100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={clearFilters} variant="outline" style={{ borderColor: "#15803d", color: "#15803d" }}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#15803d" }}>
            {filteredNurses.length} Enfermeiros Encontrados
          </h2>
        </div>

        {/* Nurses Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
          {filteredNurses.map((nurse) => (
            <Card
              key={nurse.id}
              style={{ transition: "transform 0.2s", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <CardContent style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <img
                    src={nurse.image || "/placeholder.svg"}
                    alt={nurse.name}
                    style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1f2937" }}>{nurse.name}</h3>
                      <Badge
                        variant={nurse.available ? "default" : "secondary"}
                        style={{ backgroundColor: nurse.available ? "#15803d" : "#6b7280" }}
                      >
                        {nurse.available ? "Disponível" : "Indisponível"}
                      </Badge>
                    </div>
                    <p style={{ color: "#15803d", fontWeight: "600", marginBottom: "0.25rem" }}>
                      {nurse.specialization}
                    </p>
                    <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>{nurse.department}</p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <div>
                    <span style={{ color: "#6b7280" }}>Experiência:</span>
                    <span style={{ marginLeft: "0.25rem", fontWeight: "600" }}>{nurse.experience} anos</span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Avaliação:</span>
                    <span style={{ marginLeft: "0.25rem", fontWeight: "600" }}>⭐ {nurse.rating}</span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Turno:</span>
                    <span style={{ marginLeft: "0.25rem", fontWeight: "600" }}>{nurse.shift}</span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Localização:</span>
                    <span style={{ marginLeft: "0.25rem", fontWeight: "600" }}>{nurse.location}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#15803d" }}>R$ {nurse.price}</span>
                    <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>/hora</span>
                  </div>

                  <Link href={`/visit/nurses-list/${nurse.id}`}>
                    <Button
                      style={{
                        backgroundColor: nurse.available ? "#15803d" : "#6b7280",
                        color: "white",
                      }}
                      disabled={!nurse.available}
                    >
                      {nurse.available ? "Ver Perfil" : "Indisponível"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNurses.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Nenhum enfermeiro encontrado</h3>
            <p>Tente ajustar os filtros para encontrar mais opções.</p>
          </div>
        )}
      </div>
    </div>
  )
}