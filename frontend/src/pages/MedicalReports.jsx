import {  useEffect, useState } from "react";
import {
  Search,
  Plus,
  FileText,
  Pencil,
  Eye,
  Trash2
} from "lucide-react";

function MedicalReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);

  const [reports, setReports] = useState([
    {
      id: "REP-00101",
      patient: "Arjun Mehta",
      doctor: "Dr. Neha Kapoor",
      reportType: "Blood Test",
      date: "21 Aug 2026",
      status: "Completed",
    },
    {
      id: "REP-00102",
      patient: "Priya Verma",
      doctor: "Dr. Rahul Malhotra",
      reportType: "MRI Scan",
      date: "21 Aug 2026",
      status: "Pending",
    },
    {
      id: "REP-00103",
      patient: "Rohan Gupta",
      doctor: "Dr. Amit Sharma",
      reportType: "X-Ray",
      date: "20 Aug 2026",
      status: "Completed",
    },
    {
      id: "REP-00104",
      patient: "Ananya Sharma",
      doctor: "Dr. Priya Singh",
      reportType: "ECG",
      date: "19 Aug 2026",
      status: "Reviewed",
    },
  ]);
useEffect(() => {
  const loadReports = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/ai-report"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load medical reports."
        );
      }

      console.log("Medical reports from MongoDB:", data);

      const formattedReports = data.map((report) => ({
        id: report._id,
        patient: report.patient,
        doctor: report.doctor || "Not Assigned",
        reportType: report.reportType || "Blood Test",
        date: report.date
          ? report.date
          : new Date(report.createdAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            ),
        status: report.status || "Pending",
      }));

      setReports(formattedReports);
    } catch (error) {
      console.error(
        "Failed to load medical reports:",
        error
      );
    }
  };

  loadReports();
}, []);
  const [newReport, setNewReport] = useState({
    patient: "",
    doctor: "",
    reportType: "Blood Test",
    date: "",
    status: "Pending",
  });
 
const handleDeleteReport = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this report?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/ai-report/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();
    console.log("Delete response:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete report."
      );
    }

    // Remove ONLY the deleted report from the current list
    setReports((currentReports) =>
      currentReports.filter(
        (report) => report.id !== id
      )
    );

    // Close view modal if the deleted report was open
    if (viewingReport?.id === id) {
      setViewingReport(null);
    }

    alert("Report deleted successfully.");
  } catch (error) {
    console.error("Delete report error:", error);
    alert(error.message || "Failed to delete report.");
  }
};
  // =========================
  // FILTER REPORTS
  // =========================

  const filteredReports = reports.filter((report) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      `${report.patient}
       ${report.doctor}
       ${report.id}
       ${report.reportType}
       ${report.date}
       ${report.status}`
        .toLowerCase()
        .includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setNewReport({
      patient: "",
      doctor: "",
      reportType: "Blood Test",
      date: "",
      status: "Pending",
    });
  };

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    setEditingReport(null);
    resetForm();
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (report) => {
    setEditingReport(report);

    setNewReport({
      patient: report.patient,
      doctor: report.doctor,
      reportType: report.reportType,
      date: convertDateForInput(report.date),
      status: report.status,
    });

    setShowModal(true);
  };

  // =========================
  // DATE CONVERTER
  // =========================

  const convertDateForInput = (dateString) => {
    if (!dateString) return "";

    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const parts = dateString.split(" ");

    if (parts.length !== 3) {
      return dateString;
    }

    const day = parts[0].padStart(2, "0");
    const month = months[parts[1]];
    const year = parts[2];

    if (!month) {
      return "";
    }

    return `${year}-${month}-${day}`;
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // ADD / EDIT REPORT
  // =========================

  const handleSaveReport = async () => {
    if (
      !newReport.patient ||
      !newReport.doctor ||
      !newReport.date
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // EDIT EXISTING REPORT
    if (editingReport) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/ai-report/${editingReport.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient: newReport.patient,
          doctor: newReport.doctor,
          reportType: newReport.reportType,
          date: formatDate(newReport.date),
          status: newReport.status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update report."
      );
    }

    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === editingReport.id
          ? {
              ...report,
              ...data.report,
            }
          : report
      )
    );

    setEditingReport(null);
    resetForm();
    setShowModal(false);

    alert("Report updated successfully.");
  } catch (error) {
    console.error("Update report error:", error);
    alert(error.message || "Failed to update report.");
  }

  return;
}

    // ADD NEW REPORT
