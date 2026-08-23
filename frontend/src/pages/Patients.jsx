import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  UserRound,
  Pencil,
  Eye,
  Trash2
} from "lucide-react";

const API_URL = "http://localhost:5000/api/patients";

const emptyPatient = {
  name: "",
  age: "",
  gender: "Male",
  phone: "",
  condition: "General Medicine",
  status: "Active",
};

function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);

  const [patients, setPatients] = useState([]);

  const [newPatient, setNewPatient] = useState(emptyPatient);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load patients from MongoDB
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();

      setPatients(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the hospital database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      `${patient.name} ${patient._id} ${patient.age} ${patient.gender} ${patient.phone} ${patient.condition}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Add patient
  const handleAddPatient = async () => {
    if (
      !newPatient.name ||
      !newPatient.age ||
      !newPatient.phone
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: newPatient.name,
          age: Number(newPatient.age),
          gender: newPatient.gender,
          phone: newPatient.phone,
          condition: newPatient.condition,
          status: newPatient.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add patient");
      }

      setPatients((currentPatients) => [
        data,
        ...currentPatients,
      ]);

      setNewPatient(emptyPatient);
      setShowModal(false);

    } catch (err) {
      console.error(err);
      alert("Failed to add patient.");
    }
  };
// Delete patient
  const handleDeletePatient = async (patient) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/${patient._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete patient"
        );
      }

      setPatients((currentPatients) =>
        currentPatients.filter(
          (currentPatient) =>
            currentPatient._id !== patient._id
        )
      );

      if (
        viewingPatient &&
        viewingPatient._id === patient._id
      ) {
        setViewingPatient(null);
      }

      alert("Patient deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete patient.");
    }
  };
  // Edit patient
  const handleEditPatient = async () => {
    if (
      !newPatient.name ||
      !newPatient.age ||
      !newPatient.phone
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${editingPatient._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: newPatient.name,
            age: Number(newPatient.age),
            gender: newPatient.gender,
            phone: newPatient.phone,
            condition: newPatient.condition,
            status: newPatient.status,
          }),
        }
      );

      const updatedPatient = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedPatient.message || "Failed to update patient"
        );
      }

      setPatients((currentPatients) =>
        currentPatients.map((patient) =>
          patient._id === editingPatient._id
            ? updatedPatient
            : patient
        )
      );

      setNewPatient(emptyPatient);
      setEditingPatient(null);
      setShowModal(false);

    } catch (err) {
      console.error(err);
      alert("Failed to update patient.");
    }
  };

  const openAddModal = () => {
    setEditingPatient(null);
    setNewPatient(emptyPatient);
    setShowModal(true);
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);

    setNewPatient({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "Male",
      phone: patient.phone || "",
      condition: patient.condition || "General Medicine",
      status: patient.status || "Active",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPatient(null);
    setNewPatient(emptyPatient);
  };

  return (
    <div className="page-content">

      {/* Header */}

      <div className="page-header">

        <div>

          <p className="page-eyebrow">
            PATIENT MANAGEMENT
          </p>

          <h2>Patients</h2>

          <p className="page-description">
            Manage patient records and medical information.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add Patient
        </button>

      </div>

      {/* Toolbar */}

      <div className="patient-toolbar">

        <div className="patient-search">

          <Search size={18} />

          <input
            placeholder="Search patients..."
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
            All Patients
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>

      </div>

      {/* Patient Table */}

      <div className="patient-table-card">

        <div className="patient-table-header">

          <h3>Patient Records</h3>

          <span>
            {filteredPatients.length} patients
          </span>

        </div>

        {loading ? (

          <div className="patient-loading">
            Loading patients...
          </div>

        ) : error ? (

          <div className="patient-error">
            {error}

            <button onClick={fetchPatients}>
              Retry
            </button>
          </div>

        ) : (

          <div className="patient-table">

            <div className="patient-row table-heading">

              <span>Patient</span>
              <span>Patient ID</span>
              <span>Age / Gender</span>
              <span>Contact</span>
              <span>Department</span>
              <span>Status</span>
              <span>Action</span>

            </div>

            {filteredPatients.map((patient) => (

              <div
                className="patient-row"
                key={patient._id}
              >

                <div className="patient-name-cell">

                  <div className="patient-avatar">
                    <UserRound size={18} />
                  </div>

                  <div>

                    <strong>
                      {patient.name}
                    </strong>

                    <small>
                      {patient._id.slice(-8)}
                    </small>

                  </div>

                </div>

                <span className="patient-id">
                  {patient._id.slice(-8)}
                </span>

                <span>
                  {patient.age} / {patient.gender}
                </span>

                <span>
                  {patient.phone}
                </span>

                <span>
                  {patient.condition}
                </span>

                <span
                  className={`patient-status ${
                    patient.status === "Active"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {patient.status}
                </span>

                <div className="patient-actions">

                  <button
                    className="view-btn"
                    onClick={() =>
                      setViewingPatient(patient)
                    }
                    title="View patient"
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      openEditModal(patient)
                    }
                    title="Edit patient"
                  >
                    <Pencil size={15} />
                  </button>
                 <button
  className="edit-btn"
  onClick={() =>
    handleDeletePatient(patient)
  }
  title="Delete patient"
>
  <Trash2 size={15} />
</button>
                </div>

              </div>

            ))}

            {!loading &&
              filteredPatients.length === 0 && (
                <div className="patient-empty">
                  <UserRound size={30} />

                  <h3>
                    No patients found
                  </h3>

                  <p>
                    Add your first patient to the database.
                  </p>
                </div>
              )}

          </div>

        )}

      </div>

      {/* Add / Edit Modal */}

      {showModal && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  PATIENT MANAGEMENT
                </p>

                <h3>
                  {editingPatient
                    ? "Edit Patient"
                    : "Add New Patient"}
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

              <div className="form-group">

                <label>
                  Patient Name
                </label>

                <input
                  placeholder="Enter patient name"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      name: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>Age</label>

                  <input
                    type="number"
                    placeholder="Age"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        age: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Gender
                  </label>

                  <select
                    value={newPatient.gender}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        gender: e.target.value,
                      })
                    }
                  >

                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>

                  </select>

                </div>

              </div>

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  placeholder="+91 XXXXX XXXXX"
                  value={newPatient.phone}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      phone: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Department
                </label>

                <select
                  value={newPatient.condition}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      condition: e.target.value,
                    })
                  }
                >

                  <option>
                    General Medicine
                  </option>

                  <option>
                    Cardiology
                  </option>

                  <option>
                    Neurology
                  </option>

                  <option>
                    Orthopedics
                  </option>

                  <option>
                    Pediatrics
                  </option>

                </select>

              </div>

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
                    editingPatient
                      ? handleEditPatient
                      : handleAddPatient
                  }
                >
                  {editingPatient
                    ? "Save Changes"
                    : "Add Patient"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* View Patient Modal */}

      {viewingPatient && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  PATIENT RECORD
                </p>

                <h3>
                  Patient Details
                </h3>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setViewingPatient(null)
                }
              >
                ×
              </button>

            </div>

            <div className="patient-details">

              <div className="patient-details-profile">

                <div className="patient-details-avatar">
                  <UserRound size={32} />
                </div>

                <div>

                  <h2>
                    {viewingPatient.name}
                  </h2>

                  <p>
                    {viewingPatient._id}
                  </p>

                </div>

              </div>

              <div className="details-grid">

                <div className="detail-item">
                  <span>Age</span>

                  <strong>
                    {viewingPatient.age} years
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Gender</span>

                  <strong>
                    {viewingPatient.gender}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Phone</span>

                  <strong>
                    {viewingPatient.phone}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Department</span>

                  <strong>
                    {viewingPatient.condition}
                  </strong>
                </div>

                <div className="detail-item">

                  <span>Status</span>

                  <strong
                    className={`patient-status ${
                      viewingPatient.status ===
                      "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {viewingPatient.status}
                  </strong>

                </div>

              </div>

              <div className="medical-summary">

                <h4>
                  Medical Summary
                </h4>

                <p>
                  No medical history or reports
                  have been added yet. Medical
                  records will appear here once
                  available.
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Patients;