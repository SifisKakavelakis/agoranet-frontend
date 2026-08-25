import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { becomeSellerApi } from '@/api/user.api';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BecomeSellerPage() {
    const { user, setAuth, token } = useAuthStore();
    const navigate                  = useNavigate();
    const [loading, setLoading]     = useState(false);

    const isMissingInfo = !user?.phoneNumber;

    const handleBecomeSeller = async () => {
        setLoading(true);
        try {
            const result = await becomeSellerApi();
            setAuth(result.data, token!);
            toast.success('You are now a seller!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto px-6 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Become a Seller</h1>
            <p className="text-gray-500 mb-8">
                Start selling your items on AgoraNet today!
            </p>

            {isMissingInfo ? (
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                        Before becoming a seller, you need to complete your profile:
                    </p>
                    <ul className="text-sm text-left flex flex-col gap-2 mb-6">
                        <li className={`flex items-center gap-2 ${user?.phoneNumber ? 'text-green-600' : 'text-red-500'}`}>
                            {user?.phoneNumber ? '✅' : '❌'} Phone Number
                        </li>
                    </ul>
                    <Button onClick={() => navigate(`/profile/${user?.username}/edit?redirect=/become-seller`)}>
                        Complete Profile
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <Button onClick={handleBecomeSeller} disabled={loading}>
                        {loading ? 'Processing...' : 'Become a Seller'}
                    </Button>
                </div>
            )}
        </div>
    );
}