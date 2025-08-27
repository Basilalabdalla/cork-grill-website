import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext.jsx';
import Cart from '../components/Cart.jsx';
import CategoryNavbar from '../components/CategoryNavbar.jsx';
import ItemDetailModal from '../components/ItemDetailModal.jsx';
import MenuItemRow from '../components/MenuItemRow.jsx';
import PromotionsCarousel from '../components/PromotionsCarousel.jsx';
import LunchDealBanner from '../components/LunchDealBanner.jsx';
import OpeningHours from '../components/OpeningHours.jsx';
import PopularItemsCarousel from '../components/PopularItemsCarousel.jsx';

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [homeContent, setHomeContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  
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
        if (!menuRes.ok || !categoriesRes.ok || !homeContentRes.ok) throw new Error('Network response was not ok');
        const menuData = await menuRes.json();
        const categoriesData = await categoriesRes.json();
        const homeContentData = await homeContentRes.json();
        setMenuItems(menuData);
        setCategories(categoriesData);
        setHomeContent(homeContentData);
        if (categoriesData.length > 0) setActiveCategory(categoriesData[0].name);
      } catch (error) { setError(error.message); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => entry.isIntersecting && setActiveCategory(entry.target.id)),
      { rootMargin: '-20% 0px -75% 0px' }
    );
    const refs = categoryRefs.current;
    Object.values(refs).forEach(ref => ref && observer.observe(ref));
    return () => Object.values(refs).forEach(ref => ref && observer.unobserve(ref));
  }, [menuItems, categories]);

  const menuByCategory = categories.map(cat => ({
    ...cat,
    items: menuItems.filter(item => item.category === cat.name)
  }));

  if (loading) return <div className="p-4 text-center text-xl">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  const isStoreOpen = homeContent?.isStoreOpen ?? true;

  return (
    <div className="bg-white">
      <PromotionsCarousel />
      <LunchDealBanner />
      <CategoryNavbar categories={categories} activeCategory={activeCategory} />

      <div className="container mx-auto p-4 sm:p-8">
        <PopularItemsCarousel items={homeContent?.popularItemIds} onSelectItem={setSelectedItem} isStoreOpen={isStoreOpen} />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="lg:w-3/4 space-y-12 pb-24">
            {menuByCategory.map(categoryGroup => (
              <section key={categoryGroup._id} id={categoryGroup.name} ref={el => (categoryRefs.current[categoryGroup.name] = el)}>
                <h2 className="text-3xl font-bold mb-4 tracking-tight text-gray-900">{categoryGroup.name}</h2>
                <div className="flex flex-col divide-y divide-gray-100">
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
            <div className="sticky top-24"><Cart /></div>
          </aside>
        </div>
      </div>
      
      <div className="lg:hidden"><Cart /></div>
      <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} isStoreOpen={isStoreOpen} />
    </div>
  );
};

export default HomePage;