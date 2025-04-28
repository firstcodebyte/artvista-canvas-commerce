
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();
  const navigate = useNavigate();

  // Handle quantity change
  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  return (
    <div className="section-container">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
      
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-medium">Cart Items ({items.length})</h2>
              </div>
              
              {/* Items List */}
              {items.map((item) => (
                <div key={item.id} className="p-4 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    {/* Item Image */}
                    <Link to={`/artwork/${item.id}`} className="shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-24 h-24 object-cover rounded-md shadow-sm" 
                      />
                    </Link>
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/artwork/${item.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-artvista-purple truncate"
                      >
                        {item.title}
                      </Link>
                      <p className="text-gray-500 text-sm">by {item.artistName}</p>
                      <p className="text-artvista-purple-dark font-medium mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          handleQuantityChange(item.id, val || 1);
                        }}
                        className="h-8 w-12 text-center rounded-none border-x-0"
                        min={1}
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Remove Button */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-20">
              <h2 className="font-medium text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span className="text-artvista-purple-dark">{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-artvista-purple hover:bg-artvista-purple-dark"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
              
              <div className="mt-4">
                <Link 
                  to="/gallery" 
                  className="text-artvista-purple hover:text-artvista-purple-dark text-sm flex justify-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white rounded-lg shadow-sm border p-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any artwork to your cart yet.
          </p>
          <Button asChild>
            <Link to="/gallery">Browse Gallery</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
