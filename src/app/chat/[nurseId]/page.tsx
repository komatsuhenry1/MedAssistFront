"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Loader2 } from "lucide-react"

// Definimos as URLs base para a API HTTP e para o WebSocket
// Isso torna o código mais claro e fácil de manter.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL // <-- CORRIGIDO

// Interface para a estrutura de uma mensagem
interface Message {
    id: string
    sender_id: string
    sender_name: string
    sender_role: "PATIENT" | "NURSE"
    message: string
    timestamp: string
    read: boolean
}

// Interface para a estrutura do Enfermeiro(a)
interface Nurse {
    id: string
    name: string
    specialization: string
    image?: string
    available: boolean
}

// Interface para a estrutura do Usuário
interface User {
    id: string
    name: string
}

export default function ChatPage() {
    const params = useParams()
    const router = useRouter()
    const nurseId = params.nurseId as string

    // --- Estados do Componente ---
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [nurse, setNurse] = useState<Nurse | null>(null)
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    // --- Referências ---
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const socketRef = useRef<WebSocket | null>(null)

    // Função para rolar para a última mensagem
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Efeito para rolar para o final sempre que a lista de mensagens mudar
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Efeito para carregar os dados do usuário do localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    // Efeito para buscar os dados iniciais (histórico de mensagens e dados do enfermeiro)
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const headers = { Authorization: `Bearer ${token}` }

                // Busca informações do enfermeiro(a)
                const nurseResponse = await fetch(`${API_BASE_URL}/user/nurse/${nurseId}`, { headers, cache: "no-store" })
                if (nurseResponse.ok) {
                    const nurseResult = await nurseResponse.json()
                    if (nurseResult.success && nurseResult.data) {
                        setNurse(nurseResult.data)
                    }
                }

                // Busca o histórico de mensagens
                const messagesResponse = await fetch(`${API_BASE_URL}/chat/messages/${nurseId}`, { headers, cache: "no-store" })
                if (messagesResponse.ok) {
                    const messagesResult = await messagesResponse.json()
                    if (messagesResult.success && messagesResult.data) {
                        setMessages(messagesResult.data)
                    }
                }
            } catch (error) {
                console.error("Error fetching initial chat data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchInitialData()
    }, [nurseId, router])

    // Efeito principal para gerenciar a conexão WebSocket
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
    
        const socket = new WebSocket(`${WS_BASE_URL}/ws/chat?token=${token}`);
        socketRef.current = socket

        socket.onopen = () => console.log("WebSocket: Conexão estabelecida.")
        socket.onclose = () => console.log("WebSocket: Conexão encerrada.")
        socket.onerror = (error) => console.error("WebSocket: Erro detectado:", error)

        socket.onmessage = (event) => {
            const receivedMessage: Message = JSON.parse(event.data)
            setMessages((prevMessages) => [...prevMessages, receivedMessage])
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close()
            }
        }
    }, [])

    // Função para enviar uma nova mensagem
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return
        }

        setSending(true)

        const messagePayload = {
            receiver_id: nurseId,
            message: newMessage.trim(),
        }

        socketRef.current.send(JSON.stringify(messagePayload))
        setNewMessage("")
        setSending(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Funções de formatação de data e hora
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return "Hoje"
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Ontem"
        } else {
            return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
        }
    }

    // Agrupamento de mensagens por data
    const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
        const date = formatDate(message.timestamp)
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(message)
        return groups
    }, {})

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const avatarUrl = nurse?.image ? `${API_BASE_URL}/user/file/${nurse.image}` : undefined

    return (
        <div className="flex flex-col h-screen bg-muted/30">
            {/* Header */}
            <Card className="rounded-none border-x-0 border-t-0">
                <CardHeader className="flex flex-row items-center gap-4 py-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={nurse?.name} />
                                <AvatarFallback>{nurse?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {nurse?.available && (
                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h2 className="font-semibold text-lg truncate">{nurse?.name}</h2>
                            <p className="text-sm text-muted-foreground truncate">{nurse?.specialization}</p>
                        </div>

                        {nurse?.available && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Online
                            </Badge>
                        )}
                    </div>
                </CardHeader>
            </Card>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                    <div key={date} className="space-y-4">
                        <div className="flex items-center justify-center">
                            <Badge variant="secondary" className="text-xs">
                                {date}
                            </Badge>
                        </div>

                        {dateMessages.map((message) => {
                            const isOwnMessage = message.sender_role === "PATIENT"

                            return (
                                <div key={message.id} className={`flex gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                    {!isOwnMessage && (
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={message.sender_name} />
                                            <AvatarFallback>{message.sender_name?.charAt(0) || '?'}</AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwnMessage ? "bg-primary text-primary-foreground" : "bg-card border"
                                            }`}
                                    >
                                        {!isOwnMessage && (
                                            <p className="text-xs font-medium mb-1 text-muted-foreground">{message.sender_name}</p>
                                        )}
                                        <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                                        <p
                                            className={`text-xs mt-1 ${isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                                                }`}
                                        >
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>

                                    {isOwnMessage && (
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarFallback>{user?.name?.charAt(0) || 'V'}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}

                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-muted-foreground mb-2">
                            <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Nenhuma mensagem ainda</p>
                            <p className="text-sm">Envie uma mensagem para iniciar a conversa</p>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <Card className="rounded-none border-x-0 border-b-0">
                <CardContent className="p-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Digite sua mensagem..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={sending}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || sending}
                            size="icon"
                            className="shrink-0"
                        >
                            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}