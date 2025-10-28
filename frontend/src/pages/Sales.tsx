import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Plus,
  DollarSign,
  Calendar
} from 'lucide-react';
import { saleAPI, medicineAPI } from '@/services/api';
import { toast } from 'sonner';
import type { SaleResponse, Medicine } from '@/types';

export const Sales: React.FC = () => {
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    medicineId: '',
    quantity: '',
  });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salesRes, medicinesRes] = await Promise.all([
        saleAPI.getAll(),
        medicineAPI.getAll(),
      ]);
      
      // Ensure we always set arrays, even if response is malformed
      const salesData = Array.isArray(salesRes.data) ? salesRes.data : [];
      const medicinesData = Array.isArray(medicinesRes.data) ? medicinesRes.data : [];
      
      console.log('Fetched sales:', salesData.length);
      console.log('Fetched medicines:', medicinesData.length);
      
      setSales(salesData);
      setMedicines(medicinesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to fetch data');
      setSales([]);
      setMedicines([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (medicineId: string, quantity: string) => {
    if (medicineId && quantity) {
      const medicine = medicines.find(m => m.medicineId.toString() === medicineId);
      if (medicine) {
        const total = medicine.sellingPrice * parseInt(quantity);
        setTotalAmount(total);
      }
    } else {
      setTotalAmount(0);
    }
  };

  const handleMedicineChange = (value: string) => {
    setFormData({ ...formData, medicineId: value });
    calculateTotal(value, formData.quantity);
  };

  const handleQuantityChange = (value: string) => {
    setFormData({ ...formData, quantity: value });
    calculateTotal(formData.medicineId, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saleData = {
        medicineId: parseInt(formData.medicineId),
        quantity: parseInt(formData.quantity),
      };

      await saleAPI.create(saleData);
      toast.success('Sale processed successfully');
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process sale');
    }
  };

  const resetForm = () => {
    setFormData({
      medicineId: '',
      quantity: '',
    });
    setTotalAmount(0);
  };

  const getAvailableStock = (medicineId: string) => {
    const medicine = medicines.find(m => m.medicineId.toString() === medicineId);
    return medicine ? medicine.quantity : 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalProfit = sales.reduce((sum, sale) => sum + sale.profit, 0);
  const todaySales = sales.filter(sale => 
    new Date(sale.saleDate).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">Process and manage sales transactions</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Process New Sale</DialogTitle>
              <DialogDescription>
                Select medicine and quantity to process a sale
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicineId">Medicine</Label>
                <Select value={formData.medicineId} onValueChange={handleMedicineChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medicine" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicines && medicines.length > 0 ? (
                      medicines.map((medicine) => (
                        <SelectItem 
                          key={medicine.medicineId} 
                          value={medicine.medicineId.toString()}
                          disabled={medicine.quantity === 0}
                        >
                          {medicine.name} - ${medicine.sellingPrice} (Stock: {medicine.quantity})
                        </SelectItem>
                      ))
                    ) : null}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={getAvailableStock(formData.medicineId)}
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  required
                />
                {formData.medicineId && (
                  <p className="text-sm text-muted-foreground">
                    Available stock: {getAvailableStock(formData.medicineId)}
                  </p>
                )}
              </div>
              
              {totalAmount > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!formData.medicineId || !formData.quantity}>
                  Process Sale
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All time revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All time profit
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySales}</div>
            <p className="text-xs text-muted-foreground">
              Sales today
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>
            Recent sales transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sold By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales && sales.length > 0 ? (
                sales.map((sale) => (
                  <TableRow key={sale.saleId}>
                    <TableCell className="font-medium">{sale.medicineName}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>${sale.profit.toFixed(2)}</TableCell>
                    <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.userName}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No sales found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
