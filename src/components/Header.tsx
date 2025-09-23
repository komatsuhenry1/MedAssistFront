"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, User, UserPlus } from "lucide-react"

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) setIsAuthenticated(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    window.location.href = "/"
  }

  const NavLinks = () => (
    <>
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

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Logo MedAssist"
              width={40}
              height={40}
              className="cursor-pointer"
            />
            <span className="text-lg font-semibold hidden sm:block">MedAssist</span>
          </Link>
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks />
        </nav>

        {/* AÇÕES */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Cadastro
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 rounded-xl shadow-lg">
                  <Link href="/register-patient">
                    <Button className="w-full justify-start" variant="ghost">
                      Paciente
                    </Button>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link href="/register-nurse">
                    <Button className="w-full justify-start" variant="ghost">
                      Enfermeiro(a)
                    </Button>
                  </Link>
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
                <NavLinks />
                <div className="flex flex-col gap-2">
                  {isAuthenticated ? (
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="outline" size="sm" className="justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/register-patient">
                        <Button variant="ghost" size="sm" className="justify-start">
                          Paciente
                        </Button>
                      </Link>
                      <Link href="/register-nurse">
                        <Button variant="ghost" size="sm" className="justify-start">
                          Enfermeiro(a)
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
