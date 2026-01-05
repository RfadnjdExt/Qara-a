import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const testAccounts = [
  { email: "admin@tahfidz.test", password: "Admin123456!", role: "admin" },
  { email: "guru@tahfidz.test", password: "Guru123456!", role: "guru" },
  { email: "murid1@tahfidz.test", password: "Murid123456!", role: "murid" },
  { email: "murid2@tahfidz.test", password: "Murid123456!", role: "murid" },
  { email: "murid3@tahfidz.test", password: "Murid123456!", role: "murid" },
]

async function setupAccounts() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log("🚀 Creating test accounts in Supabase Auth...")

  for (const account of testAccounts) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
      })

      if (error) {
        console.log(`⚠️  ${account.email}: ${error.message}`)
      } else {
        console.log(`✅ Created: ${account.email}`)
      }
    } catch (err) {
      console.error(`❌ Error creating ${account.email}:`, err)
    }
  }

  console.log("\n✨ Setup complete! You can now login with the test credentials.")
}

setupAccounts()
