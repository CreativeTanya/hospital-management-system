import { useState } from "react";
import {
  Bot,
  FileText,
  Upload,
  Sparkles,
  Copy,
  RotateCcw,
  AlertCircle,
  Pill,
  CheckCircle2,
  Activity,
} from "lucide-react";

const reportExamples = {
  CBC: {
    title: "Complete Blood Count (CBC)",
    summary:
      "The sample CBC report shows a low hemoglobin level while the displayed white blood cell and platelet values are within the typical adult reference ranges.",
    findings: [
      {
        name: "Hemoglobin",
        value: "10.2 g/dL",
        status: "Needs Attention",
        explanation:
          "Hemoglobin is a protein in red blood cells that carries oxygen throughout the body. The displayed value is below the typical adult range.",
      },
      {
        name: "WBC",
        value: "7,200 /µL",
        status: "Within Range",
        explanation:
          "White blood cells help the body fight infections. The displayed value is within a typical adult reference range.",
      },
      {
        name: "Platelets",
        value: "2.4 lakh /µL",
        status: "Within Range",
        explanation:
          "Platelets help blood clot properly. The displayed value is within a typical reference range.",
      },
    ],
    medicine:
      "A low hemoglobin result can have several causes. Treatment depends on the underlying cause, so medicines or supplements should only be taken when recommended by a healthcare professional.",
  },

  "Blood Sugar": {
    title: "Blood Sugar Report",
    summary:
      "The sample report shows a fasting blood glucose value that is slightly above the commonly used normal fasting range. This result should be interpreted together with the patient's medical history and other tests.",
    findings: [
      {
        name: "Fasting Glucose",
        value: "118 mg/dL",
        status: "Needs Attention",
        explanation:
          "Fasting glucose measures blood sugar after not eating for a specified period. The displayed value is above the commonly used normal fasting range.",
      },
      {
        name: "HbA1c",
        value: "5.9%",
        status: "Needs Monitoring",
        explanation:
          "HbA1c gives an estimate of average blood glucose over the previous few months. The displayed value may require monitoring.",
      },
    ],
    medicine:
      "Blood sugar management depends on the individual's condition. Do not start or change diabetes medication based only on this demonstration.",
  },

  "Lipid Profile": {
    title: "Lipid Profile",
    summary:
      "The sample lipid profile shows cholesterol measurements that may benefit from lifestyle monitoring and discussion with a healthcare professional.",
    findings: [
      {
        name: "Total Cholesterol",
        value: "218 mg/dL",
        status: "Needs Attention",
        explanation:
          "Total cholesterol represents the overall amount of cholesterol in the blood. The displayed value is above the commonly used desirable level.",
      },
      {
        name: "LDL",
        value: "142 mg/dL",
        status: "Needs Attention",
        explanation:
          "LDL is commonly known as 'bad cholesterol'. Higher levels can be associated with increased cardiovascular risk.",
      },
      {
        name: "HDL",
        value: "52 mg/dL",
        status: "Within Range",
        explanation:
          "HDL is commonly known as 'good cholesterol' because it helps transport cholesterol away from the arteries.",
      },
    ],
    medicine:
      "Cholesterol treatment depends on overall cardiovascular risk and medical history. Medication decisions should be made by a healthcare professional.",
  },
};

function AIReportAssistant() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportType, setReportType] = useState("CBC");
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setAnalyzed(false);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
  if (!selectedFile) {
    alert("Please select a medical report first.");
    return;
  }

  setAnalyzing(true);

  try {
    const formData = new FormData();

    formData.append("report", selectedFile);

   const response = await fetch("http://localhost:5000/api/ai-report/analyze", {
  method: "POST",
  body: formData,
});

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to analyze report.");
    }

   console.log("Extracted report text:", data.extractedText);


const text = data.report?.extractedText;

if (!text) {
  throw new Error("No readable text was extracted from the report.");
}
const lines = text
  .split(/\n+/)
  .map((line) => line.trim())
  .filter(Boolean);

// Remove repeated PDF metadata/noise
const usefulLines = lines.filter((line) => {
  const lower = line.toLowerCase();

  return !(
    lower.includes("scan to download") ||
    lower.includes("page 1 of") ||
    lower.includes("page 2 of") ||
    lower.includes("end of report") ||
    lower.includes("dmlt") ||
    lower.includes("lab incharge") ||
    lower.includes("pathologist") ||
    lower.includes("registered on") ||
    lower.includes("collected on") ||
    lower.includes("received on") ||
    lower.includes("reported on") ||
    lower.includes("reg. no.")
  );
});

const reportText = usefulLines.join("\n");

// Try to identify the report title
let reportTitle = reportType;

