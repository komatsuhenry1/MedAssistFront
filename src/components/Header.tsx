"use client"

import { useEffect, useState } from "react"
// [MUDANÇA] Imports adicionados para seguir as boas práticas do Next.js
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Menu, LogOut, User, UserPlus, Bell } from "lucide-react"

// [MUDANÇA] URL da API agora usa uma variável de ambiente para funcionar tanto localmente quanto em produção.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface UserData {
  name: string
  email: string
  role: "PATIENT" | "NURSE" | "ADMIN"
  id: string
  profile_image_id?: string
}

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  // [MUDANÇA] Removido o useState, já que o setNotificationsCount não era utilizado.
  // Se esse valor vier a ser dinâmico (buscado de uma API), o useState pode ser reintroduzido.
  const notificationsCount = 3

  // [MUDANÇA] Adicionado o router para navegação programática
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          setUserData(user)
        } catch (error) {
          console.error("Erro ao processar dados do usuário:", error)
        }
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUserData(null)
    // [MUDANÇA] Usando router.push() para uma navegação mais suave, sem recarregar a página.
    router.push("/")
  }

  const getInitials = (name: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const NavLinks = () => {
    const baseLinks = (
      <>
        {/* [MUDANÇA] Trocado <a> por <Link> */}
        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
          Início
        </Link>
        <Link href="/sobre" className="text-sm font-medium hover:text-primary transition-colors">
          Sobre
        </Link>
        <Link href="/servicos" className="text-sm font-medium hover:text-primary transition-colors">
          Serviços
        </Link>
        <Link href="/contato" className="text-sm font-medium hover:text-primary transition-colors">
          Contato
        </Link>
      </>
    )

    if (!isAuthenticated) {
      return baseLinks
    }

    switch (userData?.role) {
      case "PATIENT":
        return (
          <>
            {/* [MUDANÇA] Trocado <a> por <Link> */}
            <Link href="/visit/nurses-list" className="text-sm font-medium hover:text-primary transition-colors">
              Enfermeiros
            </Link>
            <Link href="/confirmed-visits" className="text-sm font-medium hover:text-primary transition-colors">
              Minhas Visitas
            </Link>
          </>
        )
      case "NURSE":
        return (
          <>
            <Link href="/dashboard/nurse" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/visit/all-visits-patient" className="text-sm font-medium hover:text-primary transition-colors">
              Visitas
            </Link>
          </>
        )
      case "ADMIN":
        return (
          <>
            {baseLinks}
            <Link href="/dashboard/admin" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/users-manegement" className="text-sm font-medium hover:text-primary transition-colors">
              Painel Administrativo
            </Link>
          </>
        )
      default:
        return baseLinks
    }
  }

  const avatarUrl = userData?.profile_image_id
    ? `${API_BASE_URL}/user/file/${userData.profile_image_id}`
    : undefined

  let profileUrl = "#"
  if (userData) {
    switch (userData.role) {
      case "PATIENT":
        profileUrl = `/patient/my-profile`
        break
      case "NURSE":
        profileUrl = `/nurse-profile/my-profile`
        break
      default:
        profileUrl = `/profile/${userData.id}`
        break
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center space-x-2">
          {/* [MUDANÇA] Trocado <a> por <Link> e <img> por <Image> */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Vita Logo" width={40} height={40} className="object-cover pl-2" />
            <span className="text-lg font-semibold hidden sm:block text-[#15803d]">Vita</span>
          </Link>
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* Notifications Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notificationsCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0
                         text-xs"
                      >
                        {notificationsCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Aqui você pode listar as notificações */}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-10 w-10">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt={userData?.name} />}
                      <AvatarFallback className="bg-[#15803d] text-white">
                        {userData ? getInitials(userData.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userData?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* [MUDANÇA] Usando 'asChild' para que o DropdownMenuItem passe suas propriedades para o Link */}
                  <DropdownMenuItem asChild>
                    <Link href={profileUrl} className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="cursor-pointer flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notificações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* [MUDANÇA] Trocado <a> por <Link> */}
              <Link href="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2 bg-[#15803d] hover:bg-[#166534]"
                  >
                    <UserPlus className="h-4 w-4" />
                    Cadastro
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 rounded-xl shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link href="/register-patient" className="w-full justify-start">
                      Paciente
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/register-nurse" className="w-full justify-start">
                      Enfermeiro(a)
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* MENU MOBILE */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-6 mt-8">
                {isAuthenticated && userData && (
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <Avatar className="h-10 w-10">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt={userData.name} />}
                      <AvatarFallback className="bg-[#15803d] text-white">{getInitials(userData.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{userData.name}</p>
                      <p className="text-xs text-muted-foreground">{userData.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <NavLinks />
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t">
                  {isAuthenticated ? (
                    <>
                      {/* [MUDANÇA] Trocado <a> por <Link> */}
                      <Link href={profileUrl}>
                        <Button variant="ghost" size="sm" className="justify-start w-full">
                          <User className="h-4 w-4 mr-2" />
                          Meu Perfil
                        </Button>
                      </Link>
                      <Link href="/notifications">
                        <Button variant="ghost" size="sm" className="justify-start w-full">
                          <Bell className="h-4 w-4 mr-2" />
                          Notificações
                          {notificationsCount > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {notificationsCount}
                            </Badge>
                          )}
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="outline" size="sm" className="justify-start w-full bg-transparent">
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/register-patient">
                        <Button variant="ghost" size="sm" className="justify-start w-full">
                          Cadastrar como Paciente
                        </Button>
                      </Link>
                      <Link href="/register-nurse">
                        <Button variant="ghost" size="sm" className="justify-start w-full">
                          Cadastrar como Enfermeiro(a)
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}