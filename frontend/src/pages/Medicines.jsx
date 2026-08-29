import { useEffect, useState } from "react";
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

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "Pain Relief",
    dosage: "",
    stock: "",
    price: "",
    expiry: "",
  });

  {/* LOAD MEDICINES FROM MONGODB */}

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/medicines"
        );

        if (!response.ok) {
          throw new Error("Failed to load medicines");
        }

        const data = await response.json();

        console.log("Medicines from MongoDB:", data);

        const formattedMedicines = data.map((medicine) => ({
          id: medicine._id,
          name: medicine.name,
          category: medicine.category,
          dosage: medicine.dosage,
          stock: medicine.stock,
          price: medicine.price,
          expiry: medicine.expiryDate,
        }));

        setMedicines(formattedMedicines);
      } catch (error) {
        console.error(
          "Failed to load medicines:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  {/* STOCK STATUS */}

  const getStockStatus = (stock) => {
    if (stock <= 10) {
      return "Low Stock";
    }

    if (stock <= 30) {
      return "Medium Stock";
    }

    return "In Stock";
  };

  {/*FILTER MEDICINES*/}
  
const totalMedicines = medicines.length;

const lowStockMedicines = medicines.filter(
  (medicine) => medicine.stock <= 10
).length;

const expiringMedicines = medicines.filter(
  (medicine) => {
    if (!medicine.expiry) return false;

    const expiryDate = new Date(medicine.expiry);

    if (isNaN(expiryDate.getTime())) return false;

    const today = new Date();

    const daysUntilExpiry =
      (expiryDate - today) /
      (1000 * 60 * 60 * 24);

    return daysUntilExpiry <= 90;
  }
).length;
  const filteredMedicines = medicines.filter(
    (medicine) => {
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

      const stockStatus =
        getStockStatus(medicine.stock);

      const matchesStock =
        stockFilter === "All" ||
        stockStatus === stockFilter;

      return matchesSearch && matchesStock;
    }
  );

  {/* RESET FORM*/}

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

  {/* ADD MODAL*/}

  const openAddModal = () => {
    setEditingMedicine(null);
    resetForm();
    setShowModal(true);
  };

  {/* EDIT MODAL*/}

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
{/*SAVE MEDICINE*/}

const handleSaveMedicine = async () => {
  console.log("1. SAVE FUNCTION STARTED");
  console.log("2. FORM DATA:", newMedicine);

  if (
    newMedicine.name.trim() === "" ||
    newMedicine.dosage.trim() === "" ||
    newMedicine.stock === "" ||
    newMedicine.price === "" ||
    newMedicine.expiry.trim() === ""
  ) {
    console.log("3. VALIDATION FAILED");
    alert("Please fill in all required fields.");
    return;
  }

  console.log("3. VALIDATION PASSED");

  const medicineData = {
    name: newMedicine.name.trim(),
    category: newMedicine.category,
    dosage: newMedicine.dosage.trim(),
    stock: Number(newMedicine.stock),
    price: Number(newMedicine.price),
    expiryDate: newMedicine.expiry.trim(),
  };

  console.log("4. MEDICINE DATA:", medicineData);

  try {
    console.log("5. SENDING POST REQUEST");

    const response = await fetch(
      "http://localhost:5000/api/medicines",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicineData),
      }
    );

    console.log("6. RESPONSE RECEIVED:", response.status);

    const savedMedicine = await response.json();

    console.log("7. SERVER RESPONSE:", savedMedicine);

    if (!response.ok) {
      throw new Error(
        savedMedicine.message ||
          "Failed to add medicine."
      );
    }

    setMedicines((currentMedicines) => [
      ...currentMedicines,
      {
        id: savedMedicine._id,
        name: savedMedicine.name,
        category: savedMedicine.category,
        dosage: savedMedicine.dosage,
        stock: savedMedicine.stock,
        price: savedMedicine.price,
        expiry: savedMedicine.expiryDate,
      },
    ]);

    alert("Medicine added successfully.");

    resetForm();
    setShowModal(false);

  } catch (error) {
    console.error("8. SAVE MEDICINE ERROR:", error);

    alert(
      error.message ||
        "Failed to save medicine."
    );
  }
};

  {/* CLOSE MODAL*/}

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
            Manage medicines, stock levels and
            expiry information.
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
      {/* PHARMACY OVERVIEW */}

<div className="pharmacy-overview">

  <div className="pharmacy-overview-content">

    <p className="page-eyebrow">
      PHARMACY OVERVIEW
    </p>

    <h3>Medicine Inventory Health</h3>

    <p>
      Monitor your medicines, stock levels and
      upcoming expiry information.
    </p>

  </div>

  <div className="pharmacy-stats">

    <div className="pharmacy-stat-card">

      <div className="pharmacy-stat-icon medicine-icon">
        <Pill size={20} />
      </div>

      <div>
        <span>Total Medicines</span>
        <strong>{totalMedicines}</strong>
      </div>

    </div>

    <div className="pharmacy-stat-card">

      <div className="pharmacy-stat-icon warning-icon">
        ⚠
      </div>

      <div>
        <span>Low Stock</span>
        <strong>{lowStockMedicines}</strong>
      </div>

    </div>

    <div className="pharmacy-stat-card">

      <div className="pharmacy-stat-icon expiry-icon">
        ⏳
      </div>

      <div>
        <span>Expiring Soon</span>
        <strong>{expiringMedicines}</strong>
      </div>

    </div>

  </div>

</div>


     {/* SEARCH + FILTER*/}

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

          <div className="patient-row table-heading">

            <span>Medicine</span>
            <span>Category</span>
            <span>Dosage</span>
            <span>Stock</span>
            <span>Price</span>
            <span>Expiry</span>
            <span>Action</span>

          </div>
          {/* MEDICINE ROWS*/}

          {loading && (
            <div className="no-results">
              Loading medicines...
            </div>
          )}

          {!loading &&
            filteredMedicines.map(
              (medicine) => {

                const stockStatus =
                  getStockStatus(
                    medicine.stock
                  );

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
                          setViewingMedicine(
                            medicine
                          )
                        }
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        className="edit-btn"
                        title="Edit medicine"
                        onClick={() =>
                          openEditModal(
                            medicine
                          )
                        }
                      >
                        <Pencil size={15} />
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          {!loading &&
            filteredMedicines.length === 0 && (
              <div className="no-results">
                No medicines found.
              </div>
            )}

        </div>

      </div>
      {/* ADD / EDIT MEDICINE MODAL */}

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

              {/* MEDICINE NAME */}

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
             {/* STOCK + PRICE*/}

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