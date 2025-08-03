import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const PopularItemCard = ({ item, onSelect, isStoreOpen }) => (
    <div className="p-2 h-full">
        <div 
            onClick={isStoreOpen ? () => onSelect(item) : undefined}
            className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-shadow duration-300 ${isStoreOpen ? 'cursor-pointer hover:shadow-xl' : 'opacity-75'}`}
        >
            <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover" />
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-bold text-md flex-grow">{item.name}</h3>
                <p className="text-green-600 font-semibold mt-1">€{item.price.toFixed(2)}</p>
            </div>
        </div>
    </div>
);

const PopularItemsCarousel = ({ items, onSelectItem, isStoreOpen }) => {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });
  if (!items || items.length === 0) return null;

  return (
    <section className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 tracking-tight text-gray-900">Most Popular</h2>
      <div className="embla -ml-2" ref={emblaRef}>
        <div className="embla__container">
          {items.map(item => (
            <div className="embla__slide" style={{ flex: '0 0 50%', minWidth: 0 }} key={item._id}>
                 <PopularItemCard item={item} onSelect={onSelectItem} isStoreOpen={isStoreOpen}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularItemsCarousel;