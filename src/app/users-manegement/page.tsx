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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Users, UserCog, Edit, Trash2, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api/v1"

interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  cpf: string
  password: string
  hidden: boolean
  role: string
  first_access: boolean
}

interface Nurse {
  id: string
  name: string
  email: string
  phone: string
  address: string
  cpf: string
  pix_key: string
  password: string
  verification_seal: boolean
  license_number: string
  specialization: string
  shift: string
  department: string
  years_experience: number
  price: number
  bio: string
  hidden: boolean
  role: string
  online: boolean
  first_access: boolean
  start_time: string
  end_time: string
}

interface AdminData {
  users: User[]
  nurses: Nurse[]
}

interface ApiResponse {
  data: AdminData
  message: string
  success: boolean
}

export default function AdminUsersPage() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit dialog states
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | Nurse | null>(null)
  const [editingType, setEditingType] = useState<"user" | "nurse">("user")
  const [isUpdating, setIsUpdating] = useState(false)

  // Delete dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [editForm, setEditForm] = useState<any>({
    name: "",
    email: "",
    phone: "",
    address: "",
    cpf: "",
    password: "",
    hidden: false,
    first_access: false,
  })


  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao carregar dados dos usuários")
      }

      const apiResponse: ApiResponse = await response.json()
      if (apiResponse.success && apiResponse.data) {
        setAdminData(apiResponse.data)
      } else {
        throw new Error(apiResponse.message || "Erro ao carregar dados")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (user: User | Nurse, type: "user" | "nurse") => {
    setEditingUser(user)
    setEditingType(type)

    if (type === "nurse") {
      const nurse = user as Nurse
      setEditForm({
        name: nurse.name,
        email: nurse.email,
        phone: nurse.phone,
        address: nurse.address,
        cpf: nurse.cpf,
        pix_key: nurse.pix_key,
        password: nurse.password,
        verification_seal: nurse.verification_seal,
        license_number: nurse.license_number,
        specialization: nurse.specialization,
        shift: nurse.shift,
        department: nurse.department,
        years_experience: nurse.years_experience,
        price: nurse.price,
        bio: nurse.bio,
        hidden: nurse.hidden,
        first_access: nurse.first_access,
        start_time: nurse.start_time,
        end_time: nurse.end_time,
      })
    } else {
      const patient = user as User
      setEditForm({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        cpf: patient.cpf,
        password: patient.password,
        hidden: patient.hidden,
        first_access: patient.first_access,
      })
    }

    setShowEditDialog(true)
  }

  const handleUpdate = async () => {
    if (!editingUser) return

    setIsUpdating(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar usuário")
      }

      const apiResponse: ApiResponse = await response.json()
      if (apiResponse.success && apiResponse.data) {
        setAdminData(apiResponse.data)
        toast.success("Sucesso!", { description: "Usuário atualizado com sucesso." })
      } else {
        throw new Error(apiResponse.message || "Erro ao atualizar usuário")
      }
    } catch (err) {
      toast.error("Erro", { description: err instanceof Error ? err.message : "Erro ao atualizar usuário" })
    } finally {
      setIsUpdating(false)
      setShowEditDialog(false)
      setEditingUser(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/user/${deletingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir usuário")
      }

      const apiResponse: ApiResponse = await response.json()
      if (apiResponse.success && apiResponse.data) {
        setAdminData(apiResponse.data)
        toast.success("Sucesso!", { description: "Usuário excluído com sucesso." })
      } else {
        throw new Error(apiResponse.message || "Erro ao excluir")
      }
    } catch (err) {
      toast.error("Erro", { description: err instanceof Error ? err.message : "Erro ao excluir" })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setDeletingId(null)
    }
  }

  const handleDeleteFromDialog = () => {
    if (editingUser) {
      setShowEditDialog(false)
      openDeleteDialog(editingUser.id)
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          <Loader2 className="animate-spin" size={48} style={{ color: "#15803d" }} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 80px)",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "1.25rem", color: "#ef4444" }}>{error}</p>
          <Button onClick={fetchAdminData} style={{ backgroundColor: "#15803d", color: "white" }}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
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
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Gerenciamento de Usuários</h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.9 }}>Administre usuários e enfermeiros da plataforma</p>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: "3rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários ({adminData?.users.length || 0})
            </TabsTrigger>
            <TabsTrigger value="nurses" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Enfermeiros ({adminData?.nurses.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Usuários</CardTitle>
                <CardDescription>Gerencie os usuários cadastrados na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                {adminData?.users.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum usuário cadastrado</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminData?.users.map((user) => (
                        <TableRow
                          key={user.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openEditDialog(user, "user")}
                        >
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {user.phone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(user, "user")}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nurses Tab */}
          <TabsContent value="nurses">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Enfermeiros</CardTitle>
                <CardDescription>Gerencie os enfermeiros cadastrados na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                {adminData?.nurses.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
                    <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum enfermeiro cadastrado</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Especialização</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminData?.nurses.map((nurse) => (
                        <TableRow
                          key={nurse.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openEditDialog(nurse, "nurse")}
                        >
                          <TableCell className="font-medium">{nurse.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {nurse.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {nurse.phone}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{nurse.specialization}</Badge>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(nurse, "nurse")}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(nurse.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar {editingType === "nurse" ? "Enfermeiro" : "Usuário"}</DialogTitle>
            <DialogDescription>
              Atualize as informações do {editingType === "nurse" ? "enfermeiro" : "usuário"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Common fields for both users and nurses */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-cpf">CPF</Label>
                <Input
                  id="edit-cpf"
                  value={editForm.cpf}
                  onChange={(e) => setEditForm({ ...editForm, cpf: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-password">Senha (deixe em branco para não alterar)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                placeholder="Digite uma nova senha ou deixe em branco"
              />
            </div>

            {/* Nurse-specific fields */}
            {editingType === "nurse" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-license">COREN</Label>
                    <Input
                      id="edit-license"
                      value={editForm.license_number}
                      onChange={(e) => setEditForm({ ...editForm, license_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-specialization">Especialização</Label>
                    <Input
                      id="edit-specialization"
                      value={editForm.specialization}
                      onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-shift">Turno</Label>
                    <Input
                      id="edit-shift"
                      value={editForm.shift}
                      onChange={(e) => setEditForm({ ...editForm, shift: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-department">Departamento</Label>
                    <Input
                      id="edit-department"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-experience">Anos de Experiência</Label>
                    <Input
                      id="edit-experience"
                      type="number"
                      value={editForm.years_experience}
                      onChange={(e) =>
                        setEditForm({ ...editForm, years_experience: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Preço</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-pix">Chave PIX</Label>
                    <Input
                      id="edit-pix"
                      value={editForm.pix_key}
                      onChange={(e) => setEditForm({ ...editForm, pix_key: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-start-time">Horário Início</Label>
                    <Input
                      id="edit-start-time"
                      value={editForm.start_time}
                      onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-end-time">Horário Fim</Label>
                    <Input
                      id="edit-end-time"
                      value={editForm.end_time}
                      onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-bio">Biografia</Label>
                  <Textarea
                    id="edit-bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-verification"
                    checked={editForm.verification_seal}
                    onCheckedChange={(checked) => setEditForm({ ...editForm, verification_seal: checked })}
                  />
                  <Label htmlFor="edit-verification">Selo de Verificação</Label>
                </div>
              </>
            )}

            {/* Common checkboxes */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-hidden"
                  checked={editForm.hidden}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, hidden: checked })}
                />
                <Label htmlFor="edit-hidden">Oculto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-first-access"
                  checked={editForm.first_access}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, first_access: checked })}
                />
                <Label htmlFor="edit-first-access">Primeiro Acesso</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={handleDeleteFromDialog}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                style={{ backgroundColor: "#15803d", color: "white" }}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              style={{ backgroundColor: "#ef4444", color: "white" }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
