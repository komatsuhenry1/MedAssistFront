"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const heroStyle = {
  backgroundImage: `
    linear-gradient(rgba(21, 128, 61, 0.7), rgba(83, 83, 83, 0.8)),
    url('/equipe_enfermeiros.png')
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "white",
  padding: "5rem 0",
}
interface Nurse {
  id: string
  name: string
  specialization: string
  years_experience: number
  price: number
  shift: string
  department: string
  image: string
  available: boolean
  location: string
  neighborhood: string
}

interface ApiResponse {
  data: Nurse[] | null // API pode retornar null
  message: string
  success: boolean
}

export default function PatientDashboard() {
  const [nurses, setNurses] = useState<Nurse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("")
  const [shiftFilter, setShiftFilter] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("")

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all_nurses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar enfermeiros")
        }

        const data: ApiResponse = await response.json()

        if (data.success) {
          // ✨ CORREÇÃO APLICADA AQUI ✨
          // Garante que nurses sempre será um array, mesmo que data.data seja null
          setNurses(data.data || [])
        } else {
          throw new Error(data.message || "Erro ao carregar dados")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
        console.error("Erro ao buscar enfermeiros:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNurses()
  }, [])

  const filteredNurses = nurses.filter((nurse) => {
    const matchesSearch =
      nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization =
      !specializationFilter || nurse.specialization.toLowerCase() === specializationFilter.toLowerCase()
    const matchesShift = !shiftFilter || nurse.shift.toLowerCase() === shiftFilter.toLowerCase()
    const matchesAvailability =
      !availabilityFilter ||
      (availabilityFilter === "available" && nurse.available) ||
      (availabilityFilter === "unavailable" && !nurse.available)
    const matchesPrice =
      !priceRange ||
      (priceRange === "low" && nurse.price <= 80) ||
      (priceRange === "medium" && nurse.price > 80 && nurse.price <= 100) ||
      (priceRange === "high" && nurse.price > 100)
    const matchesNeighborhood =
      !neighborhoodFilter || nurse.neighborhood.toLowerCase() === neighborhoodFilter.toLowerCase()

    return matchesSearch && matchesSpecialization && matchesShift && matchesAvailability && matchesPrice && matchesNeighborhood
  })

  const uniqueSpecializations = Array.from(new Set(nurses.map((nurse) => nurse.specialization))).filter(Boolean)
  const uniqueShifts = Array.from(new Set(nurses.map((nurse) => nurse.shift))).filter(Boolean)
  const uniqueNeighborhoods = Array.from(new Set(nurses.map((nurse) => nurse.neighborhood))).filter(Boolean)

  const clearFilters = () => {
    setSearchTerm("")
    setSpecializationFilter("")
    setShiftFilter("")
    setAvailabilityFilter("")
    setPriceRange("")
    setNeighborhoodFilter("")
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #e5e7eb",
                borderTop: "4px solid #15803d",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem",
              }}
            ></div>
            <p style={{ color: "#6b7280" }}>Carregando enfermeiros...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <Header />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center", color: "#dc2626" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Erro ao carregar dados</h3>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} style={{ marginTop: "1rem", backgroundColor: "#15803d" }}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Header />

      {/* Hero Section */}
      <section
        style={heroStyle}
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
                  {uniqueSpecializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec.charAt(0).toUpperCase() + spec.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Turno" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueShifts.map((shift) => (
                    <SelectItem key={shift} value={shift}>
                      {shift.charAt(0).toUpperCase() + shift.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={neighborhoodFilter} onValueChange={setNeighborhoodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Bairro" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueNeighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
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

        {/* Results Header */}
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
                    src={nurse.image || "/placeholder.svg?height=80&width=80&query=nurse professional"}
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
                      {nurse.specialization.charAt(0).toUpperCase() + nurse.specialization.slice(1)}
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
                    <span style={{ marginLeft: "0.25rem", fontWeight: "600" }}>{nurse.years_experience} anos</span>
                  </div>
                  <div>
                    <span style={{ color: "#6b7280" }}>Turno:</span>
                    <span style={{ marginLeft: "0.25rem", fontWeight: "600" }}>
                      {nurse.shift.charAt(0).toUpperCase() + nurse.shift.slice(1)}
                    </span>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <span style={{ color: "#6b7280" }}>Localização:</span>
                    <span style={{ marginLeft: "0.25rem", fontWeight: "600" }}>{nurse.location}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#15803d" }}>
                      {nurse.price > 0 ? `R$ ${nurse.price}` : "A combinar"}
                    </span>
                    {nurse.price > 0 && <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>/hora</span>}
                  </div>

                  <Link href={`/patient/nurse/${nurse.id}`}>
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

        {filteredNurses.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Nenhum enfermeiro encontrado</h3>
            <p>Tente ajustar os filtros para encontrar mais opções.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}