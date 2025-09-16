import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">MedAssist</h1>
        </div>

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

        <div className="flex items-center space-x-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>Cadastro</DropdownMenuTrigger>
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
        </div>
      </div>
    </header>
  )
}
