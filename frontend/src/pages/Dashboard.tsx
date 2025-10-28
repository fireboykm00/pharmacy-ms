import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pill, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { reportAPI, saleAPI } from '@/services/api';
import { showErrorToast, showSuccessToast } from '@/utils/errorHandler';
import { Link } from 'react-router-dom';
import type { DashboardStats, StockReportDTO, ExpiryReport, SaleResponse, SalesSummary } from '@/types';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMedicines: 0,
    lowStockItems: 0,
    expiredItems: 0,
    todaySales: 0,
    monthlyRevenue: 0,
    monthlyProfit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // Get today's date in proper format
      const today = new Date();
      const todayISO = today.toISOString();
      const monthStartISO = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
      
      // Fetch base data first
      const [stockResponse, expiryResponse] = await Promise.all([
        reportAPI.getStock(),
        reportAPI.getExpiry(),
      ]);
      
      const stockData: StockReportDTO[] = Array.isArray(stockResponse.data) ? stockResponse.data : [];
      const expiredData: ExpiryReport[] = Array.isArray(expiryResponse.data) ? expiryResponse.data : [];
      
      let todaySales: SaleResponse[] = [];
      let monthlySummary: SalesSummary = { totalRevenue: 0, totalProfit: 0 };

      // Only add sales data for users with appropriate roles
      if (user?.role === 'ADMIN' || user?.role === 'PHARMACIST') {
        const [salesResponse, summaryResponse] = await Promise.all([
          saleAPI.getByDateRange(monthStartISO, todayISO),
          saleAPI.getSummary(monthStartISO, todayISO)
        ]);
        todaySales = Array.isArray(salesResponse.data) ? salesResponse.data : [];
        monthlySummary = summaryResponse.data && typeof summaryResponse.data === 'object' 
          ? summaryResponse.data 
          : { totalRevenue: 0, totalProfit: 0 };
      } else {
        // For CASHIER role, get all sales and filter locally
        const salesResponse = await saleAPI.getAll();
        const allSales: SaleResponse[] = Array.isArray(salesResponse.data) ? salesResponse.data : [];
        
        todaySales = allSales.filter((sale: SaleResponse) => {
          const saleDate = new Date(sale.saleDate);
          return saleDate.toDateString() === today.toDateString();
        });
        
        // Calculate monthly totals for CASHIER
        const monthlySales = allSales.filter((sale: SaleResponse) => {
          const saleDate = new Date(sale.saleDate);
          return saleDate.getMonth() === today.getMonth() && 
                 saleDate.getFullYear() === today.getFullYear();
        });
        
        monthlySummary = {
          totalRevenue: monthlySales.reduce((sum: number, sale: SaleResponse) => sum + (sale.totalAmount || 0), 0),
          totalProfit: monthlySales.reduce((sum: number, sale: SaleResponse) => sum + (sale.profit || 0), 0),
        };
      }

      setStats({
        totalMedicines: stockData.length,
        lowStockItems: stockData.filter((item: StockReportDTO) => 
          item.status === 'LOW' || item.status === 'OUT_OF_STOCK'
        ).length,
        expiredItems: expiredData.length,
        todaySales: todaySales.length,
        monthlyRevenue: monthlySummary.totalRevenue || 0,
        monthlyProfit: monthlySummary.totalProfit || 0,
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      showErrorToast(error);
      
      // Set default values on error
      setStats({
        totalMedicines: 0,
        lowStockItems: 0,
        expiredItems: 0,
        todaySales: 0,
        monthlyRevenue: 0,
        monthlyProfit: 0,
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
    showSuccessToast('Dashboard data refreshed');
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down';
    variant?: 'default' | 'warning' | 'danger';
  }> = ({ title, value, description, icon, trend, variant = 'default' }) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'warning':
          return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
        case 'danger':
          return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
        default:
          return 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';
      }
    };

    return (
      <Card className={getVariantClasses()}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1 text-green-500" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1 text-red-500" />}
            {description}
          </p>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's an overview of your pharmacy.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="mt-4 sm:mt-0"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Medicines"
          value={stats.totalMedicines}
          description="Different medicines in stock"
          icon={<Pill className="h-4 w-4" />}
        />
        
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          description="Items need restocking"
          icon={<AlertTriangle className="h-4 w-4" />}
          variant={stats.lowStockItems > 0 ? 'warning' : 'default'}
        />
        
        <StatCard
          title="Expired Items"
          value={stats.expiredItems}
          description="Items past expiry date"
          icon={<Package className="h-4 w-4" />}
          variant={stats.expiredItems > 0 ? 'danger' : 'default'}
        />
        
        <StatCard
          title="Today's Sales"
          value={stats.todaySales}
          description="Sales transactions today"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
      </div>

      {/* Revenue and Profit */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toFixed(2)}`}
          description="Total revenue this month"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
        />
        
        <StatCard
          title="Monthly Profit"
          value={`$${stats.monthlyProfit.toFixed(2)}`}
          description="Total profit this month"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
        />
      </div>

      {/* Quick Actions and Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {user?.role !== 'CASHIER' && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/medicines">
                    <Pill className="h-3 w-3 mr-1" />
                    Add Medicine
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="sm">
                <Link to="/sales">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Process Sale
                </Link>
              </Button>
              {user?.role !== 'CASHIER' && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/purchases">
                    <Package className="h-3 w-3 mr-1" />
                    Record Purchase
                  </Link>
                </Button>
              )}
              {user?.role !== 'CASHIER' && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/reports">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Check Expiry
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <Badge variant="default">Connected</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">API Status</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">User Role</span>
              <Badge variant="outline">{user?.role}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Updated</span>
              <Badge variant="outline">Just now</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
