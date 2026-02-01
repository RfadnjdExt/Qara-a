import { getCurrentUserWithRole } from "@/lib/auth-utils"
import { ProgressTracker } from "@/components/guru/progress-tracker"

export default async function GuruProgressPage() {
    const { userData } = await getCurrentUserWithRole()

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Progres Hafalan</h1>
                <p className="text-muted-foreground">Analisis capaian dan perkembangan hafalan seluruh santri</p>
            </div>

            <ProgressTracker guruId={userData.id} />
        </div>
    )
}
