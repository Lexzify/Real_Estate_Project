import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getImageUrl } from "../utils/media";

function Lightbox({ images, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!images || images.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <button
        type="button"
        className="absolute right-4 top-4 rounded-full p-2 text-white hover:bg-white/20 transition-colors"
        onClick={onClose}
      >
        <X size={28} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white hover:bg-white/20 transition-colors"
            onClick={handlePrev}
          >
            <ChevronLeft size={36} />
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white hover:bg-white/20 transition-colors"
            onClick={handleNext}
          >
            <ChevronRight size={36} />
          </button>
        </>
      )}

      <div className="relative max-h-[90vh] max-w-[90vw]">
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`Gallery view ${currentIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-sm font-medium text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

export default Lightbox;
