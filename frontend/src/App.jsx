import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FileText,
  Pill,
  Package,
  CreditCard,
  Bot,
  BookOpen,
  Bell,
  Search,
  Plus,
  UserRound
} from "lucide-react";

import "./App.css";

import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import MedicalReports from "./pages/MedicalReports";
import Medicines from "./pages/Medicines";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import AIReportAssistant from "./pages/AIReportAssistant";
import MedicineDictionary from "./pages/MedicineDictionary";
import Prescription from "./pages/Prescription";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
const [showSettings, setShowSettings] = useState(false);
const [showHelp, setShowHelp] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    pendingReports: 0,
  });
const [dashboardDoctors, setDashboardDoctors] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] =
    useState(true);
    const [lowStockItems, setLowStockItems] = useState([]);
const [todayRevenue, setTodayRevenue] = useState(0);
const [todayPaidBills, setTodayPaidBills] = useState(0);
const [patients, setPatients] = useState([]);
const [doctors, setDoctors] = useState([]);

const [globalSearch, setGlobalSearch] = useState("");
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Format today's date for dashboard
  const formattedToday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setAppointmentsLoading(true);
const [
  patientsRes,
  doctorsRes,
  appointmentsRes,
  reportsRes,
  inventoryRes,
  billingRes,
] = await Promise.all([
fetch(`${import.meta.env.VITE_API_URL}/api/patients`),
fetch("https://hospital-management-system-rn7a.onrender.com/api/doctors"),
fetch(`${import.meta.env.VITE_API_URL}/api/appointments`),
fetch(`${import.meta.env.VITE_API_URL}/api/ai-report`),
  fetch("https://hospital-management-system-rn7a.onrender.com/api/inventory"),
  fetch("https://hospital-management-system-rn7a.onrender.com/api/billing"),
]);

       if (
  !patientsRes.ok ||
  !doctorsRes.ok ||
  !appointmentsRes.ok ||
  !reportsRes.ok ||
  !inventoryRes.ok ||
  !billingRes.ok
) {
          throw new Error(
            "Failed to load dashboard data"
          );
        }

        const patientsData = await patientsRes.json();
        const doctorsData = await doctorsRes.json();
        setDashboardDoctors(doctorsData);
        const appointments = await appointmentsRes.json();
        const reports = await reportsRes.json();
        
const inventory = await inventoryRes.json();
const bills = await billingRes.json();
setPatients(patientsData);
setDoctors(doctorsData);



// Calculate today's revenue
const paidBills = bills.filter((bill) => {
  return (
    String(bill.payment || "").trim().toLowerCase() === "paid"
  );
});

const totalRevenue = paidBills.reduce(
  (total, bill) => total + Number(bill.amount || 0),
  0
);

setTodayRevenue(totalRevenue);
setTodayPaidBills(paidBills.length);

// Calculate low-stock inventory
const lowStock = inventory.filter(
  (item) =>
    item.status === "Low Stock" ||
    item.status === "Out of Stock"
);

setLowStockItems(lowStock);

