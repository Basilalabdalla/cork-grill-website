import PromotionManager from '../components/admin/PromotionManager.jsx';
const AdminPromotionsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Promotions & Deals</h1>
      
      {/* This is the component that holds all the promotion forms and lists */}
      <PromotionManager />
    </div>
  );
};

export default AdminPromotionsPage;