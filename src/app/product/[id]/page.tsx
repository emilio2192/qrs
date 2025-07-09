"use client";
import { useState, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import Button from '../../shared/Button';
import ProductImageGallery from '../../components/ProductImageGallery';
import { fetchProduct } from '../../../lib/request';
import { Product } from '../../../types/api';
import { useDispatch, useSelector } from 'react-redux';
import { addItem as addCartItem, AppState, ReduxCartItem } from '@/lib/store';

export default function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const t = useTranslations();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: AppState) => state.cart.items);

  useEffect(() => {
    fetchProduct(params.id).then(setProduct);
  }, [params.id]);

  // Reset quantity when size changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  if (!product) return <div className="text-center py-20">{t('common.loading')}</div>;

  const thumbnails = product.images || [{ url: '/placeholder.png', alt: 'No image' }];

  // Calculate available stock without modifying the original product
  const getItemQuantity = (productId: string, size: string) => {
    const item = cartItems.find((i: ReduxCartItem) => i.productId === productId && i.size === size);
    return item ? item.quantity : 0;
  };
  const sizes = (product.sizes || []).map((s) => ({ 
    size: s.size, 
    stock: Math.max(0, s.stock - getItemQuantity(product.id, s.size))
  }));

  const selectedStock = selectedSize ? (sizes.find(s => s.size === selectedSize)?.stock ?? 0) : 0;

  const handleDecrease = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity(q => Math.min(selectedStock, q + 1));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8 mt-20">
      {/* Images */}
      <ProductImageGallery
        images={thumbnails}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        productName={product.name}
      />
      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="text-lg text-gray-700 mb-4">${Number(product.price).toLocaleString()}</div>
          <div className="text-gray-600 mb-4">{product.description}</div>
        </div>
        {/* Size Selector as Button Group */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('product.selectSize')}</label>
          <div className="flex gap-2 flex-wrap">
            {sizes.length === 0 ? (
              <span className="text-gray-500 text-sm">{t('product.noSizes')}</span>
            ) : (
              sizes.map(({ size, stock }) => (
                <button
                  key={size}
                  type="button"
                  className={`px-4 py-2 rounded border text-sm font-medium transition-colors focus:outline-none ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setSelectedSize(size)}
                  disabled={stock === 0}
                >
                  {size}
                  <span className="ml-1 text-xs text-gray-500">({stock})</span>
                </button>
              ))
            )}
          </div>
        </div>
        {/* Quantity Selector with Add/Less Buttons */}
        <div>
          <label className="block text-sm font-medium mb-1">{t('product.quantity')}</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded border border-gray-300 bg-white text-lg font-bold hover:bg-gray-100"
              onClick={handleDecrease}
              aria-label={t('product.decreaseQuantity')}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="text"
              className="w-14 border rounded px-2 py-1 text-center"
              value={quantity}
              readOnly
            />
            <button
              type="button"
              className="px-3 py-1 rounded border border-gray-300 bg-white text-lg font-bold hover:bg-gray-100"
              onClick={handleIncrease}
              aria-label={t('product.increaseQuantity')}
              disabled={!selectedSize || quantity >= selectedStock}
            >
              +
            </button>
            {selectedSize && selectedStock === 0 && (
              <span className="ml-2 text-xs text-red-500">{t('product.outOfStock')}</span>
            )}
          </div>
        </div>
        {/* Add to Cart Button */}
        <Button 
          label={t('product.addToCart')} 
          className="w-full mt-4" 
          disabled={!selectedSize || selectedStock === 0} 
          onClick={() => {
            if (selectedSize) {
              dispatch(addCartItem({
                productId: product.id,
                size: selectedSize,
                quantity,
              }));
              setQuantity(1);
              setSelectedSize(null);
            }
          }}
        />
      </div>
    </div>
  );
} 