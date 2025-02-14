import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product, ProductType } from '../types/product';

const initialFormState = {
  name: '',
  price: '',
  imageUrl: '',
  type: 'DVD' as ProductType,
  size: '',
  weight: '',
  height: '',
  width: '',
  length: '',
};

export default function ProductFormPage() {
  const { addProduct, updateProduct, products } = useProducts();
  const navigate = useNavigate();
  const { sku } = useParams();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sku) {
      const product = products.find(p => p.sku === sku);
      if (product) {
        setFormData({
          ...initialFormState,
          ...product,
          price: product.price.toString(),
          size: product.type === 'DVD' ? product.size.toString() : '',
          weight: product.type === 'Book' ? product.weight.toString() : '',
          height: product.type === 'Furniture' ? product.height.toString() : '',
          width: product.type === 'Furniture' ? product.width.toString() : '',
          length: product.type === 'Furniture' ? product.length.toString() : '',
        });
      }
    }
  }, [sku, products]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Please, submit required data';
    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = 'Please, provide the data of indicated type';
    }
    if(!formData.imageUrl) {
      newErrors.imageUrl = 'Please, provide image url';
    }

    switch (formData.type) {
      case 'DVD':
        if (!formData.size || isNaN(Number(formData.size))) {
          newErrors.size = 'Please, provide size';
        }
        break;
      case 'Book':
        if (!formData.weight || isNaN(Number(formData.weight))) {
          newErrors.weight = 'Please, provide weight';
        }
        break;
      case 'Furniture':
        if (!formData.height || isNaN(Number(formData.height))) {
          newErrors.height = 'Please, provide height';
        }
        if (!formData.width || isNaN(Number(formData.width))) {
          newErrors.width = 'Please, provide width';
        }
        if (!formData.length || isNaN(Number(formData.length))) {
          newErrors.length = 'Please, provide length';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      imageUrl: formData.imageUrl,
      type: formData.type,
      ...(formData.type === 'DVD' && { size: Number(formData.size) }),
      ...(formData.type === 'Book' && { weight: Number(formData.weight) }),
      ...(formData.type === 'Furniture' && {
          height: Number(formData.height),
          width: Number(formData.width),
          length: Number(formData.length),
      }),
    };

    if (sku) {
      updateProduct({ ...productData, sku } as Product);
    } else {
      addProduct(productData as Omit<Product, 'sku' | 'createdAt'>);
    }

    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // this clears the error message when the user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {sku ? 'Edit Product' : 'Add Product'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block mb-2">Price <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block mb-2">Image URL <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
        </div>

        {/* Switch between products */}
        <div>
          <label className="block mb-2">Product Type <span className="text-red-500">*</span></label>
          <select
            id="productType"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full p-2 border rounded border-gray-300"
          >
            <option value="DVD">DVD</option>
            <option value="Book">Book</option>
            <option value="Furniture">Furniture</option>
          </select>
        </div>

        {/* Dynamic Fields Based on Product Type */}
        {formData.type === 'DVD' && (
          <div>
            <label className="block mb-2">Size (MB) <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${errors.size ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
            <p className="text-gray-500 text-sm mt-1">Please, provide size in MB</p>
          </div>
        )}

        {formData.type === 'Book' && (
          <div>
            <label className="block mb-2">Weight (KG) <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
            <p className="text-gray-500 text-sm mt-1">Please, provide weight in KG</p>
          </div>
        )}

        {formData.type === 'Furniture' && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Height (CM)</label>
              <input
                type="text"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
            </div>

            <div>
              <label className="block mb-2">Width (CM)</label>
              <input
                type="text"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${errors.width ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
            </div>

            <div>
              <label className="block mb-2">Length (CM)</label>
              <input
                type="text"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${errors.length ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
            </div>
            <p className="text-gray-500 text-sm">Please, provide dimensions in HxWxL format</p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}