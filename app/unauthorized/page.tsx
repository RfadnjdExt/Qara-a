import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <Link href="/auth/login">
          <Button>Back to Login</Button>
        </Link>
      </div>
    </div>
  )
}
