import SalesHistory from '../components/sales/SalesHistory';

const SalesPage = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Sales History</h1>
        <p className="text-neutral-600 mt-1">View and manage sales transactions</p>
      </div>
      
      <SalesHistory />
    </div>
  );
};

export default SalesPage;
