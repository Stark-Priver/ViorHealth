import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, ShoppingCart, X, DollarSign, CreditCard, Smartphone, TestTube } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { inventoryAPI, salesAPI } from '../services/api';
import { laboratoryAPI } from '../services/laboratory';
import { toast } from 'react-toastify';

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemType, setItemType] = useState('all'); // all, products, tests
  const [loading, setLoading] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [applyVat, setApplyVat] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchTestTypes();
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

  const fetchTestTypes = async () => {
    try {
      const response = await laboratoryAPI.getTestTypes();
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      // Only show active test types
      setTestTypes(data.filter(t => t.is_active));
    } catch (error) {
      console.error('Error fetching test types:', error);
    }
  };

  const addToCart = (item, type = 'product') => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === type);
    
    if (type === 'product') {
      if (existingItem) {
        if (existingItem.quantity >= item.quantity) {
          toast.warning('Cannot add more than available stock');
          return;
        }
        setCart(cart.map(cartItem =>
          cartItem.id === item.id && cartItem.type === 'product'
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ));
      } else {
        setCart([...cart, { ...item, quantity: 1, type: 'product' }]);
      }
      toast.success(`${item.name} added to cart`);
    } else if (type === 'test') {
      // Test types are always quantity 1 (one test per cart item)
      if (existingItem) {
        toast.info('Test already in cart');
        return;
      }
      setCart([...cart, { ...item, quantity: 1, type: 'test', unit_price: item.cost }]);
      toast.success(`${item.name} test added to cart`);
    }
  };

  const updateQuantity = (itemId, itemType, newQuantity) => {
    const item = itemType === 'product' 
      ? products.find(p => p.id === itemId)
      : testTypes.find(t => t.id === itemId);
    
    if (newQuantity <= 0) {
      removeFromCart(itemId, itemType);
      return;
    }
    
    // Tests are always quantity 1
    if (itemType === 'test' && newQuantity !== 1) {
      toast.info('Lab tests are single quantity items');
      return;
    }
    
    if (itemType === 'product' && newQuantity > item.quantity) {
      toast.warning('Cannot exceed available stock');
      return;
    }
    
    setCart(cart.map(cartItem =>
      cartItem.id === itemId && cartItem.type === itemType 
        ? { ...cartItem, quantity: newQuantity } 
        : cartItem
    ));
  };

  const removeFromCart = (itemId, itemType) => {
    setCart(cart.filter(item => !(item.id === itemId && item.type === itemType)));
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
      // Separate products and tests from cart
      const productItems = cart.filter(item => item.type === 'product');
      const testItems = cart.filter(item => item.type === 'test');

      const saleData = {
        items: productItems.map(item => ({
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
        const saleId = response.data.id;
        
        // Create lab tests linked to this sale
        if (testItems.length > 0) {
          for (const test of testItems) {
            try {
              await laboratoryAPI.createLabTest({
                test_type: test.id,
                test_name: test.name,
                cost: parseFloat(test.cost),
                paid: true,
                payment_method: paymentMethod,
                sale: saleId,
                patient_name: 'Walk-in Customer', // Can be enhanced to ask for patient details
                description: `Purchased at POS - Sale #${response.data.invoice_number}`
              });
            } catch (testError) {
              console.error('Error creating lab test:', testError);
              toast.warning(`Lab test ${test.name} couldn't be created automatically`);
            }
          }
        }
        
        toast.success(`Sale completed successfully!${testItems.length > 0 ? ` ${testItems.length} lab test(s) created.` : ''}`);
        
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

  const filteredTests = testTypes.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilteredItems = () => {
    if (itemType === 'products') return filteredProducts.map(p => ({ ...p, itemType: 'product' }));
    if (itemType === 'tests') return filteredTests.map(t => ({ ...t, itemType: 'test' }));
    return [
      ...filteredProducts.map(p => ({ ...p, itemType: 'product' })),
      ...filteredTests.map(t => ({ ...t, itemType: 'test' }))
    ];
  };

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
            <div className="mb-4 space-y-3">
              {/* Item Type Tabs */}
              <div className="flex gap-2 border-b border-neutral-200">
                <button
                  onClick={() => setItemType('all')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    itemType === 'all'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setItemType('products')}
                  className={`px-4 py-2 font-medium transition-colors ${
                    itemType === 'products'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => setItemType('tests')}
                  className={`px-4 py-2 font-medium transition-colors flex items-center gap-1 ${
                    itemType === 'tests'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <TestTube className="w-4 h-4" />
                  Lab Tests
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={itemType === 'tests' ? 'Search lab tests...' : 'Search items...'}
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
                  <p className="mt-4 text-neutral-600">Loading items...</p>
                </div>
              ) : getFilteredItems().length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-neutral-600">No items found</p>
                </div>
              ) : (
                getFilteredItems().map((item) => (
                  <div
                    key={`${item.itemType}-${item.id}`}
                    className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => addToCart(item, item.itemType)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-neutral-800 truncate">{item.name}</h3>
                      {item.itemType === 'test' && <TestTube className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-neutral-600 mb-2">
                      {item.itemType === 'product' ? (item.category?.name || 'General') : item.code}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary-600">
                        TZS {parseFloat(item.itemType === 'product' ? item.unit_price : item.cost || 0).toLocaleString()}
                      </span>
                      {item.itemType === 'product' && (
                        <span className="text-sm text-neutral-500">
                          Stock: {item.quantity}
                        </span>
                      )}
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
                    <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <p className="font-medium text-neutral-800 truncate">{item.name}</p>
                          {item.type === 'test' && <TestTube className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-neutral-600">TZS {parseFloat(item.unit_price || 0).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.type === 'product' ? (
                          <>
                            <button
                              onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 rounded hover:bg-neutral-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 rounded hover:bg-neutral-100"
                            >
                              +
                            </button>
                          </>
                        ) : (
                          <span className="w-20 text-center font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">1 Test</span>
                        )}
                        <button
                          onClick={() => removeFromCart(item.id, item.type)}
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
