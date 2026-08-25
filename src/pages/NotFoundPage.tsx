import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <h1 className="text-8xl font-bold text-gray-200">404</h1>
            <h2 className="text-2xl font-bold">Page not found</h2>
            <p className="text-gray-400 text-sm">The page you are looking for doesn't exist or has been moved.</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
    );
}