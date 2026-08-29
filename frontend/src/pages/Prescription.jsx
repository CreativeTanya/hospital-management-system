import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pill,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const API = "https://hospital-management-system-rn7a.onrender.com/api/prescriptions";

const emptyForm = {
  patient: "",
  doctor: "",
  medicine: "",
  dosage: "",
  duration: "",
  instructions: "",
  status: "Active",
};

function Prescriptions() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [show, setShow] = useState(false);
  const [view, setView] = useState(null);
  const [editingPrescription, setEditingPrescription] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load prescriptions
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(API);

      if (!res.ok) {
        throw new Error("Failed to fetch prescriptions");
      }

      const result = await res.json();

      setData(result);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to the hospital database."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search
  const filtered = data.filter((p) =>
    `${p.patient} ${p.doctor} ${p.medicine} ${p.dosage} ${p.duration} ${p.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setForm(emptyForm);
    setEditingPrescription(null);
  };

  // Open Add modal
  const openAddModal = () => {
    resetForm();
    setShow(true);
  };

  // Open Edit modal
  const openEditModal = (prescription) => {
    setEditingPrescription(prescription);

    setForm({
      patient: prescription.patient || "",
      doctor: prescription.doctor || "",
      medicine: prescription.medicine || "",
      dosage: prescription.dosage || "",
      duration: prescription.duration || "",
      instructions: prescription.instructions || "",
      status: prescription.status || "Active",
    });

    setShow(true);
  };

  // Close modal
  const closeModal = () => {
    setShow(false);
    resetForm();
  };

  // Add prescription
  const addPrescription = async () => {
    if (
      !form.patient ||
      !form.doctor ||
      !form.medicine ||
      !form.dosage ||
      !form.duration
    ) {
      alert("Please fill required fields.");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const newPrescription = await response.json();

      if (!response.ok) {
        throw new Error(
          newPrescription.message ||
            "Failed to add prescription"
        );
      }

      setData((currentData) => [
        newPrescription,
        ...currentData,
      ]);

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to add prescription.");
    }
  };

  // Edit prescription
  const editPrescription = async () => {
    if (
      !form.patient ||
      !form.doctor ||
      !form.medicine ||
      !form.dosage ||
      !form.duration
    ) {
      alert("Please fill required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/${editingPrescription._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const updatedPrescription =
        await response.json();

      if (!response.ok) {
        throw new Error(
          updatedPrescription.message ||
            "Failed to update prescription"
        );
      }

      setData((currentData) =>
        currentData.map((prescription) =>
          prescription._id ===
          editingPrescription._id
            ? updatedPrescription
            : prescription
        )
      );

      closeModal();

      // Update view if the same prescription is open
      if (
        view &&
        view._id === editingPrescription._id
      ) {
        setView(updatedPrescription);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update prescription.");
    }
  };

  // Delete prescription
  const deletePrescription = async (prescription) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the prescription for ${prescription.patient}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API}/${prescription._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete prescription"
        );
      }

      setData((currentData) =>
        currentData.filter(
          (item) =>
            item._id !== prescription._id
        )
      );

      if (
        view &&
        view._id === prescription._id
      ) {
        setView(null);
      }

      alert("Prescription deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete prescription.");
    }
  };

  return (
    <div className="page-content">

      {/* Header */}

      <div className="page-header">

        <div>

          <p className="page-eyebrow">
            PRESCRIPTION MANAGEMENT
          </p>

          <h2>Prescriptions</h2>

          <p className="page-description">
            Manage patient medicines and prescriptions.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          New Prescription
        </button>

      </div>

      {/* Search */}

      <div className="patient-toolbar">

        <div className="patient-search">

          <Search size={18} />

          <input
            placeholder="Search prescriptions..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* Prescription Table */}

      <div className="patient-table-card">

        <div className="patient-table-header">

          <h3>Prescription Records</h3>

          <span>
            {filtered.length} prescriptions
          </span>

        </div>

        {loading ? (

          <div className="patient-loading">
            Loading prescriptions...
          </div>

        ) : error ? (

          <div className="patient-error">

            {error}

            <button onClick={loadData}>
              Retry
            </button>

          </div>

        ) : (

          <div className="patient-table">

            <div className="prescription-row table-heading">

              <span>Patient</span>
              <span>Doctor</span>
              <span>Medicine</span>
              <span>Dosage</span>
              <span>Duration</span>
              <span>Status</span>
              <span>Action</span>

            </div>

            {filtered.map((p) => (

              <div
                className="prescription-row"
                key={p._id}
              >

                <div className="patient-name-cell">

                  <div className="patient-avatar">
                    <Pill size={18} />
                  </div>

                  <div>

                    <strong>
                      {p.patient}
                    </strong>

                    <small>
                      {p._id.slice(-8)}
                    </small>

                  </div>

                </div>

                <span>
                  {p.doctor}
                </span>

                <span>
                  {p.medicine}
                </span>

                <span>
                  {p.dosage}
                </span>

                <span>
                  {p.duration}
                </span>

                <span
                  className={`patient-status ${
                    p.status === "Active"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {p.status}
                </span>

                <div className="doctor-actions">

                  {/* View */}

                  <button
                    className="view-btn"
                    onClick={() => setView(p)}
                    title="View prescription"
                  >
                    <Eye size={15} />
                  </button>

                  {/* Edit */}

                  <button
                    className="edit-btn"
                    onClick={() =>
                      openEditModal(p)
                    }
                    title="Edit prescription"
                  >
                    <Pencil size={15} />
                  </button>

                  {/* Delete */}

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deletePrescription(p)
                    }
                    title="Delete prescription"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            ))}

            {filtered.length === 0 && (

              <div className="no-results">
                No prescriptions found.
              </div>

            )}

          </div>

        )}

      </div>

      {/* Add / Edit Modal */}

      {show && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  PRESCRIPTION MANAGEMENT
                </p>

                <h3>
                  {editingPrescription
                    ? "Edit Prescription"
                    : "New Prescription"}
                </h3>

              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <div className="patient-form">

              {/* Patient */}

              <div className="form-group">

                <label>
                  Patient
                </label>

                <input
                  placeholder="Patient name"
                  value={form.patient}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      patient: e.target.value,
                    })
                  }
                />

              </div>

              {/* Doctor */}

              <div className="form-group">

                <label>
                  Doctor
                </label>

                <input
                  placeholder="Doctor name"
                  value={form.doctor}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      doctor: e.target.value,
                    })
                  }
                />

              </div>

              {/* Medicine */}

              <div className="form-group">

                <label>
                  Medicine
                </label>

                <input
                  placeholder="Medicine name"
                  value={form.medicine}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      medicine: e.target.value,
                    })
                  }
                />

              </div>

              {/* Dosage + Duration */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Dosage
                  </label>

                  <input
                    placeholder="500 mg twice daily"
                    value={form.dosage}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dosage: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Duration
                  </label>

                  <input
                    placeholder="5 days"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        duration: e.target.value,
                      })
                    }
                  />

                </div>

              </div>

              {/* Status */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

              {/* Instructions */}

              <div className="form-group">

                <label>
                  Instructions
                </label>

                <textarea
                  placeholder="Take after meals..."
                  value={form.instructions}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      instructions:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* Actions */}

              <div className="modal-actions">

                <button
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  className="primary-btn"
                  onClick={
                    editingPrescription
                      ? editPrescription
                      : addPrescription
                  }
                >
                  {editingPrescription
                    ? "Save Changes"
                    : "Add Prescription"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* View Prescription Modal */}

      {view && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  PRESCRIPTION RECORD
                </p>

                <h3>
                  Prescription Details
                </h3>

              </div>

              <button
                className="modal-close"
                onClick={() => setView(null)}
              >
                ×
              </button>

            </div>

            <div className="patient-details">

              <div className="patient-details-profile">

                <div className="patient-details-avatar">
                  <Pill size={30} />
                </div>

                <div>

                  <h2>
                    {view.patient}
                  </h2>

                  <p>
                    {view.doctor}
                  </p>

                </div>

              </div>

              <div className="details-grid">

                <div className="detail-item">

                  <span>
                    Medicine
                  </span>

                  <strong>
                    {view.medicine}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Dosage
                  </span>

                  <strong>
                    {view.dosage}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Duration
                  </span>

                  <strong>
                    {view.duration}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Status
                  </span>

                  <strong
                    className={`patient-status ${
                      view.status === "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {view.status}
                  </strong>

                </div>

              </div>

              <div className="medical-summary">

                <h4>
                  Instructions
                </h4>

                <p>
                  {view.instructions ||
                    "No instructions added."}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Prescriptions;