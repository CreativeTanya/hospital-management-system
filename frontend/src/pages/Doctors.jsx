import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  UserRound,
  Pencil,
  Eye,
  Trash2
} from "lucide-react";

const API_URL = "http://localhost:5000/api/doctors";

const emptyDoctor = {
  name: "",
  specialization: "General Physician",
  department: "General Medicine",
  experience: "",
  phone: "",
  status: "Available",
};

function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState(emptyDoctor);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load doctors from MongoDB
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();

      setDoctors(data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the hospital database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      `${doctor.name} ${doctor._id} ${doctor.specialization} ${doctor.department} ${doctor.experience} ${doctor.phone} ${doctor.status}`
        .toLowerCase()
        .includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      doctor.status?.toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Add doctor
  const handleAddDoctor = async () => {
    if (
      !newDoctor.name ||
      !newDoctor.experience ||
      !newDoctor.phone
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
          name: newDoctor.name,
          specialization: newDoctor.specialization,
          department: newDoctor.department,
          experience: Number(newDoctor.experience),
          phone: newDoctor.phone,
          status: newDoctor.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add doctor"
        );
      }

      setDoctors((currentDoctors) => [
        data,
        ...currentDoctors,
      ]);

      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add doctor.");
    }
  };
// Delete doctor
const handleDeleteDoctor = async (doctor) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${doctor.name}?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${API_URL}/${doctor._id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete doctor"
      );
    }

    setDoctors((currentDoctors) =>
      currentDoctors.filter(
        (currentDoctor) =>
          currentDoctor._id !== doctor._id
      )
    );

    if (
      viewingDoctor &&
      viewingDoctor._id === doctor._id
    ) {
      setViewingDoctor(null);
    }

    alert("Doctor deleted successfully.");
  } catch (err) {
    console.error(err);
    alert("Failed to delete doctor.");
  }
};
  // Edit doctor
  const handleEditDoctor = async () => {
    if (
      !newDoctor.name ||
      !newDoctor.experience ||
      !newDoctor.phone
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${editingDoctor._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: newDoctor.name,
            specialization: newDoctor.specialization,
            department: newDoctor.department,
            experience: Number(newDoctor.experience),
            phone: newDoctor.phone,
            status: newDoctor.status,
          }),
        }
      );

      const updatedDoctor = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedDoctor.message ||
            "Failed to update doctor"
        );
      }

      setDoctors((currentDoctors) =>
        currentDoctors.map((doctor) =>
          doctor._id === editingDoctor._id
            ? updatedDoctor
            : doctor
        )
      );

      resetForm();
      setEditingDoctor(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update doctor.");
    }
  };

  const resetForm = () => {
    setNewDoctor(emptyDoctor);
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (doctor) => {
    setEditingDoctor(doctor);

    setNewDoctor({
      name: doctor.name || "",
      specialization:
        doctor.specialization || "General Physician",
      department:
        doctor.department || "General Medicine",
      experience:
        doctor.experience ?? "",
      phone: doctor.phone || "",
      status: doctor.status || "Available",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    resetForm();
  };

  return (
    <div className="page-content">

      {/* Page Header */}

      <div className="page-header">

        <div>

          <p className="page-eyebrow">
            DOCTOR MANAGEMENT
          </p>

          <h2>Doctors</h2>

          <p className="page-description">
            Manage doctors, specializations and
            availability.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add Doctor
        </button>

      </div>

      {/* Search + Filter */}

      <div className="patient-toolbar">

        <div className="patient-search">

          <Search size={18} />

          <input
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <select
          className="doctor-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="All">
            All Doctors
          </option>

          <option value="Available">
            Available
          </option>

          <option value="Busy">
            Busy
          </option>

          <option value="On Leave">
            On Leave
          </option>

        </select>

      </div>

      {/* Doctor Table */}

      <div className="patient-table-card">

        <div className="patient-table-header">

          <h3>Doctor Records</h3>

          <span>
            {filteredDoctors.length} doctors
          </span>

        </div>

        {loading ? (

          <div className="patient-loading">
            Loading doctors...
          </div>

        ) : error ? (

          <div className="patient-error">

            {error}

            <button onClick={fetchDoctors}>
              Retry
            </button>

          </div>

        ) : (

          <div className="patient-table">

            <div className="patient-row table-heading">

              <span>Doctor</span>
              <span>Doctor ID</span>
              <span>Specialization</span>
              <span>Department</span>
              <span>Experience</span>
              <span>Status</span>
              <span>Action</span>

            </div>

            {filteredDoctors.map((doctor) => (

              <div
                className="patient-row"
                key={doctor._id}
              >

                <div className="patient-name-cell">

                  <div className="patient-avatar">
                    <UserRound size={18} />
                  </div>

                  <div>

                    <strong>
                      {doctor.name}
                    </strong>

                    <small>
                      {doctor.phone}
                    </small>

                  </div>

                </div>

                <span className="patient-id">
                  {doctor._id.slice(-8)}
                </span>

                <span>
                  {doctor.specialization}
                </span>

                <span>
                  {doctor.department}
                </span>

                <span>
                  {doctor.experience} years
                </span>

                <span
                  className={`patient-status ${
                    doctor.status === "Available"
                      ? "active"
                      : "inactive"
                  }`}
                >
                  {doctor.status}
                </span>

                <div className="doctor-actions">

                  <button
                    className="view-btn"
                    onClick={() =>
                      setViewingDoctor(doctor)
                    }
                    title="View doctor"
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() =>
                      openEditModal(doctor)
                    }
                    title="Edit doctor"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
  className="delete-btn"
  onClick={() =>
    handleDeleteDoctor(doctor)
  }
  title="Delete doctor"
>
  <Trash2 size={15} />
</button>
                </div>

              </div>

            ))}

            {filteredDoctors.length === 0 && (

              <div className="no-results">
                No doctors found.
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
                  DOCTOR MANAGEMENT
                </p>

                <h3>
                  {editingDoctor
                    ? "Edit Doctor"
                    : "Add New Doctor"}
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
                  Doctor Name
                </label>

                <input
                  placeholder="Enter doctor name"
                  value={newDoctor.name}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      name: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Specialization
                  </label>

                  <select
                    value={newDoctor.specialization}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        specialization:
                          e.target.value,
                      })
                    }
                  >

                    <option>
                      General Physician
                    </option>

                    <option>
                      Cardiologist
                    </option>

                    <option>
                      Neurologist
                    </option>

                    <option>
                      Orthopedic Surgeon
                    </option>

                    <option>
                      Pediatrician
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Department
                  </label>

                  <select
                    value={newDoctor.department}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        department:
                          e.target.value,
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

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Experience
                  </label>

                  <input
                    type="number"
                    placeholder="Years of experience"
                    value={newDoctor.experience}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        experience:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    value={newDoctor.status}
                    onChange={(e) =>
                      setNewDoctor({
                        ...newDoctor,
                        status: e.target.value,
                      })
                    }
                  >

                    <option>
                      Available
                    </option>

                    <option>
                      Busy
                    </option>

                    <option>
                      On Leave
                    </option>

                  </select>

                </div>

              </div>

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  placeholder="+91 XXXXX XXXXX"
                  value={newDoctor.phone}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      phone: e.target.value,
                    })
                  }
                />

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
                    editingDoctor
                      ? handleEditDoctor
                      : handleAddDoctor
                  }
                >
                  {editingDoctor
                    ? "Save Changes"
                    : "Add Doctor"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* View Doctor Modal */}

      {viewingDoctor && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  DOCTOR RECORD
                </p>

                <h3>
                  Doctor Details
                </h3>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setViewingDoctor(null)
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
                    {viewingDoctor.name}
                  </h2>

                  <p>
                    {viewingDoctor._id}
                  </p>

                </div>

              </div>

              <div className="details-grid">

                <div className="detail-item">

                  <span>
                    Specialization
                  </span>

                  <strong>
                    {viewingDoctor.specialization}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Department
                  </span>

                  <strong>
                    {viewingDoctor.department}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Experience
                  </span>

                  <strong>
                    {viewingDoctor.experience} years
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Phone
                  </span>

                  <strong>
                    {viewingDoctor.phone}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Status
                  </span>

                  <strong
                    className={`patient-status ${
                      viewingDoctor.status ===
                      "Available"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {viewingDoctor.status}
                  </strong>

                </div>

              </div>

              <div className="medical-summary">

                <h4>
                  Doctor Information
                </h4>

                <p>
                  Doctor profile and availability
                  information is stored securely
                  in the hospital database.
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Doctors;