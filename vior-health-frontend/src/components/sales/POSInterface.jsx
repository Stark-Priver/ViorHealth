import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { Plus, Minus, Trash2, ShoppingCart, Search, DollarSign, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { inventoryAPI, salesAPI } from '../../services/api';
import PrescriptionQuickView from '../prescriptions/PrescriptionQuickView';

const POSInterface = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getProducts();
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      // Only show active products with stock
      setProducts(data.filter(p => p.is_active && p.quantity > 0));
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
      if (existingItem.quantity < product.quantity) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast.warning('Insufficient stock');
      }
    } else {
      setCart([...cart, { 
        id: product.id, 
        name: product.name, 
        price: parseFloat(product.unit_price), 
        stock: product.quantity,
        unit_type: product.unit_type || 'piece',
        dosage_form: product.dosage_form || '',
        units_per_pack: product.units_per_pack || 1,
        quantity: 1 
      }]);
    }
  };

  const updateQuantity = (id, change) => {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    
    if (item.quantity + change > product.quantity) {
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

  const handleSelectPrescription = (prescription) => {
    // Add prescription items to cart
    if (prescription && prescription.items) {
      prescription.items.forEach(item => {
        const product = products.find(p => p.id === item.product);
        if (product && product.quantity >= item.quantity) {
          const existingItem = cart.find(cartItem => cartItem.id === product.id);
          if (existingItem) {
            setCart(cart.map(cartItem =>
              cartItem.id === product.id
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            ));
          } else {
            setCart(prevCart => [...prevCart, {
              id: product.id,
              name: product.name,
              price: parseFloat(product.unit_price),
              stock: product.quantity,
              unit_type: product.unit_type || 'piece',
              dosage_form: product.dosage_form || '',
              units_per_pack: product.units_per_pack || 1,
              quantity: item.quantity
            }]);
          }
        } else {
          toast.warning(`Insufficient stock for ${item.product_name}`);
        }
      });
      
      if (prescription.customer_name) {
        setCustomerName(prescription.customer_name);
      }
      
      toast.success('Prescription items added to cart');
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% VAT in Tanzania
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setProcessing(true);
      const saleData = {
        customer_name: customerName || 'Walk-in Customer',
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          unit_type: item.unit_type,
          dosage_form: item.dosage_form
        })),
        subtotal: subtotal,
        tax: tax,
        total_amount: total
      };

      await salesAPI.createSale(saleData);
      toast.success('Sale completed successfully!');
      setCart([]);
      setCustomerName('');
      setPaymentMethod('cash');
      fetchProducts(); // Refresh product stock
    } catch (error) {
      console.error('Error completing sale:', error);
      toast.error(error.response?.data?.message || 'Failed to complete sale');
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Products Section */}
      <div className="lg:col-span-2">
        <Card>
          <div className="mb-4 space-y-3">
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
            
            <button
              onClick={() => setShowPrescriptions(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 border border-teal-300 rounded-lg hover:bg-teal-100 transition-colors font-medium"
            >
              <FileText className="w-5 h-5" />
              Load Prescription
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-neutral-600">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-neutral-500">
                <p>No products available</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white border-2 border-neutral-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all text-left"
                >
                  <div className="w-full h-24 bg-neutral-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h4 className="font-semibold text-neutral-800 text-sm mb-1 line-clamp-2">{product.name}</h4>
                  {product.dosage_form && (
                    <p className="text-xs text-neutral-500 mb-1">{product.dosage_form}</p>
                  )}
                  <p className="text-lg font-bold text-primary-600">
                    TSH {parseFloat(product.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-neutral-500 capitalize">
                    per {product.unit_type || 'piece'} • Stock: {product.quantity}
                  </p>
                </button>
              ))
            )}
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input-field"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="insurance">Insurance</option>
            </select>
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
                      {item.dosage_form && (
                        <p className="text-xs text-neutral-500">{item.dosage_form}</p>
                      )}
                      <p className="text-sm text-neutral-600">
                        TSH {item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                        <span className="text-xs capitalize"> per {item.unit_type}</span>
                      </p>
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
                      <span className="w-12 text-center">
                        <span className="font-semibold">{item.quantity}</span>
                        <span className="text-xs capitalize block text-neutral-500">{item.unit_type}</span>
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 bg-white rounded hover:bg-neutral-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-neutral-800">
                      TSH {(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-neutral-200 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal:</span>
              <span className="font-semibold text-neutral-800">
                TSH {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">VAT (18%):</span>
              <span className="font-semibold text-neutral-800">
                TSH {tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between text-lg border-t border-neutral-200 pt-2">
              <span className="font-bold text-neutral-800">Total:</span>
              <span className="font-bold text-primary-600">
                TSH {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <Button
            variant="success"
            fullWidth
            className="mt-4"
            icon={<DollarSign className="w-5 h-5" />}
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
          >
            {processing ? 'Processing...' : 'Complete Sale'}
          </Button>
        </Card>
      </div>

      {/* Prescription Quick View Modal */}
      <Modal
        isOpen={showPrescriptions}
        onClose={() => setShowPrescriptions(false)}
        title="Pending Prescriptions"
        size="lg"
      >
        <PrescriptionQuickView
          onSelectPrescription={handleSelectPrescription}
          onClose={() => setShowPrescriptions(false)}
        />
      </Modal>
    </div>
  );
};

export default POSInterface;
