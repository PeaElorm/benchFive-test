import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';
import { Pagination } from '../components/Pagination';

export default function ProductList() {
  const { products, deleteProducts } = useProducts();
  const navigate = useNavigate();
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleCheckboxChange = (sku: string) => {
    setSelectedSkus(prev =>
      prev.includes(sku)
        ? prev.filter(id => id !== sku)
        : [...prev, sku]
    );
  };

  const handleMassDelete = () => {
    deleteProducts(selectedSkus);
    setSelectedSkus([]);
  };

const getProductAttribute = (product: Product) => {
  switch (product.type) {
    case 'DVD':
      return `Size: ${product.size} MB`;
    case 'Book':
      return `Weight: ${product.weight} Kg`;
    case 'Furniture':{
      const { height, width, length } = product; 
      return `Dimensions: ${height}x${width}x${length}`;
    }
    default:
      return '';
  }
};

  return (
    <div className='flex flex-col h-screen p-2 md:p-10'>
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-bold">Product List</h1>
        <div className="space-x-4">
          {selectedSkus.length > 0 ? (
            <button
              onClick={() => navigate(`/edit-product/${selectedSkus[0]}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={selectedSkus.length !== 1}
            >
              EDIT
            </button>
          ) : (
            <button
              onClick={() => navigate('/new-product')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              ADD
            </button>
          )}
          <button
            onClick={handleMassDelete}
            className={`text-white px-4 py-2 rounded ${
              products.length === 0 || selectedSkus.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500'
            }`}
            disabled={products.length === 0 || selectedSkus.length === 0}
            title={
              products.length === 0 
                ? "No products available to delete" 
                : "Select one or more products to enable mass delete"
            }
           >
      MASS DELETE
    </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
      {products.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-2xl font-bold">No Products available yet. Click on the Add button above to add a product and get started.</p>
        </div>
      ) :(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map(product => (
          <div
            key={product.sku}
            className=" p-4 rounded-lg shadow-xl bg-blue-100 relative"
          >
            <input
              type="checkbox"
              checked={selectedSkus.includes(product.sku)}
              onChange={() => handleCheckboxChange(product.sku)}
              className="absolute top-4 left-4"
            />
            <div className="mx-5 space-y-2">
              <a
                href={product.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-blue-600 hover:text-blue-800"
              >
                {product.name}
              </a>
              <p>SKU: {product.sku}</p>
              <p><span>Price:</span> ${product.price.toFixed(2)}</p>
              <p>{getProductAttribute(product)}</p>
            </div>
          </div>
        ))}
      </div>
      )
      }
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(products.length / productsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}