function Banner({ img1, img2 }) {
  return (
    <div className="relative w-full h-[700px] flex overflow-hidden">
      {/* Image 1 */}
      <img
        className="w-1/2 h-full object-cover"
        src={img1}
        alt="banner-1"
      />
      {/* Image 2 */}
      <img
        className="w-1/2 h-full object-cover"
        src={img2}
        alt="banner-2"
      />
      {/* Title */}
      <h3 className="absolute font-bold text-black text-3xl md:text-5xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow">
        HOMEWARE & GIFTS
      </h3>
    </div>
  );
}

export default Banner;
