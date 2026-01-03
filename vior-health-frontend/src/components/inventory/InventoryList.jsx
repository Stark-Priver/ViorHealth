import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Plus, Search, Filter, Download, Package, AlertCircle } from 'lucide-react';
import { inventoryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const InventoryList = forwardRef(({ onAddItem }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Expose fetchProducts to parent component
  useImperativeHandle(ref, () => ({
    fetchProducts
  }));

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getProducts();
      const productsList = Array.isArray(response.data) ? response.data : response.data.results || [];
      setProducts(productsList);
      
      // Calculate stats
      const total = productsList.length;
      const inStock = productsList.filter(p => p.quantity > p.reorder_level).length;
      const lowStock = productsList.filter(p => p.quantity > 0 && p.quantity <= p.reorder_level).length;
      const outOfStock = productsList.filter(p => p.quantity === 0).length;
      
      setStats({ total, inStock, lowStock, outOfStock });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const inventoryData = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      sku: 'MED-001',
      category: 'Pain Relief',
      quantity: 500,
      minStock: 100,
      price: 2.50,
      expiry: '2025-12-31',
      status: 'In Stock',
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      sku: 'MED-002',
      category: 'Antibiotic',
      quantity: 45,
      minStock: 50,
      price: 5.00,
      expiry: '2025-06-30',
      status: 'Low Stock',
    },
    {
      id: 3,
      name: 'Ibuprofen 400mg',
      sku: 'MED-003',
      category: 'Pain Relief',
      quantity: 320,
      minStock: 100,
      price: 3.75,
      expiry: '2026-03-15',
      status: 'In Stock',
    },
    {
      id: 4,
      name: 'Omeprazole 20mg',
      sku: 'MED-004',
      category: 'Gastric',
      quantity: 15,
      minStock: 30,
      price: 4.50,
      expiry: '2025-02-28',
      status: 'Critical',
    },
    {
      id: 5,
      name: 'Cetirizine 10mg',
      sku: 'MED-005',
      category: 'Allergy',
      quantity: 180,
      minStock: 75,
      price: 2.25,
      expiry: '2025-11-20',
      status: 'In Stock',
    },
  ];

  const columns = [
    {
      header: 'Product Details',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-semibold text-neutral-800">{row.name}</p>
          <p className="text-xs text-neutral-500">SKU: {row.sku}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => row.category?.name || 'N/A',
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      render: (row) => (
        <div>
          <p className="font-semibold">{row.quantity}</p>
          <p className="text-xs text-neutral-500">Min: {row.reorder_level}</p>
        </div>
      ),
    },
    {
      header: 'Price',
      accessor: 'unit_price',
      render: (row) => `TSH ${parseFloat(row.unit_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      header: 'Expiry Date',
      accessor: 'expiry_date',
      render: (row) => row.expiry_date || 'N/A',
    },
    {
      header: 'Status',
      accessor: 'quantity',
      render: (row) => {
        const status = row.quantity === 0 ? 'Out of Stock' 
          : row.quantity <= row.reorder_level ? 'Low Stock' 
          : 'In Stock';
        
        return (
          <Badge
            variant={
              status === 'In Stock' ? 'success' :
              status === 'Low Stock' ? 'warning' :
              'danger'
            }
          >
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Inventory Management</h2>
          <p className="text-sm text-neutral-600">Manage your pharmaceutical inventory</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={onAddItem}>
          Add New Item
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
          <Button variant="secondary" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Total Products</p>
              <p className="text-xl font-bold text-neutral-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <Package className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">In Stock</p>
              <p className="text-xl font-bold text-neutral-800">{stats.inStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Low Stock</p>
              <p className="text-xl font-bold text-neutral-800">{stats.lowStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-xs text-neutral-600">Out of Stock</p>
              <p className="text-xl font-bold text-neutral-800">{stats.outOfStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-neutral-600">Loading products...</p>
          </div>
        ) : (
          <Table 
            columns={columns} 
            data={searchTerm 
              ? products.filter(p => 
                  p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                )
              : products
            } 
          />
        )}
      </Card>
    </div>
  );
});

InventoryList.displayName = 'InventoryList';

export default InventoryList;
