import { Link, useLocation } from "react-router-dom"

export default function Sidebar() {

  const location = useLocation()

  const menus = [

    {
      name: "Dashboard",
      path: "/",
    },

    {
      name: "Customers",
      path: "/customers",
    },

    {
      name: "Orders",
      path: "/orders",
    },

    {
      name: "Stock",
      path: "/stock",
    },

    {
      name: "Staff",
      path: "/staff",
    },

    {
      name: "Reports",
      path: "/reports",
    },

    {
      name: "Settings",
      path: "/settings",
    },


  ]

  return (

    <div className="fixed left-0 top-0 w-72 h-screen bg-black border-r border-white/10 p-6">

      <h1 className="text-4xl font-black mb-10">
        Admin
      </h1>

      <div className="space-y-3">

        {menus.map((menu) => (

          <Link
            key={menu.path}
            to={menu.path}
            className={`block p-4 rounded-2xl transition

            ${
              location.pathname === menu.path
                ? "bg-white text-black"
                : "bg-white/5 hover:bg-white/10"
            }
            `}
          >

            {menu.name}

          </Link>

        ))}

      </div>

    </div>

  )

}