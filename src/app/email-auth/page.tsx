import { EmailAuthForm } from "@/components/email-auth-form"
export default function EmailAuthPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <EmailAuthForm />
      </div>
    </div>
  )
}