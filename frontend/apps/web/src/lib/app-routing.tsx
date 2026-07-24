import { Route, Routes } from "react-router-dom"
import Home from "@/views/home"
import RedirectHandler from "@/views/redirect-handler"

export default function AppRouting() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:uuid" element={<RedirectHandler />} />
    </Routes>
  )
}
