
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fixName() {
    console.log("📝 Setting Murid Name...")
    const { error } = await supabase
        .from("users")
        .update({ full_name: "Ahmad Santri" })
        .eq("email", "murid1@tahfidz.test")

    if (error) console.error("Error:", error.message)
    else console.log("✅ Name updated to 'Ahmad Santri'")
}

fixName()