if (/complete blood count|cbc/i.test(reportText)) {
  reportTitle = "Complete Blood Count (CBC)";
} else if (/blood sugar|glucose|hba1c/i.test(reportText)) {
  reportTitle = "Blood Sugar Report";
} else if (/lipid profile|cholesterol|triglycerides/i.test(reportText)) {
  reportTitle = "Lipid Profile";
}

// Extract patient information
const patientMatch = reportText.match(
  /(?:Mr\.|Mrs\.|Ms\.)\s+([A-Za-z ]+?)\s+Age\s*\/\s*Sex\s*:\s*(\d+)\s*YRS\s*\/\s*([A-Za-z]+)/i
);

const patientName = patientMatch
  ? patientMatch[1].trim()
  : "Patient information not available";

const patientAgeSex = patientMatch
  ? `${patientMatch[2]} years / ${patientMatch[3]}`
  : "Not available";

// Extract clinical notes
const clinicalMatch = reportText.match(
  /Clinical Notes:\s*([\s\S]*?)(?=Possible causes of abnormal parameters:|$)/i
);

const clinicalNotes = clinicalMatch
  ? clinicalMatch[1].trim()
  : "No clinical notes were provided in the report.";

// Extract test lines
const findings = [];

const testPatterns = [
  {
    regex: /HEMOGLOBIN\s+([\d.]+)\s*g\/?dl\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "Hemoglobin",
  },
  {
    regex: /TOTAL LEUKOCYTE COUNT\s+([\d,]+)\s*cumm\s+([\d,]+)\s*-\s*([\d,]+)/i,
    name: "Total Leukocyte Count",
  },
  {
    regex: /NEUTROPHILS\s+([\d.]+)\s*%\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "Neutrophils",
  },
  {
    regex: /LYMPHOCYTE\s+L\s+([\d.]+)\s*%\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "Lymphocytes",
  },
  {
    regex: /EOSINOPHILS\s+([\d.]+)\s*%\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "Eosinophils",
  },
  {
    regex: /MONOCYTES\s+L\s+([\d.]+)\s*%\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "Monocytes",
  },
  {
    regex: /BASOPHILS\s+([\d.]+)\s*%\s+<\s*([\d.]+)/i,
    name: "Basophils",
  },
  {
    regex: /PLATELET COUNT\s+([\d.]+)\s*lakhs\/cumm\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "Platelet Count",
  },
  {
    regex: /TOTAL RBC COUNT\s+([\d.]+)\s*million\/cumm\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "RBC Count",
  },
  {
    regex: /HEMATOCRIT VALUE,\s*HCT\s+([\d.]+)\s*%\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "Hematocrit (HCT)",
  },
  {
    regex: /MEAN CORPUSCULAR VOLUME,\s*MCV\s+([\d.]+)\s*fL\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "MCV",
  },
  {
    regex: /MEAN CELL HAEMOGLOBIN,\s*MCH\s+([\d.]+)\s*Pg\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "MCH",
  },
  {
    regex: /MEAN CELL HAEMOGLOBIN CON,\s*MCHC\s+H\s+([\d.]+)\s*%\s+([\d.]+)\s*-\s*([\d.]+)/i,
    name: "MCHC",
  },
];

testPatterns.forEach((test) => {
  const match = reportText.match(test.regex);

  if (!match) return;

  const value = parseFloat(match[1]);
  const low = parseFloat(match[2]);

  // Basophils uses "< 2" instead of a normal low-high range
  let high = test.name === "Basophils"
    ? parseFloat(match[2])
    : parseFloat(match[3]);

  let status = "Within Range";

  if (test.name === "Basophils") {
    if (value >= high) {
      status = "Needs Attention";
    }
  } else {
    if (value < low || value > high) {
      status = "Needs Attention";
    }
  }

  let explanation = "";

  switch (test.name) {
    case "Hemoglobin":
      explanation =
        "Hemoglobin is a protein in red blood cells that carries oxygen around the body. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the laboratory's stated range.";
      break;

    case "Total Leukocyte Count":
      explanation =
        "White blood cells help your body fight infections. Your total white blood cell count is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the laboratory's stated range.";
      break;

    case "Neutrophils":
      explanation =
        "Neutrophils are white blood cells that help the body respond to infections and inflammation. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the stated range.";
      break;

    case "Lymphocytes":
      explanation =
        "Lymphocytes are white blood cells involved in your immune system. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the laboratory's stated range.";
      break;

    case "Eosinophils":
      explanation =
        "Eosinophils are white blood cells involved in immune responses. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the stated range.";
      break;

    case "Monocytes":
      explanation =
        "Monocytes are white blood cells that help remove germs and damaged cells. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the laboratory's stated range.";
      break;

    case "Basophils":
      explanation =
        "Basophils are a type of white blood cell involved in immune and allergic responses. Your result is " +
        (status === "Within Range"
          ? "within"
          : "at or above") +
        " the laboratory's stated limit.";
      break;

    case "Platelet Count":
      explanation =
        "Platelets help your blood form clots when you have an injury. Your platelet count is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the stated range.";
      break;

    case "RBC Count":
      explanation =
        "Red blood cells carry oxygen from your lungs to the rest of your body. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the stated range.";
      break;

    case "Hematocrit (HCT)":
      explanation =
        "Hematocrit shows how much of your blood is made up of red blood cells. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the stated range.";
      break;

    case "MCV":
      explanation =
        "MCV describes the average size of your red blood cells. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the stated range.";
      break;

    case "MCH":
      explanation =
        "MCH describes the average amount of hemoglobin inside each red blood cell. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the stated range.";
      break;

    case "MCHC":
      explanation =
        "MCHC describes the concentration of hemoglobin inside your red blood cells. Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the laboratory's stated range.";
      break;

    default:
      explanation =
        "Your result is " +
        (status === "Within Range"
          ? "within"
          : "outside") +
        " the reference range provided by the laboratory.";
  }

  findings.push({
    name: test.name,
    value: match[1],
    status,
    explanation,
  });
});

