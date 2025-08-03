import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';

const CarouselSlide = ({ promotion }) => (
  <div className="embla__slide relative h-64 md:h-80 bg-gray-800 text-white flex items-center justify-center overflow-hidden">
    {promotion.imageUrl && (
        <img 
        src={promotion.imageUrl} 
        alt={promotion.name}
        className="absolute top-0 left-0 w-full h-full object-cover" 
        />
    )}
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="z-10 text-center p-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-6xl font-extrabold"
      >
        {promotion.name}
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-2 text-lg"
      >
        {promotion.description}
      </motion.p>
    </div>
  </div>
);

const PromotionsCarousel = () => {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/promotions`);
        if (!response.ok) throw new Error('Failed to fetch promotions.');
        const data = await response.json();
        const now = new Date();
        const activePromotions = data.filter(p => new Date(p.startTime) <= now && new Date(p.endTime) >= now && p.imageUrl);
        setPromotions(activePromotions);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  if (error) return <div className="text-red-500 p-4">Could not load promotions: {error}</div>;
  if (promotions.length === 0) return null;

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {promotions.map(promo => (
          <CarouselSlide key={promo._id} promotion={promo} />
        ))}
      </div>
    </div>
  );
};

export default PromotionsCarousel;