import { useState } from "react";
import {
  Search,
  Plus,
  Pill,
  Pencil,
  Eye,
} from "lucide-react";

function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [viewingMedicine, setViewingMedicine] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const [medicines, setMedicines] = useState([
    {
      id: "MED-00101",
      name: "Paracetamol",
      category: "Pain Relief",
      dosage: "500 mg",
      stock: 250,
      price: 2.5,
      expiry: "Dec 2027",
    },
    {
      id: "MED-00102",
      name: "Amoxicillin",
      category: "Antibiotic",
      dosage: "500 mg",
      stock: 85,
      price: 8,
      expiry: "Jun 2027",
    },
    {
      id: "MED-00103",
      name: "Cetirizine",
      category: "Allergy",
      dosage: "10 mg",
      stock: 18,
      price: 3,
      expiry: "Mar 2027",
    },
    {
      id: "MED-00104",
      name: "Omeprazole",
      category: "Gastric",
      dosage: "20 mg",
      stock: 7,
      price: 5,
      expiry: "Jan 2027",
    },
  ]);

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "Pain Relief",
    dosage: "",
    stock: "",
    price: "",
    expiry: "",
  });

  // =========================
  // STOCK STATUS
  // =========================

  const getStockStatus = (stock) => {
    if (stock <= 10) {
      return "Low Stock";
    }

    if (stock <= 30) {
      return "Medium Stock";
    }

    return "In Stock";
  };

  // =========================
  // FILTER MEDICINES
  // =========================

  const filteredMedicines = medicines.filter((medicine) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      `${medicine.name}
       ${medicine.id}
       ${medicine.category}
       ${medicine.dosage}
       ${medicine.stock}
       ${medicine.price}
       ${medicine.expiry}`
        .toLowerCase()
        .includes(search);

    const stockStatus = getStockStatus(medicine.stock);

    const matchesStock =
      stockFilter === "All" ||
      stockStatus === stockFilter;

    return matchesSearch && matchesStock;
  });

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setNewMedicine({
      name: "",
      category: "Pain Relief",
      dosage: "",
      stock: "",
      price: "",
      expiry: "",
    });
  };

  // =========================
  // ADD MODAL
  // =========================

  const openAddModal = () => {
    setEditingMedicine(null);
    resetForm();
    setShowModal(true);
  };

  // =========================
  // EDIT MODAL
  // =========================

  const openEditModal = (medicine) => {
    setEditingMedicine(medicine);

    setNewMedicine({
      name: medicine.name,
      category: medicine.category,
      dosage: medicine.dosage,
      stock: String(medicine.stock),
      price: String(medicine.price),
      expiry: medicine.expiry,
    });

    setShowModal(true);
  };

  // =========================
  // SAVE MEDICINE
  // =========================

  const handleSaveMedicine = () => {
    if (
      !newMedicine.name ||
      !newMedicine.dosage ||
      !newMedicine.stock ||
      !newMedicine.price ||
      !newMedicine.expiry
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // EDIT
    if (editingMedicine) {
      setMedicines((currentMedicines) =>
        currentMedicines.map((medicine) =>
          medicine.id === editingMedicine.id
            ? {
                ...medicine,
                name: newMedicine.name,
                category: newMedicine.category,
                dosage: newMedicine.dosage,
                stock: Number(newMedicine.stock),
                price: Number(newMedicine.price),
                expiry: newMedicine.expiry,
              }
            : medicine
        )
      );

      setEditingMedicine(null);
      resetForm();
      setShowModal(false);

      return;
    }

    // ADD
    const newId = `MED-${String(
      101 + medicines.length
    ).padStart(5, "0")}`;

    const medicine = {
      id: newId,
      name: newMedicine.name,
      category: newMedicine.category,
      dosage: newMedicine.dosage,
      stock: Number(newMedicine.stock),
      price: Number(newMedicine.price),
      expiry: newMedicine.expiry,
    };

    setMedicines((currentMedicines) => [
      ...currentMedicines,
      medicine,
    ]);

    resetForm();
    setShowModal(false);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setEditingMedicine(null);
    resetForm();
  };

  return (
    <div className="page-content">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <p className="page-eyebrow">
            PHARMACY MANAGEMENT
          </p>

          <h2>Medicines</h2>

          <p className="page-description">
            Manage medicines, stock levels and expiry information.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add Medicine
        </button>

      </div>

      {/* SEARCH + FILTER */}

      <div className="patient-toolbar">

        <div className="patient-search">

          <Search size={18} />

          <input
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <select
          className="filter-btn"
          value={stockFilter}
          onChange={(e) =>
            setStockFilter(e.target.value)
          }
        >

          <option value="All">
            All Medicines
          </option>

          <option value="In Stock">
            In Stock
          </option>

          <option value="Medium Stock">
            Medium Stock
          </option>

          <option value="Low Stock">
            Low Stock
          </option>

        </select>

      </div>

      {/* MEDICINE TABLE */}

      <div className="patient-table-card">

        <div className="patient-table-header">

          <h3>
            Medicine Inventory
          </h3>

          <span>
            {filteredMedicines.length} medicines
          </span>

        </div>

        <div className="patient-table">

          {/* HEADER */}

          <div className="patient-row table-heading">

            <span>Medicine</span>
            <span>Category</span>
            <span>Dosage</span>
            <span>Stock</span>
            <span>Price</span>
            <span>Expiry</span>
            <span>Action</span>

          </div>

          {/* ROWS */}

          {filteredMedicines.map((medicine) => {

            const stockStatus =
              getStockStatus(medicine.stock);

            return (
              <div
                className="patient-row"
                key={medicine.id}
              >

                {/* MEDICINE */}

                <div className="patient-name-cell">

                  <div className="patient-avatar">

                    <Pill size={18} />

                  </div>

                  <div>

                    <strong>
                      {medicine.name}
                    </strong>

                    <small>
                      {medicine.id}
                    </small>

                  </div>

                </div>

                {/* CATEGORY */}

                <span>
                  {medicine.category}
                </span>

                {/* DOSAGE */}

                <span>
                  {medicine.dosage}
                </span>

                {/* STOCK */}

                <div>

                  <strong>
                    {medicine.stock}
                  </strong>

                  <small
                    style={{
                      display: "block",
                      marginTop: "3px",
                    }}
                  >
                    {stockStatus}
                  </small>

                </div>

                {/* PRICE */}

                <span>
                  ₹{medicine.price}
                </span>

                {/* EXPIRY */}

                <span>
                  {medicine.expiry}
                </span>

                {/* ACTIONS */}

                <div className="doctor-actions">

                  <button
                    className="view-btn"
                    title="View medicine"
                    onClick={() =>
                      setViewingMedicine(medicine)
                    }
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    className="edit-btn"
                    title="Edit medicine"
                    onClick={() =>
                      openEditModal(medicine)
                    }
                  >
                    <Pencil size={15} />
                  </button>

                </div>

              </div>
            );
          })}

          {/* NO RESULTS */}

          {filteredMedicines.length === 0 && (

            <div className="no-results">
              No medicines found.
            </div>

          )}

        </div>

      </div>

      {/* ADD / EDIT MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  PHARMACY MANAGEMENT
                </p>

                <h3>
                  {editingMedicine
                    ? "Edit Medicine"
                    : "Add New Medicine"}
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

              {/* NAME */}

              <div className="form-group">

                <label>
                  Medicine Name
                </label>

                <input
                  placeholder="Enter medicine name"
                  value={newMedicine.name}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      name: e.target.value,
                    })
                  }
                />

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  value={newMedicine.category}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      category: e.target.value,
                    })
                  }
                >

                  <option>
                    Pain Relief
                  </option>

                  <option>
                    Antibiotic
                  </option>

                  <option>
                    Allergy
                  </option>

                  <option>
                    Gastric
                  </option>

                  <option>
                    Fever
                  </option>

                  <option>
                    Vitamin
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>

              {/* DOSAGE */}

              <div className="form-group">

                <label>
                  Dosage
                </label>

                <input
                  placeholder="e.g. 500 mg"
                  value={newMedicine.dosage}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      dosage: e.target.value,
                    })
                  }
                />

              </div>

              {/* STOCK + PRICE */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Enter quantity"
                    value={newMedicine.stock}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        stock: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price per unit"
                    value={newMedicine.price}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        price: e.target.value,
                      })
                    }
                  />

                </div>

              </div>

              {/* EXPIRY */}

              <div className="form-group">

                <label>
                  Expiry
                </label>

                <input
                  placeholder="e.g. Dec 2027"
                  value={newMedicine.expiry}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      expiry: e.target.value,
                    })
                  }
                />

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
                  onClick={handleSaveMedicine}
                >
                  {editingMedicine
                    ? "Save Changes"
                    : "Add Medicine"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* VIEW MEDICINE */}

      {viewingMedicine && (

        <div className="modal-overlay">

          <div className="patient-modal">

            <div className="modal-header">

              <div>

                <p className="page-eyebrow">
                  MEDICINE RECORD
                </p>

                <h3>
                  Medicine Details
                </h3>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setViewingMedicine(null)
                }
              >
                ×
              </button>

            </div>

            <div className="patient-details">

              {/* PROFILE */}

              <div className="patient-details-profile">

                <div className="patient-details-avatar">

                  <Pill size={32} />

                </div>

                <div>

                  <h2>
                    {viewingMedicine.name}
                  </h2>

                  <p>
                    {viewingMedicine.id}
                  </p>

                </div>

              </div>

              {/* DETAILS */}

              <div className="details-grid">

                <div className="detail-item">

                  <span>
                    Category
                  </span>

                  <strong>
                    {viewingMedicine.category}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Dosage
                  </span>

                  <strong>
                    {viewingMedicine.dosage}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Stock
                  </span>

                  <strong>
                    {viewingMedicine.stock} units
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Price
                  </span>

                  <strong>
                    ₹{viewingMedicine.price}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Expiry
                  </span>

                  <strong>
                    {viewingMedicine.expiry}
                  </strong>

                </div>

                <div className="detail-item">

                  <span>
                    Stock Status
                  </span>

                  <strong>
                    {getStockStatus(
                      viewingMedicine.stock
                    )}
                  </strong>

                </div>

              </div>

              {/* INFORMATION */}

              <div className="medical-summary">

                <h4>
                  Medicine Information
                </h4>

                <p>
                  This section will later be connected
                  with the Medicine Dictionary and AI
                  assistant to explain the medicine's
                  common uses, precautions and general
                  information in simple language.
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Medicines;