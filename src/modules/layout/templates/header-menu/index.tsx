// src/modules/layout/components/header-menu/index.tsx
import Link from "next/link"
import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"

export default async function HeaderMenu() {
  // Načteme celý strom kategorií
  const allCats: HttpTypes.StoreProductCategory[] = await listCategories({ limit: 1000 })
  // Vybereme hlavní (root) kategorie
  const rootCats = allCats.filter(cat => !cat.parent_category)

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-6 py-2">
          {rootCats.map(root => (
            <li key={root.id} className="relative group">
              <Link
                href={`/categories/${root.handle}`}
                className="text-sm font-medium hover:text-gray-800"
              >
                {root.name}
              </Link>

              {root.category_children?.length > 0 && (
                <ul className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg mt-2 py-2 w-48">
                  {root.category_children.map(sub => (
                    <li key={sub.id} className="relative group">
                      <Link
                        href={`/categories/${sub.handle}`}
                        className="block px-4 py-1 text-sm hover:bg-gray-100"
                      >
                        {sub.name}
                      </Link>

                      {sub.category_children?.length > 0 && (
                        <ul className="absolute left-full top-0 hidden group-hover:block bg-white shadow-lg py-2 w-48">
                          {sub.category_children.map(grand => (
                            <li key={grand.id}>
                              <Link
                                href={`/categories/${grand.handle}`}
                                className="block px-4 py-1 text-sm hover:bg-gray-100"
                              >
                                {grand.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
