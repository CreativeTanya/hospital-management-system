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

  const [dashboardStats, setDashboardStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    pendingReports: 0,
  });

  const [todayAppointments, setTodayAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] =
    useState(true);

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
] = await Promise.all([
  fetch("http://localhost:5000/api/patients"),
  fetch("http://localhost:5000/api/doctors"),
  fetch("http://localhost:5000/api/appointments"),
  fetch("http://localhost:5000/api/ai-report"),
]);

        if (
          !patientsRes.ok ||
          !doctorsRes.ok ||
          !appointmentsRes.ok
        ) {
          throw new Error(
            "Failed to load dashboard data"
          );
        }

        const patients = await patientsRes.json();
        const doctors = await doctorsRes.json();
        const appointments = await appointmentsRes.json();
        const reports = await reportsRes.json();

const pendingReports = reports.filter(
  (report) => report.status === "Pending"
);
        // Total statistics
        setDashboardStats({
          patients: patients.length,
          doctors: doctors.length,
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

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">
            ✚
          </div>

          <div>
            <h2>MediCare</h2>
            <span>
              Hospital Management
            </span>
          </div>

        </div>

        <nav className="navigation">

          <p className="nav-title">
            MAIN MENU
          </p>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() =>
                  setActivePage(item.label)
                }
                className={`nav-item ${
                  activePage === item.label
                    ? "active"
                    : ""
                }`}
              >
                <Icon size={19} />
                <span>
                  {item.label}
                </span>
              </button>
            );
          })}

          <p className="nav-title tools-title">
            AI & TOOLS
          </p>

          <button
            className={`nav-item ${
              activePage ===
              "AI Report Assistant"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                "AI Report Assistant"
              )
            }
          >
            <Bot size={19} />
            <span>
              AI Report Assistant
            </span>
          </button>

          <button
            className={`nav-item ${
              activePage ===
              "Medicine Dictionary"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(
                "Medicine Dictionary"
              )
            }
          >
            <BookOpen size={19} />
            <span>
              Medicine Dictionary
            </span>
          </button>

        </nav>

        <div className="sidebar-user">

          <div className="avatar">
            T
          </div>

          <div>
            <strong>Tanya</strong>
            <span>Administrator</span>
          </div>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

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

            <header className="topbar">

              <div>

                <p className="welcome">
                  Good morning, Tanya 👋
                </p>

                <h1>
                  Hospital Dashboard
                </h1>

              </div>

              <div className="topbar-actions">

                <div className="search-box">

                  <Search size={18} />

                  <input
                    placeholder="Search patients, doctors..."
                  />

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

            {/* ================= QUICK ACTIONS ================= */}

            <section className="quick-section">

              <div className="section-heading">

                <div>

                  <h3>
                    Quick Actions
                  </h3>

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

    </div>
  );
}

export default App;