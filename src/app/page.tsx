import ImageGallery from "@/components/ImageGallery";
import Link from "next/link";

const images = [
  "https://mwczjsxnarjgrgozxcxi.supabase.co/storage/v1/object/public/product-images//DeadorAlive.jpg",
  "https://mwczjsxnarjgrgozxcxi.supabase.co/storage/v1/object/public/product-images//group.jpg",
  "https://mwczjsxnarjgrgozxcxi.supabase.co/storage/v1/object/public/product-images//HeartSmile.jpg",
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Custom CNC-Engraved Masterpieces
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Discover unique, high-quality pieces, meticulously crafted to bring your vision to life. Each item in our collection is a testament to our passion for precision and artistry.
        </p>
        <Link href="/shop">
          <span className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
            Explore The Shop
          </span>
        </Link>
      </div>

      <h2 className="text-4xl font-bold text-center mb-8 text-white">
        Our Finest Work
      </h2>
      <ImageGallery images={images} />
    </div>
  );
}