try {
  const response = await fetch(
    "http://localhost:5000/api/ai-report",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patient: newReport.patient,
        doctor: newReport.doctor,
        reportType: newReport.reportType,
        date: formatDate(newReport.date),
        status: newReport.status,
        fileName: `${newReport.reportType}.pdf`,
        extractedText: "Medical report added manually.",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add report."
    );
  }

  setReports((currentReports) => [
    ...currentReports,
    {
      ...data.report,
      id: data.report._id,
    },
  ]);

  resetForm();
  setShowModal(false);

  alert("Report added successfully.");
} catch (error) {
  console.error("Add report error:", error);
  alert(error.message || "Failed to add report.");
}
}
  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setEditingReport(null);
    resetForm();
  };

  return (
    <div className="page-content">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <div>
          <p className="page-eyebrow">
            MEDICAL RECORDS
          </p>

          <h2>Medical Reports</h2>

          <p className="page-description">
            Manage patient medical reports and records.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add Report
        </button>

      </div>

      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <div className="patient-toolbar">

        <div className="patient-search">

          <Search size={18} />

          <input
            placeholder="Search medical reports..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <select
          className="filter-btn"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="All">
            All Reports
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Reviewed">
            Reviewed
          </option>

        </select>

      </div>

      {/* =========================
          REPORT TABLE
      ========================= */}

      <div className="patient-table-card">

        <div className="patient-table-header">

          <h3>
            Medical Report Records
          </h3>

          <span>
            {filteredReports.length} reports
          </span>

        </div>

        <div className="patient-table">

          {/* TABLE HEADER */}

          <div className="patient-row table-heading">

            <span>Patient</span>
            <span>Doctor</span>
            <span>Report Type</span>
            <span>Date</span>
            <span>Status</span>
            <span>Action</span>

          </div>

          {/* REPORT ROWS */}

          {filteredReports.map((report) => (

            <div
              className="patient-row"
              key={report.id}
            >

              {/* PATIENT */}

              <div className="patient-name-cell">

                <div className="patient-avatar">

                  <FileText size={18} />

                </div>

                <div>

                  <strong>
                    {report.patient}
                  </strong>

                  <small>
                    {report.id}
                  </small>

                </div>

              </div>

              {/* DOCTOR */}

              <span>
                {report.doctor}
              </span>

              {/* REPORT TYPE */}

              <span>
                {report.reportType}
              </span>

              {/* DATE */}

              <span>
                {report.date}
              </span>

              {/* STATUS */}

              <span
                className={`patient-status ${
                  report.status === "Completed"
                    ? "active"
                    : report.status === "Pending"
                    ? "inactive"
                    : "active"
                }`}
              >
                {report.status}
              </span>

              {/* ACTIONS */}

              <div className="doctor-actions">

                <button
                  className="view-btn"
                  title="View report"
                  onClick={() =>
                    setViewingReport(report)
                  }
                >
                  <Eye size={15} />
                </button>

                <button
                  className="edit-btn"
                  title="Edit report"
                  onClick={() =>
                    openEditModal(report)
                  }
                >
                  <Pencil size={15} />
                </button>
                <button
  className="delete-btn"
  title="Delete report"
  onClick={() => handleDeleteReport(report)}
>
  <Trash2 size={15} />
</button>

              </div>

            </div>

          ))}

          {/* NO RESULTS */}

          {filteredReports.length === 0 && (

            <div className="no-results">
              No medical reports found.
            </div>

          )}

        </div>

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (

        <div className="modal-overlay">

          <div className="patient-modal">

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  MEDICAL RECORDS
                </p>

                <h3>
                  {editingReport
                    ? "Edit Medical Report"
                    : "Add Medical Report"}
                </h3>

              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <div className="patient-form">

              {/* PATIENT */}

              <div className="form-group">

                <label>
                  Patient Name
                </label>

                <input
                  placeholder="Enter patient name"
                  value={newReport.patient}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      patient: e.target.value,
                    })
                  }
                />

              </div>

              {/* DOCTOR */}

              <div className="form-group">

                <label>
                  Doctor
                </label>

                <input
                  placeholder="Enter doctor name"
                  value={newReport.doctor}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      doctor: e.target.value,
                    })
                  }
                />

              </div>

              {/* REPORT TYPE */}

              <div className="form-group">

                <label>
                  Report Type
                </label>

                <select
                  value={newReport.reportType}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      reportType: e.target.value,
                    })
                  }
                >

                  <option>
                    Blood Test
                  </option>

                  <option>
                    MRI Scan
                  </option>

                  <option>
                    CT Scan
                  </option>

                  <option>
                    X-Ray
                  </option>

                  <option>
                    ECG
                  </option>

                  <option>
                    Ultrasound
                  </option>

                </select>

              </div>

              {/* DATE */}

              <div className="form-group">

                <label>
                  Report Date
                </label>

                <input
                  type="date"
                  value={newReport.date}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      date: e.target.value,
                    })
                  }
                />

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={newReport.status}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      status: e.target.value,
                    })
                  }
                >

                  <option>
                    Pending
                  </option>

                  <option>
                    Completed
                  </option>

                  <option>
                    Reviewed
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="modal-actions">

                <button
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  className="primary-btn"
                  onClick={handleSaveReport}
                >
                  {editingReport
                    ? "Save Changes"
                    : "Add Report"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          VIEW REPORT MODAL
      ========================= */}

      {viewingReport && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  MEDICAL RECORD
                </p>

                <h3>
                  Report Details
                </h3>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setViewingReport(null)
                }
              >
                ×
              </button>

            </div>

            <div className="patient-details">

              {/* PROFILE */}

              <div className="patient-details-profile">

                <div className="patient-details-avatar">

                  <FileText size={32} />

                </div>

                <div>

                  <h2>
                    {viewingReport.patient}
                  </h2>

                  <p>
                    {viewingReport.id}
                  </p>

                </div>

              </div>

              {/* DETAILS */}

              <div className="details-grid">

                <div className="detail-item">

                  <span>
                    Doctor
                  </span>

                  <strong>
                    {viewingReport.doctor}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Report Type
                  </span>

                  <strong>
                    {viewingReport.reportType}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Report Date
                  </span>

                  <strong>
                    {viewingReport.date}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Status
                  </span>

                  <strong
                    className={`patient-status ${
                      viewingReport.status === "Completed"
                        ? "active"
                        : viewingReport.status === "Pending"
                        ? "inactive"
                        : "active"
                    }`}
                  >
                    {viewingReport.status}
                  </strong>

                </div>

              </div>

              {/* INFORMATION */}

              <div className="medical-summary">

                <h4>
                  Report Information
                </h4>

                <p>
                  This medical report contains the
                  patient's recorded medical information.
                  Detailed report analysis and AI-powered
                  explanation will be connected during the
                  backend and AI integration stage.
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MedicalReports;