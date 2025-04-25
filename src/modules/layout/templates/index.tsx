// src/modules/layout/templates/index.tsx
import React from "react"

import Nav from "@modules/layout/templates/nav"
import HeaderMenu from "@modules/layout/templates/header-menu"
import Footer from "@modules/layout/templates/footer"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {/* Hlavní navigace */}
      <Nav />

      {/* Mega-menu kategorií pod navigací */}
      <HeaderMenu />

      <main className="relative">
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default Layout
