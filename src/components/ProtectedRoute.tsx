import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuth } = useAuthStore();

    if (!isAuth()) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}