import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
    const { isAuth } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth()) {
            navigate('/profile');
        }
    }, []);

    if (isAuth()) return null;

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-2 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="/" className="flex items-center gap-2 text-2xl font-bold">
                        AgoraNet
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center min-h-0">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="/login.jpg"
                    alt="Login"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </div>
    );
}