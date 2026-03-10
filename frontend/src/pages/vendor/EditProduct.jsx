import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import productService from '../../services/productService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Jewelry',
    images: [''],
    stock: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Jewelry', 'Watches', 'Handbags', 'Accessories', 'Clothing'];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getMyProductById(id);
      const product = response.product;
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        images: product.images.length > 0 ? product.images : [''],
        stock: product.stock
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    if (formData.stock < 0) {
      setError('Stock cannot be negative');
      return;
    }

    const validImages = formData.images.filter(img => img.trim() !== '');
    if (validImages.length === 0) {
      setError('At least one image URL is required');
      return;
    }

    setSubmitting(true);

    try {
      await productService.updateProduct(id, {
        ...formData,
        images: validImages,
        price: Number(formData.price),
        stock: Number(formData.stock)
      });
      navigate('/vendor/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-white text-5xl font-playfair mb-12">Edit Product</h1>

      <div className="max-w-3xl">
        <div className="bg-card rounded-2xl p-8 luxury-shadow">
          {error && <ErrorMessage message={error} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Product Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Luxury Diamond Necklace"
              required
            />

            <div>
              <label className="block text-secondary text-sm mb-2 font-semibold">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed product description..."
                rows="4"
                required
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-2xl border border-border focus:border-gold focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price (₹)"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="50000"
                min="0"
                step="0.01"
                required
              />

              <Input
                label="Stock Quantity"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-secondary text-sm mb-2 font-semibold">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-2xl border border-border focus:border-gold focus:outline-none transition-all duration-300"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-secondary text-sm mb-2 font-semibold">
                Product Images (URLs)
              </label>
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 bg-neutral-800 text-white px-4 py-3 rounded-2xl border border-border focus:border-gold focus:outline-none transition-all duration-300"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="px-4 py-3 bg-red-500 bg-opacity-20 text-red-500 rounded-2xl hover:bg-opacity-30 transition-all duration-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-gold hover:text-yellow-400 text-sm transition-all duration-300 font-semibold"
                >
                  + Add Another Image
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/vendor/products')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
