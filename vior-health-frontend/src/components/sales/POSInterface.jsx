import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Plus, Minus, Trash2, ShoppingCart, Search, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

const POSInterface = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');

  const products = [
    { id: 1, name: 'Paracetamol 500mg', price: 2.50, stock: 500 },
    { id: 2, name: 'Ibuprofen 400mg', price: 3.75, stock: 320 },
    { id: 3, name: 'Amoxicillin 250mg', price: 5.00, stock: 45 },
    { id: 4, name: 'Cetirizine 10mg', price: 2.25, stock: 180 },
    { id: 5, name: 'Omeprazole 20mg', price: 4.50, stock: 15 },
    { id: 6, name: 'Metformin 500mg', price: 3.25, stock: 95 },
  ];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast.warning('Insufficient stock');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    
    if (item.quantity + change > product.stock) {
      toast.warning('Insufficient stock');
      return;
    }
    
    if (item.quantity + change <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + change }
        : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    toast.success('Sale completed successfully!');
    setCart([]);
    setCustomerName('');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products Section */}
      <div className="lg:col-span-2">
        <Card>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white border-2 border-neutral-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all text-left"
              >
                <div className="w-full h-24 bg-neutral-100 rounded-lg mb-3 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-neutral-400" />
                </div>
                <h4 className="font-semibold text-neutral-800 text-sm mb-1">{product.name}</h4>
                <p className="text-lg font-bold text-primary-600">${product.price.toFixed(2)}</p>
                <p className="text-xs text-neutral-500">Stock: {product.stock}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Cart Section */}
      <div>
        <Card title="Current Sale">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Customer Name (Optional)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="input-field"
              placeholder="Enter customer name"
            />
          </div>

          <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-neutral-50 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-neutral-800">{item.name}</h4>
                      <p className="text-sm text-neutral-600">${item.price.toFixed(2)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-danger-600 hover:text-danger-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 bg-white rounded hover:bg-neutral-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 bg-white rounded hover:bg-neutral-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-neutral-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-neutral-200 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal:</span>
              <span className="font-semibold text-neutral-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Tax (10%):</span>
              <span className="font-semibold text-neutral-800">${tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-lg border-t border-neutral-200 pt-2">
              <span className="font-bold text-neutral-800">Total:</span>
              <span className="font-bold text-primary-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            variant="success"
            fullWidth
            className="mt-4"
            icon={<DollarSign className="w-5 h-5" />}
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Complete Sale
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default POSInterface;
