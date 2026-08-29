import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  CalendarDays,
  Pencil,
  Eye,
  Trash2
} from "lucide-react";

const API_URL = "https://hospital-management-system-rn7a.onrender.com/api/appointments";

const emptyAppointment = {
  patient: "",
  doctor: "",
  department: "General Medicine",
  date: "",
  time: "",
  status: "Pending",
};

function Appointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [viewingAppointment, setViewingAppointment] =
    useState(null);
  const [editingAppointment, setEditingAppointment] =
    useState(null);

  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] =
    useState(emptyAppointment);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD APPOINTMENTS
  // =========================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();

      setAppointments(data);
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
    fetchAppointments();
  }, []);

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredAppointments =
    appointments.filter((appointment) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch = `
        ${appointment.patient}
        ${appointment.doctor}
        ${appointment._id}
        ${appointment.department}
        ${appointment.date}
        ${appointment.time}
        ${appointment.status}
      `
        .toLowerCase()
        .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setNewAppointment(emptyAppointment);
  };

  // =========================
  // ADD APPOINTMENT
  // =========================

  const handleAddAppointment = async () => {
    if (
      !newAppointment.patient ||
      !newAppointment.doctor ||
      !newAppointment.date ||
      !newAppointment.time
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

        body: JSON.stringify(newAppointment),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add appointment"
        );
      }

      setAppointments((currentAppointments) => [
        data,
        ...currentAppointments,
      ]);

      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add appointment.");
    }
  };

  // =========================
  // EDIT APPOINTMENT
  // =========================

  const handleEditAppointment = async () => {
    if (
      !newAppointment.patient ||
      !newAppointment.doctor ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${editingAppointment._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(newAppointment),
        }
      );

      const updatedAppointment =
        await response.json();

      if (!response.ok) {
        throw new Error(
          updatedAppointment.message ||
            "Failed to update appointment"
        );
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment._id === editingAppointment._id
            ? updatedAppointment
            : appointment
        )
      );

      resetForm();
      setEditingAppointment(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment.");
    }
  };
// =========================
// DELETE APPOINTMENT
// =========================

