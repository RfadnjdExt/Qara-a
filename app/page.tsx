import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  BookOpen,
  BarChart3,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Globe
} from "lucide-react"
import { FeatureChart, FastRecordingMock } from "@/components/landing-page-visuals"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let dashboardUrl = "/auth/login";
  if (user) {
    const { data: userData, error: dbError } = await supabase.from("users").select("role").eq("id", user.id).single()
    if (userData) {
      const redirectMap: Record<string, string> = {
        admin: "/admin/dashboard",
        guru: "/guru/dashboard",
        murid: "/murid/dashboard",
        orang_tua: "/orang_tua/dashboard",
      }
      dashboardUrl = redirectMap[userData.role] || "/auth/login";
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
            <BookOpen className="h-6 w-6" />
            <span>Mutabaah<span className="text-foreground">Online</span></span>
          </div>
          <div className="flex gap-4">
            {user ? (
              <Link href={dashboardUrl}>
                <Button>Ke Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="font-medium">Masuk</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="font-medium">Daftar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="container relative z-10 text-center px-4 md:px-6 lg:px-8">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            v2.0 kini tersedia
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance bg-clip-text text-transparent bg-linear-to-r from-primary via-purple-500 to-indigo-600 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both delay-100">
            Kelola Institusi <br /> Pendidikan Islam Anda
          </h1>
          <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-10 text-balance animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
            Platform all-in-one untuk lembaga Tahfidz modern. Pantau hafalan, kelola santri, dan buat rapor dengan mudah.
          </p>
          <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300">
            {!user && (
              <Link href="/auth/login">
                <Button size="lg" className="h-12 px-8 text-base">Coba Gratis <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
            )}
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">Lihat Demo</Button>
            </Link>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[100px] rounded-full -z-10 opacity-20 pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="border-y bg-secondary/30">
        <div className="container py-12 px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Santri Aktif", value: "2,500+" },
              { label: "Ayat Dihafal", value: "150rb+" },
              { label: "Institusi", value: "50+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-background">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Semua yang Anda butuhkan</h2>
            <p className="text-lg text-muted-foreground">
              Fitur canggih yang dirancang khusus untuk rumah tahfidz dan sekolah Islam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 bg-linear-to-br from-background to-secondary/20 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Analitik Mendalam</CardTitle>
                <CardDescription className="text-base">
                  Visualisasikan kemajuan santri dengan grafik detail. Pantau kecepatan hafalan, tingkat kehadiran, dan identifikasi santri yang butuh perhatian khusus lebih awal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeatureChart />
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>Pencatatan Cepat</CardTitle>
                <CardDescription>
                  Input setoran hafalan dan murajaah dalam hitungan detik. Dioptimalkan untuk penggunaan mobile oleh asatidz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FastRecordingMock />
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle>Portal Wali Santri</CardTitle>
                <CardDescription>
                  Berikan akses real-time kepada orang tua untuk memantau perkembangan anak. Kirim notifikasi WhatsApp otomatis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="md:col-span-2 bg-background border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle>Keamanan Berbasis Peran</CardTitle>
                <CardDescription>
                  Kontrol akses granular untuk Admin, Kepala Sekolah, Guru, dan Wali Santri.
                  Data Anda terenkripsi dan dicadangkan setiap hari.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 bg-secondary/20">
        <div className="container text-center px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12">Pilihan Paket Fleksibel</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Pemula", price: "Gratis", desc: "Untuk halaqah kecil" },
              { name: "Institusi", price: "Rp 500rb", desc: "Untuk sekolah berkembang", highlight: true },
              { name: "Jaringan", price: "Custom", desc: "Untuk organisasi besar" }
            ].map((plan, i) => (
              <Card key={i} className={`relative flex flex-col ${plan.highlight ? 'border-primary shadow-lg scale-105 z-10' : 'border-border'}`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    PALING LARIS
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold mt-2">{plan.price}<span className="text-sm font-normal text-muted-foreground">/bln</span></div>
                  <CardDescription>{plan.desc}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3 text-sm text-left">
                    {["Santri Tanpa Batas", "Laporan Dasar", "Akses Aplikasi Mobile"].map((feat, j) => (
                      <li key={j} className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full" variant={plan.highlight ? 'default' : 'outline'}>Pilih Paket</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t mt-auto bg-background">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-6 lg:px-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl mb-4">
              <BookOpen className="h-5 w-5" />
              <span>Mutabaah Online</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Membantu institusi mencetak generasi penghafal Al-Qur'an dengan teknologi modern dan desain elegan.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produk</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Fitur</Link></li>
              <li><Link href="#" className="hover:text-primary">Harga</Link></li>
              <li><Link href="#" className="hover:text-primary">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Tentang</Link></li>
              <li><Link href="#" className="hover:text-primary">Kontak</Link></li>
              <li><Link href="#" className="hover:text-primary">Privasi</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t text-center text-sm text-muted-foreground px-4 md:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} Mutabaah Online. Hak cipta dilindungi.
        </div>
      </footer>
    </div>
  )
}
