import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getProductByIdApi } from '@/api/product.api';
import { createOrderApi } from '@/api/order.api';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
    id:          number;
    title:       string;
    price:       number;
    description: string | null;
    images:      { url: string; isPrimary: boolean; }[];
    seller:      { id: number; username: string; } | null;
}

export default function CheckoutPage() {
    const { id }                  = useParams();
    const navigate                = useNavigate();
    const [product, setProduct]   = useState<Product | null>(null);
    const [loading, setLoading]   = useState(true);
    const [ordering, setOrdering] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProductByIdApi(Number(id));
                setProduct(result.data);
            } catch {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleConfirm = async () => {
        setOrdering(true);
        try {
            await createOrderApi(Number(id));
            toast.success('Order placed successfully!');
            navigate('/orders/my');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Something went wrong');
            setOrdering(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
    if (!product) return null;

    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-2xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left — Product */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Order Summary</h2>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="aspect-square bg-gray-100">
                            {primaryImage ? (
                                <img
                                    src={`${import.meta.env.VITE_BASE_URL}${primaryImage.url}`}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No image
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">by @{product.seller?.username}</p>
                            {product.description && (
                                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{product.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right — Payment */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Payment Details</h2>

                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Item price</span>
                            <span>€{product.price}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-3 pb-3 border-b border-gray-100">
                            <span className="text-gray-500">Shipping</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>€{product.price}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button onClick={handleConfirm} disabled={ordering} className="w-full">
                            {ordering ? 'Processing...' : 'Confirm Order'}
                        </Button>
                        <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
                            Cancel
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs">
                        <ShieldCheck size={14} />
                        <span>Secure transaction</span>
                    </div>
                </div>
            </div>
        </div>
    );
}