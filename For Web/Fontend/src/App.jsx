import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom"

import Sidebar from "./components/Sidebar"

import Dashboard from "./pages/Dashboard"
import CustomerPage from "./pages/Customer_page"
import OrderPage from "./pages/Order_page"
import SettingsPage from "./pages/Setting_page"
import StockPage from "./pages/Stock_page"
import StaffPage from "./pages/Staff_page"
import AddStaffPage from "./pages/AddStaffPage"
import AddItemPage from "./pages/AddItemPage"
import LoginPage from "./pages/LoginPage"
import CreateOrderPage from "./pages/CreateOrderPage"
import ReportPage from "./pages/ReportPage"

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token")

  return token
    ? children
    : <Navigate to="/" />
}

// =====================================================
// LAYOUT
// =====================================================

function Layout() {

  const location = useLocation()

  const isLoginPage = location.pathname === "/"

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex">

      {/* SIDEBAR HIDE ON LOGIN PAGE */}

      {!isLoginPage && <Sidebar />}

      {/* MAIN */}

      <main className={`flex-1 overflow-auto ${!isLoginPage ? "ml-72" : ""}`}>

        <Routes>

          {/* ===================================================== */}
          {/* LOGIN */}
          {/* ===================================================== */}

          <Route
            path="/"
            element={<LoginPage />}
          />

          {/* ===================================================== */}
          {/* DASHBOARD */}
          {/* ===================================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ===================================================== */}
          {/* CUSTOMERS */}
          {/* ===================================================== */}

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomerPage />
              </ProtectedRoute>
            }
          />

          {/* ===================================================== */}
          {/* ORDERS */}
          {/* ===================================================== */}

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          {/* ===================================================== */}
          {/* STOCK */}
          {/* ===================================================== */}

          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <StockPage />
              </ProtectedRoute>
            }
          />

          {/* ===================================================== */}
          {/* SETTINGS */}
          {/* ===================================================== */}

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* ===================================================== */}
          {/* STAFF */}
          {/* ===================================================== */}

          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <StaffPage />
              </ProtectedRoute>
            }
          />

          {/* ===================================================== */}
          {/* ADD STAFF */}
          {/* ===================================================== */}

          <Route
            path="/staff/add-staff"
            element={
              <ProtectedRoute>
                <AddStaffPage />
              </ProtectedRoute>
            }
          />

          {/* ===================================================== */}
          {/* ADD ITEM */}
          {/* ===================================================== */}

          <Route
            path="/stock/add-item"
            element={
              <ProtectedRoute>
                <AddItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createorder"
            element={<CreateOrderPage />}
            
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />

        </Routes>

      </main>

    </div>
  )
}

// =====================================================
// APP
// =====================================================

export default function App() {

  return (

    <BrowserRouter>

      <Layout />

    </BrowserRouter>

  )
}