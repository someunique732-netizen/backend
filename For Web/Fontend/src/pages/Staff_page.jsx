import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  getStaff,
  deleteStaffApi
} from "../services/api"



export default function StaffPage() {

  const navigate = useNavigate()

  const [staff, setStaff] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")



  // =================================================
  // FETCH STAFF
  // =================================================

  const fetchStaff = async () => {

    try {

      const data = await getStaff()

      setStaff(data)

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }



  // =================================================
  // DELETE STAFF
  // =================================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this staff?"
    )

    if (!confirmDelete) return

    try {

      await deleteStaffApi(id)

      setStaff(
        staff.filter(
          (member) => member.id !== id
        )
      )

    } catch (error) {

      console.error(error)
    }
  }



  // =================================================
  // LOAD DATA
  // =================================================

  useEffect(() => {

    fetchStaff()

  }, [])



  // =================================================
  // SEARCH
  // =================================================

  const filteredStaff = staff.filter((member) =>

    member.full_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  )



  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div>

          <h1 className="text-5xl font-bold">
            Staff Management
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Manage company staff and employees
          </p>

        </div>

        <div className="flex gap-4 flex-wrap">

          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-white/10 border border-white/10 px-5 py-4 rounded-2xl outline-none w-72 backdrop-blur-xl"
          />

          <button onClick={() => navigate("/staff/add-staff")} className="bg-white text-black px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition">
            Add Staff
            
          </button>

        </div>

      </div>



      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">

          <p className="text-gray-400">
            Total Staff
          </p>

          <h2 className="text-4xl font-bold mt-4">
            {staff.length}
          </h2>

        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">

          <p className="text-gray-400">
            Active
          </p>

          <h2 className="text-4xl font-bold mt-4 text-green-400">

            {
              staff.filter(
                (s) => s.is_active
              ).length
            }

          </h2>

        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">

          <p className="text-gray-400">
            Inactive
          </p>

          <h2 className="text-4xl font-bold mt-4 text-red-400">

            {
              staff.filter(
                (s) => !s.is_active
              ).length
            }

          </h2>

        </div>

      </div>



      {/* TABLE */}

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-white/5">

              <tr className="text-left border-b border-white/10">

                <th className="p-5">
                  ID
                </th>

                <th className="p-5">
                  Name
                </th>

                <th className="p-5">
                  Role
                </th>

                <th className="p-5">
                  Phone
                </th>

                <th className="p-5">
                  Status
                </th>

                <th className="p-5">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="p-10 text-center"
                  >

                    Loading...

                  </td>

                </tr>

              ) : filteredStaff.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="p-10 text-center"
                  >

                    No Staff Found

                  </td>

                </tr>

              ) : (

                filteredStaff.map((member) => (

                  <tr
                    key={member.id}
                    className="border-b border-white/10 hover:bg-white/5 transition"
                  >

                    <td className="p-5 font-semibold">

                      #{member.id}

                    </td>

                    <td className="p-5">

                      {member.full_name}

                    </td>

                    <td className="p-5 text-gray-300">

                      {member.role_display}

                    </td>

                    <td className="p-5 text-gray-300">

                      {member.phone}

                    </td>

                    <td className="p-5">

                      <span
                        className={`

                          px-4 py-2 rounded-xl text-sm font-medium

                          ${
                            member.is_active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }

                        `}
                      >

                        {
                          member.is_active
                            ? "Active"
                            : "Inactive"
                        }

                      </span>

                    </td>

                    <td className="p-5">

                      <div className="flex gap-3">

                        <button className="px-4 py-2 rounded-xl bg-blue-500">

                          View

                        </button>

                        <button className="px-4 py-2 rounded-xl bg-orange-500">

                          Edit

                        </button>

                        <button
                          onClick={() =>
                            handleDelete(member.id)
                          }
                          className="px-4 py-2 rounded-xl bg-red-500"
                        >

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}