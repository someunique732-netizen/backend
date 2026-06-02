import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BASE_URL = "http://192.168.18.42:8000/api"

export default function AddItemPage() {

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({

    sku: "",

    item_name: "",

    price: "",

    stock: "",
  })

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
  // SUBMIT
  // =====================================================

  async function handleSubmit(e) {

    e.preventDefault()

    setLoading(true)

    try {

      const response = await fetch(
        `${BASE_URL}/items/create/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      )

      if (response.ok) {

        alert("Item Added Successfully")

        navigate("/stock")

      } else {

        alert("Failed To Add Item")

      }

    } catch (error) {

      console.log(error)

      alert("Something Went Wrong")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">

      {/* CARD */}

      <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl p-8">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-sm text-gray-400 uppercase tracking-[4px]">

            Inventory Panel

          </p>

          <h1 className="text-4xl font-black mt-2">

            Add New Item

          </h1>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* SKU */}

          <div>

            <label className="block mb-2 text-gray-300">

              SKU

            </label>

            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              placeholder="SKU001"
              className="w-full bg-black border border-zinc-800 px-5 py-4 rounded-2xl outline-none focus:border-white transition"
            />

          </div>

          {/* PRODUCT NAME */}

          <div>

            <label className="block mb-2 text-gray-300">

              Product Name

            </label>

            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className="w-full bg-black border border-zinc-800 px-5 py-4 rounded-2xl outline-none focus:border-white transition"
            />

          </div>

          {/* PRICE + STOCK */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* PRICE */}

            <div>

              <label className="block mb-2 text-gray-300">

                Price

              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full bg-black border border-zinc-800 px-5 py-4 rounded-2xl outline-none focus:border-white transition"
              />

            </div>

            {/* STOCK */}

            <div>

              <label className="block mb-2 text-gray-300">

                Stock

              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full bg-black border border-zinc-800 px-5 py-4 rounded-2xl outline-none focus:border-white transition"
              />

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate("/stock")}
              className="flex-1 bg-zinc-900 border border-zinc-800 py-4 rounded-2xl font-semibold hover:bg-zinc-800 transition"
            >

              Cancel

            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-white text-black py-4 rounded-2xl font-black hover:scale-[1.02] transition"
            >

              {
                loading
                  ? "Adding..."
                  : "Add Item"
              }

            </button>

          </div>

        </form>

      </div>

    </div>

  )

}