// Build a readable summary
const abnormalFindings = findings.filter(
  (finding) => finding.status !== "Within Range"
);

let summary;

if (abnormalFindings.length === 0) {
  summary =
    "The available test values are within the reference ranges provided by the laboratory.";
} else {
  const names = abnormalFindings
    .map((finding) => finding.name)
    .join(", ");

  summary =
    `Most of the available results are within the laboratory's reference ranges. ` +
    `The following value(s) are outside the provided ranges: ${names}. ` +
    `These results should be interpreted together with the patient's symptoms and medical history.`;
}

setAnalysis({
  title: reportTitle,
  patientName,
  patientAgeSex,
  summary,
  findings,
  medicine:
    "The report alone does not determine which medicine is appropriate. Treatment depends on the underlying cause, symptoms, medical history, and clinical evaluation.",
  clinicalNotes,
});

setAnalyzed(true);

alert("Report analyzed successfully.");
  } catch (error) {
    console.error("Report analysis error:", error);

    alert(error.message || "Something went wrong.");
  } finally {
    setAnalyzing(false);
  }
};

  const handleCopy = () => {
    if (!analysis) return;

    const findingsText = analysis.findings
      .map(
        (finding) =>
          `${finding.name}: ${finding.value} - ${finding.status}\n${finding.explanation}`
      )
      .join("\n\n");

    const summary = `
${analysis.title}

Overall Summary:
${analysis.summary}

Important Findings:
${findingsText}

Medicine Information:
${analysis.medicine}

Disclaimer:
This is an educational demonstration and does not provide diagnosis or replace professional medical advice.
`;

    navigator.clipboard.writeText(summary);

    alert("Summary copied.");
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalyzed(false);
    setAnalyzing(false);
    setAnalysis(null);
    setReportType("CBC");
  };

  return (
    <div className="page-content">

      {/* Header */}

      <div className="page-header">

        <div>
          <p className="page-eyebrow">
            AI & TOOLS
          </p>

          <h2>
            AI Report Assistant
          </h2>

          <p className="page-description">
            Understand medical reports in simple language.
          </p>
        </div>

        <div className="ai-page-icon">
          <Bot size={26} />
        </div>

      </div>

      {/* Main Content */}

      <div className="ai-report-layout">

        {/* Upload Card */}

        <div className="patient-table-card ai-upload-card">

          <div className="ai-section-header">

            <div className="ai-small-icon">
              <FileText size={20} />
            </div>

            <div>
              <h3>
                Analyze Medical Report
              </h3>

              <p>
                Select a report type and upload a sample report.
              </p>
            </div>

          </div>

          {/* Report Type */}

          <div className="form-group">
            <label>
              Report Type
            </label>

            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setAnalyzed(false);
                setAnalysis(null);
              }}
            >
              <option value="CBC">
                Complete Blood Count (CBC)
              </option>

              <option value="Blood Sugar">
                Blood Sugar
              </option>

              <option value="Lipid Profile">
                Lipid Profile
              </option>
            </select>
          </div>

          {/* Upload */}

          <label className="ai-upload-area">

            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
            />

            <div className="ai-upload-icon">
              <Upload size={28} />
            </div>

            <strong>
              {selectedFile
                ? selectedFile.name
                : "Choose a medical report"}
            </strong>

            <span>
              PDF, JPG, PNG or TXT
            </span>

          </label>

          {selectedFile && (

            <div className="selected-file">

              <div>
                <FileText size={18} />

                <div>
                  <strong>
                    {selectedFile.name}
                  </strong>

                  <small>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </small>
                </div>
              </div>

              <CheckCircle2 size={19} />

            </div>

          )}

          <button
            className="primary-btn ai-analyze-btn"
            onClick={handleAnalyze}
            disabled={analyzing}
          >

            <Sparkles size={18} />

            {analyzing
              ? "Analyzing Report..."
              : "Analyze Report"}

          </button>

          <div className="ai-disclaimer">
            <AlertCircle size={17} />

            <p>
              This college MVP uses structured sample data.
              It is not a diagnostic system.
            </p>
          </div>

        </div>

        {/* Result Card */}

        <div className="patient-table-card ai-result-card">

          <div className="ai-result-header">

            <div className="ai-result-title">

              <div className="ai-icon">
                <Bot size={22} />
              </div>

              <div>

                <h3>
                  AI Explanation
                </h3>

                <p>
                  Simple explanation of the report
                </p>

              </div>

            </div>

            {analyzed && (

              <button
                className="secondary-btn"
                onClick={handleCopy}
              >
                <Copy size={16} />
                Copy
              </button>

            )}

          </div>

          {!analyzed ? (

            <div className="ai-empty-state">

              <div className="ai-empty-icon">
                <Sparkles size={30} />
              </div>

              <h3>
                No report analyzed yet
              </h3>

              <p>
                Select a report type, upload a report and click
                <strong> Analyze Report </strong>
                to see a structured explanation.
              </p>

            </div>

          ) : (

            <div className="ai-results">

             
              {/* Report Overview */}

<div className="ai-result-section">

  <div className="ai-result-section-title">

    <FileText size={18} />

    <h4>
      Report Overview
    </h4>

  </div>

  <p>
    <strong>Test:</strong> {analysis.title}
  </p>

  {analysis.patientName && (
    <p>
      <strong>Patient:</strong> {analysis.patientName}
    </p>
  )}

  {analysis.patientAgeSex && (
    <p>
      <strong>Age / Sex:</strong> {analysis.patientAgeSex}
    </p>
  )}

</div>

              {/* Overall Summary */}

              <div className="ai-result-section">

                <div className="ai-result-section-title">

                  <CheckCircle2 size={18} />

                  <h4>
                    Simple Summary
                  </h4>

                </div>

                <p>
                  {analysis.summary}
                </p>

              </div>

              {/* Findings */}

              <div className="ai-result-section">

                <div className="ai-result-section-title">

                  <Activity size={18} />

                  <h4>
                    Key Findings
                  </h4>

                </div>

                <div className="ai-findings">

                  {analysis.findings.map((finding) => (

                    <div
                      className="ai-finding"
                      key={finding.name}
                    >

                      <div className="ai-finding-top">

                        <div>
                          <strong>
                            {finding.name}
                          </strong>

                          <span>
                            {finding.value}
                          </span>
                        </div>

                        <span
                          className={`ai-finding-status ${
                            finding.status
                              .toLowerCase()
                              .replaceAll(" ", "-")
                          }`}
                        >
                          {finding.status}
                        </span>

                      </div>

                      <p>
                        {finding.explanation}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

             {/* Clinical Notes */}

{analysis.clinicalNotes && (
  <div className="ai-result-section">

    <div className="ai-result-section-title">

      <FileText size={18} />

      <h4>
        Clinical Notes
      </h4>

    </div>

    <p>
      {analysis.clinicalNotes}
    </p>

  </div>
)}
              {/* Medicine Information */}

              <div className="ai-result-section">

                <div className="ai-result-section-title">

                  <Pill size={18} />

                  <h4>
                    Medicine Information
                  </h4>

                </div>

                <p>
                  {analysis.medicine}
                </p>

              </div>

              {/* Important Notice */}

              <div className="ai-result-section warning-section">

                <div className="ai-result-section-title">

                  <AlertCircle size={18} />

                  <h4>
                    Important Notice
                  </h4>

                </div>

                <ul>

                  <li>
                    A single laboratory result should not be used
                    to diagnose a medical condition.
                  </li>

                  <li>
                    Reference ranges can vary between laboratories.
                  </li>

                  <li>
                    Discuss abnormal or concerning results with
                    a qualified healthcare professional.
                  </li>

                </ul>

              </div>

              {/* Disclaimer */}

              <div className="ai-disclaimer">

                <AlertCircle size={17} />

                <p>
                  This is an educational college-project
                  demonstration. It does not provide diagnosis
                  or replace professional medical advice.
                </p>

              </div>

              <button
                className="reset-ai-btn"
                onClick={handleReset}
              >

                <RotateCcw size={16} />

                Analyze Another Report

              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AIReportAssistant;