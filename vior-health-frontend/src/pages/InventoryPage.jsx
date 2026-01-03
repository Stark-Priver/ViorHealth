import { useState, useRef } from 'react';
import InventoryList from '../components/inventory/InventoryList';
import InventoryForm from '../components/inventory/InventoryForm';
import StockAlerts from '../components/inventory/StockAlerts';
import ExpiryTracker from '../components/inventory/ExpiryTracker';
import Modal from '../components/common/Modal';
import { toast } from 'react-toastify';

const InventoryPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const inventoryListRef = useRef();

  const handleAddItem = () => {
    setShowAddModal(false);
    // Refresh the inventory list
    if (inventoryListRef.current) {
      inventoryListRef.current.fetchProducts();
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 border-b border-neutral-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'all'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            Stock Alerts
          </button>
          <button
            onClick={() => setActiveTab('expiry')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'expiry'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            Expiry Tracker
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'all' && <InventoryList ref={inventoryListRef} onAddItem={() => setShowAddModal(true)} />}
      {activeTab === 'alerts' && <StockAlerts />}
      {activeTab === 'expiry' && <ExpiryTracker />}

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        size="lg"
      >
        <InventoryForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddItem}
        />
      </Modal>
    </div>
  );
};

export default InventoryPage;
