import { useState } from 'react';
import POSInterface from '../components/sales/POSInterface';
import SalesHistory from '../components/sales/SalesHistory';

const SalesPage = () => {
  const [activeTab, setActiveTab] = useState('pos');

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 border-b border-neutral-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('pos')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'pos'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            Point of Sale
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            Sales History
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'pos' && <POSInterface />}
      {activeTab === 'history' && <SalesHistory />}
    </div>
  );
};

export default SalesPage;
