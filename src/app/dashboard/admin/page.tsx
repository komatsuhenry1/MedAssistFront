"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

// Tipos para os dados da API
type Document = {
    name: string
    type: string
    download_url: string
}

type Nurse = {
    id: string
    name: string // Será um placeholder por enquanto
    email: string // Será um placeholder por enquanto
    specialization: string // Será um placeholder por enquanto
    documents?: Document[]
}

type DashboardData = {
    total_nurses: number
    total_patients: number
    visits_today: number
    pendent_approvations: number
}

export default function AdminDashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [pendingNurses, setPendingNurses] = useState<Nurse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null)
    const [isApproving, setIsApproving] = useState(false)

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Usuário não autenticado.");
                
                const headers = { 'Authorization': `Bearer ${token}` };

                // 1. Buscar os dados do dashboard para pegar os IDs
                const dashboardResponse = await fetch("http://localhost:8081/api/v1/admin/dashboard", { headers });
                if (!dashboardResponse.ok) throw new Error("Falha ao carregar dados do dashboard.");
                
                const dashboardApiData = await dashboardResponse.json();
                if (!dashboardApiData.success) throw new Error(dashboardApiData.message);

                setDashboardData(dashboardApiData.data);

                // 2. MUDANÇA: Usar os IDs para buscar os DOCUMENTOS de cada enfermeiro
                const nurseIds: string[] = dashboardApiData.data.nurses_ids_pendent_approvations;
                
                if (nurseIds && nurseIds.length > 0) {
                    const nursesPromises = nurseIds.map(async (id) => {
                        // Chamando o endpoint de documentos que você especificou
                        const res = await fetch(`http://localhost:8081/api/v1/admin/documents/${id}`, { headers });
                        if (!res.ok) {
                            console.error(`Falha ao buscar documentos para o ID: ${id}`);
                            return null; // Retorna nulo se a chamada falhar
                        }
                        const result = await res.json();
                        if (result.success) {
                            // Criamos um objeto "Nurse" temporário com os dados que temos
                            return {
                                id: id,
                                // DADOS TEMPORÁRIOS (PLACEHOLDERS)
                                name: `Cadastro Pendente`,
                                email: `ID: ...${id.slice(-6)}`,
                                specialization: "Aguardando detalhes",
                                documents: result.data // Pré-carregamos os documentos aqui
                            };
                        }
                        return null;
                    });
                    
                    const nursesResults = await Promise.all(nursesPromises);
                    
                    // Filtramos para remover qualquer resultado nulo de chamadas que falharam
                    const validNurses = nursesResults.filter(nurse => nurse !== null) as Nurse[];
                    setPendingNurses(validNurses);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchInitialData();
    }, []);

    // MUDANÇA: Função muito mais simples agora!
    const handleOpenDialog = (nurse: Nurse) => {
        // Apenas abre o Dialog, pois os documentos já foram carregados
        setSelectedNurse(nurse);
        setIsDialogOpen(true);
    }

    // Função de aprovação (permanece igual, já estava correta)
    const handleApprove = async (nurseId: string) => {
        setIsApproving(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error("Usuário não autenticado.");
            
            const response = await fetch(`http://localhost:8081/api/v1/admin/approve/${nurseId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Falha ao aprovar o cadastro.");

            setPendingNurses((currentNurses) => currentNurses.filter((nurse) => nurse.id !== nurseId));
            setIsDialogOpen(false);
            setSelectedNurse(null);
            
        } catch (error) {
            console.error("Erro ao aprovar enfermeiro:", error);
            setError(error instanceof Error ? error.message : "Ocorreu um erro desconhecido.");
        } finally {
            setIsApproving(false);
        }
    }

    if (isLoading) return <div>Carregando dashboard...</div>
    if (error) return <div>Erro: {error}</div>

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ... Seu Header e Cards de Stats ... */}
            <section className="p-4 md:p-8 max-w-7xl mx-auto">
                <Tabs defaultValue="pending" className="w-full">
                    {/* ... */}
                    <TabsContent value="pending">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enfermeiros Aguardando Aprovação</CardTitle>
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
                                        {pendingNurses.length > 0 ? (
                                            pendingNurses.map((nurse) => (
                                                <TableRow key={nurse.id}>
                                                    {/* MUDANÇA: Exibindo os dados temporários */}
                                                    <TableCell className="font-medium">{nurse.name}</TableCell>
                                                    <TableCell>{nurse.email}</TableCell>
                                                    <TableCell>{nurse.specialization}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-amber-500 border-amber-500">
                                                            Pendente
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button size="sm" onClick={() => handleOpenDialog(nurse)}>
                                                            Visualizar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center">Nenhuma aprovação pendente.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>
            
            {selectedNurse && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Revisar Documentos</DialogTitle>
                            <DialogDescription>
                                Verifique os documentos para o cadastro com ID: {selectedNurse.id}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="font-semibold">Documentos Enviados</div>
                            {/* Não precisamos mais de "isLoadingDocuments" aqui */}
                            <ul className="list-disc pl-5 space-y-2">
                                {selectedNurse.documents?.map((doc, index) => (
                                    <li key={index}>
                                        <a href={doc.download_url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                            {doc.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={() => handleApprove(selectedNurse.id)} disabled={isApproving}>
                                {isApproving ? "Aprovando..." : "Aprovar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}