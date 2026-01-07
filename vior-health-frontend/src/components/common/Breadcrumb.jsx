import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map paths to display names
  const pathNameMap = {
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    pos: 'Point of Sale',
    sales: 'Sales',
    prescriptions: 'Prescriptions',
    'create-prescription': 'Create Prescription',
    suppliers: 'Suppliers',
    expenses: 'Expenses',
    reports: 'Reports',
    customers: 'Customers',
    audit: 'Audit Logs',
    settings: 'Settings',
    profile: 'Profile',
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link
        to="/dashboard"
        className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = pathNameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <div key={name} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            {isLast ? (
              <span className="text-neutral-900 font-medium">{displayName}</span>
            ) : (
              <Link
                to={routeTo}
                className="text-neutral-600 hover:text-primary-600 transition-colors"
              >
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
