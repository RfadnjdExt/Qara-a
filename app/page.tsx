import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Users, BarChart3, Shield, Zap, Lock } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (user) {
    // Fetch user role to redirect appropriately
    const { data: userData, error: dbError } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (dbError) {
      console.log("[HomePage] DB Error:", dbError.message);
    }

    if (userData) {
      const redirectMap: Record<string, string> = {
        admin: "/admin/dashboard",
        guru: "/guru/dashboard",
        murid: "/murid/dashboard",
      }
      redirect(redirectMap[userData.role] || "/auth/login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Mutabaah Online</div>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-balance mb-6">
          Professional Learning Management for Tahfidz Institutions
        </h1>
        <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
          Streamline student evaluations, track progress, and generate official reports with Mutabaah Online—the modern
          solution for Qur'an memorization programs.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-border/50">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Student Evaluations</CardTitle>
              <CardDescription>Record daily Mutabaah evaluations with detailed feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track Tajweed, Hafalan, and Tartil levels with customizable templates
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Multi-Role Support</CardTitle>
              <CardDescription>Admin, Teachers, and Student portals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Role-based access control with tailored dashboards for each user type
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Progress Analytics</CardTitle>
              <CardDescription>Visualize student performance trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate reports and track improvement over time with detailed statistics
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <Shield className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>Enterprise-grade security</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Database-backed with row-level security and encrypted authentication
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <Zap className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Fast & Responsive</CardTitle>
              <CardDescription>Built with modern technology</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lightning-fast performance optimized for desktop and mobile devices
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <Lock className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Data Privacy</CardTitle>
              <CardDescription>Your data is protected</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All data stored securely with institutional-level access controls
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-primary/5 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your institution?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Start using Mutabaah Online today and streamline your educational operations.
          </p>
          <Link href="/auth/login">
            <Button size="lg">Login to Your Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Mutabaah Online. All rights reserved.</p>
          <p className="mt-2">Professional Learning Management System for Tahfidz Institutions</p>
        </div>
      </footer>
    </div>
  )
}
