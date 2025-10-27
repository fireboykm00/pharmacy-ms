# Pharmacy Management System

A comprehensive pharmacy sales and stock management system built with Spring Boot (backend) and React (frontend).

## 🏗️ Architecture

- **Backend**: Spring Boot 3.2 with Java 17
- **Frontend**: React 19.1.1 with TypeScript
- **Database**: H2 In-Memory Database
- **Authentication**: JWT-based with role-based access control (RBAC)
- **UI**: shadcn/ui components with TailwindCSS

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Admin, Pharmacist, Cashier)
- Protected routes and API endpoints
- CORS configuration

### 💊 Medicine Management
- Add, edit, delete medicines
- Stock tracking with low stock alerts
- Expiry date monitoring
- Category management
- Supplier association

### 🛒 Sales Processing
- Process sales transactions
- Automatic stock deduction
- Profit calculation
- Sales history and analytics
- Daily/monthly revenue tracking

### 📦 Purchase Management
- Record purchases from suppliers
- Automatic stock addition
- Purchase history tracking
- Cost management

### 👥 User Management (Admin only)
- Create and manage user accounts
- Role assignment (Admin, Pharmacist, Cashier)
- User activity tracking

### 📊 Reporting & Analytics
- Stock status reports
- Expiry reports
- Sales analytics
- Profit and revenue tracking
- Low stock alerts

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- Node.js 18 or higher
- pnpm (recommended) or npm

### Option 1: Using the Run Script (Recommended)
```bash
# Clone and navigate to the project
cd pharmacy-ms

# Make the run script executable (Linux/Mac)
chmod +x run.sh

# Run the application (automatically stops existing services)
./run.sh
```

### Option 2: Using Terminal Launcher
```bash
# Opens services in separate terminal windows
./run-terminals.sh
```

### Option 3: Stop Existing Services First
```bash
# Stop any running services on ports 8080/5173
./stop-services.sh

# Then start fresh
./run.sh
```

### Option 4: Manual Start

#### Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
```

#### Frontend (Terminal 2)
```bash
cd frontend
pnpm install
pnpm dev
```

## 🌐 Access Points

Once running, access the application at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **H2 Database Console**: http://localhost:8080/h2-console

### H2 Database Connection
- **JDBC URL**: `jdbc:h2:mem:pharmacydb`
- **Username**: `sa`
- **Password**: `password`

## 👤 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pharmacy.com | admin123 |
| Pharmacist | pharmacist@pharmacy.com | pharma123 |
| Cashier | cashier@pharmacy.com | cashier123 |

## 📋 Role Permissions

### Admin
- Full access to all features
- User management
- System configuration
- All reports and analytics

### Pharmacist
- Medicine management
- Sales processing
- Purchase management
- Reports and analytics
- No user management

### Cashier
- View medicines
- Process sales
- View sales history
- Limited reports

## 🛠️ Development

### Backend Development
```bash
cd backend
mvn compile          # Compile the project
mvn test            # Run tests
mvn spring-boot:run # Start the server
```

### Frontend Development
```bash
cd frontend
pnpm install        # Install dependencies
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm test          # Run tests
```

## 📁 Project Structure

```
pharmacy-ms/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/pharmacy/
│   │   │   │   ├── config/      # Security and JWT config
│   │   │   │   ├── controller/  # REST controllers
│   │   │   │   ├── dto/         # Data transfer objects
│   │   │   │   ├── exception/   # Exception handlers
│   │   │   │   ├── model/       # JPA entities
│   │   │   │   ├── repository/  # JPA repositories
│   │   │   │   └── service/     # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── lib/             # Utilities
│   ├── package.json
│   └── vite.config.ts
├── run.sh                  # Main startup script with port cleanup
├── run-separate.sh         # Simple terminal launcher
├── run-terminals.sh        # Advanced multi-terminal launcher
├── stop-services.sh        # Stop all running services
└── README.md
```

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Database Configuration
spring.datasource.url=jdbc:h2:mem:pharmacydb
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true

# JWT Configuration
jwt.secret=pharmacyManagementSecretKey2024!@#$%^&*()
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration
- API base URL: `http://localhost:8080/api`
- Development server: `http://localhost:5173`

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
pnpm test
```

## 📦 Build & Deployment

### Backend Build
```bash
cd backend
mvn clean package
```

### Frontend Build
```bash
cd frontend
pnpm build
```

The frontend build artifacts will be in the `dist/` directory.

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Medicines
- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/{id}` - Update medicine
- `DELETE /api/medicines/{id}` - Delete medicine

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create new sale
- `GET /api/sales/date-range` - Get sales by date range
- `GET /api/sales/summary` - Get sales summary

### Purchases
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create new purchase
- `GET /api/purchases/date-range` - Get purchases by date range

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Add new supplier
- `PUT /api/suppliers/{id}` - Update supplier
- `DELETE /api/suppliers/{id}` - Delete supplier

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Reports
- `GET /api/reports/stock` - Stock report
- `GET /api/reports/expiry` - Expiry report
- `GET /api/reports/expiring/{days}` - Expiring soon report

## 🐛 Troubleshooting

### Common Issues

1. **Backend fails to start**
   - Check Java version (requires Java 17+)
   - Verify Maven installation
   - Check port 8080 availability

2. **Frontend fails to start**
   - Check Node.js version (requires Node 18+)
   - Verify pnpm installation
   - Check port 5173 availability

3. **Login fails with 403 error**
   - Verify backend is running
   - Check CORS configuration
   - Ensure correct login credentials

4. **Database connection issues**
   - H2 console is available at http://localhost:8080/h2-console
   - Use JDBC URL: `jdbc:h2:mem:pharmacydb`
   - Username: `sa`, Password: `password`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ for pharmacy management**
