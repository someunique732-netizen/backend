import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getItems } from "../services/api"

const BASE_URL = "http://192.168.18.42:8000/api"

export default function StockPage() {

  const navigate = useNavigate()

  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  // =====================================================
  // LOAD STOCK
  // =====================================================

  useEffect(() => {

    fetchStock()

  }, [])

  async function fetchStock() {

    try {

      const data = await getItems()

      setProducts(data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }

  }

  // =====================================================
  // IMPORT FILE
  // =====================================================

  async function handleImport(e) {

    const file = e.target.files[0]

    if (!file) return

    const formData = new FormData()

    formData.append("excel_file", file)

    try {

      const response = await fetch(
        `${BASE_URL}/import-items/`,
        {
          method: "POST",
          body: formData,
        }
      )

      if (response.ok) {

        alert("Items Imported Successfully")

        fetchStock()

      } else {

        alert("Import Failed")

      }

    } catch (error) {

      console.log(error)

      alert("Import Error")

    }

  }

  // =====================================================
  // FILTER
  // =====================================================

  const filteredProducts = products.filter((product) =>

    product.item_name
      ?.toLowerCase()
      .includes(search.toLowerCase())

  )

  // =====================================================
  // STATS
  // =====================================================

  const totalProducts = products.length

  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= 10
  ).length

  const outOfStock = products.filter(
    (p) => p.stock <= 0
  ).length

  return (

    <div className="min-h-screen bg-black text-white p-4">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold">
            Inventory
          </h1>

          <p className="text-gray-400 mt-1 text-sm">
            Warehouse stock management system
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl outline-none w-64 focus:border-white transition text-sm"
          />

          {/* IMPORT BUTTON */}
          <input
            type="file"
            id="fileInput"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={handleImport}
          />

          <button
            onClick={() =>
              document
                .getElementById("fileInput")
                .click()
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition text-sm"
          >

            Import Item

          </button>

          {/* ADD ITEM BUTTON */}
          <button
            onClick={() =>
              navigate("/stock/add-item")
            }
            className="bg-white text-black px-4 py-2 rounded-xl font-semibold hover:scale-105 transition text-sm"
          >

            + Add Item

          </button>

        </div>

      </div>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* TOTAL */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">

          <p className="text-gray-400 text-sm">
            Total Products
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalProducts}
          </h2>

        </div>

        {/* LOW STOCK */}
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">

          <p className="text-yellow-300 text-sm">
            Low Stock
          </p>

          <h2 className="text-3xl font-bold mt-2 text-yellow-400">
            {lowStock}
          </h2>

        </div>

        {/* OUT OF STOCK */}
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">

          <p className="text-red-300 text-sm">
            Out of Stock
          </p>

          <h2 className="text-3xl font-bold mt-2 text-red-400">
            {outOfStock}
          </h2>

        </div>

      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">

        {loading ? (

          <div className="flex items-center justify-center h-72 text-lg text-gray-500">

            Loading Inventory...

          </div>

        ) : (

          <div className="max-h-[700px] overflow-auto">

            <table className="w-full text-sm">

              {/* HEADER */}

              <thead className="sticky top-0 bg-black z-10">

                <tr className="border-b border-zinc-800 text-left">

                  <th className="px-4 py-3">
                    SKU
                  </th>

                  <th className="px-4 py-3">
                    Product Name
                  </th>

                  <th className="px-4 py-3">
                    Price
                  </th>

                  <th className="px-4 py-3">
                    Stock
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* BODY */}

              <tbody>

                {filteredProducts.map((product) => {

                  let status = "In Stock"

                  let statusColor =
                    "bg-green-500/10 text-green-400"

                  if (product.stock <= 0) {

                    status = "Out of Stock"

                    statusColor =
                      "bg-red-500/10 text-red-400"

                  }

                  else if (product.stock <= 10) {

                    status = "Low Stock"

                    statusColor =
                      "bg-yellow-500/10 text-yellow-400"

                  }

                  return (

                    <tr
                      key={product.id}
                      className="border-b border-zinc-800 hover:bg-white/5 transition"
                    >

                      {/* SKU */}
                      <td className="px-4 py-3 text-gray-400">

                        {product.sku}

                      </td>

                      {/* PRODUCT */}
                      <td className="px-4 py-3 font-medium">

                        {product.item_name}

                      </td>

                      {/* PRICE */}
                      <td className="px-4 py-3">

                        Rs. {product.price}

                      </td>

                      {/* STOCK */}
                      <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                          <span className="font-semibold min-w-[40px]">

                            {product.stock}

                          </span>

                          <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">

                            <div
                              className={`
                              h-full rounded-full

                              ${product.stock > 10 && "bg-green-500"}

                              ${product.stock > 0 && product.stock <= 10 && "bg-yellow-500"}

                              ${product.stock <= 0 && "bg-red-500"}
                              `}
                              style={{
                                width: `${Math.min(product.stock, 100)}%`,
                              }}
                            ></div>

                          </div>

                        </div>

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3">

                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColor}`}
                        >

                          {status}

                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3">

                        <div className="flex gap-2">

                          <button className="px-3 py-1 rounded-lg bg-blue-500 hover:opacity-90 transition text-xs">

                            View

                          </button>

                          <button className="px-3 py-1 rounded-lg bg-orange-500 hover:opacity-90 transition text-xs">

                            Edit

                          </button>

                          <button className="px-3 py-1 rounded-lg bg-red-500 hover:opacity-90 transition text-xs">

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

    </div>

  )

}