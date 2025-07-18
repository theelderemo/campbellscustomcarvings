import ImageGallery from "@/components/ImageGallery";

// Manually selected images for the homepage gallery
const images = [
  "https://mwczjsxnarjgrgozxcxi.supabase.co/storage/v1/object/public/product-images//DeadorAlive.jpg",
  "https://mwczjsxnarjgrgozxcxi.supabase.co/storage/v1/object/public/product-images//group.jpg",
  // Add as many URLs as you want
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Our Finest Work
      </h1>
      <ImageGallery images={images} />
    </div>
  );
}