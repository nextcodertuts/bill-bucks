// components/HorizontalScroll.js
import Image from "next/image";

// Sample image data (replace with your own)
const images = [
  { id: 1, src: "/brand/Meesho.png", alt: "Image 1" },
  { id: 2, src: "/brand/flipkart.png", alt: "Image 2" },
  { id: 3, src: "/brand/amazon.jpg", alt: "Image 3" },
  { id: 4, src: "/brand/blinkit.jpg", alt: "Image 4" },
  { id: 5, src: "/brand/Zomato_logo.png", alt: "Image 5" },
  { id: 6, src: "/brand/swiggy.png", alt: "Image 5" },
  { id: 7, src: "/brand/medplus.jpg", alt: "Image 5" },
];

const HorizontalScroll = () => {
  return (
    <div className="w-full overflow-x-auto py-2 px-2 ">
      <div className="flex flex-row flex-nowrap gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="flex-shrink-0 w-12 h-1w-12 rounded-full overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={100} // Matches w-52 (52 * 4 = 208px in Tailwind)
              height={100}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScroll;
