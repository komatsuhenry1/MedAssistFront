// type HeaderPropsType = {
//     loggedUser: string
// }

// // type name = string

// export default function Header({loggedUser} : HeaderPropsType) {


//     return(
//         <header>Header</header>
//     )
// }

import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">MeuProjeto</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Início
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Sobre
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Serviços
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Contato
          </a>
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            Entrar
          </Button>
          <Button size="sm">Cadastrar</Button>
        </div>
      </div>
    </header>
  )
}
