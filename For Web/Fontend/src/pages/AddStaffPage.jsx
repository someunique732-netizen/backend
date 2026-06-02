import { useState } from "react"

import { useNavigate } from "react-router-dom"

import {
  createStaff,
  createUser
} from "../services/api"

export default function AddStaffPage() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({

    full_name: "",

    username: "",

    password: "",

    role: "sales",

    phone: "",

    email: "",

    address: "",

    is_active: true,
  })

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  function handleChange(e) {

    const {
      name,
      value,
      type,
      checked
    } = e.target

    setFormData({

      ...formData,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    })
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(e) {

    e.preventDefault()

    setLoading(true)

    setMessage("")

    try {

      // ============================================
      // CREATE LOGIN USER
      // ============================================

      const userResponse = await createUser({

        username: formData.username,

        password: formData.password,
      })

      console.log("USER RESPONSE:", userResponse)

      // USER CREATION FAILED
      if (!userResponse.success) {

        setMessage(
          userResponse.message ||
          "Failed To Create User"
        )

        setLoading(false)

        return
      }

      // ============================================
      // CREATE STAFF
      // ============================================

      const staffResponse = await createStaff({

        full_name: formData.full_name,

        role: formData.role,

        phone: formData.phone,

        email: formData.email,

        address: formData.address,

        is_active: formData.is_active,
      })

      console.log(
        "STAFF RESPONSE:",
        staffResponse
      )

      // SUCCESS
      if (staffResponse.id) {

        setMessage(
          "Staff Added Successfully"
        )

        setTimeout(() => {

          navigate("/staff")

        }, 1500)

      } else {

        setMessage(
          "Failed To Create Staff"
        )
      }

    } catch (error) {

      console.log(error)

      setMessage(
        error.message || "Server Error"
      )
    }

    setLoading(false)
  }

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* ===================================================== */}
      {/* BACKGROUND */}
      {/* ===================================================== */}

      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple-500/20 blur-[180px] rounded-full"></div>

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full"></div>

      {/* ===================================================== */}
      {/* TOP BAR */}
      {/* ===================================================== */}

      <div className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-8 border-b border-white/10 backdrop-blur-xl">

        <div>

          <p className="uppercase tracking-[6px] text-gray-400 text-sm">

            Staff Management

          </p>

          <h1 className="text-4xl lg:text-5xl font-black mt-2">

            Create Staff Account

          </h1>

        </div>

        <button
          onClick={() => navigate("/staff")}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-2xl transition"
        >

          Back

        </button>

      </div>

      {/* ===================================================== */}
      {/* FORM */}
      {/* ===================================================== */}

      <div className="relative z-10 flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-5xl">

          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-8 lg:p-14"
          >

            {/* GLOW */}

            <div className="absolute top-[-120px] right-[-120px] w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full"></div>

            <div className="absolute bottom-[-120px] left-[-120px] w-72 h-72 bg-blue-500/20 blur-[120px] rounded-full"></div>

            {/* ===================================================== */}
            {/* HEADER */}
            {/* ===================================================== */}

            <div className="relative z-10 flex items-center justify-between flex-wrap gap-6 mb-12">

              <div>

                <p className="uppercase tracking-[5px] text-gray-400 text-sm">

                  Employee Registration

                </p>

                <h2 className="text-5xl font-black mt-3">

                  Staff Information

                </h2>

                <p className="text-gray-400 mt-4 text-lg">

                  Create login account and employee details

                </p>

              </div>

              <div className="hidden lg:flex w-24 h-24 rounded-[30px] bg-gradient-to-br from-purple-500 to-blue-500 items-center justify-center text-5xl font-black shadow-2xl">

                +

              </div>

            </div>

            {/* ===================================================== */}
            {/* GRID */}
            {/* ===================================================== */}

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* FULL NAME */}

              <div>

                <label className="block mb-3 text-lg text-gray-300">

                  Full Name

                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                  className="w-full bg-black/30 border border-white/10 px-6 py-5 rounded-3xl outline-none focus:border-purple-500 transition"
                />

              </div>

              {/* USERNAME */}

              <div>

                <label className="block mb-3 text-lg text-gray-300">

                  Username

                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Create username"
                  className="w-full bg-black/30 border border-white/10 px-6 py-5 rounded-3xl outline-none focus:border-purple-500 transition"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block mb-3 text-lg text-gray-300">

                  Password

                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create password"
                  className="w-full bg-black/30 border border-white/10 px-6 py-5 rounded-3xl outline-none focus:border-purple-500 transition"
                />

              </div>

              {/* ROLE */}

              <div>

                <label className="block mb-3 text-lg text-gray-300">

                  Staff Role

                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 px-6 py-5 rounded-3xl outline-none focus:border-purple-500 transition"
                >

                  <option value="admin">

                    Admin

                  </option>

                  <option value="manager">

                    Manager

                  </option>

                  <option value="sales">

                    Sales Person

                  </option>

                  <option value="support">

                    Support Staff

                  </option>

                </select>

              </div>

              {/* PHONE */}

              <div>

                <label className="block mb-3 text-lg text-gray-300">

                  Phone Number

                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9800000000"
                  className="w-full bg-black/30 border border-white/10 px-6 py-5 rounded-3xl outline-none focus:border-purple-500 transition"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="block mb-3 text-lg text-gray-300">

                  Email Address

                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="w-full bg-black/30 border border-white/10 px-6 py-5 rounded-3xl outline-none focus:border-purple-500 transition"
                />

              </div>

            </div>

            {/* ADDRESS */}

            <div className="relative z-10 mt-6">

              <label className="block mb-3 text-lg text-gray-300">

                Address

              </label>

              <textarea
                rows="5"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address..."
                className="w-full bg-black/30 border border-white/10 px-6 py-5 rounded-3xl outline-none focus:border-purple-500 transition resize-none"
              />

            </div>

            {/* ACTIVE */}

            <div className="relative z-10 flex items-center justify-between bg-black/30 border border-white/10 rounded-3xl p-6 mt-8">

              <div>

                <h3 className="text-xl font-bold">

                  Active Employee

                </h3>

                <p className="text-gray-400 mt-1">

                  Enable if currently working

                </p>

              </div>

              <label className="relative inline-flex items-center cursor-pointer">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="sr-only peer"
                />

                <div className="w-16 h-9 bg-gray-700 rounded-full peer peer-checked:bg-purple-500 transition"></div>

                <div className="absolute left-1 top-1 w-7 h-7 bg-white rounded-full transition peer-checked:translate-x-7"></div>

              </label>

            </div>

            {/* MESSAGE */}

            {message && (

              <div className="relative z-10 mt-6 bg-white/5 border border-white/10 rounded-2xl p-4 text-center">

                {message}

              </div>

            )}

            {/* BUTTONS */}

            <div className="relative z-10 grid grid-cols-2 gap-5 pt-8">

              <button
                type="button"
                onClick={() => navigate("/staff")}
                className="bg-white/5 border border-white/10 py-5 rounded-3xl font-bold hover:bg-white/10 transition"
              >

                Cancel

              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 py-5 rounded-3xl font-black hover:scale-[1.02] transition shadow-2xl"
              >

                {
                  loading
                    ? "Creating Staff..."
                    : "Create Staff"
                }

              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  )
}