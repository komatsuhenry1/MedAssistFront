"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboard() {
    const [pendingNurses] = useState([
        { id: 1, name: "Ana Silva", email: "ana@email.com", specialization: "Pediatria", status: "pending" },
        { id: 2, name: "Carlos Santos", email: "carlos@email.com", specialization: "UTI", status: "pending" },
        { id: 3, name: "Maria Oliveira", email: "maria@email.com", specialization: "Cardiologia", status: "pending" },
    ])

    const [recentActivities] = useState([
        { id: 1, action: "Novo cadastro de paciente", user: "João Silva", time: "2 min atrás" },
        { id: 2, action: "Enfermeiro aprovado", user: "Ana Costa", time: "15 min atrás" },
        { id: 3, action: "Consulta agendada", user: "Pedro Lima", time: "1h atrás" },
        { id: 4, action: "Documento enviado", user: "Maria Santos", time: "2h atrás" },
    ])

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
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Dashboard Administrativo</h1>
                    <p style={{ fontSize: "1.25rem", opacity: 0.9 }}>
                        Gerencie usuários, monitore atividades e acompanhe métricas da plataforma MedAssist
                    </p>
                </div>
            </section>

            {/* Stats Cards */}
            <section style={{ padding: "2rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "1.5rem",
                        marginBottom: "2rem",
                    }}
                >
                    <Card>
                        <CardHeader style={{ paddingBottom: "0.5rem" }}>
                            <CardTitle style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total de Enfermeiros</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#15803d" }}>247</div>
                            <p style={{ fontSize: "0.875rem", color: "#10b981" }}>+12% este mês</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader style={{ paddingBottom: "0.5rem" }}>
                            <CardTitle style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total de Pacientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#15803d" }}>1,429</div>
                            <p style={{ fontSize: "0.875rem", color: "#10b981" }}>+8% este mês</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader style={{ paddingBottom: "0.5rem" }}>
                            <CardTitle style={{ fontSize: "0.875rem", color: "#6b7280" }}>Consultas Hoje</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#15803d" }}>89</div>
                            <p style={{ fontSize: "0.875rem", color: "#10b981" }}>+5% vs ontem</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader style={{ paddingBottom: "0.5rem" }}>
                            <CardTitle style={{ fontSize: "0.875rem", color: "#6b7280" }}>Aprovações Pendentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#dc2626" }}>3</div>
                            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Requer atenção</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="pending" style={{ width: "100%" }}>
                    <TabsList style={{ marginBottom: "1.5rem" }}>
                        <TabsTrigger value="pending">Aprovações Pendentes</TabsTrigger>
                        <TabsTrigger value="users">Gerenciar Usuários</TabsTrigger>
                        <TabsTrigger value="activity">Atividades Recentes</TabsTrigger>
                        <TabsTrigger value="reports">Relatórios</TabsTrigger>
                    </TabsList>

                    {/* Pending Approvals Tab */}
                    <TabsContent value="pending">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enfermeiros Aguardando Aprovação</CardTitle>
                                <CardDescription>Revise e aprove novos cadastros de enfermeiros</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Especialização</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingNurses.map((nurse) => (
                                            <TableRow key={nurse.id}>
                                                <TableCell style={{ fontWeight: "500" }}>{nurse.name}</TableCell>
                                                <TableCell>{nurse.email}</TableCell>
                                                <TableCell>{nurse.specialization}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" style={{ color: "#f59e0b", borderColor: "#f59e0b" }}>
                                                        Pendente
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                                        <Button size="sm" style={{ backgroundColor: "#15803d", color: "white" }}>
                                                            Aprovar
                                                        </Button>
                                                        <Button size="sm" variant="outline" style={{ color: "#dc2626", borderColor: "#dc2626" }}>
                                                            Rejeitar
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Users Management Tab */}
                    <TabsContent value="users">
                        <div
                            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gerenciar Enfermeiros</CardTitle>
                                    <CardDescription>Visualizar, editar e desativar contas de enfermeiros</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button style={{ backgroundColor: "#15803d", color: "white", width: "100%" }}>
                                        Ver Todos os Enfermeiros
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Gerenciar Pacientes</CardTitle>
                                    <CardDescription>Visualizar, editar e desativar contas de pacientes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button style={{ backgroundColor: "#15803d", color: "white", width: "100%" }}>
                                        Ver Todos os Pacientes
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Recent Activity Tab */}
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle>Atividades Recentes</CardTitle>
                                <CardDescription>Acompanhe as últimas ações na plataforma</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div style={{ display: "grid", gap: "1rem" }}>
                                    {recentActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "1rem",
                                                borderBottom: "1px solid #e5e7eb",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            <div>
                                                <p style={{ fontWeight: "500", marginBottom: "0.25rem" }}>{activity.action}</p>
                                                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>por {activity.user}</p>
                                            </div>
                                            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Reports Tab */}
                    <TabsContent value="reports">
                        <div
                            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Relatório de Usuários</CardTitle>
                                    <CardDescription>Estatísticas detalhadas de cadastros e atividade</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button style={{ backgroundColor: "#15803d", color: "white", width: "100%" }}>Gerar Relatório</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Relatório de Consultas</CardTitle>
                                    <CardDescription>Métricas de agendamentos e atendimentos</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button style={{ backgroundColor: "#15803d", color: "white", width: "100%" }}>Gerar Relatório</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Relatório Financeiro</CardTitle>
                                    <CardDescription>Análise de receitas e transações</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button style={{ backgroundColor: "#15803d", color: "white", width: "100%" }}>Gerar Relatório</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    )
}
