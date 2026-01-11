import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Kesalahan Otentikasi</h1>
        <p className="text-gray-600 mb-6">Terjadi masalah saat otentikasi Anda.</p>
        <Link href="/auth/login">
          <Button>Kembali ke Masuk</Button>
        </Link>
      </div>
    </div>
  )
}
