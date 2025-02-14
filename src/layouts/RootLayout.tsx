import { Outlet } from 'react-router-dom';
import { ProductProvider } from '../context/ProdContext';

const RootLayout = () => {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </ProductProvider>
  );
};

export default RootLayout;