import { useState, useEffect } from "react"

import { useNavigate } from "react-router-dom"

import { loginUser } from "../services/api"

export default function LoginPage() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState("")

  const [messageType, setMessageType] = useState("")

  const [formData, setFormData] = useState({

    username: "",

    password: "",
  })

  // =====================================================
  // AUTO LOGIN CHECK
  // =====================================================

  useEffect(() => {

    const token = localStorage.getItem("token")

    if (token) {

      navigate("/dashboard")

    }

  }, [])

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  function handleChange(e) {

    const { name, value } = e.target

    setFormData({

      ...formData,

      [name]: value,
    })

  }

  // =====================================================
  // LOGIN
  // =====================================================

  async function handleSubmit(e) {

    e.preventDefault()

    setLoading(true)

    setMessage("")

    try {

      const data = await loginUser(formData)

      // =====================================================
      // SUCCESS
      // =====================================================

      if (data.success) {

        localStorage.setItem(
          "token",
          data.token
        )

        localStorage.setItem(
          "username",
          formData.username
        )

        setTimeout(() => {

          navigate("/dashboard")

        }, 1200)

      }

      // =====================================================
      // FAILED
      // =====================================================

      else {

        setMessageType("error")

        setMessage(
          data.message || "Invalid Credentials"
        )

      }

    } catch (error) {

      console.log(error)

      setMessageType("error")

      setMessage("Server Error")

    }

    setLoading(false)

  }

  return (

    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative p-6">

      {/* ===================================================== */}
      {/* BACKGROUND */}
      {/* ===================================================== */}

      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-purple-600/20 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-blue-600/20 blur-[150px] rounded-full"></div>

      {/* ===================================================== */}
      {/* LOGIN CARD */}
      {/* ===================================================== */}

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[35px] p-8">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="text-center mb-10">

          <p className="text-sm uppercase tracking-[6px] text-gray-400">

            Logistics System

          </p>

          <h1 className="text-5xl font-black text-white mt-4">

            Login

          </h1>

          <p className="text-gray-400 mt-3">

            Access your admin dashboard

          </p>

        </div>

        {/* ===================================================== */}
        {/* MESSAGE */}
        {/* ===================================================== */}

        {message && (

          <div
            className={`
              mb-6 px-5 py-4 rounded-2xl border
              transition-all duration-300

              ${messageType === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
              }
            `}
          >

            <div className="flex items-center gap-3">

              <div className="text-xl">

                {messageType === "success"
                  ? "✓"
                  : "⚠"}

              </div>

              <p className="font-medium">

                {message}

              </p>

            </div>

          </div>

        )}

        {/* ===================================================== */}
        {/* FORM */}
        {/* ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* USERNAME */}

          <div>

            <label className="block mb-3 text-gray-300 font-medium">

              Username

            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
              className="w-full bg-black/30 border border-white/10 px-5 py-4 rounded-2xl outline-none focus:border-purple-500 transition text-white"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block mb-3 text-gray-300 font-medium">

              Password

            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              className="w-full bg-black/30 border border-white/10 px-5 py-4 rounded-2xl outline-none focus:border-purple-500 transition text-white"
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-4 rounded-2xl font-black text-lg hover:scale-[1.02] transition shadow-2xl disabled:opacity-50"
          >

            {
              loading
                ? "Logging In..."
                : "Login"
            }

          </button>

        </form>

      </div>

    </div>

  )

}