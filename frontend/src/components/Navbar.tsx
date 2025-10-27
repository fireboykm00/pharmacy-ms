import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Pill, 
  ShoppingCart, 
  Users, 
  Package, 
  BarChart3, 
  LogOut,
  User
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Don't show navbar on login page
  if (location.pathname === '/login' || location.pathname === '/unauthorized') {
    return null;
  }

  const getNavItems = () => {
    if (!user) return [];

    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    ];

    const roleItems = {
      ADMIN: [
        { path: '/medicines', label: 'Medicines', icon: Pill },
        { path: '/suppliers', label: 'Suppliers', icon: Users },
        { path: '/sales', label: 'Sales', icon: ShoppingCart },
        { path: '/purchases', label: 'Purchases', icon: Package },
        { path: '/reports', label: 'Reports', icon: BarChart3 },
        { path: '/users', label: 'Users', icon: User },
      ],
      PHARMACIST: [
        { path: '/medicines', label: 'Medicines', icon: Pill },
        { path: '/suppliers', label: 'Suppliers', icon: Users },
        { path: '/sales', label: 'Sales', icon: ShoppingCart },
        { path: '/purchases', label: 'Purchases', icon: Package },
        { path: '/reports', label: 'Reports', icon: BarChart3 },
      ],
      CASHIER: [
        { path: '/medicines', label: 'Medicines', icon: Pill },
        { path: '/sales', label: 'Sales', icon: ShoppingCart },
      ],
    };

    return [...commonItems, ...(roleItems[user.role as keyof typeof roleItems] || [])];
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <Pill className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gray-900">PharmacyMS</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 px-3 overflow-y-auto">
          <div className="space-y-1">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
