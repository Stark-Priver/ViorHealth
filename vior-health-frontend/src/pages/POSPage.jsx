import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ShoppingCart, X, DollarSign, CreditCard, Smartphone } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { inventoryAPI, salesAPI } from '../services/api';
import { toast } from 'react-toastify';

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [applyVat, setApplyVat] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getProducts();
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      // Only show products with stock > 0
      setProducts(data.filter(p => p.quantity > 0));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        toast.warning('Cannot add more than available stock');
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (newQuantity > product.quantity) {
      toast.warning('Cannot exceed available stock');
      return;
    }
    
    setCart(cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  };

  const calculateTax = () => {
    return applyVat ? calculateSubtotal() * 0.18 : 0; // 18% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };

  const calculateChange = () => {
    const paid = parseFloat(amountPaid) || 0;
    const total = calculateTotal();
    return paid > total ? paid - total : 0;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!amountPaid || parseFloat(amountPaid) < calculateTotal()) {
      toast.error('Payment amount is insufficient');
      return;
    }

    try {
      const saleData = {
        items: cart.map(item => ({
          product: item.id,
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
          discount: 0
        })),
        payment_method: paymentMethod,
        amount_paid: parseFloat(amountPaid),
        discount: parseFloat(discount) || 0,
        tax: parseFloat(calculateTax()),
        notes: notes || ''
      };

      console.log('Sale data being sent:', saleData); // Debug log
      const response = await salesAPI.createSale(saleData);
      
      if (response.data) {
        toast.success('Sale completed successfully!');
        
        // Reset cart and form
        setCart([]);
        setAmountPaid('');
        setDiscount(0);
        setNotes('');
        setApplyVat(true);
        setShowCheckoutModal(false);
        
        // Refresh products to update stock
        fetchProducts();
      }
    } catch (error) {
      console.error('Error processing sale:', error);
      console.error('Error response:', error.response?.data); // Debug log
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          JSON.stringify(error.response?.data) ||
                          'Failed to process sale';
      toast.error(errorMessage);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Point of Sale</h1>
        <p className="text-neutral-600 mt-1">Process sales and manage transactions</p>
      </div>

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
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-neutral-600">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-neutral-600">No products found</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <h3 className="font-semibold text-neutral-800 mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-neutral-600 mb-2">{product.category?.name || 'General'}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary-600">
                        TZS {parseFloat(product.unit_price || 0).toLocaleString()}
                      </span>
                      <span className="text-sm text-neutral-500">
                        Stock: {product.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-neutral-800">Cart ({cart.length})</h2>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-neutral-300 mx-auto mb-2" />
                <p className="text-neutral-600">Cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-800 truncate">{item.name}</p>
                        <p className="text-sm text-neutral-600">TZS {parseFloat(item.unit_price || 0).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 rounded hover:bg-neutral-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 rounded hover:bg-neutral-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-2">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal:</span>
                    <span>TZS {calculateSubtotal().toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-600">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="vatToggle"
                        checked={applyVat}
                        onChange={(e) => setApplyVat(e.target.checked)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="vatToggle" className="cursor-pointer">Tax (18%):</label>
                    </div>
                    <span>TZS {calculateTax().toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span>-TZS {discount.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-neutral-800 pt-2 border-t">
                    <span>Total:</span>
                    <span>TZS {calculateTotal().toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full mt-4"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Complete Sale"
      >
        <div className="space-y-4">
          <div className="bg-neutral-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal:</span>
              <span className="font-medium">TZS {calculateSubtotal().toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vatToggleModal"
                  checked={applyVat}
                  onChange={(e) => setApplyVat(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="vatToggleModal" className="text-neutral-600 cursor-pointer">Tax (18%):</label>
              </div>
              <span className="font-medium">TZS {calculateTax().toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span className="text-primary-600">TZS {calculateTotal().toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  paymentMethod === 'cash'
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-neutral-300 hover:border-neutral-400'
                }`}
              >
                <DollarSign className="w-6 h-6" />
                <span className="text-sm font-medium">Cash</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-neutral-300 hover:border-neutral-400'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-sm font-medium">Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('mobile')}
                className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  paymentMethod === 'mobile'
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-neutral-300 hover:border-neutral-400'
                }`}
              >
                <Smartphone className="w-6 h-6" />
                <span className="text-sm font-medium">Mobile</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Amount Paid *
            </label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          {amountPaid && parseFloat(amountPaid) >= calculateTotal() && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-green-700 font-medium">Change:</span>
                <span className="text-xl font-bold text-green-700">
                  TZS {calculateChange().toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Discount (Optional)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add any notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowCheckoutModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              className="flex-1"
              disabled={!amountPaid || parseFloat(amountPaid) < calculateTotal()}
            >
              Complete Sale
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default POSPage;
