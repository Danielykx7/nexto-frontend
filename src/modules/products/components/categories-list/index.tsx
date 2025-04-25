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
    <div className="flex flex-wrap gap-2 items-center mt-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.handle}`}
          className="text-sm underline hover:text-blue-600"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}

export default CategoriesList
