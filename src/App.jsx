// src/App.jsx — Complete routing and context wiring for NearCart
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { ToastProvider } from './components/Toast.jsx';

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx';
import CustomerLayout from './layouts/CustomerLayout.jsx';
import OwnerLayout from './layouts/OwnerLayout.jsx';
import DeliveryLayout from './layouts/DeliveryLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Guards
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Shared / Auth Pages
import LandingPage from './pages/auth/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import NotificationsPage from './pages/auth/NotificationsPage.jsx';
import NotFoundPage from './pages/auth/NotFoundPage.jsx';
import UnauthorizedPage from './pages/auth/UnauthorizedPage.jsx';

// Customer Pages
import LocationGate from './pages/customer/LocationGate.jsx';
import HomePage from './pages/customer/HomePage.jsx';
import StorePage from './pages/customer/StorePage.jsx';
import SearchPage from './pages/customer/SearchPage.jsx';
import ProductDetailPage from './pages/customer/ProductDetailPage.jsx';
import CartPage from './pages/customer/CartPage.jsx';
import CheckoutPage from './pages/customer/CheckoutPage.jsx';
import OrderTrackingPage from './pages/customer/OrderTrackingPage.jsx';
import OrderHistoryPage from './pages/customer/OrderHistoryPage.jsx';
import ProfilePage from './pages/customer/ProfilePage.jsx';
import AutoBookingPage from './pages/customer/AutoBookingPage.jsx';
import PharmacyPrescriptionPage from './pages/customer/PharmacyPrescriptionPage.jsx';

// Owner Pages
import OwnerRegistration from './pages/owner/OwnerRegistration.jsx';
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';
import OwnerProducts from './pages/owner/OwnerProducts.jsx';
import OwnerOrders from './pages/owner/OwnerOrders.jsx';
import OwnerOffers from './pages/owner/OwnerOffers.jsx';
import OwnerStoreSettings from './pages/owner/OwnerStoreSettings.jsx';
import OwnerReviewsEarnings from './pages/owner/OwnerReviewsEarnings.jsx';

// Delivery Pages
import DeliveryRegistration from './pages/delivery/DeliveryRegistration.jsx';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard.jsx';
import DeliveryRequest from './pages/delivery/DeliveryRequest.jsx';
import ActiveDelivery from './pages/delivery/ActiveDelivery.jsx';
import DeliveryHistory from './pages/delivery/DeliveryHistory.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminApprovals from './pages/admin/AdminApprovals.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminDisputes from './pages/admin/AdminDisputes.jsx';
import AdminFraud from './pages/admin/AdminFraud.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <OrderProvider>
              <ToastProvider>
                <Routes>
                  {/* Pure Desktop Auth Pages */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Public and Auth Pages */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/owner/register" element={<OwnerRegistration />} />
                    <Route path="/delivery/register" element={<DeliveryRegistration />} />
                    <Route path="/delivery/request" element={<DeliveryRequest />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  {/* Customer App Shell */}
                  <Route path="/customer" element={<CustomerLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="location" element={<LocationGate />} />
                    <Route path="store/:storeId" element={<StorePage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="product/:productId" element={<ProductDetailPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="orders" element={<OrderHistoryPage />} />
                    <Route path="orders/:orderId" element={<OrderTrackingPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="auto-booking" element={<AutoBookingPage />} />
                    <Route path="pharmacy-prescription" element={<PharmacyPrescriptionPage />} />
                  </Route>

                  {/* Shop Owner Dashboard */}
                  <Route
                    path="/owner"
                    element={
                      <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <OwnerLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<OwnerDashboard />} />
                    <Route path="orders" element={<OwnerOrders />} />
                    <Route path="products" element={<OwnerProducts />} />
                    <Route path="offers" element={<OwnerOffers />} />
                    <Route path="store" element={<OwnerStoreSettings />} />
                    <Route path="reviews" element={<OwnerReviewsEarnings />} />
                    <Route path="earnings" element={<OwnerReviewsEarnings />} />
                  </Route>

                  {/* Delivery Partner Portal */}
                  <Route
                    path="/delivery"
                    element={
                      <ProtectedRoute allowedRoles={['delivery', 'admin']}>
                        <DeliveryLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DeliveryDashboard />} />
                    <Route path="active" element={<ActiveDelivery />} />
                    <Route path="history" element={<DeliveryHistory />} />
                    <Route path="earnings" element={<DeliveryHistory />} />
                  </Route>

                  {/* Platform Admin Portal */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="approvals" element={<AdminApprovals />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="disputes" element={<AdminDisputes />} />
                    <Route path="fraud" element={<AdminFraud />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </ToastProvider>
            </OrderProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
