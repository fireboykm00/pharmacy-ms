import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Medicines } from '@/pages/Medicines';
import { Sales } from '@/pages/Sales';
import { Suppliers } from '@/pages/Suppliers';
import { Purchases } from '@/pages/Purchases';
import { Reports } from '@/pages/Reports';
import { Users } from '@/pages/Users';
import { Unauthorized } from '@/pages/Unauthorized';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes with Navbar */}
            <Route path="/*" element={
              <div className="flex">
                <Navbar />
                <main className="flex-1 ml-64 p-6">
                  <Routes>
                    {/* Dashboard - All authenticated users */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute roles={['ADMIN', 'PHARMACIST', 'CASHIER']}>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Medicines - All roles can view, Admin/Pharmacist can manage */}
                    <Route
                      path="/medicines"
                      element={
                        <ProtectedRoute roles={['ADMIN', 'PHARMACIST', 'CASHIER']}>
                          <Medicines />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Sales - All roles can access */}
                    <Route
                      path="/sales"
                      element={
                        <ProtectedRoute roles={['ADMIN', 'PHARMACIST', 'CASHIER']}>
                          <Sales />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Suppliers - Admin and Pharmacist only */}
                    <Route
                      path="/suppliers"
                      element={
                        <ProtectedRoute roles={['ADMIN', 'PHARMACIST']}>
                          <Suppliers />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Purchases - Admin and Pharmacist only */}
                    <Route
                      path="/purchases"
                      element={
                        <ProtectedRoute roles={['ADMIN', 'PHARMACIST']}>
                          <Purchases />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Reports - Admin and Pharmacist only */}
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute roles={['ADMIN', 'PHARMACIST']}>
                          <Reports />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Users - Admin only */}
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute roles={['ADMIN']}>
                          <Users />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            } />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
