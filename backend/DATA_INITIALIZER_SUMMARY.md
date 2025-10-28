# DataInitializer Update Summary

## Overview
Updated `DataInitializer.java` to initialize comprehensive sample data for all models in the pharmacy management system.

## Data Initialized

### 1. **Users** (5 users)
- **Admin User** - admin@pharmacy.com / admin123
- **Pharmacist User** - pharmacist@pharmacy.com / pharma123
- **Cashier User** - cashier@pharmacy.com / cashier123
- **Dr. John Doe** (Pharmacist) - john@pharmacy.com / password123
- **Jane Smith** (Cashier) - jane@pharmacy.com / password123

### 2. **Suppliers** (5 suppliers)
- MediPharma Inc.
- HealthCare Supplies Ltd.
- Global Pharma Solutions
- QuickMed Distributors
- BioHealth Pharmaceuticals

Each with contact information and email addresses.

### 3. **Medicines** (20 medicines)
Distributed across multiple categories:

#### Pain Relief (4 medicines)
- Paracetamol 500mg
- Ibuprofen 400mg
- Aspirin 100mg
- Diclofenac 50mg

#### Antibiotics (3 medicines)
- Amoxicillin 500mg
- Azithromycin 250mg
- Ciprofloxacin 500mg

#### Cardiovascular (2 medicines)
- Atorvastatin 20mg
- Lisinopril 10mg

#### Diabetes (2 medicines)
- Metformin 500mg
- Insulin Glargine 100 units/ml

#### Respiratory (3 medicines)
- Cetirizine 10mg
- Salbutamol Inhaler
- Montelukast 10mg

#### Gastrointestinal (2 medicines)
- Omeprazole 20mg
- Loperamide 2mg

#### Vitamins (4 medicines)
- Vitamin C 1000mg
- Vitamin D3 5000 IU
- Multivitamin Complex
- Calcium + Vitamin D

Each medicine includes:
- Cost price and selling price
- Current stock quantity
- Expiry date (1-3 years from now)
- Reorder level
- Associated supplier

### 4. **Purchases** (15 records)
Historical purchase data spanning the last 3 months:
- Various quantities purchased
- Different dates and times
- Linked to medicines and suppliers
- Total costs calculated

### 5. **Sales** (20 records)
Sales transaction history from the last month:
- Distributed across different users (cashiers and pharmacists)
- Various quantities sold
- Timestamps from last month to today
- Automatic profit calculation
- Total amounts calculated based on selling prices

## Key Features

### Smart Initialization
- Only runs if tables are empty
- Prevents duplicate data
- Logs progress for each step

### Realistic Data
- Proper relationships between entities
- Realistic pricing and quantities
- Time-distributed transactions
- Variety of medicine categories

### Helper Methods
- `createMedicine()` - Simplifies medicine creation
- `createPurchase()` - Handles purchase record creation
- `createSale()` - Manages sales with automatic profit calculation

## Data Relationships

```
Suppliers (5)
    ↓
Medicines (20) - Each linked to one supplier
    ↓
Purchases (15) - Each linked to medicine and supplier
    ↓
Sales (20) - Each linked to medicine and user
    ↑
Users (5)
```

## Testing the Data

After restarting the backend, the database will be populated with:
- Ready-to-use demo accounts
- Realistic inventory data
- Historical transaction records
- Data suitable for reports and analytics

## Benefits

1. **Immediate Testing** - No need to manually create test data
2. **Realistic Scenarios** - Data reflects real pharmacy operations
3. **Complete Coverage** - All models have sufficient sample data
4. **Report Testing** - Enough data for meaningful reports
5. **UI Testing** - Frontend can display varied data

## Next Steps

1. Restart the Spring Boot backend
2. Database will auto-populate on first run
3. Login with any demo account
4. Explore all features with pre-populated data

## Note

The initializer checks if data already exists before inserting, so it's safe to restart the application multiple times. To reset data, delete the database file and restart.
