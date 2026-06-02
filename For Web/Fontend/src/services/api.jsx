const BASE_URL = "http://192.168.18.48:8000/api"

// =====================================================
// 🔐 LOGIN
// =====================================================

export async function loginUser(data) {
const response = await fetch(
`${BASE_URL}/login/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

// =====================================================
// 👤 CREATE USER
// =====================================================

export async function createUser(data) {
const response = await fetch(
`${BASE_URL}/create-user/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

// =====================================================
// 👥 CUSTOMERS
// =====================================================

export async function getCustomers() {
const response = await fetch(
`${BASE_URL}/customers/`
)

return response.json()
}

export async function createCustomer(data) {
const response = await fetch(
`${BASE_URL}/customers/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

// =====================================================
// 📦 ITEMS
// =====================================================

export async function getItems() {
const response = await fetch(
`${BASE_URL}/items/`
)

return response.json()
}

export async function createItem(data) {
const response = await fetch(
`${BASE_URL}/items/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function updateItem(id, data) {
const response = await fetch(
`${BASE_URL}/items/${id}/`,
{
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function deleteItem(id) {
const response = await fetch(
`${BASE_URL}/items/${id}/`,
{
method: "DELETE",
}
)

return response
}

// =====================================================
// 👨‍💼 SALES PERSONS
// =====================================================

export async function getStaff() {
const response = await fetch(
`${BASE_URL}/sales-persons/`
)

return response.json()
}

export async function createStaff(data) {
const response = await fetch(
`${BASE_URL}/sales-persons/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function updateStaff(id, data) {
const response = await fetch(
`${BASE_URL}/sales-persons/${id}/`,
{
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function deleteStaffApi(id) {
const response = await fetch(
`${BASE_URL}/sales-persons/${id}/`,
{
method: "DELETE",
}
)

return response
}

// =====================================================
// 📋 ORDERS
// =====================================================

export async function getOrders() {
const response = await fetch(
`${BASE_URL}/orders/`
)

return response.json()
}

export async function createOrder(data) {
const response = await fetch(
`${BASE_URL}/orders/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function updateOrder(id, data) {
const response = await fetch(
`${BASE_URL}/orders/${id}/`,
{
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function deleteOrder(id) {
const response = await fetch(
`${BASE_URL}/orders/${id}/`,
{
method: "DELETE",
}
)

return response
}

// =====================================================
// 🚫 CANCEL ORDER
// =====================================================

export async function cancelOrder(id) {
const response = await fetch(
`${BASE_URL}/orders/${id}/cancel_order/`,
{
method: "POST",
}
)

return response.json()
}


export function downloadHashtagReport() {
  window.open(
    `${BASE_URL}/reports/hastag/`,
    "_blank"
  )
}