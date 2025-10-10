// app/auth/reset-password/page.tsx

"use client"

import type React from "react"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { KeyRound, ShieldAlert, Loader2 } from "lucide-react"

// Componente principal que usa Suspense para aguardar os parâmetros da URL
export default function ResetPasswordPageWrapper() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ResetPasswordPage />
        </Suspense>
    )
}

// Componente que lida com a lógica da página
function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [token, setToken] = useState<string | null>(null)
    const [isTokenValid, setIsTokenValid] = useState(false)
    const [isLoading, setIsLoading] = useState(true) // Começa como true para validar o token
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token")
        if (!tokenFromUrl) {
            toast.error("Token não encontrado. Link inválido.")
            setIsLoading(false)
            return
        }

        setToken(tokenFromUrl)

        const validateToken = async () => {
            try {
                // Você precisa criar este endpoint no seu backend!
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate-token`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: tokenFromUrl }),
                })

                if (response.ok) {
                    setIsTokenValid(true)
                } else {
                    const data = await response.json()
                    toast.error(data.message || "Token inválido ou expirado.")
                    setIsTokenValid(false)
                }
            } catch (error) {
                toast.error("Erro ao validar o token. Tente novamente.")
                setIsTokenValid(false)
            } finally {
                setIsLoading(false)
            }
        }

        validateToken()
    }, [searchParams])

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem.")
            return
        }
        if (password.length < 6) {
            toast.error("A senha deve ter no mínimo 6 caracteres.")
            return
        }

        setIsLoading(true)
        try {
            // Endpoint para efetivamente alterar a senha
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Senha alterada com sucesso!")
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                router.push("/login")
            } else {
                toast.error(data.message || "Não foi possível alterar a senha.")
            }
        } catch (error) {
            toast.error("Ocorreu um erro. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <KeyRound className="h-12 w-12 text-[#15803d]" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
                    <CardDescription>
                        {isTokenValid ? "Crie uma nova senha para sua conta." : "O link utilizado é inválido ou expirou."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isTokenValid ? (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Nova Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-[#15803d] hover:bg-[#166534]" disabled={isLoading}>
                                {isLoading ? "Salvando..." : "Salvar nova senha"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-2" />
                            <p className="text-sm text-red-700">
                                Por favor, solicite um novo link de redefinição de senha.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Componente de loading para uma melhor experiência do usuário
function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#15803d]" />
        </div>
    )
}