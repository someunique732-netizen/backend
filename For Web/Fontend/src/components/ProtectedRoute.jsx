import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token")

  // IF NOT LOGGED IN
  if (!token) {

    return <Navigate to="/" />

  }

  // IF LOGGED IN
  return children

}