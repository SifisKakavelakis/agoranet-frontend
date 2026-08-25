import { useEffect, useState } from 'react';
import { getMyOrdersApi, cancelOrderApi } from '@/api/order.api';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Star } from 'lucide-react';
import ReviewModal from '@/components/ReviewModal';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Order {
    id:         number;
    totalPrice: number;
    status:     string;
    product: {
        id:     number;
        title:  string;
        price:  number;
        images: { url: string; isPrimary: boolean; }[];
    } | null;
    buyer: {
        id:       number;
        username: string;
    } | null;
    seller: {
        id:       number;
        username: string;
    } | null;
}

const TABS = [
    { label: 'All',         value: 'all' },
    { label: 'In Progress', value: 'pending' },
    { label: 'Completed',   value: 'confirmed' },
    { label: 'Cancelled',   value: 'cancelled' },
];

const statusConfig: Record<string, { label: string; className: string }> = {
    pending:   { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Completed',   className: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled',   className: 'bg-red-100 text-red-700' },
};

export default function MyOrdersPage() {
    const [orders, setOrders]               = useState<Order[]>([]);
    const [loading, setLoading]             = useState(true);
    const [activeTab, setActiveTab]         = useState('all');
    const [reviewOrder, setReviewOrder]     = useState<Order | null>(null);
    const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
    const navigate                          = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await getMyOrdersApi();
                setOrders(result.data.reverse());
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleCancel = async () => {
        if (!cancelOrderId) return;
        try {
            await cancelOrderApi(cancelOrderId);
            setOrders(prev => prev.map(o => o.id === cancelOrderId ? { ...o, status: 'cancelled' } : o));
            toast.success('Order cancelled successfully');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelOrderId(null);
        }
    };

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(o => o.status === activeTab);

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {TABS.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.value
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-500 hover:text-black'
                        }`}
                    >
                        {tab.label}
                        {tab.value !== 'all' && (
                            <span className="ml-1 text-xs text-gray-400">
                                ({orders.filter(o => o.status === tab.value).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders */}
            {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <ShoppingBag size={48} className="text-gray-200" />
                    <h2 className="text-xl font-bold">No orders yet</h2>
                    <p className="text-gray-400 text-sm">When you buy something, it'll be listed here</p>
                    <Button onClick={() => navigate('/')}>Browse Products</Button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredOrders.map(order => {
                        const primaryImage = order.product?.images.find(img => img.isPrimary) || order.product?.images[0];
                        const status = statusConfig[order.status] || { label: order.status, className: 'bg-gray-100 text-gray-700' };
                        return (
                            <div key={order.id} className="border border-gray-200 rounded-lg p-4 flex gap-4 items-center hover:shadow-sm transition-shadow">
                                <Link to={`/products/${order.product?.id}`} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {primaryImage ? (
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}${primaryImage.url}`}
                                            alt={order.product?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                            No image
                                        </div>
                                    )}
                                </Link>

                                <div className="flex-1">
                                    <Link to={`/products/${order.product?.id}`} className="font-medium hover:underline">
                                        {order.product?.title}
                                    </Link>
                                    <p className="text-lg font-bold mt-1">€{order.totalPrice}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.className}`}>
                                        {status.label}
                                    </span>
                                    {order.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setCancelOrderId(order.id)}
                                            className="text-red-500 border-red-200 hover:bg-red-50"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                    {order.status === 'confirmed' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setReviewOrder(order)}
                                            className="flex items-center gap-1 text-yellow-500 border-yellow-200 hover:bg-yellow-50"
                                        >
                                            <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                            Review
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Cancel Dialog */}
            <AlertDialog open={!!cancelOrderId} onOpenChange={() => setCancelOrderId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Order</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel} className="bg-red-500 hover:bg-red-600">
                            Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Review Modal */}
            {reviewOrder && (
                <ReviewModal
                    orderId={reviewOrder.id}
                    sellerUsername={reviewOrder.seller?.username || ''}
                    open={!!reviewOrder}
                    onClose={() => setReviewOrder(null)}
                    onSuccess={() => {
                        setReviewOrder(null);
                        toast.success('Review submitted successfully!');
                    }}
                />
            )}
        </div>
    );
}