import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 40000 },
  { month: "Feb", revenue: 55000 },
  { month: "Mar", revenue: 65000 },
  { month: "Apr", revenue: 85000 },
  { month: "May", revenue: 120000 },
];

const categoryData = [
  { name: "Shirts", value: 35 },
  { name: "Pants", value: 25 },
  { name: "Jackets", value: 20 },
  { name: "Shoes", value: 20 },
];

const topProducts = [
  { id: 1, name: "Cotton Shirt", sold: 120 },
  { id: 2, name: "Denim Jeans", sold: 95 },
  { id: 3, name: "Winter Jacket", sold: 72 },
];

const recentOrders = [
  {
    id: 1001,
    customer: "Ram Sharma",
    amount: 2500,
    date: "2026-05-29",
  },
  {
    id: 1002,
    customer: "Hari Karki",
    amount: 1800,
    date: "2026-05-29",
  },
];

const lowStockItems = [
  {
    id: 1,
    name: "Black Hoodie XL",
    stock: 2,
  },
  {
    id: 2,
    name: "White Shirt M",
    stock: 3,
  },
];

const COLORS = [
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-8">
      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card
          title="Revenue"
          value="Rs. 4,25,000"
          color="text-green-400"
        />

        <Card
          title="Orders"
          value="1,245"
          color="text-cyan-400"
        />

        <Card
          title="Customers"
          value="786"
          color="text-purple-400"
        />

        <Card
          title="Profit"
          value="Rs. 1,45,000"
          color="text-yellow-400"
        />
      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* REVENUE TREND */}

        <div className="xl:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">
            Revenue Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY PIE */}

        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">
            Category Analysis
          </h2>

          <PieChart
            width={300}
            height={300}
          >
            <Pie
              data={categoryData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {categoryData.map(
                (entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* TOP PRODUCTS + CUSTOMER ANALYTICS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* TOP PRODUCTS */}

        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">
            Top Products
          </h2>

          <div className="space-y-4">
            {topProducts.map((item) => (
              <div
                key={item.id}
                className="flex justify-between bg-slate-800 p-4 rounded-xl"
              >
                <span>{item.name}</span>

                <span className="text-green-400">
                  {item.sold} sold
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOMER ANALYTICS */}

        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">
            Customer Analytics
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between">
              <span>New Customers</span>
              <span className="text-cyan-400">
                52
              </span>
            </div>

            <div className="flex justify-between">
              <span>Returning Customers</span>
              <span className="text-green-400">
                74%
              </span>
            </div>

            <div className="flex justify-between">
              <span>Average Order Value</span>
              <span className="text-purple-400">
                Rs. 3,200
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Customers</span>
              <span className="text-yellow-400">
                786
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS */}

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold">
            Recent Orders
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-left p-4">
                Order ID
              </th>
              <th className="text-left p-4">
                Customer
              </th>
              <th className="text-left p-4">
                Amount
              </th>
              <th className="text-left p-4">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-slate-800"
              >
                <td className="p-4">
                  #{order.id}
                </td>

                <td className="p-4">
                  {order.customer}
                </td>

                <td className="p-4 text-green-400">
                  Rs. {order.amount}
                </td>

                <td className="p-4">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LOW STOCK */}

      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-red-400 mb-6">
          Low Stock Alerts
        </h2>

        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between bg-black/20 p-4 rounded-xl"
            >
              <span>{item.name}</span>

              <span className="text-red-400 font-bold">
                {item.stock} left
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <p className="text-slate-400">
        {title}
      </p>

      <h2
        className={`text-4xl font-black mt-4 ${color}`}
      >
        {value}
      </h2>
    </div>
  );
}