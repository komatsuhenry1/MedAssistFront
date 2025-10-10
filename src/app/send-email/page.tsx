"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const router = useRouter()

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Por favor, insira seu email.")
            return
        }
e
        setIsLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setEmailSent(true)
                toast.success(data.message || "Verifique sua caixa de entrada para redefinir sua senha.")
            } else {
                toast.error(data.message || "Não foi possível enviar o email. Tente novamente.")
            }
        } catch (error) {
            console.error("Error sending email:", error)
            toast.error("Erro ao enviar email. Verifique sua conexão.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Esqueceu sua senha?</CardTitle>
                    <CardDescription>
                        {emailSent ? "Email enviado com sucesso!" : "Digite seu email para receber o link de redefinição"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!emailSent ? (
                        <form onSubmit={handleSendEmail} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-[#15803d] hover:bg-[#166534]" disabled={isLoading}>
                                {isLoading ? "Enviando..." : "Enviar link de redefinição"}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-sm text-[#15803d] hover:underline inline-flex items-center gap-1"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Voltar para login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <Mail className="h-12 w-12 text-[#15803d] mx-auto mb-2" />
                                <p className="text-sm text-gray-700">
                                    Enviamos um email para <strong>{email}</strong> com instruções para redefinir sua senha.
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Não recebeu o email? Verifique sua caixa de spam.</p>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() => {
                                    setEmailSent(false)
                                    setEmail("")
                                }}
                            >
                                Enviar para outro email
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-sm text-[#15803d] hover:underline inline-flex items-center gap-1"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Voltar para login
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}