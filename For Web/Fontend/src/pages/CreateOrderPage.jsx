import { useEffect, useMemo, useState } from "react"

import { useNavigate } from "react-router-dom"

import {
  createOrder,
  getItems,
  getCustomers
} from "../services/api"

export default function CreateOrderPage() {

  const navigate = useNavigate()

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] = useState(false)

  const [items, setItems] = useState([])

  const [customers, setCustomers] = useState([])

  const [search, setSearch] = useState("")

  const [message, setMessage] = useState("")

  const [customerMode, setCustomerMode] =
    useState("manual")

  const [selectedCustomer, setSelectedCustomer] =
    useState("")

  const [formData, setFormData] = useState({

    customer: {

      customer_name: "",
      phone1: "",
      phone2: "",
      municipality: "",
      address: "",
      remark: ""

    },

    delivery_charge: 0,

    paid_amount: 0,

    items: []
  })

  // =====================================================
  // FETCH DATA
  // =====================================================

  useEffect(() => {

    fetchItems()

    fetchCustomers()

  }, [])

  async function fetchItems() {

    try {

      const data = await getItems()

      setItems(data)

    } catch (error) {

      console.log(error)
    }
  }

  async function fetchCustomers() {

    try {

      const data = await getCustomers()

      setCustomers(data)

    } catch (error) {

      console.log(error)
    }
  }

  // =====================================================
  // CUSTOMER INPUT
  // =====================================================

  function handleCustomerChange(e) {

    setFormData({

      ...formData,

      customer: {

        ...formData.customer,

        [e.target.name]: e.target.value
      }
    })
  }

  // =====================================================
  // SELECT CUSTOMER
  // =====================================================

  function handleSelectCustomer(id) {

    setSelectedCustomer(id)

    const customer = customers.find(
      (c) => c.id === Number(id)
    )

    if (!customer) return

    setFormData({

      ...formData,

      customer: {

        customer_name:
          customer.customer_name || "",

        phone1:
          customer.phone1 || "",

        phone2:
          customer.phone2 || "",

        municipality:
          customer.municipality || "",

        address:
          customer.address || "",

        remark:
          customer.remark || ""
      }
    })
  }

  // =====================================================
  // ADD ITEM
  // =====================================================

  function addItem(item) {

    const exists = formData.items.find(
      (i) => i.item === item.id
    )

    if (exists) return

    setFormData({

      ...formData,

      items: [

        ...formData.items,

        {
          item: item.id,
          item_name: item.item_name,
          quantity: 1,
          price: item.price,
          stock: item.stock
        }
      ]
    })
  }

  // =====================================================
  // UPDATE QTY
  // =====================================================

  function updateQuantity(index, qty) {

    const updated = [...formData.items]

    updated[index].quantity =
      Number(qty)

    setFormData({

      ...formData,

      items: updated
    })
  }

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  function removeItem(index) {

    const updated =
      formData.items.filter(
        (_, i) => i !== index
      )

    setFormData({

      ...formData,

      items: updated
    })
  }

  // =====================================================
  // TOTALS
  // =====================================================

  const subtotal = useMemo(() => {

    return formData.items.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0
    )

  }, [formData.items])

  const grandTotal =
    subtotal +
    Number(formData.delivery_charge || 0)

  const dueAmount =
    grandTotal -
    Number(formData.paid_amount || 0)

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit() {

    try {

      setLoading(true)

      const payload = {

        customer: formData.customer,

        delivery_charge:
          Number(formData.delivery_charge),

        paid_amount:
          Number(formData.paid_amount),

        items: formData.items.map(
          (i) => ({
            item: i.item,
            quantity: i.quantity
          })
        )
      }

      const data =
        await createOrder(payload)

      if (data.id) {

        setMessage(
          "Order Created Successfully"
        )

        setTimeout(() => {

          navigate("/orders")

        }, 1500)

      } else {

        setMessage(
          "Failed To Create Order"
        )
      }

    } catch (error) {

      console.log(error)

      setMessage(
        "Server Error"
      )

    } finally {

      setLoading(false)
    }
  }

  // =====================================================
  // FILTER ITEMS
  // =====================================================

  const filteredItems = items.filter(
    (item) =>
      item.item_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
  )

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* BG */}

      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-[180px] rounded-full"></div>

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-purple-500/20 blur-[180px] rounded-full"></div>

      <div className="relative z-10 p-6 lg:p-10">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

          <div>

            <p className="uppercase tracking-[6px] text-gray-500 text-sm">

              Logistics Management

            </p>

            <h1 className="text-5xl font-black mt-3">

              Create Order

            </h1>

          </div>

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="bg-white/10 hover:bg-white/20 border border-white/10 px-7 py-4 rounded-2xl transition"
          >

            Back

          </button>

        </div>

        {message && (

          <div className="mb-6 bg-green-500/20 border border-green-500/30 text-green-400 px-5 py-4 rounded-2xl">

            {message}

          </div>

        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="xl:col-span-2 space-y-8">

            {/* CUSTOMER */}

            <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[35px] p-8">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                <h2 className="text-3xl font-black">

                  Customer Information

                </h2>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      setCustomerMode("manual")
                    }
                    className={`px-5 py-3 rounded-2xl transition ${
                      customerMode === "manual"
                        ? "bg-blue-500"
                        : "bg-white/10"
                    }`}
                  >

                    Manual

                  </button>

                  <button
                    onClick={() =>
                      setCustomerMode("select")
                    }
                    className={`px-5 py-3 rounded-2xl transition ${
                      customerMode === "select"
                        ? "bg-green-500"
                        : "bg-white/10"
                    }`}
                  >

                    Select Customer

                  </button>

                </div>

              </div>

              {customerMode === "select" && (

                <select
                  value={selectedCustomer}
                  onChange={(e) =>
                    handleSelectCustomer(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none mb-6"
                >

                  <option value="">

                    Select Customer

                  </option>

                  {customers.map((customer) => (

                    <option
                      key={customer.id}
                      value={customer.id}
                    >

                      {customer.customer_name}

                    </option>

                  ))}

                </select>

              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  name="customer_name"
                  placeholder="Customer Name"
                  value={formData.customer.customer_name}
                  onChange={handleCustomerChange}
                  className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none"
                />

                <input
                  name="phone1"
                  placeholder="Phone Number"
                  value={formData.customer.phone1}
                  onChange={handleCustomerChange}
                  className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none"
                />

                <input
                  name="phone2"
                  placeholder="Second Phone"
                  value={formData.customer.phone2}
                  onChange={handleCustomerChange}
                  className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none"
                />

                <input
                  name="municipality"
                  placeholder="Municipality"
                  value={formData.customer.municipality}
                  onChange={handleCustomerChange}
                  className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none"
                />

              </div>

              <textarea
                name="address"
                placeholder="Full Address"
                rows="4"
                value={formData.customer.address}
                onChange={handleCustomerChange}
                className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none mt-5 w-full resize-none"
              />

              <textarea
                name="remark"
                placeholder="Remark"
                rows="3"
                value={formData.customer.remark}
                onChange={handleCustomerChange}
                className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none mt-5 w-full resize-none"
              />

            </div>

            {/* ITEMS */}

            <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[35px] p-8">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                <h2 className="text-3xl font-black">

                  Add Items

                </h2>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search item..."
                  className="bg-black/40 border border-white/10 px-5 py-4 rounded-2xl outline-none w-full lg:w-80"
                />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[500px] overflow-y-auto pr-2">

                {filteredItems.map((item) => (

                  <div
                    key={item.id}
                    className="bg-black/30 border border-white/10 rounded-3xl p-5 hover:border-blue-500 transition"
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <h3 className="font-bold text-lg">

                          {item.item_name}

                        </h3>

                        <p className="text-gray-400 text-sm mt-1">

                          Stock: {item.stock}

                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-green-400 font-black text-xl">

                          Rs. {item.price}

                        </p>

                      </div>

                    </div>

                    <button
                      onClick={() =>
                        addItem(item)
                      }
                      className="mt-5 w-full bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-2xl font-bold hover:scale-[1.02] transition"
                    >

                      Add Item

                    </button>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-8">

            {/* ORDER ITEMS */}

            <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[35px] p-8 sticky top-6">

              <h2 className="text-3xl font-black mb-8">

                Order Summary

              </h2>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">

                {formData.items.length === 0 && (

                  <div className="text-center text-gray-500 py-10">

                    No Items Added

                  </div>

                )}

                {formData.items.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="bg-black/40 border border-white/10 rounded-3xl p-5"
                    >

                      <div className="flex justify-between items-start gap-3">

                        <div>

                          <h3 className="font-bold">

                            {item.item_name}

                          </h3>

                          <p className="text-green-400 mt-1">

                            Rs. {item.price}

                          </p>

                        </div>

                        <button
                          onClick={() =>
                            removeItem(index)
                          }
                          className="bg-red-500/20 text-red-400 w-9 h-9 rounded-xl"
                        >

                          ✕

                        </button>

                      </div>

                      <div className="mt-4">

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              index,
                              e.target.value
                            )
                          }
                          className="w-full bg-black border border-white/10 px-4 py-3 rounded-2xl outline-none"
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* TOTALS */}

              <div className="mt-8 space-y-5">

                <div>

                  <p className="text-gray-400 mb-2">

                    Delivery Charge

                  </p>

                  <input
                    type="number"
                    value={formData.delivery_charge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delivery_charge:
                          e.target.value
                      })
                    }
                    className="w-full bg-black border border-white/10 px-5 py-4 rounded-2xl outline-none"
                  />

                </div>

                <div>

                  <p className="text-gray-400 mb-2">

                    Paid Amount

                  </p>

                  <input
                    type="number"
                    value={formData.paid_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paid_amount:
                          e.target.value
                      })
                    }
                    className="w-full bg-black border border-white/10 px-5 py-4 rounded-2xl outline-none"
                  />

                </div>

                <div className="bg-black/40 rounded-3xl p-6 space-y-4">

                  <div className="flex justify-between">

                    <span className="text-gray-400">

                      Subtotal

                    </span>

                    <span>

                      Rs. {subtotal}

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">

                      Delivery

                    </span>

                    <span>

                      Rs. {
                        formData.delivery_charge
                      }

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-gray-400">

                      Paid

                    </span>

                    <span>

                      Rs. {
                        formData.paid_amount
                      }

                    </span>

                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between text-2xl font-black">

                    <span>Total</span>

                    <span className="text-green-400">

                      Rs. {grandTotal}

                    </span>

                  </div>

                  <div className="flex justify-between text-xl font-bold">

                    <span>Due</span>

                    <span className="text-orange-400">

                      Rs. {dueAmount}

                    </span>

                  </div>

                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-[1.02] transition py-5 rounded-3xl font-black text-lg shadow-2xl disabled:opacity-50"
                >

                  {loading
                    ? "Creating..."
                    : "Create Order"}

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}