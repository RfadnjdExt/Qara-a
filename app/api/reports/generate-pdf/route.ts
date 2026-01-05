import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, institutionId } = await request.json();

    if (!userId || !institutionId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch user data
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch institution data
    const { data: institutionData } = await supabase
      .from("institutions")
      .select("*")
      .eq("id", institutionId)
      .single();

      // Fetch all evaluations
      const { data: evaluations } = await supabase
        .from("evaluations")
        .select("*, session:sessions(session_date), guru:users(full_name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      // Generate HTML content
      const htmlContent = generateHTMLReport(
        userData,
        institutionData,
        evaluations ?? []
      );


    // Return HTML that can be printed to PDF
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="evaluation-report-${userId}.html"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

function generateHTMLReport(
  userData: any,
  institutionData: any,
  evaluations: any[]
) {
  const stats = calculateStats(evaluations);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evaluation Report - ${userData.full_name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
    }
    
    .page {
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      padding: 20mm;
      background: white;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      page-break-after: always;
    }
    
    @media print {
      body { margin: 0; padding: 0; }
      .page { box-shadow: none; margin: 0; width: 100%; height: 100%; }
    }
    
    /* Header */
    .header {
      text-align: center;
      border-bottom: 3px solid #0066cc;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .institution-name {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 5px;
    }
    
    .institution-code {
      font-size: 12px;
      color: #666;
      margin-bottom: 15px;
    }
    
    .report-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    
    .report-date {
      font-size: 12px;
      color: #666;
    }
    
    /* Student Info */
    .student-info {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 30px;
      border-left: 4px solid #0066cc;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .info-item label {
      display: block;
      font-weight: bold;
      font-size: 12px;
      color: #666;
      margin-bottom: 3px;
    }
    
    .info-item value {
      display: block;
      font-size: 14px;
      color: #333;
    }
    
    /* Statistics */
    .statistics {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #ddd;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .stat-box {
      background: #f9f9f9;
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
      border-radius: 4px;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 11px;
      color: #666;
    }
    
    /* Evaluations Table */
    .evaluations-section {
      margin-top: 30px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    
    th {
      background: #0066cc;
      color: white;
      padding: 10px;
      text-align: left;
      font-size: 12px;
      font-weight: bold;
    }
    
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #ddd;
      font-size: 11px;
    }
    
    tr:nth-child(even) {
      background: #f9f9f9;
    }
    
    tr:hover {
      background: #f0f0f0;
    }
    
    .level-excellent {
      color: #22c55e;
      font-weight: bold;
    }
    
    .level-good {
      color: #3b82f6;
      font-weight: bold;
    }
    
    .level-fair {
      color: #f59e0b;
      font-weight: bold;
    }
    
    .level-poor {
      color: #ef4444;
      font-weight: bold;
    }
    
    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 10px;
      color: #666;
      text-align: center;
    }
    
    .summary-box {
      background: #f0f7ff;
      border: 1px solid #0066cc;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .summary-text {
      font-size: 12px;
      line-height: 1.6;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="institution-name">${
        institutionData?.name || "Tahfidz Institution"
      }</div>
      <div class="institution-code">${institutionData?.code || ""}</div>
      <div class="report-title">Mutabaah Evaluation Report</div>
      <div class="report-date">Generated on ${new Date().toLocaleDateString(
        "id-ID",
        { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      )}</div>
    </div>
    
    <!-- Student Information -->
    <div class="student-info">
      <div class="info-grid">
        <div class="info-item">
          <label>Student Name</label>
          <value>${userData.full_name}</value>
        </div>
        <div class="info-item">
          <label>Email</label>
          <value>${userData.email}</value>
        </div>
        <div class="info-item">
          <label>Phone</label>
          <value>${userData.phone || "—"}</value>
        </div>
        <div class="info-item">
          <label>Address</label>
          <value>${userData.address || "—"}</value>
        </div>
      </div>
    </div>
    
    <!-- Statistics Section -->
    <div class="statistics">
      <h2 class="section-title">Evaluation Summary</h2>
      
      <div class="summary-box">
        <div class="summary-text">
          <strong>Total Evaluations:</strong> ${
            stats.totalEvaluations
          } records from ${
    stats.dateRange ? new Date(stats.dateRange.start).toLocaleDateString() : "—"
  } to ${
    stats.dateRange ? new Date(stats.dateRange.end).toLocaleDateString() : "—"
  }
        </div>
      </div>
      
      <h3 class="section-title" style="font-size: 14px; margin-top: 20px;">Level Distribution</h3>
      <div class="stats-grid">
        <div class="stat-box">
          <div class="stat-value" style="color: #22c55e;">${
            stats.levels.hafal_sangat_lancar
          }</div>
          <div class="stat-label">Sangat Lancar</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color: #3b82f6;">${
            stats.levels.hafal_lancar
          }</div>
          <div class="stat-label">Lancar</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color: #f59e0b;">${
            stats.levels.hafal_tidak_lancar
          }</div>
          <div class="stat-label">Tidak Lancar</div>
        </div>
        <div class="stat-box">
          <div class="stat-value" style="color: #ef4444;">${
            stats.levels.belum_hafal
          }</div>
          <div class="stat-label">Belum Hafal</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${evaluations.length}</div>
          <div class="stat-label">Total</div>
        </div>
      </div>
    </div>
    
    <!-- Evaluations Table -->
    <div class="evaluations-section">
      <h2 class="section-title">Detailed Evaluations</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Teacher</th>
            <th>Hafalan</th>
            <th>Tajweed</th>
            <th>Tartil</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${evaluations
            .map(
              (evaluation) => `
            <tr>
              <td>${new Date(
                evaluation.session?.session_date
              ).toLocaleDateString()}</td>
              <td>${evaluation.guru?.full_name || "—"}</td>
              <td><span class="${getLevelClass(
                evaluation.hafalan_level
              )}">${formatLevel(evaluation.hafalan_level)}</span></td>
              <td><span class="${getLevelClass(
                evaluation.tajweed_level
              )}">${formatLevel(evaluation.tajweed_level)}</span></td>
              <td><span class="${getLevelClass(
                evaluation.tartil_level
              )}">${formatLevel(evaluation.tartil_level)}</span></td>
              <td>${
                evaluation.additional_notes
                  ? evaluation.additional_notes.substring(0, 30) + "..."
                  : "—"
              }</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>This is an official evaluation report from ${
        institutionData?.name || "Tahfidz Institution"
      }</p>
      <p style="margin-top: 10px;">For inquiries, please contact: ${
        institutionData?.email || "admin@institution.com"
      } | ${institutionData?.phone || ""}</p>
    </div>
  </div>
  
  <script>
    window.addEventListener('load', () => {
      window.print();
    });
  </script>
</body>
</html>
  `;
}

function calculateStats(evaluations: any[]) {
  if (evaluations.length === 0) {
    return {
      totalEvaluations: 0,
      levels: {
        belum_hafal: 0,
        hafal_tidak_lancar: 0,
        hafal_lancar: 0,
        hafal_sangat_lancar: 0,
      },
      dateRange: null,
    };
  }

  const levels = {
    belum_hafal: 0,
    hafal_tidak_lancar: 0,
    hafal_lancar: 0,
    hafal_sangat_lancar: 0,
  };

  evaluations.forEach((item) => {
    if (item.hafalan_level && levels.hasOwnProperty(item.hafalan_level)) {
      levels[item.hafalan_level as keyof typeof levels]++;
    }
  });

  return {
    totalEvaluations: evaluations.length,
    levels,
    dateRange: {
      start: evaluations[0]?.session?.session_date,
      end: evaluations[evaluations.length - 1]?.session?.session_date,
    },
  };
}

function getLevelClass(level: string): string {
  switch (level) {
    case "hafal_sangat_lancar":
      return "level-excellent";
    case "hafal_lancar":
      return "level-good";
    case "hafal_tidak_lancar":
      return "level-fair";
    case "belum_hafal":
      return "level-poor";
    default:
      return "";
  }
}

function formatLevel(level: string | null | undefined): string {
  if (!level) return "—";
  return level
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
