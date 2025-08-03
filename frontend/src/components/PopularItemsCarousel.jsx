import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const PopularItemCard = ({ item, onSelect }) => (
    <div className="p-2 h-full">
        <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-xl transition-shadow duration-300"
            onClick={() => onSelect(item)}
        >
            <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-md flex-grow">{item.name}</h3>
                <p className="text-green-600 font-semibold mt-1">€{item.price.toFixed(2)}</p>
            </div>
        </div>
    </div>
);

const PopularItemsCarousel = ({ items, onSelectItem }) => {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });
  if (!items || items.length === 0) return null;

  return (
    <section className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 tracking-tight text-gray-900">Most Popular</h2>
      <div className="embla -ml-2" ref={emblaRef}>
        <div className="embla__container">
          {items.map(item => (
            <div className="embla__slide" style={{ flex: '0 0 50%', minWidth: 0 }} key={item._id}>
                 <PopularItemCard item={item} onSelect={onSelectItem} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularItemsCarousel;