import { useEffect, useState } from 'react';
import { getSellerOrdersApi, updateOrderStatusApi } from '@/api/order.api';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
    id:         number;
    totalPrice: number;
    status:     string;
    product:    { id: number; title: string; } | null;
    buyer:      { id: number; username: string; } | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending:   { label: 'Pending',   className: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};

const TABS = [
    { label: 'All',       value: 'all' },
    { label: 'Pending',   value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
];

export default function IncomingOrdersPage() {
    const [orders, setOrders]       = useState<Order[]>([]);
    const [loading, setLoading]     = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await getSellerOrdersApi();
                setOrders(result.data);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: number, status: 'confirmed' | 'cancelled') => {
        try {
            await updateOrderStatusApi(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            toast.success(status === 'confirmed' ? 'Order confirmed!' : 'Order cancelled');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update order');
        }
    };

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(o => o.status === activeTab);

    const pendingCount = orders.filter(o => o.status === 'pending').length;

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold">Incoming Orders</h1>
                {pendingCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-medium">
                        {pendingCount} pending
                    </span>
                )}
            </div>

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

            {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <ShoppingBag size={48} className="text-gray-200" />
                    <h2 className="text-xl font-bold">No orders yet</h2>
                    <p className="text-gray-400 text-sm">Orders will appear here when buyers purchase your products</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredOrders.map(order => {
                        const status = statusConfig[order.status] || { label: order.status, className: 'bg-gray-100 text-gray-700' };
                        return (
                            <div key={order.id} className={`border rounded-lg p-4 flex gap-4 items-center ${
                                order.status === 'pending' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                            }`}>
                                <div className="flex-1">
                                    <h3 className="font-medium">{order.product?.title}</h3>
                                    <p className="text-sm text-gray-500">by @{order.buyer?.username}</p>
                                    <p className="text-sm font-bold mt-1">€{order.totalPrice}</p>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${status.className}`}>
                                    {status.label}
                                </span>
                                {order.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'confirmed')}>
                                            Confirm
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleStatusUpdate(order.id, 'cancelled')}>
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}