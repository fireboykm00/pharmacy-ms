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
import { purchaseAPI, medicineAPI, supplierAPI } from '@/services/api';
import { toast } from 'sonner';

interface Purchase {
  purchaseId: number;
  medicineName: string;
  supplierName: string;
  quantity: number;
  totalCost: number;
  purchaseDate: string;
}

interface Medicine {
  medicineId: number;
  name: string;
  category: string;
  costPrice: number;
}

interface Supplier {
  supplierId: number;
  name: string;
}

export const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    medicineId: '',
    supplierId: '',
    quantity: '',
    totalCost: '',
    purchaseDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [purchasesRes, medicinesRes, suppliersRes] = await Promise.all([
        purchaseAPI.getAll(),
        medicineAPI.getAll(),
        supplierAPI.getAll(),
      ]);
      setPurchases(purchasesRes.data);
      setMedicines(medicinesRes.data);
      setSuppliers(suppliersRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalCost = (medicineId: string, quantity: string) => {
    if (medicineId && quantity) {
      const medicine = medicines.find(m => m.medicineId.toString() === medicineId);
      if (medicine) {
        const total = medicine.costPrice * parseInt(quantity);
        setFormData({ ...formData, totalCost: total.toString() });
      }
    }
  };

  const handleMedicineChange = (value: string) => {
    setFormData({ ...formData, medicineId: value });
    calculateTotalCost(value, formData.quantity);
  };

  const handleQuantityChange = (value: string) => {
    setFormData({ ...formData, quantity: value });
    calculateTotalCost(formData.medicineId, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const purchaseData = {
        medicineId: parseInt(formData.medicineId),
        supplierId: parseInt(formData.supplierId),
        quantity: parseInt(formData.quantity),
        totalCost: parseFloat(formData.totalCost),
        purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
      };

      await purchaseAPI.create(purchaseData);
      toast.success('Purchase recorded successfully');
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error('Failed to record purchase');
    }
  };

  const resetForm = () => {
    setFormData({
      medicineId: '',
      supplierId: '',
      quantity: '',
      totalCost: '',
      purchaseDate: '',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
  const todayPurchases = purchases.filter(purchase => 
    new Date(purchase.purchaseDate).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
          <p className="text-muted-foreground">Manage medicine purchases from suppliers</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Purchase
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Record New Purchase</DialogTitle>
              <DialogDescription>
                Record a purchase from a supplier
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
                    {medicines.map((medicine) => (
                      <SelectItem key={medicine.medicineId} value={medicine.medicineId.toString()}>
                        {medicine.name} - ${medicine.costPrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplierId">Supplier</Label>
                <Select value={formData.supplierId} onValueChange={(value) => setFormData({ ...formData, supplierId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.supplierId} value={supplier.supplierId.toString()}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalCost">Total Cost</Label>
                <Input
                  id="totalCost"
                  type="number"
                  step="0.01"
                  value={formData.totalCost}
                  onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!formData.medicineId || !formData.supplierId || !formData.quantity}>
                  Record Purchase
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPurchases.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All time purchases
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Purchases</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPurchases}</div>
            <p className="text-xs text-muted-foreground">
              Purchases today
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>
            Recent purchase transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Purchase Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.purchaseId}>
                  <TableCell className="font-medium">{purchase.medicineName}</TableCell>
                  <TableCell>{purchase.supplierName}</TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>${purchase.totalCost.toFixed(2)}</TableCell>
                  <TableCell>{new Date(purchase.purchaseDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
