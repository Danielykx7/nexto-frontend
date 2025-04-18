/* src/modules/layout/templates/nav/index.tsx */
import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { IconButton } from "@medusajs/ui"
import { Menu as MenuIcon, User as UserIcon } from "lucide-react"

export default async function Nav() {
  const regions = await listRegions()

  return (
    <div className="sticky top-0 inset-x-0 z-50 bg-white border-b border-ui-border-base">
      <header className="content-container flex items-center justify-between h-16">
        {/* Mobile hamburger menu */}
        <div className="md:hidden">
          <SideMenu regions={regions} />
        </div>

        {/* Logo */}
        <LocalizedClientLink
          href="/"
          className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
          data-testid="nav-store-link"
        >
          Nexto
        </LocalizedClientLink>

        {/* Desktop actions: account and cart dropdown */}
        <div className="hidden md:flex items-center gap-x-6">
          {/* Account icon */}
          <IconButton variant="transparent" size="large" asChild aria-label="Účet">
            <LocalizedClientLink href="/account" data-testid="nav-account-link">
              <UserIcon className="w-5 h-5 text-ui-fg-subtle hover:text-ui-fg-base" />
            </LocalizedClientLink>
          </IconButton>

          {/* Cart dropdown on hover */}
          <Suspense fallback={null}>
            <CartButton />
          </Suspense>
        </div>
      </header>
    </div>
  )
}