const handleDeleteAppointment = async (appointment) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete the appointment for ${appointment.patient}?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${API_URL}/${appointment._id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete appointment"
      );
    }

    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (item) => item._id !== appointment._id
      )
    );

    if (
      viewingAppointment &&
      viewingAppointment._id === appointment._id
    ) {
      setViewingAppointment(null);
    }

    alert("Appointment deleted successfully.");
  } catch (err) {
    console.error(err);
    alert("Failed to delete appointment.");
  }
};
 
  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    setEditingAppointment(null);
    resetForm();
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (appointment) => {
    setEditingAppointment(appointment);

    setNewAppointment({
      patient: appointment.patient || "",
      doctor: appointment.doctor || "",
      department:
        appointment.department ||
        "General Medicine",
      date: appointment.date || "",
      time: appointment.time || "",
      status: appointment.status || "Pending",
    });

    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
    resetForm();
  };

  return (
    <div className="page-content">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>

          <p className="page-eyebrow">
            APPOINTMENT MANAGEMENT
          </p>

          <h2>Appointments</h2>

          <p className="page-description">
            Schedule and manage patient appointments.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          New Appointment
        </button>

      </div>

      {/* SEARCH + FILTER */}

      <div className="patient-toolbar">

        <div className="patient-search">

          <Search size={18} />

          <input
            placeholder="Search appointments..."
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
            All Appointments
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>

      {/* APPOINTMENT TABLE */}

      <div className="patient-table-card">

        <div className="patient-table-header">

          <h3>Appointment Records</h3>

          <span>
            {filteredAppointments.length} appointments
          </span>

        </div>

        {loading ? (

          <div className="patient-loading">
            Loading appointments...
          </div>

        ) : error ? (

          <div className="patient-error">

            {error}

            <button onClick={fetchAppointments}>
              Retry
            </button>

          </div>

        ) : (

          <div className="patient-table">

            <div className="appointment-row table-heading">

              <span>Patient</span>

              <span>Doctor</span>

              <span>Department</span>

              <span>Date & Time</span>

              <span>Status</span>

              <span>Action</span>

            </div>

            {filteredAppointments.map(
              (appointment) => (

                <div
                  className="appointment-row"
                  key={appointment._id}
                >

                  <div className="patient-name-cell">

                    <div className="patient-avatar">
                      <CalendarDays size={18} />
                    </div>

                    <div>

                      <strong>
                        {appointment.patient}
                      </strong>

                      <small>
                        {appointment._id.slice(-8)}
                      </small>

                    </div>

                  </div>

                  <span>
                    {appointment.doctor}
                  </span>

                  <span>
                    {appointment.department}
                  </span>

                  <div className="appointment-datetime">

                    <strong>
                      {appointment.date}
                    </strong>

                    <small>
                      {appointment.time}
                    </small>

                  </div>

                  <span
                    className={`appointment-status ${
                      appointment.status
                        .toLowerCase()
                        .replace(" ", "-")
                    }`}
                  >
                    {appointment.status}
                  </span>

                  <div className="doctor-actions">

  <button
    className="view-btn"
    title="View appointment"
    onClick={() =>
      setViewingAppointment(appointment)
    }
  >
    <Eye size={15} />
  </button>

  <button
    className="edit-btn"
    title="Edit appointment"
    onClick={() =>
      openEditModal(appointment)
    }
  >
    <Pencil size={15} />
  </button>

  <button
    className="delete-btn"
    title="Delete appointment"
    onClick={() =>
      handleDeleteAppointment(appointment)
    }
  >
    <Trash2 size={15} />
  </button>

</div>

                </div>

              )
            )}

            {filteredAppointments.length === 0 && (

              <div className="no-results">
                No appointments found.
              </div>

            )}

          </div>

        )}

      </div>

      {/* ADD / EDIT MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  APPOINTMENT MANAGEMENT
                </p>

                <h3>
                  {editingAppointment
                    ? "Edit Appointment"
                    : "New Appointment"}
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
                  value={newAppointment.patient}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      patient: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Doctor
                </label>

                <input
                  placeholder="Enter doctor name"
                  value={newAppointment.doctor}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      doctor: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Department
                </label>

                <select
                  value={newAppointment.department}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      department: e.target.value,
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

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        date: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Time
                  </label>

                  <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        time: e.target.value,
                      })
                    }
                  />

                </div>

              </div>

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={newAppointment.status}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      status: e.target.value,
                    })
                  }
                >

                  <option>
                    Pending
                  </option>

                  <option>
                    Confirmed
                  </option>

                  <option>
                    Cancelled
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
                    editingAppointment
                      ? handleEditAppointment
                      : handleAddAppointment
                  }
                >
                  {editingAppointment
                    ? "Save Changes"
                    : "Add Appointment"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* VIEW APPOINTMENT MODAL */}

      {viewingAppointment && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  APPOINTMENT RECORD
                </p>

                <h3>
                  Appointment Details
                </h3>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setViewingAppointment(null)
                }
              >
                ×
              </button>

            </div>

            <div className="patient-details">

              <div className="patient-details-profile">

                <div className="patient-details-avatar">
                  <CalendarDays size={32} />
                </div>

                <div>

                  <h2>
                    {viewingAppointment.patient}
                  </h2>

                  <p>
                    {viewingAppointment._id}
                  </p>

                </div>

              </div>

              <div className="details-grid">

                <div className="detail-item">

                  <span>
                    Doctor
                  </span>

                  <strong>
                    {viewingAppointment.doctor}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Department
                  </span>

                  <strong>
                    {viewingAppointment.department}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Date
                  </span>

                  <strong>
                    {viewingAppointment.date}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Time
                  </span>

                  <strong>
                    {viewingAppointment.time}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Status
                  </span>

                  <strong
                    className={`appointment-status ${
                      viewingAppointment.status
                        .toLowerCase()
                        .replace(" ", "-")
                    }`}
                  >
                    {viewingAppointment.status}
                  </strong>

                </div>

              </div>

              <div className="medical-summary">

                <h4>
                  Appointment Information
                </h4>

                <p>
                  This appointment is scheduled for{" "}
                  <strong>
                    {viewingAppointment.patient}
                  </strong>{" "}
                  with{" "}
                  <strong>
                    {viewingAppointment.doctor}
                  </strong>{" "}
                  in the{" "}
                  <strong>
                    {viewingAppointment.department}
                  </strong>{" "}
                  department.
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Appointments;