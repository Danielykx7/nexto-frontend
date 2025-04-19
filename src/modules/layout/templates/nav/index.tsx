/* src/modules/layout/templates/nav/index.tsx */
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { IconButton } from "@medusajs/ui"
import { Menu as MenuIcon, User as UserIcon } from "lucide-react"
// Import client-only SearchBox directly
import SearchBox from "@modules/layout/components/search-box"

export default async function Nav() {
  const regions: StoreRegion[] = await listRegions()

  return (
    <div className="sticky top-0 inset-x-0 z-50 bg-white border-b border-ui-border-base">
      <header className="content-container flex items-center justify-between h-16">
        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-x-2">
          <IconButton
            variant="transparent"
            size="large"
            aria-label="Otevřít menu"
          >
            <MenuIcon className="w-6 h-6 text-ui-fg-subtle hover:text-ui-fg-base" />
          </IconButton>
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

        {/* Vyhledávací pole (desktop) */}
        <div className="hidden md:block flex-1 px-4">
          <SearchBox />
        </div>

        {/* Účet + Košík */}
        <div className="hidden md:flex items-center gap-x-4">
          {/* Účet */}
          <IconButton
            variant="transparent"
            size="large"
            className="hover:bg-gray-100 rounded-md p-2 w-10 h-10 flex items-center justify-center"
            asChild
            aria-label="Účet"
          >
            <LocalizedClientLink
              href="/account"
              data-testid="nav-account-link"
              className="flex items-center justify-center"
            >
              <UserIcon className="w-5 h-5 text-ui-fg-subtle hover:text-ui-fg-base" />
            </LocalizedClientLink>
          </IconButton>

          {/* Košík */}
          <div className="hover:bg-gray-100 rounded-md p-2 w-10 h-10 flex items-center justify-center">
            <CartButton />
          </div>
        </div>
      </header>
    </div>
  )
}
