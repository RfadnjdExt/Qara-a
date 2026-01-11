
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing environment variables")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetEvaluations() {
    console.log("🗑️ Deleting all evaluations...")

    const { error } = await supabase
        .from("evaluations")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all (hack to match all)

    if (error) {
        console.error("❌ Failed to delete evaluations:", error)
    } else {
        console.log("✅ All evaluations deleted. Sessions should now be empty.")
    }
}

resetEvaluations()
