import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Receipt,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/billing";

const emptyBill = {
  patient: "",
  doctor: "",
  service: "General Consultation",
  amount: "",
  date: "",
  payment: "Pending",
};

function Billing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [viewingBill, setViewingBill] = useState(null);
  const [editingBill, setEditingBill] = useState(null);

  const [bills, setBills] = useState([]);

  const [newBill, setNewBill] = useState(emptyBill);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load bills from MongoDB
  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch billing records");
      }

      const data = await response.json();

      setBills(data);
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
    fetchBills();
  }, []);

  // Filter bills
  const filteredBills = bills.filter((bill) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      `${bill.patient}
       ${bill.doctor}
       ${bill._id}
       ${bill.service}
       ${bill.date}
       ${bill.payment}`
        .toLowerCase()
        .includes(search);

    const matchesPayment =
      paymentFilter === "All" ||
      bill.payment === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  // Reset form
  const resetForm = () => {
    setNewBill(emptyBill);
  };

  // Add bill
  const handleAddBill = async () => {
    if (
      !newBill.patient ||
      !newBill.doctor ||
      !newBill.amount ||
      !newBill.date
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
          patient: newBill.patient,
          doctor: newBill.doctor,
          service: newBill.service,
          amount: Number(newBill.amount),
          date: newBill.date,
          payment: newBill.payment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create bill"
        );
      }

      setBills((currentBills) => [
        data,
        ...currentBills,
      ]);

      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create bill.");
    }
  };

  // Edit bill
  const handleEditBill = async () => {
    if (
      !newBill.patient ||
      !newBill.doctor ||
      !newBill.amount ||
      !newBill.date
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${editingBill._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            patient: newBill.patient,
            doctor: newBill.doctor,
            service: newBill.service,
            amount: Number(newBill.amount),
            date: newBill.date,
            payment: newBill.payment,
          }),
        }
      );

      const updatedBill = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedBill.message ||
            "Failed to update bill"
        );
      }

      setBills((currentBills) =>
        currentBills.map((bill) =>
          bill._id === editingBill._id
            ? updatedBill
            : bill
        )
      );

      resetForm();
      setEditingBill(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update bill.");
    }
  };

  // Delete bill
  const handleDeleteBill = async (bill) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the bill for ${bill.patient}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/${bill._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete bill"
        );
      }

      setBills((currentBills) =>
        currentBills.filter(
          (currentBill) =>
            currentBill._id !== bill._id
        )
      );

      if (
        viewingBill &&
        viewingBill._id === bill._id
      ) {
        setViewingBill(null);
      }

      alert("Bill deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete bill.");
    }
  };

  // Open add modal
  const openAddModal = () => {
    setEditingBill(null);
    resetForm();
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (bill) => {
    setEditingBill(bill);

    setNewBill({
      patient: bill.patient || "",
      doctor: bill.doctor || "",
      service:
        bill.service || "General Consultation",
      amount: bill.amount ?? "",
      date: bill.date || "",
      payment: bill.payment || "Pending",
    });

    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingBill(null);
    resetForm();
  };

  return (
    <div className="page-content">

      {/* Page Header */}

      <div className="page-header">

        <div>

          <p className="page-eyebrow">
            BILLING MANAGEMENT
          </p>

          <h2>Billing</h2>

          <p className="page-description">
            Manage hospital invoices and payment
            records.
          </p>

        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          New Bill
        </button>

      </div>

      {/* Search + Filter */}

      <div className="patient-toolbar">

        <div className="patient-search">

          <Search size={18} />

          <input
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <select
          className="filter-btn"
          value={paymentFilter}
          onChange={(e) =>
            setPaymentFilter(e.target.value)
          }
        >

          <option value="All">
            All Payments
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>

      {/* Billing Table */}

      <div className="patient-table-card">

        <div className="patient-table-header">

          <h3>
            Billing Records
          </h3>

          <span>
            {filteredBills.length} bills
          </span>

        </div>

        {loading ? (

          <div className="patient-loading">
            Loading billing records...
          </div>

        ) : error ? (

          <div className="patient-error">

            {error}

            <button onClick={fetchBills}>
              Retry
            </button>

          </div>

        ) : (

          <div className="patient-table">

            <div className="billing-row table-heading">

              <span>Patient</span>

              <span>Doctor</span>

              <span>Service</span>

              <span>Amount</span>

              <span>Date</span>

              <span>Payment</span>

              <span>Action</span>

            </div>

            {filteredBills.map((bill) => (

              <div
                className="billing-row"
                key={bill._id}
              >

                {/* Patient */}

                <div className="patient-name-cell">

                  <div className="patient-avatar">
                    <Receipt size={18} />
                  </div>

                  <div>

                    <strong>
                      {bill.patient}
                    </strong>

                    <small>
                      {bill._id.slice(-8)}
                    </small>

                  </div>

                </div>

                {/* Doctor */}

                <span>
                  {bill.doctor}
                </span>

                {/* Service */}

                <span>
                  {bill.service}
                </span>

                {/* Amount */}

                <strong>
                  ₹{bill.amount}
                </strong>

                {/* Date */}

                <span>
                  {bill.date}
                </span>

                {/* Payment */}

                <span
                  className={`appointment-status ${
                    bill.payment
                      .toLowerCase()
                      .replace(" ", "-")
                  }`}
                >
                  {bill.payment}
                </span>

                {/* Actions */}

                <div className="doctor-actions">

                  <button
                    className="view-btn"
                    title="View bill"
                    onClick={() =>
                      setViewingBill(bill)
                    }
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    className="edit-btn"
                    title="Edit bill"
                    onClick={() =>
                      openEditModal(bill)
                    }
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    className="delete-btn"
                    title="Delete bill"
                    onClick={() =>
                      handleDeleteBill(bill)
                    }
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            ))}

            {!loading &&
              filteredBills.length === 0 && (

                <div className="no-results">
                  No billing records found.
                </div>

              )}

          </div>

        )}

      </div>

      {/* Add/Edit Bill Modal */}

      {showModal && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  BILLING MANAGEMENT
                </p>

                <h3>
                  {editingBill
                    ? "Edit Bill"
                    : "New Bill"}
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
                  Patient Name
                </label>

                <input
                  placeholder="Enter patient name"
                  value={newBill.patient}
                  onChange={(e) =>
                    setNewBill({
                      ...newBill,
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
                  placeholder="Enter doctor name"
                  value={newBill.doctor}
                  onChange={(e) =>
                    setNewBill({
                      ...newBill,
                      doctor: e.target.value,
                    })
                  }
                />

              </div>

              {/* Service */}

              <div className="form-group">

                <label>
                  Service
                </label>

                <select
                  value={newBill.service}
                  onChange={(e) =>
                    setNewBill({
                      ...newBill,
                      service: e.target.value,
                    })
                  }
                >

                  <option>
                    General Consultation
                  </option>

                  <option>
                    Cardiology Consultation
                  </option>

                  <option>
                    Neurology Consultation
                  </option>

                  <option>
                    Orthopedic Consultation
                  </option>

                  <option>
                    Laboratory Test
                  </option>

                  <option>
                    Medicine Charges
                  </option>

                </select>

              </div>

              {/* Amount + Date */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Enter amount"
                    value={newBill.amount}
                    onChange={(e) =>
                      setNewBill({
                        ...newBill,
                        amount: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    value={newBill.date}
                    onChange={(e) =>
                      setNewBill({
                        ...newBill,
                        date: e.target.value,
                      })
                    }
                  />

                </div>

              </div>

              {/* Payment */}

              <div className="form-group">

                <label>
                  Payment Status
                </label>

                <select
                  value={newBill.payment}
                  onChange={(e) =>
                    setNewBill({
                      ...newBill,
                      payment: e.target.value,
                    })
                  }
                >

                  <option>
                    Pending
                  </option>

                  <option>
                    Paid
                  </option>

                  <option>
                    Cancelled
                  </option>

                </select>

              </div>

              {/* Buttons */}

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
                    editingBill
                      ? handleEditBill
                      : handleAddBill
                  }
                >
                  {editingBill
                    ? "Save Changes"
                    : "Create Bill"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* View Bill Modal */}

      {viewingBill && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  BILLING RECORD
                </p>

                <h3>
                  Bill Details
                </h3>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setViewingBill(null)
                }
              >
                ×
              </button>

            </div>

            <div className="patient-details">

              <div className="patient-details-profile">

                <div className="patient-details-avatar">
                  <Receipt size={32} />
                </div>

                <div>

                  <h2>
                    {viewingBill.patient}
                  </h2>

                  <p>
                    {viewingBill._id}
                  </p>

                </div>

              </div>

              <div className="details-grid">

                <div className="detail-item">

                  <span>
                    Doctor
                  </span>

                  <strong>
                    {viewingBill.doctor}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Service
                  </span>

                  <strong>
                    {viewingBill.service}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Amount
                  </span>

                  <strong>
                    ₹{viewingBill.amount}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Date
                  </span>

                  <strong>
                    {viewingBill.date}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Payment Status
                  </span>

                  <strong>
                    {viewingBill.payment}
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Billing;