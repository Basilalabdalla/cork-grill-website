import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext.jsx';
import Cart from '../components/Cart.jsx';
import CategoryNavbar from '../components/CategoryNavbar.jsx';
import { motion } from 'framer-motion';
import BackToTopButton from '../components/BackToTopButton.jsx';
import ItemDetailModal from '../components/ItemDetailModal.jsx';
import PopularItemsCarousel from '../components/PopularItemsCarousel.jsx';
import LunchDealBanner from '../components/LunchDealBanner.jsx';
import OpeningHours from '../components/OpeningHours.jsx';
import PromotionsCarousel from '../components/PromotionsCarousel.jsx';
import MenuItemRow from '../components/MenuItemRow.jsx';

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [homeContent, setHomeContent] = useState(null); // <-- THE MISSING LINE
  
  const { addToCart } = useCart();
  const categoryRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [menuRes, categoriesRes, homeContentRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/menu`),
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`),
          fetch(`${import.meta.env.VITE_API_URL}/api/homepage`),
        ]);

        if (!menuRes.ok || !categoriesRes.ok || !homeContentRes.ok) {
          throw new Error('Network response was not ok');
        }

        const menuData = await menuRes.json();
        const categoriesData = await categoriesRes.json();
        const homeContentData = await homeContentRes.json();

        setMenuItems(menuData);
        setCategories(categoriesData);
        setHomeContent(homeContentData); // Set the new state
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].name);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // ... (The IntersectionObserver useEffect is the same)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const refs = categoryRefs.current;
    const observerRefs = Object.values(refs);
    observerRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observerRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [menuItems, categories]);

  const menuByCategory = categories.map(category => ({
    ...category,
    items: menuItems.filter(item => item.category === category.name)
  }));

  if (loading) return <div className="p-4 text-center text-xl">Loading menu...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  const isStoreOpen = homeContent?.isStoreOpen ?? true;

  return (
    <div className="bg-white"> 
      <header className="text-center py-6 md:py-10 bg-white border-b">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Cork Grill</h1>
        <p className="text-md md:text-lg text-gray-500 mt-2">American - Burgers - Mediterranean</p>
      </header>

      {!isStoreOpen && (
        <div className="bg-red-600 text-white font-bold text-center py-3">
          <p>This place is currently closed. Check back during business hours to place an order.</p>
        </div>
      )}

      <PromotionsCarousel />
      <LunchDealBanner />
      
      <CategoryNavbar
        categories={categories}
        activeCategory={activeCategory}
      />

      <div className="container mx-auto p-4 sm:p-8">
        <OpeningHours hours={homeContent?.openingHours} />
        <PopularItemsCarousel items={homeContent?.popularItemIds} onSelectItem={setSelectedItem} isStoreOpen={isStoreOpen}/>

        <div className="flex flex-col lg:flex-row gap-8">
          <main className="lg:w-3/4 space-y-12 pb-24">
            {menuByCategory.map(categoryGroup => (
              <section 
                key={categoryGroup._id} 
                id={categoryGroup.name}
                ref={el => (categoryRefs.current[categoryGroup.name] = el)}
              >
                <h2 className="text-3xl font-bold mb-4 tracking-tight text-gray-900">{categoryGroup.name}</h2>
                <div className="flex flex-col">
                  {categoryGroup.items.map(item => (
                    <MenuItemRow 
                      key={item._id} 
                      item={item} 
                      onSelect={setSelectedItem} 
                      isStoreOpen={isStoreOpen} 
                    />
                  ))}
                </div>
              </section>
            ))}
          </main>
          
          <aside className="hidden lg:block lg:w-1/4">
            <div className="sticky top-32"><Cart /></div>
          </aside>
        </div>
      </div>
      
      <div className="lg:hidden"><Cart /></div>
      <BackToTopButton />
      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} isStoreOpen={isStoreOpen} />
    </div>
  );
};

export default HomePage;