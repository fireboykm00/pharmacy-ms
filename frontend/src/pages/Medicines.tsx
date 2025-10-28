import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Edit, 
  Trash2, 
  AlertTriangle
} from 'lucide-react';
import { medicineAPI, supplierAPI } from '@/services/api';
import { toast } from 'sonner';
import type { Medicine, Supplier } from '@/types';

export const Medicines: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    expiryDate: '',
    reorderLevel: '',
    supplierId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [medicinesRes, suppliersRes] = await Promise.all([
        medicineAPI.getAll(),
        supplierAPI.getAll(),
      ]);
      
      // Ensure we always set arrays, even if response is malformed
      const medicinesData = Array.isArray(medicinesRes.data) ? medicinesRes.data : [];
      const suppliersData = Array.isArray(suppliersRes.data) ? suppliersRes.data : [];
      
      console.log('Fetched medicines:', medicinesData.length);
      console.log('Fetched suppliers:', suppliersData.length);
      
      setMedicines(medicinesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to fetch data');
      setMedicines([]);
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const medicineData = {
        ...formData,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        quantity: parseInt(formData.quantity),
        reorderLevel: parseInt(formData.reorderLevel),
        supplierId: parseInt(formData.supplierId),
      };

      if (editingMedicine) {
        await medicineAPI.update(editingMedicine.medicineId, medicineData);
        toast.success('Medicine updated successfully');
      } else {
        await medicineAPI.create(medicineData);
        toast.success('Medicine added successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch {
      toast.error('Failed to save medicine');
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      category: medicine.category,
      costPrice: medicine.costPrice.toString(),
      sellingPrice: medicine.sellingPrice.toString(),
      quantity: medicine.quantity.toString(),
      expiryDate: medicine.expiryDate,
      reorderLevel: medicine.reorderLevel.toString(),
      supplierId: medicine.supplierId.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineAPI.delete(id);
        toast.success('Medicine deleted successfully');
        fetchData();
      } catch {
        toast.error('Failed to delete medicine');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      costPrice: '',
      sellingPrice: '',
      quantity: '',
      expiryDate: '',
      reorderLevel: '',
      supplierId: '',
    });
    setEditingMedicine(null);
  };

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.quantity === 0) return { status: 'OUT_OF_STOCK', color: 'destructive' };
    if (medicine.quantity <= medicine.reorderLevel) return { status: 'LOW', color: 'secondary' };
    return { status: 'NORMAL', color: 'default' };
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medicines</h1>
          <p className="text-muted-foreground">Manage your medicine inventory</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </DialogTitle>
              <DialogDescription>
                {editingMedicine ? 'Update the medicine details.' : 'Add a new medicine to your inventory.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierId">Supplier</Label>
                  <Select value={formData.supplierId} onValueChange={(value) => setFormData({ ...formData, supplierId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers && suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                          <SelectItem key={supplier.supplierId} value={supplier.supplierId.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      ) : null}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMedicine ? 'Update' : 'Add'} Medicine
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medicine Inventory</CardTitle>
          <CardDescription>
            Total {medicines.length} medicines in stock
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines && medicines.length > 0 ? (
                medicines.map((medicine) => {
                  const stockStatus = getStockStatus(medicine);
                  const expired = isExpired(medicine.expiryDate);
                  
                  return (
                    <TableRow key={medicine.medicineId}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell>{medicine.supplierName || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{medicine.quantity}</span>
                          {medicine.quantity <= medicine.reorderLevel && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>${medicine.costPrice.toFixed(2)}</TableCell>
                      <TableCell>${medicine.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{new Date(medicine.expiryDate).toLocaleDateString()}</span>
                          {expired && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.color as "default" | "secondary" | "destructive" | "outline"}>
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(medicine)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(medicine.medicineId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No medicines found
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
