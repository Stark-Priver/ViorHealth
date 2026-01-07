import { 
  LayoutDashboard, 
  Pill, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  FileText,
  Truck,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  Store,
  DollarSign,
  Settings as SettingsIcon
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import logo from '../../assets/logo.png';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const { user, hasRole } = useAuth();
  const { isCollapsed, toggleSidebar, isMobileOpen, toggleMobileSidebar, closeMobileSidebar } = useSidebar();
  const [expandedCategories, setExpandedCategories] = useState({
    dashboard: true,
    sales: true,
    inventory: true,
    financial: true,
    management: true
  });

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeMobileSidebar();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeMobileSidebar]);

  const toggleCategory = (category) => {
    if (!isCollapsed) {
      setExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    }
  };

  const menuCategories = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      items: [
        { 
          icon: LayoutDashboard, 
          label: 'Dashboard', 
          path: '/dashboard',
          roles: ['admin', 'manager', 'pharmacist', 'cashier']
        }
      ]
    },
    {
      id: 'sales',
      label: 'Sales & Operations',
      icon: Store,
      items: [
        { 
          icon: ShoppingCart, 
          label: 'Point of Sale', 
          path: '/pos',
          roles: ['admin', 'manager', 'pharmacist', 'cashier']
        },
        { 
          icon: TrendingUp, 
          label: 'Sales', 
          path: '/sales',
          roles: ['admin', 'manager', 'pharmacist', 'cashier']
        },
        { 
          icon: Pill, 
          label: 'Prescriptions', 
          path: '/prescriptions',
          roles: ['admin', 'pharmacist']
        }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory & Supply',
      icon: Package,
      items: [
        { 
          icon: Package, 
          label: 'Inventory', 
          path: '/inventory',
          roles: ['admin', 'manager', 'pharmacist']
        },
        { 
          icon: Truck, 
          label: 'Suppliers', 
          path: '/suppliers',
          roles: ['admin', 'manager']
        }
      ]
    },
    {
      id: 'financial',
      label: 'Financial',
      icon: DollarSign,
      items: [
        { 
          icon: Receipt, 
          label: 'Expenses', 
          path: '/expenses',
          roles: ['admin', 'manager', 'pharmacist', 'cashier']
        }
      ]
    },
    {
      id: 'management',
      label: 'Management',
      icon: SettingsIcon,
      items: [
        { 
          icon: FileText, 
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
        }
      ]
    }
  ];

  // Filter categories and items based on user role
  const visibleCategories = menuCategories.map(category => ({
    ...category,
    items: category.items.filter(item => hasRole(item.roles))
  })).filter(category => category.items.length > 0);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-6 h-6 text-neutral-700" /> : <Menu className="w-6 h-6 text-neutral-700" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-white border-r border-neutral-200 z-40
          transition-all duration-300 ease-in-out flex flex-col
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo Section with Toggle */}
        <div className={`p-4 border-b border-neutral-200 flex items-center justify-between flex-shrink-0 ${isCollapsed ? 'flex-col gap-2' : ''}`}>
          {!isCollapsed ? (
            <>
              <img src={logo} alt="VIOR Health" className="h-10 w-auto" />
              {/* Toggle Button - Desktop */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex items-center justify-center p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all duration-200 border border-neutral-200 hover:border-neutral-300"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-neutral-600" />
              </button>
            </>
          ) : (
            <>
              <div className="w-full flex justify-center">
                <img 
                  src={logo} 
                  alt="VIOR Health" 
                  className="h-8 w-auto transition-all duration-300 hover:scale-110" 
                />
              </div>
              {/* Toggle Button - Desktop Collapsed */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:flex items-center justify-center p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all duration-200 border border-neutral-200 hover:border-neutral-300"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <div className="space-y-1">
            {visibleCategories.map((category) => (
              <div key={category.id}>
                {/* Category Header */}
                {!isCollapsed ? (
                  category.items.length > 1 && (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider hover:text-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        <span>{category.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedCategories[category.id] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )
                ) : (
                  category.items.length > 1 && (
                    <div className="flex justify-center py-2 border-t border-neutral-200 mt-1 mb-1">
                      <category.icon className="w-4 h-4 text-neutral-400" />
                    </div>
                  )
                )}

                {/* Category Items */}
                <div
                  className={`space-y-0.5 ${
                    !isCollapsed && category.items.length > 1
                      ? expandedCategories[category.id]
                        ? 'block'
                        : 'hidden'
                      : 'block'
                  }`}
                >
                  {category.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileSidebar}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-lg transition-all duration-200 font-medium relative text-sm overflow-hidden
                        ${isActive 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }
                        ${isCollapsed ? 'justify-center px-3 py-2.5' : 'pl-4 pr-3 py-2.5'}
                        ${!isCollapsed && category.items.length > 1 ? 'ml-2' : ''}`
                      }
                      title={isCollapsed ? item.label : ''}
                    >
                      <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-6 px-3 py-2 bg-neutral-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                          {item.label}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-neutral-900"></div>
                        </div>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User Role Indicator */}
        {user && !isCollapsed && (
          <div className="p-3 mx-3 mb-3 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200 flex-shrink-0">
            <p className="text-xs text-neutral-600 mb-0.5">Current Role</p>
            <p className="text-sm font-semibold text-primary-700 capitalize truncate">{user.role}</p>
          </div>
        )}

        {/* User Avatar for collapsed state */}
        {user && isCollapsed && (
          <div className="p-3 flex justify-center flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
