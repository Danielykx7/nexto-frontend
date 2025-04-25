// src/modules/products/components/image-gallery/index.tsx
"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prevImage = () => {
    setCurrentIndex((idx) => (idx === 0 ? images.length - 1 : idx - 1))
  }

  const nextImage = () => {
    setCurrentIndex((idx) => (idx === images.length - 1 ? 0 : idx + 1))
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main Image Container */}
      <Container className="relative w-full aspect-[4/5] overflow-hidden bg-ui-bg-subtle rounded-2xl">
        {!!images[currentIndex].url && (
          <Image
            src={images[currentIndex].url}
            alt={`Product image ${currentIndex + 1}`}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1280px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority={currentIndex <= 2}
          />
        )}
      </Container>

      {/* Navigation Buttons */}
      <button
        aria-label="Previous image"
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        aria-label="Next image"
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}

export default ImageGallery
