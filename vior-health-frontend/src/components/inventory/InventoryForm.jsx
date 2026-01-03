import { useState } from 'react';
import Button from '../common/Button';
import { Save, X } from 'lucide-react';

const InventoryForm = ({ onClose, onSubmit, editData = null }) => {
  const [formData, setFormData] = useState({
    name: editData?.name || '',
    sku: editData?.sku || '',
    category: editData?.category || '',
    quantity: editData?.quantity || '',
    minStock: editData?.minStock || '',
    price: editData?.price || '',
    expiry: editData?.expiry || '',
    supplier: editData?.supplier || '',
    description: editData?.description || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
            Category <span className="text-danger-600">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Select category</option>
            <option value="Pain Relief">Pain Relief</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Gastric">Gastric</option>
            <option value="Allergy">Allergy</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Surgical">Surgical Supplies</option>
            <option value="Wellness">Wellness</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Supplier
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="input-field"
            placeholder="Supplier name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Quantity <span className="text-danger-600">*</span>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Minimum Stock Level <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            name="minStock"
            value={formData.minStock}
            onChange={handleChange}
            required
            min="0"
            className="input-field"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Unit Price <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
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
            Expiry Date <span className="text-danger-600">*</span>
          </label>
          <input
            type="date"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
            required
            className="input-field"
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

      <div className="flex items-center gap-3 justify-end pt-4 border-t border-neutral-200">
        <Button variant="secondary" icon={<X className="w-4 h-4" />} onClick={onClose} type="button">
          Cancel
        </Button>
        <Button variant="primary" icon={<Save className="w-4 h-4" />} type="submit">
          {editData ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryForm;
