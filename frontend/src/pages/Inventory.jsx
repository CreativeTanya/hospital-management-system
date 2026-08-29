import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Package,
  Pencil,
  Eye,
} from "lucide-react";

function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

const [items, setItems] = useState([]);

const [newItem, setNewItem] = useState({
  name: "",
  category: "Tablet",
  supplier: "",
  quantity: "",
  unit: "Strips",
  price: "",
  status: "In Stock",
});

useEffect(() => {
  const loadInventory = async () => {
    try {
      const response = await fetch(
        "https://hospital-management-system-rn7a.onrender.com/api/inventory"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load inventory."
        );
      }

      setItems(
        data.map((item) => ({
          id: item._id,
          name: item.name,
          category: item.category,
          supplier: item.supplier,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
          status: item.status,
        }))
      );
    } catch (error) {
      console.error(
        "Load inventory error:",
        error
      );
    }
  };

  loadInventory();
}, []);

  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      `${item.name} ${item.id} ${item.category} ${item.supplier} ${item.status}`
        .toLowerCase()
        .includes(search);

    const matchesStock =
      stockFilter === "All" || item.status === stockFilter;

    return matchesSearch && matchesStock;
  });

  const resetForm = () => {
    setNewItem({
      name: "",
      category: "Tablet",
      supplier: "",
      quantity: "",
      unit: "Strips",
      price: "",
      status: "In Stock",
    });
  };

 const handleAddItem = async () => {
  if (
    !newItem.name ||
    !newItem.supplier ||
    newItem.quantity === "" ||
    newItem.price === ""
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch(
      "https://hospital-management-system-rn7a.onrender.com/api/inventory",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          supplier: newItem.supplier,
          quantity: Number(newItem.quantity),
          unit: newItem.unit,
          price: Number(newItem.price),
          status: newItem.status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to add inventory item."
      );
    }

    const savedItem = data.item || data;

    setItems((currentItems) => [
      ...currentItems,
      {
        id: savedItem._id,
        name: savedItem.name,
        category: savedItem.category,
        supplier: savedItem.supplier,
        quantity: savedItem.quantity,
        unit: savedItem.unit,
        price: savedItem.price,
        status: savedItem.status,
      },
    ]);

    resetForm();
    setShowModal(false);

    alert("Inventory item added successfully.");
  } catch (error) {
    console.error(
      "Add inventory error:",
      error
    );

    alert(
      error.message ||
        "Failed to add inventory item."
    );
  }
};
const handleEditItem = async () => {
  if (
    !newItem.name ||
    !newItem.supplier ||
    newItem.quantity === "" ||
    newItem.price === ""
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch(
      `https://hospital-management-system-rn7a.onrender.com/api/inventory/${editingItem.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          supplier: newItem.supplier,
          quantity: Number(newItem.quantity),
          unit: newItem.unit,
          price: Number(newItem.price),
          status: newItem.status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update inventory item."
      );
    }

    const updatedItem = data.item || data;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === editingItem.id
          ? {
              id: updatedItem._id,
              name: updatedItem.name,
              category: updatedItem.category,
              supplier: updatedItem.supplier,
              quantity: updatedItem.quantity,
              unit: updatedItem.unit,
              price: updatedItem.price,
              status: updatedItem.status,
            }
          : item
      )
    );

    resetForm();
    setEditingItem(null);
    setShowModal(false);

    alert("Inventory item updated successfully.");
  } catch (error) {
    console.error(
      "Update inventory error:",
      error
    );

    alert(
      error.message ||
        "Failed to update inventory item."
    );
  }
};

  const openAddModal = () => {
    setEditingItem(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);

    setNewItem({
      name: item.name,
      category: item.category,
      supplier: item.supplier,
      quantity: String(item.quantity),
      unit: item.unit,
      price: String(item.price),
      status: item.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    resetForm();
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">INVENTORY MANAGEMENT</p>
         <h2 >Inventory</h2>
        
          <p className="page-description">
            Manage medicines, stock levels and suppliers.
          </p>
        </div>

        <button className="primary-btn" onClick={openAddModal}>
          <Plus size={17} />
          Add Item
        </button>
      </div>

      <div className="patient-toolbar">
        <div className="patient-search">
          <Search size={18} />

          <input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-btn"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="All">All Items</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <div className="patient-table-card">
        <div className="patient-table-header">
          <h3>Inventory Records</h3>
          <span>{filteredItems.length} items</span>
        </div>

        <div className="patient-table">
          <div className="patient-row table-heading">
            <span>Medicine</span>
            <span>Category</span>
            <span>Supplier</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {filteredItems.map((item) => (
            <div className="patient-row" key={item.id}>
             <div className="patient-name-cell inventory-medicine-cell">
                <div className="patient-avatar">
                  <Package size={18} />
                </div>

                <div>
                  <strong>{item.name}</strong>
                  <small>{item.id}</small>
                </div>
              </div>

              <span>{item.category}</span>

              <span>{item.supplier}</span>

              <span>
                {item.quantity} {item.unit}
              </span>

              <span>₹{item.price}</span>

              <span
                className={`patient-status ${
                  item.status === "In Stock"
                    ? "active"
                    : item.status === "Low Stock"
                    ? "pending"
                    : "inactive"
                }`}
              >
                {item.status}
              </span>

              <div className="doctor-actions">
                <button
                  className="view-btn"
                  title="View item"
                  onClick={() => setViewingItem(item)}
                >
                  <Eye size={15} />
                </button>

                <button
                  className="edit-btn"
                  title="Edit item"
                  onClick={() => openEditModal(item)}
                >
                  <Pencil size={15} />
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="no-results">
              No inventory items found.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="patient-modal">
            <div className="modal-header">
              <div>
                <p className="page-eyebrow">INVENTORY MANAGEMENT</p>
                <h3>
                  {editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
                </h3>
              </div>

              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="patient-form">
              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  placeholder="Enter medicine name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        category: e.target.value,
                      })
                    }
                  >
                    <option>Tablet</option>
                    <option>Capsule</option>
                    <option>Injection</option>
                    <option>Syrup</option>
                    <option>Cream</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Supplier</label>
                  <input
                    placeholder="Enter supplier"
                    value={newItem.supplier}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        supplier: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter quantity"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        unit: e.target.value,
                      })
                    }
                  >
                    <option>Strips</option>
                    <option>Boxes</option>
                    <option>Vials</option>
                    <option>Bottles</option>
                    <option>Pieces</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter price"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        price: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newItem.status}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        status: e.target.value,
                      })
                    }
                  >
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={closeModal}>
                  Cancel
                </button>

                <button
                  className="primary-btn"
                  onClick={
                    editingItem
                      ? handleEditItem
                      : handleAddItem
                  }
                >
                  {editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingItem && (
        <div className="modal-overlay">
          <div className="patient-modal">
            <div className="modal-header">
              <div>
                <p className="page-eyebrow">INVENTORY RECORD</p>
                <h3>Item Details</h3>
              </div>

              <button
                className="modal-close"
                onClick={() => setViewingItem(null)}
              >
                ×
              </button>
            </div>

            <div className="patient-details">
              <div className="patient-details-profile">
                <div className="patient-details-avatar">
                  <Package size={32} />
                </div>

                <div>
                  <h2>{viewingItem.name}</h2>
                  <p>{viewingItem.id}</p>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <span>Category</span>
                  <strong>{viewingItem.category}</strong>
                </div>

                <div className="detail-item">
                  <span>Supplier</span>
                  <strong>{viewingItem.supplier}</strong>
                </div>

                <div className="detail-item">
                  <span>Quantity</span>
                  <strong>
                    {viewingItem.quantity} {viewingItem.unit}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>Price</span>
                  <strong>₹{viewingItem.price}</strong>
                </div>

                <div className="detail-item">
                  <span>Status</span>
                  <strong>{viewingItem.status}</strong>
                </div>
              </div>

              <div className="medical-summary">
                <h4>Inventory Information</h4>
                <p>
                  Inventory levels can later be connected to automatic
                  low-stock alerts, supplier management and purchase records.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;