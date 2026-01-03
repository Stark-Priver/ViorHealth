import { useState, useEffect } from 'react';
import Button from '../common/Button';
import { Save, X, Plus } from 'lucide-react';
import { inventoryAPI } from '../../services/api';
import { toast } from 'react-toastify';

const InventoryForm = ({ onClose, onSubmit, editData = null }) => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    generic_name: editData?.generic_name || '',
    sku: editData?.sku || '',
    barcode: editData?.barcode || '',
    category: editData?.category?.id || '',
    supplier: editData?.supplier?.id || '',
    unit_type: editData?.unit_type || 'piece',
    dosage_form: editData?.dosage_form || '',
    units_per_pack: editData?.units_per_pack || 1,
    quantity: editData?.quantity || '',
    reorder_level: editData?.reorder_level || '',
    unit_price: editData?.unit_price || '',
    cost_price: editData?.cost_price || '',
    expiry_date: editData?.expiry_date || '',
    batch_number: editData?.batch_number || '',
    description: editData?.description || '',
    is_prescription_required: editData?.is_prescription_required || false,
  });

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await inventoryAPI.getCategories();
      setCategories(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await inventoryAPI.getSuppliers();
      setSuppliers(Array.isArray(response.data) ? response.data : response.data.results || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await inventoryAPI.createCategory(newCategory);
      toast.success('Category added successfully');
      setCategories([...categories, response.data]);
      setFormData({ ...formData, category: response.data.id });
      setNewCategory({ name: '', description: '' });
      setShowAddCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editData) {
        await inventoryAPI.updateProduct(editData.id, formData);
        toast.success('Product updated successfully');
      } else {
        await inventoryAPI.createProduct(formData);
        toast.success('Product added successfully');
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Product Name <span className="text-danger-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Generic Name
          </label>
          <input
            type="text"
            name="generic_name"
            value={formData.generic_name}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter generic name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            SKU Code <span className="text-danger-600">*</span>
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="e.g., MED-001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Barcode
          </label>
          <input
            type="text"
            name="barcode"
            value={formData.barcode}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter barcode"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Unit Type <span className="text-danger-600">*</span>
          </label>
          <select
            name="unit_type"
            value={formData.unit_type}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="tablet">Tablet</option>
            <option value="capsule">Capsule</option>
            <option value="bottle">Bottle</option>
            <option value="box">Box</option>
            <option value="sachet">Sachet</option>
            <option value="vial">Vial</option>
            <option value="tube">Tube</option>
            <option value="strip">Strip</option>
            <option value="piece">Piece</option>
            <option value="ml">Milliliter (ml)</option>
            <option value="mg">Milligram (mg)</option>
            <option value="unit">Unit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Dosage Form
          </label>
          <input
            type="text"
            name="dosage_form"
            value={formData.dosage_form}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., 500mg, 10ml, 250mg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Units Per Pack <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            name="units_per_pack"
            value={formData.units_per_pack}
            onChange={handleChange}
            required
            min="1"
            className="input-field"
            placeholder="e.g., 10, 20, 100"
          />
          <p className="text-xs text-neutral-500 mt-1">
            How many {formData.unit_type}s in one pack/box
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category <span className="text-danger-600">*</span>
          </label>
          <div className="flex gap-2">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input-field flex-1"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="px-3 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
              title="Add new category"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {showAddCategory && (
            <div className="mt-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="input-field text-sm"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="input-field text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={loading}
                    className="flex-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    Add Category
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategory({ name: '', description: '' });
                    }}
                    className="flex-1 px-3 py-1.5 bg-neutral-200 text-neutral-700 text-sm rounded-lg hover:bg-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Supplier
          </label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Total Quantity in Stock <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            className="input-field"
            placeholder="0"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Total {formData.unit_type}s available
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Reorder Level <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            name="reorder_level"
            value={formData.reorder_level}
            onChange={handleChange}
            required
            min="0"
            className="input-field"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Unit Price (TSH) <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="input-field"
            placeholder="0.00"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Price per {formData.unit_type}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Cost Price (TSH) <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            name="cost_price"
            value={formData.cost_price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="input-field"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Batch Number
          </label>
          <input
            type="text"
            name="batch_number"
            value={formData.batch_number}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter batch number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="input-field"
          placeholder="Enter product description..."
        ></textarea>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_prescription_required"
            checked={formData.is_prescription_required}
            onChange={(e) => setFormData({ ...formData, is_prescription_required: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">Prescription Required</span>
        </label>
      </div>

      <div className="flex items-center gap-3 justify-end pt-4 border-t border-neutral-200">
        <Button variant="secondary" icon={<X className="w-4 h-4" />} onClick={onClose} type="button" disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" icon={<Save className="w-4 h-4" />} type="submit" disabled={loading}>
          {loading ? 'Saving...' : editData ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryForm;
