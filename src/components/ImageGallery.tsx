
"use client";

import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((src) => ({ src }));

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, idx) => (
          <button
            key={idx}
            type="button"
            className="block overflow-hidden rounded-lg shadow hover:shadow-lg transition-shadow focus:outline-none"
            onClick={() => {
              setIndex(idx);
              setOpen(true);
            }}
          >
            <img
              src={src}
              alt={`Gallery image ${idx + 1}`}
              className="w-full h-48 object-cover object-center"
            />
          </button>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        plugins={[Zoom, Thumbnails]}
      />
    </>
  );
};

export default ImageGallery;