// Calculate pending reports
const pendingReports = reports.filter(
  (report) => report.status === "Pending"
);
        // Total statistics
        setDashboardStats({
          patients: patientsData.length,
          doctors: doctorsData.length,
          appointments: appointments.length,
          pendingReports: pendingReports.length,
        });

        // Today's appointments
        const today = getTodayDate();

        const todaysAppointments = appointments
          .filter((appointment) => {
            return appointment.date === today;
          })
          .sort((a, b) => {
            return String(a.time).localeCompare(
              String(b.time)
            );
          });

        setTodayAppointments(todaysAppointments);
      } catch (error) {
        console.error(
          "Dashboard data error:",
          error
        );

        setTodayAppointments([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    loadDashboardData();
  },  [activePage]);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      icon: Users,
      label: "Patients",
    },
    {
      icon: Stethoscope,
      label: "Doctors",
    },
    {
      icon: CalendarDays,
      label: "Appointments",
    },
    {
      icon: Pill,
      label: "Prescription",
    },
    {
      icon: FileText,
      label: "Medical Reports",
    },
    {
      icon: Pill,
      label: "Medicines",
    },
    {
      icon: Package,
      label: "Inventory",
    },
    {
      icon: CreditCard,
      label: "Billing",
    },
  ];

  // Get initials for doctor avatar
  const getDoctorInitials = (doctorName) => {
    if (!doctorName) return "DR";

    const cleanedName = doctorName
      .replace(/^Dr\.?\s*/i, "")
      .trim();

    const words = cleanedName.split(" ");

    if (words.length >= 2) {
      return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
      ).toUpperCase();
    }

    return cleanedName
      .substring(0, 2)
      .toUpperCase();
  };

  // Dashboard appointment status class
  const getAppointmentStatusClass = (status) => {
    if (status === "Confirmed") {
      return "confirmed";
    }

    if (status === "Cancelled") {
      return "cancelled";
    }

    return "waiting";
  };

  return (
    <div className="app">
<aside className="sidebar">

  {/* BRAND */}
  <div className="sidebar-brand">

    <div className="brand-icon">
      <span>✚</span>
    </div>

    <div className="brand-text">
      <h2>MediCare</h2>
      <span>Hospital Management</span>
    </div>

  </div>


  {/* MAIN MENU */}
  <div className="sidebar-section">

    <div className="sidebar-label">
      MAIN
    </div>

    {menuItems.slice(0, 4).map((item) => (
      <button
        key={item.label}
        className={`menu-item ${
          activePage === item.label ? "active" : ""
        }`}
        onClick={() => setActivePage(item.label)}
      >
        <item.icon size={18} strokeWidth={1.8} />
        <span>{item.label}</span>
      </button>
    ))}

  </div>


  {/* CLINICAL */}
  <div className="sidebar-section">

    <div className="sidebar-label">
      CLINICAL
    </div>

    {menuItems.slice(4, 7).map((item) => (
      <button
        key={item.label}
        className={`menu-item ${
          activePage === item.label ? "active" : ""
        }`}
        onClick={() => setActivePage(item.label)}
      >
        <item.icon size={18} strokeWidth={1.8} />
        <span>{item.label}</span>
      </button>
    ))}

  </div>


  {/* OPERATIONS */}
  <div className="sidebar-section">

    <div className="sidebar-label">
      OPERATIONS
    </div>

    {menuItems.slice(7, 9).map((item) => (
      <button
        key={item.label}
        className={`menu-item ${
          activePage === item.label ? "active" : ""
        }`}
        onClick={() => setActivePage(item.label)}
      >
        <item.icon size={18} strokeWidth={1.8} />
        <span>{item.label}</span>
      </button>
    ))}

  </div>

{/* AI & TOOLS */}
<div className="sidebar-section">

  <div className="sidebar-label">
    AI & TOOLS
  </div>

  <button
    className={`menu-item ${
      activePage === "AI Report Assistant" ? "active" : ""
    }`}
    onClick={() => setActivePage("AI Report Assistant")}
  >
    <FileText size={23} strokeWidth={2} />
    <span>AI Report Assistant</span>
  </button>

  <button
    className={`menu-item ${
      activePage === "Medicine Dictionary" ? "active" : ""
    }`}
    onClick={() => setActivePage("Medicine Dictionary")}
  >
    <Pill size={23} strokeWidth={2} />
    <span>Medicine Dictionary</span>
  </button>

</div>


  {/* SIDEBAR FOOTER */}
<div className="sidebar-footer">

  <button
    type="button"
    className="sidebar-footer-item"
    onClick={() => setShowSettings(true)}
  >
    <span>⚙</span>
    <span>Settings</span>
  </button>

  <button
    type="button"
    className="sidebar-footer-item"
    onClick={() => setShowHelp(true)}
  >
    <span>?</span>
    <span>Help & Support</span>
  </button>

  <div className="system-status">
    <span className="status-dot"></span>
    <span>System Online</span>
  </div>

</div>

</aside>
      {/* ================= MAIN CONTENT ================= */}

      <main className={`main-content ${activePage === "Dashboard" ? "dashboard-main" : ""}`}>
<div className="dashboard-decorations">
  <span className="deco d1">✚</span>
  <span className="deco d2">💊</span>
  <span className="deco d3">🩺</span>
  <span className="deco d4">💉</span>
  <span className="deco d5">⚕</span>
  <span className="deco d6">✚</span>
  <span className="deco d7">💊</span>
  <span className="deco d8">💉</span>

  <span className="deco d9">🩺</span>
  <span className="deco d10">✚</span>
  <span className="deco d11">💊</span>
  <span className="deco d12">⚕</span>
  <span className="deco d13">💉</span>
  <span className="deco d14">✚</span>
  <span className="deco d15">🩺</span>
  <span className="deco d16">💊</span>

  <span className="deco d17">💉</span>
  <span className="deco d18">✚</span>
  <span className="deco d19">💊</span>
  <span className="deco d20">🩺</span>
</div>
        {activePage === "Patients" ? (

          <Patients />

        ) : activePage === "Doctors" ? (

          <Doctors />

        ) : activePage === "Appointments" ? (

          <Appointments />

        ) : activePage === "Prescription" ? (

          <Prescription />

        ) : activePage === "Medical Reports" ? (

          <MedicalReports />

        ) : activePage === "Medicines" ? (

          <Medicines />

        ) : activePage === "Inventory" ? (

          <Inventory />

        ) : activePage === "Billing" ? (

          <Billing />

        ) : activePage ===
          "AI Report Assistant" ? (

          <AIReportAssistant />

        ) : activePage ===
          "Medicine Dictionary" ? (

          <MedicineDictionary />

        ) : (

          <>
            {/* ================= TOPBAR ================= */}
{/* ================= TOPBAR ================= */}

<header className="topbar">

  {/* ================= RIGHT ACTIONS ================= */}

  <div className="topbar-actions">

    <div className="search-box">

      <Search size={18} />

      <input
        type="text"
        placeholder="Search patients, doctors..."
        value={globalSearch}
        onChange={(e) =>
          setGlobalSearch(e.target.value)
        }
      />

      {globalSearch.trim() !== "" && (
        <div className="global-search-results">

          {[
            ...patients
              .filter((patient) =>
                String(patient.name || "")
                  .toLowerCase()
                  .includes(
                    globalSearch.toLowerCase()
                  )
              )
              .map((patient) => ({
                type: "Patient",
                name: patient.name,
                id: patient._id,
                page: "Patients",
              })),

            ...doctors
              .filter((doctor) =>
                String(doctor.name || "")
                  .toLowerCase()
                  .includes(
                    globalSearch.toLowerCase()
                  )
              )
              .map((doctor) => ({
                type: "Doctor",
                name: doctor.name,
                id: doctor._id,
                page: "Doctors",
              })),
          ].length > 0 ? (

            [
              ...patients
                .filter((patient) =>
                  String(patient.name || "")
                    .toLowerCase()
                    .includes(
                      globalSearch.toLowerCase()
                    )
                )
                .map((patient) => ({
                  type: "Patient",
                  name: patient.name,
                  id: patient._id,
                  page: "Patients",
                })),

              ...doctors
                .filter((doctor) =>
                  String(doctor.name || "")
                    .toLowerCase()
                    .includes(
                      globalSearch.toLowerCase()
                    )
                )
                .map((doctor) => ({
                  type: "Doctor",
                  name: doctor.name,
                  id: doctor._id,
                  page: "Doctors",
                })),
            ].map((result) => (

              <button
                key={`${result.type}-${result.id}`}
                className="global-search-result"
                onClick={() => {
                  setActivePage(result.page);
                  setGlobalSearch("");
                }}
              >

                <div>

                  <strong>
                    {result.name}
                  </strong>

                  <small>
                    {result.type}
                  </small>

                </div>

              </button>

            ))

          ) : (

            <div className="global-search-empty">
              No results found
            </div>

          )}

        </div>
      )}

    </div>


    <button className="notification">

      <Bell size={20} />

      <span></span>

    </button>


    <div className="profile">

      <div className="avatar">
        T
      </div>

      <div>

        <strong>
          Tanya
        </strong>

        <small>
          Admin
        </small>

      </div>

    </div>

  </div>


  {/* ================= CENTER MEDICARE BRAND ================= */}

  <div className="dashboard-brand">

    <div className="medicare-logo">

      <span>Medi</span>
      <strong>Care</strong>

    </div>

    <p className="medicare-tagline">
      Smarter Healthcare. Better Care.
    </p>

  </div>


  {/* ================= CENTER DASHBOARD TITLE ================= */}

  <div className="dashboard-title">

    <p className="welcome">
      Good morning, Tanya 👋
    </p>

    <h1>
      Hospital Dashboard
    </h1>

    <p className="dashboard-subtitle">
      Your hospital at a glance
    </p>

  </div>

</header>
            {/* ================= STATISTICS ================= */}

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon patients">
                  <Users size={22} />
                </div>

                <div>

                  <span>
                    Total Patients
                  </span>

                  <h2>
                    {dashboardStats.patients}
                  </h2>

                  <small className="positive">
                    Live database data
                  </small>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon doctors">
                  <Stethoscope size={22} />
                </div>

                <div>

                  <span>
                    Doctors
                  </span>

                  <h2>
                    {dashboardStats.doctors}
                  </h2>

                  <small className="positive">
                    Live database data
                  </small>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon appointments">
                  <CalendarDays size={22} />
                </div>

                <div>

                  <span>
                    Appointments
                  </span>

                  <h2>
                    {dashboardStats.appointments}
                  </h2>

                  <small className="positive">
                    Live database data
                  </small>

                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon reports">
                  <FileText size={22} />
                </div>

                <div>

                  <span>
                    Pending Reports
                  </span>

                  <h2>
                    {dashboardStats.pendingReports}
                  </h2>

                  <small className="warning">
                    Needs attention
                  </small>

                </div>

              </div>
<div className="stat-card">

  <div className="stat-icon revenue">
    ₹
  </div>

  <div>
    <span>Today's Revenue</span>

    <h2>
      ₹{todayRevenue.toLocaleString("en-IN")}
    </h2>

    <small className="positive">
      {todayPaidBills} paid bill
      {todayPaidBills !== 1 ? "s" : ""}
    </small>
  </div>

</div>
            </section>
{/* ================= MOVING DOCTORS ================= */}

<section className="dashboard-doctors-section">

  <div className="dashboard-section-heading">

    <div>
      <p className="page-eyebrow">
        OUR MEDICAL TEAM
      </p>

      <h3>
        Meet Our Doctors
      </h3>
      <p className="doctor-section-tagline">
  Expert care, trusted professionals.
</p>
    </div>

    <span>
      {dashboardDoctors.length} specialists
    </span>

  </div>

  <div className="doctor-marquee">

    <div className="doctor-marquee-track">

      {[...dashboardDoctors, ...dashboardDoctors].map(
        (doctor, index) => (

          <div
            className="dashboard-doctor-card"
            key={`${doctor._id}-${index}`}
          >

            <div className="dashboard-doctor-avatar">
              <UserRound size={28} />
            </div>

            <div className="dashboard-doctor-info">

              <strong>
                {doctor.name}
              </strong>

              <span>
                {doctor.specialization}
              </span>

              <small
                className={
                  doctor.status === "Available"
                    ? "doctor-available"
                    : "doctor-unavailable"
                }
              >
                ● {doctor.status}
              </small>

            </div>

          </div>

        )
      )}

    </div>

  </div>

</section>


            {/* ================= DASHBOARD GRID ================= */}

            <section className="dashboard-grid">

              {/* ================= TODAY'S APPOINTMENTS ================= */}

              <div className="card appointments-card">

                <div className="card-header">

                  <div>

                    <h3>
                      Today's Appointments
                    </h3>

                    <p>
                      {formattedToday}
                    </p>

                  </div>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      setActivePage(
                        "Appointments"
                      )
                    }
                  >
                    <Plus size={17} />
                    New Appointment
                  </button>

                </div>

                <div className="appointment-list">

                  {appointmentsLoading ? (

                    <div className="dashboard-empty">
                      Loading today's appointments...
                    </div>

                  ) : todayAppointments.length ===
                    0 ? (

                    <div className="dashboard-empty">
                      <CalendarDays size={24} />

                      <strong>
                        No appointments today
                      </strong>

                      <span>
                        There are no appointments
                        scheduled for today.
                      </span>
                    </div>

                  ) : (

                    todayAppointments.map(
                      (appointment) => (

                        <div
                          className="appointment"
                          key={appointment._id}
                        >

                          <div className="time">
                            {appointment.time}
                          </div>

                          <div className="doctor-avatar">
                            {getDoctorInitials(
                              appointment.doctor
                            )}
                          </div>

                          <div className="appointment-info">

                            <strong>
                              {appointment.doctor}
                            </strong>

                            <span>
                              {appointment.department}
                            </span>

                          </div>

                          <div className="patient-name">

                            <span>
                              Patient
                            </span>

                            <strong>
                              {appointment.patient}
                            </strong>

                          </div>

                          <span
                            className={`status ${getAppointmentStatusClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>

                        </div>

                      )
                    )

                  )}

                </div>

              </div>

              {/* ================= AI ASSISTANT ================= */}

              <div className="card ai-card">

                <div className="ai-header">

                  <div className="ai-icon">
                    <Bot size={24} />
                  </div>

                  <div>

                    <h3>
                      AI Medical Assistant
                    </h3>

                    <p>
                      Understand medical information
                      easily
                    </p>

                  </div>

                </div>

                <div className="ai-content">

                  <p>
                    Upload a medical report and let
                    AI explain complex medical terms
                    in simple language.
                  </p>

                  <button
                    className="ai-btn"
                    onClick={() =>
                      setActivePage(
                        "AI Report Assistant"
                      )
                    }
                  >
                    <Bot size={18} />
                    Explain a Report
                  </button>

                </div>

                <div className="ai-feature">

                  <span>✦</span>

                  <div>

                    <strong>
                      Simple explanations
                    </strong>

                    <p>
                      Medical terms → easy-to-understand
                      language
                    </p>

                  </div>

                </div>

                <div className="ai-feature">

                  <span>✦</span>

                  <div>

                    <strong>
                      Medicine information
                    </strong>

                    <p>
                      Understand what a medicine is
                      commonly used for
                    </p>

                  </div>

                </div>

              </div>

            </section>
{/* ================= INVENTORY ALERT ================= */}

<section className="inventory-alert-section">

  <div className="section-heading">

    <div>
     <h3 className="glow-green-heading">Inventory Alerts</h3>
      <p>Medicines that need attention</p>
    </div>

    <button
      className="secondary-btn"
      onClick={() => setActivePage("Inventory")}
    >
      View Inventory
    </button>

  </div>

  <div className="inventory-alert-card">

    {lowStockItems.length === 0 ? (

      <div className="dashboard-empty">
        <Package size={24} />

        <strong>
          Inventory looks good
        </strong>

        <span>
          No medicines are currently low or out of stock.
        </span>
      </div>

    ) : (

      lowStockItems.slice(0, 4).map((item) => (

        <div
          className="inventory-alert-item"
          key={item._id}
        >

          <div className="inventory-alert-icon">
            <Package size={20} />
          </div>

          <div className="inventory-alert-info">

            <strong>
              {item.name}
            </strong>

            <span>
              {item.quantity} {item.unit}
            </span>

          </div>

          <span
            className={`patient-status ${
              item.status === "Low Stock"
                ? "pending"
                : "inactive"
            }`}
          >
            {item.status}
          </span>

        </div>

      ))

    )}

  </div>

</section>
            {/* ================= QUICK ACTIONS ================= */}

            <section className="quick-section">

              <div className="section-heading">

                <div>

                  <h3 className="glow-green-heading">Quick Action</h3>

                  <p>
                    Frequently used hospital services
                  </p>

                </div>

              </div>

              <div className="quick-grid">

                <button
                  onClick={() =>
                    setActivePage("Patients")
                  }
                >
                  <Users size={22} />

                  <span>
                    Register Patient
                  </span>

                </button>

                <button
                  onClick={() =>
                    setActivePage(
                      "Appointments"
                    )
                  }
                >
                  <CalendarDays size={22} />

                  <span>
                    Book Appointment
                  </span>

                </button>

                <button
                  onClick={() =>
                    setActivePage(
                      "Medical Reports"
                    )
                  }
                >
                  <FileText size={22} />

                  <span>
                    View Reports
                  </span>

                </button>

                <button
                  onClick={() =>
                    setActivePage(
                      "Medicine Dictionary"
                    )
                  }
                >
                  <Pill size={22} />

                  <span>
                    Medicine Dictionary
                  </span>

                </button>

              </div>

            </section>

          </>
        )}

      </main>
{/* SETTINGS MODAL */}
{showSettings && (
  <div
    className="medicare-modal-overlay"
    onClick={() => setShowSettings(false)}
  >
    <div
      className="medicare-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="medicare-modal-header">
        <div>
          <h2>Settings</h2>
          <p>Manage your MediCare preferences</p>
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={() => setShowSettings(false)}
        >
          ×
        </button>
      </div>

      <div className="settings-content">

        <div className="settings-item">
          <div>
            <strong>Hospital Profile</strong>
            <span>Manage hospital information and details</span>
          </div>

          <button type="button" className="settings-action">
            Manage
          </button>
        </div>

        <div className="settings-item">
          <div>
            <strong>Notifications</strong>
            <span>Manage dashboard notifications</span>
          </div>

          <button type="button" className="settings-action">
            Configure
          </button>
        </div>

        <div className="settings-item">
          <div>
            <strong>Appearance</strong>
            <span>Customize the dashboard appearance</span>
          </div>

          <button type="button" className="settings-action">
            Customize
          </button>
        </div>

        <div className="settings-item">
          <div>
            <strong>System Status</strong>
            <span>Your hospital management system is running normally</span>
          </div>

          <span className="settings-online">
            ● Online
          </span>
        </div>

      </div>

    </div>
  </div>
)}
{/* HELP & SUPPORT MODAL */}
{showHelp && (
  <div
    className="medicare-modal-overlay"
    onClick={() => setShowHelp(false)}
  >
    <div
      className="medicare-modal"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="medicare-modal-header">
        <div>
          <h2>Help & Support</h2>
          <p>Get help using MediCare Hospital Management</p>
        </div>

        <button
          type="button"
          className="modal-close"
          onClick={() => setShowHelp(false)}
        >
          ×
        </button>
      </div>

      <div className="help-content">

        <div className="help-card">
          <div className="help-icon">?</div>

          <div>
            <strong>Getting Started</strong>
            <p>
              Use the sidebar to manage patients, doctors,
              appointments, prescriptions, reports and billing.
            </p>
          </div>
        </div>

        <div className="help-card">
          <div className="help-icon">✓</div>

          <div>
            <strong>Common Help</strong>
            <p>
              Make sure required patient and medical information
              is entered correctly before saving records.
            </p>
          </div>
        </div>

        <div className="help-card">
          <div className="help-icon">@</div>

          <div>
            <strong>Support</strong>
            <p>
              Need assistance? Contact your hospital administrator
              or project support team.
            </p>
          </div>
        </div>

      </div>

    </div>
  </div>
)}
    </div>
  );
}

export default App;