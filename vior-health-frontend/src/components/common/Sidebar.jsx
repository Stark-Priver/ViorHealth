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
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Sidebar = () => {
  const { user, hasRole } = useAuth();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/dashboard',
      roles: ['admin', 'manager', 'pharmacist', 'cashier']
    },
    { 
      icon: Package, 
      label: 'Inventory', 
      path: '/inventory',
      roles: ['admin', 'manager', 'pharmacist']
    },
    { 
      icon: ShoppingCart, 
      label: 'Sales & POS', 
      path: '/sales',
      roles: ['admin', 'manager', 'pharmacist', 'cashier']
    },
    { 
      icon: Pill, 
      label: 'Prescriptions', 
      path: '/prescriptions',
      roles: ['admin', 'manager', 'pharmacist']
    },
    { 
      icon: Truck, 
      label: 'Suppliers', 
      path: '/suppliers',
      roles: ['admin', 'manager']
    },
    { 
      icon: TrendingUp, 
      label: 'Reports', 
      path: '/reports',
      roles: ['admin', 'manager']
    },
    { 
      icon: Users, 
      label: 'Customers', 
      path: '/customers',
      roles: ['admin', 'manager', 'pharmacist', 'cashier']
    },
    { 
      icon: FileText, 
      label: 'Audit Logs', 
      path: '/audit',
      roles: ['admin']
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings',
      roles: ['admin', 'manager']
    },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => hasRole(item.roles));

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-screen fixed left-0 top-0 overflow-hidden">
      <div className="p-6 h-full flex flex-col">
        <div className="mb-8 flex-shrink-0">
          <img src={logo} alt="VIOR Health" className="h-16 w-auto mb-2" />
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {visibleMenuItems.map((item) => (
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

        {/* User Role Indicator */}
        {user && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg flex-shrink-0">
            <p className="text-xs text-neutral-600 mb-1">Current Role</p>
            <p className="text-sm font-semibold text-primary-700 capitalize">{user.role}</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
