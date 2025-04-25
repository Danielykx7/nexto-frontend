// src/modules/products/components/categories-list/index.tsx
import Link from "next/link"
import React from "react"
import { HttpTypes } from "@medusajs/types"

type CategoriesListProps = {
  categories?: HttpTypes.StoreProductCategory[]
}

const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center mt-2 text-xs">
      {categories.map((cat, idx) => (
        <React.Fragment key={cat.id}>
          <Link
            href={`/categories/${cat.handle}`}
            className="no-underline hover:text-blue-600"
          >
            {cat.name}
          </Link>
          {idx < categories.length - 1 && (
            <span className="mx-1 select-none">&gt;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default CategoriesList
