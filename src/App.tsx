import { Routes, Route } from 'react-router';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProductDetailPage from '@/pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import EditProfilePage from './pages/EditProfilePage';
import WishlistPage from './pages/WishlistPage';
import MyProductsPage from './pages/seller/MyProductsPage';
import IncomingOrdersPage from './pages/seller/IncomingOrdersPage';
import ProductFormPage from './pages/seller/ProductFormPage';
import { getMeApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import BecomeSellerPage from './pages/BecomeSellerPage';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

function App() {
    const { token, setAuth, logout } = useAuthStore();

    useEffect(() => {
        if (token) {
            getMeApi()
                .then(res => setAuth(res.data, token))
                .catch(() => {});
        }
    }, []);

    useEffect(() => {
        if (!token) return;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiresAt = payload.exp * 1000;
            const timeLeft = expiresAt - Date.now();

            if (timeLeft <= 0) {
                logout();
                return;
            }

            const timer = setTimeout(() => {
                logout();
                toast.error('Your session has expired. Please login again.', {
                    duration: Infinity,
                    id: 'session-expired',
                });
            }, timeLeft);

            return () => clearTimeout(timer);
        } catch {
            logout();
        }
    }, [token]);

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/profile/:username" element={<ProfilePage />} />
                    <Route path="/checkout/:id" element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/orders/my" element={
                        <ProtectedRoute>
                            <MyOrdersPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile/:username/edit" element={
                        <ProtectedRoute>
                            <EditProfilePage />
                        </ProtectedRoute>
                    } />
                    <Route path="/wishlist" element={
                        <ProtectedRoute>
                            <WishlistPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <MyProductsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard/orders" element={
                        <ProtectedRoute>
                            <IncomingOrdersPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard/products/new" element={
                        <ProtectedRoute>
                            <ProductFormPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard/products/:id/edit" element={
                        <ProtectedRoute>
                            <ProductFormPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/become-seller" element={
                        <ProtectedRoute>
                            <BecomeSellerPage />
                        </ProtectedRoute>
                    } />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Toaster
                position="top-center"
                richColors
            />
        </>
    );
}

export default App;