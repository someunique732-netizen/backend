import { useNavigate } from "react-router-dom"

export default function SettingsPage() {

  const navigate = useNavigate()

  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {

    // DELETE TOKEN
    localStorage.removeItem("token")

    // REDIRECT TO LOGIN PAGE
    navigate("/")

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold">
          Settings
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Manage system settings and preferences
        </p>

      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Personal Info */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition">

          <div className="flex justify-between items-start">

            <div>

              <h2 className="text-3xl font-bold">
                Personal Info
              </h2>

              <p className="text-gray-400 mt-4">
                Manage your profile details and account information
              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-2xl">
              👤
            </div>

          </div>

          <button className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-105 transition">
            Open Profile
          </button>

        </div>

        {/* Security */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition">

          <div className="flex justify-between items-start">

            <div>

              <h2 className="text-3xl font-bold">
                Security
              </h2>

              <p className="text-gray-400 mt-4">
                Manage password and security settings
              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-2xl">
              🔒
            </div>

          </div>

          <button className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-105 transition">
            Security Settings
          </button>

        </div>

        {/* Notifications */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition">

          <div className="flex justify-between items-start">

            <div>

              <h2 className="text-3xl font-bold">
                Notifications
              </h2>

              <p className="text-gray-400 mt-4">
                Configure notifications
              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-2xl">
              🔔
            </div>

          </div>

          <button className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-105 transition">
            Manage Notifications
          </button>

        </div>

        {/* Appearance */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition">

          <div className="flex justify-between items-start">

            <div>

              <h2 className="text-3xl font-bold">
                Appearance
              </h2>

              <p className="text-gray-400 mt-4">
                Customize dashboard theme
              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center text-2xl">
              🎨
            </div>

          </div>

          <button className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-105 transition">
            Customize UI
          </button>

        </div>

        {/* System */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 hover:scale-105 transition">

          <div className="flex justify-between items-start">

            <div>

              <h2 className="text-3xl font-bold">
                System
              </h2>

              <p className="text-gray-400 mt-4">
                Monitor server and system status
              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center text-2xl">
              ⚙️
            </div>

          </div>

          <button className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-105 transition">
            System Details
          </button>

        </div>

        {/* LOGOUT */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 hover:scale-105 transition">

          <div className="flex justify-between items-start">

            <div>

              <h2 className="text-3xl font-bold">
                Logout
              </h2>

              <p className="text-white/80 mt-4">
                Securely sign out from dashboard
              </p>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              🚪
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-105 transition"
          >

            Logout Account

          </button>

        </div>

      </div>

    </div>

  )

}