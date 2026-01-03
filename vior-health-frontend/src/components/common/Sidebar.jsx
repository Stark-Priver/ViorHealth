import { 
  LayoutDashboard, 
  Pill, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  FileText,
  Settings,
  Truck
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: ShoppingCart, label: 'Sales & POS', path: '/sales' },
    { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
    { icon: Truck, label: 'Suppliers', path: '/suppliers' },
    { icon: TrendingUp, label: 'Reports', path: '/reports' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: FileText, label: 'Audit Logs', path: '/audit' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen sticky top-0">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-800">VIOR PMS</h2>
              <p className="text-xs text-neutral-500">Pharmacy System</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'sidebar-link-active' : 'sidebar-link'
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
