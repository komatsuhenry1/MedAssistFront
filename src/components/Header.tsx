"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        
        {/* ESQUERDA */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo MedAssist"
              width={40}        // ajuste conforme necessário
              height={40}
              className="cursor-pointer ml-3"
            />
          </Link>
        </div>

        {/* CENTRO */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Início
          </a>
          <a href="/sobre" className="text-sm font-medium hover:text-primary transition-colors">
            Sobre
          </a>
          <a href="/servicos" className="text-sm font-medium hover:text-primary transition-colors">
            Serviços
          </a>
          <a href="/contato" className="text-sm font-medium hover:text-primary transition-colors">
            Contato
          </a>
        </nav>

        {/* DIREITA */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Cadastro
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Link href="/register-patient">
                    <Button variant="ghost" size="sm">
                      Paciente
                    </Button>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link href="/register-nurse">
                    <Button variant="ghost" size="sm">
                      Enfermeiro(a)
                    </Button>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
