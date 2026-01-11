
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

async function seedAttendance() {
    console.log("🌱 Seeding Attendance Data (Evaluations)...")

    // 1. Get Guru
    const { data: guru } = await supabase.from("users").select("id").eq("email", "guru@tahfidz.test").single()
    if (!guru) { throw new Error("Guru not found"); }
    const guruId = guru.id

    // 2. Get Classes
    const { data: classes } = await supabase.from("classes").select("id, name").eq("guru_id", guruId)
    if (!classes || classes.length === 0) { console.log("No classes found"); return; }

    console.log(`Found ${classes.length} classes for Guru.`)

    for (const cls of classes) {
        console.log(`\nProcessing Class: ${cls.name}`)

        // 3. Get Sessions
        const { data: sessions } = await supabase.from("sessions").select("id, session_date").eq("class_id", cls.id)
        if (!sessions || sessions.length === 0) { console.log("  No sessions found."); continue; }

        // 4. Get Enrolled Students
        const { data: enrollments } = await supabase.from("class_enrollments").select("user_id").eq("class_id", cls.id)
        const studentIds = enrollments?.map(e => e.user_id) || []

        if (studentIds.length === 0) { console.log("  No students enrolled."); continue; }

        console.log(`  Found ${sessions.length} sessions and ${studentIds.length} students.`)

        let addedCount = 0;

        for (const session of sessions) {
            // Check existing evals
            const { count } = await supabase.from("evaluations").select("*", { count: 'exact', head: true }).eq("session_id", session.id)

            if (count && count > 0) {
                console.log(`  Session ${session.session_date} already has ${count} evaluations. Skipping.`)
                continue
            }

            // Simulate attendance (random 70-100% of students present)
            const presentStudents = studentIds.filter(() => Math.random() > 0.2) // ~80% attendance

            const evals = presentStudents.map(studentId => ({
                user_id: studentId,
                evaluator_id: guruId,
                session_id: session.id,
                hafalan_level: ['hafal_lancar', 'hafal_sangat_lancar', 'hafal_tidak_lancar'][Math.floor(Math.random() * 3)],
                tajweed_level: ['baik', 'sangat_baik', 'cukup'][Math.floor(Math.random() * 3)],
                additional_notes: Math.random() > 0.5 ? "Makhraj perlu diperbaiki" : "Bagus, pertahankan"
            }))

            if (evals.length > 0) {
                const { error } = await supabase.from("evaluations").insert(evals)
                if (error) console.error("Error inserting evals:", error.message)
                else addedCount += evals.length
            }
        }
        console.log(`  ✅ Added ${addedCount} evaluations to class.`)
    }
    console.log("\n✅ Seeding Complete!")
}

seedAttendance()
