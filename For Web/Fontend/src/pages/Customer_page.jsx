import { useEffect, useState } from "react"

import { getCustomers } from "../services/api"

export default function CustomerPage() {

  const [customers, setCustomers] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  useEffect(() => {

    fetchCustomers()

  }, [])

  async function fetchCustomers() {

    try {

      const data = await getCustomers()

      setCustomers(data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }

  }

  // =====================================================
  // FILTER
  // =====================================================

  const filteredCustomers = customers.filter((customer) =>

    customer.customer_name
      ?.toLowerCase()
      .includes(search.toLowerCase())

  )

  // =====================================================
  // STATS
  // =====================================================

  const totalCustomers = customers.length

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length

  const pendingCustomers = customers.filter(
    (customer) => customer.status === "Pending"
  ).length

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        <div>

          <h1 className="text-5xl font-bold">
            Customers
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Manage all customer details
          </p>

        </div>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 border border-white/10 px-5 py-4 rounded-2xl outline-none w-72 backdrop-blur-xl"
          />

          <button className="bg-white text-black px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition">

            Add Customer

          </button>

        </div>

      </div>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">

          <p className="text-gray-400">
            Total Customers
          </p>

          <h2 className="text-4xl font-bold mt-4">
            {totalCustomers}
          </h2>

        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">

          <p className="text-gray-400">
            Active Customers
          </p>

          <h2 className="text-4xl font-bold mt-4 text-green-400">
            {activeCustomers}
          </h2>

        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6">

          <p className="text-gray-400">
            Pending Customers
          </p>

          <h2 className="text-4xl font-bold mt-4 text-yellow-400">
            {pendingCustomers}
          </h2>

        </div>

      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 overflow-x-auto">

        {loading ? (

          <div className="text-center py-20 text-gray-400 text-xl">

            Loading Customers...

          </div>

        ) : (

          <table className="w-full">

            {/* HEADER */}
            <thead>

              <tr className="border-b border-white/10 text-left">

                <th className="py-5">
                  Customer
                </th>

                <th className="py-5">
                  Phone
                </th>

                <th className="py-5">
                  Municipality
                </th>

                <th className="py-5">
                  Address
                </th>

                <th className="py-5">
                  Status
                </th>

                <th className="py-5">
                  Actions
                </th>

              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {filteredCustomers.map((customer) => (

                <tr
                  key={customer.id}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >

                  {/* NAME */}
                  <td className="py-6 font-semibold">

                    {customer.customer_name}

                  </td>

                  {/* PHONE */}
                  <td className="py-6 text-gray-300">

                    {customer.phone}

                  </td>

                  {/* MUNICIPALITY */}
                  <td className="py-6 text-gray-300">

                    {customer.municipality}

                  </td>

                  {/* ADDRESS */}
                  <td className="py-6 text-gray-300">

                    {customer.address}

                  </td>

                  {/* STATUS */}
                  <td className="py-6">

                    <span
                      className={`px-4 py-2 rounded-xl text-sm

                      ${
                        customer.status === "Active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                      `}
                    >

                      {customer.status || "Active"}

                    </span>

                  </td>

                  {/* ACTIONS */}
                  <td className="py-6">

                    <div className="flex gap-3">

                      <button className="px-4 py-2 rounded-xl bg-blue-500 hover:opacity-90 transition">

                        View

                      </button>

                      <button className="px-4 py-2 rounded-xl bg-orange-500 hover:opacity-90 transition">

                        Edit

                      </button>

                      <button className="px-4 py-2 rounded-xl bg-red-500 hover:opacity-90 transition">

                        Delete

                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  )

}