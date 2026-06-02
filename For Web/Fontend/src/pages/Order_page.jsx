import { useEffect, useMemo, useState } from "react"

import { useNavigate } from "react-router-dom"

import NepaliDate from "nepali-date-converter"

import {
  getOrders,
  deleteOrder
} from "../services/api"

export default function OrderPage() {

  const navigate = useNavigate()

  const [orders, setOrders] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  const [selectedOrder, setSelectedOrder] = useState(null)

  const [deleteOrderId, setDeleteOrderId] = useState(null)

  const [filterType, setFilterType] = useState("today")

  const [startDate, setStartDate] = useState("")

  const [endDate, setEndDate] = useState("")

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  useEffect(() => {

    fetchAllOrders()

  }, [])

  async function fetchAllOrders() {

    try {

      setLoading(true)

      const data = await getOrders()

      setOrders(data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  // =====================================================
  // DELETE ORDER
  // =====================================================

  async function confirmDelete() {

    try {

      await deleteOrder(deleteOrderId)

      setOrders((prev) =>
        prev.filter(
          (o) => o.id !== deleteOrderId
        )
      )

      setDeleteOrderId(null)

    } catch (error) {

      console.log(error)
    }
  }

  // =====================================================
  // FILTERED ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {

    const now = new Date()

    return orders.filter((order) => {

      const customer =
        order.customer?.customer_name
          ?.toLowerCase()

      const matchesSearch =
        customer?.includes(
          search.toLowerCase()
        )

      const orderDate = new Date(
        order.order_date
      )

      // TODAY
      if (filterType === "today") {

        return (
          matchesSearch &&
          orderDate.toDateString() ===
          now.toDateString()
        )
      }

      // YESTERDAY
      if (filterType === "yesterday") {

        const yesterday = new Date()

        yesterday.setDate(
          yesterday.getDate() - 1
        )

        return (
          matchesSearch &&
          orderDate.toDateString() ===
          yesterday.toDateString()
        )
      }

      // MONTH
      if (filterType === "month") {

        return (
          matchesSearch &&
          orderDate.getMonth() ===
          now.getMonth() &&
          orderDate.getFullYear() ===
          now.getFullYear()
        )
      }

      // YEAR
      if (filterType === "year") {

        return (
          matchesSearch &&
          orderDate.getFullYear() ===
          now.getFullYear()
        )
      }

      // CUSTOM DATE
      if (filterType === "custom") {

        if (!startDate || !endDate)
          return matchesSearch

        const start = new Date(startDate)

        const end = new Date(endDate)

        return (
          matchesSearch &&
          orderDate >= start &&
          orderDate <= end
        )
      }

      return matchesSearch
    })

  }, [
    orders,
    search,
    filterType,
    startDate,
    endDate
  ])

  // =====================================================
  // TOTAL AMOUNT
  // =====================================================

  const totalOrders = filteredOrders.length

  return (

    <div className="min-h-screen bg-black text-white p-6">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <p className="uppercase tracking-[6px] text-gray-500 text-sm">

            Logistics Dashboard

          </p>

          <h1 className="text-4xl lg:text-5xl font-black mt-2">

            Orders Management

          </h1>

        </div>

        <div className="flex gap-3 w-full lg:w-auto">

  <input
    type="text"
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    placeholder="Search customer..."
    className="bg-zinc-950 border border-zinc-800 px-5 py-4 rounded-2xl outline-none focus:border-white transition w-full lg:w-80"
  />

  <button
    onClick={() => navigate("/createorder")}
    className="bg-white text-black px-6 py-4 rounded-2xl font-bold whitespace-nowrap"
  >

    Create Order

  </button>

</div>
      </div>

      {/* ===================================================== */}
      {/* FILTER CARDS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

        {/* TODAY */}

        <div
          onClick={() =>
            setFilterType("today")
          }
          className={`rounded-3xl p-5 border cursor-pointer transition ${
            filterType === "today"
              ? "bg-blue-500 border-blue-500"
              : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
          }`}
        >

          <p className="text-sm text-gray-300">

            Today

          </p>

          <h2 className="text-3xl font-black mt-2">

            {
              orders.filter((o) =>
                new Date(o.order_date)
                  .toDateString() ===
                new Date().toDateString()
              ).length
            }

          </h2>

        </div>

        {/* YESTERDAY */}

        <div
          onClick={() =>
            setFilterType("yesterday")
          }
          className={`rounded-3xl p-5 border cursor-pointer transition ${
            filterType === "yesterday"
              ? "bg-purple-500 border-purple-500"
              : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
          }`}
        >

          <p className="text-sm text-gray-300">

            Yesterday

          </p>

          <h2 className="text-3xl font-black mt-2">

            {
              orders.filter((o) => {

                const y = new Date()

                y.setDate(
                  y.getDate() - 1
                )

                return (
                  new Date(o.order_date)
                    .toDateString() ===
                  y.toDateString()
                )

              }).length
            }

          </h2>

        </div>

        {/* MONTH */}

        <div
          onClick={() =>
            setFilterType("month")
          }
          className={`rounded-3xl p-5 border cursor-pointer transition ${
            filterType === "month"
              ? "bg-green-500 border-green-500"
              : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
          }`}
        >

          <p className="text-sm text-gray-300">

            This Month

          </p>

          <h2 className="text-3xl font-black mt-2">

            {
              orders.filter((o) => {

                const d = new Date(
                  o.order_date
                )

                const now = new Date()

                return (
                  d.getMonth() ===
                  now.getMonth() &&
                  d.getFullYear() ===
                  now.getFullYear()
                )

              }).length
            }

          </h2>

        </div>

        {/* YEAR */}

        <div
          onClick={() =>
            setFilterType("year")
          }
          className={`rounded-3xl p-5 border cursor-pointer transition ${
            filterType === "year"
              ? "bg-orange-500 border-orange-500"
              : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
          }`}
        >

          <p className="text-sm text-gray-300">

            This Year

          </p>

          <h2 className="text-3xl font-black mt-2">

            {
              orders.filter((o) => {

                const d = new Date(
                  o.order_date
                )

                const now = new Date()

                return (
                  d.getFullYear() ===
                  now.getFullYear()
                )

              }).length
            }

          </h2>

        </div>

        {/* TOTAL */}

        <div className="rounded-3xl p-5 bg-gradient-to-br from-pink-500 to-purple-500">

  <p className="text-sm">

    Total Orders

  </p>

  <h2 className="text-3xl font-black mt-2">

    {totalOrders}

  </h2>

</div>

      </div>

      {/* ===================================================== */}
      {/* CUSTOM DATE */}
      {/* ===================================================== */}

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 mb-8">

        <div className="flex flex-col lg:flex-row gap-4 items-center">

          <button
            onClick={() =>
              setFilterType("custom")
            }
            className="bg-white text-black px-5 py-3 rounded-2xl font-bold"
          >

            Custom Filter

          </button>

          <input
            type="date"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
            className="bg-black border border-zinc-700 px-5 py-3 rounded-2xl"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
            className="bg-black border border-zinc-700 px-5 py-3 rounded-2xl"
          />

        </div>

      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">

        {loading ? (

          <div className="p-10 text-center text-gray-400">

            Loading Orders...

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-zinc-900">

                <tr className="text-left text-gray-300">

                  <th className="p-5">ID</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Items</th>
                  <th className="p-5 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredOrders.map((order) => {

                  const nepaliDate =
                    new NepaliDate(
                      new Date(order.order_date)
                    ).format("YYYY-MM-DD")

                  return (

                    <tr
                      key={order.id}
                      className="border-t border-zinc-800 hover:bg-white/5 transition"
                    >

                      {/* ID */}

                      <td className="p-5 text-gray-400">

                        #{order.id}

                      </td>

                      {/* CUSTOMER */}

                      <td className="p-5 font-semibold">

                        {
                          order.customer
                            ?.customer_name
                        }

                      </td>

                      {/* AMOUNT */}

                      <td className="p-5">

                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-xl">

                          Rs. {
                            order.total_amount
                          }

                        </span>

                      </td>

                      {/* DATE */}

                      <td className="p-5 text-gray-400">

                        {nepaliDate}

                      </td>

                      {/* ITEMS */}

                      <td className="p-5">

                        {
                          order.items?.length
                        } items

                      </td>

                      {/* ACTIONS */}

                      <td className="p-5">

                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                          >

                            View

                          </button>

                          <button
                            onClick={() =>
                              setDeleteOrderId(order.id)
                            }
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                          >

                            Delete

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ===================================================== */}
      {/* VIEW MODAL */}
      {/* ===================================================== */}

      {selectedOrder && (

        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="bg-zinc-950 border border-zinc-800 rounded-[40px] p-8 w-[95%] max-w-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-3xl font-black">

                Order #{selectedOrder.id}

              </h2>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="bg-white/10 w-10 h-10 rounded-full"
              >

                ✕

              </button>

            </div>

            <div className="space-y-4 text-gray-300">

              <div className="bg-black/40 rounded-2xl p-4">

                <p className="text-sm text-gray-500">

                  Customer

                </p>

                <h3 className="text-xl font-bold mt-1">

                  {
                    selectedOrder.customer
                      ?.customer_name
                  }

                </h3>

              </div>

              <div className="bg-black/40 rounded-2xl p-4">

                <p className="text-sm text-gray-500">

                  Total Amount

                </p>

                <h3 className="text-2xl font-black text-green-400 mt-1">

                  Rs. {
                    selectedOrder.total_amount
                  }

                </h3>

              </div>

              <div>

                <h3 className="text-lg font-bold mb-3">

                  Ordered Items

                </h3>

                <div className="space-y-3">

                  {selectedOrder.items?.map(
                    (item, idx) => (

                      <div
                        key={idx}
                        className="bg-black/40 rounded-2xl p-4 flex justify-between"
                      >

                        <span>

                          {item.item_name}

                        </span>

                        <span>

                          × {item.quantity}

                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================== */}
      {/* DELETE MODAL */}
      {/* ===================================================== */}

      {deleteOrderId && (

        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() =>
            setDeleteOrderId(null)
          }
        >

          <div
            className="bg-zinc-950 border border-zinc-800 rounded-[35px] p-8 w-[90%] max-w-md"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h2 className="text-2xl font-black mb-3">

              Delete Order?

            </h2>

            <p className="text-gray-400 mb-6">

              This action cannot be undone.

            </p>

            <div className="flex justify-end gap-4">

              <button
                onClick={() =>
                  setDeleteOrderId(null)
                }
                className="bg-zinc-800 px-5 py-3 rounded-2xl"
              >

                Cancel

              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-500 px-5 py-3 rounded-2xl"
              >

                Delete

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}